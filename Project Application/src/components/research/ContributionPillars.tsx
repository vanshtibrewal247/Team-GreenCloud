import React from 'react';
import { TrendingUp, Leaf, Scale, BarChart2 } from 'lucide-react';

interface ContributionData {
  num: string;
  title: string;
  tag: string;
  desc: string;
  icon: React.ElementType;
  impact: string;
}

export const ContributionPillars: React.FC = () => {
  const contributions: ContributionData[] = [
    {
      num: '01',
      title: 'Predictive Forecasting Module',
      tag: 'Machine Learning',
      desc: 'Formulates multi-horizon workload and temporal grid carbon predictions using lightweight sequence models (LSTM / Prophet). Allows the scheduler to anticipate grid solar peaks and preempt edge queuing congestion.',
      icon: TrendingUp,
      impact: 'Anticipates queue spikes 30m prior',
    },
    {
      num: '02',
      title: 'Carbon-Intensity Grid Modeling',
      tag: 'Sustainability',
      desc: 'Integrates real-time and predicted marginal carbon intensity data (gCO₂/kWh) from regional power authorities directly into the offloading cost function, enabling geographic and temporal carbon arbitrage.',
      icon: Leaf,
      impact: 'Avoids high-carbon thermal hours',
    },
    {
      num: '03',
      title: 'Multi-Objective Pareto Solver',
      tag: 'Optimization',
      desc: 'Replaces single-objective latency minimization with a constrained Pareto-frontier solver: minimizing both cumulative carbon and power draw while guaranteeing that hard latency deadlines are not breached.',
      icon: Scale,
      impact: 'Guarantees sub-50ms SLA compliance',
    },
    {
      num: '04',
      title: 'Rigorous Comparative Evaluation',
      tag: 'Benchmarking',
      desc: 'Conducts extensive simulation experiments against five distinct heuristic and greedy baselines (Round Robin, Random, CPU-Aware, Latency-Aware, Reactive Carbon-Aware) across synthetic and real Alibaba traces.',
      icon: BarChart2,
      impact: 'Empirical validation across 50,000 tasks',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">
          What We Changed — Four Research Contributions
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          The four foundational technical pillars distinguishing EDGE²CO from prior literature.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {contributions.map((c) => {
          const Icon = c.icon;
          return (
            <div
              key={c.num}
              className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between relative group hover:border-carbon-400 dark:hover:border-carbon-600 transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-extrabold text-carbon-600 dark:text-carbon-400 font-mono">
                    {c.num}
                  </span>
                  <div className="w-8 h-8 rounded-xl bg-carbon-50 dark:bg-carbon-950/60 text-carbon-600 dark:text-carbon-400 flex items-center justify-center">
                    <Icon className="w-4 h-4" />
                  </div>
                </div>

                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold block mb-1">
                  {c.tag}
                </span>
                <h4 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                  {c.title}
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {c.desc}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] font-mono text-carbon-600 dark:text-carbon-400 font-semibold">
                ✓ {c.impact}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
