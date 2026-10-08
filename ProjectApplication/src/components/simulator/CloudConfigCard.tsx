import React from 'react';
import { Cloud, Server, Database, Globe, Zap } from 'lucide-react';
import { CloudConfig, RegionId } from '../../types/simulation';
import { Tooltip } from '../common/Tooltip';
import { REGIONS } from '../../services/carbonService';

interface CloudConfigCardProps {
  config: CloudConfig;
  onChange: (updated: CloudConfig) => void;
}

export const CloudConfigCard: React.FC<CloudConfigCardProps> = ({ config, onChange }) => {
  const handleUpdate = <K extends keyof CloudConfig>(key: K, value: CloudConfig[K]) => {
    onChange({
      ...config,
      [key]: value,
    });
  };

  const activeRegionInfo = REGIONS[config.region];

  return (
    <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-sm hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 pb-3.5 mb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-start gap-2.5 min-w-0 flex-1">
          <div className="w-9 h-9 rounded-xl bg-cloud-50 dark:bg-cloud-950/60 text-cloud-600 dark:text-cloud-400 flex items-center justify-center shrink-0">
            <Cloud className="w-5 h-5" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Cloud Configuration
              </h3>
              <Tooltip content="Configures centralized hyperscale datacenter capacity. High processing bandwidth, but incurs WAN transmission latency." />
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Massive computational capacity & global routing options
            </p>
          </div>
        </div>

        <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-cloud-50 dark:bg-cloud-950/60 text-cloud-700 dark:text-cloud-300 font-semibold border border-cloud-200 dark:border-cloud-800 shrink-0 whitespace-nowrap">
          Hyperscale Tier
        </span>
      </div>

      {/* Controls */}
      <div className="space-y-4">
        {/* Slider: Number of Cloud Servers */}
        <div>
          <div className="flex justify-between items-start sm:items-center text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 gap-2">
            <div className="flex items-center gap-1 flex-wrap">
              <span>Number of Cloud Datacenter Clusters</span>
              <Tooltip content="Active hyperscale cloud instances available for task execution." />
            </div>
            <span className="font-mono text-sm text-cloud-600 dark:text-cloud-400 font-bold bg-cloud-50 dark:bg-cloud-950/60 px-2 py-0.5 rounded border border-cloud-200 dark:border-cloud-900 shrink-0">
              {config.serverCount} Datacenters
            </span>
          </div>
          <input
            type="range"
            min={1}
            max={10}
            step={1}
            value={config.serverCount}
            onChange={(e) => handleUpdate('serverCount', Number(e.target.value))}
            className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cloud-500"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
            <span>1 Hyperscale DC</span>
            <span>5 DCs</span>
            <span>10 DCs (Global Backbone)</span>
          </div>
        </div>

        {/* CPU & RAM */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <div className="flex items-start sm:items-center justify-between text-xs font-medium text-slate-700 dark:text-slate-300 mb-1 gap-2">
              <div className="flex items-center gap-1 flex-wrap">
                <span>CPU Capacity per DC (MIPS)</span>
                <Tooltip content="Millions of Instructions Per Second for heavy multi-core virtual machines." />
              </div>
              <span className="font-mono text-[11px] text-slate-500 shrink-0">{config.cpuMips.toLocaleString()} MIPS</span>
            </div>
            <input
              type="range"
              min={10000}
              max={60000}
              step={5000}
              value={config.cpuMips}
              onChange={(e) => handleUpdate('cpuMips', Number(e.target.value))}
              className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cloud-500"
            />
          </div>

          <div>
            <div className="flex items-center justify-between text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              <div className="flex items-center gap-1">
                <span>RAM Allocation</span>
                <Tooltip content="Memory capacity per cloud node cluster." />
              </div>
            </div>
            <div className="grid grid-cols-4 gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-medium">
              {[16, 32, 64, 128].map((gb) => (
                <button
                  key={gb}
                  type="button"
                  onClick={() => handleUpdate('ramGb', gb)}
                  className={`py-1 rounded-lg text-center font-mono transition-all ${
                    config.ramGb === gb
                      ? 'bg-white dark:bg-slate-700 text-cloud-600 dark:text-cloud-400 font-bold shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {gb}GB
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Storage, Bandwidth & Location */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Persistent Storage
            </label>
            <select
              value={config.storageGb}
              onChange={(e) => handleUpdate('storageGb', Number(e.target.value))}
              className="w-full px-2.5 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-cloud-500"
            >
              <option value={500}>500 GB NVMe</option>
              <option value={1000}>1,000 GB (1 TB) SAN</option>
              <option value={5000}>5,000 GB (5 TB) Array</option>
              <option value={20000}>20 TB Distributed</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              WAN Backhaul
            </label>
            <select
              value={config.bandwidthMbps}
              onChange={(e) => handleUpdate('bandwidthMbps', Number(e.target.value))}
              className="w-full px-2.5 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-cloud-500"
            >
              <option value={1000}>1 Gbps Direct Interconnect</option>
              <option value={5000}>5 Gbps Dedicated Pipe</option>
              <option value={10000}>10 Gbps High-Speed Backbone</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Cloud Datacenter Zone
            </label>
            <select
              value={config.region}
              onChange={(e) => handleUpdate('region', e.target.value as RegionId)}
              className="w-full px-2.5 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-cloud-500"
            >
              <option value="singapore">Singapore SEA ({REGIONS.singapore.avgCarbonIntensity} gCO₂/kWh)</option>
              <option value="europe">Europe Frankfurt ({REGIONS.europe.avgCarbonIntensity} gCO₂/kWh)</option>
              <option value="us_east">US-East N. Virginia ({REGIONS.us_east.avgCarbonIntensity} gCO₂/kWh)</option>
              <option value="mumbai">Mumbai Central ({REGIONS.mumbai.avgCarbonIntensity} gCO₂/kWh)</option>
              <option value="delhi">Delhi Cloud Region ({REGIONS.delhi.avgCarbonIntensity} gCO₂/kWh)</option>
            </select>
          </div>
        </div>

        {/* Datacenter Grid Footprint Badge */}
        <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-1.5 text-slate-600 dark:text-slate-400">
            <div className="flex items-center gap-1.5 shrink-0">
              <Globe className="w-3.5 h-3.5 text-cloud-500" />
              <span>{activeRegionInfo.name}:</span>
            </div>
            <span className="font-semibold text-slate-800 dark:text-slate-200">{activeRegionInfo.gridMix}</span>
          </div>
          <span className="font-mono text-[11px] text-cloud-600 dark:text-cloud-400 font-bold shrink-0">
            Base Latency: ~{activeRegionInfo.baseNetworkLatencyMs}ms
          </span>
        </div>
      </div>
    </div>
  );
};
