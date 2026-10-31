"""
FastAPI inference service for Forecast-Driven Carbon-Aware Edge-Cloud Scheduling.

Run the notebook first so ml_artifacts/inference_bundle.joblib exists.
Start with:
    uvicorn ml_service:app --host 0.0.0.0 --port 8000
"""
from __future__ import annotations

import os
from pathlib import Path
from typing import Any, Dict, List, Optional

import joblib
import numpy as np
import pandas as pd
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

BUNDLE_CANDIDATES = [
    Path(os.getenv("ML_BUNDLE_PATH", "")),
    Path("ml_artifacts/inference_bundle.joblib"),
    Path(__file__).resolve().parent / "ml_artifacts" / "inference_bundle.joblib",
    Path(__file__).resolve().parent.parent / "ml_artifacts" / "inference_bundle.joblib",
]
BUNDLE_PATH = next((p for p in BUNDLE_CANDIDATES if p.is_file()), None)
if BUNDLE_PATH is None:
    raise FileNotFoundError(
        "Model bundle not found. Run 'python scripts/generate_forecasts.py' or the Jupyter notebook export cell first."
    )

BUNDLE = joblib.load(BUNDLE_PATH)
DURATION_MODELS = BUNDLE["duration_models"]
CARBON_MODELS = BUNDLE["carbon_models"]
DURATION_FEATURES = BUNDLE["duration_features"]
CARBON_FEATURES = BUNDLE["carbon_features"]
CARBON_HISTORY = BUNDLE["carbon_history"].copy()
SCHED = BUNDLE["scheduler"]
LSTM_MODEL = BUNDLE.get("lstm_model")
LSTM_MODEL_PATH = BUNDLE.get("lstm_model_path")
if LSTM_MODEL is None and LSTM_MODEL_PATH and Path(LSTM_MODEL_PATH).exists():
    try:
        import tensorflow as tf
        LSTM_MODEL = tf.keras.models.load_model(LSTM_MODEL_PATH)
    except Exception as exc:
        raise RuntimeError(f"Could not load the saved LSTM model: {exc}") from exc
LSTM_SCALERS = BUNDLE.get("lstm_scalers", {})
LSTM_WINDOW = int(BUNDLE.get("lstm_window", 12))
MODEL_OPTIONS = BUNDLE.get("model_options", [])

app = FastAPI(
    title="Carbon-Aware Edge-Cloud ML API",
    version="1.0.0",
    description="Select a forecasting model and run the edge/cloud placement prototype."
)

