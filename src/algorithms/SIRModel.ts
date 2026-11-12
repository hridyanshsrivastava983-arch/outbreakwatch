import { SIRParameters, SIRDataPoint } from '../types/epidemiology';

/**
 * Classical SIR (Susceptible - Infected - Recovered) Epidemiological Model.
 * Differential equations solved numerically via Euler discretization:
 *   dS/dt = - (beta * S * I) / N
 *   dI/dt =   (beta * S * I) / N - gamma * I
 *   dR/dt =   gamma * I
 *
 * Metrics:
 *   Basic Reproduction Number R0 = beta / gamma
 *   Effective Reproduction Number Rt = R0 * (S / N)
 *   Herd Immunity Threshold = 1 - (1 / R0)
 */
export class SIRModel {
  /**
   * Runs forward simulation for `days` time steps.
   */
  static simulate(params: SIRParameters): {
    points: SIRDataPoint[];
    r0: number;
    peakDay: number;
    peakInfected: number;
    herdImmunityThresholdPct: number;
    totalInfectedAtEnd: number;
  } {
    const { N, I0, R0: initR0, beta, gamma, days } = params;

    const points: SIRDataPoint[] = [];
    let S = Math.max(0, N - I0 - initR0);
    let I = I0;
    let R = initR0;

    const r0 = gamma > 0 ? Number((beta / gamma).toFixed(2)) : 0;
    const herdThreshold = r0 > 1 ? Number(((1 - 1 / r0) * 100).toFixed(1)) : 0;

    let peakDay = 0;
    let peakInfected = I;

    // Day 0
    points.push({
      day: 0,
      susceptible: Math.round(S),
      infected: Math.round(I),
      recovered: Math.round(R),
      dailyNewInfections: 0,
      effectiveR0: Number((r0 * (S / N)).toFixed(2)),
    });

    const dt = 0.5; // Half-day sub-steps for numerical stability
    const subSteps = 1 / dt;

    for (let day = 1; day <= days; day++) {
      let dailyNewCasesAccumulator = 0;

      for (let step = 0; step < subSteps; step++) {
        const newInfections = ((beta * S * I) / N) * dt;
        const newRecoveries = gamma * I * dt;

        S = Math.max(0, S - newInfections);
        I = Math.max(0, I + newInfections - newRecoveries);
        R = Math.min(N, R + newRecoveries);

        dailyNewCasesAccumulator += newInfections;
      }

      if (I > peakInfected) {
        peakInfected = I;
        peakDay = day;
      }

      points.push({
        day,
        susceptible: Math.round(S),
        infected: Math.round(I),
        recovered: Math.round(R),
        dailyNewInfections: Math.round(dailyNewCasesAccumulator),
        effectiveR0: Number((r0 * (S / N)).toFixed(2)),
      });
    }

    const totalInfectedAtEnd = Math.round(N - S);

    return {
      points,
      r0,
      peakDay,
      peakInfected: Math.round(peakInfected),
      herdImmunityThresholdPct: herdThreshold,
      totalInfectedAtEnd,
    };
  }
}
