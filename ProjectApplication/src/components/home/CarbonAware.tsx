import React from 'react';
import { Leaf, MapPin, Cloud, Cpu, Activity } from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
} from 'recharts';

export const CarbonAware: React.FC = () => {
  const fig2Data = [
    { time: '0:00', Netherlands: 175, 'New South Wales': 780, California: 80, Chile: 190 },
    { time: '1:00', Netherlands: 220, 'New South Wales': 775, California: 75, Chile: 190 },
    { time: '2:00', Netherlands: 220, 'New South Wales': 730, California: 65, Chile: 190 },
    { time: '3:00', Netherlands: 205, 'New South Wales': 700, California: 60, Chile: 200 },
    { time: '4:00', Netherlands: 180, 'New South Wales': 660, California: 60, Chile: 200 },
    { time: '5:00', Netherlands: 175, 'New South Wales': 580, California: 65, Chile: 240 },
    { time: '6:00', Netherlands: 160, 'New South Wales': 500, California: 70, Chile: 310 },
    { time: '7:00', Netherlands: 150, 'New South Wales': 455, California: 85, Chile: 370 },
    { time: '8:00', Netherlands: 148, 'New South Wales': 430, California: 115, Chile: 320 },
    { time: '9:00', Netherlands: 155, 'New South Wales': 410, California: 190, Chile: 320 },
    { time: '10:00', Netherlands: 200, 'New South Wales': 380, California: 215, Chile: 330 },
    { time: '11:00', Netherlands: 245, 'New South Wales': 400, California: 220, Chile: 340 },
    { time: '12:00', Netherlands: 240, 'New South Wales': 430, California: 220, Chile: 345 },
    { time: '13:00', Netherlands: 130, 'New South Wales': 470, California: 225, Chile: 380 },
    { time: '14:00', Netherlands: 150, 'New South Wales': 500, California: 225, Chile: 370 },
    { time: '15:00', Netherlands: 150, 'New South Wales': 545, California: 220, Chile: 380 },
    { time: '16:00', Netherlands: 145, 'New South Wales': 580, California: 210, Chile: 385 },
    { time: '17:00', Netherlands: 140, 'New South Wales': 600, California: 205, Chile: 365 },
    { time: '18:00', Netherlands: 135, 'New South Wales': 625, California: 200, Chile: 345 },
    { time: '19:00', Netherlands: 130, 'New South Wales': 650, California: 195, Chile: 285 },
    { time: '20:00', Netherlands: 125, 'New South Wales': 675, California: 205, Chile: 220 },
    { time: '21:00', Netherlands: 130, 'New South Wales': 695, California: 205, Chile: 195 },
    { time: '22:00', Netherlands: 140, 'New South Wales': 700, California: 205, Chile: 195 },
    { time: '23:00', Netherlands: 145, 'New South Wales': 745, California: 135, Chile: 190 },
  ];

  const simulationNodes = [
    { name: 'Seattle', type: 'Edge Server', icon: Cpu, isCloud: false, path: 'M0,18 Q15,8 30,16 T60,12 T90,20 T120,10' },
    { name: 'Cheyenne', type: 'Edge Server', icon: Cpu, isCloud: false, path: 'M0,12 Q20,22 40,10 T80,18 T100,8 T120,14' },
    { name: 'Chicago', type: 'Edge Server', icon: Cpu, isCloud: false, path: 'M0,15 Q25,5 50,18 T85,10 T105,22 T120,12' },
    { name: 'New York', type: 'Edge Server', icon: Cpu, isCloud: false, path: 'M0,20 Q20,12 45,22 T80,8 T100,16 T120,18' },
    { name: 'Kansas City', type: 'Edge Server', icon: Cpu, isCloud: false, path: 'M0,10 Q25,24 50,12 T80,22 T105,14 T120,16' },
    { name: 'Berkeley County', type: 'Cloud Datacenter', icon: Cloud, isCloud: true, path: 'M0,16 Q30,10 60,18 T90,12 T120,15' },
  ];

  return (
    <section className="py-16 bg-white dark:bg-slate-900 border-t border-b border-slate-200/80 dark:border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header and Quote */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-carbon-50 dark:bg-carbon-950/60 text-carbon-700 dark:text-carbon-300 border border-carbon-200/60 dark:border-carbon-800/60">
            <Leaf className="w-3.5 h-3.5 text-carbon-500" />
            <span>Sustainable Computing Paradigm</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            The Carbon-Aware Computing Paradigm
          </h2>

          <blockquote className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border-l-4 border-carbon-500 text-sm sm:text-base text-slate-700 dark:text-slate-300 italic max-w-2xl mx-auto">
            "The carbon intensity of electricity varies with time and location, so where and when a workload runs changes its carbon footprint."
          </blockquote>

          {/* Definition Card */}
          <div className="inline-block p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-700 dark:text-slate-200 font-mono text-center">
            <span className="font-sans font-semibold text-carbon-600 dark:text-carbon-400">Definition: </span>
            Carbon intensity (CI) = amount of carbon emission (gCO₂eq) when generating 1 kWh of electricity.
          </div>
        </div>

        {/* Six Simulated System Nodes: 5 Edge + 1 Cloud */}
        <div className="rounded-3xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <MapPin className="w-5 h-5 text-carbon-500" />
                <span>Simulated Topology Locations (5 Edge Servers + 1 Cloud)</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Five distributed edge nodes and one centralized cloud node evaluated in the paper.
              </p>
            </div>
            <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 w-fit">
              Time- &amp; Location-Varying CI
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            {simulationNodes.map((node) => {
              const Icon = node.icon;
              return (
                <div
                  key={node.name}
                  className={`p-4 rounded-2xl bg-white dark:bg-slate-900 border transition-all ${
                    node.isCloud
                      ? 'border-cloud-500/40 shadow-sm'
                      : 'border-slate-200 dark:border-slate-800 shadow-sm'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5">
                      <Icon
                        className={`w-4 h-4 ${
                          node.isCloud ? 'text-cloud-400' : 'text-emerald-400'
                        }`}
                      />
                      <span className="text-xs font-bold text-slate-900 dark:text-white">
                        {node.name}
                      </span>
                    </div>
                  </div>

                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 block mb-3 w-fit">
                    {node.type}
                  </span>

                  {/* Illustrative Sparkline */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                      <span>CI varies over time (schematic)</span>
                      <span className="text-carbon-600 dark:text-carbon-400 text-[9px] uppercase font-bold">Illustrative</span>
                    </div>
                    <div className="h-8 w-full flex items-center justify-center bg-slate-50 dark:bg-slate-950/60 rounded-lg p-1 border border-slate-100 dark:border-slate-800/80">
                      <svg className="w-full h-full overflow-visible" viewBox="0 0 120 28" fill="none">
                        <path
                          d={node.path}
                          stroke={node.isCloud ? '#38bdf8' : '#10b981'}
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Real CI Data Note under topology cards */}
          <div className="pt-2 text-xs text-slate-500 dark:text-slate-400 font-mono">
            Real CI data: electricityMaps, 1000 hourly slots, 00:00 July 1, 2023 to 15:00 August 11, 2023.
          </div>
        </div>

        {/* Daily Carbon Intensity Patterns Line Chart (Fig. 2 representation) */}
        <div className="rounded-3xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Activity className="w-5 h-5 text-carbon-500" />
                <span>Daily carbon intensity patterns (illustrative)</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Illustrative curves based on the qualitative shape of Fig. 2 in the paper. Data source in the paper: electricityMaps.
              </p>
            </div>
            <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-carbon-50 dark:bg-carbon-950/60 text-carbon-700 dark:text-carbon-300 border border-carbon-200 dark:border-carbon-800 w-fit">
              Qualitative Shape (Fig. 2)
            </span>
          </div>

          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={fig2Data} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                <XAxis
                  dataKey="time"
                  stroke="#64748b"
                  fontSize={11}
                  tickLine={false}
                  ticks={['0:00', '4:00', '8:00', '12:00', '16:00', '20:00']}
                />
                <YAxis
                  stroke="#64748b"
                  fontSize={11}
                  tickLine={false}
                  domain={[0, 800]}
                  ticks={[0, 200, 400, 600, 800]}
                  label={{
                    value: 'gCO₂eq/kWh',
                    angle: -90,
                    position: 'insideLeft',
                    offset: 0,
                    fill: '#64748b',
                    fontSize: 11,
                  }}
                />
                <RechartsTooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '0.75rem',
                    fontSize: '12px',
                    color: '#f8fafc',
                  }}
                  formatter={(value: any) => [`${value} gCO₂eq/kWh`]}
                />
                <Legend
                  wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }}
                />
                <Line
                  type="monotone"
                  dataKey="Netherlands"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                />
                <Line
                  type="monotone"
                  dataKey="New South Wales"
                  stroke="#ef4444"
                  strokeWidth={2.5}
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                />
                <Line
                  type="monotone"
                  dataKey="California"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                />
                <Line
                  type="monotone"
                  dataKey="Chile"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="pt-2 text-center text-xs text-slate-500 dark:text-slate-400 font-mono">
            Time 0:00–23:00 · y-axis: gCO₂eq/kWh · Qualitative Shape (Fig. 2)
          </div>
        </div>
      </div>
    </section>
  );
};
