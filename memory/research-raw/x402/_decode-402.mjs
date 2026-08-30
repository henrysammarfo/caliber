import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";

const outDir = path.dirname(fileURLToPath(import.meta.url));
const raw = JSON.parse(fs.readFileSync(path.join(outDir, "402-response.json"), "utf8"));
const b64 = raw.headers["payment-required"];
const decoded = JSON.parse(Buffer.from(b64, "base64").toString("utf8"));
fs.writeFileSync(path.join(outDir, "402-decoded.json"), JSON.stringify(decoded, null, 2));
console.log(JSON.stringify(decoded, null, 2));
