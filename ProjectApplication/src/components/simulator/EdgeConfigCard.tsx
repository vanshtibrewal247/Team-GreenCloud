import React from 'react';
import { Cpu, Server, Wifi, MapPin, CheckSquare, Square, Info } from 'lucide-react';
import { SimConfig, TraceData } from '../../sim/types';

interface EdgeConfigCardProps {
  config: SimConfig;
  trace: TraceData;
  onChange: (updated: SimConfig) => void;
  onCitiesChange: (newCities: string[]) => void;
}

export const EdgeConfigCard: React.FC<EdgeConfigCardProps> = ({
  config,
  trace,
  onChange,
  onCitiesChange
}) => {
  const allCities = trace.cities;

  const toggleCity = (cityName: string) => {
    let nextCities: string[];
    if (config.selectedCities.includes(cityName)) {
      if (config.selectedCities.length <= 1) return; // keep at least 1 city
      nextCities = config.selectedCities.filter(c => c !== cityName);
    } else {
      nextCities = [...config.selectedCities, cityName];
    }
    onCitiesChange(nextCities);
  };

  const handleSelectAll = () => {
    onCitiesChange(allCities.map(c => c.city));
  };

  const handleSelectTopCities = (count: number) => {
    const subset = allCities.slice(0, count).map(c => c.city);
    onCitiesChange(subset);
  };

  const handleGhzChange = (ghz: number) => {
    onChange({
      ...config,
      edgeGhzPerCore: {
        ...config.edgeGhzPerCore,
        value: ghz
      }
    });
  };

  return (
    <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-sm hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 pb-3.5 mb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-start gap-2.5 min-w-0 flex-1">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <Cpu className="w-5 h-5" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Edge Configuration
              </h3>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                {config.selectedCities.length} of {allCities.length} Active Nodes
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Decentralized collaborative edge nodes across US regional grid balancing authorities
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {/* Quick Node Selection Presets */}
        <div>
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              Active Edge Nodes (1 to 9 Cities)
            </span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => handleSelectTopCities(3)}
                className="text-[11px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors"
              >
                Top 3
              </button>
              <button
                type="button"
                onClick={() => handleSelectTopCities(5)}
                className="text-[11px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors"
              >
                Top 5
              </button>
              <button
                type="button"
                onClick={handleSelectAll}
                className="text-[11px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors"
              >
                All 9
              </button>
            </div>
          </div>

          {/* Node Grid Selector */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
            {allCities.map(city => {
              const isSelected = config.selectedCities.includes(city.city);
              const ci = city.mean_carbon_intensity;
              const ciColor =
                ci < 250
                  ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-800'
                  : ci < 350
                  ? 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 border-amber-200 dark:border-amber-800'
                  : 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/50 border-rose-200 dark:border-rose-800';

              return (
                <button
                  key={city.city}
                  type="button"
                  onClick={() => toggleCity(city.city)}
                  className={`flex items-center justify-between p-2 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'border-emerald-500/50 bg-emerald-50/40 dark:bg-emerald-950/20 shadow-sm'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 opacity-60 hover:opacity-100'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    {isSelected ? (
                      <CheckSquare className="w-4 h-4 text-emerald-500 shrink-0" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-400 shrink-0" />
                    )}
                    <div className="truncate">
                      <p className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">
                        {city.city}
                      </p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400">
                        {city.region} • {city.total_cores} cores
                      </p>
                    </div>
                  </div>
                  <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded border shrink-0 ${ciColor}`}>
                    {ci.toFixed(0)} g/kWh
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Global Edge Node Specs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
          {/* CPU GHz per Core (Editable Assumed) */}
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                CPU Frequency / Core
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
                value={config.edgeGhzPerCore.value}
                onChange={e => handleGhzChange(parseFloat(e.target.value))}
                className="w-full accent-emerald-500 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
              />
              <span className="text-xs font-mono font-bold text-slate-900 dark:text-slate-100 w-16 text-right">
                {config.edgeGhzPerCore.value.toFixed(1)} GHz
              </span>
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
              96 cores/server • max node frequency {config.selectedCities.length > 0 ? (96 * config.edgeGhzPerCore.value).toFixed(0) : 0} GHz
            </p>
          </div>

          {/* Link Bandwidth (From Dataset) */}
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                <Wifi className="w-3.5 h-3.5 text-emerald-500" /> Link Bandwidth
              </span>
              <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                Dataset
              </span>
            </div>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-sm font-mono font-bold text-slate-900 dark:text-slate-100">
                {(config.edgeBandwidthMbps.value / 1000).toFixed(1)} Gbps
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400">
                {config.edgeBandwidthMbps.value.toLocaleString()} Mbps
              </span>
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
              High-throughput inter-edge P2P & backhaul channel
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
