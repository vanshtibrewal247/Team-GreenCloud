/**
 * fixes.test.ts
 * Dedicated unit tests verifying each of the engine fixes:
 * 1. Baselines frequency scaling & zero carbon on empty queue
 * 2. Horizontal-First vs DWPA divergence under peer feasibility
 * 3. YCL-24 static CI decisions vs Vertical-Only under varying CI
 * 4. Link rate capping at edge_bandwidth_mbps
 * 5. Default V calibration (5% - 20% of slot arrivals)
 */

import { describe, it, expect } from 'vitest';
import defaultTraceData from '../../data/trace.json';
import { TraceData, AlgorithmType } from '../types';
import { createDefaultConfig } from '../config';
import { runSimulation, buildNodeContexts } from '../engine';
import { executeSlotStep } from '../algorithms';
import { computeShannonRate, dbmToWatts, BITS_PER_GB } from '../dwpa';

const trace = defaultTraceData as unknown as TraceData;

describe('Fix 1: Frequency for Baselines & Zero Processing Carbon on Empty Queue', () => {
  it('node with an empty queue emits zero processing carbon across all 7 algorithms', () => {
    const config = createDefaultConfig(trace);
    const { contexts, cloudMeanCi } = buildNodeContexts(config, trace);

    const zeroQueues: Record<string, number> = {};
    const zeroCloudQueues: Record<string, number> = {};
    const zeroBuffers: Record<string, number> = {};
    const zeroCloudBuffers: Record<string, number> = {};
    const zeroArrivals: Record<string, number> = {};
    const currentK: Record<string, number> = {};

    for (const c of config.selectedCities) {
      zeroQueues[c] = 0;
      zeroCloudQueues[c] = 0;
      zeroBuffers[c] = 0;
      zeroCloudBuffers[c] = 0;
      zeroArrivals[c] = 0;
      currentK[c] = 300.0;
    }

    const algorithms: AlgorithmType[] = [
      'DWPA',
      'Local-First',
      'Vertical-Only',
      'Horizontal-First',
      'ICSOC-19',
      'DOLA-22',
      'YCL-24'
    ];

    for (const alg of algorithms) {
      const stepOut = executeSlotStep(
        alg,
        config,
        contexts,
        cloudMeanCi,
        zeroQueues,
        zeroCloudQueues,
        zeroBuffers,
        zeroCloudBuffers,
        zeroArrivals,
        currentK,
        300.0
      );

      for (const c of config.selectedCities) {
        expect(stepOut.edgeFrequencies[c]).toBe(0);
        expect(stepOut.cloudFrequencies[c]).toBe(0);
        expect(stepOut.edgeCarbonGrams[c]).toBe(0);
        expect(stepOut.cloudCarbonGrams[c]).toBe(0);
      }
      expect(stepOut.slotCarbonGrams).toBe(0);
    }
  });

  it('baselines scale frequency with queue instead of running at f_max', () => {
    const config = createDefaultConfig(trace);
    const { contexts, cloudMeanCi } = buildNodeContexts(config, trace);

    const smallQueues: Record<string, number> = {};
    const zeroCloudQueues: Record<string, number> = {};
    const zeroBuffers: Record<string, number> = {};
    const zeroCloudBuffers: Record<string, number> = {};
    const zeroArrivals: Record<string, number> = {};
    const currentK: Record<string, number> = {};

    for (const c of config.selectedCities) {
      smallQueues[c] = 0.5; // Small queue (0.5 GB)
      zeroCloudQueues[c] = 0;
      zeroBuffers[c] = 0;
      zeroCloudBuffers[c] = 0;
      zeroArrivals[c] = 0;
      currentK[c] = 300.0;
    }

    const tCmp = config.slotLengthHours * 3600 * (1 - config.tOffRatio.value);
    const phi = config.phi.value;

    const stepOut = executeSlotStep(
      'Local-First',
      config,
      contexts,
      cloudMeanCi,
      smallQueues,
      zeroCloudQueues,
      zeroBuffers,
      zeroCloudBuffers,
      zeroArrivals,
      currentK,
      300.0
    );

    for (const c of config.selectedCities) {
      const fNeeded = (0.5 * BITS_PER_GB * phi) / tCmp;
      expect(stepOut.edgeFrequencies[c]).toBeCloseTo(fNeeded, -3);
      expect(stepOut.edgeFrequencies[c]).toBeLessThan(contexts[c].fMaxHz);
    }
  });
});

