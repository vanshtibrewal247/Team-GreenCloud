import React from 'react';
import { Activity, Clock, Cpu, FileText, Layers, Zap } from 'lucide-react';
import { RequestConfig } from '../../types/simulation';
import { Tooltip } from '../common/Tooltip';

interface RequestConfigCardProps {
  config: RequestConfig;
  onChange: (updated: RequestConfig) => void;
}

export const RequestConfigCard: React.FC<RequestConfigCardProps> = ({ config, onChange }) => {
  const handleUpdate = <K extends keyof RequestConfig>(key: K, value: RequestConfig[K]) => {
    onChange({
      ...config,
      [key]: value,
    });
  };

  return (
    <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-sm hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 pb-3.5 mb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-start gap-2.5 min-w-0 flex-1">
          <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            <Activity className="w-5 h-5" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Request & Workload Configuration
              </h3>
              <Tooltip content="Defines the intensity, resource demands, and deadline stringency of client requests." />
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Task size, CPU cycles, arrival distributions, and strict SLA deadlines
            </p>
          </div>
        </div>

        <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 font-semibold border border-amber-200 dark:border-amber-800 shrink-0 whitespace-nowrap">
          Workload Generator
        </span>
      </div>

      {/* Controls */}
      <div className="space-y-4">
        {/* Sliders row: Requests Count & Arrival Rate */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <div className="flex justify-between items-start sm:items-center text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 gap-2">
              <div className="flex items-center gap-1 flex-wrap">
                <span>Total Workload Requests</span>
                <Tooltip content="Total synthetic tasks evaluated during the simulation run." />
              </div>
              <span className="font-mono text-sm text-amber-600 dark:text-amber-400 font-bold bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded border border-amber-200 dark:border-amber-900 shrink-0">
                {config.requestCount.toLocaleString()} Tasks
              </span>
            </div>
            <input
              type="range"
              min={200}
              max={5000}
              step={200}
              value={config.requestCount}
              onChange={(e) => handleUpdate('requestCount', Number(e.target.value))}
              className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
              <span>200 (Light)</span>
              <span>1,000 (Default)</span>
              <span>5,000 (Burst)</span>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-start sm:items-center text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 gap-2">
              <div className="flex items-center gap-1 flex-wrap">
                <span>Arrival Rate (req/s)</span>
                <Tooltip content="Poisson process arrival frequency per second." />
              </div>
              <span className="font-mono text-sm text-amber-600 dark:text-amber-400 font-bold bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded border border-amber-200 dark:border-amber-900 shrink-0">
                {config.arrivalRate} req/sec
              </span>
            </div>
            <input
              type="range"
              min={20}
              max={400}
              step={20}
              value={config.arrivalRate}
              onChange={(e) => handleUpdate('arrivalRate', Number(e.target.value))}
              className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
              <span>20 req/s</span>
              <span>100 req/s</span>
              <span>400 req/s (Peak)</span>
            </div>
          </div>
        </div>

        {/* Sliders row: Task CPU & Deadline */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <div className="flex justify-between items-start sm:items-center text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 gap-2">
              <div className="flex items-center gap-1 flex-wrap">
                <span>Task Compute (MIPS)</span>
                <Tooltip content="Processing cycles required to complete the task." />
              </div>
              <span className="font-mono text-xs text-slate-600 dark:text-slate-300 font-semibold shrink-0">
                {config.cpuMipsReq} MIPS
              </span>
            </div>
            <input
              type="range"
              min={200}
              max={2000}
              step={100}
              value={config.cpuMipsReq}
              onChange={(e) => handleUpdate('cpuMipsReq', Number(e.target.value))}
              className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
          </div>

          <div>
            <div className="flex justify-between items-start sm:items-center text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 gap-2">
              <div className="flex items-center gap-1 flex-wrap">
                <span>Deadline SLA (ms)</span>
                <Tooltip content="Maximum acceptable end-to-end response time before the task is considered failed." />
              </div>
              <span className="font-mono text-xs text-slate-600 dark:text-slate-300 font-semibold shrink-0">
                {config.deadlineMs} ms
              </span>
            </div>
            <input
              type="range"
              min={40}
              max={250}
              step={10}
              value={config.deadlineMs}
              onChange={(e) => handleUpdate('deadlineMs', Number(e.target.value))}
              className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
          </div>
        </div>

        {/* Task Size, Memory & Priority Selection */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Payload Transfer Size
            </label>
            <select
              value={config.taskSizeKb}
              onChange={(e) => handleUpdate('taskSizeKb', Number(e.target.value))}
              className="w-full px-2.5 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
            >
              <option value={100}>100 KB (Telemetry)</option>
              <option value={350}>350 KB (Compressed Frame)</option>
              <option value={800}>800 KB (Sensor Batch)</option>
              <option value={2500}>2.5 MB (Video Segment)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Memory Footprint
            </label>
            <select
              value={config.memoryMbReq}
              onChange={(e) => handleUpdate('memoryMbReq', Number(e.target.value))}
              className="w-full px-2.5 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
            >
              <option value={64}>64 MB RAM</option>
              <option value={128}>128 MB RAM</option>
              <option value={256}>256 MB RAM</option>
              <option value={512}>512 MB RAM</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Task QoS Class
            </label>
            <select
              value={config.priority}
              onChange={(e) => handleUpdate('priority', e.target.value as any)}
              className="w-full px-2.5 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
            >
              <option value="mixed">Mixed QoS (Real-world blend)</option>
              <option value="high">High Priority (Autonomous/Safety)</option>
              <option value="medium">Medium Priority (Mobile/Web)</option>
              <option value="low">Low Priority (Delay-tolerant sync)</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};
