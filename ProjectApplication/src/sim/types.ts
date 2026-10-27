/**
 * types.ts
 * Type definitions for DWPA simulation engine and trace data.
 */

export type AlgorithmType =
  | 'DWPA'
  | 'Local-First'
  | 'Vertical-Only'
  | 'Horizontal-First'
  | 'ICSOC-19'
  | 'DOLA-22'
  | 'YCL-24';

export interface AlgorithmInfo {
  id: AlgorithmType;
  name: string;
  description: string;
  approximate: boolean;
  notes?: string;
}

export type ParamSource = 'Paper' | 'Dataset' | 'Assumed' | 'Paper + Dataset';

export interface ParamMeta<T> {
  value: T;
  assumed: boolean;
  source: ParamSource;
  reason: string;
}

export interface CityTraceData {
  city: string;
  region: string;
  num_servers: number;
  cores_per_server: number;
  total_cores: number;
  bandwidth_mbps: number;
  full_load_power_watts: number;
  workload_share_pct: number;
  total_workload_gb: number;
  total_tasks: number;
  mean_carbon_intensity: number;
  hourly_arrivals_gb: number[];
  hourly_task_counts: number[];
  hourly_carbon_intensity: number[];
}

export interface CloudTraceData {
  region: string;
  location_city: string;
  num_servers: number;
  cores_per_server: number;
  total_cores: number;
  bandwidth_mbps: number;
  full_load_power_watts: number;
  mean_carbon_intensity: number;
  hourly_carbon_intensity: number[];
}

export interface TraceData {
  num_hours: number;
  total_tasks: number;
  total_workload_gb: number;
  empty_hours_filled: number;
  wrapped_rows: number;
  city_workload_shares: Record<string, number>;
  data_quality_note: string;
  cities: CityTraceData[];
  cloud: CloudTraceData;
}

export interface SimConfig {
  // Selected edge cities (subset of trace cities, 1 to 9)
  selectedCities: string[];

  // Infrastructure parameters
  edgeGhzPerCore: ParamMeta<number>; // assumed default: 2.5 GHz
  cloudGhzPerCore: ParamMeta<number>; // assumed default: 2.5 GHz
  edgeFullLoadPowerWatts: ParamMeta<number>; // dataset: 432 W
  cloudFullLoadPowerWatts: ParamMeta<number>; // dataset: 432 W per server
  edgeBandwidthMbps: ParamMeta<number>; // dataset: 25000 Mbps
  cloudBandwidthMbps: ParamMeta<number>; // dataset: 25000 Mbps

  // Wireless / Communication model
  channelGainG: ParamMeta<number>; // assumed default: 1e-11
  pMax: ParamMeta<number>; // paper: 1.0 W
  n0Dbm: ParamMeta<number>; // paper: -130 dBm
  bandwidthW: ParamMeta<number>; // assumed / dataset: 25000 MHz (or 1 MHz in paper preset)
  tOffRatio: ParamMeta<number>; // assumed: 0.1 (10% transfer, 90% computation)

  // Lyapunov & Workload controls
  slotLengthHours: 1 | 2 | 4 | 6; // default: 1
  arrivalScale: ParamMeta<number>; // default: 1.0
  startHour: number; // default: 0
  endHour: number; // default: 775 (or trace.num_hours)
  v: ParamMeta<number>; // paper Lyapunov parameter V
  emaAlpha: ParamMeta<number>; // paper EMA smoothing factor alpha (default 0.5)
  phi: ParamMeta<number>; // cycles per bit (auto-calibrated or paper preset 1000)

  // Paper preset flag
  usePaperPreset?: boolean;
}

export interface PeerFlowRecord {
  from: string;
  to: string;
  volumeGb: number;
  powerWatts: number;
  rateBps: number;
  txDurationSec: number;
  carbonGrams: number;
}

export interface CloudFlowRecord {
  from: string;
  volumeGb: number;
  powerWatts: number;
  rateBps: number;
  txDurationSec: number;
  carbonGrams: number;
}

export interface SlotState {
  slotIndex: number;
  hourStart: number;
  hourEnd: number;

  // Queue lengths at end of slot (in GB)
  edgeQueues: Record<string, number>;
  cloudQueues: Record<string, number>;

  // Inbound buffers at end of slot (in GB, will enter queue in next slot)
  edgeBuffers: Record<string, number>;
  cloudBuffers: Record<string, number>;

  // Arrivals during this slot (in GB)
  arrivals: Record<string, number>;

  // CPU frequencies during this slot (in Hz)
  edgeFrequencies: Record<string, number>;
  cloudFrequencies: Record<string, number>;

  // Carbon intensities (EMA values k_i)
  carbonIntensities: Record<string, number>;
  cloudCarbonIntensity: number;

  // Workload processed during this slot (in GB)
  edgeProcessedGb: Record<string, number>;
  cloudProcessedGb: Record<string, number>;

  // Carbon emissions during this slot (in gCO2)
  slotCarbonGrams: number;
  edgeCarbonGrams: Record<string, number>;
  cloudCarbonGrams: Record<string, number>;
  peerTxCarbonGrams: Record<string, number>;
  cloudTxCarbonGrams: Record<string, number>;

  // Offloading flows
  peerFlows: PeerFlowRecord[];
  cloudFlows: CloudFlowRecord[];
}

export interface NodeMetrics {
  city: string;
  region: string;
  totalCarbonKg: number;
  avgQueueGb: number;
  peakQueueGb: number;
  localProcessedGb: number;
  peerSentGb: number;
  peerReceivedGb: number;
  cloudSentGb: number;
}

export interface SimSummary {
  algorithm: AlgorithmType;
  algorithmInfo: AlgorithmInfo;
  numSlots: number;
  slotLengthHours: number;

  totalArrivedGb: number;
  totalProcessedGb: number;
  edgeProcessedGb: number;
  cloudProcessedGb: number;

  finalEdgeQueueGb: number;
  finalCloudQueueGb: number;
  finalBufferGb: number;

  // Queue conservation: arrived == processed + remaining_queues + remaining_buffers
  queueConservationError: number;

  totalCarbonKg: number;
  carbonPerGbProcessed: number; // gCO2 / GB processed

  avgQueueGb: number;
  peakQueueGb: number;
  avgEdgeUtilization: number;

  nodeMetrics: Record<string, NodeMetrics>;
  slots: SlotState[];
}

export interface VSweepPoint {
  v: number;
  totalCarbonKg: number;
  avgQueueGb: number;
  peakQueueGb: number;
  carbonPerGbProcessed: number;
}
