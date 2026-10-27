/**
 * optimality.test.ts
 * Tests verifying that closed-form solutions for P1a, P2a, and P2b
 * match the global minimizer obtained via fine-grained brute-force grid search.
 */

import { describe, it, expect } from 'vitest';
import {
  solveP1a,
  solveP2a,
  solveP2b,
  computeShannonRate,
  BITS_PER_GB
} from '../dwpa';

describe('P1a Optimal Frequency Closed-Form vs Brute-Force Grid Search', () => {
  // P1a objective function: J1(f) = V * k * xi * f^3 * T_cmp - (Q * T_cmp * f) / phi
  function objP1a(
    f: number,
    QBits: number,
    V: number,
    k: number,
    xi: number,
    phi: number,
    tCmp: number
  ): number {
    return V * k * xi * Math.pow(f, 3) * tCmp - (QBits * tCmp * f) / phi;
  }

  function bruteForceP1a(
    QBits: number,
    V: number,
    k: number,
    xi: number,
    phi: number,
    fMax: number,
    tCmp: number,
    numSteps: number = 20000
  ): { bestF: number; minCost: number } {
    let bestF = 0;
    let minCost = objP1a(0, QBits, V, k, xi, phi, tCmp);

    const step = fMax / numSteps;
    for (let i = 1; i <= numSteps; i++) {
      const f = i * step;
      const cost = objP1a(f, QBits, V, k, xi, phi, tCmp);
      if (cost < minCost) {
        minCost = cost;
        bestF = f;
      }
    }
    return { bestF, minCost };
  }

  it('matches brute-force grid search for interior optimal frequency (0 < f* < f_max)', () => {
    const QBits = 50 * BITS_PER_GB;
    const V = 100;
    const k = 280; // gCO2/kWh
    const xi = 3.125e-32;
    const phi = 5000;
    const fMax = 240e9; // 240 GHz
    const tCmp = 3240;

    const fClosed = solveP1a(QBits, V, k, xi, phi, fMax);
    const { bestF: fBrute } = bruteForceP1a(QBits, V, k, xi, phi, fMax, tCmp, 25000);

    const costClosed = objP1a(fClosed, QBits, V, k, xi, phi, tCmp);
    const costBrute = objP1a(fBrute, QBits, V, k, xi, phi, tCmp);

    // Frequency within grid resolution (fMax / 25000 = ~9.6 MHz)
    const gridRes = fMax / 25000;
    expect(Math.abs(fClosed - fBrute)).toBeLessThanOrEqual(gridRes * 1.5);

    // Closed-form cost must be <= brute force cost
    expect(costClosed).toBeLessThanOrEqual(costBrute + 1e-9);
  });

  it('matches boundary constraint when f* reaches f_max', () => {
    // Massive queue forces f* to hit f_max
    const QBits = 50000 * BITS_PER_GB;
    const V = 0.01;
    const k = 100;
    const xi = 1e-32;
    const phi = 1000;
    const fMax = 100e9;
    const tCmp = 3240;

    const fClosed = solveP1a(QBits, V, k, xi, phi, fMax);
    const { bestF: fBrute } = bruteForceP1a(QBits, V, k, xi, phi, fMax, tCmp, 10000);

    expect(fClosed).toBe(fMax);
    expect(fBrute).toBeCloseTo(fMax, -5);
  });

  it('returns 0 when queue is 0', () => {
    const fClosed = solveP1a(0, 100, 280, 1e-32, 5000, 240e9);
    expect(fClosed).toBe(0);
  });
});

