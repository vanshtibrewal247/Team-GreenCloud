import defaultTraceData from '../ProjectApplication/src/data/trace.json';
import { runSimulation, createDefaultConfig, TraceData } from '../ProjectApplication/src/sim';

const td = defaultTraceData as unknown as TraceData;
const cfg = createDefaultConfig(td);
const pred = runSimulation(cfg, 'Forecast-Driven', td);

const slot149 = pred.slots[148]; // slot 149
console.log('Slot 149 details:');
console.log('Hour start:', slot149.hourStart);
for (const city of cfg.selectedCities) {
  console.log(
    city.padEnd(16),
    'Q:', slot149.edgeQueues[city].toFixed(2),
    'Freq GHz:', (slot149.edgeFrequencies[city] / 1e9).toFixed(2),
    'CI:', slot149.carbonIntensities[city].toFixed(0),
    'Processed GB:', (slot149.edgeProcessedGb[city] || 0).toFixed(1)
  );
}
console.log('\nPeer flows in slot 149:');
for (const f of slot149.peerFlows) {
  console.log(`  From ${f.from} -> ${f.to}: ${f.volumeGb.toFixed(2)} GB, carbon: ${f.carbonGrams.toFixed(2)} g`);
}
console.log('\nCloud flows in slot 149:');
for (const f of slot149.cloudFlows) {
  console.log(`  From ${f.from} -> Cloud: ${f.volumeGb.toFixed(2)} GB, carbon: ${f.carbonGrams.toFixed(2)} g`);
}
