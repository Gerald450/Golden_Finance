import type { DailyPoint } from "./data";

const clamp = (x: number, a=0, b=100) => Math.max(a, Math.min(b, x));
const scale = (x: number, min: number, max: number) => clamp(((x - min) / (max - min)) * 100);

export function computeDailyGrowth(series: DailyPoint[], window = 7): number[] {
  // % growth vs avg of previous window
  return series.map((_, i) => {
    if (i < window) return 0;
    const prev = series.slice(i - window, i);
    const prevAvg = prev.reduce((s, p) => s + p.sales, 0) / window;
    return prevAvg === 0 ? 0 : ((series[i].sales - prevAvg) / prevAvg);
  });
}

export function computeSVI(series: DailyPoint[]) {
  const growth = computeDailyGrowth(series);
  const raw = series.map((p, i) => {
    const salesGrowthNorm = scale(growth[i], -0.2, 0.2); // −20% → 0, +20% → 100
    const marginNorm = clamp(p.marginPct * 100);
    const invTurnNorm = scale(p.invTurn, 0.5, 3.0);      // friendly retail caps
    const refundNorm = 100 - clamp(p.refundPct * 100);   // lower refunds → higher

    return (
      0.45 * salesGrowthNorm +
      0.25 * marginNorm +
      0.20 * invTurnNorm +
      0.10 * refundNorm
    );
  });

  // EMA smoothing with α = 0.25; baseline 100
  const alpha = 0.25;
  const svi: number[] = [];
  for (let i = 0; i < raw.length; i++) {
    if (i === 0) svi.push(100);
    else svi.push(alpha * raw[i] + (1 - alpha) * svi[i - 1]);
  }
  return svi;
}
