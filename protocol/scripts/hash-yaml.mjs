#!/usr/bin/env node
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const yamlPath = join(
  dirname(fileURLToPath(import.meta.url)),
  "..",
  "yaml",
  "caliber-truthport.yaml",
);
const buf = readFileSync(yamlPath);
const sha = createHash("sha256").update(buf).digest("hex");
console.log(sha);
console.log(`file=${yamlPath}`);
console.log(`bytes=${buf.length}`);
