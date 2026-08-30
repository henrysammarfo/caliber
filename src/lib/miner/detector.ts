/**
 * Calibrated P(AI) ensemble — deterministic, no network, no randomness.
 *
 * Fixed feature → logit weights. Sigmoid → confidence in [0,1].
 * Threshold 0.5 for isAI. Production calibration should re-fit intercept/weights
 * on a labeled holdout (RAID primary); this v1 uses fixed CI-tuned weights.
 */

import {
  DETECT_THRESHOLD,
  MAX_TEXT_CHARS,
  MODEL_ID,
  type DetectionResult,
} from "./types";
import { extractFeatures, type TextFeatures } from "./features";

/**
 * Fixed weights: positive → more AI-like.
 * Note: raw TTR is high for short human and AI alike — keep its weight small.
 * Tuned so mean Brier on synthetic holdout beats constant-0.5 (hedge_spam).
 * Production calibration should re-fit on RAID (or other labeled holdout).
 */
const WEIGHTS: Readonly<Record<keyof TextFeatures, number>> = {
  lengthNorm: 0.4,
  typeTokenRatio: -0.35,
  punctuationDensity: -0.2,
  burstiness: -2.2,
  functionWordRatio: -0.4,
  repetition: 1.8,
  markdownListDensity: 4.2,
  hedgeDensity: 7.5,
  contractionDensity: -4.5,
  avgSentenceLen: 0.5,
  uniquePunctRatio: -0.3,
};

const BIAS = 0.15;

export function detectOne(text: string): DetectionResult {
  if (typeof text !== "string") {
    throw new Error("detectOne: text must be a string");
  }
  if (text.length > MAX_TEXT_CHARS) {
    throw new Error(`detectOne: text exceeds max length ${MAX_TEXT_CHARS}`);
  }

  const features = extractFeatures(text);
  const logit = BIAS + dot(features, WEIGHTS);
  const confidence = sigmoid(logit);
  const isAI = confidence >= DETECT_THRESHOLD;
  const explanation = buildExplanation(features, confidence, isAI);

  return {
    confidence: round6(confidence),
    isAI,
    explanation,
    model: MODEL_ID,
  };
}

export function detect(
  input: { text: string } | { texts: string[] },
): DetectionResult | DetectionResult[] {
  if ("texts" in input) {
    return input.texts.map((t) => detectOne(t));
  }
  return detectOne(input.text);
}

export function predictConfidences(texts: string[]): number[] {
  return texts.map((t) => detectOne(t).confidence);
}

function dot(features: TextFeatures, weights: typeof WEIGHTS): number {
  let s = 0;
  for (const key of Object.keys(weights) as Array<keyof TextFeatures>) {
    s += features[key] * weights[key];
  }
  return s;
}

function sigmoid(x: number): number {
  if (x >= 20) return 1;
  if (x <= -20) return 0;
  return 1 / (1 + Math.exp(-x));
}

function round6(x: number): number {
  return Math.round(x * 1e6) / 1e6;
}

function buildExplanation(
  f: TextFeatures,
  confidence: number,
  isAI: boolean,
): string {
  const drivers: string[] = [];
  if (f.hedgeDensity > 0.02) drivers.push("hedging/boilerplate lexicon");
  if (f.markdownListDensity > 0.15) drivers.push("list/markdown density");
  if (f.burstiness < 0.25) drivers.push("low sentence-length variance");
  if (f.typeTokenRatio < 0.45) drivers.push("low type-token ratio");
  if (f.contractionDensity > 0.02) drivers.push("contractions (human-leaning)");
  if (f.repetition > 0.15) drivers.push("repeated phrases");
  const tip =
    drivers.length > 0
      ? drivers.slice(0, 3).join("; ")
      : "balanced surface features";
  return `${isAI ? "AI-leaning" : "human-leaning"} (p=${confidence.toFixed(3)}); drivers: ${tip}. Threshold ${DETECT_THRESHOLD}; production calibration uses labeled holdout.`;
}
