/**
 * algorithms.ts
 * Implementations of DWPA and the 6 comparison algorithms.
 * All algorithms share the same slot-based execution structure and deterministic inputs.
 */

import { AlgorithmInfo, AlgorithmType, SimConfig, PeerFlowRecord, CloudFlowRecord } from './types';
import {
  BITS_PER_GB,
  dbmToWatts,
  computeXi,
  computeShannonRate,
  computeCarbonGrams,
  solveP1a,
  solveP1b,
  solveP2Alternating,
  solveP3Alternating
} from './dwpa';

export const ALGORITHM_REGISTRY: Record<AlgorithmType, AlgorithmInfo> = {
  DWPA: {
    id: 'DWPA',
    name: 'DWPA (Reactive Baseline)',
    description: 'Dynamic Workload Power Allocation via Lyapunov optimization with joint horizontal & vertical offloading (online reactive, no forecasting).',
    approximate: false,
    notes: 'Paper algorithm (Algorithm 1): online reactive adaptation using current queues and CI EMA.'
  },
  'Forecast-Driven': {
    id: 'Forecast-Driven',
    name: 'Forecast-Driven Carbon-Aware ★ (Proposed)',
    description: 'Joint horizontal & vertical offloading using ML 1-step-ahead forecasts of regional carbon intensity and workload arrivals.',
    approximate: false,
    notes: 'Proposed predictive extension: optimizes offloading and CPU frequency using ML forecasted carbon curves and anticipated queues.'
  },
  'Local-First': {
    id: 'Local-First',
    name: 'Local-First Baseline',
    description: 'Processes all work locally; offloads to cloud only when queue exceeds threshold. Uses queue-clearing frequency.',
    approximate: false,
    notes: 'Paper baseline: conservative local computing, rarely sends to cloud, no peer offloading.'
  },
  'Vertical-Only': {
    id: 'Vertical-Only',
    name: 'Vertical-Only (No Peers)',
    description: 'Offloads vertically to cloud only; peer offloading disabled. Uses queue-clearing frequency and dynamic CI.',
    approximate: false,
    notes: 'Paper variant: highlights the crucial benefit of peer offloading.'
  },
  'Horizontal-First': {
    id: 'Horizontal-First',
    name: 'Horizontal-First',
    description: 'Permits vertical offloading to the cloud only when peer offloading is impossible this slot.',
    approximate: false,
    notes: 'Paper variant: prioritizes peer offloading before cloud.'
  },
  'ICSOC-19': {
    id: 'ICSOC-19',
    name: 'ICSOC-19 (Greedy CI)',
    description: 'Offloads workload to the server with the lowest carbon intensity, disregarding queue backlogs.',
    approximate: true,
    notes: 'Approximation based on the paper description of Lai et al. (2019).'
  },
  'DOLA-22': {
    id: 'DOLA-22',
    name: 'DOLA-22 (Queue-Balancing)',
    description: 'Allocates workload in proportion to queue backlogs to equalize queue lengths, carbon-blind.',
    approximate: true,
    notes: 'Approximation based on the paper description of Huang et al. (2022).'
  },
  'YCL-24': {
    id: 'YCL-24',
    name: 'YCL-24 (Static CI)',
    description: 'Makes all frequency and vertical offloading decisions using static mean CI; accounted with real hourly CI.',
    approximate: true,
    notes: 'Approximation based on the paper description of Yang et al. (2024).'
  }
};

export interface NodeSimContext {
  city: string;
  region: string;
  fMaxHz: number;
  fcMaxHz: number;
  xiEdge: number;
  xiCloud: number;
  fullLoadPowerWatts: number;
  bandwidthMbps: number;
  meanCiStatic: number;
}

export interface StepOutput {
  edgeQueues: Record<string, number>;
  cloudQueues: Record<string, number>;
  edgeBuffers: Record<string, number>;
  cloudBuffers: Record<string, number>;
  edgeFrequencies: Record<string, number>;
  cloudFrequencies: Record<string, number>;
  edgeProcessedGb: Record<string, number>;
  cloudProcessedGb: Record<string, number>;
  edgeCarbonGrams: Record<string, number>;
  cloudCarbonGrams: Record<string, number>;
  peerTxCarbonGrams: Record<string, number>;
  cloudTxCarbonGrams: Record<string, number>;
  slotCarbonGrams: number;
  peerFlows: PeerFlowRecord[];
  cloudFlows: CloudFlowRecord[];
}

