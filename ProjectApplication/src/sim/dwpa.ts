/**
 * dwpa.ts
 * Mathematical subproblems, closed-form formulas, and solvers for the DWPA algorithm.
 * Reference: "Dynamic Carbon-Aware Hybrid Task Offloading for Collaborative Edge-Cloud Computing" (IEEE WCNC 2026)
 */

export const BITS_PER_GB = 8 * 1e9; // 8 Gigabits per GB

/**
 * Convert dBm to Watts: P(W) = 10^((P(dBm) - 30) / 10)
 */
export function dbmToWatts(dbm: number): number {
  return Math.pow(10, (dbm - 30) / 10);
}

/**
 * Compute effective capacitance coefficient xi such that P(f_max) = fullLoadPowerWatts:
 * P = xi * f^3  =>  xi = fullLoadPowerWatts / (f_max^3)
 */
export function computeXi(fullLoadPowerWatts: number, fMaxHz: number): number {
  if (fMaxHz <= 0) return 0;
  return fullLoadPowerWatts / Math.pow(fMaxHz, 3);
}

/**
 * Shannon transmission rate (bits per second):
 * R = W * log2(1 + g * p / N0)
 * @param W bandwidth in Hz
 * @param g channel gain (dimensionless)
 * @param p transmit power in Watts
 * @param N0 noise power in Watts
 */
export function computeShannonRate(W: number, g: number, p: number, N0: number): number {
  if (p <= 0 || W <= 0 || g <= 0 || N0 <= 0) return 0;
  const snr = (g * p) / N0;
  return W * Math.log2(1 + snr);
}

/**
 * Convert energy consumption to operational carbon emission in gCO2:
 * Carbon (gCO2) = (P(Watts) * T(sec) / 3,600,000) * k (gCO2/kWh)
 */
export function computeCarbonGrams(powerWatts: number, durationSec: number, carbonIntensityGPerKwh: number): number {
  if (powerWatts <= 0 || durationSec <= 0 || carbonIntensityGPerKwh <= 0) return 0;
  const energyKwh = (powerWatts * durationSec) / 3600000;
  return energyKwh * carbonIntensityGPerKwh;
}

/**
 * Subproblem P1a: Optimal edge CPU-cycle frequency fi*(t) (Paper Eq. 15)
 * min_{fi} V * ki * xi_i * fi^3 * T_cmp - (Qi * T_cmp * fi) / phi_i
 * Solution: fi* = min( sqrt( Qi_bits / (3 * V * ki * xi_i * phi_i) ), f_max, Qi_bits * phi_i / T_cmp )
 */
export function solveP1a(
  QiBits: number,
  V: number,
  ki: number,
  xi_i: number,
  phi_i: number,
  fMaxHz: number,
  tCmpSec?: number
): number {
  if (QiBits <= 0 || V <= 0 || ki <= 0 || xi_i <= 0 || phi_i <= 0) {
    return 0;
  }
  const denom = 3 * V * ki * xi_i * phi_i;
  let fStar = Math.sqrt(QiBits / denom);
  if (tCmpSec && tCmpSec > 0) {
    const fNeeded = (QiBits * phi_i) / tCmpSec;
    fStar = Math.min(fStar, fNeeded);
  }
  return Math.min(Math.max(0, fStar), fMaxHz);
}

/**
 * Subproblem P1b: Optimal cloud CPU-cycle frequency fc_i*(t) for edge node i's cloud queue (Paper Eq. 16)
 * min_{fc} V * k_cloud * xi_cloud * fc^3 * T_cmp - (Qi_cloud * T_cmp * fc) / phi_cloud
 * Solution: fc* = min( sqrt( Qcloud_bits / (3 * V * k_cloud * xi_cloud * phi_cloud) ), fc_max, Qcloud_bits * phi_cloud / T_cmp )
 */
export function solveP1b(
  QcloudBits: number,
  V: number,
  kCloud: number,
  xiCloud: number,
  phiCloud: number,
  fcMaxHz: number,
  tCmpSec?: number
): number {
  if (QcloudBits <= 0 || V <= 0 || kCloud <= 0 || xiCloud <= 0 || phiCloud <= 0) {
    return 0;
  }
  const denom = 3 * V * kCloud * xiCloud * phiCloud;
  let fcStar = Math.sqrt(QcloudBits / denom);
  if (tCmpSec && tCmpSec > 0) {
    const fcNeeded = (QcloudBits * phiCloud) / tCmpSec;
    fcStar = Math.min(fcStar, fcNeeded);
  }
  return Math.min(Math.max(0, fcStar), fcMaxHz);
}

