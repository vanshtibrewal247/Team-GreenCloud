import React, { useEffect } from 'react';
import { SimulationResult } from '../../types/simulation';
import { Trophy, Sparkles, Leaf, Zap, Clock, ShieldCheck, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

interface WinnerSummaryProps {
  result: SimulationResult;
  onExploreResearch: () => void;
}

export const WinnerSummary: React.FC<WinnerSummaryProps> = ({ result, onExploreResearch }) => {
  const {
    winnerModel,
    model1Metrics,
    model2Metrics,
    carbonReductionPct,
    energyReductionPct,
    latencyReductionPct,
    successRateDeltaPct,
    keyTakeaway,
  } = result;

  const winnerMetrics = winnerModel === 1 ? model1Metrics : model2Metrics;
  const isProposedWinner = winnerMetrics.isProposed;

  useEffect(() => {
    // Subtle celebratory confetti
    try {
      confetti({
        particleCount: 45,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#10b981', '#06b6d4', '#3b82f6'],
      });
    } catch {
      // ignore
    }
  }, [result.id]);

  return (
    <div className="relative rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border-2 border-carbon-500/50 p-6 sm:p-10 text-white shadow-2xl overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-carbon-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-cloud-500/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 space-y-6">
        {/* Top Winner Label */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 flex items-center justify-center shadow-lg shadow-amber-500/20">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-carbon-400">
                Performance Verdict
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                Which model performed better?
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300">
              Simulation Preview • Demo Results
            </span>
          </div>
        </div>

        {/* Winner Highlight Box */}
        <div className="p-6 rounded-2xl bg-slate-800/80 border border-carbon-500/40 space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-lg sm:text-xl font-bold text-white">
              {winnerMetrics.algorithmName}
            </span>
            {isProposedWinner && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-carbon-500 text-white text-xs font-bold uppercase">
                <Sparkles className="w-3 h-3" />
                Proposed Framework
              </span>
            )}
          </div>
          <p className="text-sm text-slate-300 leading-relaxed font-normal">
            {keyTakeaway}
          </p>
        </div>

        {/* 4 Hero Advantage Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 text-left space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-carbon-400 font-mono">
              <Leaf className="w-4 h-4" />
              <span>Carbon Reduction</span>
            </div>
            <div className="text-2xl font-extrabold text-white">
              {carbonReductionPct >= 0 ? `${carbonReductionPct}% lower` : `${Math.abs(carbonReductionPct)}% higher`}
            </div>
            <div className="text-[11px] text-slate-400">Avoided dirty grid hours</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 text-left space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-amber-400 font-mono">
              <Zap className="w-4 h-4" />
              <span>Energy Efficiency</span>
            </div>
            <div className="text-2xl font-extrabold text-white">
              {energyReductionPct >= 0 ? `${energyReductionPct}% lower` : `${Math.abs(energyReductionPct)}% higher`}
            </div>
            <div className="text-[11px] text-slate-400">Computational kWh saved</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 text-left space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-cloud-400 font-mono">
              <Clock className="w-4 h-4" />
              <span>Response Latency</span>
            </div>
            <div className="text-2xl font-extrabold text-white">
              {latencyReductionPct >= 0 ? `${latencyReductionPct}% faster` : `${Math.abs(latencyReductionPct)}% slower`}
            </div>
            <div className="text-[11px] text-slate-400">Tail queue avoidance</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 text-left space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-mono">
              <ShieldCheck className="w-4 h-4" />
              <span>SLA Success Rate</span>
            </div>
            <div className="text-2xl font-extrabold text-white">
              {successRateDeltaPct >= 0 ? `+${successRateDeltaPct}% higher` : `${successRateDeltaPct}%`}
            </div>
            <div className="text-[11px] text-slate-400">Completed within deadline</div>
          </div>
        </div>

        {/* CTA to Research Basis */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-800 text-xs">
          <span className="text-slate-400">
            Want to learn how the multi-horizon forecasting mathematical model works?
          </span>
          <button
            onClick={onExploreResearch}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-carbon-600 hover:bg-carbon-700 text-white font-semibold transition-all shadow-md shadow-carbon-600/20"
          >
            <span>Read Research Basis & Methodology</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
