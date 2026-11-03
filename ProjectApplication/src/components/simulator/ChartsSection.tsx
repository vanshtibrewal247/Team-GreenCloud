import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ReferenceLine,
} from 'recharts';
import { BarChart3, LineChart as LineChartIcon, ScatterChart as ScatterIcon, Activity } from 'lucide-react';
import { SimSummary, VSweepPoint, AlgorithmType } from '../../sim/types';
import { usesLyapunovV } from '../../sim/config';
interface ChartsSectionProps {
  baselineSummary: SimSummary;
  targetSummary: SimSummary;
  benchmarkPoints: Array<{ algorithm: AlgorithmType; carbonKg: number; avgQueueGb: number }>;
  vSweepPoints: VSweepPoint[];
}
export const ChartsSection: React.FC<ChartsSectionProps> = ({
  baselineSummary,
  targetSummary,
  benchmarkPoints,
  vSweepPoints,
}) => {
  const [activeTab, setActiveTab] = useState<'temporal' | 'queue' | 'cumulative' | 'pareto' | 'vsweep'>('pareto');
  const bName = baselineSummary.mlModelLabel ? (baselineSummary.algorithm + ' (' + baselineSummary.mlModelLabel + ')') : baselineSummary.algorithm;
  const tName = targetSummary.mlModelLabel ? (targetSummary.algorithm + ' (' + targetSummary.mlModelLabel + ')') : targetSummary.algorithm;
  // Build time-series dataset downsampled to ~150 points for smooth rendering
  const timeSeriesData = useMemo(() => {
    const numSlots = Math.min(baselineSummary.slots.length, targetSummary.slots.length);
    const step = Math.max(1, Math.floor(numSlots / 120));
    let bCumul = 0;
    let tCumul = 0;
    const points = [];
    for (let i = 0; i < numSlots; i++) {
      const bSlot = baselineSummary.slots[i];
      const tSlot = targetSummary.slots[i];
      const bSlotCarbKg = (bSlot?.slotCarbonGrams || 0) / 1000;
      const tSlotCarbKg = (tSlot?.slotCarbonGrams || 0) / 1000;
      bCumul += bSlotCarbKg;
      tCumul += tSlotCarbKg;
      if (i % step === 0 || i === numSlots - 1) {
        let bQueue = 0;
        let tQueue = 0;
        if (bSlot) {
          for (const q of Object.values(bSlot.edgeQueues)) bQueue += q;
        }
        if (tSlot) {
          for (const q of Object.values(tSlot.edgeQueues)) tQueue += q;
        }
        points.push({
          slot: i + 1,
          hour: i * targetSummary.slotLengthHours,
          [`${bName} Carbon`]: parseFloat(bSlotCarbKg.toFixed(3)),
          [`${tName} Carbon`]: parseFloat(tSlotCarbKg.toFixed(3)),
          [`${bName} Queue`]: parseFloat(bQueue.toFixed(2)),
          [`${tName} Queue`]: parseFloat(tQueue.toFixed(2)),
          [`${bName} Cumulative`]: parseFloat(bCumul.toFixed(2)),
          [`${tName} Cumulative`]: parseFloat(tCumul.toFixed(2)),
        });
      }
    }
    return points;
  }, [baselineSummary, targetSummary, bName, tName]);
  // Scatter chart data for 7 algorithms
  const scatterData = useMemo(() => {
    return benchmarkPoints.map(bp => ({
      name: bp.algorithm,
      avgQueueGb: parseFloat(bp.avgQueueGb.toFixed(2)),
      totalCarbonKg: parseFloat(bp.carbonKg.toFixed(2)),
      isTarget: bp.algorithm === tName,
      isBaseline: bp.algorithm === bName,
    }));
  }, [benchmarkPoints, bName, tName]);
  // V-Sweep curve data sorted by queue
  const sweepData = useMemo(() => {
    return vSweepPoints.map(p => ({
      v: p.v,
      avgQueueGb: parseFloat(p.avgQueueGb.toFixed(2)),
      totalCarbonKg: parseFloat(p.totalCarbonKg.toFixed(2)),
      gCO2PerGb: parseFloat(p.carbonPerGbProcessed.toFixed(3)),
    }));
  }, [vSweepPoints]);
  return (
    <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-sm space-y-5">
      {/* Tab Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3.5 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <LineChartIcon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Comparative Analytical Charts
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Temporal dynamics, cumulative emissions, and Lyapunov queue-delay vs carbon trade-offs
            </p>
          </div>
        </div>
        {/* Chart Selector Buttons */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 dark:bg-slate-800/80 p-1.5 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('pareto')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              activeTab === 'pareto'
                ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Scatter (7 Algorithms + V-Sweep)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('temporal')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              activeTab === 'temporal'
                ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Per-Slot Carbon
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('queue')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              activeTab === 'queue'
                ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Per-Slot Total Queue
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('cumulative')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              activeTab === 'cumulative'
                ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Cumulative Carbon
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('vsweep')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              activeTab === 'vsweep'
                ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Target V-Sweep Curve
          </button>
        </div>
      </div>
      {/* Tab 1: Scatter Chart of 7 Algorithms + DWPA V-Sweep Curve */}
      {activeTab === 'pareto' && (
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                Operational Carbon vs Average Queue (All 7 Algorithms + 30x V-Sweep Curve)
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Carbon alone is misleading when queues differ! Lyapunov optimization maps out the continuous frontier.
              </p>
            </div>
          </div>
          <div className="h-80 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 20, right: 30, bottom: 20, left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                <XAxis
                  type="number"
                  dataKey="avgQueueGb"
                  name="Avg Total Queue"
                  unit=" GB"
                  stroke="#94a3b8"
                  fontSize={11}
                  domain={['auto', 'auto']}
                />
                <YAxis
                  type="number"
                  dataKey="totalCarbonKg"
                  name="Total Carbon"
                  unit=" kg"
                  stroke="#94a3b8"
                  fontSize={11}
                  domain={['auto', 'auto']}
                />
                <RechartsTooltip
                  cursor={{ strokeDasharray: '3 3' }}
                  content={({ payload }) => {
                    if (!payload || payload.length === 0) return null;
                    const d = payload[0].payload;
                    return (
                      <div className="p-3 rounded-2xl bg-slate-900 text-white border border-slate-700 shadow-xl text-xs space-y-1">
                        <p className="font-bold text-emerald-400">{d.name || 'V-Sweep Point'}</p>
                        <p>Avg Queue: <span className="font-mono text-amber-300">{d.avgQueueGb} GB</span></p>
                        <p>Total Carbon: <span className="font-mono text-rose-300">{d.totalCarbonKg} kg</span></p>
                        {d.v && <p className="text-[10px] text-slate-400">V: {d.v.toExponential(2)}</p>}
                      </div>
                    );
                  }}
                />
                <Legend wrapperStyle={{ fontSize: 12, paddingTop: 10 }} />
                {/* V-Sweep Line */}
                <Scatter
                  name="DWPA V-Sweep Curve (0.1x to 30x)"
                  data={sweepData}
                  line={{ stroke: '#10b981', strokeWidth: 2, strokeDasharray: '4 4' }}
                  fill="#10b981"
                  shape="circle"
                />
                {/* 7 Algorithm Points */}
                <Scatter
                  name="Algorithms"
                  data={scatterData}
                  fill="#38bdf8"
                  shape="square"
                />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
      {/* Tab 2: Per-Slot Carbon */}
      {activeTab === 'temporal' && (
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
              Hourly Per-Slot Carbon Emissions (kg CO₂ / Slot)
            </h4>
            <span className="text-xs font-mono text-slate-500">
              {timeSeriesData.length} Data Points
            </span>
          </div>
          <div className="h-80 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timeSeriesData} margin={{ top: 10, right: 20, bottom: 20, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                <XAxis dataKey="hour" stroke="#94a3b8" fontSize={11} unit="h" />
                <YAxis stroke="#94a3b8" fontSize={11} unit=" kg" />
                <RechartsTooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '1rem', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: 12, paddingTop: 10 }} />
                <Line type="monotone" dataKey={`${bName} Carbon`} stroke="#94a3b8" strokeWidth={1.5} strokeDasharray="4 4" dot={false} />
                <Line type="monotone" dataKey={`${tName} Carbon`} stroke="#10b981" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
      {/* Tab 3: Per-Slot Queue Backlog */}
      {activeTab === 'queue' && (
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
              Cluster Total Queue Backlog Over Time (GB)
            </h4>
            <span className="text-xs font-mono text-slate-500">
              Latency Proxy (Queuing Delay)
            </span>
          </div>
          <div className="h-80 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timeSeriesData} margin={{ top: 10, right: 20, bottom: 20, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                <XAxis dataKey="hour" stroke="#94a3b8" fontSize={11} unit="h" />
                <YAxis stroke="#94a3b8" fontSize={11} unit=" GB" />
                <RechartsTooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '1rem', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: 12, paddingTop: 10 }} />
                <Line type="monotone" dataKey={`${bName} Queue`} stroke="#94a3b8" strokeWidth={1.5} strokeDasharray="4 4" dot={false} />
                <Line type="monotone" dataKey={`${tName} Queue`} stroke="#38bdf8" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
      {/* Tab 4: Cumulative Carbon */}
      {activeTab === 'cumulative' && (
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
              Cumulative Total Operational Carbon Emissions (kg CO₂)
            </h4>
            <span className="text-xs font-mono text-slate-500">
              Full 775-Hour Trace Trajectory
            </span>
          </div>
          <div className="h-80 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timeSeriesData} margin={{ top: 10, right: 20, bottom: 20, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                <XAxis dataKey="hour" stroke="#94a3b8" fontSize={11} unit="h" />
                <YAxis stroke="#94a3b8" fontSize={11} unit=" kg" />
                <RechartsTooltip
                  content={({ active, payload, label }) => {
                    if (!active || !payload || payload.length === 0) return null;
                    const bVal = Number(payload.find(p => p.dataKey === `${bName} Cumulative`)?.value || 0);
                    const tVal = Number(payload.find(p => p.dataKey === `${tName} Cumulative`)?.value || 0);
                    const diff = tVal - bVal;
                    return (
                      <div className="p-3 rounded-2xl bg-slate-900 text-white border border-slate-700 shadow-xl text-xs space-y-1">
                        <p className="font-bold text-slate-300">Hour {label}</p>
                        <p className="text-slate-400">{bName}: <span className="font-mono text-slate-200 font-bold">{bVal.toFixed(2)} kg</span></p>
                        <p className="text-emerald-400">{tName}: <span className="font-mono text-emerald-300 font-bold">{tVal.toFixed(2)} kg</span></p>
                        {bVal > 0 && (
                          <p className="text-[11px] pt-1 border-t border-slate-800 text-slate-400">
                            Carbon Delta: <span className={`font-mono font-bold ${diff <= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                              {diff <= 0 ? `${diff.toFixed(2)} kg (-${Math.abs((diff / bVal) * 100).toFixed(1)}%)` : `+${diff.toFixed(2)} kg`}
                            </span>
                          </p>
                        )}
                      </div>
                    );
                  }}
                />
                <Legend wrapperStyle={{ fontSize: 12, paddingTop: 10 }} />
                <Line type="monotone" dataKey={`${bName} Cumulative`} stroke="#94a3b8" strokeWidth={2.5} strokeDasharray="5 5" dot={false} />
                <Line type="monotone" dataKey={`${tName} Cumulative`} stroke="#10b981" strokeWidth={2.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
      {/* Tab 5: Target V-Sweep Curve */}
      {activeTab === 'vsweep' && (
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                {usesLyapunovV(targetSummary.algorithm)
                  ? `${tName} Lyapunov V-Sweep Curve (Carbon vs Avg Queue)`
                  : `DWPA Baseline Lyapunov V-Sweep Curve (Carbon vs Avg Queue)`}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {usesLyapunovV(targetSummary.algorithm)
                  ? 'Trade-off curve across 14 log-spaced V points from 0.1x to 30x calibrated V'
                  : `${tName} does not use Lyapunov V parameter. Showing foundational DWPA baseline trade-off curve across 14 V points.`}
              </p>
            </div>
          </div>
          <div className="h-80 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sweepData} margin={{ top: 10, right: 20, bottom: 20, left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                <XAxis dataKey="avgQueueGb" stroke="#94a3b8" fontSize={11} unit=" GB" />
                <YAxis dataKey="totalCarbonKg" stroke="#94a3b8" fontSize={11} unit=" kg" />
                <RechartsTooltip
                  content={({ payload }) => {
                    if (!payload || payload.length === 0) return null;
                    const d = payload[0].payload;
                    return (
                      <div className="p-3 rounded-2xl bg-slate-900 text-white border border-slate-700 shadow-xl text-xs space-y-1">
                        <p className="font-bold text-emerald-400">V = {d.v?.toExponential(2)}</p>
                        <p>Total Carbon: <span className="font-mono text-rose-300">{d.totalCarbonKg} kg</span></p>
                        <p>Avg Queue: <span className="font-mono text-amber-300">{d.avgQueueGb} GB</span></p>
                        <p>Carbon / GB: <span className="font-mono text-sky-300">{d.gCO2PerGb} g/GB</span></p>
                      </div>
                    );
                  }}
                />
                <Line type="monotone" dataKey="totalCarbonKg" stroke="#10b981" strokeWidth={2.5} dot={{ r: 4, fill: '#10b981' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};
