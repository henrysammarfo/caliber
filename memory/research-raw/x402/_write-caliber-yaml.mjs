import fs from "node:fs";
import crypto from "node:crypto";
import YAML from "js-yaml";

const yaml = `version: "1"
kind: miner
id: 92001
slug: caliber-truthport-text-auth
protocol: generic
name: CALIBER TRUTHPORT Text Authenticity
description: >
  Deterministic text authenticity miner: calibrated P(AI) from surface linguistic
  features. Production calibration uses labeled holdout (RAID primary). Registers
  the HTTP detect surface for Telegraph routing and x402 gating.
base_url: https://caliber-teamtitanlink.vercel.app

auth:
  type: none

rate_limit_per_sec: 5
cache_ttl_sec: 0
circuit_threshold: 5
circuit_cooldown_seconds: 30

endpoints:
  - path: /detect
    external_path: /detect
    method: POST
    description: Score text for AI-likeness (confidence in [0,1], isAI threshold 0.5).

input_schema:
  type: object
  properties:
    text:
      type: string
      maxLength: 50000
    texts:
      type: array
      maxItems: 64
      items:
        type: string
        maxLength: 50000

output_schema:
  type: object
  properties:
    confidence:
      type: number
      minimum: 0
      maximum: 1
    isAI:
      type: boolean
    explanation:
      type: string
    model:
      type: string

semantics:
  signal_mapping:
    confidence_field: confidence
    label_field: isAI
    reason_field: explanation
  supported_intents:
    - AI_TEXT_DETECTION
    - CONTENT_VERIFICATION
`;

const paths = [
  "protocol/yaml/caliber-truthport.yaml",
  "public/protocol/caliber-truthport.yaml",
];
for (const p of paths) fs.writeFileSync(p, yaml, "utf8");
const buf = fs.readFileSync(paths[0]);
const h = crypto.createHash("sha256").update(buf).digest("hex");
const d = YAML.load(buf.toString("utf8"));
console.log(
  JSON.stringify(
    {
      PARSE_OK: !!d,
      has_on_chain: Object.prototype.hasOwnProperty.call(d, "on_chain"),
      sha256: h,
      bytes: buf.length,
      identical:
        crypto.createHash("sha256").update(fs.readFileSync(paths[1])).digest("hex") ===
        h,
      keys: Object.keys(d),
      id: d.id,
      protocol: d.protocol,
      auth: d.auth,
      intents: d.semantics?.supported_intents,
    },
    null,
    2,
  ),
);