describe('P2a Optimal Offload Volume Closed-Form vs Brute-Force Search', () => {
  // P2a objective: J2a(x) = ( (V * k * p / R) + (Qj - Qi) ) * x
  function objP2a(x: number, QiBits: number, QjBits: number, V: number, k: number, p: number, R: number): number {
    const a = (V * k * p) / R;
    const b = QiBits - QjBits;
    return (a - b) * x;
  }

  function bruteForceP2a(
    QiBits: number,
    QjBits: number,
    V: number,
    k: number,
    p: number,
    R: number,
    xMax: number,
    numSteps: number = 5000
  ): { bestX: number; minCost: number } {
    let bestX = 0;
    let minCost = objP2a(0, QiBits, QjBits, V, k, p, R);

    const step = xMax / numSteps;
    for (let i = 0; i <= numSteps; i++) {
      const x = i * step;
      const cost = objP2a(x, QiBits, QjBits, V, k, p, R);
      if (cost < minCost) {
        minCost = cost;
        bestX = x;
      }
    }
    return { bestX, minCost };
  }

  it('correctly decides x* = 0 when Qj >= Qi', () => {
    const QiBits = 10 * BITS_PER_GB;
    const QjBits = 20 * BITS_PER_GB;
    const xClosed = solveP2a(QiBits, QjBits, 100, 300, 0.5, 1e9, 360, QiBits);
    expect(xClosed).toBe(0);
  });

  it('correctly decides x* = 0 when carbon transmission cost outweighs queue difference (a >= b)', () => {
    // Queue difference b = Qi - Qj = 100 bits
    const QiBits = 10000;
    const QjBits = 9900;
    const V = 100;
    const k = 300;
    const p = 1.0;
    const R = 1000; // 1000 bps => a = (100 * 300 * 1) / 1000 = 30, so a = 30
    // If b = Qi - Qj = 20 bits => a (30) >= b (20)
    const smallDiffQj = 9980; // diff = 20 bits
    const xClosed = solveP2a(QiBits, smallDiffQj, V, k, p, R, 360, QiBits);
    expect(xClosed).toBe(0);
  });

  it('correctly selects x* = xMax when queue difference outweighs carbon transmission cost (a < b)', () => {
    const QiBits = 100 * BITS_PER_GB;
    const QjBits = 10 * BITS_PER_GB; // huge queue diff
    const V = 1;
    const k = 200;
    const p = 0.5;
    const R = 10e9; // 10 Gbps fast link
    const tOff = 360;
    const xMax = Math.min(R * tOff, QiBits, (QiBits - QjBits) / 2);

    const xClosed = solveP2a(QiBits, QjBits, V, k, p, R, tOff, QiBits);
    const { bestX: xBrute } = bruteForceP2a(QiBits, QjBits, V, k, p, R, xMax, 5000);

    expect(xClosed).toBe(xMax);
    expect(xBrute).toBeCloseTo(xMax, -3);
  });
});

describe('P2b Optimal Power Closed-Form vs Brute-Force Search', () => {
  // P2b objective: J2b(p) = V * k * p * T_off + (Qj - Qi) * W * log2(1 + g * p / N0) * T_off
  function objP2b(
    p: number,
    QiBits: number,
    QjBits: number,
    V: number,
    k: number,
    Wi: number,
    g: number,
    N0: number,
    tOff: number
  ): number {
    const R = computeShannonRate(Wi, g, p, N0);
    return V * k * p * tOff + (QjBits - QiBits) * R * tOff;
  }

  function bruteForceP2b(
    QiBits: number,
    QjBits: number,
    V: number,
    k: number,
    Wi: number,
    g: number,
    N0: number,
    pMax: number,
    tOff: number,
    numSteps: number = 25000
  ): { bestP: number; minCost: number } {
    let bestP = 0;
    let minCost = objP2b(0, QiBits, QjBits, V, k, Wi, g, N0, tOff);

    const step = pMax / numSteps;
    for (let i = 1; i <= numSteps; i++) {
      const p = i * step;
      const cost = objP2b(p, QiBits, QjBits, V, k, Wi, g, N0, tOff);
      if (cost < minCost) {
        minCost = cost;
        bestP = p;
      }
    }
    return { bestP, minCost };
  }

  it('matches brute-force grid search for interior optimal transmit power (0 < p* < p_max)', () => {
    const QiBits = 50 * BITS_PER_GB;
    const QjBits = 40 * BITS_PER_GB;
    const V = 100;
    const k = 280;
    const Wi = 100e6; // 100 MHz
    const g = 1e-11;
    const N0 = 1e-16; // -130 dBm
    const pMax = 1.0;
    const tOff = 360;

    const pClosed = solveP2b(QiBits, QjBits, V, k, Wi, g, N0, pMax);
    const { bestP: pBrute } = bruteForceP2b(QiBits, QjBits, V, k, Wi, g, N0, pMax, tOff, 25000);

    const costClosed = objP2b(pClosed, QiBits, QjBits, V, k, Wi, g, N0, tOff);
    const costBrute = objP2b(pBrute, QiBits, QjBits, V, k, Wi, g, N0, tOff);

    // Tolerance within grid resolution (1.0 / 25000 = 0.00004 W)
    const gridRes = pMax / 25000;
    expect(Math.abs(pClosed - pBrute)).toBeLessThanOrEqual(gridRes * 1.5);
    expect(costClosed).toBeLessThanOrEqual(costBrute + 1e-9);
  });

  it('correctly clips power at p_max under massive queue backlog disparity', () => {
    const QiBits = 1000 * BITS_PER_GB;
    const QjBits = 0;
    const V = 0.1; // low carbon weight
    const k = 100;
    const Wi = 100e6;
    const g = 1e-11;
    const N0 = 1e-16;
    const pMax = 1.0;
    const tOff = 360;

    const pClosed = solveP2b(QiBits, QjBits, V, k, Wi, g, N0, pMax);
    const { bestP: pBrute } = bruteForceP2b(QiBits, QjBits, V, k, Wi, g, N0, pMax, tOff, 10000);

    expect(pClosed).toBe(pMax);
    expect(pBrute).toBeCloseTo(pMax, 3);
  });

  it('correctly returns 0 when Qj >= Qi', () => {
    const pClosed = solveP2b(10, 20, 100, 300, 1e6, 1e-11, 1e-16, 1.0);
    expect(pClosed).toBe(0);
  });
});
