/**
 * flows.test.ts
 * Tests for flow accounting invariants, calibrated Lyapunov V, and V-sweep monotonicity.
 */

import { describe, it, expect } from 'vitest';
import defaultTraceData from '../../data/trace.json';
import {
  createDefaultConfig,
  runSimulation,
  calibrateV,
  vSweep,
  generateLogSpacedValues,
  TraceData,
  AlgorithmType
} from '../index';

const trace = defaultTraceData as unknown as TraceData;

describe('Flow Accounting Invariants', () => {
  it('enforces Test (a): per slot, total peer + cloud outflow <= total queue at slot start for all nodes', () => {
    const config = createDefaultConfig(trace, 'DWPA');
    const res = runSimulation(config, 'DWPA', trace);

    for (let s = 0; s < res.numSlots; s++) {
      const slot = res.slots[s];

      for (const c of config.selectedCities) {
        // Q at slot start before local processing or offloading
        const qPrev = s === 0 ? 0 : res.slots[s - 1].edgeQueues[c] || 0;
        const bufPrev = s === 0 ? 0 : res.slots[s - 1].edgeBuffers[c] || 0;
        const arr = slot.arrivals[c] || 0;
        const qStart = qPrev + bufPrev + arr;

        let peerOut = 0;
        for (const pf of slot.peerFlows) {
          if (pf.from === c) peerOut += pf.volumeGb;
        }

        let cloudOut = 0;
        for (const cf of slot.cloudFlows) {
          if (cf.from === c) cloudOut += cf.volumeGb;
        }

        const totalOutflow = peerOut + cloudOut;
        expect(totalOutflow).toBeLessThanOrEqual(qStart + 1e-9);
      }
    }
  });

  it('enforces Test (b): total GB sent to peers over the trace is <= (numSlots * total queue per slot at start)', () => {
    const config = createDefaultConfig(trace, 'DWPA');
    const res = runSimulation(config, 'DWPA', trace);

    let totalPeerSent = 0;
    let totalQStart = 0;

    for (let s = 0; s < res.numSlots; s++) {
      const slot = res.slots[s];
      let slotQStart = 0;

      for (const c of config.selectedCities) {
        const qPrev = s === 0 ? 0 : res.slots[s - 1].edgeQueues[c] || 0;
        const bufPrev = s === 0 ? 0 : res.slots[s - 1].edgeBuffers[c] || 0;
        const arr = slot.arrivals[c] || 0;
        slotQStart += qPrev + bufPrev + arr;
      }
      totalQStart += slotQStart;

      for (const pf of slot.peerFlows) {
        totalPeerSent += pf.volumeGb;
      }
    }

    const avgQStartPerSlot = totalQStart / res.numSlots;
    const maxAllowed = res.numSlots * avgQStartPerSlot;

    // Total GB sent to peers must not exceed (numSlots * total queue per slot at start)
    expect(totalPeerSent).toBeLessThanOrEqual(maxAllowed);
    // Over the entire trace, peer sent should be realistic (~80k GB, well below 202k total workload)
    expect(totalPeerSent).toBeLessThan(trace.total_workload_gb);
  });

  it('counts only final converged flow per slot: at most one flow record per directed peer pair per slot', () => {
    const config = createDefaultConfig(trace, 'DWPA');
    const res = runSimulation(config, 'DWPA', trace);

    for (let s = 0; s < 50; s++) {
      const slot = res.slots[s];
      const seenPairs = new Set<string>();

      for (const pf of slot.peerFlows) {
        const pairKey = `${pf.from}->${pf.to}`;
        expect(seenPairs.has(pairKey)).toBe(false);
        seenPairs.add(pairKey);
      }
    }
  });
});

