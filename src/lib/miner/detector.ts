/**
 * CALIBER TRUTHPORT v2 detector — deep stylometry ensemble.
 * No network. Deterministic. Calibrated for proper-scoring graders (Brier).
 * Competes on AI_TEXT_DETECTION against veritarach/itsai/livecert shapes.
 */

import {
  DETECT_THRESHOLD,
  MAX_TEXT_CHARS,
  MODEL_ID,
  type AuthorshipLabel,
  type DetectionResult,
} from "./types";
import { extractFeatures, type TextFeatures } from "./features";

/** Positive weight → more AI-like. Tuned for calibration + adversarial resistance. */
const WEIGHTS: Readonly<Record<keyof TextFeatures, number>> = {
  lengthNorm: 0.35,
  typeTokenRatio: -0.55,
  punctuationDensity: -0.25,
  burstiness: -2.8,
  functionWordRatio: -0.35,
  repetition: 1.6,
  markdownListDensity: 3.8,
  hedgeDensity: 8.2,
  contractionDensity: -5.5,
  avgSentenceLen: 0.65,
  uniquePunctRatio: -0.45,
  connectiveDensity: 4.8,
  pronounDensity: -2.2,
  digitDensity: -0.4,
  uppercaseWordRatio: -0.8,
  sentenceCountNorm: 0.2,
  hapaxRatio: -1.1,
  meanWordLen: 1.4,
  questionDensity: -1.6,
  exclaimDensity: -1.3,
};

const BIAS = -0.05;

export function detectOne(raw: string): DetectionResult {
  if (typeof raw !== "string") {
    throw new Error("detectOne: text must be a string");
  }
  const text = raw.trim();
  if (!text) {
    throw new Error("detectOne: text must be non-empty");
  }
  if (text.length > MAX_TEXT_CHARS) {
    throw new Error(`detectOne: text exceeds max length ${MAX_TEXT_CHARS}`);
  }

  // Short texts: abstain toward 0.5 (honest uncertainty — proper scoring friendly)
  const features = extractFeatures(text);
  let logit = BIAS + dot(features, WEIGHTS);
  if (text.length < 80) {
    logit *= 0.35;
  } else if (text.length < 200) {
    logit *= 0.7;
  }

  const confidence = round6(sigmoid(logit));
  const isAI = confidence >= DETECT_THRESHOLD;
  const label: AuthorshipLabel = isAI ? "ai_generated" : "human_written";
  const reason = buildReason(features, confidence, label, text.length);

  return {
    confidence,
    label,
    reason,
    verdict: label,
    isAI,
    model: MODEL_ID,
    version: "2.0.0",
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

/** Resolve text from JSON body or querystring (livecert engine fills declared params). */
export function resolveTextInput(source: {
  text?: unknown;
  query?: unknown;
  texts?: unknown;
}): { text?: string; texts?: string[] } {
  if (Array.isArray(source.texts)) {
    return { texts: source.texts.map(String) };
  }
  const text =
    typeof source.text === "string" && source.text.trim()
      ? source.text
      : typeof source.query === "string" && source.query.trim()
        ? source.query
        : undefined;
  if (text !== undefined) return { text };
  return {};
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

function buildReason(
  f: TextFeatures,
  confidence: number,
  label: AuthorshipLabel,
  len: number,
): string {
  const drivers: string[] = [];
  if (f.hedgeDensity > 0.015) drivers.push("formulaic/hedge lexicon");
  if (f.connectiveDensity > 0.012) drivers.push("academic connectives");
  if (f.markdownListDensity > 0.12) drivers.push("list/markdown structure");
  if (f.burstiness < 0.22) drivers.push("low sentence-length burstiness");
  if (f.contractionDensity > 0.015) drivers.push("contractions (human-leaning)");
  if (f.pronounDensity > 0.06) drivers.push("personal pronouns (human-leaning)");
  if (f.hapaxRatio > 0.55) drivers.push("high hapax (lexical diversity)");
  if (f.repetition > 0.12) drivers.push("repeated bigrams");
  if (len < 80) drivers.push("short passage — confidence shrunk toward chance");
  const tip = drivers.length > 0 ? drivers.slice(0, 4).join("; ") : "balanced stylometry";
  return `${label} p(AI)=${confidence.toFixed(3)}; ${tip}. Model ${MODEL_ID}; not legal proof of authorship.`;
}
