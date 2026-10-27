import React, { useState } from 'react';
import { UploadCloud, FileSpreadsheet, Download, RefreshCw, AlertCircle, CheckCircle2, Database } from 'lucide-react';
import { TraceData } from '../../sim/types';

interface DatasetUploaderCardProps {
  trace: TraceData;
  isCustomLoaded: boolean;
  onLoadMasterDataset: () => void;
  onCustomTraceLoaded: (customTrace: TraceData) => void;
}

export const DatasetUploaderCard: React.FC<DatasetUploaderCardProps> = ({
  trace,
  isCustomLoaded,
  onLoadMasterDataset,
  onCustomTraceLoaded,
}) => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleDownloadSample = () => {
    const headers = 'task_id,timestamp,city,region,workload_gb,carbon_intensity_g_per_kwh\n';
    const sampleRows = [
      '1,2024-01-01 00:00:00,Los Angeles,california,25.4,285.4',
      '2,2024-01-01 00:00:00,Boston,new_england,12.8,242.1',
      '3,2024-01-01 00:00:00,New York City,new_york,14.2,290.0',
      '4,2024-01-01 01:00:00,Miami,florida,15.6,335.2',
      '5,2024-01-01 01:00:00,Chicago,midwest,11.3,370.8',
      '6,2024-01-01 01:00:00,Seattle,northwest,16.5,155.0',
    ].join('\n');

    const blob = new Blob([headers + sampleRows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'greencloud_sample_dataset.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMessage(null);
    setSuccessMessage(null);
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = event => {
      try {
        const text = event.target?.result as string;
        if (!text || text.trim().length === 0) {
          setErrorMessage('Uploaded CSV file is empty.');
          return;
        }

        const lines = text.trim().split(/\r?\n/);
        if (lines.length < 2) {
          setErrorMessage('CSV must contain a header line and at least one data row.');
          return;
        }

        const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
        const requiredHeaders = ['city', 'workload_gb'];
        const missing = requiredHeaders.filter(
          rh => !headers.some(h => h.includes(rh) || (rh === 'workload_gb' && h.includes('workload')))
        );

        if (missing.length > 0) {
          setErrorMessage(
            `Missing required column headers: ${missing.join(', ')}. Expected at least "city" and "workload_gb".`
          );
          return;
        }

        setSuccessMessage(`CSV validated successfully: ${lines.length - 1} rows detected.`);
      } catch (err: any) {
        setErrorMessage(`Error parsing CSV: ${err.message || 'Unknown error'}`);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-sm hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 pb-3.5 mb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-start gap-2.5 min-w-0 flex-1">
          <div className="w-9 h-9 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
            <Database className="w-5 h-5" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Trace Dataset
              </h3>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-400 border border-purple-200 dark:border-purple-800">
                {isCustomLoaded ? 'Custom Trace' : 'Master Dataset (7,539 tasks)'}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Empirical multi-region workload and hourly grid carbon intensity traces
            </p>
          </div>
        </div>

        {/* Download Sample Dataset Button */}
        <button
          type="button"
          onClick={handleDownloadSample}
          className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-xl border border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-900/60 transition-all shrink-0"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Sample CSV</span>
        </button>
      </div>

      <div className="space-y-4">
        {/* Upload Zone */}
        <label className="relative border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-purple-500/50 dark:hover:border-purple-500/50 rounded-2xl p-4 flex flex-col items-center justify-center text-center cursor-pointer bg-slate-50/50 dark:bg-slate-800/20 transition-colors">
          <UploadCloud className="w-7 h-7 text-purple-500 mb-1.5" />
          <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
            Upload custom workload CSV
          </span>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
            Columns: timestamp, city, region, workload_gb, carbon_intensity_g_per_kwh
          </span>
          <input
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            className="hidden"
          />
        </label>

        {/* Error / Success Messages */}
        {errorMessage && (
          <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 flex items-start gap-2 text-xs text-rose-700 dark:text-rose-300">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}
        {successMessage && (
          <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-start gap-2 text-xs text-emerald-700 dark:text-emerald-300">
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Load Master Dataset Default Button */}
        <div className="flex items-center justify-between pt-1">
          <button
            type="button"
            onClick={onLoadMasterDataset}
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Load Master Dataset (7,539 tasks)</span>
          </button>
          <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
            {trace.num_hours} Hours • {trace.total_workload_gb.toLocaleString()} GB
          </span>
        </div>

        {/* Data Quality Note & Workload Distribution */}
        <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
            <span>Data-Quality & Integrity Audit</span>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono">Verified Trace</span>
          </div>
          <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
            {trace.data_quality_note}
          </p>
          <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/60">
            <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 block mb-1">
              Workload Share by City:
            </span>
            <div className="grid grid-cols-3 gap-1 text-[10px] font-mono">
              {Object.entries(trace.city_workload_shares || {}).map(([cityName, share]) => (
                <div key={cityName} className="flex justify-between p-1 rounded bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50">
                  <span className="text-slate-700 dark:text-slate-300 truncate">{cityName.split(' ')[0]}</span>
                  <span className="text-purple-600 dark:text-purple-400 font-bold">{share}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
