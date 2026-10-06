import React from 'react';
import { Cpu, Terminal, Layout, BarChart2, Zap, Cloud } from 'lucide-react';

export const ToolsGrid: React.FC = () => {
  const tools = [
    {
      name: 'EdgeCloudSim v3.4',
      badge: 'Simulation Engine',
      icon: Cloud,
      color: 'text-cloud-500 bg-cloud-50 dark:bg-cloud-950/60',
      description:
        'EdgeCloudSim is an open-source simulation environment built on top of CloudSim. It models edge computing nodes, wireless network delay, mobile IoT clients, and computational task offloading pipelines.',
      roles: ['Edge & Cloud Topology', 'Queuing & Execution Delays', 'Network Contention Modeling'],
    },
    {
      name: 'Python & Scientific Stack',
      badge: 'Data & Forecasting',
      icon: Terminal,
      color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/60',
      description:
        'Powers time-series sequence forecasting, grid carbon predictive curves, and multi-objective Pareto optimization algorithms.',
      roles: ['pandas & numpy', 'scikit-learn & Prophet', 'Statsmodels ARIMA & LSTM'],
    },
    {
      name: 'React 18 & TypeScript',
      badge: 'Interactive UI',
      icon: Layout,
      color: 'text-indigo-500 bg-indigo-50 dark:bg-indigo-950/60',
      description:
        'Provides the high-performance user interface, dynamic topology state synchronization, accessible controls, and component-driven architecture.',
      roles: ['Interactive Sandbox', 'Type-Safe State Machine', 'Real-Time Topology Rendering'],
    },
    {
      name: 'Recharts & Canvas',
      badge: 'Visualization',
      icon: BarChart2,
      color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/60',
      description:
        'Powers high-performance SVG-based responsive charting for multi-dimensional latency, energy consumption, and carbon intensity metrics.',
      roles: ['Real-Time Bar & Line Charts', 'Donut Offloading Split', 'Pareto Frontier Analysis'],
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Zap className="w-5 h-5 text-amber-500" />
          <span>Simulation Platforms & Technology Stack</span>
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Open-source simulation engines, computational forecasting runtimes, and modern visualization layers.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {tools.map((t, i) => {
          const Icon = t.icon;
          return (
            <div
              key={i}
              className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-12 h-12 rounded-2xl ${t.color} flex items-center justify-center`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-mono font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                    {t.badge}
                  </span>
                </div>

                <h4 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                  {t.name}
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {t.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
                  Core Responsibilities:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {t.roles.map((r, idx) => (
                    <span
                      key={idx}
                      className="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                    >
                      {r}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
