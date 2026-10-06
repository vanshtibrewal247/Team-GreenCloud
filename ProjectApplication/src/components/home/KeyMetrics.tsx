import React from 'react';
import { Clock, Leaf, ShieldCheck, Zap, Server } from 'lucide-react';

export const KeyMetrics: React.FC = () => {
  const metrics = [
    {
      label: 'Average Latency',
      value: '42.8 ms',
      subtext: 'vs 58.4 ms in static greedy',
      change: '-26.7%',
      positive: true,
      icon: Clock,
      color: 'text-cloud-600 dark:text-cloud-400',
      bg: 'bg-cloud-50 dark:bg-cloud-950/50',
    },
    {
      label: 'Carbon Reduction',
      value: '31.4%',
      subtext: 'Scope-2 emissions avoided',
      change: 'Target Met',
      positive: true,
      icon: Leaf,
      color: 'text-carbon-600 dark:text-carbon-400',
      bg: 'bg-carbon-50 dark:bg-carbon-950/50',
    },
    {
      label: 'Task Success Rate',
      value: '96.8%',
      subtext: 'Deadline QoS compliance',
      change: '+2.9%',
      positive: true,
      icon: ShieldCheck,
      color: 'text-emerald-600 dark:text-emerald-400',
      bg: 'bg-emerald-50 dark:bg-emerald-950/50',
    },
    {
      label: 'Energy Consumption',
      value: '19.2%',
      subtext: 'Less cumulative kWh drawn',
      change: '-19.2%',
      positive: true,
      icon: Zap,
      color: 'text-amber-600 dark:text-amber-400',
      bg: 'bg-amber-50 dark:bg-amber-950/50',
    },
    {
      label: 'Edge vs Cloud Ratio',
      value: '74% / 26%',
      subtext: 'Balanced localized execution',
      change: 'Optimized',
      positive: true,
      icon: Server,
      color: 'text-indigo-600 dark:text-indigo-400',
      bg: 'bg-indigo-50 dark:bg-indigo-950/50',
    },
  ];

  return (
    <section className="py-16 bg-slate-50/50 dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-carbon-50 dark:bg-carbon-950/60 text-carbon-700 dark:text-carbon-300 border border-carbon-200/60 dark:border-carbon-800/60 mb-2">
              <span>Empirical Benchmarks</span>
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Headline Performance Metrics
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Comparative simulation averages conducted across 50,000 requests on synthetic & Alibaba cluster traces.
            </p>
          </div>

          <div className="text-right">
            <span className="text-[11px] font-mono px-3 py-1 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              * Research Prototype Demo Data
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
          {metrics.map((m, idx) => {
            const Icon = m.icon;
            return (
              <div
                key={idx}
                className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-10 h-10 rounded-2xl ${m.bg} ${m.color} flex items-center justify-center`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-mono font-bold text-carbon-600 dark:text-carbon-400 bg-carbon-50 dark:bg-carbon-950/60 px-2 py-0.5 rounded border border-carbon-200 dark:border-carbon-800">
                    {m.change}
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                    {m.value}
                  </div>
                  <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    {m.label}
                  </div>
                  <div className="text-[11px] text-slate-400 dark:text-slate-500">
                    {m.subtext}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
