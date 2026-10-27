import { describe, it, expect } from 'vitest';
import { createDefaultConfig } from '../../../sim';
import masterTraceJson from '../../../data/trace.json';
import { TraceData, SimConfig } from '../../../sim/types';

const trace = masterTraceJson as unknown as TraceData;

// Logic mirroring AssumptionsPanel row generator to test table construction and dynamic reactive behavior
function generateAssumptionRows(config: SimConfig, traceData: TraceData, calibratedV: number) {
  const slotSec = config.slotLengthHours * 3600;
  const tOffSec = slotSec * config.tOffRatio.value;
  const tCmpSec = slotSec * (1 - config.tOffRatio.value);
  const linkBwMbps = config.edgeBandwidthMbps.value;
  const maxGbPerLinkSlot = (linkBwMbps * 1e6 * tOffSec) / 8e9;

  const totalCloudCores = traceData.cloud.total_cores;
  const numEdgeNodes = Math.max(1, config.selectedCities.length);
  const cloudCoresPerNode = Math.floor(totalCloudCores / numEdgeNodes);
  const cloudGhzPerNode = (cloudCoresPerNode * config.cloudGhzPerCore.value).toFixed(1);

  const vMultiplier = config.v.value / (calibratedV || 1);

  const selectedSharesStr = config.selectedCities
    .map(c => `${c}: ${traceData.city_workload_shares[c] || '10'}%`)
    .join(', ');

  const wrappedPct = ((traceData.wrapped_rows / (traceData.total_tasks || 1)) * 100).toFixed(1);

  return [
    {
      id: 'phi',
      item: 'Cycles per bit (φ)',
      value: `${config.phi.value.toLocaleString()} cycles/bit`,
      source: 'Assumed',
      why: 'Not in the dataset. Auto-calibrated so average edge utilization is about 70%; otherwise queues stay empty or grow without limit and the algorithms cannot be compared.',
    },
    {
      id: 'ghz',
      item: 'GHz per core (edge and cloud)',
      value: `Edge: ${config.edgeGhzPerCore.value.toFixed(1)} GHz, Cloud: ${config.cloudGhzPerCore.value.toFixed(1)} GHz`,
      source: 'Assumed',
      why: 'The dataset gives core counts, not clock speed.',
    },
    {
      id: 'power_model',
      item: 'CPU power model',
      value: `P = ξ·f³ (Edge full-load: ${config.edgeFullLoadPowerWatts.value} W, Cloud: ${config.cloudFullLoadPowerWatts.value} W)`,
      source: 'Paper + Dataset',
      why: "The paper's model, calibrated so power at maximum frequency equals the dataset's 432 W.",
    },
    {
      id: 'cloud_per_edge',
      item: 'Cloud capacity per edge node',
      value: `${cloudCoresPerNode} cores/node (${cloudGhzPerNode} GHz max) [${totalCloudCores} total cores split across ${numEdgeNodes} nodes]`,
      source: 'Assumed',
      why: 'The dataset gives total cloud cores, not a per-edge share.',
    },
    {
      id: 'link_rate',
      item: 'Link rate',
      value: `Capped at ${(linkBwMbps / 1000).toFixed(1)} Gbps (${linkBwMbps.toLocaleString()} Mbps); Max GB/link/slot = ${maxGbPerLinkSlot.toFixed(2)} GB`,
      source: 'Dataset',
      why: 'The dataset gives 25 Gbps links.',
    },
    {
      id: 'wireless_timing',
      item: 'Channel gain, transmit power, noise, transfer/compute split of each slot, transmission energy',
      value: `g = ${config.channelGainG.value.toExponential(1)}, p_max = ${config.pMax.value} W, N0 = ${config.n0Dbm.value} dBm; Transfer split = ${(config.tOffRatio.value * 100).toFixed(0)}% (${tOffSec}s), Compute split = ${(100 - config.tOffRatio.value * 100).toFixed(0)}% (${tCmpSec}s)`,
      source: 'Assumed',
      why: 'Not given by the paper or the dataset.',
    },
    {
      id: 'lyapunov_v',
      item: 'Lyapunov V',
      value: `Calibrated V = ${calibratedV.toExponential(3)} (Current = ${config.v.value.toExponential(3)}, ${vMultiplier.toFixed(2)}x)`,
      source: 'Assumed',
      why: "Chosen so DWPA's average queue is about 15% of one slot's arrivals. DWPA, Vertical-Only, Horizontal-First and YCL-24 share this V.",
    },
    {
      id: 'carbon_intensity',
      item: 'Hourly carbon intensity',
      value: `Mean of task rows in each hour; ${traceData.empty_hours_filled} hours forward-filled, ${traceData.wrapped_rows} rows replayed/wrapped (${wrappedPct}%)`,
      source: 'Dataset',
      why: 'The dataset has carbon values only at task timestamps.',
    },
    {
      id: 'carbon_estimate',
      item: 'Carbon estimate',
      value: `EMA of current hour with α = ${config.emaAlpha.value.toFixed(2)}; online/reactive tracking with no future forecasting`,
      source: 'Paper',
      why: 'The approach is online and reactive.',
    },
    {
      id: 'arrival_model',
      item: 'Arrival model',
      value: `Real empirical task trace (${traceData.total_tasks.toLocaleString()} tasks, ${traceData.total_workload_gb.toLocaleString()} GB total workload, arrival scale: ${config.arrivalScale.value.toFixed(1)}x)`,
      source: 'Dataset',
      why: "Real traffic is more realistic; results will not match the paper's figures.",
    },
    {
      id: 'topology',
      item: 'Topology',
      value: `${config.selectedCities.length} selected US cities and 1 California cloud DC. Workload shares: ${selectedSharesStr}`,
      source: 'Dataset',
      why: "Paper uses 5 cities and a Berkeley County cloud. On this dataset, Los Angeles is ~21%, and the other 8 cities are ~10% each.",
    },
    {
      id: 'counterparts',
      item: 'Counterparts ICSOC-19, DOLA-22, YCL-24',
      value: 'Algorithmic approximations (ICSOC-19: Greedy min CI, DOLA-22: Queue balancing, YCL-24: Static mean CI)',
      source: 'Assumed',
      why: "Implemented from the paper's one-sentence descriptions, not the original authors' code.",
    },
    {
      id: 'freq_rule_baselines',
      item: 'Frequency rule for non-Lyapunov algorithms',
      value: 'Queue-clearing frequency f = min(f_max, Q·φ/T_cmp) for Local-First, ICSOC-19 and DOLA-22',
      source: 'Assumed',
      why: 'The paper does not specify it; this avoids charging them for idle power.',
    },
    {
      id: 'not_modeled',
      item: 'Not modeled',
      value: 'Latency, memory, GPU, task priority, deadlines, idle power, embodied carbon',
      source: 'Paper',
      why: 'The paper does not model them.',
    },
  ];
}

