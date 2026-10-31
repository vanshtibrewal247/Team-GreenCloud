import React from 'react';
import { Cpu, Terminal, Layout, BarChart2, Zap } from 'lucide-react';

export const ToolsGrid: React.FC = () => {
  const tools = [
    {
      name: 'GreenCloud Simulation Engine',
      badge: 'Simulation Engine',
      icon: Cpu,
      color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/60',
      description:
        'Slot-based discrete-time simulation engine implementing Lyapunov optimization (DWPA) with joint horizontal peer and vertical cloud offloading, dynamic CPU frequency scaling, and empirical carbon tracking.',
      roles: ['Lyapunov Drift-Plus-Penalty', 'Shannon Channel & Backhaul', 'Closed-Form P1/P2/P3 Solvers'],
    },
    {
      name: 'Python & Machine Learning Stack',
      badge: 'Data & ML Forecasting',
      icon: Terminal,
      color: 'text-sky-500 bg-sky-50 dark:bg-sky-950/60',
      description:
        'Powers empirical trace extraction from the master dataset, 1-step-ahead forecasting of regional carbon intensity using Random Forest / LSTM, and the FastAPI inference server (ml_service.py).',
      roles: ['pandas & scikit-learn', 'FastAPI ml_service.py', 'Random Forest & LSTM'],
    },
    {
      name: 'React 18 & TypeScript',
      badge: 'Client-Side Engine & UI',
      icon: Layout,
      color: 'text-indigo-500 bg-indigo-50 dark:bg-indigo-950/60',
      description:
        'Executes the entire simulation engine deterministically in the browser in milliseconds. Synchronizes live topology telemetry, parameter auto-calibration, and multi-algorithm comparative replay without backend latency.',
      roles: ['In-Browser Deterministic Sim', 'Live Topology Telemetry', 'Auto-Calibration Routines'],
    },
    {
      name: 'Recharts & Reactive Canvas',
      badge: 'Telemetry & Visualization',
      icon: BarChart2,
      color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/60',
      description:
        'Powers real-time animated node topologies, slot scrubber replay, queue depth gauges, and comparative SVG charts for cumulative carbon, per-slot emissions, and 14-point Lyapunov V-sweep trade-off curves.',
      roles: ['Animated Mesh Topology', 'Per-Slot Carbon & Queue Charts', 'Lyapunov V-Sweep Curves'],
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