describe('Frequency Capping and Processing Carbon Determinism', () => {
  it('enforces that a node never runs faster than Q * phi / T_cmp', () => {
    const algorithms: AlgorithmType[] = [
      'DWPA',
      'Vertical-Only',
      'Horizontal-First',
      'YCL-24',
      'Local-First',
      'ICSOC-19',
      'DOLA-22'
    ];

    for (const alg of algorithms) {
      const config = createDefaultConfig(trace, alg);
      const res = runSimulation(config, alg, trace);
      const tCmp = config.slotLengthHours * 3600 * (1 - config.tOffRatio.value);
      const phi = config.phi.value;

      for (let s = 0; s < 20; s++) {
        const slot = res.slots[s];
        for (const c of config.selectedCities) {
          const qPrev = s === 0 ? 0 : res.slots[s - 1].edgeQueues[c] || 0;
          const bufPrev = s === 0 ? 0 : res.slots[s - 1].edgeBuffers[c] || 0;
          const arr = slot.arrivals[c] || 0;
          const qStartBits = (qPrev + bufPrev + arr) * 8e9;
          const fNeeded = tCmp > 0 ? (qStartBits * phi) / tCmp : 0;

          const fActual = slot.edgeFrequencies[c] || 0;
          expect(fActual).toBeLessThanOrEqual(fNeeded + 1.0); // 1 Hz tolerance
        }
      }
    }
  });

  it('ensures that if two algorithms process exactly the same GB with the same frequency rule, processing carbon is identical', () => {
    const configDWPA = createDefaultConfig(trace, 'DWPA');
    const configVO = createDefaultConfig(trace, 'Vertical-Only');
    const resDWPA = runSimulation(configDWPA, 'DWPA', trace);
    const resVO = runSimulation(configVO, 'Vertical-Only', trace);

    // In slot 0, before offload differences diverge, check nodes with identical queue & processed GB
    const slot0DWPA = resDWPA.slots[0];
    const slot0VO = resVO.slots[0];

    for (const c of configDWPA.selectedCities) {
      const procDWPA = slot0DWPA.edgeProcessedGb[c] || 0;
      const procVO = slot0VO.edgeProcessedGb[c] || 0;

      if (Math.abs(procDWPA - procVO) < 1e-9 && procDWPA > 0) {
        expect(slot0DWPA.edgeCarbonGrams[c]).toBeCloseTo(slot0VO.edgeCarbonGrams[c], 6);
      }
    }
  });
});

describe('calibrateV and V Sharing', () => {
  it('calibrates V once for DWPA so avg total queue stays at or below 15% of one slot mean total arrivals', () => {
    const meanSlotArrivals = trace.total_workload_gb / trace.num_hours;
    const targetQueue = 0.15 * meanSlotArrivals;

    const cal = calibrateV('DWPA', 0.15, undefined, trace);
    expect(cal.v).toBeDefined();
    expect(cal.v!).toBeGreaterThan(1e12);
    expect(cal.v!).toBeLessThan(1e15);
    expect(cal.avgQueueGb).toBeLessThanOrEqual(targetQueue + 1e-4);
  });

  it('shares that same calibrated V for Vertical-Only, Horizontal-First, and YCL-24', () => {
    const calDWPA = calibrateV('DWPA', 0.15, undefined, trace);
    const calVO = calibrateV('Vertical-Only', 0.15, undefined, trace);
    const calHF = calibrateV('Horizontal-First', 0.15, undefined, trace);
    const calYCL = calibrateV('YCL-24', 0.15, undefined, trace);

    expect(calVO.v).toBe(calDWPA.v);
    expect(calHF.v).toBe(calDWPA.v);
    expect(calYCL.v).toBe(calDWPA.v);
    expect(calVO.note).toContain('Shared calibrated V from DWPA');
  });

  it('returns undefined (n/a) for non-Lyapunov algorithms (Local-First, ICSOC-19, DOLA-22)', () => {
    const calLF = calibrateV('Local-First', 0.15, undefined, trace);
    const calICSOC = calibrateV('ICSOC-19', 0.15, undefined, trace);
    const calDOLA = calibrateV('DOLA-22', 0.15, undefined, trace);

    expect(calLF.v).toBeUndefined();
    expect(calICSOC.v).toBeUndefined();
    expect(calDOLA.v).toBeUndefined();
    expect(calLF.note).toContain('n/a');
  });
});

describe('V Sweep and Monotonicity', () => {
  it('generates 14 log-spaced points from 0.1x to 3.0x around calibrated V', () => {
    const cal = calibrateV('DWPA', 0.15, undefined, trace);
    const points = generateLogSpacedValues(0.1 * cal.v!, 3.0 * cal.v!, 14);

    expect(points.length).toBe(14);
    expect(points[0]).toBeCloseTo(0.1 * cal.v!, -5);
    expect(points[points.length - 1]).toBeCloseTo(3.0 * cal.v!, -5);

    // Strictly increasing V values
    for (let i = 1; i < points.length; i++) {
      expect(points[i]).toBeGreaterThan(points[i - 1]);
    }
  });

  it('verifies that total carbon is non-increasing across the V sweep with macroscopic monotonicity', () => {
    const config = createDefaultConfig(trace, 'DWPA');
    const sweep = vSweep(config, 'DWPA', undefined, trace);

    expect(sweep.length).toBe(14);

    // Carbon must show non-increasing trend across V (allowing discrete-slot boundary tolerance of 0.2 kg)
    for (let i = 1; i < sweep.length; i++) {
      expect(sweep[i].totalCarbonKg).toBeLessThanOrEqual(sweep[i - 1].totalCarbonKg + 0.2);
    }

    // Overall macro trend: higher V significantly lowers carbon and increases queue
    expect(sweep[sweep.length - 1].totalCarbonKg).toBeLessThan(sweep[0].totalCarbonKg - 50.0);
    expect(sweep[sweep.length - 1].avgQueueGb).toBeGreaterThan(sweep[0].avgQueueGb + 25.0);
  });
});
