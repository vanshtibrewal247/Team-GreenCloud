/**
 * mlService.ts
 * Client service to communicate with the FastAPI ML inference service (scripts/ml_service.py).
 * Provides health checks, available model discovery, and remote placement simulation.
 */

export interface MLModelOption {
  id: string;
  label: string;
  duration_model: string;
  carbon_model: string;
}

export interface MLModelsResponse {
  models: MLModelOption[];
  available_model_ids: string[];
  policies: string[];
}

export interface MLDecision {
  task_id: string;
  placement: 'edge' | 'cloud' | string;
  predicted_duration_sec: number;
  deadline_sec: number | null;
  local_carbon_forecast: number;
  cloud_carbon_forecast: number;
  estimated_energy_kwh: number;
  estimated_co2_g: number;
  deadline_miss_predicted: boolean;
  scheduler_score: number;
}

export interface MLSimulationResult {
  model: string;
  duration_model: string;
  carbon_model: string;
  policy: string;
  tasks_submitted: number;
  tasks_scheduled: number;
  placement_counts: Record<string, number>;
  total_estimated_energy_kwh: number;
  total_estimated_co2_g: number;
  predicted_deadline_miss_rate: number | null;
  mean_predicted_duration_sec: number | null;
  decisions: MLDecision[];
}

const DEFAULT_API_BASE = 'http://localhost:8000';

export class MLService {
  private static baseUrl =
    (typeof import.meta !== 'undefined' &&
      (import.meta as unknown as { env?: Record<string, string | undefined> })?.env
        ?.VITE_ML_SERVICE_URL) ||
    DEFAULT_API_BASE;

  /**
   * Check if the FastAPI ml_service is online and has its bundle loaded.
   */
  public static async checkHealth(timeoutMs = 1500): Promise<{ online: boolean; bundleLoaded: boolean }> {
    try {
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), timeoutMs);

      const resp = await fetch(`${this.baseUrl}/health`, {
        signal: controller.signal,
        headers: { Accept: 'application/json' },
      });
      clearTimeout(id);

      if (!resp.ok) return { online: false, bundleLoaded: false };
      const data = await resp.json();
      return { online: true, bundleLoaded: Boolean(data.bundle_loaded) };
    } catch {
      return { online: false, bundleLoaded: false };
    }
  }

  /**
   * Query the available models and scheduling policies from FastAPI.
   */
  public static async getModels(timeoutMs = 2000): Promise<MLModelsResponse | null> {
    try {
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), timeoutMs);

      const resp = await fetch(`${this.baseUrl}/models`, {
        signal: controller.signal,
        headers: { Accept: 'application/json' },
      });
      clearTimeout(id);

      if (!resp.ok) return null;
      return (await resp.json()) as MLModelsResponse;
    } catch {
      return null;
    }
  }

  /**
   * Run simulation through the FastAPI inference service.
   */
  public static async simulate(
    model = 'random_forest',
    policy = 'proposed_weighted',
    maxTasks = 200,
    tasks?: Array<Record<string, unknown>>
  ): Promise<MLSimulationResult | null> {
    try {
      const resp = await fetch(`${this.baseUrl}/simulate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model,
          policy,
          max_tasks: maxTasks,
          tasks,
        }),
      });

      if (!resp.ok) {
        throw new Error(`ML Service responded with HTTP ${resp.status}`);
      }
      return (await resp.json()) as MLSimulationResult;
    } catch (err) {
      console.warn('ML Service simulation failed:', err);
      return null;
    }
  }
}
