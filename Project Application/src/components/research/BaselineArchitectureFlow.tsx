import React from 'react';
import { ArrowRight, Inbox, Eye, Cpu, Send, CheckCircle } from 'lucide-react';

export const BaselineArchitectureFlow: React.FC = () => {
  const steps = [
    {
      title: '1. Workload',
      desc: 'Incoming IoT compute requests with variable MIPS and payload KB.',
      icon: Inbox,
    },
    {
      title: '2. Instant State',
      desc: 'Probes current wireless channel gain and immediate CPU queue lengths.',
      icon: Eye,
    },
    {
      title: '3. Greedy Heuristic',
      desc: 'Solves Lyapunov optimization to minimize instantaneous delay and energy.',
      icon: Cpu,
    },
    {
      title: '4. Edge / Cloud',
      desc: 'Routes task to local base station or centralized remote cloud.',
      icon: Send,
    },
    {
      title: '5. Evaluation',
      desc: 'Quantifies SLA deadline violations and watt-hours consumed.',
      icon: CheckCircle,
    },
  ];

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">
          Understanding the Baseline Framework
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          A step-by-step trace of how the original paper's decision pipeline operated.
        </p>
      </div>

      <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div key={idx} className="relative flex flex-col items-center text-center p-4 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 shadow-sm">
                <div className="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center mb-2">
                  <Icon className="w-5 h-5" />
                </div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white mb-1">
                  {step.title}
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
