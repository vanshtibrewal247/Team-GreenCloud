import React from 'react';
import { Award, TrendingDown, TrendingUp, AlertTriangle } from 'lucide-react';
import { SimSummary } from '../../sim/types';

interface ResultsHeaderProps {
  baselineSummary: SimSummary;
  targetSummary: SimSummary;
}

export const ResultsHeader: React.FC<ResultsHeaderProps> = ({
  baselineSummary,
  targetSummary,
}) => {
  const carbonDiff = targetSummary.totalCarbonKg - baselineSummary.totalCarbonKg;
  const carbonPct = ((carbonDiff / (baselineSummary.totalCarbonKg || 1)) * 100);
  const queueDiff = targetSummary.avgQueueGb - baselineSummary.avgQueueGb;
  const queuePct = ((queueDiff / (baselineSummary.avgQueueGb || 1)) * 100);

  const isCarbonLower = carbonDiff < 0;

  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <div className="p-4 sm:p-5 rounded-3xl bg-slate-900 dark:bg-slate-900 border border-slate-800 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <Award className="w-4 h-4" /> Simulation Completed
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
              {targetSummary.numSlots} Slots ({targetSummary.slotLengthHours}h step)
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
            {targetSummary.algorithm} vs {baselineSummary.algorithm}
          </h2>
          <p className="text-xs text-slate-400">
            Replay across {targetSummary.totalProcessedGb.toLocaleString()} GB total workload
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Carbon Differential Badge */}
          <div className={`p-3 rounded-2xl border flex items-center gap-2.5 ${
            isCarbonLower
              ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300'
              : 'bg-amber-950/60 border-amber-500/50 text-amber-300'
          }`}>
            {isCarbonLower ? (
              <TrendingDown className="w-5 h-5 text-emerald-400 shrink-0" />
            ) : (
              <TrendingUp className="w-5 h-5 text-amber-400 shrink-0" />
            )}
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400">
                Operational Carbon
              </p>
              <p className="text-base font-black font-mono">
                {isCarbonLower ? '' : '+'}{carbonPct.toFixed(1)}% ({Math.abs(carbonDiff).toFixed(1)} kg)
              </p>
            </div>
          </div>

          {/* Queue Differential Badge */}
          <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700 text-slate-200">
            <p className="text-[10px] uppercase font-bold text-slate-400">
              Avg Queue
            </p>
            <p className="text-base font-black font-mono">
              {queuePct > 0 ? '+' : ''}{queuePct.toFixed(1)}% ({targetSummary.avgQueueGb.toFixed(1)} GB)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
