import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, Filter, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { SimConfig, TraceData } from '../../sim/types';

interface AssumptionsPanelProps {
  config: SimConfig;
  trace: TraceData;
  calibratedV: number;
}

export type SourceType = 'Paper' | 'Dataset' | 'Assumed' | 'Paper + Dataset';

export interface AssumptionRow {
  id: string;
  item: string;
  value: string;
  source: SourceType;
  why: string;
}

export const AssumptionsPanel: React.FC<AssumptionsPanelProps> = ({
  config,
  trace,
  calibratedV,
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const [filter, setFilter] = useState<'all' | 'assumed'>('all');

  // Compute live values from config and trace
  const slotSec = config.slotLengthHours * 3600;
  const tOffSec = slotSec * config.tOffRatio.value;
  const tCmpSec = slotSec * (1 - config.tOffRatio.value);
  const linkBwMbps = config.edgeBandwidthMbps.value;
  const maxGbPerLinkSlot = (linkBwMbps * 1e6 * tOffSec) / 8e9;

  const totalCloudCores = trace.cloud.total_cores;
  const numEdgeNodes = Math.max(1, config.selectedCities.length);
  const cloudCoresPerNode = Math.floor(totalCloudCores / numEdgeNodes);
  const cloudGhzPerNode = (cloudCoresPerNode * config.cloudGhzPerCore.value).toFixed(1);

  const vMultiplier = config.v.value / (calibratedV || 1);

  const selectedSharesStr = config.selectedCities
    .map(c => `${c}: ${trace.city_workload_shares[c] || '10'}%`)
    .join(', ');

  const wrappedPct = ((trace.wrapped_rows / (trace.total_tasks || 1)) * 100).toFixed(1);

  // 14 Rows specified in requirements
  const allRows: AssumptionRow[] = [
    {
      id: 'phi',
      item: 'Cycles per bit (φ)',
      value: `${config.phi.value.toLocaleString()} cycles/bit`,
      source: 'Assumed',
      why: 'Not in the dataset. Auto-calibrated so average edge utilization is about 70%; otherwise queues stay empty or grow without limit and the algorithms cannot be compared.',
    },
    {
      id: 'ghz',
      item: 'GHz per core (edge and cloud)',
      value: `Edge: ${config.edgeGhzPerCore.value.toFixed(1)} GHz, Cloud: ${config.cloudGhzPerCore.value.toFixed(1)} GHz`,
      source: 'Assumed',
      why: 'The dataset gives core counts, not clock speed.',
    },
    {
      id: 'power_model',
      item: 'CPU power model',
      value: `P = ξ·f³ (Edge full-load: ${config.edgeFullLoadPowerWatts.value} W, Cloud: ${config.cloudFullLoadPowerWatts.value} W)`,
      source: 'Paper + Dataset',
      why: "The paper's model, calibrated so power at maximum frequency equals the dataset's 432 W.",
    },
    {
      id: 'cloud_per_edge',
      item: 'Cloud capacity per edge node',
      value: `${cloudCoresPerNode} cores/node (${cloudGhzPerNode} GHz max) [${totalCloudCores} total cores split across ${numEdgeNodes} nodes]`,
      source: 'Assumed',
      why: 'The dataset gives total cloud cores, not a per-edge share.',
    },
    {
      id: 'link_rate',
      item: 'Link rate',
      value: `Capped at ${(linkBwMbps / 1000).toFixed(1)} Gbps (${linkBwMbps.toLocaleString()} Mbps); Max GB/link/slot = ${maxGbPerLinkSlot.toFixed(2)} GB`,
      source: 'Dataset',
      why: 'The dataset gives 25 Gbps links.',
    },
    {
      id: 'wireless_timing',
      item: 'Channel gain, transmit power, noise, transfer/compute split of each slot, transmission energy',
      value: `g = ${config.channelGainG.value.toExponential(1)}, p_max = ${config.pMax.value} W, N0 = ${config.n0Dbm.value} dBm; Transfer split = ${(config.tOffRatio.value * 100).toFixed(0)}% (${tOffSec}s), Compute split = ${(100 - config.tOffRatio.value * 100).toFixed(0)}% (${tCmpSec}s)`,
      source: 'Assumed',
      why: 'Not given by the paper or the dataset.',
    },
    {
      id: 'lyapunov_v',
      item: 'Lyapunov V',
      value: `Calibrated V = ${calibratedV.toExponential(3)} (Current = ${config.v.value.toExponential(3)}, ${vMultiplier.toFixed(2)}x)`,
      source: 'Assumed',
      why: "Chosen so DWPA's average queue is about 15% of one slot's arrivals. DWPA, Vertical-Only, Horizontal-First and YCL-24 share this V.",
    },
    {
      id: 'carbon_intensity',
      item: 'Hourly carbon intensity',
      value: `Mean of task rows in each hour; ${trace.empty_hours_filled} hours forward-filled, ${trace.wrapped_rows} rows replayed/wrapped (${wrappedPct}%)`,
      source: 'Dataset',
      why: 'The dataset has carbon values only at task timestamps.',
    },
    {
      id: 'carbon_estimate',
      item: 'Carbon estimate',
      value: `EMA of current hour with α = ${config.emaAlpha.value.toFixed(2)}; online/reactive tracking with no future forecasting`,
      source: 'Paper',
      why: 'The approach is online and reactive.',
    },
    {
      id: 'arrival_model',
      item: 'Arrival model',
      value: `Real empirical task trace (${trace.total_tasks.toLocaleString()} tasks, ${trace.total_workload_gb.toLocaleString()} GB total workload, arrival scale: ${config.arrivalScale.value.toFixed(1)}x)`,
      source: 'Dataset',
      why: "Real traffic is more realistic; results will not match the paper's figures.",
    },
    {
      id: 'topology',
      item: 'Topology',
      value: `${config.selectedCities.length} selected US cities and 1 California cloud DC. Workload shares: ${selectedSharesStr}`,
      source: 'Dataset',
      why: "Paper uses 5 cities and a Berkeley County cloud. On this dataset, Los Angeles is ~21%, and the other 8 cities are ~10% each.",
    },
    {
      id: 'counterparts',
      item: 'Counterparts ICSOC-19, DOLA-22, YCL-24',
      value: 'Algorithmic approximations (ICSOC-19: Greedy min CI, DOLA-22: Queue balancing, YCL-24: Static mean CI)',
      source: 'Assumed',
      why: "Implemented from the paper's one-sentence descriptions, not the original authors' code.",
    },
    {
      id: 'freq_rule_baselines',
      item: 'Frequency rule for non-Lyapunov algorithms',
      value: 'Queue-clearing frequency f = min(f_max, Q·φ/T_cmp) for Local-First, ICSOC-19 and DOLA-22',
      source: 'Assumed',
      why: 'The paper does not specify it; this avoids charging them for idle power.',
    },
    {
      id: 'not_modeled',
      item: 'Not modeled',
      value: 'Latency, memory, GPU, task priority, deadlines, idle power, embodied carbon',
      source: 'Paper',
      why: 'The paper does not model them.',
    },
  ];

  const displayedRows = filter === 'assumed'
    ? allRows.filter(r => r.source === 'Assumed')
    : allRows;

  const getSourceBadge = (source: SourceType) => {
    switch (source) {
      case 'Paper':
        return (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-50 dark:bg-sky-950/70 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800 shrink-0">
            Paper
          </span>
        );
      case 'Dataset':
        return (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 shrink-0">
            Dataset
          </span>
        );
      case 'Assumed':
        return (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 shrink-0">
            Assumed
          </span>
        );
      case 'Paper + Dataset':
        return (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-50 dark:bg-purple-950/70 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 shrink-0">
            Paper + Dataset
          </span>
        );
    }
  };

  return (
    <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm transition-all overflow-hidden">
      {/* Header with Collapsible Toggle and Source Filter */}
      <div className="p-5 sm:p-6 flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          className="flex items-center gap-2.5 text-left focus:outline-none group cursor-pointer"
        >
          <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Assumptions & Limits
              </h3>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                Methodology Transparency
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Source taxonomy, engineering calibrations, and physical bounds governing this simulation
            </p>
          </div>
          <div className="ml-2 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200">
            {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </div>
        </button>

        {/* Top Filter: All | Assumed only */}
        {isOpen && (
          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setFilter('all')}
              className={`px-3 py-1 rounded-xl transition-all ${
                filter === 'all'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              All ({allRows.length})
            </button>
            <button
              type="button"
              onClick={() => setFilter('assumed')}
              className={`px-3 py-1 rounded-xl transition-all ${
                filter === 'assumed'
                  ? 'bg-amber-500 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Assumed only ({allRows.filter(r => r.source === 'Assumed').length})
            </button>
          </div>
        )}
      </div>

      {/* Collapsible Content */}
      {isOpen && (
        <div className="p-5 sm:p-6 space-y-4 animate-in fade-in duration-200">
          {/* Assumptions Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider">
                  <th className="pb-3 font-semibold w-1/4">Item</th>
                  <th className="pb-3 font-semibold w-1/3">Value used</th>
                  <th className="pb-3 font-semibold w-24">Source</th>
                  <th className="pb-3 font-semibold">Why</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {displayedRows.map(row => (
                  <tr
                    key={row.id}
                    className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
                  >
                    <td className="py-3 pr-3 font-semibold text-slate-900 dark:text-slate-100 align-top">
                      {row.item}
                    </td>
                    <td className="py-3 pr-3 font-mono text-slate-700 dark:text-slate-300 align-top text-[11px] leading-relaxed">
                      {row.value}
                    </td>
                    <td className="py-3 pr-3 align-top">
                      {getSourceBadge(row.source)}
                    </td>
                    <td className="py-3 text-slate-600 dark:text-slate-400 align-top text-xs leading-relaxed">
                      {row.why}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Always Visible Footer Note */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80">
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/60 text-xs text-slate-600 dark:text-slate-300 flex items-start gap-2.5">
              <ShieldAlert className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                Comparisons between algorithms are meaningful. Absolute values (kg CO2, GB) depend on the assumed parameters and are not predictions. Results will not match the paper's figures.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