/**
 * Subproblem P2a: Optimal peer offload volume x_ij*(t) assuming fixed p_ij (Paper Eq. 17)
 * min_{x_ij} ( (V * ki * p_ij / R_ij) + (Qj - Qi) ) * x_ij
 * s.t. 0 <= x_ij <= x_max = min(R_ij * T_off, Qi)
 * Solution: x_ij* = 0 if Qj > Qi or a >= b; else min(R_ij * T_off, Qi)
 * where a = (V * ki * p_ij) / R_ij, b = Qi - Qj
 */
export function solveP2a(
  QiBits: number,
  QjBits: number,
  V: number,
  ki: number,
  p_ij: number,
  R_ij: number,
  tOffSec: number,
  availableQiBits: number
): number {
  if (QjBits >= QiBits || p_ij <= 0 || R_ij <= 0 || tOffSec <= 0 || availableQiBits <= 0) {
    return 0;
  }
  const a = (V * ki * p_ij) / R_ij;
  const b = QiBits - QjBits;
  if (a >= b) {
    return 0;
  }
  const xMax = Math.min(R_ij * tOffSec, availableQiBits, (QiBits - QjBits) / 2);
  return Math.max(0, xMax);
}

/**
 * Subproblem P2b: Optimal peer transmission power p_ij*(t) assuming fixed x_ij (Paper Eq. 18, 19)
 * min_{p_ij} V * ki * p_ij * T_off + (Qj - Qi) * Wi * log2(1 + g_ij * p_ij / N0) * T_off
 * Solution: p* = clip( -b' / (a' * ln2) - c, 0, p_max )
 * where a' = V * ki * T_off, b' = (Qj - Qi) * Wi * T_off, c = N0 / g_ij
 * Note that T_off cancels out: -b' / (a' * ln2) = (Qi - Qj) * Wi / (V * ki * ln 2)
 */
export function solveP2b(
  QiBits: number,
  QjBits: number,
  V: number,
  ki: number,
  WiHz: number,
  g_ij: number,
  N0Watts: number,
  pMaxWatts: number
): number {
  if (QjBits >= QiBits || V <= 0 || ki <= 0 || WiHz <= 0 || g_ij <= 0 || N0Watts <= 0) {
    return 0;
  }
  const c = N0Watts / g_ij;
  const pStar = ((QiBits - QjBits) * WiHz) / (V * ki * Math.LN2) - c;
  return Math.min(Math.max(0, pStar), pMaxWatts);
}

/**
 * Alternating iteration solver for P2 (peer offloading between edge i and edge j)
 * Alternates between P2a (update x_ij) and P2b (update p_ij) until convergence (max 20 iterations).
 */
export function solveP2Alternating(
  QiBits: number,
  QjBits: number,
  V: number,
  ki: number,
  WiHz: number,
  tOffSec: number,
  g_ij: number,
  N0Watts: number,
  pMaxWatts: number,
  availableQiBits: number,
  maxIterations: number = 20,
  maxRateBps?: number
): { xBits: number; pWatts: number; rateBps: number; iterations: number } {
  if (QjBits >= QiBits || availableQiBits <= 0) {
    return { xBits: 0, pWatts: 0, rateBps: 0, iterations: 0 };
  }

  // Initial power guess: midpoint
  let p = Math.min(pMaxWatts, 0.5 * pMaxWatts);
  let x = 0;
  let iters = 0;

  for (let it = 0; it < maxIterations; it++) {
    iters = it + 1;
    const shannonR = computeShannonRate(WiHz, g_ij, p, N0Watts);
    const R = maxRateBps && maxRateBps > 0 ? Math.min(shannonR, maxRateBps) : shannonR;
    const newX = solveP2a(QiBits, QjBits, V, ki, p, R, tOffSec, availableQiBits);

    let newP = 0;
    if (newX > 0) {
      newP = solveP2b(QiBits, QjBits, V, ki, WiHz, g_ij, N0Watts, pMaxWatts);
    }

    const diffX = Math.abs(newX - x);
    const diffP = Math.abs(newP - p);

    x = newX;
    p = newP;

    if (diffX < 1.0 && diffP < 1e-6) {
      break;
    }
  }

  const shannonFinal = computeShannonRate(WiHz, g_ij, p, N0Watts);
  const finalRate = maxRateBps && maxRateBps > 0 ? Math.min(shannonFinal, maxRateBps) : shannonFinal;
  return { xBits: x, pWatts: p, rateBps: finalRate, iterations: iters };
}

