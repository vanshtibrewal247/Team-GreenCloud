import React from 'react';
import { Loader2, Activity, Cpu, CheckCircle } from 'lucide-react';

interface SimulationProgressModalProps {
  isOpen: boolean;
  stageText: string;
  percent: number;
}

export const SimulationProgressModal: React.FC<SimulationProgressModalProps> = ({
  isOpen,
  stageText,
  percent,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-7 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <Loader2 className="w-5 h-5 animate-spin" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Running Simulation
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Browser-based slot replay of empirical dataset
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-slate-700 dark:text-slate-300 truncate mr-2">
              {stageText || 'Processing simulation steps...'}
            </span>
            <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold shrink-0">
              {percent}%
            </span>
          </div>

          <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-300 ease-out"
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>

        <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60 flex items-center gap-2 text-[11px] text-slate-600 dark:text-slate-400">
          <Cpu className="w-4 h-4 text-emerald-500 shrink-0" />
          <span>Chunked asynchronous execution preserves browser UI responsiveness.</span>
        </div>
      </div>
    </div>
  );
};
