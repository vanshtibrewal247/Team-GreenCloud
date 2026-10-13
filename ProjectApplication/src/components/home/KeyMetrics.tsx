import React from 'react';
import { Layers, ArrowRightLeft, Zap, Scale, GitCompare } from 'lucide-react';

export const KeyMetrics: React.FC = () => {
  const findings = [
    {
      title: 'Vertical-Only',
      tag: 'Baseline',
      finding:
        'Highest carbon and longest queues (baseline that shows the value of peer offloading).',
      detail:
        'Without horizontal peer collaboration, edge nodes saturate quickly under local bursts.',
      icon: Layers,
      color: 'text-rose-500 dark:text-rose-400',
      bg: 'bg-rose-50 dark:bg-rose-950/50',
      badgeBorder: 'border-rose-200 dark:border-rose-800',
    },
    {
      title: 'Horizontal-First',
      tag: 'Variant',
      finding:
        'Lowest carbon among the DWPA variants, but longer queues.',
      detail:
        'Prioritizes greener peer edge nodes before touching the cloud, accepting higher queue backlogs.',
      icon: ArrowRightLeft,
      color: 'text-amber-500 dark:text-amber-400',
      bg: 'bg-amber-50 dark:bg-amber-950/50',
      badgeBorder: 'border-amber-200 dark:border-amber-800',
    },
    {
      title: 'DWPA',
      tag: 'Proposed',
      finding:
        'Smallest queues among the variants, with lower carbon than Local-First and Vertical-Only.',
      detail:
        'Effectively balances Lyapunov drift and carbon weights through joint power, workload, and frequency control.',
      icon: Zap,
      color: 'text-carbon-600 dark:text-carbon-400',
      bg: 'bg-carbon-50 dark:bg-carbon-950/50',
      badgeBorder: 'border-carbon-200 dark:border-carbon-800',
    },
    {
      title: 'ICSOC-19 / DOLA-22',
      tag: 'Baselines',
      finding:
        'ICSOC-19: lowest carbon overall but the largest queues (greedy). DOLA-22: smallest queues but the highest carbon.',
      detail:
        'Demonstrates the extreme trade-offs: pure carbon greediness creates severe queue backlogs, whereas carbon-blind scheduling wastes emissions.',
      icon: Scale,
      color: 'text-indigo-500 dark:text-indigo-400',
      bg: 'bg-indigo-50 dark:bg-indigo-950/50',
      badgeBorder: 'border-indigo-200 dark:border-indigo-800',
    },
    {
      title: 'DWPA vs YCL-24',
      tag: 'Comparison',
      finding:
        'Both balance the two metrics, but DWPA does better by exploiting horizontal offloading.',
      detail:
        'Collaborative edge-to-edge offloading enables DWPA to route tasks laterally to greener, less congested peers.',
      icon: GitCompare,
      color: 'text-cloud-500 dark:text-cloud-400',
      bg: 'bg-cloud-50 dark:bg-cloud-950/50',
      badgeBorder: 'border-cloud-200 dark:border-cloud-800',
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
              Findings from the Paper's Simulation
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Setup: 1000 hourly time slots, 5 edge servers (Seattle, Cheyenne, Chicago, New York, Kansas City) + 1 cloud (Berkeley County), historical CI data from electricityMaps, On-Off traffic.
            </p>
          </div>

          <div className="text-right">
            <span className="text-[11px] font-mono px-3 py-1 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              Qualitative results from the paper
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
          {findings.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-10 h-10 rounded-2xl ${item.bg} ${item.color} flex items-center justify-center`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className={`text-[11px] font-mono font-bold ${item.color} ${item.bg} px-2 py-0.5 rounded border ${item.badgeBorder}`}>
                      {item.tag}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight mb-2">
                    {item.title}
                  </h3>

                  <p className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 leading-snug mb-2">
                    {item.finding}
                  </p>
                </div>

                <div className="text-[11px] text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800 leading-relaxed">
                  {item.detail}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
