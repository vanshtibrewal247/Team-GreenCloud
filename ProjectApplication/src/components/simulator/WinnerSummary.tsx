import React from 'react';
import { AlertTriangle, BookOpen, ExternalLink, Info, CheckCircle2 } from 'lucide-react';
import { SimConfig, SimSummary } from '../../sim/types';

interface WinnerSummaryProps {
  config: SimConfig;
  baselineSummary: SimSummary;
  targetSummary: SimSummary;
  isDefaultSettings: boolean;
  onExploreResearch: () => void;
}

export const WinnerSummary: React.FC<WinnerSummaryProps> = ({
  config,
  baselineSummary,
  targetSummary,
  isDefaultSettings,
  onExploreResearch,
}) => {
  return (
    <div className="space-y-4">
      {/* Required Disclaimer Banner */}
      <div className="p-4 sm:p-5 rounded-3xl bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-200 space-y-2">
        <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-amber-700 dark:text-amber-400">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>Simulation Methodology & Implementation Notice</span>
        </div>
        <p className="text-xs sm:text-sm leading-relaxed">
          Results come from a re-implementation of the paper's DWPA on your dataset. Parameters tagged 'assumed' are not from the paper or the dataset. Counterparts are approximations. Results may differ from the paper's figures.
        </p>
      </div>

      {/* Relation to Paper Note (Shown only when default settings are used) */}
      {isDefaultSettings && (
        <div className="p-4 sm:p-5 rounded-3xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 space-y-2">
          <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            <Info className="w-4 h-4 shrink-0" />
            <span>How these results relate to the paper</span>
          </div>
          <p className="text-xs sm:text-sm leading-relaxed text-slate-600 dark:text-slate-300">
            How these results relate to the paper: the paper finds ICSOC-19 has the lowest carbon, DOLA-22 the highest, and Local-First better than Vertical-Only. On this dataset the order differs because regional carbon intensity varies only about +/-20% and the cloud (California) is cleaner than most edge cities. The setup, data and parameters also differ from the paper's.
          </p>
        </div>
      )}

      {/* Link to Research Page */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-900 dark:text-white">
              IEEE WCNC 2026 Reference Paper
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              "Dynamic Carbon-Aware Hybrid Task Offloading for Collaborative Edge-Cloud Computing"
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onExploreResearch}
          className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-all shrink-0"
        >
          <span>Explore Research</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
