/** Shared protocol types for TRUTHPORT + GRADELOCK. */

export type BinaryLabel = 0 | 1;

export interface DetectionResult {
  confidence: number;
  isAI: boolean;
  explanation: string;
  model: "caliber-truthport-v1";
}

export interface HoldoutItem {
  id: string;
  text: string;
  label: BinaryLabel;
  source: string;
  partition: "holdout" | "train_cal";
}

export interface MinerPredictions {
  id: string;
  predictions: number[];
}

export interface RankedMiner {
  id: string;
  meanBrier: number;
  rank: number;
}

export interface CalibrationBin {
  lo: number;
  hi: number;
  count: number;
  meanPredicted: number;
  meanLabel: number;
}

export interface AdversarialAttackResult {
  name: string;
  minerId: string;
  meanBrier: number;
  honestMeanBrier: number;
  rankDrop: number;
  expectedWorseThanHonest: boolean;
  passed: boolean;
}

export interface AdversarialSuiteResult {
  honestMinerId: string;
  honestMeanBrier: number;
  attacks: AdversarialAttackResult[];
  allPassed: boolean;
}

export const MODEL_ID = "caliber-truthport-v1" as const;
export const MAX_TEXT_CHARS = 50_000;
export const DETECT_THRESHOLD = 0.5;
