import { describe, expect, it } from "vitest";
import { brierScore, meanBrier } from "../shared/brier.js";
import { detect, detectOne } from "../truthport/detector.js";
import { DetectRequestSchema } from "../truthport/schemas.js";
import { loadHoldout } from "../eval/load-holdout.js";
import { runAdversarialSuite } from "../gradelock/adversarial.js";
import { rankMiners } from "../gradelock/score.js";
import { predictConfidences } from "../truthport/detector.js";

describe("brier", () => {
  it("known values", () => {
    expect(brierScore(1, 1)).toBe(0);
    expect(brierScore(0, 0)).toBe(0);
    expect(brierScore(1, 0)).toBe(1);
    expect(brierScore(0, 1)).toBe(1);
    expect(brierScore(0.5, 1)).toBeCloseTo(0.25, 10);
    expect(brierScore(0.7, 1)).toBeCloseTo(0.09, 10);
    expect(meanBrier([0.5, 0.5], [1, 0])).toBeCloseTo(0.25, 10);
  });
});

describe("detector", () => {
  it("is deterministic and returns confidence in [0,1]", () => {
    const text =
      "In today's landscape, it is important to note that we must leverage robust frameworks.\n- Item one\n- Item two\nUltimately, holistic synergy.";
    const a = detectOne(text);
    const b = detectOne(text);
    expect(a).toEqual(b);
    expect(a.confidence).toBeGreaterThanOrEqual(0);
    expect(a.confidence).toBeLessThanOrEqual(1);
    expect(a.model).toBe("caliber-truthport-v1");
    expect(typeof a.isAI).toBe("boolean");
    expect(a.explanation.length).toBeGreaterThan(0);
  });

  it("batch detect returns one result per text", () => {
    const results = detect({ texts: ["hi there", "hello world"] });
    expect(Array.isArray(results)).toBe(true);
    expect((results as ReturnType<typeof detectOne>[]).length).toBe(2);
  });
});

describe("holdout", () => {
  it("loads >= 80 labeled items", () => {
    const all = loadHoldout();
    expect(all.length).toBeGreaterThanOrEqual(80);
    for (const item of all) {
      expect(item.source).toBe("synthetic-ci");
      expect([0, 1]).toContain(item.label);
      expect(["holdout", "train_cal"]).toContain(item.partition);
      expect(item.text.length).toBeGreaterThan(0);
    }
    const holdout = loadHoldout({ partition: "holdout" });
    expect(holdout.length).toBeGreaterThanOrEqual(40);
  });
});

describe("adversarial", () => {
  it("inflated miner ranks worse than honest on holdout", () => {
    const items = loadHoldout({ partition: "holdout" });
    const texts = items.map((i) => i.text);
    const labels = items.map((i) => i.label);
    const honest = predictConfidences(texts);
    const inflated = labels.map(() => 0.99);

    const ranked = rankMiners(
      [
        { id: "honest", predictions: honest },
        { id: "inflated", predictions: inflated },
      ],
      labels,
    );

    const h = ranked.find((r) => r.id === "honest")!;
    const bad = ranked.find((r) => r.id === "inflated")!;
    expect(bad.meanBrier).toBeGreaterThan(h.meanBrier);
    expect(bad.rank).toBeGreaterThan(h.rank);

    const suite = runAdversarialSuite({
      texts,
      labels,
      honestPredictions: honest,
    });
    const inflation = suite.attacks.find((a) => a.name === "confidence_inflation")!;
    expect(inflation.passed).toBe(true);
  });
});

describe("schemas", () => {
  it("rejects empty text", () => {
    const empty = DetectRequestSchema.safeParse({ text: "" });
    expect(empty.success).toBe(false);

    const missing = DetectRequestSchema.safeParse({});
    expect(missing.success).toBe(false);

    const both = DetectRequestSchema.safeParse({ text: "x", texts: ["y"] });
    expect(both.success).toBe(false);

    const ok = DetectRequestSchema.safeParse({ text: "hello" });
    expect(ok.success).toBe(true);
  });
});
