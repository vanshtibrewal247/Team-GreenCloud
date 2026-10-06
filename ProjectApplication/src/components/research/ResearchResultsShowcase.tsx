import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { useTheme } from '../../context/ThemeContext';
import { AlertCircle, BarChart3 } from 'lucide-react';

export const ResearchResultsShowcase: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const gridColor = isDark ? '#334155' : '#e2e8f0';
  const textColor = isDark ? '#94a3b8' : '#64748b';

  // Benchmark data across 5 algorithms
  const benchmarkData = [
    { name: 'Round Robin', carbon: 78.4, energy: 138, latency: 68.2, success: 86.4 },
    { name: 'Random', carbon: 82.1, energy: 142, latency: 74.5, success: 83.1 },
    { name: 'CPU-Aware', carbon: 69.5, energy: 124, latency: 56.8, success: 93.5 },
    { name: 'Latency-Aware', carbon: 74.2, energy: 131, latency: 44.2, success: 97.2 },
    { name: 'Carbon (Reactive)', carbon: 54.1, energy: 108, latency: 59.4, success: 91.8 },
    { name: 'EDGE²CO (Proposed)', carbon: 41.8, energy: 89, latency: 42.1, success: 98.4 },
  ];

  // Pareto Frontier Tradeoff: Latency vs Carbon
  const paretoData = [
    { latency: 38, carbon: 68, label: 'Greedy Latency' },
    { latency: 42, carbon: 42, label: 'EDGE²CO (Optimal Pareto Knee)' },
    { latency: 48, carbon: 40, label: 'High-Green Delay' },
    { latency: 58, carbon: 38, label: 'Extreme Low Carbon' },
    { latency: 75, carbon: 80, label: 'Unoptimized' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            Empirical Benchmark Results
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Comparative performance across 50,000 requests on heterogeneous edge-cloud topologies.
          </p>
        </div>

        {/* Prototype Disclaimer Banner */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-amber-800 dark:text-amber-300 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0 text-amber-500" />
          <span>
            <strong>Academic Note:</strong> Results shown here are prototype/demo values until the final simulation experiments are integrated.
          </span>
        </div>
      </div>

      {/* 2 Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Carbon Emissions across 6 Algorithms */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white">
              Cumulative Carbon Footprint (kg CO₂)
            </h4>
            <span className="text-[11px] font-mono text-carbon-600 dark:text-carbon-400 font-bold">
              31.4% reduction
            </span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={benchmarkData} margin={{ top: 10, right: 10, left: -15, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                <XAxis
                  dataKey="name"
                  tick={{ fill: textColor, fontSize: 10 }}
                  interval={0}
                  angle={-20}
                  textAnchor="end"
                />
                <YAxis tick={{ fill: textColor, fontSize: 10 }} unit="kg" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDark ? '#0f172a' : '#ffffff',
                    borderColor: gridColor,
                    borderRadius: '12px',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="carbon" name="Carbon (kg CO₂)" fill="#10b981" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Latency & SLA Success Rate */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white">
              Latency (ms) & SLA Success Compliance (%)
            </h4>
            <span className="text-[11px] font-mono text-cloud-600 dark:text-cloud-400 font-bold">
              98.4% success
            </span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={benchmarkData} margin={{ top: 10, right: 10, left: -15, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                <XAxis
                  dataKey="name"
                  tick={{ fill: textColor, fontSize: 10 }}
                  interval={0}
                  angle={-20}
                  textAnchor="end"
                />
                <YAxis tick={{ fill: textColor, fontSize: 10 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDark ? '#0f172a' : '#ffffff',
                    borderColor: gridColor,
                    borderRadius: '12px',
                    fontSize: '12px',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '4px' }} />
                <Bar dataKey="latency" name="Avg Latency (ms)" fill="#64748b" radius={[6, 6, 0, 0]} />
                <Bar dataKey="success" name="Success Rate (%)" fill="#0ea5e9" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
