import React from 'react';
import { DatasetCards } from '../components/datasets/DatasetCards';
import { ToolsGrid } from '../components/datasets/ToolsGrid';
import { ArchitectureDiagram } from '../components/datasets/ArchitectureDiagram';
import { ArrowRight } from 'lucide-react';

interface DatasetsPageProps {
  onNavigateToTry: () => void;
}

export const DatasetsPage: React.FC<DatasetsPageProps> = ({ onNavigateToTry }) => {
  return (
    <div className="py-8 sm:py-12 space-y-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Datasets & Tools
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
          The data, simulation platforms, and technologies behind the project. Combining real-world Alibaba traces with open electricity telemetry.
        </p>
      </div>

      {/* Datasets Section */}
      <DatasetCards />

      {/* Tools Section */}
      <ToolsGrid />

      {/* Interactive System Architecture */}
      <ArchitectureDiagram />

      {/* Bottom CTA */}
      <div className="rounded-3xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 text-center space-y-4">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">
          Ready to Run Custom Traces?
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
          Download our pre-formatted workload traces or upload your own CSV file in the Simulation Lab to inspect algorithm responses.
        </p>
        <button
          onClick={onNavigateToTry}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-carbon-600 hover:bg-carbon-700 text-white text-xs font-semibold shadow-md shadow-carbon-600/25 transition-all"
        >
          <span>Launch Simulation Lab</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