/**
 * Execute one time slot for the selected algorithm.
 */
export function executeSlotStep(
  algorithm: AlgorithmType,
  config: SimConfig,
  nodeContexts: Record<string, NodeSimContext>,
  cloudMeanCiStatic: number,
  // Current state at start of slot
  edgeQueues: Record<string, number>,
  cloudQueues: Record<string, number>,
  edgeBuffers: Record<string, number>,
  cloudBuffers: Record<string, number>,
  arrivalsGb: Record<string, number>,
  currentK: Record<string, number>,
  currentKCloud: number,
  predictedK?: Record<string, number>,
  predictedKCloud?: number,
  predictedArrivalsGb?: Record<string, number>
): StepOutput {
  const cities = config.selectedCities;
  const slotSec = config.slotLengthHours * 3600;
  const tOff = slotSec * config.tOffRatio.value;
  const tCmp = slotSec * (1 - config.tOffRatio.value);
  const pMax = config.pMax.value;
  const N0 = dbmToWatts(config.n0Dbm.value);
  const W = config.bandwidthW.value;
  const g = config.channelGainG.value;
  const V = config.v.value;
  const phi = config.phi.value;

  // Decision carbon intensity: Forecast-Driven uses predictedK, others use currentK
  const decK: Record<string, number> = {};
  for (const c of cities) {
    decK[c] = (algorithm === 'Forecast-Driven' && predictedK?.[c] !== undefined)
      ? predictedK[c]
      : currentK[c];
  }
  const decKCloud = (algorithm === 'Forecast-Driven' && predictedKCloud !== undefined)
    ? predictedKCloud
    : currentKCloud;

  // Clone queues and buffers
  const Q: Record<string, number> = {};
  const Qc: Record<string, number> = {};
  const nextEdgeBuffers: Record<string, number> = {};
  const nextCloudBuffers: Record<string, number> = {};

  // Step 1: Buffer joins the queues (Paper Alg 1 Line 1, Line 4)
  for (const c of cities) {
    Q[c] = (edgeQueues[c] || 0) + (arrivalsGb[c] || 0) + (edgeBuffers[c] || 0);
    Qc[c] = (cloudQueues[c] || 0) + (cloudBuffers[c] || 0);
    nextEdgeBuffers[c] = 0;
    nextCloudBuffers[c] = 0;
  }

  const edgeFrequencies: Record<string, number> = {};
  const cloudFrequencies: Record<string, number> = {};
  const edgeProcessedGb: Record<string, number> = {};
  const cloudProcessedGb: Record<string, number> = {};
  const edgeCarbonGrams: Record<string, number> = {};
  const cloudCarbonGrams: Record<string, number> = {};
  const peerTxCarbonGrams: Record<string, number> = {};
  const cloudTxCarbonGrams: Record<string, number> = {};
  const peerFlows: PeerFlowRecord[] = [];
  const cloudFlows: CloudFlowRecord[] = [];

  for (const c of cities) {
    edgeProcessedGb[c] = 0;
    cloudProcessedGb[c] = 0;
    edgeCarbonGrams[c] = 0;
    cloudCarbonGrams[c] = 0;
    peerTxCarbonGrams[c] = 0;
    cloudTxCarbonGrams[c] = 0;
  }

  // --- Step 2 & 3: Local Edge Computing (P1a) ---
  // Fix 1: Local-First, ICSOC-19, DOLA-22, Horizontal-First and Vertical-Only must not run at f_max
  // when queue is small. For these, use only the frequency needed to clear the queue: f = min(f_max, Q * phi / T_cmp).
  // Only DWPA uses P1a closed form with dynamic CI. YCL-24 uses P1a with static mean CI.
  for (const c of cities) {
    const ctx = nodeContexts[c];
    let fStar = 0;

    const qBits = Q[c] * BITS_PER_GB;
    const fNeeded = tCmp > 0 ? (qBits * phi) / tCmp : 0;

    if (algorithm === 'DWPA' || algorithm === 'Vertical-Only' || algorithm === 'Horizontal-First') {
      fStar = solveP1a(qBits, V, currentK[c], ctx.xiEdge, phi, ctx.fMaxHz, tCmp);
    } else if (algorithm === 'Forecast-Driven') {
      // Forecast-Driven uses 1-step-ahead ML forecasted carbon intensity to optimize frequency
      fStar = solveP1a(qBits, V, decK[c], ctx.xiEdge, phi, ctx.fMaxHz, tCmp);
    } else if (algorithm === 'YCL-24') {
      // YCL-24 makes frequency decision using static mean CI, capped at fNeeded and fMax
      fStar = solveP1a(qBits, V, ctx.meanCiStatic, ctx.xiEdge, phi, ctx.fMaxHz, tCmp);
    } else {
      // Local-First, ICSOC-19, DOLA-22:
      // Run only at the frequency needed to clear the queue: f = min(f_max, Q * phi / T_cmp)
      fStar = Math.min(ctx.fMaxHz, fNeeded);
    }

    edgeFrequencies[c] = fStar;

    // Processed volume in GB: EC = min(Q, (f * T_cmp) / (phi * BITS_PER_GB))
    const maxCapacityGb = (fStar * tCmp) / (phi * BITS_PER_GB);
    const ecGb = Math.max(0, Math.min(Q[c], maxCapacityGb));

    edgeProcessedGb[c] = ecGb;
    Q[c] = Math.max(0, Q[c] - ecGb);
    if (Q[c] < 1e-12) Q[c] = 0;

    // Power and carbon charged ONLY for frequency actually used
    let pWatts = 0;
    if (fStar > 0) {
      if (config.usePaperPreset) {
        pWatts = 1e-18 * Math.pow(fStar, 3);
      } else {
        pWatts = ctx.xiEdge * Math.pow(fStar, 3);
      }
    }
    // Carbon is accounted with real hourly intensity (currentK[c])
    edgeCarbonGrams[c] = computeCarbonGrams(pWatts, tCmp, currentK[c]);
  }

  // --- Step 4 & 5 & 6: Cloud Computing (P1b) ---
  for (const c of cities) {
    const ctx = nodeContexts[c];
    let fcStar = 0;

    const qcBits = Qc[c] * BITS_PER_GB;
    const fcNeeded = tCmp > 0 ? (qcBits * phi) / tCmp : 0;

    if (algorithm === 'DWPA' || algorithm === 'Vertical-Only' || algorithm === 'Horizontal-First') {
      fcStar = solveP1b(qcBits, V, currentKCloud, ctx.xiCloud, phi, ctx.fcMaxHz, tCmp);
    } else if (algorithm === 'Forecast-Driven') {
      fcStar = solveP1b(qcBits, V, decKCloud, ctx.xiCloud, phi, ctx.fcMaxHz, tCmp);
    } else if (algorithm === 'YCL-24') {
      fcStar = solveP1b(qcBits, V, cloudMeanCiStatic, ctx.xiCloud, phi, ctx.fcMaxHz, tCmp);
    } else {
      // Baselines: run only at frequency needed to clear cloud queue
      fcStar = Math.min(ctx.fcMaxHz, fcNeeded);
    }

    cloudFrequencies[c] = fcStar;

    const maxCloudCapGb = (fcStar * tCmp) / (phi * BITS_PER_GB);
    const ccGb = Math.max(0, Math.min(Qc[c], maxCloudCapGb));

    cloudProcessedGb[c] = ccGb;
    Qc[c] = Math.max(0, Qc[c] - ccGb);
    if (Qc[c] < 1e-12) Qc[c] = 0;

    let pWatts = 0;
    if (fcStar > 0) {
      if (config.usePaperPreset) {
        pWatts = 1e-18 * Math.pow(fcStar, 3);
      } else {
        pWatts = ctx.xiCloud * Math.pow(fcStar, 3);
      }
    }
    cloudCarbonGrams[c] = computeCarbonGrams(pWatts, tCmp, currentKCloud);
  }

  // --- Step 7-10: Peer Offloading (P2) ---
  // Fix 2: Track whether peer offloading was possible this slot for each node
  // A node's peer offloading is impossible iff all candidate peers had Q_j >= Q_i or a >= b.
  const peerOffloadPossible: Record<string, boolean> = {};
  for (const c of cities) peerOffloadPossible[c] = false;

  const peerOffloadedTotal: Record<string, number> = {};
  for (const c of cities) peerOffloadedTotal[c] = 0;

  if (algorithm === 'DWPA' || algorithm === 'Forecast-Driven' || algorithm === 'Horizontal-First') {
    for (const i of cities) {
      if (Q[i] <= 1e-12) continue;

      const maxRateBps = nodeContexts[i].bandwidthMbps * 1e6;
      const candidatePeers: Array<{
        j: string;
        benefit: number;
        pWatts: number;
        rateBps: number;
        maxTxGb: number;
      }> = [];

      for (const j of cities) {
        if (i === j) continue;
        const effQj = Q[j] + nextEdgeBuffers[j];

        // In predictive mode, anticipate incoming workload on peers and local node
        const antQi = algorithm === 'Forecast-Driven' ? Q[i] + 0.3 * (predictedArrivalsGb?.[i] ?? 0) : Q[i];
        const antQj = algorithm === 'Forecast-Driven' ? effQj + 0.3 * (predictedArrivalsGb?.[j] ?? 0) : effQj;
        if (antQj >= antQi) continue; // One-way offload from higher to lower effective queue

        const qBitsI = Q[i] * BITS_PER_GB;
        const qBitsJ = effQj * BITS_PER_GB;

        const res = solveP2Alternating(
          qBitsI,
          qBitsJ,
          V,
          decK[i],
          W,
          tOff,
          g,
          N0,
          pMax,
          qBitsI,
          20,
          maxRateBps
        );

        if (res.xBits > 1e-6 && res.rateBps > 0) {
          peerOffloadPossible[i] = true;
          const a = (V * decK[i] * res.pWatts) / res.rateBps;
          const b = qBitsI - qBitsJ;

          // In predictive mode: bonus if peer is forecast to have cleaner energy than local node
          let carbonDiffBonus = 0;
          if (algorithm === 'Forecast-Driven') {
            const deltaK = decK[i] - decK[j];
            if (deltaK > 0) {
              carbonDiffBonus = V * deltaK * 1e-12 * BITS_PER_GB;
            }
          }

          const netBenefit = b - a + carbonDiffBonus; // Marginal Lyapunov drift reduction per bit

          if (netBenefit > 0) {
            const maxVolGb = Math.min(res.xBits / BITS_PER_GB, (Q[i] - effQj) / 2);
            if (maxVolGb > 1e-6) {
              candidatePeers.push({
                j,
                benefit: netBenefit,
                pWatts: res.pWatts,
                rateBps: res.rateBps,
                maxTxGb: maxVolGb
              });
            }
          }
        }
      }

      // Sort candidate peers by marginal benefit (steepest descent first)
      candidatePeers.sort((a, b) => b.benefit - a.benefit);

      // Allocate queue to candidate peers in order of highest benefit
      for (const cand of candidatePeers) {
        if (Q[i] <= 1e-12) break;
        const effQj = Q[cand.j] + nextEdgeBuffers[cand.j];
        if (effQj >= Q[i]) continue;

        const maxBalanced = (Q[i] - effQj) / 2;
        const finalXGb = Math.min(cand.maxTxGb, maxBalanced, Q[i]);
        if (finalXGb <= 1e-6) continue;

        Q[i] = Math.max(0, Q[i] - finalXGb);
        if (Q[i] < 1e-12) Q[i] = 0;

        nextEdgeBuffers[cand.j] += finalXGb;
        peerOffloadedTotal[i] += finalXGb;

        const bits = finalXGb * BITS_PER_GB;
        const txSec = cand.rateBps > 0 ? Math.min(tOff, bits / cand.rateBps) : 0;
        const carbon = computeCarbonGrams(cand.pWatts, txSec, currentK[i]);

        peerTxCarbonGrams[i] += carbon;
        peerFlows.push({
          from: i,
          to: cand.j,
          volumeGb: finalXGb,
          powerWatts: cand.pWatts,
          rateBps: cand.rateBps,
          txDurationSec: txSec,
          carbonGrams: carbon
        });
      }
    }
  } else if (algorithm === 'ICSOC-19') {
    // Greedy: check if another peer has lower CI than local
    for (const i of cities) {
      if (Q[i] <= 1e-12) continue;
      let minCi = currentK[i];
      let bestPeer: string | null = null;

      for (const j of cities) {
        if (i === j) continue;
        if (currentK[j] < minCi && currentK[j] <= currentKCloud) {
          minCi = currentK[j];
          bestPeer = j;
        }
      }

      if (bestPeer) {
        const effQj = Q[bestPeer] + nextEdgeBuffers[bestPeer];
        if (effQj < Q[i]) {
          const maxRateBps = nodeContexts[i].bandwidthMbps * 1e6;
          const shannon = computeShannonRate(W, g, pMax, N0);
          const rate = Math.min(shannon, maxRateBps);
          const maxTxGb = (rate * tOff) / BITS_PER_GB;
          const maxBalanced = (Q[i] - effQj) / 2;
          const xGb = Math.min(Q[i], maxBalanced, maxTxGb);

          if (xGb > 1e-6) {
            Q[i] = Math.max(0, Q[i] - xGb);
            if (Q[i] < 1e-12) Q[i] = 0;

            nextEdgeBuffers[bestPeer] += xGb;
            peerOffloadedTotal[i] += xGb;
            peerOffloadPossible[i] = true;

            const txSec = Math.min(tOff, (xGb * BITS_PER_GB) / rate);
            const carbon = computeCarbonGrams(pMax, txSec, currentK[i]);
            peerTxCarbonGrams[i] += carbon;

            peerFlows.push({
              from: i,
              to: bestPeer,
              volumeGb: xGb,
              powerWatts: pMax,
              rateBps: rate,
              txDurationSec: txSec,
              carbonGrams: carbon
            });
          }
        }
      }
    }
  } else if (algorithm === 'DOLA-22') {
    // Carbon-blind queue balancing across peers
    for (const i of cities) {
      if (Q[i] <= 1e-12) continue;
      for (const j of cities) {
        if (i === j) continue;
        const effQj = Q[j] + nextEdgeBuffers[j];
        if (Q[i] > effQj + 1.0) {
          const diffGb = (Q[i] - effQj) / 2;
          const maxRateBps = nodeContexts[i].bandwidthMbps * 1e6;
          const shannon = computeShannonRate(W, g, pMax, N0);
          const rate = Math.min(shannon, maxRateBps);
          const maxTxGb = (rate * tOff) / BITS_PER_GB;
          const xGb = Math.min(Q[i], diffGb, maxTxGb);

          if (xGb > 1e-6) {
            Q[i] = Math.max(0, Q[i] - xGb);
            if (Q[i] < 1e-12) Q[i] = 0;

            nextEdgeBuffers[j] += xGb;
            peerOffloadedTotal[i] += xGb;
            peerOffloadPossible[i] = true;

            const txSec = Math.min(tOff, (xGb * BITS_PER_GB) / rate);
            const carbon = computeCarbonGrams(pMax, txSec, currentK[i]);
            peerTxCarbonGrams[i] += carbon;

            peerFlows.push({
              from: i,
              to: j,
              volumeGb: xGb,
              powerWatts: pMax,
              rateBps: rate,
              txDurationSec: txSec,
              carbonGrams: carbon
            });
          }
        }
      }
    }
  }

  // --- Step 12-15: Cloud Vertical Offloading (P3) ---
  for (const i of cities) {
    if (Q[i] <= 1e-12) continue;

    const maxRateBps = nodeContexts[i].bandwidthMbps * 1e6;

    if (algorithm === 'DWPA' || algorithm === 'Forecast-Driven' || algorithm === 'Vertical-Only') {
      const effQc = Qc[i] + nextCloudBuffers[i];
      const antQi = algorithm === 'Forecast-Driven' ? Q[i] + 0.3 * (predictedArrivalsGb?.[i] ?? 0) : Q[i];
      if (effQc < antQi) {
        const qBits = Q[i] * BITS_PER_GB;
        const qcBits = effQc * BITS_PER_GB;

        const res = solveP3Alternating(
          qBits,
          qcBits,
          V,
          decK[i],
          W,
          tOff,
          g,
          N0,
          pMax,
          qBits,
          20,
          maxRateBps
        );

        const xGb = Math.min(res.xBits / BITS_PER_GB, (Q[i] - effQc) / 2, Q[i]);
        if (xGb > 1e-6) {
          Q[i] = Math.max(0, Q[i] - xGb);
          if (Q[i] < 1e-12) Q[i] = 0;

          nextCloudBuffers[i] += xGb;

          const txSec = res.rateBps > 0 ? Math.min(tOff, (xGb * BITS_PER_GB) / res.rateBps) : 0;
          const carbon = computeCarbonGrams(res.pWatts, txSec, currentK[i]);
          cloudTxCarbonGrams[i] += carbon;

          cloudFlows.push({
            from: i,
            volumeGb: xGb,
            powerWatts: res.pWatts,
            rateBps: res.rateBps,
            txDurationSec: txSec,
            carbonGrams: carbon
          });
        }
      }
    } else if (algorithm === 'Horizontal-First') {
      // Fix 2: Vertical offloading allowed ONLY for a node whose peer offloading was impossible this slot
      // (all candidate peers had Q_j >= Q_i or a >= b).
      // If peer offloading was possible, node i is NOT allowed to offload vertically!
      if (!peerOffloadPossible[i]) {
        const effQc = Qc[i] + nextCloudBuffers[i];
        if (effQc < Q[i]) {
          const qBits = Q[i] * BITS_PER_GB;
          const qcBits = effQc * BITS_PER_GB;

          const res = solveP3Alternating(
            qBits,
            qcBits,
            V,
            currentK[i],
            W,
            tOff,
            g,
            N0,
            pMax,
            qBits,
            20,
            maxRateBps
          );

          const xGb = Math.min(res.xBits / BITS_PER_GB, (Q[i] - effQc) / 2, Q[i]);
          if (xGb > 1e-6) {
            Q[i] = Math.max(0, Q[i] - xGb);
            if (Q[i] < 1e-12) Q[i] = 0;

            nextCloudBuffers[i] += xGb;

            const txSec = res.rateBps > 0 ? Math.min(tOff, (xGb * BITS_PER_GB) / res.rateBps) : 0;
            const carbon = computeCarbonGrams(res.pWatts, txSec, currentK[i]);
            cloudTxCarbonGrams[i] += carbon;

            cloudFlows.push({
              from: i,
              volumeGb: xGb,
              powerWatts: res.pWatts,
              rateBps: res.rateBps,
              txDurationSec: txSec,
              carbonGrams: carbon
            });
          }
        }
      }
    } else if (algorithm === 'YCL-24') {
      // Fix 3: YCL-24 makes offloading decision using static mean CI (nodeContexts[i].meanCiStatic),
      // while carbon is accounted with the real hourly intensity (currentK[i]).
      const effQc = Qc[i] + nextCloudBuffers[i];
      if (effQc < Q[i]) {
        const qBits = Q[i] * BITS_PER_GB;
        const qcBits = effQc * BITS_PER_GB;

        const res = solveP3Alternating(
          qBits,
          qcBits,
          V,
          nodeContexts[i].meanCiStatic,
          W,
          tOff,
          g,
          N0,
          pMax,
          qBits,
          20,
          maxRateBps
        );

        const xGb = Math.min(res.xBits / BITS_PER_GB, (Q[i] - effQc) / 2, Q[i]);
        if (xGb > 1e-6) {
          Q[i] = Math.max(0, Q[i] - xGb);
          if (Q[i] < 1e-12) Q[i] = 0;

          nextCloudBuffers[i] += xGb;

          const txSec = res.rateBps > 0 ? Math.min(tOff, (xGb * BITS_PER_GB) / res.rateBps) : 0;
          const carbon = computeCarbonGrams(res.pWatts, txSec, currentK[i]); // Real CI accounting
          cloudTxCarbonGrams[i] += carbon;

          cloudFlows.push({
            from: i,
            volumeGb: xGb,
            powerWatts: res.pWatts,
            rateBps: res.rateBps,
            txDurationSec: txSec,
            carbonGrams: carbon
          });
        }
      }
    } else if (algorithm === 'Local-First') {
      // Offload to cloud if remaining Q[i] > 0
      const effQc = Qc[i] + nextCloudBuffers[i];
      if (effQc < Q[i]) {
        const shannon = computeShannonRate(W, g, pMax, N0);
        const rate = Math.min(shannon, maxRateBps);
        const maxTxGb = (rate * tOff) / BITS_PER_GB;
        const maxBalanced = (Q[i] - effQc) / 2;
        const xGb = Math.min(Q[i], maxBalanced, maxTxGb);

        if (xGb > 1e-6) {
          Q[i] = Math.max(0, Q[i] - xGb);
          if (Q[i] < 1e-12) Q[i] = 0;

          nextCloudBuffers[i] += xGb;

          const txSec = Math.min(tOff, (xGb * BITS_PER_GB) / rate);
          const carbon = computeCarbonGrams(pMax, txSec, currentK[i]);
          cloudTxCarbonGrams[i] += carbon;

          cloudFlows.push({
            from: i,
            volumeGb: xGb,
            powerWatts: pMax,
            rateBps: rate,
            txDurationSec: txSec,
            carbonGrams: carbon
          });
        }
      }
    } else if (algorithm === 'ICSOC-19') {
      if (currentKCloud < currentK[i]) {
        const effQc = Qc[i] + nextCloudBuffers[i];
        if (effQc < Q[i]) {
          const shannon = computeShannonRate(W, g, pMax, N0);
          const rate = Math.min(shannon, maxRateBps);
          const maxTxGb = (rate * tOff) / BITS_PER_GB;
          const maxBalanced = (Q[i] - effQc) / 2;
          const xGb = Math.min(Q[i], maxBalanced, maxTxGb);

          if (xGb > 1e-6) {
            Q[i] = Math.max(0, Q[i] - xGb);
            if (Q[i] < 1e-12) Q[i] = 0;

            nextCloudBuffers[i] += xGb;

            const txSec = Math.min(tOff, (xGb * BITS_PER_GB) / rate);
            const carbon = computeCarbonGrams(pMax, txSec, currentK[i]);
            cloudTxCarbonGrams[i] += carbon;

            cloudFlows.push({
              from: i,
              volumeGb: xGb,
              powerWatts: pMax,
              rateBps: rate,
              txDurationSec: txSec,
              carbonGrams: carbon
            });
          }
        }
      }
    } else if (algorithm === 'DOLA-22') {
      const effQc = Qc[i] + nextCloudBuffers[i];
      if (Q[i] > effQc + 1.0) {
        const diffGb = (Q[i] - effQc) / 2;
        const shannon = computeShannonRate(W, g, pMax, N0);
        const rate = Math.min(shannon, maxRateBps);
        const maxTxGb = (rate * tOff) / BITS_PER_GB;
        const xGb = Math.min(Q[i], diffGb, maxTxGb);

        if (xGb > 1e-6) {
          Q[i] = Math.max(0, Q[i] - xGb);
          if (Q[i] < 1e-12) Q[i] = 0;

          nextCloudBuffers[i] += xGb;

          const txSec = Math.min(tOff, (xGb * BITS_PER_GB) / rate);
          const carbon = computeCarbonGrams(pMax, txSec, currentK[i]);
          cloudTxCarbonGrams[i] += carbon;

          cloudFlows.push({
            from: i,
            volumeGb: xGb,
            powerWatts: pMax,
            rateBps: rate,
            txDurationSec: txSec,
            carbonGrams: carbon
          });
        }
      }
    }
  }

  // Calculate total slot carbon emission
  let totalSlotCarbon = 0;
  for (const c of cities) {
    totalSlotCarbon += edgeCarbonGrams[c];
    totalSlotCarbon += cloudCarbonGrams[c];
    totalSlotCarbon += peerTxCarbonGrams[c];
    totalSlotCarbon += cloudTxCarbonGrams[c];
  }

  return {
    edgeQueues: Q,
    cloudQueues: Qc,
    edgeBuffers: nextEdgeBuffers,
    cloudBuffers: nextCloudBuffers,
    edgeFrequencies,
    cloudFrequencies,
    edgeProcessedGb,
    cloudProcessedGb,
    edgeCarbonGrams,
    cloudCarbonGrams,
    peerTxCarbonGrams,
    cloudTxCarbonGrams,
    slotCarbonGrams: totalSlotCarbon,
    peerFlows,
    cloudFlows
  };
}
