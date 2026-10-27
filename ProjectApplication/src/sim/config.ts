/**
 * config.ts
 * Simulation configuration defaults, presets, and auto-calibration routines.
 * Every parameter carries full metadata (value, assumed, source, reason) as required.
 */

import { SimConfig, TraceData, AlgorithmType } from './types';
import { BITS_PER_GB } from './dwpa';

export const ALL_CITY_NAMES = [
  'Los Angeles',
  'Boston',
  'New York City',
  'Miami',
  'Chicago',
  'Phoenix',
  'Philadelphia',
  'Seattle',
  'Houston'
];

/**
 * Checks whether an algorithm uses Lyapunov parameter V.
 * DWPA, Vertical-Only, Horizontal-First, and YCL-24 use V.
 * Local-First, ICSOC-19, and DOLA-22 do not use V.
 */
export function usesLyapunovV(algorithm: AlgorithmType): boolean {
  return (
    algorithm === 'DWPA' ||
    algorithm === 'Vertical-Only' ||
    algorithm === 'Horizontal-First' ||
    algorithm === 'YCL-24'
  );
}

/**
 * Returns the calibrated shared Lyapunov V for Lyapunov-based algorithms
 * (calibrated once for DWPA to 15% of mean slot arrivals = ~2.571e13).
 * Returns undefined for non-Lyapunov algorithms (Local-First, ICSOC-19, DOLA-22).
 */
export function getDefaultVForAlgorithm(algorithm: AlgorithmType = 'DWPA'): number | undefined {
  if (usesLyapunovV(algorithm)) {
    return 2.5712444980290355e13;
  }
  return undefined;
}

/**
 * Creates the default simulation configuration using dataset parameters and documented assumptions.
 */
export function createDefaultConfig(trace?: TraceData, algorithm: AlgorithmType = 'DWPA'): SimConfig {
  const selectedCities = trace?.cities?.map(c => c.city) ?? ALL_CITY_NAMES;
  const numHours = trace?.num_hours ?? 775;

  const defaultV = getDefaultVForAlgorithm(algorithm);

  const config: SimConfig = {
    selectedCities,

    // Infrastructure parameters
    edgeGhzPerCore: {
      value: 2.5,
      assumed: true,
      source: 'Assumed',
      reason: 'Dataset gives core counts, not clock speed. 2.5 GHz per core assumed.'
    },
    cloudGhzPerCore: {
      value: 2.5,
      assumed: true,
      source: 'Assumed',
      reason: 'Dataset gives core counts, not clock speed. 2.5 GHz per core assumed.'
    },
    edgeFullLoadPowerWatts: {
      value: 432.0,
      assumed: false,
      source: 'Paper + Dataset',
      reason: "Paper's model xi * f^3 with xi derived so power at f_max equals dataset's 432 W."
    },
    cloudFullLoadPowerWatts: {
      value: 432.0,
      assumed: false,
      source: 'Paper + Dataset',
      reason: "Dataset gives 432 W full-load power per cloud server (5 servers = 2160 W total)."
    },
    edgeBandwidthMbps: {
      value: 25000.0,
      assumed: false,
      source: 'Dataset',
      reason: 'Dataset specifies edge_bandwidth_mbps = 25000 Mbps (25 Gbps).'
    },
    cloudBandwidthMbps: {
      value: 25000.0,
      assumed: false,
      source: 'Dataset',
      reason: 'Dataset specifies cloud_bandwidth_mbps = 25000 Mbps (25 Gbps).'
    },

    // Wireless / Communication model
    channelGainG: {
      value: 1e-11,
      assumed: true,
      source: 'Assumed',
      reason: 'Not given by paper or dataset; realistic path loss for wireless transfer (~110 dB).'
    },
    pMax: {
      value: 1.0,
      assumed: false,
      source: 'Paper',
      reason: 'Paper Section VI specifies p_max = 1.0 W.'
    },
    n0Dbm: {
      value: -130.0,
      assumed: false,
      source: 'Paper',
      reason: 'Paper Section VI specifies background noise N0 = -130 dBm.'
    },
    bandwidthW: {
      value: 25000e6, // 25 GHz channel matching 25 Gbps
      assumed: true,
      source: 'Dataset',
      reason: 'Channel bandwidth W set to 25 GHz corresponding to 25,000 Mbps link capacity.'
    },
    tOffRatio: {
      value: 0.1,
      assumed: true,
      source: 'Assumed',
      reason: 'Paper divides slot into T_off and T_cmp but does not fix ratio; 10% transfer / 90% compute assumed.'
    },

    // Lyapunov & Workload controls
    slotLengthHours: 1,
    arrivalScale: {
      value: 1.0,
      assumed: true,
      source: 'Assumed',
      reason: 'Workload multiplier on dataset arrivals (default 1.0 = 100% of trace).'
    },
    startHour: 0,
    endHour: numHours,
    v: {
      value: defaultV ?? 1.0,
      assumed: false,
      source: 'Paper',
      reason: 'Lyapunov priority weight V. Calibrated by bisection so DWPA average total queue is <= 15% of one slot arrivals.'
    },
    emaAlpha: {
      value: 0.5,
      assumed: false,
      source: 'Paper',
      reason: 'Paper Section VI uses EMA of carbon intensity; default smoothing factor alpha = 0.5.'
    },
    phi: {
      value: 5200.0,
      assumed: true,
      source: 'Assumed',
      reason: 'Not in dataset. Auto-calibrated so average edge utilization is ~70%, preventing empty or diverging queues.'
    },

    usePaperPreset: false
  };

  if (trace) {
    const calibrated = autoCalibratePhi(trace, config, 0.70);
    config.phi.value = calibrated.phi;
  }

  return config;
}

