import React, { useState } from 'react';
import { Cpu, Plus, Trash2, MapPin } from 'lucide-react';
import { EdgeConfig, RegionId, EdgeRegion } from '../../types/simulation';
import { Tooltip } from '../common/Tooltip';
import { REGIONS } from '../../services/carbonService';
import { AddRegionModal } from './AddRegionModal';

interface EdgeConfigCardProps {
  config: EdgeConfig;
  onChange: (updated: EdgeConfig) => void;
}

export const EdgeConfigCard: React.FC<EdgeConfigCardProps> = ({ config, onChange }) => {
  const [modalOpen, setModalOpen] = useState(false);

  const handleUpdate = <K extends keyof EdgeConfig>(key: K, value: EdgeConfig[K]) => {
    onChange({
      ...config,
      [key]: value,
    });
  };

  const handleAddSecondaryRegion = (newRegion: EdgeRegion) => {
    onChange({
      ...config,
      additionalRegions: [...config.additionalRegions, newRegion],
    });
  };

  const handleRemoveSecondaryRegion = (id: string) => {
    onChange({
      ...config,
      additionalRegions: config.additionalRegions.filter((r) => r.id !== id),
    });
  };

  const activeRegionInfo = REGIONS[config.region];

  return (
    <>
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-sm hover:shadow-md transition-shadow">
        {/* Card Header */}
        <div className="flex items-center justify-between gap-3 pb-3.5 mb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <Cpu className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 flex-wrap">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Edge Configuration
                </h3>
                <Tooltip content="Configures decentralized base-station and micro-datacenter servers physically closest to the end-users." />
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate sm:overflow-visible">
                Low latency, constrained compute & regional grid power
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-dashed border-emerald-400 dark:border-emerald-700 bg-emerald-50/50 dark:bg-emerald-950/30 hover:bg-emerald-100/60 text-xs font-semibold text-emerald-700 dark:text-emerald-300 transition-colors shrink-0 whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Edge Region</span>
          </button>
        </div>

        {/* Form Controls */}
        <div className="space-y-4">
          {/* Slider: Number of Edge Servers */}
          <div>
            <div className="flex justify-between items-center text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              <div className="flex items-center gap-1">
                <span>Number of Edge Servers</span>
                <Tooltip content="Number of physical micro-edge servers. Changing this slider dynamically scales the visualizer nodes on the right!" />
              </div>
              <span className="font-mono text-sm text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-900">
                {config.serverCount} Nodes
              </span>
            </div>
            <input
              type="range"
              min={1}
              max={20}
              step={1}
              value={config.serverCount}
              onChange={(e) => handleUpdate('serverCount', Number(e.target.value))}
              className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
              <span>1 Node (Constrained)</span>
              <span>10 Nodes</span>
              <span>20 Nodes (High Density)</span>
            </div>
          </div>

          {/* Grid: CPU & RAM */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center justify-between text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                <div className="flex items-center gap-1">
                  <span>CPU Capacity (MIPS)</span>
                  <Tooltip content="Millions of Instructions Per Second processing speed per core." />
                </div>
                <span className="font-mono text-[11px] text-slate-500">{config.cpuMips} MIPS</span>
              </div>
              <input
                type="range"
                min={1000}
                max={10000}
                step={500}
                value={config.cpuMips}
                onChange={(e) => handleUpdate('cpuMips', Number(e.target.value))}
                className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
            </div>

            <div>
              <div className="flex items-center justify-between text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                <div className="flex items-center gap-1">
                  <span>RAM Memory</span>
                  <Tooltip content="RAM allocation per edge server instance." />
                </div>
              </div>
              <div className="grid grid-cols-4 gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-medium">
                {[2, 4, 8, 16].map((gb) => (
                  <button
                    key={gb}
                    type="button"
                    onClick={() => handleUpdate('ramGb', gb)}
                    className={`py-1 rounded-lg text-center font-mono transition-all ${
                      config.ramGb === gb
                        ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 font-bold shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {gb}GB
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Grid: Storage, Bandwidth & Location */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Local NVMe Storage
              </label>
              <select
                value={config.storageGb}
                onChange={(e) => handleUpdate('storageGb', Number(e.target.value))}
                className="w-full px-2.5 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
              >
                <option value={20}>20 GB Flash</option>
                <option value={50}>50 GB NVMe</option>
                <option value={100}>100 GB NVMe</option>
                <option value={250}>250 GB Array</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Edge Bandwidth
              </label>
              <select
                value={config.bandwidthMbps}
                onChange={(e) => handleUpdate('bandwidthMbps', Number(e.target.value))}
                className="w-full px-2.5 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
              >
                <option value={50}>50 Mbps (4G)</option>
                <option value={100}>100 Mbps (5G NSA)</option>
                <option value={500}>500 Mbps (5G SA)</option>
                <option value={1000}>1 Gbps Fiber Fronthaul</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Primary Grid Location
              </label>
              <select
                value={config.region}
                onChange={(e) => handleUpdate('region', e.target.value as RegionId)}
                className="w-full px-2.5 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
              >
                <option value="delhi">Delhi ({REGIONS.delhi.avgCarbonIntensity} gCO₂/kWh)</option>
                <option value="mumbai">Mumbai ({REGIONS.mumbai.avgCarbonIntensity} gCO₂/kWh)</option>
                <option value="bengaluru">Bengaluru ({REGIONS.bengaluru.avgCarbonIntensity} gCO₂/kWh)</option>
                <option value="chennai">Chennai ({REGIONS.chennai.avgCarbonIntensity} gCO₂/kWh)</option>
                <option value="hyderabad">Hyderabad ({REGIONS.hyderabad.avgCarbonIntensity} gCO₂/kWh)</option>
                <option value="custom">Custom Grid</option>
              </select>
            </div>
          </div>

          {/* Regional Grid Footprint Badge */}
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
              <MapPin className="w-3.5 h-3.5 text-emerald-500" />
              <span>{activeRegionInfo.name} Power Mix:</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{activeRegionInfo.gridMix}</span>
            </div>
            <span className="font-mono text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">
              {activeRegionInfo.renewableShare}% Clean
            </span>
          </div>

          {/* Secondary Regions List if any */}
          {config.additionalRegions.length > 0 && (
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Secondary Regional Clusters ({config.additionalRegions.length})
              </span>
              <div className="space-y-1.5">
                {config.additionalRegions.map((sec) => (
                  <div
                    key={sec.id}
                    className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs"
                  >
                    <div>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{sec.name}</span>
                      <span className="text-slate-400 ml-2 font-mono">
                        ({sec.serverCount} nodes • {REGIONS[sec.region].name})
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveSecondaryRegion(sec.id)}
                      className="text-rose-500 hover:text-rose-600 p-1"
                      title="Remove cluster"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <AddRegionModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onAddRegion={handleAddSecondaryRegion}
      />
    </>
  );
};
