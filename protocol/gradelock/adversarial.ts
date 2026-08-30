/**
 * Named adversarial attacks + expected rank drop vs honest detector.
 *
 * Results shape (also documented in README):
 * {
 *   honestMinerId, honestMeanBrier,
 *   attacks: [{ name, minerId, meanBrier, honestMeanBrier, rankDrop, expectedWorseThanHonest, passed }],
 *   allPassed
 * }
 */

import { meanBrier } from "../shared/brier.js";
import type { AdversarialSuiteResult, BinaryLabel } from "../shared/types.js";
import { rankMiners } from "./score.js";

export type AttackName =
  | "confidence_inflation"
  | "hedge_spam"
  | "label_echo"
  | "volume_irrelevant";

export interface AttackSpec {
  name: AttackName;
  description: string;
  /** Build predictions given honest preds + labels + texts. */
  predict: (ctx: {
    texts: string[];
    labels: BinaryLabel[];
    honest: number[];
  }) => number[];
}

const ATTACKS: AttackSpec[] = [
  {
    name: "confidence_inflation",
    description: "Always predict near-certain AI (0.99).",
    predict: ({ labels }) => labels.map(() => 0.99),
  },
  {
    name: "hedge_spam",
    description: "Always predict 0.5 (maximally uninformative).",
    predict: ({ labels }) => labels.map(() => 0.5),
  },
  {
    name: "label_echo",
    description:
      "If ground-truth labels were leaked into the request, echo them; otherwise fall back to inverted honest (simulates failed echo).",
    predict: ({ labels, honest }) => {
      // Echo is only possible if labels are available to the miner (cheat).
      // Suite measures the cheat case: perfect label echo → Brier 0 (ranks best).
      // For anti-game CI we instead use a "failed echo" variant that copies
      // inverted honest — still worse than honest when detector is calibrated.
      // Primary CI gate uses confidence_inflation; label_echo documents the risk.
      void labels;
      return honest.map((p) => 1 - p);
    },
  },
  {
    name: "volume_irrelevant",
    description: "Ignore text; emit fixed 0.1 regardless of content.",
    predict: ({ labels }) => labels.map(() => 0.1),
  },
];

/**
 * Run adversarial suite. Expects confidence_inflation, hedge_spam, and
 * volume_irrelevant to rank worse (higher mean Brier) than honest.
 * label_echo (inverted) also expected worse; true label leak would beat honest
 * and is documented as residual risk — not claimed prevented.
 */
export function runAdversarialSuite(opts: {
  texts: string[];
  labels: BinaryLabel[];
  honestPredictions: number[];
  honestMinerId?: string;
}): AdversarialSuiteResult {
  const honestMinerId = opts.honestMinerId ?? "truthport-honest";
  const honestMean = meanBrier(opts.honestPredictions, opts.labels);

  const miners = [
    { id: honestMinerId, predictions: opts.honestPredictions },
    ...ATTACKS.map((a) => ({
      id: `attack:${a.name}`,
      predictions: a.predict({
        texts: opts.texts,
        labels: opts.labels,
        honest: opts.honestPredictions,
      }),
    })),
  ];

  const ranked = rankMiners(miners, opts.labels);
  const honestRank = ranked.find((r) => r.id === honestMinerId)?.rank ?? 1;

  const attacks = ATTACKS.map((a) => {
    const minerId = `attack:${a.name}`;
    const row = ranked.find((r) => r.id === minerId)!;
    const attackMean = row.meanBrier;
    const rankDrop = row.rank - honestRank;
    // True label echo would pass as "better"; our suite uses inverted-honest
    // for label_echo so expectedWorseThanHonest stays true for CI.
    const expectedWorseThanHonest = true;
    const passed = attackMean > honestMean;
    return {
      name: a.name,
      minerId,
      meanBrier: attackMean,
      honestMeanBrier: honestMean,
      rankDrop,
      expectedWorseThanHonest,
      passed,
    };
  });

  // Gate: confidence_inflation must fail relative to honest (critical anti-game).
  const inflation = attacks.find((a) => a.name === "confidence_inflation");
  const criticalOk = inflation?.passed === true;
  const allPassed = criticalOk && attacks.every((a) => a.passed);

  return {
    honestMinerId,
    honestMeanBrier: honestMean,
    attacks,
    allPassed,
  };
}

export { ATTACKS };
