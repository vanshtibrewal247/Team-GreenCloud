import React, { useState } from 'react';
import { Leaf, Sun, Wind, Flame, Compass, ArrowRight, Clock, MapPin } from 'lucide-react';

export const CarbonAware: React.FC = () => {
  const [selectedTime, setSelectedTime] = useState<'day' | 'night'>('day');

  return (
    <section className="py-16 bg-white dark:bg-slate-900 border-t border-b border-slate-200/80 dark:border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-carbon-50 dark:bg-carbon-950/60 text-carbon-700 dark:text-carbon-300 border border-carbon-200/60 dark:border-carbon-800/60 mb-3">
            <Leaf className="w-3.5 h-3.5 text-carbon-500" />
            <span>Sustainable Computing Challenge</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            The Carbon-Aware Computing Paradigm
          </h2>
          <blockquote className="mt-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border-l-4 border-carbon-500 text-sm sm:text-base text-slate-700 dark:text-slate-300 italic max-w-2xl mx-auto">
            "Not all computation has the same environmental impact. The carbon footprint of computation can vary drastically depending on <strong>where</strong> and <strong>when</strong> workloads are executed."
          </blockquote>
        </div>

        {/* Dynamic Interactive Demonstration: Spatial & Temporal Carbon Variation */}
        <div className="rounded-3xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Compass className="w-5 h-5 text-carbon-500" />
                <span>Simulating Task Offload Footprint</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Observe how the same 1,000 MIPS batch task generates vastly different CO₂ emissions based on execution target and time of day.
              </p>
            </div>

            {/* Time toggle */}
            <div className="flex items-center gap-1 bg-slate-200 dark:bg-slate-800 p-1 rounded-xl text-xs font-medium">
              <button
                onClick={() => setSelectedTime('day')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
                  selectedTime === 'day'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm font-semibold'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                <Sun className="w-3.5 h-3.5 text-amber-500" />
                <span>1:00 PM (Solar Peak)</span>
              </button>
              <button
                onClick={() => setSelectedTime('night')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
                  selectedTime === 'night'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm font-semibold'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                <Clock className="w-3.5 h-3.5 text-indigo-400" />
                <span>8:00 PM (Thermal Night)</span>
              </button>
            </div>
          </div>

          {/* Three Candidate Locations Visualizer */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Location 1: Delhi Edge */}
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-rose-500" />
                  <span className="text-sm font-bold text-slate-900 dark:text-white">Delhi Edge Node</span>
                </div>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900">
                  {selectedTime === 'day' ? '620 gCO₂/kWh' : '740 gCO₂/kWh'}
                </span>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs text-slate-500">
                  <span>Grid Generation:</span>
                  <span className="text-slate-700 dark:text-slate-300 font-medium">Thermal / Coal Baseline</span>
                </div>
                <div className="flex justify-between text-xs text-slate-500">
                  <span>Latency:</span>
                  <span className="text-emerald-600 font-bold">18 ms (Ultra-low)</span>
                </div>
              </div>

              {/* Carbon meter */}
              <div>
                <div className="flex justify-between text-[11px] font-mono mb-1 text-slate-400">
                  <span>Emissions for 1,000 MIPS:</span>
                  <span className="text-rose-600 dark:text-rose-400 font-bold">
                    {selectedTime === 'day' ? '0.048 kg CO₂' : '0.059 kg CO₂'}
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-rose-500 rounded-full transition-all duration-500"
                    style={{ width: selectedTime === 'day' ? '75%' : '90%' }}
                  />
                </div>
              </div>

              <p className="text-[11px] text-slate-500 leading-relaxed">
                Great latency, but high carbon intensity due to fossil thermal dominance in the local grid.
              </p>
            </div>

            {/* Location 2: Bengaluru Edge */}
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border-2 border-carbon-500/50 dark:border-carbon-500/40 space-y-4 relative">
              <div className="absolute -top-3 right-4 px-2 py-0.5 rounded-full bg-carbon-600 text-white text-[10px] font-bold uppercase">
                {selectedTime === 'day' ? 'Cleanest Choice' : 'Moderate'}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-emerald-500" />
                  <span className="text-sm font-bold text-slate-900 dark:text-white">Bengaluru Edge</span>
                </div>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900">
                  {selectedTime === 'day' ? '280 gCO₂/kWh' : '460 gCO₂/kWh'}
                </span>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs text-slate-500">
                  <span>Grid Generation:</span>
                  <span className="text-slate-700 dark:text-slate-300 font-medium">Pavagada Solar Park 48%</span>
                </div>
                <div className="flex justify-between text-xs text-slate-500">
                  <span>Latency:</span>
                  <span className="text-emerald-600 font-bold">24 ms (Fast)</span>
                </div>
              </div>

              {/* Carbon meter */}
              <div>
                <div className="flex justify-between text-[11px] font-mono mb-1 text-slate-400">
                  <span>Emissions for 1,000 MIPS:</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                    {selectedTime === 'day' ? '0.019 kg CO₂ (-60%)' : '0.034 kg CO₂'}
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                    style={{ width: selectedTime === 'day' ? '32%' : '56%' }}
                  />
                </div>
              </div>

              <p className="text-[11px] text-slate-500 leading-relaxed">
                During solar peak (1 PM), carbon intensity plunges by over 40%, making local edge execution exceptionally clean.
              </p>
            </div>

            {/* Location 3: Green Cloud Datacenter */}
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-cloud-500" />
                  <span className="text-sm font-bold text-slate-900 dark:text-white">Cloud (Europe West)</span>
                </div>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-cloud-50 dark:bg-cloud-950/60 text-cloud-600 dark:text-cloud-400 border border-cloud-200 dark:border-cloud-900">
                  210 gCO₂/kWh
                </span>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs text-slate-500">
                  <span>Grid Generation:</span>
                  <span className="text-slate-700 dark:text-slate-300 font-medium">Offshore Wind + Nuclear</span>
                </div>
                <div className="flex justify-between text-xs text-slate-500">
                  <span>Latency:</span>
                  <span className="text-amber-500 font-bold">120 ms (Trans-oceanic)</span>
                </div>
              </div>

              {/* Carbon meter */}
              <div>
                <div className="flex justify-between text-[11px] font-mono mb-1 text-slate-400">
                  <span>Emissions for 1,000 MIPS:</span>
                  <span className="text-cloud-600 dark:text-cloud-400 font-bold">0.016 kg CO₂</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-cloud-500 rounded-full transition-all duration-500"
                    style={{ width: '25%' }}
                  />
                </div>
              </div>

              <p className="text-[11px] text-slate-500 leading-relaxed">
                Extremely low carbon profile, but higher latency means it is only suitable for non-urgent batch tasks.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
