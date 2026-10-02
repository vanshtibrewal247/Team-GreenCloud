import React, { useState } from 'react';
import { Layers, ArrowDown, ArrowRight, Layout, Server, Cpu, Database, BarChart3 } from 'lucide-react';

export const ArchitectureDiagram: React.FC = () => {
  const [activeTier, setActiveTier] = useState<number>(0);

  const tiers = [
    {
      id: 0,
      name: '1. Frontend User Interface',
      tag: 'React + TypeScript + Tailwind',
      icon: Layout,
      color: 'border-indigo-500 text-indigo-500',
      summary: 'Interactive simulation control room, reactive topology canvas, and parameter inputs.',
      inputs: 'User slider adjustments, CSV file drops, algorithm selection (Model 1 vs Model 2).',
      outputs: 'SimulationConfig JSON payloads transmitted to the service interface.',
      components: 'EdgeConfigCard, InfrastructureVisualizer, RequestTable, ThemeContext',
    },
    {
      id: 1,
      name: '2. API Service Abstraction',
      tag: 'REST / WebSocket Transport',
      icon: Server,
      color: 'border-cloud-500 text-cloud-500',
      summary: 'Clean decoupling layer allowing mock simulation or drop-in connection to a real EdgeCloudSim backend.',
      inputs: 'SimulationConfig payload with node capacities and workload traces.',
      outputs: 'Asynchronous streaming progress updates and unified SimulationResult.',
      components: 'simulationService.ts, datasetService.ts, carbonService.ts',
    },
    {
      id: 2,
      name: '3. Predictive Forecasting Engine',
      tag: 'Python / ML Inference Engine',
      icon: Cpu,
      color: 'border-carbon-500 text-carbon-500',
      summary: 'Generates multi-horizon forecasts of incoming request rates and fluctuating grid carbon intensities.',
      inputs: 'Historical Alibaba cluster traces and regional Electricity Maps timeseries.',
      outputs: 'Predicted queue saturation and carbon intensity curves for the next 15–60 minutes.',
      components: 'forecast_engine.py, lstm_predictor.pt, grid_profile_loader.py',
    },
    {
      id: 3,
      name: '4. Discrete Simulation Engine',
      tag: 'EdgeCloudSim Core / Java VM',
      icon: Database,
      color: 'border-amber-500 text-amber-500',
      summary: 'Discrete-event simulation modeling wireless fading, queuing delays, and server CPU execution.',
      inputs: 'Offloading strategy directives, edge topology matrix, WAN propagation delays.',
      outputs: 'Timestamped execution traces (RTT, energy in kWh, queue drops, SLA status).',
      components: 'EdgeOrchestrator.java, TaskManager.java, NetworkModel.java',
    },
    {
      id: 4,
      name: '5. Analytics & Visualization Engine',
      tag: 'Recharts & Client Analytics',
      icon: BarChart3,
      color: 'border-emerald-500 text-emerald-500',
      summary: 'Aggregates raw task traces into KPI comparisons, latency distributions, and carbon savings verdicts.',
      inputs: 'Raw RequestTrace arrays and simulation metadata.',
      outputs: 'Interactive charts, filterable tables, and downloadable JSON/CSV reports.',
      components: 'ChartsSection.tsx, OverallComparison.tsx, WinnerSummary.tsx',
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
