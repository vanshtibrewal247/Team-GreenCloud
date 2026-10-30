import React from 'react';
import {
  BookOpen,
  Database,
  Brain,
  Network,
  BarChart3,
  ChevronRight,
  Workflow,
  RefreshCw,
} from 'lucide-react';

interface WorkflowPhase {
  num: string;
  shortLabel: string;
  title: string;
  desc: string;
  activities: string[];
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
  iconBg: string;
  badgeBg: string;
  bulletColor: string;
  borderColor: string;
}

export const HowWeWork: React.FC = () => {
  const phases: WorkflowPhase[] = [
    {
      num: '01',
      shortLabel: 'Formulation',
      title: 'Research & Formulation',
      desc: 'Establish the research foundation through literature reviews, identify gaps in existing edge-cloud task-offloading approaches, formulate the research problem and define carbon-aware optimization objectives.',
      activities: [
        'Literature review and research gap identification.',
        'Mathematical problem formulation.',
        'Defining latency, energy and carbon objectives.',
        'Establishing research benchmarks.',
      ],
      icon: BookOpen,
      accentColor: 'text-emerald-600 dark:text-emerald-400',
      iconBg: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-800/50',
      badgeBg: 'bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
      bulletColor: 'text-emerald-500',
      borderColor: 'hover:border-emerald-500/60 dark:hover:border-emerald-500/60',
    },
    {
      num: '02',
      shortLabel: 'Data Prep',
      title: 'Data Curation',
      desc: 'Prepare and validate workload and regional carbon-intensity datasets to build a reliable foundation for forecasting and simulation experiments.',
      activities: [
        'Workload dataset collection and organization.',
        'Data cleaning and preprocessing.',
        'Feature engineering and validation.',
        'Preparing task and regional carbon-intensity traces.',
      ],
      icon: Database,
      accentColor: 'text-cloud-600 dark:text-cloud-400',
      iconBg: 'bg-cloud-50 text-cloud-600 dark:bg-cloud-950/60 dark:text-cloud-400 border border-cloud-200/50 dark:border-cloud-800/50',
      badgeBg: 'bg-cloud-50 dark:bg-cloud-950/70 text-cloud-700 dark:text-cloud-300 border-cloud-200 dark:border-cloud-800',
      bulletColor: 'text-cloud-500',
      borderColor: 'hover:border-cloud-500/60 dark:hover:border-cloud-500/60',
    },
    {
      num: '03',
      shortLabel: 'Predictive AI',
      title: 'Machine Learning',
      desc: 'Develop, train and compare predictive models for task execution duration and regional carbon-intensity forecasting to provide intelligent scheduling decisions.',
      activities: [
        'Task duration prediction.',
        'Carbon-intensity forecasting.',
        'Comparing Linear Regression, Random Forest, Gradient Boosting, XGBoost and LSTM candidate algorithms.',
        'Model evaluation using MAE, RMSE and R².',
      ],
      icon: Brain,
      accentColor: 'text-edge-600 dark:text-edge-400',
      iconBg: 'bg-edge-50 text-edge-600 dark:bg-edge-950/60 dark:text-edge-400 border border-edge-200/50 dark:border-edge-800/50',
      badgeBg: 'bg-edge-50 dark:bg-edge-950/70 text-edge-700 dark:text-edge-300 border-edge-200 dark:border-edge-800',
      bulletColor: 'text-edge-500',
      borderColor: 'hover:border-edge-500/60 dark:hover:border-edge-500/60',
    },
    {
      num: '04',
      shortLabel: 'Simulation',
      title: 'Simulation & Scheduling',
      desc: 'Build a custom software-based edge-cloud simulation environment to evaluate intelligent task placement across virtual edge and cloud infrastructure.',
      activities: [
        'Virtual edge and cloud resource modeling.',
        'Task arrivals, queues and execution modeling.',
        'ML-driven scheduling decisions.',
        'Carbon-, energy- and deadline-aware task placement.',
      ],
      icon: Network,
      accentColor: 'text-purple-600 dark:text-purple-400',
      iconBg: 'bg-purple-50 text-purple-600 dark:bg-purple-950/60 dark:text-purple-400 border border-purple-200/50 dark:border-purple-800/50',
      badgeBg: 'bg-purple-50 dark:bg-purple-950/70 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800',
      bulletColor: 'text-purple-500',
      borderColor: 'hover:border-purple-500/60 dark:hover:border-purple-500/60',
    },
    {
      num: '05',
      shortLabel: 'Optimization',
      title: 'Evaluation & Optimization',
      desc: 'Evaluate the proposed forecasting-driven scheduling approach against conventional baselines and iteratively refine the system using experimental results.',
      activities: [
        'Compare Round Robin, CPU-aware and carbon-aware baselines.',
        'Analyze execution time and deadline violations.',
        'Measure estimated energy consumption and CO₂ emissions.',
        'Refine forecasting and scheduling parameters based on results.',
      ],
      icon: BarChart3,
      accentColor: 'text-carbon-600 dark:text-carbon-400',
      iconBg: 'bg-carbon-50 text-carbon-600 dark:bg-carbon-950/60 dark:text-carbon-400 border border-carbon-200/50 dark:border-carbon-800/50',
      badgeBg: 'bg-carbon-50 dark:bg-carbon-950/70 text-carbon-700 dark:text-carbon-300 border-carbon-200 dark:border-carbon-800',
      bulletColor: 'text-carbon-500',
      borderColor: 'hover:border-carbon-500/60 dark:hover:border-carbon-500/60',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto space-y-2.5">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-carbon-50 dark:bg-carbon-950/60 border border-carbon-200 dark:border-carbon-800 text-[11px] font-mono font-semibold uppercase tracking-wider text-carbon-700 dark:text-carbon-400">
          <Workflow className="w-3.5 h-3.5 text-carbon-500" />
          <span>Our Research Workflow</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          How We Work
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-normal max-w-2xl mx-auto">
          From research foundations to intelligent forecasting and experimental validation — our iterative approach to sustainable edge-cloud computing.
        </p>
      </div>

      {/* Horizontal Research Pipeline Track (Desktop Header Rail) */}
      <div className="hidden lg:block relative px-6">
        {/* Continuous Connecting Line */}
        <div className="absolute top-1/2 left-14 right-14 -translate-y-1/2 h-0.5 bg-slate-200 dark:bg-slate-800 z-0">
          <div className="h-full w-full bg-gradient-to-r from-emerald-500/40 via-cloud-500/40 to-carbon-500/40" />
        </div>

        {/* Milestone Phase Markers */}
        <div className="relative z-10 grid grid-cols-5 gap-5">
          {phases.map((p) => (
            <div key={p.num} className="flex flex-col items-center">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs text-[11px] font-mono font-bold text-slate-700 dark:text-slate-300">
                <span className={`w-2 h-2 rounded-full ${p.bulletColor.replace('text-', 'bg-')}`} />
                <span>{`PHASE ${p.num}`}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5-Phase Pipeline Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5 relative">
        {phases.map((s, idx) => {
          const Icon = s.icon;
          const isLastTablet = idx === 4;
          return (
            <div
              key={s.num}
              className={`rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between relative group ${s.borderColor} ${
                isLastTablet ? 'md:col-span-2 lg:col-span-1' : ''
              }`}
            >
              <div className="space-y-3.5">
                {/* Header: Icon & Phase Tag */}
                <div className="flex items-center justify-between">
                  <div
                    className={`w-11 h-11 rounded-2xl ${s.iconBg} flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <span
                    className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${s.badgeBg}`}
                  >
                    {`Phase ${s.num}`}
                  </span>
                </div>

                {/* Title & Description */}
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-carbon-600 dark:group-hover:text-carbon-400 transition-colors leading-snug">
                    {s.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-normal mt-2">
                    {s.desc}
                  </p>
                </div>

                {/* Core Activities Highlights */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 space-y-2">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
                    Key Activities
                  </span>
                  <ul className="space-y-1.5 text-[11px] text-slate-600 dark:text-slate-300">
                    {s.activities.map((act, aIdx) => (
                      <li key={aIdx} className="flex items-start gap-1.5">
                        <span className={`font-bold shrink-0 text-[10px] mt-0.5 ${s.bulletColor}`}>
                          ▪
                        </span>
                        <span className="leading-snug">{act}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Desktop Progression Connector (Between Cards) */}
              {idx < phases.length - 1 && (
                <div className="hidden lg:flex absolute -right-3.5 top-1/2 -translate-y-1/2 z-20 w-7 h-7 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-xs items-center justify-center text-slate-400 group-hover:border-carbon-500/60 group-hover:text-carbon-500 transition-all">
                  <ChevronRight className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Closed-Loop Iterative Callout */}
      <div className="rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600 dark:text-slate-400">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-carbon-50 dark:bg-carbon-950/60 text-carbon-600 dark:text-carbon-400 flex items-center justify-center shrink-0">
            <RefreshCw className="w-4 h-4" />
          </div>
          <p className="leading-relaxed">
            <span className="font-semibold text-slate-900 dark:text-white">
              Continuous Feedback Pipeline:
            </span>{' '}
            Experimental evaluation metrics from Phase 05 continuously calibrate simulation
            parameters and retrain forecasting models.
          </p>
        </div>
        <span className="text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 font-semibold shrink-0">
          Iterative Refinement
        </span>
      </div>
    </div>
  );
};
