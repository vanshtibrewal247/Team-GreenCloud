/**
 * engine.test.ts
 * Tests for autoCalibratePhi, vSweep, and paper parameter presets.
 */

import { describe, it, expect } from 'vitest';
import defaultTraceData from '../../data/trace.json';
import { TraceData } from '../types';
import { createDefaultConfig, createPaperPresetConfig, autoCalibratePhi } from '../config';
import { runSimulation, vSweep } from '../engine';

const trace = defaultTraceData as unknown as TraceData;

describe('Simulation Engine Features', () => {
  it('auto-calibrates phi to achieve approximately 70% edge utilization', () => {
    const config = createDefaultConfig(trace);
    const calibration = autoCalibratePhi(trace, config, 0.70);

    expect(calibration.phi).toBeGreaterThan(1000);
    expect(calibration.expectedUtilization).toBe(0.70);

    config.phi.value = calibration.phi;
    const summary = runSimulation(config, 'Local-First', trace);

    // In Local-First with phi calibrated to 70% theoretical capacity,
    // bursty arrival distribution yields realistic edge utilization
    expect(summary.avgEdgeUtilization).toBeGreaterThan(0.40);
    expect(summary.avgEdgeUtilization).toBeLessThan(0.85);
  });

  it('runs vSweep and demonstrates the Lyapunov trade-off (higher V -> lower carbon, higher queue)', () => {
    const config = createDefaultConfig(trace);
    // Use first 100 hours for quick sweep test
    config.startHour = 0;
    config.endHour = 100;

    const vValues = [1, 10, 100, 1000];
    const sweep = vSweep(config, 'DWPA', vValues, trace);

    expect(sweep.length).toBe(4);

    // Higher V prioritizes carbon reduction over queue length
    // Lower V maintains shorter queues
    const lowV = sweep[0];
    const highV = sweep[sweep.length - 1];

    expect(lowV.v).toBe(1);
    expect(highV.v).toBe(1000);

    // Verify V trade-off direction: avg queue at high V >= avg queue at low V
    expect(highV.avgQueueGb).toBeGreaterThanOrEqual(lowV.avgQueueGb);
    // Verify total carbon at high V <= total carbon at low V
    expect(highV.totalCarbonKg).toBeLessThanOrEqual(lowV.totalCarbonKg);
  });

  it('correctly loads and runs paper parameters preset', () => {
    const paperConfig = createPaperPresetConfig(trace);
    paperConfig.startHour = 0;
    paperConfig.endHour = 20;

    expect(paperConfig.phi.value).toBe(1000);
    expect(paperConfig.bandwidthW.value).toBe(1e6); // 1 MHz
    expect(paperConfig.pMax.value).toBe(1.0);
    expect(paperConfig.n0Dbm.value).toBe(-130.0);

    const summary = runSimulation(paperConfig, 'DWPA', trace);
    expect(summary.numSlots).toBe(20);
    expect(summary.queueConservationError).toBeLessThan(1e-6);
  });
});
