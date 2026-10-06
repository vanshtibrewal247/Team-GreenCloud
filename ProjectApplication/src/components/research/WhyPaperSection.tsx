import React from 'react';
import { Target, Layers, Cpu, Sparkles } from 'lucide-react';

export const WhyPaperSection: React.FC = () => {
  const cards = [
    {
      title: 'Hybrid Task Offloading',
      desc: 'The paper studies three execution choices: local processing, horizontal edge-to-edge offloading, and vertical edge-to-cloud offloading, making it directly relevant to our edge-cloud task allocation problem.',
      icon: Target,
      tag: 'Problem Alignment',
    },
    {
      title: 'Strong Optimization Baseline',
      desc: 'It proposes DWPA, an online Lyapunov optimization framework that jointly considers carbon footprint and queue backlog while deciding workload allocation and transmission power.',
      icon: Layers,
      tag: 'Baseline Method',
    },
    {
      title: 'Dynamic System Modeling',
      desc: 'The paper models dynamic workload arrivals, heterogeneous edge-cloud resources, transmission power, queue backlogs, and time- and location-varying carbon intensity.',
      icon: Cpu,
      tag: 'Simulation Fit',
    },
    {
      title: 'Foundation for Predictive Scheduling',
      desc: 'The paper relies on current and estimated carbon-intensity information for online decisions. Our work extends this direction by introducing forecasting to make task-offloading decisions more proactive.',
      icon: Sparkles,
      tag: 'Research Extension',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">
          Why Did We Choose This Paper?
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Identifying a foundational baseline with proven algorithmic rigor and an evident sustainability enhancement opportunity.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c, i) => {
          const Icon = c.icon;
          return (
            <div
              key={i}
              className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">
                    {c.tag}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-2">
                  {c.title}
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {c.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
