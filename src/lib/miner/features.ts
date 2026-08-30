/** Multi-signal surface features for AI authorship scoring. */

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
  /** v2 */
  connectiveDensity: number;
  pronounDensity: number;
  digitDensity: number;
  uppercaseWordRatio: number;
  sentenceCountNorm: number;
  hapaxRatio: number;
  meanWordLen: number;
  questionDensity: number;
  exclaimDensity: number;
}

const FUNCTION_WORDS = new Set(
  `the a an and or but if then else when while for of to in on at by with from as is are was were be been being have has had do does did will would can could should may might must this that these those it its i you he she we they my your his her our their not no nor so yet`.split(
    /\s+/,
  ),
);

const HEDGES =
  /\b(additionally|furthermore|moreover|in conclusion|overall|it is important to note|in today's world|delve|tapestry|landscape|crucial|notably|essentially|fundamentally|comprehensive|robust|leverage|utilize|facilitate|underscore|pivotal|multifaceted|empower|streamline)\b/gi;

const CONNECTIVES =
  /\b(however|therefore|thus|hence|consequently|meanwhile|nevertheless|accordingly|similarly|conversely|specifically|particularly)\b/gi;

export function extractFeatures(text: string): TextFeatures {
  const trimmed = text.trim();
  const len = Math.max(trimmed.length, 1);
  const words = trimmed.toLowerCase().match(/[a-z0-9']+/g) ?? [];
  const wordCount = Math.max(words.length, 1);
  const unique = new Set(words);
  const sentences = trimmed.split(/[.!?]+/).map((s) => s.trim()).filter(Boolean);
  const sentenceCount = Math.max(sentences.length, 1);
  const sentenceLens = sentences.map((s) => (s.match(/[a-z0-9']+/gi) ?? []).length || 1);
  const mean = sentenceLens.reduce((a, b) => a + b, 0) / sentenceCount;
  const variance =
    sentenceLens.reduce((a, b) => a + (b - mean) ** 2, 0) / sentenceCount;
  const burstiness = Math.min(1, Math.sqrt(variance) / (mean + 1e-6));

  const punct = (trimmed.match(/[.,;:!?()[\]"'`-]/g) ?? []).length;
  const uniquePunct = new Set(trimmed.match(/[.,;:!?()[\]"'`-]/g) ?? []).size;
  const functionHits = words.filter((w) => FUNCTION_WORDS.has(w)).length;
  const contractions = (trimmed.match(/\b\w+'\w+\b/g) ?? []).length;
  const hedges = trimmed.match(HEDGES)?.length ?? 0;
  const connectives = trimmed.match(CONNECTIVES)?.length ?? 0;
  const listMarks = (trimmed.match(/^\s*([-*•]|\d+[.)])\s+/gm) ?? []).length;
  const mdHeaders = (trimmed.match(/^#{1,6}\s/gm) ?? []).length;

  let bigramRep = 0;
  const bigrams = new Map<string, number>();
  for (let i = 0; i < words.length - 1; i++) {
    const bg = `${words[i]} ${words[i + 1]}`;
    bigrams.set(bg, (bigrams.get(bg) ?? 0) + 1);
  }
  for (const c of bigrams.values()) {
    if (c > 1) bigramRep += c - 1;
  }

  const hapax = [...unique].filter((w) => words.filter((x) => x === w).length === 1).length;
  const pronouns = words.filter((w) =>
    ["i", "you", "he", "she", "we", "they", "me", "him", "her", "us", "them", "my", "your"].includes(w),
  ).length;
  const digits = (trimmed.match(/\d/g) ?? []).length;
  const upperWords = (trimmed.match(/\b[A-Z]{2,}\b/g) ?? []).length;
  const meanWordLen = words.reduce((a, w) => a + w.length, 0) / wordCount;
  const questions = (trimmed.match(/\?/g) ?? []).length;
  const exclaims = (trimmed.match(/!/g) ?? []).length;

  return {
    lengthNorm: Math.min(1, len / 4000),
    typeTokenRatio: unique.size / wordCount,
    punctuationDensity: punct / len,
    burstiness: Math.min(1, burstiness),
    functionWordRatio: functionHits / wordCount,
    repetition: Math.min(1, bigramRep / Math.max(words.length - 1, 1)),
    markdownListDensity: Math.min(1, (listMarks + mdHeaders) / sentenceCount),
    hedgeDensity: Math.min(1, hedges / wordCount),
    contractionDensity: Math.min(1, contractions / wordCount),
    avgSentenceLen: Math.min(1, mean / 40),
    uniquePunctRatio: uniquePunct / Math.max(punct, 1),
    connectiveDensity: Math.min(1, connectives / wordCount),
    pronounDensity: pronouns / wordCount,
    digitDensity: digits / len,
    uppercaseWordRatio: upperWords / wordCount,
    sentenceCountNorm: Math.min(1, sentenceCount / 40),
    hapaxRatio: hapax / unique.size,
    meanWordLen: Math.min(1, meanWordLen / 12),
    questionDensity: Math.min(1, questions / sentenceCount),
    exclaimDensity: Math.min(1, exclaims / sentenceCount),
  };
}
