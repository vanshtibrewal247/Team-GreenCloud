import React from 'react';
import { SimulationResult } from '../../types/simulation';
import { REGIONS, ALGORITHMS } from '../../services/carbonService';
import { Sliders, Cpu, Cloud, FileCode, CheckCircle2, Download } from 'lucide-react';

interface ResultsHeaderProps {
  result: SimulationResult;
}

export const ResultsHeader: React.FC<ResultsHeaderProps> = ({ result }) => {
  const { config, model1Metrics, model2Metrics } = result;

  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(result, null, 2));
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute('href', dataStr);
    dlAnchorElem.setAttribute('download', `edge2co_simulation_report_${result.id}.json`);
    dlAnchorElem.click();
  };

  return (
    <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="font-mono text-xs text-carbon-600 dark:text-carbon-400 font-bold bg-carbon-50 dark:bg-carbon-950/60 px-2.5 py-0.5 rounded-full border border-carbon-200 dark:border-carbon-800">
              Run ID: {result.id}
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-500 font-mono">
              Completed at {new Date(result.timestamp).toLocaleTimeString()}
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Simulation Results & Analysis
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Empirical comparative benchmark between <span className="font-semibold text-slate-800 dark:text-slate-200">{model1Metrics.algorithmName}</span> and <span className="font-semibold text-carbon-600 dark:text-carbon-400">{model2Metrics.algorithmName}</span>.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportJson}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors shadow-sm"
          >
            <Download className="w-4 h-4 text-carbon-500" />
            <span>Export Report (JSON)</span>
          </button>
        </div>
      </div>

      {/* Configuration Summary Badges Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 text-xs">
        {/* Infrastructure summary */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold block mb-1">
            Infrastructure Topology
          </span>
          <div className="font-semibold text-slate-900 dark:text-white text-sm">
            {config.edge.serverCount} Edge Nodes + {config.cloud.serverCount} Cloud DCs
          </div>
          <div className="text-slate-500 mt-1 font-mono text-[11px]">
            Edge: {REGIONS[config.edge.region].name} ({config.edge.cpuMips} MIPS)
            <br />
            Cloud: {REGIONS[config.cloud.region].name} ({config.cloud.cpuMips.toLocaleString()} MIPS)
          </div>
        </div>

        {/* Workload summary */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold block mb-1">
            Workload Specification
          </span>
          <div className="font-semibold text-slate-900 dark:text-white text-sm">
            {config.request.requestCount.toLocaleString()} Requests @ {config.request.arrivalRate} req/s
          </div>
          <div className="text-slate-500 mt-1 font-mono text-[11px]">
            Avg Task: {config.request.cpuMipsReq} MIPS • Payload: {config.request.taskSizeKb} KB
            <br />
            SLA Deadline: {config.request.deadlineMs} ms ({config.request.priority} QoS)
          </div>
        </div>

        {/* Algorithms compared */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold block mb-1">
            Evaluated Strategies
          </span>
          <div className="font-semibold text-slate-900 dark:text-white text-sm">
            {ALGORITHMS[config.model1].name} vs {ALGORITHMS[config.model2].name}
          </div>
          <div className="text-slate-500 mt-1 font-mono text-[11px]">
            Model 1 Focus: {ALGORITHMS[config.model1].primaryObjective}
            <br />
            Model 2 Focus: {ALGORITHMS[config.model2].primaryObjective}
          </div>
        </div>
      </div>
    </div>
  );
};
