import React from 'react';
import { ArrowRight, Sparkles, Check, X, Compass, Zap } from 'lucide-react';

export const ApproachComparison: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="text-center max-w-2xl mx-auto">
        <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">
          Architectural Paradigm Shift
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Direct side-by-side comparison of the traditional reactive paradigm against our forecast-driven sustainable framework.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch max-w-5xl mx-auto">
        {/* Left: Existing Approach */}
        <div className="lg:col-span-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                Baseline Model
              </span>
              <h4 className="text-lg font-bold text-slate-900 dark:text-white">Existing Approach</h4>
            </div>
            <span className="px-2.5 py-1 rounded-full text-xs font-mono bg-slate-100 dark:bg-slate-800 text-slate-500 font-semibold">
              Reactive
            </span>
          </div>

          <ul className="space-y-3 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            <li className="flex items-start gap-2.5">
              <span className="text-rose-500 font-bold shrink-0">✕</span>
              <span><strong>Reactive Decisions:</strong> Dispatches tasks strictly after queues build up; lacks predictive buffer planning.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="text-rose-500 font-bold shrink-0">✕</span>
              <span><strong>Instantaneous State Only:</strong> Treats current snapshot as static; vulnerable to sudden queue saturation bursts.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="text-rose-500 font-bold shrink-0">✕</span>
              <span><strong>Single/Dual Performance Focus:</strong> Optimizes solely for latency or raw CPU cycle costs.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="text-rose-500 font-bold shrink-0">✕</span>
              <span><strong>Zero Carbon Awareness:</strong> Completely blind to whether local power is supplied by coal or solar.</span>
            </li>
          </ul>
        </div>

        {/* Center Arrow Indicator */}
        <div className="lg:col-span-2 flex flex-col items-center justify-center py-2">
          <div className="w-10 h-10 rounded-2xl bg-carbon-100 dark:bg-carbon-950/80 text-carbon-600 dark:text-carbon-400 flex items-center justify-center shadow-md">
            <ArrowRight className="w-5 h-5 rotate-90 lg:rotate-0" />
          </div>
          <span className="text-[10px] font-mono text-slate-400 mt-2 font-semibold text-center">
            EDGE²CO Innovation
          </span>
        </div>

        {/* Right: Our Approach */}
        <div className="lg:col-span-5 rounded-3xl bg-gradient-to-br from-carbon-50/60 to-emerald-50/20 dark:from-slate-900 dark:to-carbon-950/20 border-2 border-carbon-500/50 dark:border-carbon-500/40 p-6 sm:p-8 space-y-4 shadow-lg">
          <div className="flex items-center justify-between pb-3 border-b border-carbon-200/60 dark:border-carbon-900/60">
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-carbon-600 dark:text-carbon-400 flex items-center gap-1">
                <span>Proposed Paradigm</span>
                <Sparkles className="w-3 h-3" />
              </span>
              <h4 className="text-lg font-bold text-slate-900 dark:text-white">Our Approach</h4>
            </div>
            <span className="px-2.5 py-1 rounded-full text-xs font-mono bg-carbon-500 text-white font-semibold">
              Forecast-Driven
            </span>
          </div>

          <ul className="space-y-3 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
            <li className="flex items-start gap-2.5">
              <span className="text-carbon-500 font-bold shrink-0">✓</span>
              <span><strong>Forecast-Driven Decisions:</strong> Preempts traffic and queue bottlenecks 15–60 minutes in advance.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="text-carbon-500 font-bold shrink-0">✓</span>
              <span><strong>Future System Trajectory:</strong> Incorporates diurnal solar and wind availability cycles into routing calculations.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="text-carbon-500 font-bold shrink-0">✓</span>
              <span><strong>Multi-Objective Optimization:</strong> Simultaneously balances Latency + Energy + Carbon under strict SLA boundaries.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="text-carbon-500 font-bold shrink-0">✓</span>
              <span><strong>Full Carbon & Energy Awareness:</strong> Dynamically offloads non-urgent batch tasks to clean renewable-rich regions.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
