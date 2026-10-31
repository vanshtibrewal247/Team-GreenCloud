import React, { useState, useEffect } from 'react';
import {
  ArrowLeftRight,
  Play,
  Loader2,
  Sparkles,
  Scale,
  RotateCcw,
  Zap,
  Brain,
  Server,
  HelpCircle,
} from 'lucide-react';
import { AlgorithmType, ALGORITHM_REGISTRY } from '../../sim';
import { MLService } from '../../services/mlService';

export type ModelParadigm = 'reactive' | 'forecast';

export const REACTIVE_ALGORITHMS: AlgorithmType[] = [
  'DWPA',
  'Local-First',
  'Vertical-Only',
  'Horizontal-First',
  'ICSOC-19',
  'DOLA-22',
  'YCL-24',
];

export interface ForecastModelOption {
  id: string;
  name: string;
  shortName: string;
  type: string;
  description: string;
}

export const FORECAST_MODELS: ForecastModelOption[] = [
  {
    id: 'random_forest',
    name: 'Forecast-Driven: Random Forest ★ (Proposed Default)',
    shortName: 'Random Forest',
    type: 'Ensemble Regressor',
    description: '120 trees, max depth 18. 1-step-ahead regional carbon forecasting from web_ready notebook.',
  },
  {
    id: 'hist_gradient_boosting',
    name: 'Forecast-Driven: HistGradientBoosting',
    shortName: 'HistGradientBoosting',
    type: 'Histogram Boosting',
    description: 'Histogram-based gradient boosting for fast tabular inference with native missing-value support.',
  },
  {
    id: 'xgboost',
    name: 'Forecast-Driven: XGBoost Benchmark',
    shortName: 'XGBoost',
    type: 'Extreme Gradient Boosting',
    description: 'Regularized gradient boosted decision trees benchmarking duration and carbon forecasting.',
  },
  {
    id: 'lstm',
    name: 'Forecast-Driven: LSTM Sequence Model',
    shortName: 'LSTM',
    type: 'Recurrent Neural Net',
    description: '12-step lookback recurrent neural network for multi-region grid carbon timeseries.',
  },
];

interface ModelSelectorProps {
  baselineAlgorithm: AlgorithmType;
  targetAlgorithm: AlgorithmType;
  onBaselineChange: (alg: AlgorithmType) => void;
  onTargetChange: (alg: AlgorithmType) => void;
  onSwap: () => void;
  onRunSimulation: () => void;
  onReset: () => void;
  isSimulating: boolean;
  baselineMLModel?: string;
  targetMLModel?: string;
  onBaselineMLModelChange?: (model: string) => void;
  onTargetMLModelChange?: (model: string) => void;
  selectedMLModel?: string;
  onMLModelChange?: (model: string) => void;
}

