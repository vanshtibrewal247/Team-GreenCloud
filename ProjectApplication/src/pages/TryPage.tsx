import React, { useState, useRef } from 'react';
import {
  EdgeConfig,
  CloudConfig,
  RequestConfig,
  UploadedDataset,
  AlgorithmId,
  SimulationResult,
} from '../types/simulation';
import { EdgeConfigCard } from '../components/simulator/EdgeConfigCard';
import { CloudConfigCard } from '../components/simulator/CloudConfigCard';
import { RequestConfigCard } from '../components/simulator/RequestConfigCard';
import { DatasetUploaderCard } from '../components/simulator/DatasetUploaderCard';
import { InfrastructureVisualizer } from '../components/simulator/InfrastructureVisualizer';
import { ModelSelector } from '../components/simulator/ModelSelector';
import { SimulationProgressModal } from '../components/simulator/SimulationProgressModal';
import { ResultsHeader } from '../components/simulator/ResultsHeader';
import { OverallComparison } from '../components/simulator/OverallComparison';
import { ChartsSection } from '../components/simulator/ChartsSection';
import { RequestTable } from '../components/simulator/RequestTable';
import { WinnerSummary } from '../components/simulator/WinnerSummary';
import { simulationService } from '../services/simulationService';
import { Sliders, Layers } from 'lucide-react';

interface TryPageProps {
  onNavigateToResearch: () => void;
}

export const TryPage: React.FC<TryPageProps> = ({ onNavigateToResearch }) => {
  // 1. Edge Configuration
  const [edgeConfig, setEdgeConfig] = useState<EdgeConfig>({
    serverCount: 5,
    cpuMips: 4000,
    ramGb: 8,
    storageGb: 50,
    bandwidthMbps: 100,
    region: 'delhi',
    additionalRegions: [],
  });

  // 2. Cloud Configuration
  const [cloudConfig, setCloudConfig] = useState<CloudConfig>({
    serverCount: 2,
    cpuMips: 30000,
    ramGb: 64,
    storageGb: 1000,
    bandwidthMbps: 5000,
    region: 'singapore',
  });

  // 3. Request Configuration
  const [requestConfig, setRequestConfig] = useState<RequestConfig>({
    requestCount: 1000,
    arrivalRate: 120,
    taskSizeKb: 350,
    cpuMipsReq: 500,
    memoryMbReq: 128,
    deadlineMs: 100,
    priority: 'mixed',
  });

  // 4. Uploaded Dataset
  const [dataset, setDataset] = useState<UploadedDataset | null>(null);

  // 5. Model Selection
  const [model1, setModel1] = useState<AlgorithmId>('cpu_aware');
  const [model2, setModel2] = useState<AlgorithmId>('forecast_carbon_aware');

  // 6. Simulation Execution State
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationStage, setSimulationStage] = useState('');
  const [simulationPercent, setSimulationPercent] = useState(0);
  const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null);

  const resultsRef = useRef<HTMLDivElement>(null);

  const handleRunSimulation = async () => {
    setIsSimulating(true);
    setSimulationPercent(10);
    setSimulationStage('Initializing topology and queuing models...');

    try {
      const result = await simulationService.runSimulation(
        {
          edge: edgeConfig,
          cloud: cloudConfig,
          request: requestConfig,
          dataset,
          model1,
          model2,
        },
        (stage, pct) => {
          setSimulationStage(stage);
          setSimulationPercent(pct);
        }
      );

      setSimulationResult(result);

      // Smooth scroll to results after completion
      setTimeout(() => {
        setIsSimulating(false);
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 500);
    } catch (err) {
      console.error(err);
      setIsSimulating(false);
    }
  };

  return (
    <div className="pt-12 sm:pt-16 pb-12 sm:pb-16 space-y-8 sm:space-y-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header Banner (Generous clearance below sticky navbar) */}
      <div className="text-center max-w-3xl mx-auto space-y-2.5">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Simulation Lab
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
          Configure your infrastructure, define workload characteristics, and compare offloading strategies.
        </p>
      </div>

      {/* Main Configuration & Visualizer Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 xl:gap-8 items-start">
        {/* Left Column: Configuration Panels (5 cols on lg/xl, unified vertical gap) */}
        <div className="lg:col-span-5 flex flex-col gap-4 sm:gap-5">
          <div className="h-6 flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider shrink-0">
            <Sliders className="w-4 h-4 text-carbon-500 shrink-0" />
            <span>Infrastructure & Workload Parameters</span>
          </div>

          <EdgeConfigCard config={edgeConfig} onChange={setEdgeConfig} />
          <CloudConfigCard config={cloudConfig} onChange={setCloudConfig} />
          <RequestConfigCard config={requestConfig} onChange={setRequestConfig} />
          <DatasetUploaderCard dataset={dataset} onDatasetChange={setDataset} />
        </div>

        {/* Right Column: Live Infrastructure Visualizer (7 cols on lg/xl, sticky on large screens) */}
        <div className="lg:col-span-7 lg:sticky lg:top-24 flex flex-col gap-4 sm:gap-5">
          <div className="h-6 flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider shrink-0">
            <Layers className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>Reactive Topology Canvas</span>
          </div>

          <InfrastructureVisualizer
            edge={edgeConfig}
            cloud={cloudConfig}
            isSimulating={isSimulating}
          />
        </div>
      </div>

      {/* Strategy Selection & Benchmark Comparator */}
      <ModelSelector
        model1={model1}
        model2={model2}
        onModel1Change={setModel1}
        onModel2Change={setModel2}
        onRunComparison={handleRunSimulation}
        isSimulating={isSimulating}
      />

      {/* Multi-stage Simulation Loading Modal */}
      <SimulationProgressModal
        isOpen={isSimulating}
        stageText={simulationStage}
        percent={simulationPercent}
      />

      {/* Results Dashboard Section */}
      {simulationResult && (
        <div ref={resultsRef} className="pt-8 border-t border-slate-200 dark:border-slate-800 space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-300">
          <ResultsHeader result={simulationResult} />
          <OverallComparison
            model1={simulationResult.model1Metrics}
            model2={simulationResult.model2Metrics}
          />
          <ChartsSection
            model1={simulationResult.model1Metrics}
            model2={simulationResult.model2Metrics}
            timeSeries={simulationResult.timeSeries}
          />
          <RequestTable
            traces={simulationResult.traces}
            model1Name={simulationResult.model1Metrics.algorithmName}
            model2Name={simulationResult.model2Metrics.algorithmName}
          />
          <WinnerSummary
            result={simulationResult}
            onExploreResearch={onNavigateToResearch}
          />
        </div>
      )}
    </div>
  );
};
