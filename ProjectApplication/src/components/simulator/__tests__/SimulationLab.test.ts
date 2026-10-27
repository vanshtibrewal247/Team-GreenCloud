import { describe, it, expect } from 'vitest';
import {
  ALGORITHM_REGISTRY,
  AlgorithmType,
  autoCalibratePhi,
  createDefaultConfig,
  generateLogSpacedValues
} from '../../../sim';
import masterTraceJson from '../../../data/trace.json';
import { TraceData } from '../../../sim/types';

const trace = masterTraceJson as unknown as TraceData;

describe('Simulation Lab Page Logic & Parameter Validation', () => {
  it('registers all 7 offloading algorithms with accurate metadata and honest approximation flags', () => {
    const requiredAlgs: AlgorithmType[] = [
      'DWPA',
      'Local-First',
      'Vertical-Only',
      'Horizontal-First',
      'ICSOC-19',
      'DOLA-22',
      'YCL-24',
    ];

    for (const alg of requiredAlgs) {
      const info = ALGORITHM_REGISTRY[alg];
      expect(info).toBeDefined();
      expect(info.id).toBe(alg);
      expect(info.description.length).toBeGreaterThan(15);

      if (alg === 'ICSOC-19' || alg === 'DOLA-22' || alg === 'YCL-24') {
        expect(info.approximate).toBe(true);
        expect(info.notes?.toLowerCase()).toContain('approximation');
      } else {
        expect(info.approximate).toBe(false);
      }
    }
  });

  it('validates V-slider logarithmic mapping across 0.1x to 30.0x calibrated V range', () => {
    const calibratedV = 2.571e13;
    const minV = 0.1 * calibratedV;
    const maxV = 30.0 * calibratedV;
    const logMin = Math.log10(minV);
    const logMax = Math.log10(maxV);

    // Helper mapping percent [0, 100] to V
    const percentToV = (p: number) => {
      const logV = logMin + (p / 100) * (logMax - logMin);
      return Math.pow(10, logV);
    };

    // Helper mapping V to percent [0, 100]
    const vToPercent = (v: number) => {
      return ((Math.log10(v) - logMin) / (logMax - logMin)) * 100;
    };

    expect(percentToV(0)).toBeCloseTo(minV, -8);
    expect(percentToV(100)).toBeCloseTo(maxV, -8);

    // Calibrated point (1.0x)
    const calPercent = vToPercent(calibratedV);
    expect(calPercent).toBeGreaterThan(0);
    expect(calPercent).toBeLessThan(100);
    expect(percentToV(calPercent)).toBeCloseTo(calibratedV, -8);
  });

  it('validates autoCalibratePhi computes a positive phi yielding target edge utilization', () => {
    const config = createDefaultConfig(trace, 'DWPA');
    const result = autoCalibratePhi(trace, config, 0.65);

    expect(result.phi).toBeGreaterThan(1000);
    expect(result.phi).toBeLessThan(20000);
    expect(result.expectedUtilization).toBeCloseTo(0.65, 2);
  });

  it('validates CSV format validation rules for user workload uploads', () => {
    // 1. Valid CSV
    const validCsv = `task_id,timestamp,city,workload_gb,carbon_intensity\n1,2024-01-01,Los Angeles,25.4,280.0`;
    const linesValid = validCsv.trim().split(/\r?\n/);
    const headersValid = linesValid[0].split(',').map(h => h.trim().toLowerCase());
    const requiredHeaders = ['city', 'workload_gb'];
    const missingInValid = requiredHeaders.filter(
      rh => !headersValid.some(h => h.includes(rh) || (rh === 'workload_gb' && h.includes('workload')))
    );
    expect(missingInValid.length).toBe(0);

    // 2. Missing workload_gb
    const invalidCsv = `task_id,timestamp,city,latency_ms\n1,2024-01-01,Los Angeles,50`;
    const linesInvalid = invalidCsv.trim().split(/\r?\n/);
    const headersInvalid = linesInvalid[0].split(',').map(h => h.trim().toLowerCase());
    const missingInInvalid = requiredHeaders.filter(
      rh => !headersInvalid.some(h => h.includes(rh) || (rh === 'workload_gb' && h.includes('workload')))
    );
    expect(missingInInvalid).toContain('workload_gb');
  });

  it('verifies that default configuration contains no legacy unverified parameters (MIPS, latency, SLA, req/s)', () => {
    const config = createDefaultConfig(trace, 'DWPA');

    // Confirm that keys and serialized config have zero unverified legacy claims
    const jsonStr = JSON.stringify(config);
    expect(jsonStr).not.toContain('cpuMips');
    expect(jsonStr).not.toContain('deadlineMs');
    expect(jsonStr).not.toContain('arrivalRate');
    expect(jsonStr).not.toContain('EdgeCloudSim');
    expect(jsonStr).not.toContain('Alibaba');
    expect(jsonStr).not.toContain('Frankfurt');
    expect(jsonStr).not.toContain('Singapore');
  });
});
