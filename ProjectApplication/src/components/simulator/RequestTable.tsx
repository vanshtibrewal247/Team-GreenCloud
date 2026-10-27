import React, { useState } from 'react';
import { Table, Server, ArrowRight, ArrowDown, MapPin } from 'lucide-react';
import { SimSummary, TraceData } from '../../sim/types';

interface RequestTableProps {
  baselineSummary: SimSummary;
  targetSummary: SimSummary;
  trace: TraceData;
}

export const RequestTable: React.FC<RequestTableProps> = ({
  baselineSummary,
  targetSummary,
  trace,
}) => {
  const [selectedAlg, setSelectedAlg] = useState<'target' | 'baseline'>('target');

  const activeSummary = selectedAlg === 'target' ? targetSummary : baselineSummary;
  const nodeMetrics = activeSummary.nodeMetrics || {};

  return (
    <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-sm space-y-4">
      {/* Header with Algorithm Toggle */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3.5 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center shrink-0">
            <Table className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Per-Node Computational & Offloading Telemetry
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Detailed breakdown of energy emissions, queuing backlogs, and multi-hop offloading volumes
            </p>
          </div>
        </div>

        {/* Algorithm View Toggle */}
        <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800/80 p-1.5 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setSelectedAlg('target')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              selectedAlg === 'target'
                ? 'bg-emerald-500 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {targetSummary.algorithm} (Target)
          </button>
          <button
            type="button"
            onClick={() => setSelectedAlg('baseline')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              selectedAlg === 'baseline'
                ? 'bg-slate-700 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {baselineSummary.algorithm} (Baseline)
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs font-mono">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider">
              <th className="pb-3 font-semibold">Node / City</th>
              <th className="pb-3 font-semibold">Grid Region</th>
              <th className="pb-3 text-right font-semibold">Total Carbon (kg)</th>
              <th className="pb-3 text-right font-semibold">Avg Queue (GB)</th>
              <th className="pb-3 text-right font-semibold">Peak Queue (GB)</th>
              <th className="pb-3 text-right font-semibold text-sky-500">To Peers (GB)</th>
              <th className="pb-3 text-right font-semibold text-indigo-500">To Cloud (GB)</th>
              <th className="pb-3 text-right font-semibold text-emerald-500">Local Processed (GB)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
            {Object.values(nodeMetrics).map(nm => {
              const cityMeta = trace.cities.find(c => c.city === nm.city);
              const meanCi = cityMeta?.mean_carbon_intensity || 0;

              return (
                <tr key={nm.city} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 font-sans font-bold text-slate-900 dark:text-slate-100">
                    {nm.city}
                  </td>
                  <td className="py-3 text-slate-500 dark:text-slate-400">
                    {nm.region} ({meanCi.toFixed(0)} g/kWh)
                  </td>
                  <td className="py-3 text-right font-bold text-slate-800 dark:text-slate-200">
                    {nm.totalCarbonKg.toFixed(2)}
                  </td>
                  <td className="py-3 text-right text-slate-700 dark:text-slate-300">
                    {nm.avgQueueGb.toFixed(2)}
                  </td>
                  <td className="py-3 text-right text-slate-700 dark:text-slate-300">
                    {nm.peakQueueGb.toFixed(1)}
                  </td>
                  <td className="py-3 text-right text-sky-600 dark:text-sky-400 font-semibold">
                    {nm.peerSentGb.toFixed(1)}
                  </td>
                  <td className="py-3 text-right text-indigo-600 dark:text-indigo-400 font-semibold">
                    {nm.cloudSentGb.toFixed(1)}
                  </td>
                  <td className="py-3 text-right text-emerald-600 dark:text-emerald-400 font-semibold">
                    {nm.localProcessedGb.toFixed(1)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
