import React from 'react';
import { Target, Layers, Cpu, Sparkles } from 'lucide-react';

export const WhyPaperSection: React.FC = () => {
  const cards = [
    {
      title: 'Direct Task Offloading Relevance',
      desc: 'Formulates the canonical edge-cloud offloading decision problem with realistic transmission radio power, queue congestion, and deadline boundaries.',
      icon: Target,
      tag: 'Problem Alignment',
    },
    {
      title: 'Rigorous Baseline Methodology',
      desc: 'Provides a mathematically robust Lyapunov optimization baseline against which our predictive approach can be benchmarked with scientific integrity.',
      icon: Layers,
      tag: 'Theoretical Rigor',
    },
    {
      title: 'Modular Simulation Environment',
      desc: 'Uses discrete-event simulation abstractions that translate directly into EdgeCloudSim network and computational topology graphs.',
      icon: Cpu,
      tag: 'Simulation Fit',
    },
    {
      title: 'Clear Carbon Optimization Gap',
      desc: 'Like most traditional research, it treated electricity as uniform and carbon-neutral, leaving massive untapped opportunity for grid-aware scheduling.',
      icon: Sparkles,
      tag: 'Research Opportunity',
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
