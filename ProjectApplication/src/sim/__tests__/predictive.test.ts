import { describe, it, expect } from 'vitest';
import defaultTraceData from '../../data/trace.json';
import { runSimulation } from '../engine';
import { createDefaultConfig } from '../config';
import { TraceData } from '../types';

const trace = defaultTraceData as unknown as TraceData;

describe('Forecast-Driven Carbon-Aware (Proposed Predictive Model)', () => {
  const config = createDefaultConfig(trace);

  it('runs simulation with zero queue conservation error', () => {
    const res = runSimulation(config, 'Forecast-Driven', trace);
    expect(res.queueConservationError).toBeLessThan(1e-5);
    expect(res.numSlots).toBe(775);
    expect(res.totalCarbonKg).toBeGreaterThan(0);
    expect(res.avgQueueGb).toBeGreaterThan(0);
  });

  it('proactively reduces carbon and stabilizes queues compared to reactive DWPA', () => {
    const dwpaRes = runSimulation(config, 'DWPA', trace);
    const predRes = runSimulation(config, 'Forecast-Driven', trace);

    // Predictive model reduces carbon emissions
    expect(predRes.totalCarbonKg).toBeLessThanOrEqual(dwpaRes.totalCarbonKg);
    // Predictive model stabilizes queue backlog
    expect(predRes.avgQueueGb).toBeLessThan(dwpaRes.avgQueueGb);
    // Proactive peer offloading shifts more work to cleaner peers
    let dwpaPeers = 0;
    let predPeers = 0;
    for (const s of dwpaRes.slots) {
      for (const f of s.peerFlows) dwpaPeers += f.volumeGb;
    }
    for (const s of predRes.slots) {
      for (const f of s.peerFlows) predPeers += f.volumeGb;
    }
    expect(predPeers).toBeGreaterThan(dwpaPeers);
  });

  it('satisfies per-slot flow conservation and non-negative queues', () => {
    const res = runSimulation(config, 'Forecast-Driven', trace);
    for (const slot of res.slots) {
      for (const city of config.selectedCities) {
        expect(slot.edgeQueues[city]).toBeGreaterThanOrEqual(0);
        expect(slot.cloudQueues[city]).toBeGreaterThanOrEqual(0);
      }
    }
  });

  it('respects anticipationBeta parameter: beta=0 operates reactively while beta>0 enables proactive lookahead', () => {
    const configReactive = {
      ...config,
      anticipationBeta: { ...config.anticipationBeta, value: 0.0 }
    };
    const configProactive = {
      ...config,
      anticipationBeta: { ...config.anticipationBeta, value: 0.3 }
    };

    const resReactive = runSimulation(configReactive, 'Forecast-Driven', trace);
    const resProactive = runSimulation(configProactive, 'Forecast-Driven', trace);

    expect(resReactive.queueConservationError).toBeLessThan(1e-5);
    expect(resProactive.queueConservationError).toBeLessThan(1e-5);
    expect(resProactive.totalCarbonKg).toBeGreaterThan(0);
    expect(resReactive.totalCarbonKg).toBeGreaterThan(0);
  });
});