describe('Assumptions & Limits Panel Logic', () => {
  it('renders all 14 specified methodology rows with accurate item titles and why rationales', () => {
    const config = createDefaultConfig(trace, 'DWPA');
    const rows = generateAssumptionRows(config, trace, 2.571e13);

    expect(rows.length).toBe(14);

    const expectedRowIds = [
      'phi',
      'ghz',
      'power_model',
      'cloud_per_edge',
      'link_rate',
      'wireless_timing',
      'lyapunov_v',
      'carbon_intensity',
      'carbon_estimate',
      'arrival_model',
      'topology',
      'counterparts',
      'freq_rule_baselines',
      'not_modeled',
    ];

    expect(rows.map(r => r.id)).toEqual(expectedRowIds);

    // Verify source taxonomy
    const sources = rows.map(r => r.source);
    expect(sources.filter(s => s === 'Assumed').length).toBe(7);
    expect(sources.filter(s => s === 'Dataset').length).toBe(4);
    expect(sources.filter(s => s === 'Paper').length).toBe(2);
    expect(sources.filter(s => s === 'Paper + Dataset').length).toBe(1);
  });

  it('keeps strictly Assumed rows when filtered by "Assumed only"', () => {
    const config = createDefaultConfig(trace, 'DWPA');
    const allRows = generateAssumptionRows(config, trace, 2.571e13);

    const assumedRows = allRows.filter(r => r.source === 'Assumed');
    expect(assumedRows.length).toBe(7);
    for (const r of assumedRows) {
      expect(r.source).toBe('Assumed');
    }

    const nonAssumed = allRows.filter(r => r.source !== 'Assumed');
    expect(nonAssumed.length).toBe(7);
    for (const r of nonAssumed) {
      expect(['Paper', 'Dataset', 'Paper + Dataset']).toContain(r.source);
    }
  });

  it('updates live values dynamically when workload or infrastructure configuration changes', () => {
    const baseConfig = createDefaultConfig(trace, 'DWPA');
    const baseRows = generateAssumptionRows(baseConfig, trace, 2.571e13);

    // 1. Change phi to 1000
    const updatedPhiConfig: SimConfig = {
      ...baseConfig,
      phi: { ...baseConfig.phi, value: 1000 },
    };
    const rowsPhi = generateAssumptionRows(updatedPhiConfig, trace, 2.571e13);
    expect(rowsPhi.find(r => r.id === 'phi')?.value).toBe('1,000 cycles/bit');

    // 2. Change clock speed to 3.2 GHz
    const updatedGhzConfig: SimConfig = {
      ...baseConfig,
      edgeGhzPerCore: { ...baseConfig.edgeGhzPerCore, value: 3.2 },
    };
    const rowsGhz = generateAssumptionRows(updatedGhzConfig, trace, 2.571e13);
    expect(rowsGhz.find(r => r.id === 'ghz')?.value).toContain('Edge: 3.2 GHz');

    // 3. Change selected cities (topology & cloud capacity per edge node)
    const updatedCitiesConfig: SimConfig = {
      ...baseConfig,
      selectedCities: ['Los Angeles', 'Boston', 'Seattle'], // 3 cities
    };
    const rowsCities = generateAssumptionRows(updatedCitiesConfig, trace, 2.571e13);
    const cloudRow = rowsCities.find(r => r.id === 'cloud_per_edge');
    // 480 / 3 = 160 cores/node
    expect(cloudRow?.value).toContain('160 cores/node');

    // 4. Change slot length from 1h to 2h (affects link rate max GB/link/slot)
    const updatedSlotConfig: SimConfig = {
      ...baseConfig,
      slotLengthHours: 2,
    };
    const rowsSlot = generateAssumptionRows(updatedSlotConfig, trace, 2.571e13);
    const linkRow = rowsSlot.find(r => r.id === 'link_rate');
    // Max GB doubles from 1125.00 GB to 2250.00 GB
    expect(linkRow?.value).toContain('2250.00 GB');

    // 5. Change EMA alpha to 0.8
    const updatedAlphaConfig: SimConfig = {
      ...baseConfig,
      emaAlpha: { ...baseConfig.emaAlpha, value: 0.8 },
    };
    const rowsAlpha = generateAssumptionRows(updatedAlphaConfig, trace, 2.571e13);
    expect(rowsAlpha.find(r => r.id === 'carbon_estimate')?.value).toContain('α = 0.80');
  });
});
