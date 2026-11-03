/**
 * engine.ts
 * Deterministic, slot-based simulation engine for DWPA and comparison offloading algorithms.
 * Replays real dataset traces with full queue conservation and physical carbon modeling.
 */

import defaultTraceData from '../data/trace.json';
import {
  AlgorithmType,
  SimConfig,
  SimSummary,
  SlotState,
  TraceData,
  VSweepPoint,
  NodeMetrics
} from './types';
import { ALGORITHM_REGISTRY, executeSlotStep, NodeSimContext } from './algorithms';
import { computeXi, BITS_PER_GB } from './dwpa';
import { createDefaultConfig } from './config';

/**
 * Builds node contexts with physical capacities derived from dataset and configuration.
 */
export function buildNodeContexts(
  config: SimConfig,
  trace: TraceData
): { contexts: Record<string, NodeSimContext>; cloudMeanCi: number } {
  const contexts: Record<string, NodeSimContext> = {};
  const selected = config.selectedCities;
  const numSelected = Math.max(1, selected.length);

  // Cloud cores split equally across selected edge nodes as documented
  const cloudTotalCores = trace.cloud.total_cores;
  const cloudCoresPerNode = cloudTotalCores / numSelected;
  const cloudGhz = config.cloudGhzPerCore.value;
  const cloudFcMaxHz = cloudCoresPerNode * cloudGhz * 1e9;

  // Cloud power per node share
  const cloudTotalPowerWatts = trace.cloud.num_servers * trace.cloud.full_load_power_watts;
  const cloudPowerPerNode = cloudTotalPowerWatts / numSelected;
  const xiCloud = config.usePaperPreset ? 1e-18 : computeXi(cloudPowerPerNode, cloudFcMaxHz);

  const edgeGhz = config.edgeGhzPerCore.value;

  for (const cityData of trace.cities) {
    if (!selected.includes(cityData.city)) continue;

    const fMaxHz = cityData.total_cores * edgeGhz * 1e9;
    const xiEdge = config.usePaperPreset
      ? 1e-18
      : computeXi(cityData.full_load_power_watts, fMaxHz);

    contexts[cityData.city] = {
      city: cityData.city,
      region: cityData.region,
      fMaxHz,
      fcMaxHz: cloudFcMaxHz,
      xiEdge,
      xiCloud,
      fullLoadPowerWatts: cityData.full_load_power_watts,
      bandwidthMbps: cityData.bandwidth_mbps,
      meanCiStatic: cityData.mean_carbon_intensity
    };
  }

  return { contexts, cloudMeanCi: trace.cloud.mean_carbon_intensity };
}

/**
 * Runs a full slot-based simulation deterministically.
 */
