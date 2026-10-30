import React, { useState, useRef, useMemo, useCallback } from 'react';
import { Sliders, Layers } from 'lucide-react';

import {
  AlgorithmType,
  SimConfig,
  SimSummary,
  TraceData,
  VSweepPoint,
  runSimulation,
  vSweep,
  calibrateV,
  autoCalibratePhi,
  createDefaultConfig,
  generateLogSpacedValues
} from '../sim';
import masterTraceJson from '../data/trace.json';

import { EdgeConfigCard } from '../components/simulator/EdgeConfigCard';
import { CloudConfigCard } from '../components/simulator/CloudConfigCard';
import { RequestConfigCard } from '../components/simulator/RequestConfigCard';
import { DatasetUploaderCard } from '../components/simulator/DatasetUploaderCard';
import { InfrastructureVisualizer } from '../components/simulator/InfrastructureVisualizer';
import { ModelSelector } from '../components/simulator/ModelSelector';
import { AssumptionsPanel } from '../components/simulator/AssumptionsPanel';
import { SimulationProgressModal } from '../components/simulator/SimulationProgressModal';
import { ResultsHeader } from '../components/simulator/ResultsHeader';
import { OverallComparison } from '../components/simulator/OverallComparison';
import { ChartsSection } from '../components/simulator/ChartsSection';
import { RequestTable } from '../components/simulator/RequestTable';
import { WinnerSummary } from '../components/simulator/WinnerSummary';

interface TryPageProps {
  onNavigateToResearch: () => void;
}

const masterTrace = masterTraceJson as unknown as TraceData;

