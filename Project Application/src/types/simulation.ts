export type AlgorithmId =
  | 'round_robin'
  | 'random'
  | 'cpu_aware'
  | 'latency_aware'
  | 'carbon_aware'
  | 'forecast_carbon_aware';

export interface AlgorithmInfo {
  id: AlgorithmId;
  name: string;
  badge: string;
  isProposed?: boolean;
  description: string;
  pros: string;
  cons: string;
  complexity: string;
  primaryObjective: string;
}

export type RegionId =
  | 'delhi'
  | 'mumbai'
  | 'bengaluru'
  | 'chennai'
  | 'hyderabad'
  | 'singapore'
  | 'us_east'
  | 'europe'
  | 'custom';

export interface RegionInfo {
  id: RegionId;
  name: string;
  avgCarbonIntensity: number; // gCO2 / kWh
  baseNetworkLatencyMs: number;
  renewableShare: number; // percentage
  gridMix: string;
}

export interface EdgeRegion {
  id: string;
  name: string;
  serverCount: number;
  cpuMips: number;
  ramGb: number;
  region: RegionId;
}

export interface EdgeConfig {
  serverCount: number;
  cpuMips: number;
  ramGb: number;
  storageGb: number;
  bandwidthMbps: number;
  region: RegionId;
  additionalRegions: EdgeRegion[];
}

export interface CloudConfig {
  serverCount: number;
  cpuMips: number;
  ramGb: number;
  storageGb: number;
  bandwidthMbps: number;
  region: RegionId;
}

export interface RequestConfig {
  requestCount: number;
  arrivalRate: number; // req/sec
  taskSizeKb: number;
  cpuMipsReq: number;
  memoryMbReq: number;
  deadlineMs: number;
  priority: 'mixed' | 'low' | 'medium' | 'high';
}

export interface UploadedDataset {
  fileName: string;
  rowCount: number;
  colCount: number;
  detectedFields: string[];
  fileSizeKb: number;
  previewRows: Array<Record<string, string | number>>;
}

export interface SimulationConfig {
  edge: EdgeConfig;
  cloud: CloudConfig;
  request: RequestConfig;
  dataset?: UploadedDataset | null;
  model1: AlgorithmId;
  model2: AlgorithmId;
}

export interface TaskDecision {
  location: string;
  isEdge: boolean;
  latencyMs: number;
  energyKwh: number;
  carbonKg: number;
  success: boolean;
  queueDelayMs: number;
  transmissionDelayMs: number;
  executionDelayMs: number;
  predictedIntensity?: number;
  actualIntensity?: number;
}

export interface RequestTrace {
  id: string;
  index: number;
  arrivalTimeMs: number;
  cpuMips: number;
  memoryMb: number;
  deadlineMs: number;
  priority: string;
  model1Decision: TaskDecision;
  model2Decision: TaskDecision;
}

export interface DistributionItem {
  name: string;
  count: number;
  percentage: number;
  color?: string;
}

export interface TimeSeriesPoint {
  timeLabel: string;
  requestVolume: number;
  carbonIntensity: number; // gCO2/kWh
  model1Latency: number;
  model2Latency: number;
  model1EdgeTasks: number;
  model1CloudTasks: number;
  model2EdgeTasks: number;
  model2CloudTasks: number;
}

export interface ModelMetrics {
  algorithmId: AlgorithmId;
  algorithmName: string;
  isProposed: boolean;
  avgLatencyMs: number;
  p95LatencyMs: number;
  totalEnergyKwh: number;
  totalCarbonKg: number;
  successRatePct: number;
  edgeUtilizationPct: number;
  cloudUtilizationPct: number;
  distribution: DistributionItem[];
}

export interface SimulationResult {
  id: string;
  timestamp: string;
  config: SimulationConfig;
  model1Metrics: ModelMetrics;
  model2Metrics: ModelMetrics;
  winnerModel: 1 | 2 | 'tie';
  carbonReductionPct: number; // positive means Model 2 saved carbon compared to Model 1
  energyReductionPct: number;
  latencyReductionPct: number; // positive means Model 2 had lower latency
  successRateDeltaPct: number;
  timeSeries: TimeSeriesPoint[];
  traces: RequestTrace[];
  keyTakeaway: string;
  recommendation: string;
}
