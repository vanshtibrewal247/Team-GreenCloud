import React from 'react';
import { Database, Download, ExternalLink, Table, Check, Layers } from 'lucide-react';
import { datasetService } from '../../services/datasetService';

export const DatasetCards: React.FC = () => {
  const publicDataset = {
    name: 'Alibaba Cluster Trace v2018',
    source: 'Alibaba Group Cloud Infrastructure / Kaggle',
    size: '48.2 GB (Compressed) • 4,000 Nodes • 8-day period',
    whySelected:
      'Provides authentic production-scale containerized request arrival distributions, fluctuating CPU and memory demands, and realistic DAG execution dependencies.',
    fields: ['TaskID', 'InstanceID', 'CPUCyclesReq', 'MemoryOccupancy', 'StartTime', 'EndTime', 'MachineID'],
    link: 'https://www.kaggle.com',
  };

  const carbonDataset = {
    name: 'Electricity Maps Open Grid Carbon Traces',
    source: 'Electricity Maps API & WattTime Marginal Emissions',
    size: 'Hourly Marginal Emissions (gCO₂/kWh) across 50+ Regional Grids',
    whySelected:
      'Enables realistic temporal simulation of solar and wind generation swings, validating our multi-horizon carbon forecasting models against historical grid telemetry.',
    fields: ['ZoneID', 'TimestampUTC', 'DirectCarbonIntensity', 'RenewableShare', 'MarginalCarbonIntensity'],
    link: 'https://electricitymaps.com',
  };

  const sampleRows = [
    { id: 'REQ-00001', time: '120ms', size: '240KB', cpu: '450 MIPS', ram: '128MB', deadline: '90ms', prio: 'High', loc: 'Mumbai' },
    { id: 'REQ-00002', time: '145ms', size: '580KB', cpu: '820 MIPS', ram: '256MB', deadline: '140ms', prio: 'Med', loc: 'Delhi' },
    { id: 'REQ-00003', time: '180ms', size: '180KB', cpu: '310 MIPS', ram: '64MB', deadline: '75ms', prio: 'Critical', loc: 'Bengaluru' },
    { id: 'REQ-00004', time: '210ms', size: '720KB', cpu: '1150 MIPS', ram: '512MB', deadline: '180ms', prio: 'Low', loc: 'Chennai' },
  ];

  return (
    <div className="space-y-10">
      {/* 1. Public Datasets */}
      <div className="space-y-4">
        <div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Database className="w-5 h-5 text-indigo-500" />
            <span>Public Benchmark Datasets</span>
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Real-world enterprise cluster workloads and open electrical grid carbon traces.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Card 1: Alibaba */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-bold border border-indigo-200 dark:border-indigo-900">
                  Compute Trace
                </span>
                <span className="text-xs font-mono text-slate-400">Production Baseline</span>
              </div>

              <h4 className="text-lg font-bold text-slate-900 dark:text-white">
                {publicDataset.name}
              </h4>

              <div className="space-y-1 text-xs text-slate-600 dark:text-slate-400">
                <div><strong>Source:</strong> {publicDataset.source}</div>
                <div><strong>Dataset Size:</strong> {publicDataset.size}</div>
                <div><strong>Selection Rationale:</strong> {publicDataset.whySelected}</div>
              </div>

              <div>
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                  Extracted Features:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {publicDataset.fields.map((f, i) => (
                    <span
                      key={i}
                      className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                    >
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
              <a
                href={publicDataset.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold transition-colors"
              >
                <span>View Dataset (Kaggle)</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Card 2: Electricity Maps */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-200 dark:border-emerald-900">
                  Emissions Trace
                </span>
                <span className="text-xs font-mono text-slate-400">Grid Telemetry</span>
              </div>

              <h4 className="text-lg font-bold text-slate-900 dark:text-white">
                {carbonDataset.name}
              </h4>

              <div className="space-y-1 text-xs text-slate-600 dark:text-slate-400">
                <div><strong>Source:</strong> {carbonDataset.source}</div>
                <div><strong>Dataset Size:</strong> {carbonDataset.size}</div>
                <div><strong>Selection Rationale:</strong> {carbonDataset.whySelected}</div>
              </div>

              <div>
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                  Extracted Features:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {carbonDataset.fields.map((f, i) => (
                    <span
                      key={i}
                      className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                    >
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
              <a
                href={carbonDataset.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold transition-colors"
              >
                <span>View Dataset (Electricity Maps)</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Our Custom Workload Dataset */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-carbon-50 dark:bg-carbon-950/60 text-carbon-700 dark:text-carbon-300 font-bold border border-carbon-200 dark:border-carbon-800 mb-1">
              Custom Research Artifact
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              EDGE²CO Synthetic Simulation Dataset
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Calibrated workload traces generated specifically for EdgeCloudSim simulation runs.
            </p>
          </div>

          <button
            onClick={() => datasetService.downloadSampleDataset()}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-carbon-600 hover:bg-carbon-700 text-white text-xs font-semibold shadow-md shadow-carbon-600/20 transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Download Sample CSV</span>
          </button>
        </div>

        {/* Characteristics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
          <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <span className="text-slate-400 block text-[10px]">Workload Traces</span>
            <span className="text-base font-bold text-slate-900 dark:text-white">50,000+ Tasks</span>
          </div>
          <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <span className="text-slate-400 block text-[10px]">Task Range</span>
            <span className="text-base font-bold text-slate-900 dark:text-white">100–2,000 MIPS</span>
          </div>
          <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <span className="text-slate-400 block text-[10px]">Deadline Strictness</span>
            <span className="text-base font-bold text-slate-900 dark:text-white">40–250 ms</span>
          </div>
          <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <span className="text-slate-400 block text-[10px]">Format</span>
            <span className="text-base font-bold text-emerald-600 dark:text-emerald-400">RFC 4180 CSV</span>
          </div>
        </div>

        {/* Schema Table Preview */}
        <div>
          <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2 font-mono">
            Sample Rows Preview
          </h4>
          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="py-2.5 px-3">RequestID</th>
                  <th className="py-2.5 px-3">Timestamp</th>
                  <th className="py-2.5 px-3">TaskSize</th>
                  <th className="py-2.5 px-3">CpuMIPS</th>
                  <th className="py-2.5 px-3">Memory</th>
                  <th className="py-2.5 px-3">Deadline</th>
                  <th className="py-2.5 px-3">Priority</th>
                  <th className="py-2.5 px-3">Location</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-900">
                {sampleRows.map((r) => (
                  <tr key={r.id}>
                    <td className="py-2 px-3 font-semibold text-slate-900 dark:text-white">{r.id}</td>
                    <td className="py-2 px-3 text-slate-500">{r.time}</td>
                    <td className="py-2 px-3 text-slate-500">{r.size}</td>
                    <td className="py-2 px-3 text-slate-700 dark:text-slate-300">{r.cpu}</td>
                    <td className="py-2 px-3 text-slate-500">{r.ram}</td>
                    <td className="py-2 px-3 text-slate-500">{r.deadline}</td>
                    <td className="py-2 px-3 font-semibold text-indigo-600 dark:text-indigo-400">{r.prio}</td>
                    <td className="py-2 px-3 text-emerald-600 dark:text-emerald-400">{r.loc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
