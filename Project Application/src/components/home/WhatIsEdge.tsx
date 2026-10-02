import React from 'react';
import { Smartphone, Zap, Shield, AlertTriangle, Layers, ArrowRight } from 'lucide-react';

export const WhatIsEdge: React.FC = () => {
  return (
    <section className="py-16 border-t border-slate-200/80 dark:border-slate-800/80 bg-white/50 dark:bg-slate-900/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-cloud-50 dark:bg-cloud-950/60 text-cloud-700 dark:text-cloud-300 border border-cloud-200/60 dark:border-cloud-800/60 mb-3">
            <span>Foundational Concept</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            What is Edge Computing?
          </h2>
          <p className="mt-3 text-base text-slate-600 dark:text-slate-400 leading-relaxed">
            Edge computing brings data storage and compute closer to the location where it is generated—at network base stations, micro-datacenters, and roadside units—instead of routing every single request thousands of kilometers to centralized hyperscale clouds.
          </p>
        </div>

        {/* Visual Architecture Diagram */}
        <div className="mb-12 p-6 sm:p-8 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 relative overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            {/* Step 1: User Layer */}
            <div className="flex flex-col items-center text-center p-5 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-3">
                <Smartphone className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">1. Edge Device Generation</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
                Autonomous vehicles, smart sensors, and phones produce continuous streams of compute-intensive tasks with tight latency limits.
              </p>
              <span className="mt-3 text-[11px] font-mono px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-300">
                Hop 0: Origin (0 ms)
              </span>
            </div>

            {/* Step 2: Edge Node Layer */}
            <div className="flex flex-col items-center text-center p-5 rounded-2xl bg-white dark:bg-slate-800/80 border-2 border-carbon-500/60 dark:border-carbon-500/40 shadow-md relative">
              <div className="absolute -top-3 px-2.5 py-0.5 rounded-full bg-carbon-600 text-white text-[10px] font-bold uppercase tracking-wider">
                Edge Tier
              </div>
              <div className="w-12 h-12 rounded-2xl bg-carbon-50 dark:bg-carbon-950/80 text-carbon-600 dark:text-carbon-400 flex items-center justify-center mb-3">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">2. Local Edge Processing</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
                Micro-datacenters deployed within 5–20km of the user execute latency-sensitive tasks directly without wide-area transit.
              </p>
              <span className="mt-3 text-[11px] font-mono px-2 py-0.5 rounded bg-carbon-50 dark:bg-carbon-900/40 text-carbon-700 dark:text-carbon-300">
                RTT: 5 – 25 ms
              </span>
            </div>

            {/* Step 3: Cloud Datacenter Layer */}
            <div className="flex flex-col items-center text-center p-5 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-cloud-50 dark:bg-cloud-950/80 text-cloud-600 dark:text-cloud-400 flex items-center justify-center mb-3">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">3. Hyperscale Cloud Tier</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
                Deep analytical training and heavy non-deadline batch workloads are handed off to massive central cloud clusters.
              </p>
              <span className="mt-3 text-[11px] font-mono px-2 py-0.5 rounded bg-cloud-50 dark:bg-cloud-900/40 text-cloud-700 dark:text-cloud-300">
                RTT: 60 – 180 ms
              </span>
            </div>
          </div>
        </div>

        {/* Advantages & Limitations 2-column breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-800/60 space-y-3">
            <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-bold text-sm">
              <Shield className="w-4 h-4" />
              <span>Core Advantages of Edge Computing</span>
            </div>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 font-bold">✓</span>
                <span><strong>Ultra-Low Latency:</strong> Reduces round-trip network hops by 70–85%, critical for safety-critical robotics and AR/VR.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 font-bold">✓</span>
                <span><strong>Bandwidth Relief:</strong> Prevents cellular and optical backhaul congestion by pre-filtering raw telemetry locally.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 font-bold">✓</span>
                <span><strong>Location Sensitivity:</strong> Tailors execution directly to regional context and immediate environmental sensors.</span>
              </li>
            </ul>
          </div>

          <div className="p-6 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-800/60 space-y-3">
            <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-bold text-sm">
              <AlertTriangle className="w-4 h-4" />
              <span>Key Limitations of Edge Computing</span>
            </div>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
              <li className="flex items-start gap-2">
                <span className="text-amber-500 font-bold">!</span>
                <span><strong>Finite Compute & Memory:</strong> Edge nodes operate with 4–16 cores and constrained RAM; queue saturation happens quickly.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-500 font-bold">!</span>
                <span><strong>Thermal & Power Bottlenecks:</strong> Local enclosures cannot match the massive liquid cooling efficiencies of hyperscale clouds.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-500 font-bold">!</span>
                <span><strong>Grid Variability:</strong> Power supply at the edge is dependent on local municipal grids, which may be coal-dependent or volatile.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};
