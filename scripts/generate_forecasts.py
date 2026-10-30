"""
generate_forecasts.py

Generates 1-step-ahead ML forecasts for regional carbon intensity and workload arrivals
based on the machine learning models defined in:
  Machine-Learning/forecast_driven_carbon_aware_edge_cloud_ml_v2.ipynb

Augments /src/data/trace.json with:
  - hourly_predicted_carbon_intensity: number[] for each city and cloud
  - hourly_predicted_arrivals_gb: number[] for each city
"""

import os
import sys
import json
import numpy as np
import pandas as pd
from sklearn.ensemble import GradientBoostingRegressor

def build_lag_features(series, is_carbon=True):
    df = pd.DataFrame({'val': series})
    for lag in [1, 2, 3, 6, 24]:
        df[f'lag_{lag}'] = df['val'].shift(lag)
    df['rolling_mean_3'] = df['val'].shift(1).rolling(3, min_periods=1).mean()
    if is_carbon:
        df['rolling_std_3'] = df['val'].shift(1).rolling(3, min_periods=1).std().fillna(0)
    df['hour'] = [i % 24 for i in range(len(series))]
    df['day_of_week'] = [(i // 24) % 7 for i in range(len(series))]
    return df

def train_and_forecast_series(series, is_carbon=True):
    n = len(series)
    feat_df = build_lag_features(series, is_carbon=is_carbon)
    feat_cols = [c for c in feat_df.columns if c != 'val']
    
    # Forward/backward fill feature NaNs for the first few rows
    feat_filled = feat_df[feat_cols].bfill().ffill()
    
    # Target is next step: target[t] = series[t+1]
    targets = np.roll(series, -1)
    targets[-1] = series[-1]
    
    # Chronological 80% train split
    train_len = max(24, int(n * 0.8))
    X_train = feat_filled.iloc[:train_len].values
    y_train = targets[:train_len]
    X_all = feat_filled.values
    
    model = GradientBoostingRegressor(n_estimators=40, max_depth=4, learning_rate=0.08, random_state=42)
    model.fit(X_train, y_train)
    preds = model.predict(X_all)
    
    if not is_carbon:
        preds = np.clip(preds, 0, None)
    else:
        preds = np.clip(preds, 40, 1000)
        
    return preds.tolist()

def main():
    trace_path = os.path.join(os.path.dirname(__file__), "..", "ProjectApplication", "src", "data", "trace.json")
    if not os.path.exists(trace_path):
        raise FileNotFoundError(f"trace.json not found at {trace_path}")
        
    print(f"Loading {trace_path}...", flush=True)
    with open(trace_path, 'r', encoding='utf-8') as f:
        trace = json.load(f)
        
    print("Generating forecasts for 9 edge cities...", flush=True)
    carbon_errors = []
    workload_errors = []
    
    for city_obj in trace['cities']:
        city_name = city_obj['city']
        ci_actual = city_obj['hourly_carbon_intensity']
        arr_actual = city_obj['hourly_arrivals_gb']
        
        ci_pred = train_and_forecast_series(ci_actual, is_carbon=True)
        arr_pred = train_and_forecast_series(arr_actual, is_carbon=False)
        
        city_obj['hourly_predicted_carbon_intensity'] = [round(float(x), 2) for x in ci_pred]
        city_obj['hourly_predicted_arrivals_gb'] = [round(float(x), 4) for x in arr_pred]
        
        ci_mae = float(np.mean(np.abs(np.array(ci_actual[1:]) - np.array(ci_pred[:-1]))))
        arr_mae = float(np.mean(np.abs(np.array(arr_actual[1:]) - np.array(arr_pred[:-1]))))
        carbon_errors.append(ci_mae)
        workload_errors.append(arr_mae)
        print(f"  {city_name:15s} | Carbon MAE: {ci_mae:.2f} gCO2/kWh | Arrival MAE: {arr_mae:.2f} GB", flush=True)
        
    # Cloud
    print("Generating forecasts for California Cloud...", flush=True)
    cloud_ci_actual = trace['cloud']['hourly_carbon_intensity']
    cloud_ci_pred = train_and_forecast_series(cloud_ci_actual, is_carbon=True)
    trace['cloud']['hourly_predicted_carbon_intensity'] = [round(float(x), 2) for x in cloud_ci_pred]
    
    trace['ml_metadata'] = {
        'model_name': 'GradientBoostingRegressor (1-step-ahead lag forecast)',
        'features': ['lag_1', 'lag_2', 'lag_3', 'lag_6', 'lag_24', 'rolling_mean_3', 'hour', 'day_of_week'],
        'mean_carbon_mae': round(float(np.mean(carbon_errors)), 2),
        'mean_workload_mae': round(float(np.mean(workload_errors)), 2),
        'description': 'Trained on 80% chronological split from master_dataset. Generates 1-step-ahead predictions for predictive task offloading.'
    }
    
    print(f"Mean Carbon MAE across cities: {np.mean(carbon_errors):.2f} gCO2/kWh", flush=True)
    print(f"Mean Workload MAE across cities: {np.mean(workload_errors):.2f} GB", flush=True)
    
    print(f"Saving updated trace to {trace_path}...", flush=True)
    with open(trace_path, 'w', encoding='utf-8') as f:
        json.dump(trace, f, indent=2)
        
    print("Forecast generation complete!", flush=True)

if __name__ == '__main__':
    main()
