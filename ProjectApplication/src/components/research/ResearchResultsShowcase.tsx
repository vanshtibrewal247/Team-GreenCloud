import React from 'react';
import { ChartsSection } from '../simulator/ChartsSection';
import { SimSummary, VSweepPoint, AlgorithmType } from '../../sim/types';
import precomputedSim from '../../data/defaultResearchSim.json';

interface PrecomputedStructure {
  baselineSummary: SimSummary;
  targetSummary: SimSummary;
  benchmarkPoints: Array<{ algorithm: AlgorithmType; carbonKg: number; avgQueueGb: number }>;
  vSweepPoints: VSweepPoint[];
}

const data = precomputedSim as unknown as PrecomputedStructure;

export const ResearchResultsShowcase: React.FC = () => {
  return (
    <div className="space-y-6">
      <ChartsSection
        baselineSummary={data.baselineSummary}
        targetSummary={data.targetSummary}
        benchmarkPoints={data.benchmarkPoints}
        vSweepPoints={data.vSweepPoints}
      />
    </div>
  );
};
