#!/usr/bin/env node
/**
 * Smoke: load detector, score holdout, adversarial gate, YAML sha256.
 * Exit 0 only if honest detector beats confidence_inflation on holdout.
 */
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
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
const { meanBrier } = await tsImport(mod("shared/brier.ts"), import.meta.url);
const { runAdversarialSuite } = await tsImport(
  mod("gradelock/adversarial.ts"),
  import.meta.url,
);

const items = loadHoldout({ partition: "holdout" });
const texts = items.map((i) => i.text);
const labels = items.map((i) => i.label);
const honest = predictConfidences(texts);
const mb = meanBrier(honest, labels);

console.log(`holdout_n=${items.length}`);
console.log(`honest_mean_brier=${mb.toFixed(6)}`);

const suite = runAdversarialSuite({
  texts,
  labels,
  honestPredictions: honest,
});
for (const a of suite.attacks) {
  console.log(
    `attack ${a.name}: mean_brier=${a.meanBrier.toFixed(6)} rank_drop=${a.rankDrop} passed=${a.passed}`,
  );
}

const yamlPath = join(root, "yaml/caliber-truthport.yaml");
const yamlBuf = readFileSync(yamlPath);
const sha = createHash("sha256").update(yamlBuf).digest("hex");
console.log(`yaml_sha256=${sha}`);

const inflation = suite.attacks.find((a) => a.name === "confidence_inflation");
const ok = inflation?.passed === true && inflation.meanBrier > suite.honestMeanBrier;

if (!ok) {
  console.error("SMOKE FAIL: honest detector did not beat confidence_inflation");
  process.exit(1);
}

console.log("SMOKE OK");
process.exit(0);
