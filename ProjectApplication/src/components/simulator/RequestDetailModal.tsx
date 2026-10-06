import React from 'react';
import { Modal } from '../common/Modal';
import { RequestTrace } from '../../types/simulation';
import { Clock, Cpu, Leaf, Zap, MapPin, CheckCircle2, XCircle } from 'lucide-react';

interface RequestDetailModalProps {
  request: RequestTrace | null;
  onClose: () => void;
  m1Name: string;
  m2Name: string;
}

export const RequestDetailModal: React.FC<RequestDetailModalProps> = ({
  request,
  onClose,
  m1Name,
  m2Name,
}) => {
  if (!request) return null;

  return (
    <Modal
      isOpen={!!request}
      onClose={onClose}
      title={`Task Inspection: ${request.id}`}
      subtitle={`Arrival: ${request.arrivalTimeMs} ms • Compute: ${request.cpuMips} MIPS • RAM: ${request.memoryMb} MB • Deadline: ${request.deadlineMs} ms`}
      maxWidth="max-w-2xl"
    >
      <div className="space-y-6 py-2">
        {/* Workload Profile Card */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
          <div>
            <span className="text-slate-400 block text-[10px]">QoS Class</span>
            <span className="font-bold text-slate-900 dark:text-white">{request.priority}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px]">CPU Workload</span>
            <span className="font-bold text-slate-900 dark:text-white">{request.cpuMips} MIPS</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px]">Payload Memory</span>
            <span className="font-bold text-slate-900 dark:text-white">{request.memoryMb} MB</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px]">SLA Deadline</span>
            <span className="font-bold text-slate-900 dark:text-white">{request.deadlineMs} ms</span>
          </div>
        </div>

        {/* Head to Head Decisions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Model 1 Decision */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                {m1Name}
              </span>
              {request.model1Decision.success ? (
                <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold font-mono">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Met SLA
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[11px] text-rose-600 dark:text-rose-400 font-semibold font-mono">
                  <XCircle className="w-3.5 h-3.5" /> SLA Breached
                </span>
              )}
            </div>

            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-slate-400">Assigned Node:</span>
                <span className="text-slate-800 dark:text-slate-200 font-semibold truncate max-w-[150px]">
                  {request.model1Decision.location}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Total Latency:</span>
                <span className="text-slate-800 dark:text-slate-200 font-bold">
                  {request.model1Decision.latencyMs} ms
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Queue + Network:</span>
                <span className="text-slate-500">
                  {request.model1Decision.queueDelayMs}ms + {request.model1Decision.transmissionDelayMs}ms
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Energy Consumed:</span>
                <span className="text-amber-500 font-bold">
                  {request.model1Decision.energyKwh} kWh
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Carbon Footprint:</span>
                <span className="text-rose-500 font-bold">
                  {request.model1Decision.carbonKg} kg CO₂
                </span>
              </div>
            </div>
          </div>

          {/* Model 2 Decision */}
          <div className="p-4 rounded-2xl bg-carbon-50/30 dark:bg-carbon-950/20 border-2 border-carbon-500/40 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-carbon-200/60 dark:border-carbon-900/60">
              <span className="text-xs font-bold text-carbon-700 dark:text-carbon-300">
                {m2Name}
              </span>
              {request.model2Decision.success ? (
                <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold font-mono">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Met SLA
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[11px] text-rose-600 dark:text-rose-400 font-semibold font-mono">
                  <XCircle className="w-3.5 h-3.5" /> SLA Breached
                </span>
              )}
            </div>

            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-slate-400">Assigned Node:</span>
                <span className="text-carbon-700 dark:text-carbon-300 font-semibold truncate max-w-[150px]">
                  {request.model2Decision.location}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Total Latency:</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                  {request.model2Decision.latencyMs} ms
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Queue + Network:</span>
                <span className="text-slate-500">
                  {request.model2Decision.queueDelayMs}ms + {request.model2Decision.transmissionDelayMs}ms
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Energy Consumed:</span>
                <span className="text-amber-500 font-bold">
                  {request.model2Decision.energyKwh} kWh
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Carbon Footprint:</span>
                <span className="text-carbon-600 dark:text-carbon-400 font-bold">
                  {request.model2Decision.carbonKg} kg CO₂
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Carbon & Energy Savings Delta Note */}
        <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs text-slate-600 dark:text-slate-300 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Leaf className="w-4 h-4 text-carbon-500" />
            <span>Task Carbon Differential:</span>
          </div>
          <span className="font-mono font-bold text-carbon-600 dark:text-carbon-400">
            {request.model1Decision.carbonKg > request.model2Decision.carbonKg
              ? `Saved ${(((request.model1Decision.carbonKg - request.model2Decision.carbonKg) / request.model1Decision.carbonKg) * 100).toFixed(1)}% CO₂`
              : 'Negligible variance'}
          </span>
        </div>
      </div>
    </Modal>
  );
};
