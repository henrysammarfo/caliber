/**
 * Load CI holdout fixture. RAID is primary real holdout — see provenance.md.
 */

import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import type { HoldoutItem } from "../shared/types.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

export function holdoutFixturePath(): string {
  return join(__dirname, "holdout.fixture.json");
}

export function loadHoldout(opts?: {
  partition?: "holdout" | "train_cal" | "all";
}): HoldoutItem[] {
  const raw = readFileSync(holdoutFixturePath(), "utf8");
  const data = JSON.parse(raw) as unknown;
  if (!Array.isArray(data)) {
    throw new Error("holdout.fixture.json must be a JSON array");
  }
  const items: HoldoutItem[] = [];
  for (const row of data) {
    const item = validateItem(row);
    items.push(item);
  }
  const partition = opts?.partition ?? "all";
  if (partition === "all") return items;
  return items.filter((i) => i.partition === partition);
}

function validateItem(row: unknown): HoldoutItem {
  if (row === null || typeof row !== "object") {
    throw new Error("invalid holdout row");
  }
  const r = row as Record<string, unknown>;
  if (typeof r.id !== "string" || !r.id) throw new Error("holdout row missing id");
  if (typeof r.text !== "string" || !r.text) throw new Error(`holdout ${r.id}: missing text`);
  if (r.label !== 0 && r.label !== 1) throw new Error(`holdout ${r.id}: label must be 0|1`);
  if (typeof r.source !== "string") throw new Error(`holdout ${r.id}: missing source`);
  if (r.partition !== "holdout" && r.partition !== "train_cal") {
    throw new Error(`holdout ${r.id}: bad partition`);
  }
  return {
    id: r.id,
    text: r.text,
    label: r.label,
    source: r.source,
    partition: r.partition,
  };
}
