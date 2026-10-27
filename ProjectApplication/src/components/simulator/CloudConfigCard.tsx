import React from 'react';
import { Cloud, Wifi, Cpu, MapPin } from 'lucide-react';
import { SimConfig, TraceData } from '../../sim/types';

interface CloudConfigCardProps {
  config: SimConfig;
  trace: TraceData;
  onChange: (updated: SimConfig) => void;
}

export const CloudConfigCard: React.FC<CloudConfigCardProps> = ({
  config,
  trace,
  onChange,
}) => {
  const cloudData = trace.cloud;

  const handleGhzChange = (ghz: number) => {
    onChange({
      ...config,
      cloudGhzPerCore: {
        ...config.cloudGhzPerCore,
        value: ghz,
      },
    });
  };

  return (
    <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-sm hover:shadow-md transition-shadow">
      {/* Card Header */}
      <div className="flex items-start justify-between gap-3 pb-3.5 mb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-start gap-2.5 min-w-0 flex-1">
          <div className="w-9 h-9 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0">
            <Cloud className="w-5 h-5" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Cloud Configuration
              </h3>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-sky-100 dark:bg-sky-950/80 text-sky-700 dark:text-sky-400 border border-sky-200 dark:border-sky-800">
                California Hyperscale
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Centralized hyperscale computing tier in California grid with high renewable mix
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {/* California Datacenter Identity */}
        <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-sky-100/70 dark:bg-sky-900/40 text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-slate-100">
                California Central Datacenter
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Region: {cloudData.region} • {cloudData.num_servers} Servers ({cloudData.total_cores} Total Cores)
              </p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 px-2 py-0.5 rounded-lg">
              {cloudData.mean_carbon_intensity.toFixed(1)} g/kWh
            </span>
            <p className="text-[9px] text-slate-400 dark:text-slate-500 mt-0.5">
              Historical Mean CI
            </p>
          </div>
        </div>

        {/* Global Cloud Specs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Cloud CPU Frequency (Assumed, Editable) */}
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                <Cpu className="w-3.5 h-3.5 text-sky-500" /> Cloud CPU / Core
              </span>
              <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                Assumed
              </span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min="1.0"
                max="4.0"
                step="0.1"
                value={config.cloudGhzPerCore.value}
                onChange={e => handleGhzChange(parseFloat(e.target.value))}
                className="w-full accent-sky-500 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
              />
              <span className="text-xs font-mono font-bold text-slate-900 dark:text-slate-100 w-16 text-right">
                {config.cloudGhzPerCore.value.toFixed(1)} GHz
              </span>
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
              50 hyperscale servers • total cloud capacity {(cloudData.total_cores * config.cloudGhzPerCore.value).toFixed(0)} GHz
            </p>
          </div>

          {/* Cloud Backhaul Bandwidth (From Dataset) */}
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                <Wifi className="w-3.5 h-3.5 text-sky-500" /> Uplink Bandwidth
              </span>
              <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                Dataset
              </span>
            </div>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-sm font-mono font-bold text-slate-900 dark:text-slate-100">
                {(config.cloudBandwidthMbps.value / 1000).toFixed(1)} Gbps
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400">
                {config.cloudBandwidthMbps.value.toLocaleString()} Mbps
              </span>
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
              High-speed optical WAN backhaul to California cloud
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
