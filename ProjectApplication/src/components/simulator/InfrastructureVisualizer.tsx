import React, { useState, useEffect, useMemo } from 'react';
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
  Info,
  DownloadCloud,
  Cpu,
  ChevronDown,
  ChevronUp,
  Inbox,
  Sparkles,
  FastForward,
  Rewind,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { SimConfig, SimSummary, TraceData, SlotState } from '../../sim/types';

interface InfrastructureVisualizerProps {
  config: SimConfig;
  trace: TraceData;
  targetSummary: SimSummary | null;
  isSimulating: boolean;
}

export interface IngressRequest {
  id: string;
  cityName: string;
  region: string;
  taskIndex: number;
  totalCityTasks: number;
  sizeGb: number;
  category: string;
  description: string;
  priority: 'Latency-Sensitive' | 'Standard Batch' | 'High-Priority Edge' | 'Elastic Background';
  cyclesReqFormatted: string;
  status: 'executing_local' | 'offloaded_peer' | 'offloaded_cloud' | 'queued' | 'pending';
  statusLabel: string;
  targetNode?: string;
  cpuGhz?: number;
}

/**
 * Deterministically constructs the list of arriving computational requests for a given slot.
 */
function getSlotIngressRequests(
  slotIdx: number,
  config: SimConfig,
  trace: TraceData,
  currentSlot: SlotState | null
): IngressRequest[] {
  const requests: IngressRequest[] = [];
  const hour = slotIdx * config.slotLengthHours;
  const slotHourEnd = Math.min(trace.num_hours, hour + config.slotLengthHours);

  for (const cityName of config.selectedCities) {
    const cityMeta = trace.cities.find(c => c.city === cityName);
    if (!cityMeta) continue;

    // Total arrival volume in GB
    let arrGb = 0;
    if (currentSlot) {
      arrGb = currentSlot.arrivals[cityName] || 0;
    } else {
      let sumH = 0;
      for (let h = hour; h < slotHourEnd; h++) {
        sumH += cityMeta.hourly_arrivals_gb[h] || 0;
      }
      arrGb = sumH * config.arrivalScale.value;
    }

    if (arrGb <= 0.001) continue;

    // Task count
    let taskCount = 0;
    if (cityMeta.hourly_task_counts) {
      for (let h = hour; h < slotHourEnd; h++) {
        taskCount += cityMeta.hourly_task_counts[h] || 0;
      }
    }
    if (taskCount <= 0) taskCount = 1;

    // Generate individual task sizes that sum exactly to arrGb
    const taskSizes: number[] = [];
    if (taskCount === 1) {
      taskSizes.push(Number(arrGb.toFixed(2)));
    } else {
      let allocated = 0;
      for (let i = 0; i < taskCount; i++) {
        if (i === taskCount - 1) {
          taskSizes.push(Math.max(0.1, Number((arrGb - allocated).toFixed(2))));
        } else {
          // Deterministic pseudorandom weight based on slot and city
          const seed = (slotIdx + 1) * 31 + cityName.length * 7 + i * 13;
          const weight = 0.6 + (((seed * 9301 + 49297) % 233280) / 233280) * 0.8;
          const size = Math.max(0.1, Number(((arrGb / taskCount) * weight).toFixed(2)));
          taskSizes.push(size);
          allocated += size;
        }
      }
    }

    // Determine simulation decisions if slot summary is available
    const cloudFlow = currentSlot?.cloudFlows.find(f => f.from === cityName);
    const peerFlows = currentSlot?.peerFlows.filter(f => f.from === cityName) || [];
    const localProc = currentSlot?.edgeProcessedGb[cityName] || 0;
    const fGhz = currentSlot ? (currentSlot.edgeFrequencies[cityName] || 0) / 1e9 : 0;
    const queueDepth = currentSlot?.edgeQueues[cityName] || 0;

    taskSizes.forEach((size, idx) => {
      // Workload categorization based on payload size
      let category = 'IoT Sensor Telemetry';
      let description = 'High-frequency telemetry stream from smart municipal sensors & edge IoT devices';
      let priority: IngressRequest['priority'] = 'Latency-Sensitive';

      if (size >= 100) {
        category = 'Distributed Batch ML Training';
        description = 'Deep neural network gradient sync & federated machine learning checkpoint';
        priority = 'Elastic Background';
      } else if (size >= 45) {
        category = 'Spatial ETL & Traffic Analytics';
        description = 'Real-time urban mobility stream processing, LiDAR ingestion & route optimization';
        priority = 'Standard Batch';
      } else if (size >= 15) {
        category = 'Edge AI Computer Vision Stream';
        description = 'Multi-camera 4K surveillance feed inference, object tracking & semantic segmentation';
        priority = 'High-Priority Edge';
      }

      // Compute demand: size in bits * phi cycles/bit
      const phi = config.phi.value || 1000;
      const totalCycles = size * 8 * 1e9 * phi;
      const cyclesReqFormatted =
        totalCycles >= 1e12
          ? `${(totalCycles / 1e12).toFixed(1)} TCycles`
          : `${(totalCycles / 1e9).toFixed(1)} GCycles`;

      // Determine task status
      let status: IngressRequest['status'] = 'pending';
      let statusLabel = 'Awaiting Simulation Run';
      let targetNode: string | undefined;

      if (currentSlot) {
        const cloudVol = cloudFlow?.volumeGb || 0;

        if (cloudVol > 0 && localProc > 0 && idx === 0) {
          // Hybrid partitioning: Lyapunov offloaded a fraction to cloud, processed rest locally
          status = 'offloaded_cloud';
          const cloudStr = cloudVol >= 1 ? `${cloudVol.toFixed(1)} GB` : `${Math.max(1, Math.round(cloudVol * 1024))} MB`;
          const localStr = `${localProc.toFixed(1)} GB`;
          statusLabel = `⚡ Hybrid: ${cloudStr} to Cloud • ${localStr} Local CPU`;
        } else if (cloudVol >= size && idx === 0) {
          status = 'offloaded_cloud';
          statusLabel = `☁ Offloaded to Cloud (${cloudVol.toFixed(1)} GB Optical WAN)`;
        } else if (peerFlows.length > 0 && idx < peerFlows.length) {
          status = 'offloaded_peer';
          targetNode = peerFlows[idx].to;
          const pVol = peerFlows[idx].volumeGb;
          const pStr = pVol >= 1 ? `${pVol.toFixed(1)} GB` : `${Math.max(1, Math.round(pVol * 1024))} MB`;
          statusLabel = `↔ Offloaded to ${peerFlows[idx].to} (${pStr})`;
        } else if (localProc > 0) {
          status = 'executing_local';
          statusLabel = `⚡ Local Processing (${fGhz.toFixed(2)} GHz)`;
        } else if (queueDepth > 0) {
          status = 'queued';
          statusLabel = `⏳ Queued in Ingress Buffer (${queueDepth.toFixed(1)} GB)`;
        } else {
          status = 'executing_local';
          statusLabel = 'Completed';
        }
      }

      const id = `REQ-S${(slotIdx + 1).toString().padStart(3, '0')}-${cityName.substring(0, 3).toUpperCase()}-${idx + 1}`;

      requests.push({
        id,
        cityName,
        region: cityMeta.region,
        taskIndex: idx + 1,
        totalCityTasks: taskCount,
        sizeGb: size,
        category,
        description,
        priority,
        cyclesReqFormatted,
        status,
        statusLabel,
        targetNode,
        cpuGhz: fGhz,
      });
    });
  }

  return requests;
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
  const [showRequestInspector, setShowRequestInspector] = useState(true);
  const [selectedNodeFilter, setSelectedNodeFilter] = useState<string | null>(null);

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

  // Jump to next or previous slot with active incoming requests
  const jumpToBurst = (direction: 1 | -1) => {
    let s = currentSlotIndex + direction;
    while (s >= 0 && s < totalSlots) {
      let slotArr = 0;
      if (slots[s]) {
        slotArr = Object.values(slots[s].arrivals).reduce((a, b) => a + b, 0);
      } else {
        const hStart = s * config.slotLengthHours;
        const hEnd = Math.min(trace.num_hours, hStart + config.slotLengthHours);
        for (const cityName of config.selectedCities) {
          const cMeta = trace.cities.find(c => c.city === cityName);
          if (cMeta) {
            for (let h = hStart; h < hEnd; h++) {
              slotArr += (cMeta.hourly_arrivals_gb[h] || 0) * config.arrivalScale.value;
            }
          }
        }
      }
      if (slotArr > 0.01) {
        setCurrentSlotIndex(s);
        return;
      }
      s += direction;
    }
  };

  // Node telemetry helper
  const getCityData = (cityName: string) => {
    const cityMeta = trace.cities.find(c => c.city === cityName);
    if (!cityMeta) return null;

    const hour = currentSlotIndex * config.slotLengthHours;
    const slotHourEnd = Math.min(trace.num_hours, hour + config.slotLengthHours);
    let taskCount = 0;
    if (cityMeta.hourly_task_counts) {
      for (let h = hour; h < slotHourEnd; h++) {
        taskCount += cityMeta.hourly_task_counts[h] || 0;
      }
    }

    if (currentSlot) {
      const q = currentSlot.edgeQueues[cityName] || 0;
      const fHz = currentSlot.edgeFrequencies[cityName] || 0;
      const fGhz = fHz / 1e9;
      const ci = currentSlot.carbonIntensities[cityName] || cityMeta.mean_carbon_intensity;
      const arr = currentSlot.arrivals[cityName] || 0;
      const proc = currentSlot.edgeProcessedGb[cityName] || 0;
      const carb = currentSlot.edgeCarbonGrams[cityName] || 0;

      if (taskCount === 0 && arr > 0) taskCount = 1;

      // Flows in this slot
      const peerOut = currentSlot.peerFlows.filter(f => f.from === cityName);
      const peerIn = currentSlot.peerFlows.filter(f => f.to === cityName);
      const cloudOut = currentSlot.cloudFlows.filter(f => f.from === cityName);

      return {
        q,
        fGhz,
        ci,
        arr,
        taskCount,
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
      let arrSum = 0;
      for (let h = hour; h < slotHourEnd; h++) {
        arrSum += cityMeta.hourly_arrivals_gb[h] || 0;
      }
      const arr = arrSum * config.arrivalScale.value;
      const ci = cityMeta.hourly_carbon_intensity[hour] || cityMeta.mean_carbon_intensity;
      if (taskCount === 0 && arr > 0) taskCount = 1;

      return {
        q: 0,
        fGhz: 0,
        ci,
        arr,
        taskCount,
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

  // Incoming discrete requests for current slot
  const slotRequests = useMemo(() => {
    return getSlotIngressRequests(currentSlotIndex, config, trace, currentSlot);
  }, [currentSlotIndex, config, trace, currentSlot]);

  // Filter requests if user selected a specific node
  const filteredRequests = useMemo(() => {
    if (!selectedNodeFilter) return slotRequests;
    return slotRequests.filter(r => r.cityName === selectedNodeFilter);
  }, [slotRequests, selectedNodeFilter]);

  // Aggregated slot ingress metrics
  const slotIngressSummary = useMemo(() => {
    let totalArr = 0;
    let totalTasks = 0;
    let activeNodes = 0;

    for (const cityName of config.selectedCities) {
      const data = getCityData(cityName);
      if (!data) continue;
      if (data.arr > 0.001) {
        totalArr += data.arr;
        totalTasks += data.taskCount;
        activeNodes += 1;
      }
    }

    return { totalArr, totalTasks, activeNodes };
  }, [config.selectedCities, currentSlotIndex, currentSlot, trace]);

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

  const formatFlowVolume = (gb: number): string => {
    if (gb >= 1) return `${gb.toFixed(1)} GB`;
    if (gb >= 0.1) return `${gb.toFixed(1)} GB`;
    if (gb >= 0.01) return `${gb.toFixed(2)} GB`;
    const mb = Math.round(gb * 1024);
    return `${Math.max(1, mb)} MB`;
  };

  const activePeerFlows = (currentSlot?.peerFlows || []).filter(f => f.volumeGb >= 0.001);
  const activeCloudFlows = (currentSlot?.cloudFlows || []).filter(f => f.volumeGb >= 0.001);

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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 px-1">
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
        <div className="flex items-center justify-between sm:justify-end gap-3 text-xs font-mono text-slate-700 dark:text-slate-300 shrink-0">
          {/* Quick Burst Navigators */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => jumpToBurst(-1)}
              className="px-2 py-0.5 rounded-lg text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors flex items-center gap-1"
              title="Jump to previous slot with workload arrivals"
            >
              <Rewind className="w-3 h-3 text-slate-400" />
              <span>Prev Burst</span>
            </button>
            <button
              type="button"
              onClick={() => jumpToBurst(1)}
              className="px-2 py-0.5 rounded-lg text-[10px] font-semibold bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 transition-colors flex items-center gap-1"
              title="Jump to next slot with workload arrivals"
            >
              <span>Next Burst</span>
              <FastForward className="w-3 h-3 text-emerald-500" />
            </button>
          </div>

          <div>
            Slot <span className="font-bold text-emerald-600 dark:text-emerald-400">{currentSlotIndex + 1}</span> / {totalSlots}
            <span className="text-slate-400 dark:text-slate-500 ml-1.5">
              (Hour {currentSlotIndex * config.slotLengthHours})
            </span>
          </div>
        </div>
      </div>

      {/* Tier 0: Ingress Workload Stream */}
      <div className="rounded-2xl bg-gradient-to-r from-emerald-500/5 via-teal-500/5 to-cyan-500/5 border border-emerald-500/20 p-3.5 sm:p-4 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <DownloadCloud className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Tier 0 — Ingress Workload Stream
                </span>
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-semibold border ${
                    slotIngressSummary.totalArr > 0
                      ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  {slotIngressSummary.totalArr > 0
                    ? `${slotIngressSummary.totalArr.toFixed(1)} GB Arriving`
                    : '0.0 GB (Idle)'}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                User & IoT computational task requests arriving at edge ingress gateways in Slot #{currentSlotIndex + 1}
              </p>
            </div>
          </div>

          {/* Toggle Request Inspector */}
          <button
            type="button"
            onClick={() => setShowRequestInspector(prev => !prev)}
            className={`px-3 py-1 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 shadow-xs ${
              showRequestInspector
                ? 'bg-emerald-500 text-white border-emerald-600 shadow-emerald-500/20'
                : 'bg-white dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-300 dark:border-emerald-700'
            }`}
          >
            <Inbox className="w-3.5 h-3.5" />
            <span>Inspect Incoming Requests ({slotRequests.length})</span>
            {showRequestInspector ? (
              <ChevronUp className="w-3.5 h-3.5" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5" />
            )}
          </button>
        </div>

        {/* Telemetry Chips */}
        <div className="grid grid-cols-3 gap-2 pt-1 border-t border-emerald-500/10 text-xs font-mono">
          <div className="bg-white/80 dark:bg-slate-800/80 p-2 rounded-xl border border-slate-200/50 dark:border-slate-700/50">
            <span className="text-[10px] text-slate-400 block font-sans">Total Ingress Volume</span>
            <span className="font-bold text-slate-900 dark:text-white">
              {slotIngressSummary.totalArr.toFixed(1)} GB
            </span>
          </div>
          <div className="bg-white/80 dark:bg-slate-800/80 p-2 rounded-xl border border-slate-200/50 dark:border-slate-700/50">
            <span className="text-[10px] text-slate-400 block font-sans">Incoming Tasks</span>
            <span className="font-bold text-slate-900 dark:text-white">
              {slotIngressSummary.totalTasks} {slotIngressSummary.totalTasks === 1 ? 'task' : 'tasks'}
            </span>
          </div>
          <div className="bg-white/80 dark:bg-slate-800/80 p-2 rounded-xl border border-slate-200/50 dark:border-slate-700/50">
            <span className="text-[10px] text-slate-400 block font-sans">Active Gateways</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400">
              {slotIngressSummary.activeNodes} / {config.selectedCities.length} nodes
            </span>
          </div>
        </div>

        {/* Collapsible Incoming Request Stream Inspector */}
        {showRequestInspector && (
          <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700/80 space-y-2.5 animate-in fade-in duration-200">
            {/* Ingress Gateway Filter Pills */}
            {slotRequests.length > 0 && (
              <div className="flex items-center gap-1.5 flex-wrap text-[11px]">
                <span className="text-slate-400 text-[10px] font-semibold uppercase mr-1">
                  Filter Ingress:
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedNodeFilter(null)}
                  className={`px-2 py-0.5 rounded-lg font-mono font-semibold transition-colors ${
                    selectedNodeFilter === null
                      ? 'bg-emerald-500 text-white'
                      : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 border border-slate-200 dark:border-slate-700'
                  }`}
                >
                  All Nodes ({slotRequests.length})
                </button>
                {config.selectedCities.map(cityName => {
                  const count = slotRequests.filter(r => r.cityName === cityName).length;
                  if (count === 0) return null;
                  return (
                    <button
                      key={cityName}
                      type="button"
                      onClick={() => setSelectedNodeFilter(cityName)}
                      className={`px-2 py-0.5 rounded-lg font-mono font-semibold transition-colors ${
                        selectedNodeFilter === cityName
                          ? 'bg-emerald-500 text-white'
                          : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 border border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      {cityName} ({count})
                    </button>
                  );
                })}
              </div>
            )}

            {/* Arriving Task Cards List */}
            {filteredRequests.length > 0 ? (
              <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
                {filteredRequests.map(req => {
                  const priorityColor =
                    req.priority === 'Latency-Sensitive'
                      ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-800'
                      : req.priority === 'High-Priority Edge'
                      ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800'
                      : req.priority === 'Standard Batch'
                      ? 'bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-400 border-sky-200 dark:border-sky-800'
                      : 'bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-800';

                  const statusBadgeColor =
                    req.status === 'executing_local'
                      ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800'
                      : req.status === 'offloaded_peer'
                      ? 'bg-sky-50 text-sky-700 dark:bg-sky-950/60 dark:text-sky-400 border-sky-200 dark:border-sky-800'
                      : req.status === 'offloaded_cloud'
                      ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800'
                      : req.status === 'queued'
                      ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400 border-amber-200 dark:border-amber-800'
                      : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border-slate-200 dark:border-slate-700';

                  return (
                    <div
                      key={req.id}
                      className="p-2.5 rounded-xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 text-xs space-y-1.5 shadow-2xs hover:border-emerald-300 dark:hover:border-emerald-700 transition-colors"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono font-bold text-slate-900 dark:text-white">
                            {req.id}
                          </span>
                          <span className="text-slate-400">•</span>
                          <span className="font-semibold text-slate-700 dark:text-slate-300">
                            {req.cityName}
                          </span>
                          <span className="text-[10px] text-slate-400">({req.region})</span>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${priorityColor}`}>
                            {req.priority}
                          </span>
                          <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                            {req.sizeGb.toFixed(1)} GB
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                        <div className="truncate mr-2">
                          <span className="font-semibold text-slate-700 dark:text-slate-300">
                            {req.category}:
                          </span>{' '}
                          <span>{req.description}</span>
                        </div>
                        <span className="font-mono text-[10px] shrink-0 text-slate-400">
                          Demand: {req.cyclesReqFormatted}
                        </span>
                      </div>

                      <div className="pt-1 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-[11px]">
                        <span className="text-slate-400 text-[10px]">Scheduling Decision:</span>
                        <span className={`font-mono text-[10px] px-2 py-0.5 rounded border font-semibold ${statusBadgeColor}`}>
                          {req.statusLabel}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-center space-y-1">
                <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Slot #{currentSlotIndex + 1} (Hour {currentSlotIndex * config.slotLengthHours}) is an idle interval
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Zero computational workload requests arrive during this slot. Click below to skip ahead to where requests arrive.
                </p>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => jumpToBurst(1)}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-600 text-white shadow-xs transition-colors"
                  >
                    <FastForward className="w-3.5 h-3.5" />
                    <span>Jump to Next Ingress Burst</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
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

                {/* Ingress Arrival Badge */}
                <div className="mb-2">
                  {data.arr > 0 ? (
                    <div className="flex items-center justify-between text-[10px] font-mono font-bold px-2 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300 shadow-2xs">
                      <span className="flex items-center gap-1">
                        <ArrowDown className="w-3 h-3 text-emerald-500 animate-bounce" />
                        Ingress Arrival:
                      </span>
                      <span>
                        +{data.arr.toFixed(1)} GB ({data.taskCount} {data.taskCount === 1 ? 'task' : 'tasks'})
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between text-[10px] font-mono px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800/50 text-slate-400 border border-slate-200/50 dark:border-slate-700/50">
                      <span className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-600" />
                        Ingress:
                      </span>
                      <span>0.0 GB (Idle)</span>
                    </div>
                  )}
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
                  <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-72 p-3.5 rounded-2xl bg-slate-900 text-white dark:bg-slate-950 border border-slate-700 shadow-xl text-[11px] space-y-1.5 pointer-events-none z-30 animate-in fade-in zoom-in-95">
                    <div className="flex justify-between font-bold border-b border-slate-800 pb-1">
                      <span>{cityName} Telemetry</span>
                      <span className="text-emerald-400">Slot #{currentSlotIndex + 1}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Incoming Workload:</span>
                      <span className="font-mono text-emerald-300 font-bold">
                        {data.arr > 0 ? `+${data.arr.toFixed(2)} GB (${data.taskCount} tasks)` : '0.00 GB (Idle)'}
                      </span>
                    </div>
                    {data.arr > 0 && (
                      <div className="flex justify-between text-[10px] text-slate-400">
                        <span>Task Compute Demand:</span>
                        <span className="font-mono text-slate-300">
                          {((data.arr * 8 * 1e9 * (config.phi.value || 1000)) / 1e12).toFixed(1)} TCycles
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-slate-400">Queue Depth:</span>
                      <span className="font-mono text-amber-300">{data.q.toFixed(2)} GB</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">CPU Frequency:</span>
                      <span className="font-mono text-emerald-300">{data.fGhz.toFixed(2)} GHz</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Processed this slot:</span>
                      <span className="font-mono text-slate-200">{data.proc.toFixed(1)} GB</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Energy Consumed:</span>
                      <span className="font-mono text-amber-300">
                        {data.ci > 0 ? (data.carb / data.ci).toFixed(2) : '0.00'} kWh
                      </span>
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
                    {formatFlowVolume(flow.volumeGb)}
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
                  {formatFlowVolume(flow.volumeGb)}
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
