import React, { useState } from 'react';
import { Layers, ArrowDown, Layout, Server, Cpu, Database, BarChart3 } from 'lucide-react';

export const ArchitectureDiagram: React.FC = () => {
  const [activeTier, setActiveTier] = useState<number>(0);

  const tiers = [
    {
      id: 0,
      name: '1. Frontend User Interface',
      tag: 'React 18 + TypeScript + Tailwind',
      icon: Layout,
      color: 'border-indigo-500 text-indigo-500',
      summary: 'Interactive simulation lab control room, reactive topology canvas, and parameter inputs.',
      inputs: 'User slider adjustments, CSV trace drops, algorithm selection (Baseline vs Evaluation Target).',
      outputs: 'SimConfig parameters and evaluation commands transmitted to the simulation engine.',
      components: 'TryPage.tsx, EdgeConfigCard, CloudConfigCard, InfrastructureVisualizer, ModelSelector',
    },
    {
      id: 1,
      name: '2. Client-Side Simulation Engine',
      tag: 'TypeScript / Deterministic Engine',
      icon: Server,
      color: 'border-emerald-500 text-emerald-500',
      summary: 'In-browser slot-based simulation engine executing DWPA and 7 benchmark algorithms over the full 775-hour trace without backend latency.',
      inputs: 'SimConfig payload with selected edge cities, slot duration, Lyapunov V parameter, and link capacities.',
      outputs: 'Slot-by-slot telemetry arrays (queues, CPU frequencies, peer/cloud flows, carbon grams) and summary metrics.',
      components: 'engine.ts, algorithms.ts, config.ts, types.ts',
    },
    {
      id: 2,
      name: '3. Machine Learning Forecasting Pipeline & API',
      tag: 'Python / scikit-learn & FastAPI',
      icon: Cpu,
      color: 'border-sky-500 text-sky-500',
      summary: 'Generates 1-step-ahead Random Forest & sequence forecasts of regional electrical grid carbon intensities and upcoming workload bursts, served in-browser and via FastAPI.',
      inputs: 'Empirical master dataset time-series and historical lag features (lag-1, lag-2, lag-3, lag-6, rolling-3).',
      outputs: 'Hourly predicted carbon intensity curves and anticipated queue backlogs for proactive offloading.',
      components: 'ml_service.py, generate_forecasts.py, forecast_driven_carbon_aware_edge_cloud_ml_web_ready.ipynb, trace.json',
    },
    {
      id: 3,
      name: '4. Closed-Form Lyapunov Optimization',
      tag: 'Closed-Form & Alternating Solvers',
      icon: Database,
      color: 'border-amber-500 text-amber-500',
      summary: 'Closed-form and alternating bisection solvers for local CPU frequency (P1a), cloud CPU (P1b), collaborative peer offloading (P2), and vertical cloud offloading (P3).',
      inputs: 'Current & forecast carbon intensities, queue depths, Shannon wireless rates, and cubic power coefficients.',
      outputs: 'Provably optimal CPU frequencies and converged offloading flow volumes per directed edge/cloud link.',
      components: 'dwpa.ts (solveP1a, solveP1b, solveP2Alternating, solveP3Alternating)',
    },
    {
      id: 4,
      name: '5. Analytics & Visualization Engine',
      tag: 'Recharts & Reactive Canvas',
      icon: BarChart3,
      color: 'border-indigo-500 text-indigo-500',
      summary: 'Aggregates raw slot traces into head-to-head KPI comparisons, cumulative emissions, and 14-point Lyapunov V-sweep trade-off curves.',
      inputs: 'SimSummary records, slot telemetry arrays, and data quality metadata.',
      outputs: 'Interactive time-series charts, live topology canvas playback, and assumptions audit table.',
      components: 'ChartsSection.tsx, OverallComparison.tsx, AssumptionsPanel.tsx, WinnerSummary.tsx',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Layers className="w-5 h-5 text-indigo-500" />
          <span>Interactive System Architecture</span>
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Click any architectural tier to inspect its data contracts, input/output schemas, and subcomponents.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Stacked Flow Diagram (7 cols) */}
        <div className="lg:col-span-7 space-y-3">
          {tiers.map((t, idx) => {
            const Icon = t.icon;
            const isSelected = activeTier === idx;
            return (
              <React.Fragment key={t.id}>
                <div
                  onClick={() => setActiveTier(idx)}
                  className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? `bg-white dark:bg-slate-800 ${t.color} shadow-lg scale-[1.01]`
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">{t.name}</h4>
                      <span className="text-[11px] font-mono text-slate-400">{t.tag}</span>
                    </div>
                  </div>

                  <span className="text-xs font-semibold font-mono text-slate-400">
                    {isSelected ? 'Active View' : 'Inspect'}
                  </span>
                </div>

                {idx < tiers.length - 1 && (
                  <div className="flex justify-center">
                    <ArrowDown className="w-4 h-4 text-slate-400 dark:text-slate-600 animate-pulse" />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Right Column: Active Tier Inspection Panel (5 cols) */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-slate-900 text-white border border-slate-800 space-y-4 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <span className="text-[10px] font-mono uppercase tracking-wider text-carbon-400 font-bold">
              Tier Inspection
            </span>
            <span className="text-xs font-mono text-slate-400">
              Layer {tiers[activeTier].id + 1} of 5
            </span>
          </div>

          <h4 className="text-lg font-bold text-white">
            {tiers[activeTier].name}
          </h4>

          <p className="text-xs text-slate-300 leading-relaxed font-normal">
            {tiers[activeTier].summary}
          </p>

          <div className="space-y-3 pt-2 text-xs font-mono">
            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
              <span className="text-slate-400 block text-[10px] uppercase font-bold mb-1">
                Data Inputs:
              </span>
              <span className="text-slate-200">{tiers[activeTier].inputs}</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
              <span className="text-slate-400 block text-[10px] uppercase font-bold mb-1">
                Data Outputs:
              </span>
              <span className="text-emerald-400 font-semibold">{tiers[activeTier].outputs}</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
              <span className="text-slate-400 block text-[10px] uppercase font-bold mb-1">
                Primary Modules:
              </span>
              <span className="text-cloud-300">{tiers[activeTier].components}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
