import React, { useState } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
} from 'recharts';
import { ModelMetrics, TimeSeriesPoint } from '../../types/simulation';
import { BarChart3, LineChart as LineChartIcon, PieChart as PieChartIcon, Activity } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface ChartsSectionProps {
  model1: ModelMetrics;
  model2: ModelMetrics;
  timeSeries: TimeSeriesPoint[];
}

export const ChartsSection: React.FC<ChartsSectionProps> = ({
  model1,
  model2,
  timeSeries,
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [activeTab, setActiveTab] = useState<'kpi' | 'temporal' | 'distribution'>('kpi');

  // Colors
  const m1Color = '#64748b'; // slate
  const m2Color = '#10b981'; // emerald
  const cloudColor = '#0ea5e9'; // sky
  const carbonColor = '#f59e0b'; // amber
  const gridColor = isDark ? '#334155' : '#e2e8f0';
  const textColor = isDark ? '#94a3b8' : '#64748b';

  // KPI comparison dataset for Bar Charts
  const kpiData = [
    {
      metric: 'Avg Latency (ms)',
      [model1.algorithmName]: model1.avgLatencyMs,
      [model2.algorithmName]: model2.avgLatencyMs,
    },
    {
      metric: 'P95 Latency (ms)',
      [model1.algorithmName]: model1.p95LatencyMs,
      [model2.algorithmName]: model2.p95LatencyMs,
    },
    {
      metric: 'Energy (kWh)',
      [model1.algorithmName]: model1.totalEnergyKwh,
      [model2.algorithmName]: model2.totalEnergyKwh,
    },
    {
      metric: 'Carbon (kg CO₂)',
      [model1.algorithmName]: model1.totalCarbonKg,
      [model2.algorithmName]: model2.totalCarbonKg,
    },
  ];

  // Pie chart palette
  const PIE_COLORS = ['#10b981', '#06b6d4', '#6366f1', '#8b5cf6', '#f59e0b', '#ec4899'];

  return (
    <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
      {/* Header & Sub-navigation tabs */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-carbon-500" />
            <span>Interactive Simulation Analytics</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Compare latency curves, energy draw, carbon fluctuations, and spatial task allocations.
          </p>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-semibold">
          <button
            onClick={() => setActiveTab('kpi')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'kpi'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Core KPIs</span>
          </button>

          <button
            onClick={() => setActiveTab('temporal')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'temporal'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <LineChartIcon className="w-3.5 h-3.5" />
            <span>Timeline Traces</span>
          </button>

          <button
            onClick={() => setActiveTab('distribution')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'distribution'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <PieChartIcon className="w-3.5 h-3.5" />
            <span>Task Distribution</span>
          </button>
        </div>
      </div>

      {/* TAB 1: Core KPIs (Latency, Energy, Carbon Bar Charts) */}
      {activeTab === 'kpi' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Chart 1: Latency Comparison */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                  Latency Comparison (ms)
                </h4>
                <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                  Lower is better
                </span>
              </div>
              <div className="h-56 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[
                      {
                        name: 'Avg Latency',
                        [model1.algorithmName]: model1.avgLatencyMs,
                        [model2.algorithmName]: model2.avgLatencyMs,
                      },
                      {
                        name: 'P95 Tail',
                        [model1.algorithmName]: model1.p95LatencyMs,
                        [model2.algorithmName]: model2.p95LatencyMs,
                      },
                    ]}
                    margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                    <XAxis dataKey="name" tick={{ fill: textColor, fontSize: 11 }} />
                    <YAxis tick={{ fill: textColor, fontSize: 11 }} unit="ms" />
                    <RechartsTooltip
                      contentStyle={{
                        backgroundColor: isDark ? '#0f172a' : '#ffffff',
                        borderColor: gridColor,
                        borderRadius: '12px',
                        fontSize: '12px',
                      }}
                    />
                    <Bar dataKey={model1.algorithmName} fill={m1Color} radius={[6, 6, 0, 0]} />
                    <Bar dataKey={model2.algorithmName} fill={m2Color} radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 2: Energy Consumption */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                  Energy Consumption (kWh)
                </h4>
                <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                  Power efficiency
                </span>
              </div>
              <div className="h-56 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[
                      {
                        name: 'Energy Draw',
                        [model1.algorithmName]: model1.totalEnergyKwh,
                        [model2.algorithmName]: model2.totalEnergyKwh,
                      },
                    ]}
                    margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                    <XAxis dataKey="name" tick={{ fill: textColor, fontSize: 11 }} />
                    <YAxis tick={{ fill: textColor, fontSize: 11 }} unit="kWh" />
                    <RechartsTooltip
                      contentStyle={{
                        backgroundColor: isDark ? '#0f172a' : '#ffffff',
                        borderColor: gridColor,
                        borderRadius: '12px',
                        fontSize: '12px',
                      }}
                    />
                    <Bar dataKey={model1.algorithmName} fill={m1Color} radius={[6, 6, 0, 0]} />
                    <Bar dataKey={model2.algorithmName} fill={m2Color} radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 3: Carbon Emissions */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                  Carbon Emissions (kg CO₂)
                </h4>
                <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                  Scope-2 Impact
                </span>
              </div>
              <div className="h-56 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[
                      {
                        name: 'CO₂ Footprint',
                        [model1.algorithmName]: model1.totalCarbonKg,
                        [model2.algorithmName]: model2.totalCarbonKg,
                      },
                    ]}
                    margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                    <XAxis dataKey="name" tick={{ fill: textColor, fontSize: 11 }} />
                    <YAxis tick={{ fill: textColor, fontSize: 11 }} unit="kg" />
                    <RechartsTooltip
                      contentStyle={{
                        backgroundColor: isDark ? '#0f172a' : '#ffffff',
                        borderColor: gridColor,
                        borderRadius: '12px',
                        fontSize: '12px',
                      }}
                    />
                    <Bar dataKey={model1.algorithmName} fill={m1Color} radius={[6, 6, 0, 0]} />
                    <Bar dataKey={model2.algorithmName} fill={m2Color} radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Temporal Traces (Tasks Over Time, Grid Carbon Intensity, Edge vs Cloud) */}
      {activeTab === 'temporal' && (
        <div className="space-y-6">
          {/* Chart 4: Tasks Over Time & Latency Profile */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                Workload Volume & Response Latency Over 24h Timeframe
              </h4>
              <span className="text-[10px] font-mono text-slate-400">
                Hourly trace intervals
              </span>
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={timeSeries} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                  <XAxis dataKey="timeLabel" tick={{ fill: textColor, fontSize: 10 }} />
                  <YAxis yAxisId="left" tick={{ fill: textColor, fontSize: 10 }} unit="ms" />
                  <YAxis yAxisId="right" orientation="right" tick={{ fill: textColor, fontSize: 10 }} unit="req" />
                  <RechartsTooltip
                    contentStyle={{
                      backgroundColor: isDark ? '#0f172a' : '#ffffff',
                      borderColor: gridColor,
                      borderRadius: '12px',
                      fontSize: '12px',
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="requestVolume"
                    name="Request Volume"
                    stroke="#cbd5e1"
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="model1Latency"
                    name={`${model1.algorithmName} Latency`}
                    stroke={m1Color}
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="model2Latency"
                    name={`${model2.algorithmName} Latency`}
                    stroke={m2Color}
                    strokeWidth={2.5}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Chart 5: Dynamic Carbon Intensity Line Chart */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                  Regional Grid Carbon Intensity Over Time
                </h4>
                <span className="text-[10px] font-mono text-amber-500 font-bold">
                  Solar peak dip (11am-3pm)
                </span>
              </div>
              <div className="h-56 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={timeSeries} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                    <XAxis dataKey="timeLabel" tick={{ fill: textColor, fontSize: 10 }} />
                    <YAxis tick={{ fill: textColor, fontSize: 10 }} unit="g" />
                    <RechartsTooltip
                      contentStyle={{
                        backgroundColor: isDark ? '#0f172a' : '#ffffff',
                        borderColor: gridColor,
                        borderRadius: '12px',
                        fontSize: '12px',
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="carbonIntensity"
                      name="gCO₂/kWh Grid Intensity"
                      stroke={carbonColor}
                      strokeWidth={2.5}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 6: Edge vs Cloud Offloading Stacked Bar Chart */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                  Spatial Offload: Edge vs Cloud Execution Ratio
                </h4>
                <span className="text-[10px] font-mono text-emerald-500 font-bold">
                  Model 2 Adaptive Split
                </span>
              </div>
              <div className="h-56 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={timeSeries.slice(0, 12)} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                    <XAxis dataKey="timeLabel" tick={{ fill: textColor, fontSize: 10 }} />
                    <YAxis tick={{ fill: textColor, fontSize: 10 }} />
                    <RechartsTooltip
                      contentStyle={{
                        backgroundColor: isDark ? '#0f172a' : '#ffffff',
                        borderColor: gridColor,
                        borderRadius: '12px',
                        fontSize: '12px',
                      }}
                    />
                    <Bar dataKey="model2EdgeTasks" name="Edge Tasks" stackId="a" fill={m2Color} />
                    <Bar dataKey="model2CloudTasks" name="Cloud Tasks" stackId="a" fill={cloudColor} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Task Distribution (Pie/Donut Charts) */}
      {activeTab === 'distribution' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Model 1 Distribution */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white text-center mb-1">
              {model1.algorithmName} Placement Breakdown
            </h4>
            <p className="text-[11px] text-slate-400 text-center mb-4">
              Edge Utilization: {model1.edgeUtilizationPct}% • Cloud: {model1.cloudUtilizationPct}%
            </p>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={model1.distribution}
                    dataKey="count"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={3}
                  >
                    {model1.distribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip
                    contentStyle={{
                      backgroundColor: isDark ? '#0f172a' : '#ffffff',
                      borderColor: gridColor,
                      borderRadius: '12px',
                      fontSize: '12px',
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Model 2 Distribution */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-emerald-500/30 dark:border-emerald-500/20">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white text-center mb-1">
              {model2.algorithmName} Placement Breakdown
            </h4>
            <p className="text-[11px] text-slate-400 text-center mb-4">
              Edge Utilization: {model2.edgeUtilizationPct}% • Cloud: {model2.cloudUtilizationPct}%
            </p>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={model2.distribution}
                    dataKey="count"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={3}
                  >
                    {model2.distribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip
                    contentStyle={{
                      backgroundColor: isDark ? '#0f172a' : '#ffffff',
                      borderColor: gridColor,
                      borderRadius: '12px',
                      fontSize: '12px',
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
