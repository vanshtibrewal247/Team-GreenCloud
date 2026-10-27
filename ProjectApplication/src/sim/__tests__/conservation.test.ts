/**
 * conservation.test.ts
 * Rigorous test verifying queue conservation for all 7 offloading algorithms:
 * Total Arrived Workload = Total Processed Workload + Remaining Edge Queues + Remaining Cloud Queues + Remaining Buffers.
 */

import { describe, it, expect } from 'vitest';
import defaultTraceData from '../../data/trace.json';
import { TraceData, AlgorithmType } from '../types';
import { createDefaultConfig } from '../config';
import { runSimulation } from '../engine';

const trace = defaultTraceData as unknown as TraceData;

const ALL_ALGORITHMS: AlgorithmType[] = [
  'DWPA',
  'Local-First',
  'Vertical-Only',
  'Horizontal-First',
  'ICSOC-19',
  'DOLA-22',
  'YCL-24'
];

describe('Queue Conservation for all 7 Algorithms', () => {
  ALL_ALGORITHMS.forEach((algorithm) => {
    it(`should strictly conserve queue backlog for ${algorithm}`, () => {
      const config = createDefaultConfig(trace);
      // Run over 50 slots to test multi-slot buffering and offloading dynamics
      config.startHour = 0;
      config.endHour = 50;

      const summary = runSimulation(config, algorithm, trace);

      expect(summary.totalArrivedGb).toBeGreaterThan(0);
      expect(summary.totalProcessedGb).toBeGreaterThan(0);
      expect(summary.numSlots).toBe(50);

      // Verify no negative queues or buffers in any slot
      for (const slot of summary.slots) {
        for (const city of config.selectedCities) {
          expect(slot.edgeQueues[city]).toBeGreaterThanOrEqual(-1e-9);
          expect(slot.cloudQueues[city]).toBeGreaterThanOrEqual(-1e-9);
          expect(slot.edgeBuffers[city]).toBeGreaterThanOrEqual(-1e-9);
          expect(slot.cloudBuffers[city]).toBeGreaterThanOrEqual(-1e-9);
          expect(slot.edgeProcessedGb[city]).toBeGreaterThanOrEqual(-1e-9);
          expect(slot.cloudProcessedGb[city]).toBeGreaterThanOrEqual(-1e-9);
        }
        expect(slot.slotCarbonGrams).toBeGreaterThanOrEqual(-1e-9);
      }

      // Check strict queue conservation:
      // Arrived = Processed + Final Edge Queues + Final Cloud Queues + Final Buffers
      const accountedGb =
        summary.totalProcessedGb +
        summary.finalEdgeQueueGb +
        summary.finalCloudQueueGb +
        summary.finalBufferGb;

      const absoluteError = Math.abs(summary.totalArrivedGb - accountedGb);
      const relativeError = absoluteError / summary.totalArrivedGb;

      expect(absoluteError).toBeLessThan(1e-6);
      expect(relativeError).toBeLessThan(1e-9);
      expect(summary.queueConservationError).toBeLessThan(1e-6);
    });

    it(`should conserve queue backlog for ${algorithm} across full 775 hours trace`, () => {
      const config = createDefaultConfig(trace);
      config.startHour = 0;
      config.endHour = trace.num_hours; // full trace

      const summary = runSimulation(config, algorithm, trace);

      expect(summary.numSlots).toBe(775);
      expect(summary.totalArrivedGb).toBeCloseTo(trace.total_workload_gb, 0);

      const accountedGb =
        summary.totalProcessedGb +
        summary.finalEdgeQueueGb +
        summary.finalCloudQueueGb +
        summary.finalBufferGb;

      const absoluteError = Math.abs(summary.totalArrivedGb - accountedGb);
      expect(absoluteError).toBeLessThan(1e-5);
      expect(summary.totalCarbonKg).toBeGreaterThan(0);
    });
  });
});
