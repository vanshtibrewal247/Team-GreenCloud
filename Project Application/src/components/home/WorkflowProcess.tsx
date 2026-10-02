import React, { useState } from 'react';
import {
  Inbox,
  Eye,
  TrendingUp,
  Cpu,
  Send,
  CheckCircle,
  BarChart3,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

export const WorkflowProcess: React.FC = () => {
  const [activeStep, setActiveStep] = useState(2);

  const steps = [
    {
      num: '01',
      title: 'Request Arrives',
      subtitle: 'IoT / Mobile Ingestion',
      icon: Inbox,
      detail: 'Sensors, connected vehicles, or client apps trigger computational workloads with explicit memory size, MIPS requirements, and deadline budgets.',
      tech: 'REST / gRPC / MQTT Gateway',
    },
    {
      num: '02',
      title: 'Observe State',
      subtitle: 'Telemetry Ingestion',
      icon: Eye,
      detail: 'Real-time telemetry probes read current CPU load, active queue depth, memory occupancy, and instant network round-trip time across all nodes.',
      tech: 'EdgeCloudSim Metric Bus',
    },
    {
      num: '03',
      title: 'Forecast Horizons',
      subtitle: 'Predictive Modeling',
      icon: TrendingUp,
      detail: 'Trained sequence models predict solar/wind grid carbon curves and incoming traffic bursts over the next 15–60 minute scheduling windows.',
      tech: 'LSTM / Prophet Forecast',
    },
    {
      num: '04',
      title: 'Evaluate Strategy',
      subtitle: 'Multi-Objective Solver',
      icon: Cpu,
      detail: 'The EDGE²CO scheduler solves a Pareto-frontier tradeoff: minimizing carbon emissions and energy while strictly respecting deadline SLA constraints.',
      tech: 'Constrained Optimization',
    },
    {
      num: '05',
      title: 'Task Assignment',
      subtitle: 'Spatial Dispatch',
      icon: Send,
      detail: 'The task packet is dispatched to either the nearest responsive Edge node or an energy-efficient, low-carbon Cloud datacenter.',
      tech: 'Dynamic SDN Routing',
    },
    {
      num: '06',
      title: 'Execution & QoS',
      subtitle: 'Telemetry Evaluation',
      icon: CheckCircle,
      detail: 'Execution runtime, queuing latency, memory footprint, and actual power draw are logged for verification and model retraining.',
      tech: 'Feedback Telemetry Loop',
    },
    {
      num: '07',
      title: 'Visual Analytics',
      subtitle: 'Real-Time Insights',
      icon: BarChart3,
      detail: 'Operators and researchers inspect comparative performance, carbon savings, latency distributions, and request-level traces in real time.',
      tech: 'EDGE²CO Interactive UI',
    },
  ];

  return (
    <section className="py-16 bg-white dark:bg-slate-900 border-t border-b border-slate-200/80 dark:border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
            <span>End-to-End Pipeline</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            How Our System Works
          </h2>
          <p className="mt-3 text-base text-slate-600 dark:text-slate-400">
            A 7-stage closed-loop architecture orchestrating predictive machine learning with real-time distributed edge-cloud scheduling.
          </p>
        </div>

        {/* Horizontal / Stepper Process Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 mb-8">
          {steps.map((s, idx) => {
            const Icon = s.icon;
            const isSelected = activeStep === idx;
            return (
              <button
                key={s.num}
                onClick={() => setActiveStep(idx)}
                className={`flex flex-col items-center text-center p-3.5 rounded-2xl transition-all duration-200 border text-left ${
                  isSelected
                    ? 'bg-slate-900 text-white dark:bg-slate-800 border-carbon-500 shadow-md scale-105'
                    : 'bg-slate-50 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center mb-2 text-xs font-bold ${
                    isSelected
                      ? 'bg-carbon-500 text-white'
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-mono text-slate-400 font-bold">{s.num}</span>
                <span className="text-xs font-semibold line-clamp-1">{s.title}</span>
              </button>
            );
          })}
        </div>

        {/* Detailed Active Step Focus Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 transition-all duration-300">
          <div className="space-y-3 flex-1">
            <div className="flex items-center gap-2 text-xs font-mono text-carbon-600 dark:text-carbon-400 font-bold">
              <span>STAGE {steps[activeStep].num} OF 07</span>
              <span>•</span>
              <span className="text-slate-500">{steps[activeStep].subtitle}</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              {steps[activeStep].title}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {steps[activeStep].detail}
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs font-mono">
              <span className="text-slate-400">Implementation Layer:</span>
              <span className="px-2.5 py-0.5 rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-carbon-700 dark:text-carbon-300 font-medium">
                {steps[activeStep].tech}
              </span>
            </div>
          </div>

          <div className="flex sm:flex-col gap-2 shrink-0">
            <button
              onClick={() => setActiveStep((prev) => (prev > 0 ? prev - 1 : steps.length - 1))}
              className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Previous
            </button>
            <button
              onClick={() => setActiveStep((prev) => (prev < steps.length - 1 ? prev + 1 : 0))}
              className="px-4 py-2 rounded-xl bg-carbon-600 hover:bg-carbon-700 text-white text-xs font-semibold flex items-center justify-center gap-1"
            >
              <span>Next</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
