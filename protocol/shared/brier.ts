/** Brier score utilities — lower is better. */

/** Single-outcome Brier: (p - y)^2 for y in {0,1}, p in [0,1]. */
export function brierScore(p: number, y: 0 | 1): number {
  const pp = clamp01(p);
  const yy = y === 1 ? 1 : 0;
  const d = pp - yy;
  return d * d;
}

/** Mean Brier across aligned prediction/label arrays. */
export function meanBrier(predictions: number[], labels: Array<0 | 1>): number {
  if (predictions.length === 0) {
    throw new Error("meanBrier: empty predictions");
  }
  if (predictions.length !== labels.length) {
    throw new Error(
      `meanBrier: length mismatch predictions=${predictions.length} labels=${labels.length}`,
    );
  }
  let sum = 0;
  for (let i = 0; i < predictions.length; i++) {
    sum += brierScore(predictions[i]!, labels[i]!);
  }
  return sum / predictions.length;
}

/** Score for WASM rank_answer: 1 - Brier, clamped to [0,1]. Empty answer → 0. */
export function rankFromConfidence(confidence: number | null, label: 0 | 1): number {
  if (confidence === null || Number.isNaN(confidence)) return 0;
  const score = 1 - brierScore(confidence, label);
  return clamp01(score);
}

function clamp01(x: number): number {
  if (!Number.isFinite(x)) return 0;
  if (x < 0) return 0;
  if (x > 1) return 1;
  return x;
}