/**
 * Creates the "Use paper's parameters" preset:
 * phi = 1000, xi = 1e-18, p_max = 1 W, N0 = -130 dBm, W = 1 MHz.
 */
export function createPaperPresetConfig(trace?: TraceData): SimConfig {
  const config = createDefaultConfig(trace);
  config.usePaperPreset = true;

  config.phi = {
    value: 1000.0,
    assumed: false,
    source: 'Paper',
    reason: 'Paper Section VI specifies computational intensity phi = 1000 cycles/bit.'
  };

  config.pMax = {
    value: 1.0,
    assumed: false,
    source: 'Paper',
    reason: 'Paper Section VI specifies p_max = 1.0 W.'
  };

  config.n0Dbm = {
    value: -130.0,
    assumed: false,
    source: 'Paper',
    reason: 'Paper Section VI specifies N0 = -130 dBm.'
  };

  config.bandwidthW = {
    value: 1e6, // 1 MHz
    assumed: false,
    source: 'Paper',
    reason: 'Paper Section VI specifies bandwidth W = 1 MHz.'
  };

  return config;
}

/**
 * Auto-calibrates computational intensity phi (cycles per bit) so that mean edge utilization is about targetUtilization (default 0.70).
 *
 * Theory:
 * Total maximum compute capacity across all selected edge nodes per slot is:
 * C_slot_bits = (T_cmp * sum(f_max_i)) / phi
 * C_slot_gb = C_slot_bits / 8e9
 * Total workload arrived per slot is arrival_rate_gb = total_arrivals_gb / num_slots
 * Mean utilization rho = arrival_rate_gb / C_slot_gb
 * Solving for phi:
 * phi = (rho * T_cmp * sum(f_max_i)) / (8e9 * arrival_rate_gb)
 */
export function autoCalibratePhi(
  trace: TraceData,
  config: SimConfig,
  targetUtilization: number = 0.70
): { phi: number; expectedUtilization: number } {
  const slotSec = config.slotLengthHours * 3600;
  const tCmp = slotSec * (1 - config.tOffRatio.value);
  const startH = Math.max(0, config.startHour);
  const endH = Math.min(trace.num_hours, config.endHour);
  const totalHours = Math.max(1, endH - startH);
  const numSlots = Math.ceil(totalHours / config.slotLengthHours);

  // Sum total arrivals across selected cities in the active range
  let totalArrivalsGb = 0;
  let totalCores = 0;

  for (const city of trace.cities) {
    if (!config.selectedCities.includes(city.city)) continue;
    totalCores += city.total_cores;

    const arrivalsSlice = city.hourly_arrivals_gb.slice(startH, endH);
    for (const arr of arrivalsSlice) {
      totalArrivalsGb += arr;
    }
  }

  // Multiply by arrival scale
  totalArrivalsGb *= config.arrivalScale.value;

  if (totalArrivalsGb <= 0 || totalCores <= 0) {
    return { phi: 1000.0, expectedUtilization: 0.70 };
  }

  const arrivalRateGbPerSlot = totalArrivalsGb / numSlots;
  const ghzPerCore = config.edgeGhzPerCore.value;
  const fTotalHz = totalCores * ghzPerCore * 1e9;

  // phi = (targetUtilization * tCmp * fTotalHz) / (BITS_PER_GB * arrivalRateGbPerSlot)
  const calculatedPhi = (targetUtilization * tCmp * fTotalHz) / (BITS_PER_GB * arrivalRateGbPerSlot);
  const roundedPhi = Math.round(calculatedPhi);

  return {
    phi: Math.max(100, roundedPhi),
    expectedUtilization: targetUtilization
  };
}