/**
 * Subproblem P3a: Optimal cloud offload volume x_cloud*(t) assuming fixed p_cloud (Paper Eq. 20)
 * min_{x_c} ( (V * ki * p_c / R_ic) + (Qcloud - Qi) ) * x_c
 * Solution: x_c* = min(R_ic * T_off, Qi) if (V * ki * p_c / R_ic) < (Qi - Qcloud); else 0
 */
export function solveP3a(
  QiBits: number,
  QcloudBits: number,
  V: number,
  ki: number,
  pCloud: number,
  R_ic: number,
  tOffSec: number,
  availableQiBits: number
): number {
  if (QcloudBits >= QiBits || pCloud <= 0 || R_ic <= 0 || tOffSec <= 0 || availableQiBits <= 0) {
    return 0;
  }
  const a = (V * ki * pCloud) / R_ic;
  const b = QiBits - QcloudBits;
  if (a >= b) {
    return 0;
  }
  const xMax = Math.min(R_ic * tOffSec, availableQiBits, (QiBits - QcloudBits) / 2);
  return Math.max(0, xMax);
}

/**
 * Subproblem P3b: Optimal cloud transmission power p_cloud*(t) assuming fixed x_cloud (Paper Eq. 21)
 * Solution: same form as P2b with Qj replaced by Qcloud, g_ij replaced by g_ic
 */
export function solveP3b(
  QiBits: number,
  QcloudBits: number,
  V: number,
  ki: number,
  WiHz: number,
  g_ic: number,
  N0Watts: number,
  pMaxWatts: number
): number {
  if (QcloudBits >= QiBits || V <= 0 || ki <= 0 || WiHz <= 0 || g_ic <= 0 || N0Watts <= 0) {
    return 0;
  }
  const c = N0Watts / g_ic;
  const pStar = ((QiBits - QcloudBits) * WiHz) / (V * ki * Math.LN2) - c;
  return Math.min(Math.max(0, pStar), pMaxWatts);
}

/**
 * Alternating iteration solver for P3 (cloud vertical offloading for node i)
 */
export function solveP3Alternating(
  QiBits: number,
  QcloudBits: number,
  V: number,
  ki: number,
  WiHz: number,
  tOffSec: number,
  g_ic: number,
  N0Watts: number,
  pMaxWatts: number,
  availableQiBits: number,
  maxIterations: number = 20,
  maxRateBps?: number
): { xBits: number; pWatts: number; rateBps: number; iterations: number } {
  if (QcloudBits >= QiBits || availableQiBits <= 0) {
    return { xBits: 0, pWatts: 0, rateBps: 0, iterations: 0 };
  }

  let p = Math.min(pMaxWatts, 0.5 * pMaxWatts);
  let x = 0;
  let iters = 0;

  for (let it = 0; it < maxIterations; it++) {
    iters = it + 1;
    const shannonR = computeShannonRate(WiHz, g_ic, p, N0Watts);
    const R = maxRateBps && maxRateBps > 0 ? Math.min(shannonR, maxRateBps) : shannonR;
    const newX = solveP3a(QiBits, QcloudBits, V, ki, p, R, tOffSec, availableQiBits);

    let newP = 0;
    if (newX > 0) {
      newP = solveP3b(QiBits, QcloudBits, V, ki, WiHz, g_ic, N0Watts, pMaxWatts);
    }

    const diffX = Math.abs(newX - x);
    const diffP = Math.abs(newP - p);

    x = newX;
    p = newP;

    if (diffX < 1.0 && diffP < 1e-6) {
      break;
    }
  }

  const shannonFinal = computeShannonRate(WiHz, g_ic, p, N0Watts);
  const finalRate = maxRateBps && maxRateBps > 0 ? Math.min(shannonFinal, maxRateBps) : shannonFinal;
  return { xBits: x, pWatts: p, rateBps: finalRate, iterations: iters };
}
