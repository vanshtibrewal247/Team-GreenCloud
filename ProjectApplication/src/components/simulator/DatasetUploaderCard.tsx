import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, Download, Trash2, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';
import { UploadedDataset } from '../../types/simulation';
import { datasetService } from '../../services/datasetService';

interface DatasetUploaderCardProps {
  dataset: UploadedDataset | null | undefined;
  onDatasetChange: (dataset: UploadedDataset | null) => void;
}

export const DatasetUploaderCard: React.FC<DatasetUploaderCardProps> = ({
  dataset,
  onDatasetChange,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileProcess = (file: File) => {
    setError(null);
    if (!file.name.endsWith('.csv')) {
      setError('Please upload a valid .csv file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const parsed = datasetService.parseCsvText(file.name, file.size, text);
        onDatasetChange(parsed);
      } catch (err: any) {
        setError(err.message || 'Failed to parse CSV file');
      }
    };
    reader.onerror = () => setError('Error reading file');
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileProcess(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleLoadPreset = () => {
    const preset = datasetService.getPresetDemoDataset();
    onDatasetChange(preset);
  };

  return (
    <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-sm hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Use Your Own Dataset
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Upload a CSV workload dataset to run the simulation using real request traces.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => datasetService.downloadSampleDataset()}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors shadow-sm"
        >
          <Download className="w-3.5 h-3.5 text-carbon-500" />
          <span>Download Sample Dataset</span>
        </button>
      </div>

      {dataset ? (
        /* Uploaded State */
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-emerald-500/30 dark:border-emerald-500/20 space-y-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-slate-900 dark:text-white">
                    {dataset.fileName}
                  </span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 font-semibold">
                    {dataset.fileSizeKb} KB
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Parsed {dataset.rowCount.toLocaleString()} request rows across {dataset.colCount} attributes
                </p>
              </div>
            </div>

            <button
              onClick={() => onDatasetChange(null)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
              title="Remove dataset"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          {/* Detected Fields Pill Tags */}
          <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/60">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
              Detected Schema Columns:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {dataset.detectedFields.map((field, idx) => (
                <span
                  key={idx}
                  className="font-mono text-[11px] px-2 py-0.5 rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
                >
                  {field}
                </span>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Drag & Drop Area */
        <div className="space-y-3">
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all duration-200 ${
              isDragging
                ? 'border-carbon-500 bg-carbon-50/50 dark:bg-carbon-950/40 scale-[1.01]'
                : 'border-slate-200 dark:border-slate-700 hover:border-carbon-400 hover:bg-slate-50/60 dark:hover:bg-slate-800/40'
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFileProcess(e.target.files[0]);
                }
              }}
              accept=".csv"
              className="hidden"
            />
            <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 flex items-center justify-center mx-auto mb-2">
              <UploadCloud className="w-6 h-6 text-carbon-500" />
            </div>
            <div className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200">
              Drag & Drop CSV here or <span className="text-carbon-600 dark:text-carbon-400 underline">Browse Files</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Supported format: .csv (e.g. RequestID, MIPS, Memory, Deadline)
            </p>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Quick Preset Button */}
          <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
            <span>No CSV handy?</span>
            <button
              type="button"
              onClick={handleLoadPreset}
              className="inline-flex items-center gap-1 text-carbon-600 dark:text-carbon-400 hover:underline font-semibold"
            >
              <Sparkles className="w-3 h-3" />
              <span>Load Preset Alibaba Cluster Trace (1,250 rows)</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
