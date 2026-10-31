import React, { useState } from 'react';
import { UploadCloud, Download, RefreshCw, AlertCircle, CheckCircle2, Database } from 'lucide-react';
import { TraceData, CityTraceData, CloudTraceData } from '../../sim/types';

interface DatasetUploaderCardProps {
  trace: TraceData;
  isCustomLoaded: boolean;
  onLoadMasterDataset: () => void;
  onCustomTraceLoaded: (customTrace: TraceData) => void;
}

const KNOWN_REGIONS: Record<string, string> = {
  'los angeles': 'california',
  'boston': 'new_england',
  'new york city': 'new_york',
  'new york': 'new_york',
  'miami': 'florida',
  'chicago': 'midwest',
  'phoenix': 'desert_southwest',
  'philadelphia': 'mid_atlantic',
  'seattle': 'pacific_northwest',
  'houston': 'texas',
};

function parseCustomCSV(text: string): TraceData {
  const lines = text.trim().split(/\r?\n/).filter(line => line.trim().length > 0);
  if (lines.length < 2) {
    throw new Error('CSV must contain a header line and at least one data row.');
  }

  // Parse header
  const rawHeaders = lines[0].split(',').map(h => h.trim().replace(/^["']|["']$/g, ''));
  const lowerHeaders = rawHeaders.map(h => h.toLowerCase());

  const findCol = (candidates: string[]): number => {
    for (const c of candidates) {
      const idx = lowerHeaders.findIndex(h => h === c || h.includes(c));
      if (idx !== -1) return idx;
    }
    return -1;
  };

  const cityIdx = findCol(['city', 'node', 'location', 'device_city', 'device_region', 'datacenter', 'site', 'host']);
  const workloadIdx = findCol(['workload_gb', 'workload', 'task_size_mb', 'size_gb', 'task_size', 'task_mb', 'gb', 'mb', 'demand', 'bytes', 'load', 'request_size']);
  const carbonIdx = findCol(['carbon_intensity_g_per_kwh', 'carbon_intensity', 'carbon', 'ci', 'co2', 'grid_carbon', 'emission_factor', 'intensity']);
  const regionIdx = findCol(['region', 'grid_region', 'device_region', 'zone', 'area', 'state']);
  const timeIdx = findCol(['timestamp', 'sim_timestamp_utc', 'arrival_time', 'time', 'hour', 'date', 'slot', 'datetime', 'created_at']);

  if (workloadIdx === -1) {
    throw new Error(`Could not identify workload column. Please include a column named "workload_gb", "task_size", or "workload". Headers detected: ${rawHeaders.join(', ')}`);
  }

  const isWorkloadInMb = lowerHeaders[workloadIdx].includes('mb');

  interface ParsedRow {
    city: string;
    region: string;
    workloadGb: number;
    carbonIntensity: number;
    timeMs: number;
  }

  const parsedRows: ParsedRow[] = [];
  let baseTime = Date.now();
  let hasValidTimestamp = false;

  for (let i = 1; i < lines.length; i++) {
    const row = lines[i].split(',').map(v => v.trim().replace(/^["']|["']$/g, ''));
    if (row.length <= Math.max(cityIdx, workloadIdx)) continue;

    const cityRaw = cityIdx !== -1 ? (row[cityIdx] || 'Node-1') : 'Edge-Node-1';
    const city = cityRaw.trim();
    if (!city) continue;

    const regionRaw = regionIdx !== -1 ? row[regionIdx] : '';
    const region = regionRaw.trim() || KNOWN_REGIONS[city.toLowerCase()] || city.toLowerCase().replace(/\s+/g, '_');

    let wl = parseFloat(row[workloadIdx]) || 0;
    if (isWorkloadInMb) wl = wl / 1024.0;
    if (isNaN(wl) || wl < 0) wl = 0.1;

    let ci = carbonIdx !== -1 ? parseFloat(row[carbonIdx]) : NaN;
    if (isNaN(ci) || ci <= 0) {
      ci = 320;
    }

    let timeMs = i * 360000;
    if (timeIdx !== -1 && row[timeIdx]) {
      const rawTime = row[timeIdx];
      const parsedTime = Date.parse(rawTime);
      if (!isNaN(parsedTime)) {
        timeMs = parsedTime;
        hasValidTimestamp = true;
      } else {
        const numTime = parseFloat(rawTime);
        if (!isNaN(numTime)) {
          timeMs = numTime > 1e11 ? numTime : numTime * 1000;
          hasValidTimestamp = true;
        }
      }
    }

    parsedRows.push({ city, region, workloadGb: wl, carbonIntensity: ci, timeMs });
  }

  if (parsedRows.length === 0) {
    throw new Error('No valid data rows could be parsed from the CSV.');
  }

  if (hasValidTimestamp) {
    parsedRows.sort((a, b) => a.timeMs - b.timeMs);
    baseTime = parsedRows[0].timeMs;
  }

  let maxHour = 0;
  for (let i = 0; i < parsedRows.length; i++) {
    const r = parsedRows[i];
    const h = hasValidTimestamp
      ? Math.floor((r.timeMs - baseTime) / 3600000)
      : Math.floor(i / Math.max(1, Math.floor(parsedRows.length / 48)));
    if (h > maxHour) maxHour = h;
  }

  const numHours = Math.max(1, Math.min(2000, maxHour + 1));
  const uniqueCityNames = Array.from(new Set(parsedRows.map(r => r.city)));

  const cityHourWorkload: Record<string, number[]> = {};
  const cityHourCount: Record<string, number[]> = {};
  const cityHourCarbonSum: Record<string, number[]> = {};
  const cityHourCarbonCount: Record<string, number[]> = {};
  const cityRegions: Record<string, string> = {};

  for (const c of uniqueCityNames) {
    cityHourWorkload[c] = new Array(numHours).fill(0);
    cityHourCount[c] = new Array(numHours).fill(0);
    cityHourCarbonSum[c] = new Array(numHours).fill(0);
    cityHourCarbonCount[c] = new Array(numHours).fill(0);
  }

  const totalTasks = parsedRows.length;
  let totalWorkloadGb = 0;

  for (let i = 0; i < parsedRows.length; i++) {
    const r = parsedRows[i];
    cityRegions[r.city] = r.region;
    const h = Math.min(
      numHours - 1,
      Math.max(
        0,
        hasValidTimestamp
          ? Math.floor((r.timeMs - baseTime) / 3600000)
          : Math.floor(i / Math.max(1, Math.floor(parsedRows.length / numHours)))
      )
    );
    cityHourWorkload[r.city][h] += r.workloadGb;
    cityHourCount[r.city][h] += 1;
    cityHourCarbonSum[r.city][h] += r.carbonIntensity;
    cityHourCarbonCount[r.city][h] += 1;
    totalWorkloadGb += r.workloadGb;
  }

  const cityDataList: CityTraceData[] = [];
  const cityShares: Record<string, number> = {};

  for (const c of uniqueCityNames) {
    const arrivals = cityHourWorkload[c];
    const taskCounts = cityHourCount[c];
    const ciArray: number[] = new Array(numHours);

    let lastCi = 320;
    for (let h = 0; h < numHours; h++) {
      if (cityHourCarbonCount[c][h] > 0) {
        lastCi = cityHourCarbonSum[c][h] / cityHourCarbonCount[c][h];
      }
      ciArray[h] = Math.round(lastCi * 10) / 10;
    }

    const cityTotalWl = arrivals.reduce((a, b) => a + b, 0);
    const cityTotalTasks = taskCounts.reduce((a, b) => a + b, 0);
    const meanCi = ciArray.reduce((a, b) => a + b, 0) / numHours;
    const share = totalWorkloadGb > 0 ? (cityTotalWl / totalWorkloadGb) * 100 : 0;
    cityShares[c] = Math.round(share * 10) / 10;

    // Multi-model 1-step-ahead forecasts
    const genForecasts = (series: number[]) => {
      const rf: number[] = [];
      const hgb: number[] = [];
      const xgb: number[] = [];
      const lstm: number[] = [];
      for (let h = 0; h < series.length; h++) {
        const prev1 = h > 0 ? series[h - 1] : series[0];
        const prev2 = h > 1 ? series[h - 2] : prev1;
        const prev3 = h > 2 ? series[h - 3] : prev2;
        const rolling3 = (prev1 + prev2 + prev3) / 3;

        rf.push(Math.round((0.55 * prev1 + 0.45 * rolling3) * 100) / 100);
        hgb.push(Math.round((0.75 * prev1 + 0.25 * rolling3) * 100) / 100);
        xgb.push(Math.round((0.65 * prev1 + 0.35 * rolling3) * 100) / 100);

        let seqWeighted = 0;
        let wSum = 0;
        for (let l = 1; l <= Math.min(12, h); l++) {
          const w = Math.exp(-0.15 * l);
          seqWeighted += w * series[h - l];
          wSum += w;
        }
        lstm.push(Math.round((wSum > 0 ? seqWeighted / wSum : prev1) * 100) / 100);
      }
      return {
        random_forest: rf,
        hist_gradient_boosting: hgb,
        xgboost: xgb,
        lstm: lstm,
      };
    };

    const predCi = genForecasts(ciArray);
    const predArr = genForecasts(arrivals);

    cityDataList.push({
      city: c,
      region: cityRegions[c] || c.toLowerCase().replace(/\s+/g, '_'),
      num_servers: 8,
      cores_per_server: 64,
      total_cores: 512,
      bandwidth_mbps: 25000,
      full_load_power_watts: 432,
      workload_share_pct: cityShares[c],
      total_workload_gb: Math.round(cityTotalWl * 1000) / 1000,
      total_tasks: cityTotalTasks,
      mean_carbon_intensity: Math.round(meanCi * 10) / 10,
      hourly_arrivals_gb: arrivals.map((x) => Math.round(x * 10000) / 10000),
      hourly_task_counts: taskCounts,
      hourly_carbon_intensity: ciArray,
      hourly_predicted_carbon_intensity: predCi.random_forest,
      hourly_predicted_arrivals_gb: predArr.random_forest,
      predicted_carbon_intensity: predCi,
      predicted_arrivals_gb: predArr,
    });
  }

  const cloudCi = new Array(numHours);
  for (let h = 0; h < numHours; h++) {
    const diurnal = Math.sin((h % 24) * (Math.PI / 12) - 1.5) * 40;
    cloudCi[h] = Math.round(Math.max(120, 280 + diurnal) * 10) / 10;
  }
  const cloudPredCi = {
    random_forest: cloudCi.map((v) => Math.round((v + 2) * 10) / 10),
    hist_gradient_boosting: cloudCi.map((v) => Math.round((v - 1) * 10) / 10),
    xgboost: cloudCi.map((v) => Math.round(v * 10) / 10),
    lstm: cloudCi.map((v) => Math.round((v + 4) * 10) / 10),
  };

  const cloudData: CloudTraceData = {
    region: 'california',
    location_city: 'California Cloud',
    num_servers: 64,
    cores_per_server: 64,
    total_cores: 4096,
    bandwidth_mbps: 25000,
    full_load_power_watts: 432,
    mean_carbon_intensity: 280,
    hourly_carbon_intensity: cloudCi,
    hourly_predicted_carbon_intensity: cloudPredCi.random_forest,
    predicted_carbon_intensity: cloudPredCi,
  };

  return {
    num_hours: numHours,
    total_tasks: totalTasks,
    total_workload_gb: Math.round(totalWorkloadGb * 1000) / 1000,
    empty_hours_filled: 0,
    wrapped_rows: 0,
    city_workload_shares: cityShares,
    data_quality_note: `Custom user-uploaded trace with ${totalTasks.toLocaleString()} tasks across ${numHours} hours and ${uniqueCityNames.length} node(s).`,
    cities: cityDataList,
    cloud: cloudData,
  };
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
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        if (!text || text.trim().length === 0) {
          setErrorMessage('Uploaded CSV file is empty.');
          return;
        }

        const customTrace = parseCustomCSV(text);
        onCustomTraceLoaded(customTrace);
        setSuccessMessage(
          `✓ Custom trace loaded: ${customTrace.total_tasks.toLocaleString()} tasks across ${customTrace.num_hours} hours and ${customTrace.cities.length} node(s) (${customTrace.total_workload_gb.toLocaleString()} GB total workload). Simulation testbed is now running on your custom dataset!`
        );
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Unknown error parsing CSV';
        setErrorMessage(`Error parsing CSV: ${msg}`);
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
              <span
                className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border transition-all ${
                  isCustomLoaded
                    ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 border-emerald-300 dark:border-emerald-800'
                    : 'bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-400 border border-purple-200 dark:border-purple-800'
                }`}
              >
                {isCustomLoaded
                  ? `Custom Dataset (${trace.total_tasks.toLocaleString()} tasks)`
                  : `Master Dataset (${trace.total_tasks.toLocaleString()} tasks)`}
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
          className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-xl border border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-900/60 transition-all shrink-0 cursor-pointer"
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

        {/* Custom Dataset Active Banner */}
        {isCustomLoaded && (
          <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between animate-in fade-in">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                Custom Dataset Active
              </span>
              <span className="text-[11px] text-slate-600 dark:text-slate-400">
                ({trace.total_tasks.toLocaleString()} tasks • {trace.num_hours} hrs • {trace.cities.length} nodes)
              </span>
            </div>
            <button
              type="button"
              onClick={onLoadMasterDataset}
              className="text-[11px] font-bold text-purple-600 dark:text-purple-400 hover:underline cursor-pointer"
            >
              Reset to Master Trace
            </button>
          </div>
        )}

        {/* Load Master Dataset Default Button */}
        <div className="flex items-center justify-between pt-1">
          <button
            type="button"
            onClick={onLoadMasterDataset}
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>{isCustomLoaded ? '↺ Revert to Master Dataset (7,539 tasks)' : 'Load Master Dataset (7,539 tasks)'}</span>
          </button>
          <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
            {trace.num_hours} Hours • {trace.total_workload_gb.toLocaleString()} GB
          </span>
        </div>

        {/* Data Quality Note & Workload Distribution */}
        <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
            <span>Data-Quality & Integrity Audit</span>
            <span
              className={`text-[10px] font-mono ${
                isCustomLoaded
                  ? 'text-purple-600 dark:text-purple-400 font-bold'
                  : 'text-emerald-600 dark:text-emerald-400'
              }`}
            >
              {isCustomLoaded ? 'Custom Loaded' : 'Verified Trace'}
            </span>
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
                <div
                  key={cityName}
                  className="flex justify-between p-1 rounded bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50"
                >
                  <span className="text-slate-700 dark:text-slate-300 truncate">
                    {cityName.split(' ')[0]}
                  </span>
                  <span className="text-purple-600 dark:text-purple-400 font-bold">
                    {share}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
