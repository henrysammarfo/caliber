/**
 * TRUTHPORT v2 — production text-authenticity miner.
 * Deterministic multi-signal stylometry → calibrated P(AI).
 * Response contract matches Telegraph AI_TEXT_DETECTION peers (veritarach/livecert).
 */

export type AuthorshipLabel = "ai_generated" | "human_written";

export interface DetectionResult {
  /** P(AI-generated) in [0,1] — semantics.confidence_field */
  confidence: number;
  /** Peer contract (veritarach label_field) */
  label: AuthorshipLabel;
  /** Peer contract (livecert reason_field) */
  reason: string;
  /** livecert-style alias of label */
  verdict: AuthorshipLabel;
  /** Boolean convenience (not the scored label field) */
  isAI: boolean;
  model: typeof MODEL_ID;
  version: "2.0.0";
}

export const MODEL_ID = "caliber-truthport-v2" as const;
export const MAX_TEXT_CHARS = 50_000;
export const DETECT_THRESHOLD = 0.5;
