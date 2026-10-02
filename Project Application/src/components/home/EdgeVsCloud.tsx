import React from 'react';
import { Cpu, Cloud, Check, Clock, Database, Wifi, ShieldAlert, Zap } from 'lucide-react';

export const EdgeVsCloud: React.FC = () => {
  return (
    <section className="py-16 bg-slate-50/50 dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-edge-50 dark:bg-edge-950/60 text-edge-700 dark:text-edge-300 border border-edge-200/60 dark:border-edge-800/60 mb-3">
            <span>Architectural Trade-Offs</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Edge Computing vs Cloud Computing
          </h2>
          <p className="mt-3 text-base text-slate-600 dark:text-slate-400">
            Optimal computing isn't about choosing Edge <em>over</em> Cloud—it is about orchestrating both tiers dynamically based on latency deadlines and carbon intensity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Card 1: Edge Computing */}
          <div className="relative rounded-3xl bg-white dark:bg-slate-900 border-2 border-emerald-500/30 dark:border-emerald-500/20 p-6 sm:p-8 shadow-xl hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <Cpu className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">Edge Tier</h3>
                  <span className="text-xs text-slate-500 font-mono">Decentralized & Proximity-Focused</span>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                Low Latency
              </span>
            </div>

            <ul className="space-y-4 text-sm text-slate-600 dark:text-slate-300">
              <li className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 flex items-center justify-center mt-0.5 shrink-0">
                  <Clock className="w-3 h-3" />
                </div>
                <div>
                  <strong className="text-slate-900 dark:text-white">Ultra-Low Latency:</strong>{' '}
                  Sub-20ms round-trip guarantees fast interactive feedback for time-critical requests.
                </div>
              </li>

              <li className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 flex items-center justify-center mt-0.5 shrink-0">
                  <Wifi className="w-3 h-3" />
                </div>
                <div>
                  <strong className="text-slate-900 dark:text-white">Near End-Users:</strong>{' '}
                  Colocated at 5G gNodeB base stations, smart city poles, and campus gateway nodes.
                </div>
              </li>

              <li className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-amber-100 dark:bg-amber-900/50 text-amber-600 flex items-center justify-center mt-0.5 shrink-0">
                  <ShieldAlert className="w-3 h-3" />
                </div>
                <div>
                  <strong className="text-slate-900 dark:text-white">Constrained Resources:</strong>{' '}
                  Lower CPU MIPS and RAM mean batch parallel tasks quickly trigger queuing bottlenecks.
                </div>
              </li>

              <li className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 flex items-center justify-center mt-0.5 shrink-0">
                  <Zap className="w-3 h-3" />
                </div>
                <div>
                  <strong className="text-slate-900 dark:text-white">Immediate Response:</strong>{' '}
                  Rapid spin-up ideal for streaming perception, obstacle detection, and instant telemetry filters.
                </div>
              </li>
            </ul>

            <div className="mt-8 pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-xs font-mono text-slate-500">
              <span>Typical Capacity: 2,000–8,000 MIPS</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">RTT: 5–30 ms</span>
            </div>
          </div>

          {/* Card 2: Cloud Computing */}
          <div className="relative rounded-3xl bg-white dark:bg-slate-900 border-2 border-cloud-500/30 dark:border-cloud-500/20 p-6 sm:p-8 shadow-xl hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-cloud-100 dark:bg-cloud-950/60 text-cloud-600 dark:text-cloud-400 flex items-center justify-center">
                  <Cloud className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">Cloud Tier</h3>
                  <span className="text-xs text-slate-500 font-mono">Centralized Hyperscale Infrastructure</span>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-cloud-50 dark:bg-cloud-900/40 text-cloud-700 dark:text-cloud-300 border border-cloud-200 dark:border-cloud-800">
                High Capacity
              </span>
            </div>

            <ul className="space-y-4 text-sm text-slate-600 dark:text-slate-300">
              <li className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-cloud-100 dark:bg-cloud-900/50 text-cloud-600 flex items-center justify-center mt-0.5 shrink-0">
                  <Database className="w-3 h-3" />
                </div>
                <div>
                  <strong className="text-slate-900 dark:text-white">Virtually Boundless Compute:</strong>{' '}
                  Elastic auto-scaling across tens of thousands of CPU/GPU cores for heavy neural models.
                </div>
              </li>

              <li className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-cloud-100 dark:bg-cloud-900/50 text-cloud-600 flex items-center justify-center mt-0.5 shrink-0">
                  <Wifi className="w-3 h-3" />
                </div>
                <div>
                  <strong className="text-slate-900 dark:text-white">Centralized Architecture:</strong>{' '}
                  Consolidated state management and global aggregation across multiple regional zones.
                </div>
              </li>

              <li className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-rose-100 dark:bg-rose-900/50 text-rose-600 flex items-center justify-center mt-0.5 shrink-0">
                  <Clock className="w-3 h-3" />
                </div>
                <div>
                  <strong className="text-slate-900 dark:text-white">Higher Transit Latency:</strong>{' '}
                  WAN traversal, cross-region routing, and ISP peering introduce 60–180ms network delay.
                </div>
              </li>

              <li className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-amber-100 dark:bg-amber-900/50 text-amber-600 flex items-center justify-center mt-0.5 shrink-0">
                  <Zap className="w-3 h-3" />
                </div>
                <div>
                  <strong className="text-slate-900 dark:text-white">Power & Resource Intensive:</strong>{' '}
                  Consumes massive megawatts; environmental impact heavily dictated by regional grid generation.
                </div>
              </li>
            </ul>

            <div className="mt-8 pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-xs font-mono text-slate-500">
              <span>Typical Capacity: 20,000–100,000+ MIPS</span>
              <span className="text-cloud-600 dark:text-cloud-400 font-semibold">RTT: 60–150+ ms</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
