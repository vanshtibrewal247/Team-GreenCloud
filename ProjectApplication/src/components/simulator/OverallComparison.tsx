import React from 'react';
import { ModelMetrics } from '../../types/simulation';
import { Clock, Zap, Leaf, ShieldCheck, Server, Trophy } from 'lucide-react';

interface OverallComparisonProps {
  model1: ModelMetrics;
  model2: ModelMetrics;
}

export const OverallComparison: React.FC<OverallComparisonProps> = ({ model1, model2 }) => {
  const cards = [
    {
      title: 'Average Latency',
      unit: 'ms',
      icon: Clock,
      val1: model1.avgLatencyMs,
      val2: model2.avgLatencyMs,
      lowerIsBetter: true,
      description: 'Mean round-trip request duration',
    },
    {
      title: 'Energy Consumption',
      unit: 'kWh',
      icon: Zap,
      val1: model1.totalEnergyKwh,
      val2: model2.totalEnergyKwh,
      lowerIsBetter: true,
      description: 'Cumulative computational energy drawn',
    },
    {
      title: 'Carbon Footprint',
      unit: 'kg CO₂',
      icon: Leaf,
      val1: model1.totalCarbonKg,
      val2: model2.totalCarbonKg,
      lowerIsBetter: true,
      description: 'Scope-2 emissions based on grid mix',
    },
    {
      title: 'Task Success Rate',
      unit: '%',
      icon: ShieldCheck,
      val1: model1.successRatePct,
      val2: model2.successRatePct,
      lowerIsBetter: false,
      description: 'Workloads meeting deadline SLA',
    },
    {
      title: 'Edge Utilization',
      unit: '%',
      icon: Server,
      val1: model1.edgeUtilizationPct,
      val2: model2.edgeUtilizationPct,
      lowerIsBetter: false,
      description: 'Localized compute utilization capacity',
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            Overall Benchmark Comparison
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Head-to-head performance across primary QoS, energy efficiency, and sustainability dimensions.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {cards.map((c, idx) => {
          const Icon = c.icon;
          const isM1Better = c.lowerIsBetter ? c.val1 < c.val2 : c.val1 > c.val2;
          const isM2Better = c.lowerIsBetter ? c.val2 < c.val1 : c.val2 > c.val1;
          const isTie = c.val1 === c.val2;

          return (
            <div
              key={idx}
              className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between relative overflow-hidden"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">{c.unit}</span>
                </div>

                <h4 className="text-xs font-bold text-slate-900 dark:text-white mb-3">
                  {c.title}
                </h4>

                {/* Values comparison rows */}
                <div className="space-y-2 text-xs font-mono">
                  {/* Model 1 row */}
                  <div
                    className={`flex items-center justify-between p-2 rounded-xl transition-colors ${
                      isM1Better
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-bold border border-emerald-200 dark:border-emerald-800/60'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <span className="truncate max-w-[90px] text-[11px]">{model1.algorithmName.split(' ')[0]}</span>
                    <div className="flex items-center gap-1">
                      <span>{c.val1}</span>
                      {isM1Better && <Trophy className="w-3 h-3 text-emerald-500 shrink-0" />}
                    </div>
                  </div>

                  {/* Model 2 row */}
                  <div
                    className={`flex items-center justify-between p-2 rounded-xl transition-colors ${
                      isM2Better
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-bold border border-emerald-200 dark:border-emerald-800/60'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <span className="truncate max-w-[90px] text-[11px]">{model2.algorithmName.split(' ')[0]}</span>
                    <div className="flex items-center gap-1">
                      <span>{c.val2}</span>
                      {isM2Better && <Trophy className="w-3 h-3 text-emerald-500 shrink-0" />}
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom delta tag */}
              <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 text-[10px] text-center text-slate-400 font-mono">
                {isTie ? (
                  <span>Equal Performance</span>
                ) : isM2Better ? (
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                    {model2.algorithmName.split(' ')[0]} wins by{' '}
                    {Math.abs(((c.val1 - c.val2) / Math.max(c.val1, 0.001)) * 100).toFixed(1)}%
                  </span>
                ) : (
                  <span className="text-slate-500">
                    {model1.algorithmName.split(' ')[0]} ahead by{' '}
                    {Math.abs(((c.val2 - c.val1) / Math.max(c.val2, 0.001)) * 100).toFixed(1)}%
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
