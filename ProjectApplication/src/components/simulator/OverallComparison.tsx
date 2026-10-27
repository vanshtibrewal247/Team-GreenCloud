import React from 'react';
import { Leaf, Layers, Activity, Zap, Server, Cloud } from 'lucide-react';
import { SimSummary } from '../../sim/types';

interface OverallComparisonProps {
  baselineSummary: SimSummary;
  targetSummary: SimSummary;
}

export const OverallComparison: React.FC<OverallComparisonProps> = ({
  baselineSummary,
  targetSummary,
}) => {
  const b = baselineSummary;
  const t = targetSummary;

  const carbonDiff = t.totalCarbonKg - b.totalCarbonKg;
  const carbonPct = ((carbonDiff / (b.totalCarbonKg || 1)) * 100);

  const queueDiff = t.avgQueueGb - b.avgQueueGb;
  const queuePct = ((queueDiff / (b.avgQueueGb || 1)) * 100);

  // Compute total peer sent and cloud sent
  let bPeer = 0, bCloud = 0;
  let tPeer = 0, tCloud = 0;
  for (const nm of Object.values(b.nodeMetrics)) {
    bPeer += nm.peerSentGb;
    bCloud += nm.cloudSentGb;
  }
  for (const nm of Object.values(t.nodeMetrics)) {
    tPeer += nm.peerSentGb;
    tCloud += nm.cloudSentGb;
  }

  const kpis = [
    {
      title: 'Total Carbon Emissions',
      unit: 'kg CO₂',
      icon: Leaf,
      iconColor: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/60',
      baselineVal: b.totalCarbonKg.toFixed(2),
      targetVal: t.totalCarbonKg.toFixed(2),
      diff: `${carbonPct > 0 ? '+' : ''}${carbonPct.toFixed(1)}%`,
      diffGood: carbonPct < 0,
      subtext: 'Operational compute & wireless transmit carbon',
    },
    {
      title: 'Carbon per GB Processed',
      unit: 'gCO₂ / GB',
      icon: Zap,
      iconColor: 'text-amber-500 bg-amber-50 dark:bg-amber-950/60',
      baselineVal: b.carbonPerGbProcessed.toFixed(3),
      targetVal: t.carbonPerGbProcessed.toFixed(3),
      diff: `${((t.carbonPerGbProcessed - b.carbonPerGbProcessed) / (b.carbonPerGbProcessed || 1) * 100).toFixed(1)}%`,
      diffGood: t.carbonPerGbProcessed < b.carbonPerGbProcessed,
      subtext: 'Emission efficiency per processed workload volume',
    },
    {
      title: 'Average Total Queue',
      unit: 'GB',
      icon: Layers,
      iconColor: 'text-sky-500 bg-sky-50 dark:bg-sky-950/60',
      baselineVal: b.avgQueueGb.toFixed(2),
      targetVal: t.avgQueueGb.toFixed(2),
      diff: `${queuePct > 0 ? '+' : ''}${queuePct.toFixed(1)}%`,
      diffGood: queuePct < 0,
      subtext: 'Backlog latency proxy across all nodes',
    },
    {
      title: 'Peak Total Queue',
      unit: 'GB',
      icon: Activity,
      iconColor: 'text-purple-500 bg-purple-50 dark:bg-purple-950/60',
      baselineVal: b.peakQueueGb.toFixed(1),
      targetVal: t.peakQueueGb.toFixed(1),
      diff: `${((t.peakQueueGb - b.peakQueueGb) / (b.peakQueueGb || 1) * 100).toFixed(1)}%`,
      diffGood: t.peakQueueGb < b.peakQueueGb,
      subtext: 'Maximum cluster buffer depth under traffic burst',
    },
  ];

  return (
    <div className="space-y-4">
      {/* 4 Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div
              key={idx}
              className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  {kpi.title}
                </span>
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${kpi.iconColor}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-baseline justify-between">
                  <div>
                    <span className="text-xs text-slate-400 block">{t.algorithm}:</span>
                    <span className="text-2xl font-black font-mono text-slate-900 dark:text-white">
                      {kpi.targetVal}
                    </span>
                    <span className="text-[11px] text-slate-400 ml-1">{kpi.unit}</span>
                  </div>
                  <span
                    className={`text-xs font-bold font-mono px-2 py-0.5 rounded-full border ${
                      kpi.diffGood
                        ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800'
                        : 'bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800'
                    }`}
                  >
                    {kpi.diff}
                  </span>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex justify-between text-xs text-slate-500">
                  <span>Baseline ({b.algorithm}):</span>
                  <span className="font-mono font-semibold text-slate-700 dark:text-slate-300">
                    {kpi.baselineVal} {kpi.unit}
                  </span>
                </div>
              </div>

              <p className="text-[10px] text-slate-400 dark:text-slate-500">
                {kpi.subtext}
              </p>
            </div>
          );
        })}
      </div>

      {/* Offloading Breakdown Side by Side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Baseline Offload Breakdown */}
        <div className="p-4 rounded-3xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-400">
            <span>{b.algorithm} Routing Summary</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-mono">
              Utilization: {(b.avgEdgeUtilization * 100).toFixed(1)}%
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
            <div className="p-2 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60">
              <span className="text-[10px] text-slate-400 block">Locally Processed</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">{b.edgeProcessedGb.toFixed(0)} GB</span>
            </div>
            <div className="p-2 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60">
              <span className="text-[10px] text-slate-400 block">Sent to Peers</span>
              <span className="font-bold text-sky-600 dark:text-sky-400">{bPeer.toFixed(0)} GB</span>
            </div>
            <div className="p-2 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60">
              <span className="text-[10px] text-slate-400 block">Sent to Cloud</span>
              <span className="font-bold text-indigo-600 dark:text-indigo-400">{bCloud.toFixed(0)} GB</span>
            </div>
          </div>
        </div>

        {/* Target Offload Breakdown */}
        <div className="p-4 rounded-3xl bg-emerald-50/30 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-800/60 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-emerald-800 dark:text-emerald-300">
            <span>{t.algorithm} Routing Summary</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 font-mono border border-emerald-300 dark:border-emerald-700">
              Utilization: {(t.avgEdgeUtilization * 100).toFixed(1)}%
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
            <div className="p-2 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60">
              <span className="text-[10px] text-slate-400 block">Locally Processed</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">{t.edgeProcessedGb.toFixed(0)} GB</span>
            </div>
            <div className="p-2 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60">
              <span className="text-[10px] text-slate-400 block">Sent to Peers</span>
              <span className="font-bold text-sky-600 dark:text-sky-400">{tPeer.toFixed(0)} GB</span>
            </div>
            <div className="p-2 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60">
              <span className="text-[10px] text-slate-400 block">Sent to Cloud</span>
              <span className="font-bold text-indigo-600 dark:text-indigo-400">{tCloud.toFixed(0)} GB</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
