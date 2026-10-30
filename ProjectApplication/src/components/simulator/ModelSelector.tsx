import { ArrowLeftRight, Play, Loader2, Sparkles, Scale, RotateCcw } from 'lucide-react';
import { AlgorithmType, ALGORITHM_REGISTRY } from '../../sim';

interface ModelSelectorProps {
  baselineAlgorithm: AlgorithmType;
  targetAlgorithm: AlgorithmType;
  onBaselineChange: (alg: AlgorithmType) => void;
  onTargetChange: (alg: AlgorithmType) => void;
  onSwap: () => void;
  onRunSimulation: () => void;
  onReset: () => void;
  isSimulating: boolean;
}

const ALGORITHMS: AlgorithmType[] = [
  'DWPA',
  'Forecast-Driven',
  'Local-First',
  'Vertical-Only',
  'Horizontal-First',
  'ICSOC-19',
  'DOLA-22',
  'YCL-24',
];

export const ModelSelector: React.FC<ModelSelectorProps> = ({
  baselineAlgorithm,
  targetAlgorithm,
  onBaselineChange,
  onTargetChange,
  onSwap,
  onRunSimulation,
  onReset,
  isSimulating,
}) => {
  const baseInfo = ALGORITHM_REGISTRY[baselineAlgorithm];
  const targetInfo = ALGORITHM_REGISTRY[targetAlgorithm];

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
          Evaluate two algorithms simultaneously over the exact same multi-region infrastructure and empirical carbon trace.
        </p>
      </div>

      {/* Selector Cards Container */}
      <div className="relative grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6 items-stretch">
        {/* Baseline Card */}
        <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-sm hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Baseline Strategy
              </span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                Model 1
              </span>
            </div>

            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Select Algorithm
            </label>
            <select
              value={baselineAlgorithm}
              onChange={e => onBaselineChange(e.target.value as AlgorithmType)}
              className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-semibold text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
            >
              {ALGORITHMS.map(alg => (
                <option key={alg} value={alg}>
                  {ALGORITHM_REGISTRY[alg].name}
                </option>
              ))}
            </select>

            <div className="mt-3.5 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 min-h-[5.5rem] flex flex-col justify-between">
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {baseInfo.description}
              </p>
              {baseInfo.approximate && (
                <p className="text-[10px] text-amber-600 dark:text-amber-400 italic mt-1.5 font-medium">
                  * Approximation based on the paper's description
                </p>
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
        <div className="rounded-3xl bg-white dark:bg-slate-900 border-2 border-emerald-500/40 dark:border-emerald-500/30 p-5 sm:p-6 shadow-sm hover:border-emerald-500 transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> Evaluation Target
              </span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                Model 2
              </span>
            </div>

            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Select Algorithm
            </label>
            <select
              value={targetAlgorithm}
              onChange={e => onTargetChange(e.target.value as AlgorithmType)}
              className="w-full px-3.5 py-2.5 rounded-2xl border border-emerald-300 dark:border-emerald-700 bg-emerald-50/30 dark:bg-emerald-950/20 font-semibold text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
            >
              {ALGORITHMS.map(alg => (
                <option key={alg} value={alg}>
                  {ALGORITHM_REGISTRY[alg].name}
                </option>
              ))}
            </select>

            <div className="mt-3.5 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 min-h-[5.5rem] flex flex-col justify-between">
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {targetInfo.description}
              </p>
              {targetInfo.approximate && (
                <p className="text-[10px] text-amber-600 dark:text-amber-400 italic mt-1.5 font-medium">
                  * Approximation based on the paper's description
                </p>
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