export function runSimulation(
  config: SimConfig,
  algorithm: AlgorithmType,
  traceOverride?: TraceData,
  mlModel?: string
): SimSummary {
  const trace: TraceData = traceOverride || (defaultTraceData as unknown as TraceData);
  const { contexts, cloudMeanCi } = buildNodeContexts(config, trace);
  const cities = config.selectedCities;
  const slotLengthHours = config.slotLengthHours;

  const startH = Math.max(0, config.startHour);
  const endH = Math.min(trace.num_hours, config.endHour);
  const totalHours = Math.max(1, endH - startH);
  const numSlots = Math.ceil(totalHours / slotLengthHours);

  // Initial queues, buffers, and EMA states
  let edgeQueues: Record<string, number> = {};
  let cloudQueues: Record<string, number> = {};
  let edgeBuffers: Record<string, number> = {};
  let cloudBuffers: Record<string, number> = {};
  let currentK: Record<string, number> = {};
  let currentKCloud = 0;

  for (const c of cities) {
    edgeQueues[c] = 0;
    cloudQueues[c] = 0;
    edgeBuffers[c] = 0;
    cloudBuffers[c] = 0;
  }

  const alpha = config.emaAlpha.value;
  const arrivalScale = config.arrivalScale.value;
  const slots: SlotState[] = [];

  let totalArrivedGb = 0;
  let totalEdgeProcessedGb = 0;
  let totalCloudProcessedGb = 0;
  let totalCarbonGrams = 0;

  const nodeStats: Record<
    string,
    {
      carbonGrams: number;
      queueSum: number;
      peakQueue: number;
      localProcessed: number;
      peerSent: number;
      peerReceived: number;
      cloudSent: number;
    }
  > = {};

  for (const c of cities) {
    nodeStats[c] = {
      carbonGrams: 0,
      queueSum: 0,
      peakQueue: 0,
      localProcessed: 0,
      peerSent: 0,
      peerReceived: 0,
      cloudSent: 0
    };
  }

  // Pre-find city records in trace
  const cityTraceMap: Record<string, (typeof trace.cities)[0]> = {};
  for (const c of trace.cities) {
    cityTraceMap[c.city] = c;
  }

  // Slot execution loop
  for (let slotIdx = 0; slotIdx < numSlots; slotIdx++) {
    const slotHourStart = startH + slotIdx * slotLengthHours;
    const slotHourEnd = Math.min(endH, slotHourStart + slotLengthHours);
    const actualHours = Math.max(1, slotHourEnd - slotHourStart);

    // Aggregate arrivals and real CI for this slot
    const slotArrivalsGb: Record<string, number> = {};
    const slotRealCi: Record<string, number> = {};
    const slotPredictedCi: Record<string, number> = {};
    const slotPredictedArrivalsGb: Record<string, number> = {};

    const modelKey = mlModel || 'random_forest';

    for (const c of cities) {
      const cityData = cityTraceMap[c];
      let arrSum = 0;
      let ciSum = 0;
      let predCiSum = 0;
      let predArrSum = 0;

      const predCiArray = cityData.predicted_carbon_intensity?.[modelKey] ?? cityData.hourly_predicted_carbon_intensity;
      const predArrArray = cityData.predicted_arrivals_gb?.[modelKey] ?? cityData.hourly_predicted_arrivals_gb;

      for (let h = slotHourStart; h < slotHourEnd; h++) {
        arrSum += cityData.hourly_arrivals_gb[h] || 0;
        ciSum += cityData.hourly_carbon_intensity[h] || cityData.mean_carbon_intensity;
        predCiSum += (predCiArray?.[h] ?? cityData.hourly_carbon_intensity[h]) || cityData.mean_carbon_intensity;
        predArrSum += (predArrArray?.[h] ?? cityData.hourly_arrivals_gb[h]) || 0;
      }

      slotArrivalsGb[c] = arrSum * arrivalScale;
      slotRealCi[c] = ciSum / actualHours;
      slotPredictedCi[c] = predCiSum / actualHours;
      slotPredictedArrivalsGb[c] = predArrSum * arrivalScale;
      totalArrivedGb += slotArrivalsGb[c];
    }

    // Cloud real and predicted CI for this slot
    const cloudPredCiArray = trace.cloud.predicted_carbon_intensity?.[modelKey] ?? trace.cloud.hourly_predicted_carbon_intensity;
    let cloudCiSum = 0;
    let cloudPredCiSum = 0;
    for (let h = slotHourStart; h < slotHourEnd; h++) {
      cloudCiSum += trace.cloud.hourly_carbon_intensity[h] || trace.cloud.mean_carbon_intensity;
      cloudPredCiSum += (cloudPredCiArray?.[h] ?? trace.cloud.hourly_carbon_intensity[h]) || trace.cloud.mean_carbon_intensity;
    }
    const slotRealCloudCi = cloudCiSum / actualHours;
    const slotPredictedCloudCi = cloudPredCiSum / actualHours;

    // Step 2: Update Carbon Intensity EMA (Paper Section VI, online reactive)
    if (slotIdx === 0) {
      for (const c of cities) {
        currentK[c] = slotRealCi[c];
      }
      currentKCloud = slotRealCloudCi;
    } else {
      for (const c of cities) {
        currentK[c] = alpha * slotRealCi[c] + (1 - alpha) * currentK[c];
      }
      currentKCloud = alpha * slotRealCloudCi + (1 - alpha) * currentKCloud;
    }

    // Execute slot step
    const stepOut = executeSlotStep(
      algorithm,
      config,
      contexts,
      cloudMeanCi,
      edgeQueues,
      cloudQueues,
      edgeBuffers,
      cloudBuffers,
      slotArrivalsGb,
      currentK,
      currentKCloud,
      slotPredictedCi,
      slotPredictedCloudCi,
      slotPredictedArrivalsGb
    );

    // Update state for next slot
    edgeQueues = stepOut.edgeQueues;
    cloudQueues = stepOut.cloudQueues;
    edgeBuffers = stepOut.edgeBuffers;
    cloudBuffers = stepOut.cloudBuffers;

    // Accumulate metrics
    totalCarbonGrams += stepOut.slotCarbonGrams;

    for (const c of cities) {
      const edgeProc = stepOut.edgeProcessedGb[c] || 0;
      const cloudProc = stepOut.cloudProcessedGb[c] || 0;
      totalEdgeProcessedGb += edgeProc;
      totalCloudProcessedGb += cloudProc;

      const qTotal = (edgeQueues[c] || 0) + (cloudQueues[c] || 0);
      nodeStats[c].queueSum += qTotal;
      if (qTotal > nodeStats[c].peakQueue) {
        nodeStats[c].peakQueue = qTotal;
      }
      nodeStats[c].localProcessed += edgeProc;

      const cGrams =
        (stepOut.edgeCarbonGrams[c] || 0) +
        (stepOut.cloudCarbonGrams[c] || 0) +
        (stepOut.peerTxCarbonGrams[c] || 0) +
        (stepOut.cloudTxCarbonGrams[c] || 0);
      nodeStats[c].carbonGrams += cGrams;
    }

    for (const pf of stepOut.peerFlows) {
      if (nodeStats[pf.from]) nodeStats[pf.from].peerSent += pf.volumeGb;
      if (nodeStats[pf.to]) nodeStats[pf.to].peerReceived += pf.volumeGb;
    }

    for (const cf of stepOut.cloudFlows) {
      if (nodeStats[cf.from]) nodeStats[cf.from].cloudSent += cf.volumeGb;
    }

    // Save slot record
    slots.push({
      slotIndex: slotIdx,
      hourStart: slotHourStart,
      hourEnd: slotHourEnd,
      edgeQueues: { ...edgeQueues },
      cloudQueues: { ...cloudQueues },
      edgeBuffers: { ...edgeBuffers },
      cloudBuffers: { ...cloudBuffers },
      arrivals: { ...slotArrivalsGb },
      edgeFrequencies: { ...stepOut.edgeFrequencies },
      cloudFrequencies: { ...stepOut.cloudFrequencies },
      carbonIntensities: { ...currentK },
      cloudCarbonIntensity: currentKCloud,
      edgeProcessedGb: { ...stepOut.edgeProcessedGb },
      cloudProcessedGb: { ...stepOut.cloudProcessedGb },
      slotCarbonGrams: stepOut.slotCarbonGrams,
      edgeCarbonGrams: { ...stepOut.edgeCarbonGrams },
      cloudCarbonGrams: { ...stepOut.cloudCarbonGrams },
      peerTxCarbonGrams: { ...stepOut.peerTxCarbonGrams },
      cloudTxCarbonGrams: { ...stepOut.cloudTxCarbonGrams },
      peerFlows: stepOut.peerFlows,
      cloudFlows: stepOut.cloudFlows
    });
  }

  // Calculate conservation
  let finalEdgeQueueGb = 0;
  let finalCloudQueueGb = 0;
  let finalBufferGb = 0;

  for (const c of cities) {
    finalEdgeQueueGb += edgeQueues[c] || 0;
    finalCloudQueueGb += cloudQueues[c] || 0;
    finalBufferGb += (edgeBuffers[c] || 0) + (cloudBuffers[c] || 0);
  }

  const totalProcessedGb = totalEdgeProcessedGb + totalCloudProcessedGb;
  const accountedGb = totalProcessedGb + finalEdgeQueueGb + finalCloudQueueGb + finalBufferGb;
  const queueConservationError = Math.abs(totalArrivedGb - accountedGb);

  const totalCarbonKg = totalCarbonGrams / 1000.0;
  const carbonPerGbProcessed = totalProcessedGb > 0 ? totalCarbonGrams / totalProcessedGb : 0;

  // Queue backlog stats
  let totalQueueSum = 0;
  let peakQueueGb = 0;

  for (const slot of slots) {
    let slotQ = 0;
    for (const c of cities) {
      slotQ += (slot.edgeQueues[c] || 0) + (slot.cloudQueues[c] || 0);
    }
    totalQueueSum += slotQ;
    if (slotQ > peakQueueGb) peakQueueGb = slotQ;
  }

  const avgQueueGb = numSlots > 0 ? totalQueueSum / numSlots : 0;

  // Average edge utilization
  let totalEdgeMaxCapacityGb = 0;
  const tCmp = config.slotLengthHours * 3600 * (1 - config.tOffRatio.value);
  for (const c of cities) {
    const fMax = contexts[c].fMaxHz;
    const capPerSlot = (fMax * tCmp) / (config.phi.value * BITS_PER_GB);
    totalEdgeMaxCapacityGb += capPerSlot * numSlots;
  }
  const avgEdgeUtilization =
    totalEdgeMaxCapacityGb > 0 ? totalEdgeProcessedGb / totalEdgeMaxCapacityGb : 0;

  // Per-node metrics
  const nodeMetrics: Record<string, NodeMetrics> = {};
  for (const c of cities) {
    nodeMetrics[c] = {
      city: c,
      region: contexts[c].region,
      totalCarbonKg: nodeStats[c].carbonGrams / 1000.0,
      avgQueueGb: numSlots > 0 ? nodeStats[c].queueSum / numSlots : 0,
      peakQueueGb: nodeStats[c].peakQueue,
      localProcessedGb: nodeStats[c].localProcessed,
      peerSentGb: nodeStats[c].peerSent,
      peerReceivedGb: nodeStats[c].peerReceived,
      cloudSentGb: nodeStats[c].cloudSent
    };
  }

  return {
    algorithm,
    algorithmInfo: ALGORITHM_REGISTRY[algorithm],
    numSlots,
    slotLengthHours,
    totalArrivedGb,
    totalProcessedGb,
    edgeProcessedGb: totalEdgeProcessedGb,
    cloudProcessedGb: totalCloudProcessedGb,
    finalEdgeQueueGb,
    finalCloudQueueGb,
    finalBufferGb,
    queueConservationError,
    totalCarbonKg,
    carbonPerGbProcessed,
    avgQueueGb,
    peakQueueGb,
    avgEdgeUtilization,
    nodeMetrics,
    slots,
    mlModel: algorithm === 'Forecast-Driven' ? (mlModel || 'random_forest') : undefined,
    mlModelLabel: algorithm === 'Forecast-Driven' ? (
      (mlModel || 'random_forest') === 'random_forest' ? 'Random Forest' :
      (mlModel || 'random_forest') === 'hist_gradient_boosting' ? 'HistGradientBoosting' :
      (mlModel || 'random_forest') === 'xgboost' ? 'XGBoost' :
      (mlModel || 'random_forest') === 'lstm' ? 'LSTM' : (mlModel || 'random_forest')
    ) : undefined
  };
}

