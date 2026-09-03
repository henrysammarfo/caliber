/**
 * Apply query_log migration via Supabase Management API if SUPABASE_ACCESS_TOKEN is set.
 * Falls back to printing SQL for dashboard paste. Never prints secrets.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const envText = fs.readFileSync(path.join(root, ".env"), "utf8");
function get(k) {
  const m = envText.match(new RegExp(`^${k}=(.*)$`, "m"));
  return m ? m[1].trim().replace(/^["']|["']$/g, "") : "";
}

const projectId = get("SUPABASE_PROJECT_ID") || get("VITE_SUPABASE_PROJECT_ID");
const token = get("SUPABASE_ACCESS_TOKEN") || process.env.SUPABASE_ACCESS_TOKEN || "";
const sql = fs.readFileSync(
  path.join(root, "supabase/migrations/20260903160000_create_query_log.sql"),
  "utf8",
);

console.log("projectId", projectId ? `SET len=${projectId.length}` : "MISSING");
console.log("accessToken", token ? `SET len=${token.length}` : "MISSING");

if (!projectId) {
  console.error("No SUPABASE_PROJECT_ID");
  process.exit(1);
}

if (!token) {
  console.log("NO_TOKEN — open Supabase SQL editor and run migration file.");
  console.log("FILE", "supabase/migrations/20260903160000_create_query_log.sql");
  process.exit(2);
}

const res = await fetch(`https://api.supabase.com/v1/projects/${projectId}/database/query`, {
  method: "POST",
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ query: sql }),
});
const text = await res.text();
console.log("status", res.status);
console.log("body", text.slice(0, 500));
process.exit(res.ok ? 0 : 1);