export const ModelSelector: React.FC<ModelSelectorProps> = ({
  baselineAlgorithm,
  targetAlgorithm,
  onBaselineChange,
  onTargetChange,
  onSwap,
  onRunSimulation,
  onReset,
  isSimulating,
  baselineMLModel = 'random_forest',
  targetMLModel = 'random_forest',
  onBaselineMLModelChange,
  onTargetMLModelChange,
  selectedMLModel,
  onMLModelChange,
}) => {
  const [mlServiceOnline, setMlServiceOnline] = useState<boolean | null>(null);
  const [showApiInfo, setShowApiInfo] = useState(false);

  // Active ML models with fallback support
  const activeBaseML = baselineMLModel || selectedMLModel || 'random_forest';
  const activeTargetML = targetMLModel || selectedMLModel || 'random_forest';

  // Check FastAPI ml_service health on mount
  useEffect(() => {
    let isMounted = true;
    MLService.checkHealth(1200)
      .then((status) => {
        if (isMounted) setMlServiceOnline(status.online);
      })
      .catch(() => {
        if (isMounted) setMlServiceOnline(false);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const baseParadigm: ModelParadigm = baselineAlgorithm === 'Forecast-Driven' ? 'forecast' : 'reactive';
  const targetParadigm: ModelParadigm = targetAlgorithm === 'Forecast-Driven' ? 'forecast' : 'reactive';

  const baseInfo = ALGORITHM_REGISTRY[baselineAlgorithm];
  const targetInfo = ALGORITHM_REGISTRY[targetAlgorithm];

  const currentBaseForecastModel =
    FORECAST_MODELS.find((m) => m.id === activeBaseML) || FORECAST_MODELS[0];
  const currentTargetForecastModel =
    FORECAST_MODELS.find((m) => m.id === activeTargetML) || FORECAST_MODELS[0];

  const handleBaseParadigmChange = (p: ModelParadigm) => {
    if (p === 'reactive' && baseParadigm !== 'reactive') {
      onBaselineChange('DWPA');
    } else if (p === 'forecast' && baseParadigm !== 'forecast') {
      onBaselineChange('Forecast-Driven');
    }
  };

  const handleTargetParadigmChange = (p: ModelParadigm) => {
    if (p === 'reactive' && targetParadigm !== 'reactive') {
      onTargetChange('DWPA');
    } else if (p === 'forecast' && targetParadigm !== 'forecast') {
      onTargetChange('Forecast-Driven');
    }
  };

  const handleBaseMLChange = (id: string) => {
    onBaselineMLModelChange?.(id);
    onMLModelChange?.(id);
  };

  const handleTargetMLChange = (id: string) => {
    onTargetMLModelChange?.(id);
    onMLModelChange?.(id);
  };

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto space-y-1.5">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
          <Scale className="w-3.5 h-3.5" />
          <span>Algorithmic Benchmark Testbed</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Compare Offloading Strategies
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          First select whether you want a <strong>Reactive</strong> baseline (7 models) or a <strong>Forecast / ML-Driven</strong> predictive model (4 models), then evaluate both simultaneously.
        </p>

        {/* ML API status banner */}
        <div className="pt-2 flex items-center justify-center gap-2">
          <div
            className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-medium border transition-all ${
              mlServiceOnline
                ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border-emerald-300 dark:border-emerald-800'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
            }`}
          >
            <Server className="w-3.5 h-3.5" />
            <span>
              {mlServiceOnline
                ? '● FastAPI ml_service.py Online (:8000)'
                : '○ In-Browser ML Engine Active (FastAPI offline)'}
            </span>
            <button
              type="button"
              onClick={() => setShowApiInfo(!showApiInfo)}
              className="hover:text-emerald-500 underline ml-1 cursor-pointer flex items-center gap-0.5"
              title="FastAPI integration instructions"
            >
              <HelpCircle className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* API Help Popover */}
        {showApiInfo && (
          <div className="mt-2 p-3.5 rounded-2xl bg-slate-900 text-left text-xs text-slate-300 border border-slate-800 shadow-xl max-w-lg mx-auto space-y-2 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between font-bold text-white border-b border-slate-800 pb-1.5">
              <span>FastAPI Inference Service (scripts/ml_service.py)</span>
              <button
                type="button"
                onClick={() => setShowApiInfo(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            <p className="text-slate-400">
              The project includes a production-grade FastAPI inference API (<code>scripts/ml_service.py</code>) backed by the <code>ml_artifacts/</code> bundle from <code>forecast_driven_carbon_aware_edge_cloud_ml_web_ready.ipynb</code>.
            </p>
            <div className="bg-slate-950 p-2.5 rounded-xl font-mono text-[11px] text-emerald-400 overflow-x-auto">
              uvicorn scripts.ml_service:app --host 0.0.0.0 --port 8000 --reload
            </div>
            <p className="text-[11px] text-slate-400">
              When online, the app can query endpoints <code>/health</code>, <code>/models</code>, and <code>/simulate</code> directly.
            </p>
          </div>
        )}
      </div>

      {/* Selector Cards Container */}
      <div className="relative grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6 items-stretch">
        {/* Baseline Card */}
        <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-sm hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Baseline Strategy
              </span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                Model 1
              </span>
            </div>

            {/* Step 1: Select Paradigm */}
            <div className="mb-3">
              <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                1. Select Paradigm
              </label>
              <div className="grid grid-cols-2 gap-1.5 p-1 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => handleBaseParadigmChange('reactive')}
                  className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-xl text-xs font-bold transition-all ${
                    baseParadigm === 'reactive'
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Zap className="w-3.5 h-3.5 text-amber-500" />
                  <span>Reactive (7)</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleBaseParadigmChange('forecast')}
                  className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-xl text-xs font-bold transition-all ${
                    baseParadigm === 'forecast'
                      ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Brain className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Forecast / ML (4)</span>
                </button>
              </div>
            </div>

            {/* Step 2: Select Specific Algorithm */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                2. Select Algorithm ({baseParadigm === 'reactive' ? '7 Reactive Models' : '4 Forecast/ML Models'})
              </label>

              {baseParadigm === 'reactive' ? (
                <select
                  value={baselineAlgorithm}
                  onChange={(e) => onBaselineChange(e.target.value as AlgorithmType)}
                  className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-semibold text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer dark:[color-scheme:dark]"
                >
                  {REACTIVE_ALGORITHMS.map((alg) => (
                    <option
                      key={alg}
                      value={alg}
                      className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 py-1.5"
                    >
                      {ALGORITHM_REGISTRY[alg].name}
                    </option>
                  ))}
                </select>
              ) : (
                <select
                  value={activeBaseML}
                  onChange={(e) => {
                    onBaselineChange('Forecast-Driven');
                    handleBaseMLChange(e.target.value);
                  }}
                  className="w-full px-3.5 py-2.5 rounded-2xl border border-emerald-300 dark:border-emerald-700 bg-emerald-50/30 dark:bg-emerald-950/20 font-semibold text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer dark:[color-scheme:dark]"
                >
                  {FORECAST_MODELS.map((m) => (
                    <option
                      key={m.id}
                      value={m.id}
                      className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 py-1.5"
                    >
                      {m.name}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Algorithm / Model Description */}
            <div className="mt-3.5 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 min-h-[5.5rem] flex flex-col justify-between">
              {baseParadigm === 'reactive' ? (
                <>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {baseInfo.description}
                  </p>
                  {baseInfo.approximate && (
                    <p className="text-[10px] text-amber-600 dark:text-amber-400 italic mt-1.5 font-medium">
                      * Approximation based on the paper's description
                    </p>
                  )}
                </>
              ) : (
                <>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                      <span>{currentBaseForecastModel.type}</span>
                      <span>web_ready notebook</span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {currentBaseForecastModel.description}
                    </p>
                  </div>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1.5 block">
                    ✓ Evaluates proactive offloading via 1-step-ahead ML forecasts
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Swap Button (Absolute Center on md+, inline on mobile) */}
        <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
          <button
            type="button"
            onClick={onSwap}
            className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg text-slate-600 dark:text-slate-300 hover:text-emerald-500 hover:border-emerald-500 flex items-center justify-center transition-all hover:scale-105"
            title="Swap Baseline and Evaluation Target"
          >
            <ArrowLeftRight className="w-4 h-4" />
          </button>
        </div>

        {/* Evaluation Target Card */}
        <div className="rounded-3xl bg-white dark:bg-slate-900 border-2 border-emerald-500/40 dark:border-emerald-500/30 p-5 sm:p-6 shadow-sm hover:border-emerald-500 transition-all flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> Evaluation Target
              </span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                Model 2
              </span>
            </div>

            {/* Step 1: Select Paradigm */}
            <div className="mb-3">
              <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                1. Select Paradigm
              </label>
              <div className="grid grid-cols-2 gap-1.5 p-1 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60">
                <button
                  type="button"
                  onClick={() => handleTargetParadigmChange('reactive')}
                  className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-xl text-xs font-bold transition-all ${
                    targetParadigm === 'reactive'
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Zap className="w-3.5 h-3.5 text-amber-500" />
                  <span>Reactive (7)</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleTargetParadigmChange('forecast')}
                  className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-xl text-xs font-bold transition-all ${
                    targetParadigm === 'forecast'
                      ? 'bg-emerald-500 text-white shadow-sm'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Brain className="w-3.5 h-3.5 fill-current" />
                  <span>Forecast / ML (4)</span>
                </button>
              </div>
            </div>

            {/* Step 2: Select Specific Algorithm */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                2. Select Algorithm ({targetParadigm === 'reactive' ? '7 Reactive Models' : '4 Forecast/ML Models'})
              </label>

              {targetParadigm === 'reactive' ? (
                <select
                  value={targetAlgorithm}
                  onChange={(e) => onTargetChange(e.target.value as AlgorithmType)}
                  className="w-full px-3.5 py-2.5 rounded-2xl border border-emerald-300 dark:border-emerald-700 bg-emerald-50/30 dark:bg-emerald-950/20 font-semibold text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer dark:[color-scheme:dark]"
                >
                  {REACTIVE_ALGORITHMS.map((alg) => (
                    <option
                      key={alg}
                      value={alg}
                      className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 py-1.5"
                    >
                      {ALGORITHM_REGISTRY[alg].name}
                    </option>
                  ))}
                </select>
              ) : (
                <select
                  value={activeTargetML}
                  onChange={(e) => {
                    onTargetChange('Forecast-Driven');
                    handleTargetMLChange(e.target.value);
                  }}
                  className="w-full px-3.5 py-2.5 rounded-2xl border border-emerald-300 dark:border-emerald-700 bg-emerald-50/30 dark:bg-emerald-950/20 font-semibold text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer dark:[color-scheme:dark]"
                >
                  {FORECAST_MODELS.map((m) => (
                    <option
                      key={m.id}
                      value={m.id}
                      className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 py-1.5"
                    >
                      {m.name}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Algorithm / Model Description */}
            <div className="mt-3.5 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 min-h-[5.5rem] flex flex-col justify-between">
              {targetParadigm === 'reactive' ? (
                <>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {targetInfo.description}
                  </p>
                  {targetInfo.approximate && (
                    <p className="text-[10px] text-amber-600 dark:text-amber-400 italic mt-1.5 font-medium">
                      * Approximation based on the paper's description
                    </p>
                  )}
                </>
              ) : (
                <>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                      <span>{currentTargetForecastModel.type}</span>
                      <span>web_ready notebook</span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {currentTargetForecastModel.description}
                    </p>
                  </div>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1.5 block">
                    ★ Proposed predictive offloading via 1-step-ahead ML forecasts
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Simulation Execution Bar */}
      <div className="flex flex-col items-center justify-center gap-2 pt-2">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onReset}
            disabled={isSimulating}
            className="flex items-center gap-1.5 px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 font-semibold text-sm transition-all disabled:opacity-50"
            title="Reset configuration to default calibrated values"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset</span>
          </button>

          <button
            type="button"
            onClick={onRunSimulation}
            disabled={isSimulating}
            className="flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold text-base shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isSimulating ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Running Simulation...</span>
              </>
            ) : (
              <>
                <Play className="w-5 h-5 fill-current" />
                <span>Run Comparison Simulation</span>
              </>
            )}
          </button>
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400 text-center">
          Runs in your browser: slot-based replay of the dataset.
        </p>
      </div>
    </div>
  );
};
