import React from 'react';
import { AlertCircle, Database, Server, Cpu, CheckSquare, TrendingUp } from 'lucide-react';

export const PaperAnalysisCards: React.FC = () => {
  const cards = [
    {
      title: 'Problem Addressed',
      desc: 'Formulating joint offloading decision and radio power allocation for IoT devices under fading wireless channels and tight deadline constraints.',
      icon: AlertCircle,
      color: 'text-amber-500',
    },
    {
      title: 'Dataset & Workload',
      desc: 'Synthetic Poisson task arrivals modeled after mobile multimedia streams (100–800 KB input files, 200–1200 MIPS computation requirement).',
      icon: Database,
      color: 'text-cloud-500',
    },
    {
      title: 'Simulation Environment',
      desc: 'Custom MATLAB/C++ discrete-event simulator with 10 cellular micro-cells and a single centralized cloud datacenter.',
      icon: Server,
      color: 'text-indigo-500',
    },
    {
      title: 'Core Algorithm',
      desc: 'Lyapunov-drift plus penalty heuristic combined with block coordinate descent to separate integer offload decisions from continuous power values.',
      icon: Cpu,
      color: 'text-emerald-500',
    },
    {
      title: 'Evaluation Metrics',
      desc: 'System cost (weighted sum of latency and energy), task drop rate, and CPU utilization percentage across edge servers.',
      icon: CheckSquare,
      color: 'text-purple-500',
    },
    {
      title: 'Key Results Achieved',
      desc: 'Achieved 22% reduction in overall system cost compared to greedy local execution, but assumed constant electricity carbon intensity across all nodes.',
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
