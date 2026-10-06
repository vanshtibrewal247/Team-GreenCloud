import React from 'react';
import { AlgorithmId } from '../../types/simulation';
import { ALGORITHMS } from '../../services/carbonService';
import { Play, Sparkles, Scale, Check, ArrowRightLeft } from 'lucide-react';

interface ModelSelectorProps {
  model1: AlgorithmId;
  model2: AlgorithmId;
  onModel1Change: (model: AlgorithmId) => void;
  onModel2Change: (model: AlgorithmId) => void;
  onRunComparison: () => void;
  isSimulating: boolean;
}

export const ModelSelector: React.FC<ModelSelectorProps> = ({
  model1,
  model2,
  onModel1Change,
  onModel2Change,
  onRunComparison,
  isSimulating,
}) => {
  const algoKeys = Object.keys(ALGORITHMS) as AlgorithmId[];
  const m1Info = ALGORITHMS[model1];
  const m2Info = ALGORITHMS[model2];

  const handleSwap = () => {
    const temp = model1;
    onModel1Change(model2);
    onModel2Change(temp);
  };

  return (
    <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm">
      <div className="text-center max-w-2xl mx-auto mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-carbon-50 dark:bg-carbon-950/60 text-carbon-700 dark:text-carbon-300 border border-carbon-200/60 dark:border-carbon-800/60 mb-2">
          <Scale className="w-3.5 h-3.5 text-carbon-500" />
          <span>Algorithmic Benchmark Testbed</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Compare Offloading Strategies
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Compare two algorithms under the exact same infrastructure topology, network latency profiles, and workload intensity.
        </p>
      </div>

      {/* Side-by-Side Model Cards */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch mb-8">
        {/* MODEL 1 */}
        <div className="md:col-span-5 rounded-3xl p-6 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex flex-col justify-between relative transition-all">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Baseline Strategy
              </span>
              <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                MODEL 1
              </span>
            </div>

            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Select Algorithm
            </label>
            <select
              value={model1}
              onChange={(e) => onModel1Change(e.target.value as AlgorithmId)}
              className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-carbon-500 shadow-sm"
            >
              {algoKeys.map((key) => (
                <option key={key} value={key}>
                  {ALGORITHMS[key].name} {ALGORITHMS[key].isProposed ? '★ (Proposed)' : ''}
                </option>
              ))}
            </select>

            {/* Algorithm Description & Traits */}
            <div className="mt-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 dark:text-white">
                  {m1Info.name}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                  {m1Info.badge}
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {m1Info.description}
              </p>
              <div className="pt-1 flex items-center justify-between text-[11px] font-mono text-slate-400 border-t border-slate-100 dark:border-slate-800">
                <span>Focus: {m1Info.primaryObjective}</span>
                <span>{m1Info.complexity}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Swap Button / Divider */}
        <div className="md:col-span-2 flex items-center justify-center">
          <button
            type="button"
            onClick={handleSwap}
            className="p-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-carbon-600 dark:hover:text-carbon-400 hover:scale-110 transition-all shadow-md"
            title="Swap Model 1 and Model 2"
          >
            <ArrowRightLeft className="w-5 h-5" />
          </button>
        </div>

        {/* MODEL 2 */}
        <div className="md:col-span-5 rounded-3xl p-6 bg-gradient-to-b from-carbon-50/50 to-emerald-50/20 dark:from-slate-950 dark:to-carbon-950/20 border-2 border-carbon-500/50 dark:border-carbon-500/40 flex flex-col justify-between relative transition-all shadow-md">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-carbon-700 dark:text-carbon-300 flex items-center gap-1">
                <span>Evaluation Target</span>
                {m2Info.isProposed && <Sparkles className="w-3.5 h-3.5 text-carbon-500" />}
              </span>
              <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-carbon-100 dark:bg-carbon-900/60 text-carbon-800 dark:text-carbon-300 border border-carbon-200 dark:border-carbon-800">
                MODEL 2
              </span>
            </div>

            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Select Algorithm
            </label>
            <select
              value={model2}
              onChange={(e) => onModel2Change(e.target.value as AlgorithmId)}
              className="w-full px-3.5 py-2.5 rounded-2xl border border-carbon-300 dark:border-carbon-700 bg-white dark:bg-slate-900 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-carbon-500 shadow-sm"
            >
              {algoKeys.map((key) => (
                <option key={key} value={key}>
                  {ALGORITHMS[key].name} {ALGORITHMS[key].isProposed ? '★ (Proposed)' : ''}
                </option>
              ))}
            </select>

            {/* Algorithm Description & Traits */}
            <div className="mt-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-carbon-200/80 dark:border-carbon-800/80 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <span>{m2Info.name}</span>
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-carbon-100 dark:bg-carbon-900/60 text-carbon-700 dark:text-carbon-300 font-semibold">
                  {m2Info.badge}
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {m2Info.description}
              </p>
              <div className="pt-1 flex items-center justify-between text-[11px] font-mono text-carbon-600 dark:text-carbon-400 border-t border-slate-100 dark:border-slate-800">
                <span>Focus: {m2Info.primaryObjective}</span>
                <span>{m2Info.complexity}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Large Run Comparison Button */}
      <div className="text-center pt-2">
        <button
          type="button"
          onClick={onRunComparison}
          disabled={isSimulating}
          className={`inline-flex items-center justify-center gap-3 px-10 py-4 rounded-2xl font-bold text-base text-white transition-all shadow-xl ${
            isSimulating
              ? 'bg-slate-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-carbon-600 via-emerald-600 to-teal-600 hover:from-carbon-700 hover:to-teal-700 shadow-carbon-600/30 hover:scale-105 active:scale-95'
          }`}
        >
          <Play className="w-5 h-5 fill-white" />
          <span>{isSimulating ? 'Simulation in Progress...' : 'Run Comparison Simulation'}</span>
        </button>
        <p className="text-xs text-slate-400 mt-2 font-mono">
          Triggers multi-stage EdgeCloudSim evaluation pipeline with live trace inspection
        </p>
      </div>
    </div>
  );
};
