import React, { useMemo } from 'react';
import { ChartsSection } from '../simulator/ChartsSection';
import {
  AlgorithmType,
  SimConfig,
  TraceData,
  runSimulation,
  vSweep,
  calibrateV,
  createDefaultConfig,
  generateLogSpacedValues,
} from '../../sim';
import masterTraceJson from '../../data/trace.json';

const masterTrace = masterTraceJson as unknown as TraceData;

export const ResearchResultsShowcase: React.FC = () => {
  const { baselineSummary, targetSummary, benchmarkPoints, vSweepPoints } = useMemo(() => {
    const config: SimConfig = createDefaultConfig(masterTrace, 'DWPA');
    const calRes = calibrateV('DWPA', 0.15, config, masterTrace);
    const calibratedV = calRes.v ?? 2.571e13;
    const configWithV: SimConfig = {
      ...config,
      v: { ...config.v, value: calibratedV },
    };

    const bRes = runSimulation(configWithV, 'DWPA', masterTrace);
    const tRes = runSimulation(configWithV, 'Forecast-Driven', masterTrace);

    const allAlgs: AlgorithmType[] = [
      'DWPA',
      'Forecast-Driven',
      'Local-First',
      'Vertical-Only',
      'Horizontal-First',
      'ICSOC-19',
      'DOLA-22',
      'YCL-24',
    ];

    const benchmark = allAlgs.map((alg) => {
      if (alg === 'DWPA') return { algorithm: alg, carbonKg: bRes.totalCarbonKg, avgQueueGb: bRes.avgQueueGb };
      if (alg === 'Forecast-Driven') return { algorithm: alg, carbonKg: tRes.totalCarbonKg, avgQueueGb: tRes.avgQueueGb };
      const res = runSimulation(configWithV, alg, masterTrace);
      return { algorithm: alg, carbonKg: res.totalCarbonKg, avgQueueGb: res.avgQueueGb };
    });

    const sweepValues = generateLogSpacedValues(0.1 * calibratedV, 30.0 * calibratedV, 14);
    const sweepPts = vSweep(configWithV, 'DWPA', sweepValues, masterTrace);

    return {
      baselineSummary: bRes,
      targetSummary: tRes,
      benchmarkPoints: benchmark,
      vSweepPoints: sweepPts,
    };
  }, []);

  return (
    <div className="space-y-6">
      <ChartsSection
        baselineSummary={baselineSummary}
        targetSummary={targetSummary}
        benchmarkPoints={benchmarkPoints}
        vSweepPoints={vSweepPoints}
      />
    </div>
  );
};