export const TryPage: React.FC<TryPageProps> = ({ onNavigateToResearch }) => {
  // Trace Data
  const [trace, setTrace] = useState<TraceData>(masterTrace);
  const [isCustomLoaded, setIsCustomLoaded] = useState(false);

  // Simulation Configuration
  const [config, setConfig] = useState<SimConfig>(() => createDefaultConfig(masterTrace, 'DWPA'));

  // Calibrated V for DWPA
  const [calibratedV, setCalibratedV] = useState<number>(() => {
    const res = calibrateV('DWPA', 0.15, undefined, masterTrace);
    return res.v ?? 2.571e13;
  });

  // Algorithm Selections (Baseline: DWPA Reactive, Evaluation Target: Forecast-Driven Proposed)
  const [baselineAlgorithm, setBaselineAlgorithm] = useState<AlgorithmType>('DWPA');
  const [targetAlgorithm, setTargetAlgorithm] = useState<AlgorithmType>('Forecast-Driven');

  // Simulation Results State
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationStage, setSimulationStage] = useState('');
  const [simulationPercent, setSimulationPercent] = useState(0);

  const [baselineSummary, setBaselineSummary] = useState<SimSummary | null>(null);
  const [targetSummary, setTargetSummary] = useState<SimSummary | null>(null);
  const [benchmarkPoints, setBenchmarkPoints] = useState<Array<{ algorithm: AlgorithmType; carbonKg: number; avgQueueGb: number }>>([]);
  const [vSweepPoints, setVSweepPoints] = useState<VSweepPoint[]>([]);

  const resultsRef = useRef<HTMLDivElement>(null);

  // Recalibrate V handler
  const handleRecalibrateV = useCallback(() => {
    const res = calibrateV('DWPA', 0.15, config, trace);
    const newV = res.v ?? 2.571e13;
    setCalibratedV(newV);
    setConfig(prev => ({
      ...prev,
      v: {
        ...prev.v,
        value: newV
      }
    }));
  }, [config, trace]);

  // Handle Edge Cities change
  const handleCitiesChange = (newCities: string[]) => {
    const updated = {
      ...config,
      selectedCities: newCities
    };
    setConfig(updated);
    const res = calibrateV('DWPA', 0.15, updated, trace);
    const newV = res.v ?? 2.571e13;
    setCalibratedV(newV);
    setConfig(prev => ({
      ...prev,
      selectedCities: newCities,
      v: {
        ...prev.v,
        value: newV
      }
    }));
  };

  // Paper Preset Handler
  const handleApplyPaperPreset = () => {
    const paperCfg: SimConfig = {
      ...config,
      phi: {
        value: 1000,
        assumed: false,
        source: 'Paper',
        reason: 'Paper simulation setup (1000 cycles/bit)'
      },
      slotLengthHours: 1,
      arrivalScale: {
        value: 1.0,
        assumed: false,
        source: 'Dataset',
        reason: 'Baseline 1.0x workload arrival trace'
      },
      bandwidthW: {
        value: 1, // 1 MHz in paper
        assumed: false,
        source: 'Paper',
        reason: 'Paper wireless bandwidth (1 MHz)'
      },
      pMax: {
        value: 1.0,
        assumed: false,
        source: 'Paper',
        reason: 'Paper maximum transmit power (1.0 W)'
      },
      n0Dbm: {
        value: -130,
        assumed: false,
        source: 'Paper',
        reason: 'Paper background noise power spectral density (-130 dBm)'
      },
      usePaperPreset: true
    };
    setConfig(paperCfg);
    const res = calibrateV('DWPA', 0.15, paperCfg, trace);
    const newV = res.v ?? 2.571e13;
    setCalibratedV(newV);
    setConfig(prev => ({
      ...prev,
      v: { ...prev.v, value: newV }
    }));
  };

  // Reset to default
  const handleReset = () => {
    const def = createDefaultConfig(trace, 'DWPA');
    setConfig(def);
    const res = calibrateV('DWPA', 0.15, def, trace);
    const newV = res.v ?? 2.571e13;
    setCalibratedV(newV);
    setBaselineSummary(null);
    setTargetSummary(null);
    setBenchmarkPoints([]);
    setVSweepPoints([]);
  };

  // Load Master Dataset
  const handleLoadMasterDataset = () => {
    setTrace(masterTrace);
    setIsCustomLoaded(false);
    const def = createDefaultConfig(masterTrace, 'DWPA');
    setConfig(def);
    const res = calibrateV('DWPA', 0.15, def, masterTrace);
    const newV = res.v ?? 2.571e13;
    setCalibratedV(newV);
    setBaselineSummary(null);
    setTargetSummary(null);
    setBenchmarkPoints([]);
    setVSweepPoints([]);
  };

  // Swap Baseline and Target
  const handleSwapAlgorithms = () => {
    const temp = baselineAlgorithm;
    setBaselineAlgorithm(targetAlgorithm);
    setTargetAlgorithm(temp);
    if (baselineSummary && targetSummary) {
      setBaselineSummary(targetSummary);
      setTargetSummary(baselineSummary);
    }
  };

  // Check if default settings are currently active (to display paper relationship note)
  const isDefaultSettings = useMemo(() => {
    return (
      config.slotLengthHours === 1 &&
      config.arrivalScale.value === 1.0 &&
      config.selectedCities.length === masterTrace.cities.length &&
      config.startHour === 0 &&
      config.endHour >= masterTrace.num_hours &&
      Math.abs(config.v.value / (calibratedV || 1) - 1.0) < 0.1
    );
  }, [config, calibratedV]);

  // Run Simulation Handler with non-blocking chunked progress
  const handleRunSimulation = async () => {
    setIsSimulating(true);
    setSimulationPercent(10);
    setSimulationStage(`Initializing simulation and preparing ${trace.num_hours} slot trace...`);

    // Chunk 1: Baseline Simulation
    setTimeout(() => {
      setSimulationPercent(30);
      setSimulationStage(`Replaying Baseline (${baselineAlgorithm})...`);

      setTimeout(() => {
        const bRes = runSimulation(config, baselineAlgorithm, trace);
        setBaselineSummary(bRes);

        // Chunk 2: Target Simulation
        setSimulationPercent(60);
        setSimulationStage(`Replaying Evaluation Target (${targetAlgorithm})...`);

        setTimeout(() => {
          const tRes = runSimulation(config, targetAlgorithm, trace);
          setTargetSummary(tRes);

          // Chunk 3: 7-Algorithm Benchmark & V-Sweep
          setSimulationPercent(85);
          setSimulationStage('Computing 14-point Lyapunov V-sweep & 7-algorithm benchmark...');

          setTimeout(() => {
            // Complete algorithm benchmark (including proposed Forecast-Driven)
            const allAlgs: AlgorithmType[] = [
              'DWPA',
              'Forecast-Driven',
              'Local-First',
              'Vertical-Only',
              'Horizontal-First',
              'ICSOC-19',
              'DOLA-22',
              'YCL-24'
            ];
            const bench = allAlgs.map(alg => {
              if (alg === baselineAlgorithm) return { algorithm: alg, carbonKg: bRes.totalCarbonKg, avgQueueGb: bRes.avgQueueGb };
              if (alg === targetAlgorithm) return { algorithm: alg, carbonKg: tRes.totalCarbonKg, avgQueueGb: tRes.avgQueueGb };
              const res = runSimulation(config, alg, trace);
              return { algorithm: alg, carbonKg: res.totalCarbonKg, avgQueueGb: res.avgQueueGb };
            });
            setBenchmarkPoints(bench);

            // 14-point V-Sweep for DWPA (0.1x to 30x calibrated V)
            const sweepValues = generateLogSpacedValues(0.1 * calibratedV, 30.0 * calibratedV, 14);
            const sweepPts = vSweep(config, 'DWPA', sweepValues, trace);
            setVSweepPoints(sweepPts);

            setSimulationPercent(100);
            setSimulationStage('Simulation completed.');

            setTimeout(() => {
              setIsSimulating(false);
              resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 300);
          }, 30);
        }, 30);
      }, 30);
    }, 30);
  };

  return (
    <div className="pt-12 sm:pt-16 pb-16 space-y-8 sm:space-y-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header Banner */}
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
        {/* Left Column: Configuration Panels (5 cols on lg/xl) */}
        <div className="lg:col-span-5 flex flex-col gap-4 sm:gap-5">
          <div className="h-6 flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider shrink-0">
            <Sliders className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>Infrastructure & Workload Parameters</span>
          </div>

          <EdgeConfigCard
            config={config}
            trace={trace}
            onChange={setConfig}
            onCitiesChange={handleCitiesChange}
          />
          <CloudConfigCard
            config={config}
            trace={trace}
            onChange={setConfig}
          />
          <RequestConfigCard
            config={config}
            trace={trace}
            calibratedV={calibratedV}
            onChange={setConfig}
            onApplyPaperPreset={handleApplyPaperPreset}
            onRecalibrateV={handleRecalibrateV}
          />
          <DatasetUploaderCard
            trace={trace}
            isCustomLoaded={isCustomLoaded}
            onLoadMasterDataset={handleLoadMasterDataset}
            onCustomTraceLoaded={custom => {
              setTrace(custom);
              setIsCustomLoaded(true);
            }}
          />
        </div>

        {/* Right Column: Reactive Topology Canvas (7 cols on lg/xl, sticky) */}
        <div className="lg:col-span-7 lg:sticky lg:top-24 flex flex-col gap-4 sm:gap-5">
          <div className="h-6 flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider shrink-0">
            <Layers className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>Reactive Topology Canvas</span>
          </div>

          <InfrastructureVisualizer
            config={config}
            trace={trace}
            targetSummary={targetSummary}
            isSimulating={isSimulating}
          />
        </div>
      </div>

      {/* Strategy Selection & Benchmark Comparator */}
      <ModelSelector
        baselineAlgorithm={baselineAlgorithm}
        targetAlgorithm={targetAlgorithm}
        onBaselineChange={setBaselineAlgorithm}
        onTargetChange={setTargetAlgorithm}
        onSwap={handleSwapAlgorithms}
        onRunSimulation={handleRunSimulation}
        onReset={handleReset}
        isSimulating={isSimulating}
      />

      {/* Multi-stage Simulation Loading Modal */}
      <SimulationProgressModal
        isOpen={isSimulating}
        stageText={simulationStage}
        percent={simulationPercent}
      />

      {/* Results Dashboard Section */}
      {baselineSummary && targetSummary && (
        <div ref={resultsRef} className="pt-8 border-t border-slate-200 dark:border-slate-800 space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-300">
          <ResultsHeader
            baselineSummary={baselineSummary}
            targetSummary={targetSummary}
          />
          <OverallComparison
            baselineSummary={baselineSummary}
            targetSummary={targetSummary}
          />
          <ChartsSection
            baselineSummary={baselineSummary}
            targetSummary={targetSummary}
            benchmarkPoints={benchmarkPoints}
            vSweepPoints={vSweepPoints}
          />
          <RequestTable
            baselineSummary={baselineSummary}
            targetSummary={targetSummary}
            trace={trace}
          />
          <AssumptionsPanel
            config={config}
            trace={trace}
            calibratedV={calibratedV}
          />
          <WinnerSummary
            config={config}
            baselineSummary={baselineSummary}
            targetSummary={targetSummary}
            isDefaultSettings={isDefaultSettings}
            onExploreResearch={onNavigateToResearch}
          />
        </div>
      )}
    </div>
  );
};
