/** Shared types for TRUTHPORT detect (bundler-style; no .js suffixes). */

export type BinaryLabel = 0 | 1;

export interface DetectionResult {
  confidence: number;
  isAI: boolean;
  explanation: string;
  model: "caliber-truthport-v1";
}

export const MODEL_ID = "caliber-truthport-v1" as const;
export const MAX_TEXT_CHARS = 50_000;
export const DETECT_THRESHOLD = 0.5;
