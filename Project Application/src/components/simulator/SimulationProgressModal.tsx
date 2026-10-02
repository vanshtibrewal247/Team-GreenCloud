import React from 'react';
import { Cpu, Activity, Zap, CheckCircle2 } from 'lucide-react';

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
      <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl text-center space-y-6">
        {/* Animated Icon Ring */}
        <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-4 border-slate-100 dark:border-slate-800" />
          <div
            className="absolute inset-0 rounded-full border-4 border-carbon-500 border-t-transparent animate-spin"
            style={{ animationDuration: '1.2s' }}
          />
          <div className="w-12 h-12 rounded-2xl bg-carbon-50 dark:bg-carbon-950/60 text-carbon-600 dark:text-carbon-400 flex items-center justify-center">
            {percent >= 90 ? (
              <CheckCircle2 className="w-6 h-6 animate-bounce" />
            ) : percent >= 50 ? (
              <Zap className="w-6 h-6 animate-pulse" />
            ) : (
              <Cpu className="w-6 h-6 animate-pulse" />
            )}
          </div>
        </div>

        {/* Text */}
        <div className="space-y-1.5">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            Running Simulation Benchmark
          </h3>
          <p className="text-xs font-mono text-carbon-600 dark:text-carbon-400 min-h-[20px] font-semibold">
            {stageText || 'Preparing simulation...'}
          </p>
        </div>

        {/* Progress bar */}
        <div className="space-y-2">
          <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden p-0.5">
            <div
              className="bg-gradient-to-r from-carbon-500 to-emerald-400 h-full rounded-full transition-all duration-300"
              style={{ width: `${percent}%` }}
            />
          </div>
          <div className="flex justify-between text-[11px] font-mono text-slate-400">
            <span>Stage Progress</span>
            <span className="font-bold text-slate-700 dark:text-slate-300">{percent}%</span>
          </div>
        </div>

        <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 text-[11px] text-slate-500 text-left space-y-1">
          <div className="flex items-center gap-1.5">
            <span className={`w-1.5 h-1.5 rounded-full ${percent > 20 ? 'bg-emerald-500' : 'bg-slate-300'}`} />
            <span>Parsing topology graphs & bandwidth latencies</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className={`w-1.5 h-1.5 rounded-full ${percent > 50 ? 'bg-emerald-500' : 'bg-slate-300'}`} />
            <span>Forecasting multi-horizon grid carbon intensity</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className={`w-1.5 h-1.5 rounded-full ${percent > 80 ? 'bg-emerald-500' : 'bg-slate-300'}`} />
            <span>Computing Pareto frontier tradeoffs</span>
          </div>
        </div>
      </div>
    </div>
  );
};