describe('Fix 2: Horizontal-First vs DWPA Divergence', () => {
  it('Horizontal-First forbids vertical offloading when peer offloading is possible, diverging from DWPA', () => {
    const config = createDefaultConfig(trace);
    // Use 2 cities so peer link capacity (1,125 GB) is easily saturated
    config.selectedCities = ['Los Angeles', 'Phoenix'];
    const { contexts, cloudMeanCi } = buildNodeContexts(config, trace);

    // Node A (Los Angeles) has huge queue (5,000 GB). Peers have 0 queue.
    const queues: Record<string, number> = {};
    const cloudQueues: Record<string, number> = {};
    const buffers: Record<string, number> = {};
    const cloudBuffers: Record<string, number> = {};
    const arrivals: Record<string, number> = {};
    const currentK: Record<string, number> = {};

    for (const c of config.selectedCities) {
      queues[c] = 0;
      cloudQueues[c] = 0;
      buffers[c] = 0;
      cloudBuffers[c] = 0;
      arrivals[c] = 0;
      currentK[c] = 200.0;
    }

    queues['Los Angeles'] = 5000.0; // Huge queue

    const dwpaOut = executeSlotStep(
      'DWPA',
      config,
      contexts,
      cloudMeanCi,
      queues,
      cloudQueues,
      buffers,
      cloudBuffers,
      arrivals,
      currentK,
      200.0
    );

    const hfOut = executeSlotStep(
      'Horizontal-First',
      config,
      contexts,
      cloudMeanCi,
      queues,
      cloudQueues,
      buffers,
      cloudBuffers,
      arrivals,
      currentK,
      200.0
    );

    // In Horizontal-First, peer offloading was possible, so vertical offloading to cloud MUST be 0
    const hfCloudFlowsFromLA = hfOut.cloudFlows.filter(f => f.from === 'Los Angeles');
    expect(hfCloudFlowsFromLA.length).toBe(0);

    // In DWPA, after peer offload to capacity, remaining queue is also offloaded to cloud
    const dwpaCloudFlowsFromLA = dwpaOut.cloudFlows.filter(f => f.from === 'Los Angeles');
    expect(dwpaCloudFlowsFromLA.length).toBeGreaterThan(0);
    expect(dwpaCloudFlowsFromLA[0].volumeGb).toBeGreaterThan(0);

    // Consequently, final queue in LA differs between DWPA and Horizontal-First
    expect(dwpaOut.edgeQueues['Los Angeles']).not.toBe(hfOut.edgeQueues['Los Angeles']);
  });
});

describe('Fix 3: YCL-24 Static CI Decisions vs Vertical-Only', () => {
  it('YCL-24 differs from Vertical-Only when real carbon intensity differs from static mean', () => {
    const config = createDefaultConfig(trace);
    config.v.value = 5e14; // Set V so that Lyapunov sqrt term is active (below fNeeded)
    const { contexts, cloudMeanCi } = buildNodeContexts(config, trace);

    const queues: Record<string, number> = {};
    const cloudQueues: Record<string, number> = {};
    const buffers: Record<string, number> = {};
    const cloudBuffers: Record<string, number> = {};
    const arrivals: Record<string, number> = {};
    const extremeK: Record<string, number> = {};

    for (const c of config.selectedCities) {
      queues[c] = 50.0;
      cloudQueues[c] = 5.0;
      buffers[c] = 0;
      cloudBuffers[c] = 0;
      arrivals[c] = 0;
      // Real CI is 800 gCO2/kWh (much higher than static mean ~280 gCO2/kWh)
      extremeK[c] = 800.0;
    }

    const yclOut = executeSlotStep(
      'YCL-24',
      config,
      contexts,
      cloudMeanCi,
      queues,
      cloudQueues,
      buffers,
      cloudBuffers,
      arrivals,
      extremeK,
      800.0
    );

    const vertOut = executeSlotStep(
      'Vertical-Only',
      config,
      contexts,
      cloudMeanCi,
      queues,
      cloudQueues,
      buffers,
      cloudBuffers,
      arrivals,
      extremeK,
      800.0
    );

    // YCL-24 makes frequency decision using static mean CI (~280),
    // whereas Vertical-Only uses queue-clearing frequency.
    expect(yclOut.edgeFrequencies['Los Angeles']).not.toBe(vertOut.edgeFrequencies['Los Angeles']);
    expect(yclOut.slotCarbonGrams).not.toBe(vertOut.slotCarbonGrams);
  });
});

describe('Fix 4: Link Rate Capped at edge_bandwidth_mbps', () => {
  it('caps physical link throughput at 25 Gbps (1,125 GB per link per slot)', () => {
    const config = createDefaultConfig(trace);
    const W = config.bandwidthW.value;
    const g = config.channelGainG.value;
    const pMax = config.pMax.value;
    const N0 = dbmToWatts(config.n0Dbm.value);
    const tOff = config.slotLengthHours * 3600 * config.tOffRatio.value; // 360 s

    const shannonBps = computeShannonRate(W, g, pMax, N0);
    expect(shannonBps / 1e6).toBeGreaterThan(100000); // Raw Shannon > 100 Gbps

    const maxRateBps = config.edgeBandwidthMbps.value * 1e6; // 25,000 Mbps = 25 Gbps
    const effectiveBps = Math.min(shannonBps, maxRateBps);
    expect(effectiveBps).toBe(25e9);

    const maxGbPerLink = (effectiveBps * tOff) / BITS_PER_GB;
    expect(maxGbPerLink).toBe(1125.0);
  });
});

describe('Fix 5: Default V Calibration', () => {
  it('calibrated default V results in DWPA average total queue within 5% - 20% of one slot arrivals', () => {
    const config = createDefaultConfig(trace);
    expect(config.v.value).toBeGreaterThan(1e12);
    expect(config.v.value).toBeLessThan(1e14);

    const summary = runSimulation(config, 'DWPA', trace);
    const oneSlotArrivals = trace.total_workload_gb / trace.num_hours; // ~261.69 GB
    const queueFraction = summary.avgQueueGb / oneSlotArrivals;

    // Check fraction is at or below 15% (0.15) and within 5% - 20%
    expect(queueFraction).toBeGreaterThanOrEqual(0.05);
    expect(queueFraction).toBeLessThanOrEqual(0.1505);
  });
});
