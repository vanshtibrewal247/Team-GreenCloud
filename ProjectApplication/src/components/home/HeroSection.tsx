import React, { useState } from 'react';
import { ArrowRight, Activity, Cloud, Cpu, Leaf, Radio, Zap, Clock } from 'lucide-react';

interface HeroSectionProps {
  onExploreSimulator: () => void;
  onExploreResearch: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onExploreSimulator,
  onExploreResearch,
}) => {
  const [activeTab, setActiveTab] = useState<'realtime' | 'predicted'>('predicted');

  return (
    <section className="relative pt-8 pb-16 lg:pt-14 lg:pb-24 overflow-hidden">
      {/* Background ambient gradient blurs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-carbon-400/20 via-cloud-400/15 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-10 right-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Hero Copy */}
          <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.12]">
              Smarter Offloading. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cloud-600 to-indigo-600 dark:from-cloud-400 dark:to-indigo-400">
                Lower Latency.
              </span>{' '}
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-carbon-600 to-emerald-500 dark:from-carbon-400 dark:to-emerald-400">
                Lower Carbon.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
              An intelligent edge-cloud task offloading framework that considers system performance, energy consumption, and carbon intensity to make more sustainable computing decisions.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={onExploreSimulator}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-carbon-600 via-emerald-600 to-teal-600 hover:from-carbon-700 hover:to-teal-700 text-white font-semibold text-sm shadow-lg shadow-carbon-600/25 transition-all hover:scale-[1.02] hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-carbon-500"
              >
                <span>Try the Simulator</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onExploreResearch}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold text-sm transition-all shadow-sm hover:border-slate-300 dark:hover:border-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-400"
              >
                <span>Explore the Research</span>
              </button>
            </div>

            {/* Micro Highlights */}
            <div className="pt-4 flex items-center justify-center lg:justify-start gap-6 text-xs text-slate-600 dark:text-slate-300 font-medium">
              <div className="flex items-center gap-1.5">
                <Leaf className="w-4 h-4 text-carbon-500" />
                <span>31.4% CO₂ Cut</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-cloud-500" />
                <span>Sub-50ms Latency</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-500" />
                <span>Pareto Optimal</span>
              </div>
            </div>
          </div>

          {/* Right Hero Visual: Architectural Offloading Diagram */}
          <div className="lg:col-span-6">
            <div className="relative rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900/95 to-slate-950 p-6 sm:p-8 text-white border border-slate-800 shadow-2xl overflow-hidden">
              {/* Inner ambient glow */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-carbon-500/20 rounded-full blur-2xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-cloud-500/20 rounded-full blur-2xl pointer-events-none" />

              {/* Header Bar */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
                    <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
                    <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
                  </div>
                  <span className="text-xs font-mono text-slate-400 ml-2">
                    topology::live_offloader.py
                  </span>
                </div>

                <div className="flex items-center bg-slate-800/80 p-1 rounded-lg border border-slate-700 text-[11px] font-mono">
                  <button
                    onClick={() => setActiveTab('realtime')}
                    className={`px-2.5 py-0.5 rounded ${
                      activeTab === 'realtime'
                        ? 'bg-slate-700 text-white font-medium'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Reactive
                  </button>
                  <button
                    onClick={() => setActiveTab('predicted')}
                    className={`px-2.5 py-0.5 rounded ${
                      activeTab === 'predicted'
                        ? 'bg-carbon-600 text-white font-medium'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Forecast-Driven ★
                  </button>
                </div>
              </div>

              {/* Visual Offloading Canvas */}
              <div className="space-y-6">
                {/* Layer 1: IoT Edge Ingestion */}
                <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/70 relative">
                  <div className="flex items-center justify-between text-xs mb-2">
                    <div className="flex items-center gap-2 text-cloud-300 font-semibold">
                      <Radio className="w-4 h-4 text-cloud-400 animate-pulse" />
                      <span>IoT Devices & User Edge Tier</span>
                    </div>
                    <span className="font-mono text-[11px] text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/60">
                      1,240 req/sec incoming
                    </span>
                  </div>

                  {/* Flow animation representation */}
                  <div className="flex items-center justify-between gap-2 pt-1">
                    {[
                      { label: 'Smart Sensor #A', delay: '0s' },
                      { label: 'Mobile QoS #B', delay: '0.3s' },
                      { label: 'Vision Stream #C', delay: '0.6s' },
                    ].map((dev, i) => (
                      <div
                        key={i}
                        className="flex-1 p-2 rounded-xl bg-slate-900/80 border border-slate-700/50 text-[11px] text-center font-mono text-slate-300"
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-cloud-400 mx-auto mb-1 animate-ping" />
                        {dev.label}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Layer 2: The Forecasting Engine */}
                <div className="relative py-1">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-full border-t border-dashed border-slate-700" />
                  </div>
                  <div className="relative flex justify-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-carbon-950 border border-carbon-500/50 text-[11px] font-mono text-carbon-300 shadow-lg shadow-carbon-950">
                      <Leaf className="w-3.5 h-3.5 text-carbon-400" />
                      <span>
                        {activeTab === 'predicted'
                          ? 'Forecasting Module: Grid Carbon Dip Detected (-38% in 15m)'
                          : 'Reactive Mode: Instantaneous snapshot only'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Layer 3: Edge Servers & Cloud Destination Nodes */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Edge Server Node */}
                  <div className="p-3.5 rounded-2xl bg-gradient-to-br from-slate-800/90 to-slate-900 border border-emerald-500/40 relative group">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-1.5">
                        <Cpu className="w-4 h-4 text-emerald-400" />
                        <span className="text-xs font-semibold text-emerald-300">Local Edge (Delhi)</span>
                      </div>
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    </div>
                    <div className="space-y-1.5 text-[11px] font-mono text-slate-300">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Latency:</span>
                        <span className="text-white font-bold">18.4 ms</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Carbon Intensity:</span>
                        <span className="text-amber-300 font-bold">540 gCO₂/kWh</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Target Queue:</span>
                        <span className="text-emerald-400">Optimal (38%)</span>
                      </div>
                    </div>
                  </div>

                  {/* Cloud Datacenter Node */}
                  <div className="p-3.5 rounded-2xl bg-gradient-to-br from-slate-800/90 to-slate-900 border border-cloud-500/40 relative">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-1.5">
                        <Cloud className="w-4 h-4 text-cloud-400" />
                        <span className="text-xs font-semibold text-cloud-300">Green Cloud (Frankfurt)</span>
                      </div>
                      <span className="w-2 h-2 rounded-full bg-cloud-400 animate-pulse" />
                    </div>
                    <div className="space-y-1.5 text-[11px] font-mono text-slate-300">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Latency:</span>
                        <span className="text-white font-bold">78.2 ms</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Carbon Intensity:</span>
                        <span className="text-emerald-400 font-bold">210 gCO₂/kWh</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Capacity:</span>
                        <span className="text-cloud-400">Massive High-MIPS</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Decision Banner */}
                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] font-mono flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-carbon-400" />
                    <span className="text-slate-300">Offloading Decision:</span>
                  </div>
                  <span className="text-carbon-400 font-semibold">
                    {activeTab === 'predicted'
                      ? 'Route urgent to Edge (18ms) • Defer batch to Low-Carbon Cloud'
                      : 'Greedy placement on nearest edge (risking congestion)'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
