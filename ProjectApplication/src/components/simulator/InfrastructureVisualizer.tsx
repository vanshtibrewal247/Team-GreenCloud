import React, { useState, useEffect, useRef } from 'react';
import {
  Layers,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  RotateCcw,
  Cloud,
  Server,
  ArrowRight,
  ArrowDown,
  Activity,
  Zap,
  Info
} from 'lucide-react';
import { SimConfig, SimSummary, TraceData, SlotState } from '../../sim/types';

interface InfrastructureVisualizerProps {
  config: SimConfig;
  trace: TraceData;
  targetSummary: SimSummary | null;
  isSimulating: boolean;
}

export const InfrastructureVisualizer: React.FC<InfrastructureVisualizerProps> = ({
  config,
  trace,
  targetSummary,
  isSimulating,
}) => {
  const [currentSlotIndex, setCurrentSlotIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<1 | 2 | 5 | 10>(1);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  const slots = targetSummary?.slots || [];
  const totalSlots = slots.length > 0 ? slots.length : Math.max(1, Math.floor(trace.num_hours / config.slotLengthHours));

  // Keep slot in range
  useEffect(() => {
    if (currentSlotIndex >= totalSlots) {
      setCurrentSlotIndex(0);
    }
  }, [totalSlots]);

  // Playback timer
  useEffect(() => {
    if (!isPlaying) return;

    const intervalMs = Math.max(60, Math.floor(800 / playbackSpeed));
    const timer = setInterval(() => {
      setCurrentSlotIndex(prev => {
        if (prev + 1 >= totalSlots) {
          setIsPlaying(false);
          return 0;
        }
        return prev + 1;
      });
    }, intervalMs);

    return () => clearInterval(timer);
  }, [isPlaying, playbackSpeed, totalSlots]);

  // Extract current slot data
  const currentSlot: SlotState | null = slots[currentSlotIndex] || null;

  // Before first simulation run, compute preview values from raw trace at slot 0
  const getCityData = (cityName: string) => {
    const cityMeta = trace.cities.find(c => c.city === cityName);
    if (!cityMeta) return null;

    if (currentSlot) {
      const q = currentSlot.edgeQueues[cityName] || 0;
      const fHz = currentSlot.edgeFrequencies[cityName] || 0;
      const fGhz = fHz / 1e9;
      const ci = currentSlot.carbonIntensities[cityName] || cityMeta.mean_carbon_intensity;
      const arr = currentSlot.arrivals[cityName] || 0;
      const proc = currentSlot.edgeProcessedGb[cityName] || 0;
      const carb = currentSlot.edgeCarbonGrams[cityName] || 0;

      // Flows in this slot
      const peerOut = currentSlot.peerFlows.filter(f => f.from === cityName);
      const peerIn = currentSlot.peerFlows.filter(f => f.to === cityName);
      const cloudOut = currentSlot.cloudFlows.filter(f => f.from === cityName);

      return {
        q,
        fGhz,
        ci,
        arr,
        proc,
        carb,
        peerOut,
        peerIn,
        cloudOut,
        cores: cityMeta.total_cores,
        region: cityMeta.region,
      };
    } else {
      // Preview from trace
      const hour = currentSlotIndex * config.slotLengthHours;
      const arr = (cityMeta.hourly_arrivals_gb[hour] || 0) * config.arrivalScale.value;
      const ci = cityMeta.hourly_carbon_intensity[hour] || cityMeta.mean_carbon_intensity;
      return {
        q: 0,
        fGhz: 0,
        ci,
        arr,
        proc: 0,
        carb: 0,
        peerOut: [],
        peerIn: [],
        cloudOut: [],
        cores: cityMeta.total_cores,
        region: cityMeta.region,
      };
    }
  };

  // Cloud metrics for current slot
  const cloudData = (() => {
    if (currentSlot) {
      let totalCloudQ = 0;
      let totalCloudF = 0;
      let totalCloudProc = 0;
      for (const c of config.selectedCities) {
        totalCloudQ += currentSlot.cloudQueues[c] || 0;
        totalCloudF = Math.max(totalCloudF, (currentSlot.cloudFrequencies[c] || 0) / 1e9);
        totalCloudProc += currentSlot.cloudProcessedGb[c] || 0;
      }
      return {
        q: totalCloudQ,
        fGhz: totalCloudF,
        ci: currentSlot.cloudCarbonIntensity || trace.cloud.mean_carbon_intensity,
        proc: totalCloudProc,
      };
    } else {
      const hour = currentSlotIndex * config.slotLengthHours;
      return {
        q: 0,
        fGhz: 0,
        ci: trace.cloud.hourly_carbon_intensity[hour] || trace.cloud.mean_carbon_intensity,
        proc: 0,
      };
    }
  })();

  const activePeerFlows = currentSlot?.peerFlows || [];
  const activeCloudFlows = currentSlot?.cloudFlows || [];

  return (
    <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-sm flex flex-col gap-5">
      {/* Canvas Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Live Topology & Offloading Pipeline
              </h3>
              <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-700 animate-pulse">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Live
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Synchronized: {config.selectedCities.length} Edge Nodes • California Cloud DC
              {targetSummary ? ` (${targetSummary.algorithm})` : ' (Trace Preview)'}
            </p>
          </div>
        </div>

        {/* Playback Controls */}
        <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800/80 p-1.5 rounded-2xl border border-slate-200/80 dark:border-slate-700/80">
          <button
            type="button"
            onClick={() => setCurrentSlotIndex(prev => Math.max(0, prev - 1))}
            disabled={currentSlotIndex <= 0}
            className="p-1.5 rounded-xl text-slate-600 dark:text-slate-400 hover:text-emerald-500 hover:bg-white dark:hover:bg-slate-700 disabled:opacity-40 transition-colors"
            title="Step Back 1 Slot"
          >
            <SkipBack className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-1.5 rounded-xl bg-emerald-500 text-white hover:bg-emerald-600 shadow-sm transition-colors"
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>
          <button
            type="button"
            onClick={() => setCurrentSlotIndex(prev => Math.min(totalSlots - 1, prev + 1))}
            disabled={currentSlotIndex >= totalSlots - 1}
            className="p-1.5 rounded-xl text-slate-600 dark:text-slate-400 hover:text-emerald-500 hover:bg-white dark:hover:bg-slate-700 disabled:opacity-40 transition-colors"
            title="Step Forward 1 Slot"
          >
            <SkipForward className="w-4 h-4" />
          </button>

          <div className="h-4 w-px bg-slate-200 dark:bg-slate-700 mx-1" />

          {/* Speed Buttons */}
          {([1, 2, 5, 10] as const).map(speed => (
            <button
              key={speed}
              type="button"
              onClick={() => setPlaybackSpeed(speed)}
              className={`px-1.5 py-0.5 text-[10px] font-bold rounded-lg transition-colors ${
                playbackSpeed === speed
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {speed}x
            </button>
          ))}
        </div>
      </div>

      {/* Scrubber & Timestamp Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-1">
        <div className="flex items-center gap-2 flex-1">
          <input
            type="range"
            min="0"
            max={Math.max(0, totalSlots - 1)}
            value={currentSlotIndex}
            onChange={e => setCurrentSlotIndex(parseInt(e.target.value))}
            className="w-full accent-emerald-500 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
          />
        </div>
        <div className="text-right text-xs font-mono text-slate-700 dark:text-slate-300 shrink-0">
          Slot <span className="font-bold text-emerald-600 dark:text-emerald-400">{currentSlotIndex + 1}</span> / {totalSlots}
          <span className="text-slate-400 dark:text-slate-500 ml-1.5">
            (Hour {currentSlotIndex * config.slotLengthHours})
          </span>
        </div>
      </div>

      {/* Tier 1: Local Edge Cluster */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
          <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
            <Server className="w-3.5 h-3.5" /> Tier 1 — Local Edge Collaborative Cluster ({config.selectedCities.length} Nodes)
          </span>
          <span className="text-[10px] text-slate-500 font-normal">
            Hover node for telemetry
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
          {config.selectedCities.map(cityName => {
            const data = getCityData(cityName);
            if (!data) return null;

            const isHovered = hoveredNode === cityName;
            const ci = data.ci;
            const ciColor =
              ci < 250
                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800'
                : ci < 350
                ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/70 dark:text-amber-400 border-amber-200 dark:border-amber-800'
                : 'bg-rose-50 text-rose-700 dark:bg-rose-950/70 dark:text-rose-400 border-rose-200 dark:border-rose-800';

            // Queue progress bar (relative to 100 GB scale)
            const queuePercent = Math.min(100, (data.q / 100) * 100);

            return (
              <div
                key={cityName}
                onMouseEnter={() => setHoveredNode(cityName)}
                onMouseLeave={() => setHoveredNode(null)}
                className={`relative p-3 rounded-2xl border transition-all ${
                  isHovered
                    ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30 shadow-md scale-[1.02] z-10'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                {/* Node Name & Grid Badge */}
                <div className="flex items-start justify-between gap-1 mb-2">
                  <div className="truncate">
                    <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {cityName}
                    </p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                      {data.region}
                    </p>
                  </div>
                  <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded border shrink-0 ${ciColor}`}>
                    {ci.toFixed(0)} g/kWh
                  </span>
                </div>

                {/* Queue Depth Progress Bar */}
                <div className="space-y-1 mb-2">
                  <div className="flex justify-between text-[10px]">
                    <span className="text-slate-500 dark:text-slate-400">Queue Depth:</span>
                    <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                      {data.q.toFixed(2)} GB
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${
                        queuePercent > 75 ? 'bg-rose-500' : queuePercent > 40 ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${Math.max(4, queuePercent)}%` }}
                    />
                  </div>
                </div>

                {/* CPU Frequency & Processed Volume */}
                <div className="grid grid-cols-2 gap-1 text-[10px] font-mono pt-1.5 border-t border-slate-200/60 dark:border-slate-700/60">
                  <div>
                    <span className="text-slate-400 block">CPU Freq:</span>
                    <span className="font-bold text-slate-700 dark:text-slate-300">
                      {data.fGhz.toFixed(2)} GHz
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-400 block">Processed:</span>
                    <span className="font-bold text-slate-700 dark:text-slate-300">
                      {data.proc.toFixed(1)} GB
                    </span>
                  </div>
                </div>

                {/* Hover Popover Breakdown */}
                {isHovered && (
                  <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-64 p-3 rounded-2xl bg-slate-900 text-white dark:bg-slate-950 border border-slate-700 shadow-xl text-[11px] space-y-1.5 pointer-events-none z-30 animate-in fade-in zoom-in-95">
                    <div className="flex justify-between font-bold border-b border-slate-800 pb-1">
                      <span>{cityName} Telemetry</span>
                      <span className="text-emerald-400">Slot #{currentSlotIndex + 1}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Arrivals this slot:</span>
                      <span className="font-mono">{data.arr.toFixed(2)} GB</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Queue Depth:</span>
                      <span className="font-mono text-amber-300">{data.q.toFixed(2)} GB</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">CPU Frequency:</span>
                      <span className="font-mono text-emerald-300">{data.fGhz.toFixed(2)} GHz</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Slot Carbon Emitted:</span>
                      <span className="font-mono text-rose-300">{data.carb.toFixed(1)} gCO2</span>
                    </div>
                    {data.peerOut.length > 0 && (
                      <div className="pt-1 border-t border-slate-800">
                        <span className="text-slate-400 block">Peer Transfers Out:</span>
                        {data.peerOut.map(p => (
                          <div key={p.to} className="flex justify-between text-sky-300">
                            <span>→ {p.to}</span>
                            <span>{p.volumeGb.toFixed(2)} GB</span>
                          </div>
                        ))}
                      </div>
                    )}
                    {data.cloudOut.length > 0 && (
                      <div className="flex justify-between text-indigo-300 pt-0.5">
                        <span>→ Cloud Datacenter:</span>
                        <span>{data.cloudOut[0].volumeGb.toFixed(2)} GB</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Mid Section: Active Flows Summary */}
      <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-2">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
          <span className="flex items-center gap-1.5 text-sky-600 dark:text-sky-400">
            <Zap className="w-3.5 h-3.5" /> Active Offloading Flows (Slot #{currentSlotIndex + 1})
          </span>
          <span className="text-[10px] font-mono text-slate-500">
            {activePeerFlows.length} Peer Flows • {activeCloudFlows.length} Cloud Offloads
          </span>
        </div>

        {activePeerFlows.length === 0 && activeCloudFlows.length === 0 ? (
          <p className="text-xs text-slate-500 dark:text-slate-400 italic">
            Zero offloading in this slot (all workload processed locally).
          </p>
        ) : (
          <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto pr-1">
            {activePeerFlows.map((flow, idx) => {
              const widthWeight = Math.min(6, Math.max(1, flow.volumeGb / 50));
              return (
                <div
                  key={`peer-${idx}`}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-sky-50 dark:bg-sky-950/50 border border-sky-200 dark:border-sky-800 text-[11px] text-sky-800 dark:text-sky-300"
                >
                  <span className="font-semibold">{flow.from}</span>
                  <ArrowRight className="w-3 h-3 text-sky-500 shrink-0" style={{ strokeWidth: widthWeight }} />
                  <span className="font-semibold">{flow.to}</span>
                  <span className="font-mono font-bold text-sky-600 dark:text-sky-400 ml-1">
                    {flow.volumeGb.toFixed(1)} GB
                  </span>
                </div>
              );
            })}
            {activeCloudFlows.map((flow, idx) => (
              <div
                key={`cloud-${idx}`}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800 text-[11px] text-indigo-800 dark:text-indigo-300"
              >
                <span className="font-semibold">{flow.from}</span>
                <ArrowDown className="w-3 h-3 text-indigo-500 shrink-0" />
                <span className="font-semibold">California Cloud</span>
                <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400 ml-1">
                  {flow.volumeGb.toFixed(1)} GB
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Tier 2: California Cloud Datacenter */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
          <span className="flex items-center gap-1.5 text-sky-600 dark:text-sky-400">
            <Cloud className="w-3.5 h-3.5" /> Tier 2 — Centralized Hyperscale Cloud (California Grid)
          </span>
          <span className="text-[10px] text-slate-500 font-mono">
            Optical WAN Backhaul Link
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-sky-50/40 dark:bg-sky-950/20 border border-sky-200 dark:border-sky-900/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-100 dark:bg-sky-900/60 text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0">
              <Cloud className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900 dark:text-white">
                California Centralized Datacenter
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                50 hyperscale servers • 4,800 cores • 25 Gbps dedicated link
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            <div>
              <span className="text-slate-400 block text-[10px]">Cloud Queue:</span>
              <span className="font-bold text-slate-900 dark:text-slate-100">
                {cloudData.q.toFixed(2)} GB
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Cloud Freq:</span>
              <span className="font-bold text-slate-900 dark:text-slate-100">
                {cloudData.fGhz.toFixed(2)} GHz
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Cloud CI:</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">
                {cloudData.ci.toFixed(0)} g/kWh
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
