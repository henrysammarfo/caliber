/** Small JSON helpers used by grader / WASM host adapters. */

export function safeJsonParse(raw: string): unknown {
  try {
    return JSON.parse(raw) as unknown;
  } catch {
    return null;
  }
}

export function extractConfidence(minerAnswer: unknown): number | null {
  if (minerAnswer === null || typeof minerAnswer !== "object") return null;
  const conf = (minerAnswer as { confidence?: unknown }).confidence;
  if (typeof conf !== "number" || !Number.isFinite(conf)) return null;
  if (conf < 0 || conf > 1) return null;
  return conf;
}

export function extractLabel(groundTruth: unknown): 0 | 1 | null {
  if (groundTruth === null || typeof groundTruth !== "object") return null;
  const label = (groundTruth as { label?: unknown }).label;
  if (label === 0 || label === 1) return label;
  if (label === false) return 0;
  if (label === true) return 1;
  return null;
}
