import React from 'react';
import { AlertCircle, Database, Server, Cpu, CheckSquare, TrendingUp } from 'lucide-react';

export const PaperAnalysisCards: React.FC = () => {
  const cards = [
  {
    title: 'Problem Addressed',
    desc: 'Jointly minimizes carbon footprint and balances queue backlogs in collaborative edge-cloud computing under dynamic workloads and time- and location-varying carbon intensity.',
    icon: AlertCircle,
    color: 'text-amber-500',
  },
  {
    title: 'Dataset & Workload',
    desc: 'Uses historical carbon-intensity data over 1000 hours with an On-Off workload model: 64 MB mean workload in the On state and 3.2 MB in the Off state.',
    icon: Database,
    color: 'text-cloud-500',
  },
  {
    title: 'Simulation Environment',
    desc: 'Simulates one cloud center in Berkeley County and five geographically distributed edge servers in Seattle, Cheyenne, Chicago, New York, and Kansas City.',
    icon: Server,
    color: 'text-indigo-500',
  },
  {
    title: 'Core Algorithm',
    desc: 'Proposes Dynamic Workload Power Allocation (DWPA), an online Lyapunov optimization framework for workload allocation, CPU frequency, and transmission power.',
    icon: Cpu,
    color: 'text-emerald-500',
  },
  {
    title: 'Evaluation Metrics',
    desc: 'Evaluates carbon footprint and queue backlog while comparing DWPA with Local-First, Vertical-Only, Horizontal-First, ICSOC-19, DOLA-22, and YCL-24.',
    icon: CheckSquare,
    color: 'text-purple-500',
  },
  {
    title: 'Key Results Achieved',
    desc: 'DWPA reduces carbon emissions while maintaining smaller queue backlogs through flexible local processing, horizontal edge-to-edge offloading, and vertical edge-to-cloud offloading.',
    icon: TrendingUp,
    color: 'text-rose-500',
  },
];

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">
          What Did They Do? — Key Investigation Pillars
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Detailed technical breakdown of the baseline publication's scope, setup, and conclusions.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((c, i) => {
          const Icon = c.icon;
          return (
            <div
              key={i}
              className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2"
            >
              <div className="flex items-center gap-2.5">
                <Icon className={`w-5 h-5 ${c.color}`} />
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">{c.title}</h4>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {c.desc}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