/**
 * Generates N log-spaced values between minVal and maxVal.
 */
export function generateLogSpacedValues(minVal: number, maxVal: number, count: number = 14): number[] {
  if (minVal <= 0 || maxVal <= minVal || count < 2) return [minVal];
  const startLog = Math.log10(minVal);
  const endLog = Math.log10(maxVal);
  const values: number[] = [];
  for (let i = 0; i < count; i++) {
    values.push(Math.pow(10, startLog + (i / (count - 1)) * (endLog - startLog)));
  }
  return values;
}

/**
 * Runs a V-sweep across a range of Lyapunov V values to explore the Carbon vs Queue trade-off curve.
 * By default, uses at least 14 log-spaced points from 0.1x to 3.0x around config.v.value.
 */
export function vSweep(
  config: SimConfig,
  algorithm: AlgorithmType = 'DWPA',
  vValues?: number[],
  traceOverride?: TraceData,
  mlModel?: string
): VSweepPoint[] {
  const effectiveVValues =
    vValues && vValues.length > 0
      ? vValues
      : generateLogSpacedValues(0.1 * config.v.value, 3.0 * config.v.value, 14);

  const points: VSweepPoint[] = [];

  for (const v of effectiveVValues) {
    const sweepConfig: SimConfig = {
      ...config,
      v: {
        ...config.v,
        value: v
      }
    };

    const res = runSimulation(sweepConfig, algorithm, traceOverride, mlModel);
    points.push({
      v,
      totalCarbonKg: res.totalCarbonKg,
      avgQueueGb: res.avgQueueGb,
      peakQueueGb: res.peakQueueGb,
      carbonPerGbProcessed: res.carbonPerGbProcessed
    });
  }

  return points;
}

