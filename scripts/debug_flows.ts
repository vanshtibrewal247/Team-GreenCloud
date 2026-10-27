import defaultTraceData from '../ProjectApplication/src/data/trace.json';
import { createDefaultConfig, runSimulation, TraceData } from '../ProjectApplication/src/sim';

const trace = defaultTraceData as unknown as TraceData;
const config = createDefaultConfig(trace);
const oneSlotMeanArrivals = trace.total_workload_gb / trace.num_hours; // ~261.69 GB
const target = 0.15 * oneSlotMeanArrivals; // ~39.25 GB

console.log('Target backlog (15% of slot arrivals):', target.toFixed(2), 'GB');

for (const exp of [0, 2, 4, 6, 8, 10, 11, 12, 13, 14]) {
  const v = Math.pow(10, exp);
  config.v.value = v;
  const res = runSimulation(config, 'DWPA', trace);
  let totalBacklog = 0;
  let totalPeer = 0;
  let totalCloud = 0;
  for (const s of res.slots) {
    for (const c of config.selectedCities) {
      totalBacklog += s.edgeQueues[c] + s.cloudQueues[c] + s.edgeBuffers[c] + s.cloudBuffers[c];
    }
  }
  for (const c of config.selectedCities) {
    totalPeer += res.nodeMetrics[c].peerSentGb;
    totalCloud += res.nodeMetrics[c].cloudSentGb;
  }
  const avgBacklog = totalBacklog / res.numSlots;
  const pct = (avgBacklog / oneSlotMeanArrivals) * 100;
  console.log(`V = 1e${exp.toString().padEnd(2)} | Carbon: ${res.totalCarbonKg.toFixed(2).padStart(8)} kg | Avg Backlog: ${avgBacklog.toFixed(2).padStart(7)} GB (${pct.toFixed(1).padStart(5)}%) | PeerSent: ${totalPeer.toFixed(1).padStart(9)} GB`);
}
