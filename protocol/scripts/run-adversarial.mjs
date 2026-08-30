#!/usr/bin/env node
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { tsImport } from "tsx/esm/api";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const mod = (rel) => pathToFileURL(join(root, rel)).href;

const { loadHoldout } = await tsImport(mod("eval/load-holdout.ts"), import.meta.url);
const { predictConfidences } = await tsImport(
  mod("truthport/detector.ts"),
  import.meta.url,
);
const { runAdversarialSuite } = await tsImport(
  mod("gradelock/adversarial.ts"),
  import.meta.url,
);
const { rankMiners } = await tsImport(mod("gradelock/score.ts"), import.meta.url);

const items = loadHoldout({ partition: "holdout" });
const texts = items.map((i) => i.text);
const labels = items.map((i) => i.label);
const honest = predictConfidences(texts);

const suite = runAdversarialSuite({ texts, labels, honestPredictions: honest });
const miners = [
  { id: suite.honestMinerId, predictions: honest },
  ...suite.attacks.map((a) => ({
    id: a.minerId,
    predictions: a.name === "confidence_inflation"
      ? labels.map(() => 0.99)
      : a.name === "hedge_spam"
        ? labels.map(() => 0.5)
        : a.name === "volume_irrelevant"
          ? labels.map(() => 0.1)
          : honest.map((p) => 1 - p),
  })),
];

console.log(JSON.stringify({ suite, ranked: rankMiners(miners, labels) }, null, 2));
process.exit(suite.allPassed ? 0 : 1);