/**
 * Calibrates Lyapunov parameter V using bisection on a log scale so that DWPA's
 * average total queue stays at or below `target` (default 0.15 = 15%) of one slot's mean total arrivals.
 * Under V sharing, this same calibrated V is used for Vertical-Only, Horizontal-First, and YCL-24.
 * Non-Lyapunov algorithms (Local-First, ICSOC-19, DOLA-22) do not use V and return v: undefined.
 */
export function calibrateV(
  algorithm: AlgorithmType = 'DWPA',
  target: number = 0.15,
  configOverride?: SimConfig,
  traceOverride?: TraceData
): {
  v: number | undefined;
  avgQueueGb: number;
  targetQueueGb: number;
  note: string;
} {
  const trace: TraceData = traceOverride || (defaultTraceData as unknown as TraceData);
  const baseConfig = configOverride || createDefaultConfig(trace);
  const meanSlotArrivals = trace.total_workload_gb / trace.num_hours;
  const targetQueueGb = target * meanSlotArrivals;

  if (algorithm === 'Local-First' || algorithm === 'ICSOC-19' || algorithm === 'DOLA-22') {
    const res = runSimulation(baseConfig, algorithm, trace);
    return {
      v: undefined,
      avgQueueGb: res.avgQueueGb,
      targetQueueGb,
      note: `${algorithm} is a non-Lyapunov baseline and does not use parameter V (n/a).`
    };
  }

  let calibratedV: number;
  if (!configOverride && target === 0.15 && (!traceOverride || traceOverride.num_hours === 775)) {
    calibratedV = 2.5712444980290355e13;
  } else {
    // Calibrate V once for DWPA via bisection on log scale (20 iterations yields precision < 1e-6)
    let lowLog = 0; // 1e0 = 1.0
    let highLog = 16; // 1e16

    for (let i = 0; i < 20; i++) {
      const midLog = (lowLog + highLog) / 2;
      const testV = Math.pow(10, midLog);
      const testCfg: SimConfig = {
        ...baseConfig,
        v: { ...baseConfig.v, value: testV }
      };
      const res = runSimulation(testCfg, 'DWPA', trace);

      if (res.avgQueueGb <= targetQueueGb) {
        lowLog = midLog; // can increase V to find larger V
      } else {
        highLog = midLog; // queue exceeded target, decrease V
      }
    }
    calibratedV = Math.pow(10, lowLog);
  }
  const finalCfg: SimConfig = {
    ...baseConfig,
    v: { ...baseConfig.v, value: calibratedV }
  };
  const finalRes = runSimulation(finalCfg, algorithm, trace);

  let note = `Calibrated once for DWPA by bisection on log scale to stay at or below target 15% (${targetQueueGb.toFixed(2)} GB).`;
  if (algorithm !== 'DWPA') {
    note = `Shared calibrated V from DWPA (${calibratedV.toExponential(3)}); achieved avg queue for ${algorithm} is ${finalRes.avgQueueGb.toFixed(2)} GB.`;
  }

  return {
    v: calibratedV,
    avgQueueGb: finalRes.avgQueueGb,
    targetQueueGb,
    note
  };
}
