import { brierScore, meanBrier } from "../shared/brier.js";
import { calibrationBins } from "../shared/calibration.js";
import type { MinerPredictions, RankedMiner } from "../shared/types.js";

export { brierScore, meanBrier };
export { calibrationBins };

/** Rank miners by mean Brier ascending (lower = better). */
export function rankMiners(
  miners: MinerPredictions[],
  labels: Array<0 | 1>,
): RankedMiner[] {
  const scored = miners.map((m) => ({
    id: m.id,
    meanBrier: meanBrier(m.predictions, labels),
  }));
  scored.sort((a, b) => {
    if (a.meanBrier !== b.meanBrier) return a.meanBrier - b.meanBrier;
    return a.id.localeCompare(b.id);
  });
  return scored.map((s, i) => ({ ...s, rank: i + 1 }));
}

/**
 * Exported results shape for README / smoke:
 * {
 *   honestMeanBrier: number,
 *   ranked: RankedMiner[],
 *   calibration: CalibrationBin[],
 *   adversarial: AdversarialSuiteResult
 * }
 */
export interface GradlockEvalBundle {
  honestMeanBrier: number;
  ranked: RankedMiner[];
  calibration: ReturnType<typeof calibrationBins>;
}