# Set CORS_ORIGINS to your deployed frontend origin(s), comma-separated.
# Example: CORS_ORIGINS=https://your-frontend.vercel.app,http://localhost:5173
cors_origins = [
    origin.strip()
    for origin in os.getenv("CORS_ORIGINS", "http://localhost:5173").split(",")
    if origin.strip()
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

class SimulationRequest(BaseModel):
    model: str = Field(default="random_forest")
    policy: str = Field(default="proposed_weighted")
    max_tasks: int = Field(default=500, ge=1, le=10000)
    tasks: Optional[List[Dict[str, Any]]] = None

def normalize_region(value: Any) -> str:
    return str(value or "").strip().lower().replace(" ", "_")

def safe_float(value: Any, default: float) -> float:
    try:
        if value is None or pd.isna(value):
            return float(default)
        return float(value)
    except (TypeError, ValueError):
        return float(default)

def forecast_carbon(region: str, model_name: str) -> float:
    region = normalize_region(region)
    hist = CARBON_HISTORY[CARBON_HISTORY["region"] == region].sort_values("carbon_timestamp_utc")
    vals = hist["carbon_intensity"].dropna().to_numpy(dtype=float)
    if len(vals) == 0:
        return float("nan")
    if len(vals) < 7:
        return float(vals[-1])

    if model_name == "lstm":
        scaler = LSTM_SCALERS.get(region)
        if LSTM_MODEL is None or scaler is None or len(vals) < LSTM_WINDOW:
            return float(vals[-1])
        x = scaler.transform(vals[-LSTM_WINDOW:].reshape(-1, 1)).astype("float32")
        pred_scaled = float(LSTM_MODEL.predict(x.reshape(1, LSTM_WINDOW, 1), verbose=0)[0, 0])
        return max(0.0, float(scaler.inverse_transform([[pred_scaled]])[0, 0]))

    model = CARBON_MODELS.get(model_name)
    if model is None:
        raise ValueError(f"Carbon model '{model_name}' is unavailable.")
    delta = hist["carbon_timestamp_utc"].diff().dropna().median()
    next_ts = hist["carbon_timestamp_utc"].iloc[-1] + delta
    if pd.isna(next_ts):
        next_ts = hist["carbon_timestamp_utc"].iloc[-1]
    row = {
        "region": region,
        "lag_1": vals[-1], "lag_2": vals[-2], "lag_3": vals[-3], "lag_6": vals[-6],
        "rolling_mean_3": float(np.mean(vals[-3:])),
        "rolling_std_3": float(np.std(vals[-3:], ddof=1)),
        "hour": int(next_ts.hour), "day_of_week": int(next_ts.dayofweek), "month": int(next_ts.month)
    }
    pred = float(model.predict(pd.DataFrame([row])[CARBON_FEATURES])[0])
    return max(0.0, pred)

def estimate_power(cpu_demand: float, idle_w: float, full_w: float) -> float:
    scale = max(float(SCHED["cpu_demand_scale"]), 1.0)
    utilization_proxy = float(np.clip(cpu_demand / scale, 0.0, 1.0))
    return idle_w + (full_w - idle_w) * utilization_proxy

def score_candidate(duration: float, power_w: float, carbon_intensity: float, deadline: float) -> Dict[str, Any]:
    energy_kwh = power_w * max(duration, 0.0) / 3_600_000.0
    co2_g = energy_kwh * carbon_intensity
    latency_norm = max(duration, 0.0) / max(deadline, 1.0)
    carbon_norm = co2_g / 100.0
    energy_norm = energy_kwh / 0.01
    deadline_miss = duration > deadline
    score = (
        float(SCHED["weight_carbon"]) * carbon_norm
        + float(SCHED["weight_latency"]) * latency_norm
        + float(SCHED["weight_energy"]) * energy_norm
        + float(SCHED["deadline_penalty"]) * float(deadline_miss)
    )
    return {
        "duration_sec": float(duration),
        "power_w": float(power_w),
        "energy_kwh": float(energy_kwh),
        "estimated_co2_g": float(co2_g),
        "deadline_miss": bool(deadline_miss),
        "score": float(score)
    }

def run_simulation(req: SimulationRequest) -> Dict[str, Any]:
    model_name = req.model.strip().lower()
    policy = req.policy.strip().lower()
    if model_name not in CARBON_MODELS:
        raise ValueError(f"Model '{model_name}' unavailable. Available models: {sorted(CARBON_MODELS)}")
    duration_key = "random_forest" if model_name == "lstm" else model_name
    if duration_key not in DURATION_MODELS:
        raise ValueError(f"Duration model for '{model_name}' unavailable.")
    allowed_policies = {"proposed_weighted", "edge_first", "lowest_carbon", "lowest_energy"}
    if policy not in allowed_policies:
        raise ValueError(f"Unknown policy. Choose from: {sorted(allowed_policies)}")

    if req.tasks is None:
        raise ValueError("Provide a 'tasks' array. The API does not silently run training/test data.")
    task_df = pd.DataFrame(req.tasks).head(req.max_tasks)
    if task_df.empty:
        raise ValueError("The tasks array is empty.")

    X = task_df.reindex(columns=DURATION_FEATURES)
    durations = np.maximum(0.0, DURATION_MODELS[duration_key].predict(X))
    decisions = []

    for i, (_, task) in enumerate(task_df.iterrows()):
        local_region = normalize_region(task.get("device_region", ""))
        cloud_region = normalize_region(task.get("cloud_region", "california"))
        local_carbon = forecast_carbon(local_region, model_name)
        cloud_carbon = forecast_carbon(cloud_region, model_name)

        if not np.isfinite(local_carbon):
            local_carbon = safe_float(task.get("carbon_intensity_local"), 350.0)
        if not np.isfinite(cloud_carbon):
            cloud_carbon = safe_float(task.get("carbon_intensity_cloud"), 350.0)

        cpu = safe_float(task.get("cpu_demand"), 0.0)
        gpu = safe_float(task.get("gpu_demand"), 0.0)
        deadline = safe_float(task.get("delay_tolerance_sec"), float("inf"))
        candidates: Dict[str, Dict[str, Any]] = {}

        if gpu <= 0 or int(SCHED["edge_gpu_cards"]) > 0:
            p = estimate_power(cpu, float(SCHED["edge_idle_w"]), float(SCHED["edge_full_w"]))
            candidates["edge"] = score_candidate(float(durations[i]), p, local_carbon, deadline)
        if gpu <= 0 or int(SCHED["cloud_gpu_cards"]) > 0:
            p = estimate_power(cpu, float(SCHED["cloud_idle_w"]), float(SCHED["cloud_full_w"]))
            candidates["cloud"] = score_candidate(float(durations[i]), p, cloud_carbon, deadline)

        if not candidates:
            placement, chosen = "no_feasible_candidate", {}
        elif policy == "edge_first":
            placement = "edge" if "edge" in candidates else "cloud"
            chosen = candidates[placement]
        elif policy == "lowest_carbon":
            placement = min(candidates, key=lambda k: candidates[k]["estimated_co2_g"])
            chosen = candidates[placement]
        elif policy == "lowest_energy":
            placement = min(candidates, key=lambda k: candidates[k]["energy_kwh"])
            chosen = candidates[placement]
        else:
            placement = min(candidates, key=lambda k: candidates[k]["score"])
            chosen = candidates[placement]

        decisions.append({
            "task_id": str(task.get("task_id", i)),
            "placement": placement,
            "predicted_duration_sec": float(durations[i]),
            "deadline_sec": None if not np.isfinite(deadline) else deadline,
            "local_carbon_forecast": float(local_carbon),
            "cloud_carbon_forecast": float(cloud_carbon),
            "estimated_energy_kwh": float(chosen.get("energy_kwh", 0.0)),
            "estimated_co2_g": float(chosen.get("estimated_co2_g", 0.0)),
            "deadline_miss_predicted": bool(chosen.get("deadline_miss", False)),
            "scheduler_score": float(chosen.get("score", 0.0))
        })

    valid = [d for d in decisions if d["placement"] in {"edge", "cloud"}]
    placement_counts: Dict[str, int] = {}
    for d in decisions:
        placement_counts[d["placement"]] = placement_counts.get(d["placement"], 0) + 1

    return {
        "model": model_name,
        "duration_model": duration_key,
        "carbon_model": model_name,
        "policy": policy,
        "tasks_submitted": len(decisions),
        "tasks_scheduled": len(valid),
        "placement_counts": placement_counts,
        "total_estimated_energy_kwh": sum(d["estimated_energy_kwh"] for d in valid),
        "total_estimated_co2_g": sum(d["estimated_co2_g"] for d in valid),
        "predicted_deadline_miss_rate": (
            sum(1 for d in valid if d["deadline_miss_predicted"]) / len(valid) if valid else None
        ),
        "mean_predicted_duration_sec": (
            sum(d["predicted_duration_sec"] for d in valid) / len(valid) if valid else None
        ),
        "decisions": decisions
    }

@app.get("/health")
def health():
    return {"status": "ok", "bundle_loaded": True}

@app.get("/models")
def models():
    return {
        "models": MODEL_OPTIONS,
        "available_model_ids": sorted(CARBON_MODELS.keys()),
        "policies": ["proposed_weighted", "edge_first", "lowest_carbon", "lowest_energy"]
    }

@app.get("/schema")
def schema():
    return {
        "task_features_required_for_prediction": DURATION_FEATURES,
        "optional_task_fields_used_by_scheduler": [
            "task_id", "device_region", "cloud_region", "cpu_demand",
            "gpu_demand", "delay_tolerance_sec",
            "carbon_intensity_local", "carbon_intensity_cloud"
        ]
    }

@app.post("/simulate")
def simulate(request: SimulationRequest):
    try:
        return run_simulation(request)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
