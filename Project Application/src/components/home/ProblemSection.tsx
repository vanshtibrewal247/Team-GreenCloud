import React from 'react';
import { CheckCircle2, XCircle, ArrowRight, TrendingUp, AlertTriangle, ShieldCheck } from 'lucide-react';

export const ProblemSection: React.FC = () => {
  return (
    <section className="py-16 bg-slate-50/50 dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200/60 dark:border-rose-800/60 mb-3">
            <span>Research Motivation</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Why Traditional Offloading Isn't Enough
          </h2>
          <p className="mt-3 text-base text-slate-600 dark:text-slate-400">
            For decades, task offloading algorithms optimized purely for single-dimensional metrics like response time or CPU availability. In modern distributed systems, this creates severe environmental and economic inefficiencies.
          </p>
        </div>

        {/* Visual Comparison Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Traditional Systems */}
          <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 relative">
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-100 dark:border-slate-800">
              <div>
                <span className="text-xs font-mono font-bold uppercase text-slate-400">Conventional Model</span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
                  Traditional Greedy Offloading
                </h3>
              </div>
              <span className="p-2 rounded-xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400">
                <XCircle className="w-5 h-5" />
              </span>
            </div>

            {/* Formula Progression */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 mb-6 font-mono text-xs">
              <div className="text-slate-400 mb-1 font-sans">Objective Function:</div>
              <div className="text-rose-600 dark:text-rose-400 font-bold text-sm">
                Min(Latency) &nbsp;|&nbsp; CPU Utilization &lt; Threshold
              </div>
            </div>

            <ul className="space-y-3.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
              <li className="flex items-start gap-3">
                <span className="text-rose-500 font-bold shrink-0">✕</span>
                <span><strong>Carbon-Blind Routing:</strong> Dispatches tasks to local dirty thermal power grids even when a clean solar region is 15ms away.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-rose-500 font-bold shrink-0">✕</span>
                <span><strong>Reactive Snapshot Lag:</strong> Decides solely on current queue length; creates destructive flocking when 100+ devices simultaneously pick the same node.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-rose-500 font-bold shrink-0">✕</span>
                <span><strong>Single-Objective Isolation:</strong> Sacrifices megawatts of energy to shave 2ms off a non-urgent batch sync task.</span>
              </li>
            </ul>
          </div>

          {/* Our Approach */}
          <div className="rounded-3xl bg-gradient-to-b from-white to-carbon-50/30 dark:from-slate-900 dark:to-carbon-950/20 border-2 border-carbon-500/50 dark:border-carbon-500/40 p-6 sm:p-8 relative shadow-lg">
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-carbon-100 dark:border-carbon-900/40">
              <div>
                <span className="text-xs font-mono font-bold uppercase text-carbon-600 dark:text-carbon-400">Proposed Framework</span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
                  EDGE²CO Multi-Pillar System
                </h3>
              </div>
              <span className="p-2 rounded-xl bg-carbon-100 dark:bg-carbon-950/60 text-carbon-600 dark:text-carbon-400">
                <CheckCircle2 className="w-5 h-5" />
              </span>
            </div>

            {/* Formula Progression */}
            <div className="p-4 rounded-2xl bg-carbon-50/80 dark:bg-carbon-950/50 border border-carbon-200 dark:border-carbon-800 mb-6 font-mono text-xs">
              <div className="text-carbon-700 dark:text-carbon-300 mb-1 font-sans">Holistic Objective Function:</div>
              <div className="text-carbon-600 dark:text-carbon-300 font-bold text-sm">
                Min( α·Latency + β·Energy + γ·Carbon ) &nbsp;s.t.&nbsp; Deadline_QoS
              </div>
            </div>

            <ul className="space-y-3.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
              <li className="flex items-start gap-3">
                <span className="text-carbon-500 font-bold shrink-0">✓</span>
                <span><strong>Predictive Foresight:</strong> Machine learning forecasts future grid intensity and arrival spikes 5–60 minutes ahead.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-carbon-500 font-bold shrink-0">✓</span>
                <span><strong>Pareto Optimization:</strong> Categorizes urgent interactive vs delay-tolerant batch jobs, placing each at the optimal frontier.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-carbon-500 font-bold shrink-0">✓</span>
                <span><strong>Verified 31.4% Carbon Cut:</strong> Massive sustainability impact without compromising 99th-percentile SLA guarantees.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};
