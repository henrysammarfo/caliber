import type { CalibrationBin } from "./types.js";

/** Equal-width calibration bins over [0,1]. */
export function calibrationBins(
  predictions: number[],
  labels: Array<0 | 1>,
  nBins = 10,
): CalibrationBin[] {
  if (predictions.length !== labels.length) {
    throw new Error("calibrationBins: length mismatch");
  }
  if (nBins < 1) throw new Error("calibrationBins: nBins must be >= 1");

  const bins: CalibrationBin[] = [];
  for (let b = 0; b < nBins; b++) {
    const lo = b / nBins;
    const hi = (b + 1) / nBins;
    let count = 0;
    let sumP = 0;
    let sumY = 0;
    for (let i = 0; i < predictions.length; i++) {
      const p = clamp01(predictions[i]!);
      const inBin = b === nBins - 1 ? p >= lo && p <= hi : p >= lo && p < hi;
      if (!inBin) continue;
      count += 1;
      sumP += p;
      sumY += labels[i]!;
    }
    bins.push({
      lo,
      hi,
      count,
      meanPredicted: count === 0 ? 0 : sumP / count,
      meanLabel: count === 0 ? 0 : sumY / count,
    });
  }
  return bins;
}

function clamp01(x: number): number {
  if (!Number.isFinite(x)) return 0;
  if (x < 0) return 0;
  if (x > 1) return 1;
  return x;
}
