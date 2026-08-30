/** Deterministic text features for AI-likeness scoring. */

export interface TextFeatures {
  lengthNorm: number;
  typeTokenRatio: number;
  punctuationDensity: number;
  burstiness: number;
  functionWordRatio: number;
  repetition: number;
  markdownListDensity: number;
  hedgeDensity: number;
  contractionDensity: number;
  avgSentenceLen: number;
  uniquePunctRatio: number;
}

const FUNCTION_WORDS = new Set([
  "the",
  "a",
  "an",
  "and",
  "or",
  "but",
  "in",
  "on",
  "at",
  "to",
  "for",
  "of",
  "with",
  "by",
  "from",
  "as",
  "is",
  "are",
  "was",
  "were",
  "be",
  "been",
  "being",
  "have",
  "has",
  "had",
  "do",
  "does",
  "did",
  "will",
  "would",
  "could",
  "should",
  "may",
  "might",
  "must",
  "can",
  "this",
  "that",
  "these",
  "those",
  "it",
  "its",
  "they",
  "them",
  "their",
  "we",
  "our",
  "you",
  "your",
  "i",
  "me",
  "my",
  "he",
  "she",
  "his",
  "her",
  "not",
  "no",
  "if",
  "than",
  "then",
  "so",
  "because",
  "about",
  "into",
  "through",
  "during",
  "before",
  "after",
  "above",
  "below",
  "between",
  "under",
  "again",
  "further",
  "once",
  "here",
  "there",
  "when",
  "where",
  "why",
  "how",
  "all",
  "each",
  "few",
  "more",
  "most",
  "other",
  "some",
  "such",
  "only",
  "own",
  "same",
  "than",
  "too",
  "very",
  "just",
  "also",
]);

const HEDGE_RE =
  /\b(moreover|furthermore|additionally|in conclusion|it is important to note|delve|tapestry|landscape of|in today's|overall|ultimately|notably|essentially|fundamentally|comprehensive|multifaceted|robust|leverage|utilize|facilitate|enhance|optimize|streamline|cutting-edge|state-of-the-art|holistic|paradigm|synergy)\b/gi;

const CONTRACTION_RE =
  /\b(don't|doesn't|didn't|can't|couldn't|won't|wouldn't|isn't|aren't|wasn't|weren't|haven't|hasn't|hadn't|I'm|I've|I'd|I'll|you're|you've|you'd|you'll|we're|we've|we'd|we'll|they're|they've|they'd|they'll|it's|that's|what's|who's|there's|here's|let's)\b/gi;

export function extractFeatures(text: string): TextFeatures {
  const trimmed = text.trim();
  const len = trimmed.length;
  if (len === 0) {
    return {
      lengthNorm: 0,
      typeTokenRatio: 0,
      punctuationDensity: 0,
      burstiness: 0,
      functionWordRatio: 0,
      repetition: 0,
      markdownListDensity: 0,
      hedgeDensity: 0,
      contractionDensity: 0,
      avgSentenceLen: 0,
      uniquePunctRatio: 0,
    };
  }

  const tokens = tokenize(trimmed);
  const lowerTokens = tokens.map((t) => t.toLowerCase());
  const unique = new Set(lowerTokens);
  const typeTokenRatio = tokens.length === 0 ? 0 : unique.size / tokens.length;

  let punctCount = 0;
  const punctKinds = new Set<string>();
  for (const ch of trimmed) {
    if (/[.,;:!?'"()[\]{}…]/.test(ch)) {
      punctCount += 1;
      punctKinds.add(ch);
    }
  }
  const punctuationDensity = punctCount / len;
  const uniquePunctRatio = punctCount === 0 ? 0 : punctKinds.size / punctCount;

  const sentences = splitSentences(trimmed);
  const sentLens = sentences.map((s) => s.trim().split(/\s+/).filter(Boolean).length);
  const avgSentenceLen =
    sentLens.length === 0 ? 0 : sentLens.reduce((a, b) => a + b, 0) / sentLens.length;
  const burstiness = coefficientOfVariation(sentLens);

  let funcCount = 0;
  for (const t of lowerTokens) {
    if (FUNCTION_WORDS.has(t)) funcCount += 1;
  }
  const functionWordRatio = tokens.length === 0 ? 0 : funcCount / tokens.length;

  const repetition = maxBigramRepetition(lowerTokens);

  const lines = trimmed.split(/\r?\n/);
  let listLines = 0;
  for (const line of lines) {
    if (/^\s*([-*•]|\d+[.)])\s+/.test(line)) listLines += 1;
  }
  const markdownListDensity = lines.length === 0 ? 0 : listLines / lines.length;

  const hedgeMatches = trimmed.match(HEDGE_RE);
  const hedgeDensity = (hedgeMatches?.length ?? 0) / Math.max(1, tokens.length);

  const contractionMatches = trimmed.match(CONTRACTION_RE);
  const contractionDensity =
    (contractionMatches?.length ?? 0) / Math.max(1, tokens.length);

  const lengthNorm = Math.min(1, len / 2000);

  return {
    lengthNorm,
    typeTokenRatio,
    punctuationDensity,
    burstiness,
    functionWordRatio,
    repetition,
    markdownListDensity,
    hedgeDensity,
    contractionDensity,
    avgSentenceLen: Math.min(1, avgSentenceLen / 40),
    uniquePunctRatio,
  };
}

function tokenize(text: string): string[] {
  return text.match(/[A-Za-z0-9']+/g) ?? [];
}

function splitSentences(text: string): string[] {
  const parts = text.split(/(?<=[.!?])\s+/);
  return parts.filter((p) => p.trim().length > 0);
}

function coefficientOfVariation(values: number[]): number {
  if (values.length < 2) return 0;
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  if (mean === 0) return 0;
  let varSum = 0;
  for (const v of values) {
    const d = v - mean;
    varSum += d * d;
  }
  const std = Math.sqrt(varSum / values.length);
  return Math.min(2, std / mean);
}

function maxBigramRepetition(tokens: string[]): number {
  if (tokens.length < 4) return 0;
  const counts = new Map<string, number>();
  for (let i = 0; i < tokens.length - 1; i++) {
    const key = `${tokens[i]} ${tokens[i + 1]}`;
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  let max = 0;
  for (const c of counts.values()) {
    if (c > max) max = c;
  }
  return Math.min(1, (max - 1) / Math.max(1, tokens.length / 4));
}
