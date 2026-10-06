import React, { useState } from 'react';
import { EdgeConfig, CloudConfig } from '../../types/simulation';
import { REGIONS } from '../../services/carbonService';
import { Cpu, Cloud, Radio, Play, Pause } from 'lucide-react';

interface InfrastructureVisualizerProps {
  edge: EdgeConfig;
  cloud: CloudConfig;
  isSimulating?: boolean;
}

export const InfrastructureVisualizer: React.FC<InfrastructureVisualizerProps> = ({
  edge,
  cloud,
  isSimulating = false,
}) => {
  const [animating, setAnimating] = useState(true);
  const [selectedNode, setSelectedNode] = useState<number | null>(null);

  const edgeRegion = REGIONS[edge.region] || REGIONS.delhi;
  const cloudRegion = REGIONS[cloud.region] || REGIONS.singapore;

  // Render edge nodes array matching edge.serverCount exactly!
  const edgeNodes = Array.from({ length: edge.serverCount }, (_, i) => ({
    id: i + 1,
    name: `Edge-${i + 1}`,
    mips: edge.cpuMips,
    ram: edge.ramGb,
    utilization: Math.round(35 + ((i * 17) % 45)),
    tempC: Math.round(42 + ((i * 7) % 22)),
  }));

  // Render cloud clusters array matching cloud.serverCount exactly!
  const cloudNodes = Array.from({ length: cloud.serverCount }, (_, i) => ({
    id: i + 1,
    name: `Cloud-DC-${i + 1}`,
    mips: cloud.cpuMips,
    ram: cloud.ramGb,
    utilization: Math.round(48 + ((i * 13) % 36)),
  }));

  return (
    <div className="rounded-3xl bg-slate-900 border border-slate-800 p-4 sm:p-5 text-white shadow-xl relative overflow-hidden">
      {/* Background visual effects */}
      <div className="absolute top-0 right-1/4 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-cloud-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Visualizer Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3.5 mb-4 border-b border-slate-800 relative z-10">
        <div className="min-w-0 flex-1 space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 relative shrink-0">
              <span
                className={`animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 ${
                  animating ? '' : 'hidden'
                }`}
              />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
            </span>
            <h3 className="text-sm sm:text-base font-bold text-white tracking-tight">
              Live Topology & Offloading Pipeline
            </h3>
          </div>
          <p className="text-xs text-slate-400 font-mono truncate sm:overflow-visible">
            Synchronized: {edge.serverCount} Edge Nodes ({edgeRegion.name}) • {cloud.serverCount} Cloud DCs ({cloudRegion.name})
          </p>
        </div>

        <div className="shrink-0 self-start sm:self-center">
          <button
            onClick={() => setAnimating(!animating)}
            className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors text-xs flex items-center gap-1.5 font-mono border border-slate-700/80 shadow-sm"
            title={animating ? 'Pause animations' : 'Resume animations'}
          >
            {animating ? (
              <Pause className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <Play className="w-3.5 h-3.5 text-slate-400" />
            )}
            <span>{animating ? 'Live' : 'Paused'}</span>
          </button>
        </div>
      </div>

      {/* Topology Flow Canvas */}
      <div className="space-y-3 sm:space-y-3.5 relative z-10">
        {/* TIER 1: IoT & Edge Devices */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-800/80 border border-slate-700/80 relative">
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2 text-cloud-300 font-bold text-xs sm:text-sm min-w-0">
              <Radio className={`w-4 h-4 text-cloud-400 shrink-0 ${animating ? 'animate-pulse' : ''}`} />
              <span className="truncate sm:overflow-visible">Tier 1 — IoT Ingestion & Smart Edge Devices</span>
            </div>
            <span className="font-mono text-[10px] text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/60 shrink-0">
              Generates Tasks • Real-time
            </span>
          </div>

          {/* Responsive CSS Grid: 1 col on mobile, 2x2 on tablet, 4 on desktop */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-2.5">
            {[
              { type: 'Autonomous Mobility', req: '500 MIPS', qos: '18ms' },
              { type: 'Smart Grid Sensor', req: '240 MIPS', qos: '45ms' },
              { type: 'Robotic Vision', req: '920 MIPS', qos: '25ms' },
              { type: 'Health Monitor', req: '160 MIPS', qos: '80ms' },
            ].map((dev, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-700/60 hover:border-slate-600 transition-all flex flex-col justify-between h-[104px] min-w-0"
              >
                <div>
                  <div className="text-white font-medium text-xs leading-snug line-clamp-2 h-8 break-words">
                    {dev.type}
                  </div>
                  <div className="text-[11px] font-mono font-bold text-slate-300 mt-0.5">
                    {dev.req}
                  </div>
                </div>
                <div className="pt-1.5 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-400">
                  <span className="text-[9px] uppercase tracking-wider text-slate-500">Latency SLA</span>
                  <span className="text-cloud-400 font-bold bg-cloud-950/60 px-1.5 py-0.5 rounded border border-cloud-800/50">
                    {dev.qos}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Dedicated SLA Area */}
          <div className="mt-3 pt-2 border-t border-slate-700/60 flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-2 text-slate-400">
              <span className="w-1.5 h-1.5 rounded-full bg-cloud-400" />
              <span>Strict QoS Deadline Target:</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-cloud-950/70 border border-cloud-800/70 text-cloud-300 font-bold text-[11px]">
              <span>SLA: 80ms</span>
            </div>
          </div>
        </div>

        {/* Animated Connector 1: IoT -> Edge */}
        <div className="my-1 sm:my-1.5 flex items-center justify-center gap-2.5">
          <div className="flex-1 border-t border-dashed border-emerald-500/30" />
          <div className="shrink-0 px-3 py-1 rounded-full bg-slate-900 border border-emerald-500/40 text-emerald-400 text-[10px] sm:text-[11px] font-mono font-medium flex items-center gap-1.5 shadow-sm">
            <span className={`w-1.5 h-1.5 rounded-full bg-emerald-400 ${animating ? 'animate-ping' : ''}`} />
            <span>5G Low-Latency Fronthaul (sub-10ms)</span>
            <span className="text-emerald-500/80 font-bold">↓</span>
          </div>
          <div className="flex-1 border-t border-dashed border-emerald-500/30" />
        </div>

        {/* TIER 2: Edge Nodes Layer (Scales dynamically with edge.serverCount) */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-800/80 border border-emerald-500/40 relative">
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2 text-emerald-300 font-bold text-xs sm:text-sm min-w-0">
              <Cpu className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="truncate sm:overflow-visible">
                Tier 2 — Local Edge Cluster ({edge.serverCount} Nodes in {edgeRegion.name})
              </span>
            </div>
            <div className="flex items-center gap-1.5 font-mono text-[10px] text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/60 shrink-0">
              <span>Grid: {edgeRegion.avgCarbonIntensity} gCO₂/kWh</span>
            </div>
          </div>

          {/* Dynamic Grid of Edge Nodes (No internal scrollbar!) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-2.5">
            {edgeNodes.map((node) => (
              <div
                key={node.id}
                onClick={() => setSelectedNode(node.id === selectedNode ? null : node.id)}
                className={`p-2.5 rounded-xl border transition-all cursor-pointer text-left flex flex-col justify-between min-w-0 group h-[138px] ${
                  selectedNode === node.id
                    ? 'bg-emerald-950/80 border-emerald-400 shadow-md shadow-emerald-500/20 ring-1 ring-emerald-400/50'
                    : 'bg-slate-900/90 border-slate-700/80 hover:border-emerald-500/60 hover:bg-slate-800/90'
                }`}
              >
                {/* Node Name & Status Indicator */}
                <div className="flex items-center justify-between gap-1 text-xs font-mono font-bold">
                  <span className="text-white group-hover:text-emerald-300 truncate">
                    {node.name}
                  </span>
                  <span
                    className={`w-2 h-2 rounded-full shrink-0 ${
                      node.utilization > 70 ? 'bg-amber-400' : 'bg-emerald-400'
                    } ${animating ? 'animate-pulse' : ''}`}
                    title={node.utilization > 70 ? 'High Load' : 'Optimal'}
                  />
                </div>

                {/* CPU & RAM Specs */}
                <div className="text-[11px] font-mono space-y-1 my-1">
                  <div>
                    <div className="text-[9px] uppercase tracking-wider text-slate-400 font-semibold leading-none">
                      CPU
                    </div>
                    <div className="text-slate-100 font-bold text-[11px] leading-tight mt-0.5">
                      {node.mips} MIPS
                    </div>
                  </div>
                  <div>
                    <div className="text-[9px] uppercase tracking-wider text-slate-400 font-semibold leading-none">
                      RAM
                    </div>
                    <div className="text-slate-100 font-bold text-[11px] leading-tight mt-0.5">
                      {node.ram} GB
                    </div>
                  </div>
                </div>

                {/* Micro Utilization Bar */}
                <div className="pt-1.5 border-t border-slate-800">
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-1">
                    <span className="text-[9px] uppercase tracking-wider text-slate-500">Utilization</span>
                    <span className="text-emerald-400 font-semibold">{node.utilization}%</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-emerald-500 h-full rounded-full transition-all duration-300"
                      style={{ width: `${node.utilization}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Animated Connector 2: Edge -> Cloud */}
        <div className="my-1 sm:my-1.5 flex items-center justify-center gap-2.5">
          <div className="flex-1 border-t border-dashed border-cloud-500/30" />
          <div className="shrink-0 px-3 py-1 rounded-full bg-slate-900 border border-cloud-500/40 text-cloud-400 text-[10px] sm:text-[11px] font-mono font-medium flex items-center gap-1.5 shadow-sm">
            <span className={`w-1.5 h-1.5 rounded-full bg-cloud-400 ${animating ? 'animate-ping' : ''}`} />
            <span>High-Speed Optical Backhaul / WAN Offload</span>
            <span className="text-cloud-500/80 font-bold">↓</span>
          </div>
          <div className="flex-1 border-t border-dashed border-cloud-500/30" />
        </div>

        {/* TIER 3: Hyperscale Cloud Datacenters (Scales with cloud.serverCount) */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-800/80 border border-cloud-500/40 relative">
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2 text-cloud-300 font-bold text-xs sm:text-sm min-w-0">
              <Cloud className="w-4 h-4 text-cloud-400 shrink-0" />
              <span className="truncate sm:overflow-visible">
                Tier 3 — Centralized Cloud Datacenters ({cloud.serverCount} Instances in {cloudRegion.name})
              </span>
            </div>
            <div className="flex items-center gap-1.5 font-mono text-[10px] text-cloud-400 bg-cloud-950/60 px-2 py-0.5 rounded border border-cloud-800/60 shrink-0">
              <span>Grid: {cloudRegion.avgCarbonIntensity} gCO₂/kWh</span>
            </div>
          </div>

          {/* 2-Column Responsive Grid on Desktop/Tablet, 1 Col on Mobile */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {cloudNodes.map((dc) => (
              <div
                key={dc.id}
                className="p-3.5 rounded-xl bg-slate-900/90 border border-cloud-500/30 hover:border-cloud-500/60 transition-all font-mono flex flex-col justify-between min-w-0 h-[144px] shadow-sm"
              >
                {/* DC Header */}
                <div className="flex items-center justify-between font-bold text-white text-xs sm:text-sm">
                  <div className="flex items-center gap-2 min-w-0">
                    <Cloud className="w-4 h-4 text-cloud-400 shrink-0" />
                    <span className="truncate">{dc.name}</span>
                  </div>
                  <span className="w-2.5 h-2.5 rounded-full bg-cloud-400 animate-pulse shrink-0 shadow-sm shadow-cloud-400/50" />
                </div>

                {/* Capacity & RAM Grid */}
                <div className="grid grid-cols-2 gap-3 py-2 border-y border-slate-800/80 my-1 text-xs">
                  <div>
                    <div className="text-[9px] uppercase text-slate-400 font-semibold tracking-wider">
                      Cluster Capacity
                    </div>
                    <div className="text-slate-100 font-bold text-xs sm:text-sm mt-0.5">
                      {dc.mips.toLocaleString()} MIPS
                    </div>
                  </div>
                  <div>
                    <div className="text-[9px] uppercase text-slate-400 font-semibold tracking-wider">
                      Total RAM
                    </div>
                    <div className="text-slate-100 font-bold text-xs sm:text-sm mt-0.5">
                      {dc.ram} GB
                    </div>
                  </div>
                </div>

                {/* Status Row */}
                <div className="flex items-center justify-between text-xs pt-0.5 text-slate-400">
                  <span className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">
                    Status
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-xs text-cloud-300 font-semibold bg-cloud-950/70 border border-cloud-800/70 px-2.5 py-0.5 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-cloud-400" />
                    Elastic • Online
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
