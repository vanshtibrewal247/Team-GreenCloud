import defaultTraceData from '../ProjectApplication/src/data/trace.json';
import { runSimulation, createDefaultConfig, TraceData } from '../ProjectApplication/src/sim';

const td = defaultTraceData as unknown as TraceData;
const cfg = createDefaultConfig(td);

console.log('Running DWPA (Reactive)...');
const dwpa = runSimulation(cfg, 'DWPA', td);

console.log('Running Forecast-Driven (Predictive)...');
const pred = runSimulation(cfg, 'Forecast-Driven', td);

console.log('\n================ COMPARISON RESULTS ================');
console.log('Metric                     | DWPA (Reactive) | Forecast-Driven (Proposed) | Difference');
console.log('---------------------------|-----------------|----------------------------|------------');

const cDiff = pred.totalCarbonKg - dwpa.totalCarbonKg;
const cPct = ((cDiff / dwpa.totalCarbonKg) * 100).toFixed(2);
console.log(`Total Carbon (kg CO2)      | ${dwpa.totalCarbonKg.toFixed(2).padStart(15)} | ${pred.totalCarbonKg.toFixed(2).padStart(26)} | ${(cPct + '%').padStart(10)}`);

const qDiff = pred.avgQueueGb - dwpa.avgQueueGb;
const qPct = ((qDiff / dwpa.avgQueueGb) * 100).toFixed(2);
console.log(`Avg Queue (GB)             | ${dwpa.avgQueueGb.toFixed(2).padStart(15)} | ${pred.avgQueueGb.toFixed(2).padStart(26)} | ${(qPct + '%').padStart(10)}`);

console.log(`Peak Queue (GB)            | ${dwpa.peakQueueGb.toFixed(2).padStart(15)} | ${pred.peakQueueGb.toFixed(2).padStart(26)} | ${(pred.peakQueueGb - dwpa.peakQueueGb).toFixed(2).padStart(10)}`);

console.log(`Carbon per GB (g/GB)       | ${dwpa.carbonPerGbProcessed.toFixed(2).padStart(15)} | ${pred.carbonPerGbProcessed.toFixed(2).padStart(26)} | ${(pred.carbonPerGbProcessed - dwpa.carbonPerGbProcessed).toFixed(2).padStart(10)}`);

console.log(`Edge Processed (GB)        | ${dwpa.edgeProcessedGb.toFixed(2).padStart(15)} | ${pred.edgeProcessedGb.toFixed(2).padStart(26)} | ${(pred.edgeProcessedGb - dwpa.edgeProcessedGb).toFixed(2).padStart(10)}`);

console.log(`Cloud Processed (GB)       | ${dwpa.cloudProcessedGb.toFixed(2).padStart(15)} | ${pred.cloudProcessedGb.toFixed(2).padStart(26)} | ${(pred.cloudProcessedGb - dwpa.cloudProcessedGb).toFixed(2).padStart(10)}`);

console.log(`Edge Utilization           | ${(dwpa.avgEdgeUtilization * 100).toFixed(1)}%          | ${(pred.avgEdgeUtilization * 100).toFixed(1)}%                       |`);

// Calculate total peer offloading by summing over slots
let dwpaPeerGb = 0;
let predPeerGb = 0;
for (const s of dwpa.slots) {
  for (const f of s.peerFlows) dwpaPeerGb += f.volumeGb;
}
for (const s of pred.slots) {
  for (const f of s.peerFlows) predPeerGb += f.volumeGb;
}
console.log(`Peer Offloaded (GB)        | ${dwpaPeerGb.toFixed(2).padStart(15)} | ${predPeerGb.toFixed(2).padStart(26)} | ${(predPeerGb - dwpaPeerGb).toFixed(2).padStart(10)}`);
