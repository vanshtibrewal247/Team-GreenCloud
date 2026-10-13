import React from 'react';
import { ArrowRight, Play, Sparkles } from 'lucide-react';

interface FinalCtaProps {
  onRunSimulation: () => void;
}

export const FinalCta: React.FC<FinalCtaProps> = ({ onRunSimulation }) => {
  return (
    <section className="py-20 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 border border-slate-800 p-8 sm:p-14 text-center overflow-hidden shadow-2xl">
          {/* Ambient decorative glow */}
          <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-64 h-64 bg-carbon-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-64 h-64 bg-cloud-500/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            {/* <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-800 border border-slate-700 text-xs font-mono text-carbon-400">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Interactive Experimentation Sandbox</span>
            </div> */}

            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Ready to see the difference?
            </h2>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Step into the Simulation Lab. Adjust edge topology, dial in workload bursts, compare traditional heuristic algorithms against our proposed forecast-driven approach, and inspect real-time Pareto trade-offs.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={onRunSimulation}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-carbon-500 via-emerald-500 to-teal-500 hover:from-carbon-600 hover:to-teal-600 text-white font-bold text-sm sm:text-base shadow-xl shadow-carbon-500/25 transition-all hover:scale-105 active:scale-95"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Run a Simulation →</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
