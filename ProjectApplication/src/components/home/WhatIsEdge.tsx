import React from 'react';
import { Smartphone, Zap, Shield, AlertTriangle, Layers, Info } from 'lucide-react';

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
            Edge computing brings computing resources closer to end users, which can reduce latency and improve quality of service for delay-sensitive IoT applications. Cloud computing offers substantial computing power but may not meet the stringent latency requirements of many IoT applications.
          </p>
        </div>

        {/* Visual Architecture Diagram */}
        <div className="mb-8 p-6 sm:p-8 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 relative overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            {/* Step 1: User / IoT Layer */}
            <div className="flex flex-col items-center text-center p-5 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-3">
                <Smartphone className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">1. IoT Devices Tier</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
                Connected end devices and sensors produce dynamic computational tasks requiring timely processing.
              </p>
              <span className="mt-3 text-[11px] font-mono px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-300">
                Workload Generation Aᵢ(t)
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
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">2. Edge Server Tier</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
                Geo-distributed edge servers deployed close to end users, processing tasks locally or offloading horizontally/vertically.
              </p>
              <span className="mt-3 text-[11px] font-mono px-2 py-0.5 rounded bg-carbon-50 dark:bg-carbon-900/40 text-carbon-700 dark:text-carbon-300">
                Local Queue Qᵢ(t) &amp; CPU fᵢ(t)
              </span>
            </div>

            {/* Step 3: Cloud Datacenter Layer */}
            <div className="flex flex-col items-center text-center p-5 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-cloud-50 dark:bg-cloud-950/80 text-cloud-600 dark:text-cloud-400 flex items-center justify-center mb-3">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">3. Centralized Cloud Tier</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
                Centralized datacenter offering substantial computing power for vertically offloaded workloads.
              </p>
              <span className="mt-3 text-[11px] font-mono px-2 py-0.5 rounded bg-cloud-50 dark:bg-cloud-900/40 text-cloud-700 dark:text-cloud-300">
                Cloud Queue Qᵢᶜˡᵒᵘᵈ(t) &amp; CPU fᵢᶜˡᵒᵘᵈ(t)
              </span>
            </div>
          </div>
        </div>

        {/* Global Carbon Emissions Context Note */}
        <div className="mb-12 p-4 rounded-2xl bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 flex items-start gap-3">
          <Info className="w-5 h-5 text-carbon-500 shrink-0 mt-0.5" />
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            <strong>Environmental Context:</strong> Edge infrastructure is part of the ICT sector, which could account for up to 14% of global carbon emissions by 2040 if trends continue unchecked (Belkhir &amp; Elmeligi, 2018).
          </p>
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
                <span><strong>Closer to Users:</strong> Brings computing resources nearer to data sources and end devices.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 font-bold">✓</span>
                <span><strong>Suited for Delay-Sensitive Tasks:</strong> Improves quality of service for delay-sensitive IoT applications.</span>
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
                <span><strong>Constrained Computing Power &amp; Resources:</strong> Edge servers have limited CPU capacity and buffer sizes compared to the cloud.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-500 font-bold">!</span>
                <span><strong>Geo-Distributed &amp; Heterogeneous:</strong> Edge servers operate across different physical environments with disparate capabilities.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-500 font-bold">!</span>
                <span><strong>Dynamic IoT Workloads:</strong> Unpredictable task arrival rates can rapidly lead to local queue backlogs and congestion.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-500 font-bold">!</span>
                <span><strong>Varying Carbon Intensity:</strong> Carbon intensity of the local electricity grid varies significantly by geographical location and time.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};
