import React from 'react';
import { Cpu, Cloud, MapPin, Layers, Server, Zap, ShieldAlert, Check } from 'lucide-react';

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
            The paper's system uses both: edge servers can offload to the cloud (vertical) and to each other (horizontal).
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
                  <span className="text-xs text-slate-500 font-mono">Decentralized &amp; Proximity-Focused</span>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                Proximity Tier
              </span>
            </div>

            <ul className="space-y-4 text-sm text-slate-600 dark:text-slate-300">
              <li className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 flex items-center justify-center mt-0.5 shrink-0">
                  <Check className="w-3 h-3" />
                </div>
                <div>
                  <strong className="text-slate-900 dark:text-white">Close to Users:</strong>{' '}
                  Positioned near the edge devices and data sources, facilitating responsive processing for delay-sensitive tasks.
                </div>
              </li>

              <li className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-amber-100 dark:bg-amber-900/50 text-amber-600 flex items-center justify-center mt-0.5 shrink-0">
                  <ShieldAlert className="w-3 h-3" />
                </div>
                <div>
                  <strong className="text-slate-900 dark:text-white">Constrained Computing Power:</strong>{' '}
                  Restricted CPU processing capacity and local queues that require cooperative load distribution.
                </div>
              </li>

              <li className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 flex items-center justify-center mt-0.5 shrink-0">
                  <Layers className="w-3 h-3" />
                </div>
                <div>
                  <strong className="text-slate-900 dark:text-white">Distributed Across Locations:</strong>{' '}
                  Heterogeneous edge servers deployed in distinct geographic regions with peer-to-peer transmission links.
                </div>
              </li>

              <li className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 flex items-center justify-center mt-0.5 shrink-0">
                  <MapPin className="w-3 h-3" />
                </div>
                <div>
                  <strong className="text-slate-900 dark:text-white">Location-Specific Carbon Intensity:</strong>{' '}
                  Each regional edge server draws power from its local electricity grid, subject to dynamic local carbon intensity rates kᵢ(t).
                </div>
              </li>
            </ul>
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
                  <span className="text-xs text-slate-500 font-mono">Centralized Infrastructure</span>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-cloud-50 dark:bg-cloud-900/40 text-cloud-700 dark:text-cloud-300 border border-cloud-200 dark:border-cloud-800">
                High Capacity
              </span>
            </div>

            <ul className="space-y-4 text-sm text-slate-600 dark:text-slate-300">
              <li className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-cloud-100 dark:bg-cloud-900/50 text-cloud-600 flex items-center justify-center mt-0.5 shrink-0">
                  <Server className="w-3 h-3" />
                </div>
                <div>
                  <strong className="text-slate-900 dark:text-white">Substantial Computing Capacity:</strong>{' '}
                  Massive centralized server clusters capable of handling intensive computing workloads beyond edge capabilities.
                </div>
              </li>

              <li className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-cloud-100 dark:bg-cloud-900/50 text-cloud-600 flex items-center justify-center mt-0.5 shrink-0">
                  <Zap className="w-3 h-3" />
                </div>
                <div>
                  <strong className="text-slate-900 dark:text-white">Centralized Architecture:</strong>{' '}
                  Aggregated computing facilities located remotely from the distributed IoT devices.
                </div>
              </li>

              <li className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-amber-100 dark:bg-amber-900/50 text-amber-600 flex items-center justify-center mt-0.5 shrink-0">
                  <ShieldAlert className="w-3 h-3" />
                </div>
                <div>
                  <strong className="text-slate-900 dark:text-white">Latency Considerations:</strong>{' '}
                  Due to network propagation and remote location, cloud computing may not meet the stringent latency requirements of many IoT applications.
                </div>
              </li>

              <li className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-cloud-100 dark:bg-cloud-900/50 text-cloud-600 flex items-center justify-center mt-0.5 shrink-0">
                  <MapPin className="w-3 h-3" />
                </div>
                <div>
                  <strong className="text-slate-900 dark:text-white">Power Supply Carbon Intensity:</strong>{' '}
                  Governed by its own regional grid power supply carbon intensity kᶜˡᵒᵘᵈ(t), independent of edge site locations.
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};
