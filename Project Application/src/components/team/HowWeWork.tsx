import React from 'react';
import { BookOpen, FlaskConical, Cpu, BarChart3, RefreshCw, ArrowRight } from 'lucide-react';

export const HowWeWork: React.FC = () => {
  const steps = [
    {
      num: '01',
      title: 'Research',
      desc: 'Formulate hypotheses, review state-of-the-art IEEE/ACM publications, and design formal mathematical models.',
      icon: BookOpen,
      color: 'text-indigo-500 bg-indigo-50 dark:bg-indigo-950/60',
    },
    {
      num: '02',
      title: 'Experiment',
      desc: 'Develop lightweight Python sequence predictors (LSTM / Prophet) and calibrate diurnal renewable generation profiles.',
      icon: FlaskConical,
      color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/60',
    },
    {
      num: '03',
      title: 'Simulate',
      desc: 'Deploy workload traces across EdgeCloudSim topologies with parameterized network contention and queue buffers.',
      icon: Cpu,
      color: 'text-cloud-500 bg-cloud-50 dark:bg-cloud-950/60',
    },
    {
      num: '04',
      title: 'Analyze',
      desc: 'Benchmark tail latency, Scope-2 CO₂ emissions, and energy draw against established greedy and heuristic baselines.',
      icon: BarChart3,
      color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/60',
    },
    {
      num: '05',
      title: 'Improve',
      desc: 'Refine multi-objective Pareto weightings, retrain sequence models, and optimize production runtime overhead.',
      icon: RefreshCw,
      color: 'text-carbon-500 bg-carbon-50 dark:bg-carbon-950/60',
    },
  ];

  return (
    <div className="space-y-8">
      <div className="text-center max-w-2xl mx-auto">
        <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          How We Work
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Our continuous research methodology: from rigorous theory to experimental verification and simulation iterations.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 relative">
        {steps.map((s, idx) => {
          const Icon = s.icon;
          return (
            <div
              key={s.num}
              className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between relative group hover:border-carbon-500 transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-10 h-10 rounded-2xl ${s.color} flex items-center justify-center`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="font-mono text-xs font-bold text-slate-400">
                    PHASE {s.num}
                  </span>
                </div>

                <h4 className="text-base font-bold text-slate-900 dark:text-white mb-1.5">
                  {s.title}
                </h4>

                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {s.desc}
                </p>
              </div>

              {idx < steps.length - 1 && (
                <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-10">
                  <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400">
                    <ArrowRight className="w-3 h-3" />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
