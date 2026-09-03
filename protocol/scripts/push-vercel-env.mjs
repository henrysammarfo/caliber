import fs from "node:fs";
import { spawnSync } from "node:child_process";

const envText = fs.readFileSync(".env", "utf8");
function get(k) {
  const m = envText.match(new RegExp(`^${k}=(.*)$`, "m"));
  if (!m) return "";
  return m[1].trim().replace(/^["']|["']$/g, "");
}

const vars = {
  PRIVATE_KEY: get("PRIVATE_KEY") || get("EVM_PRIVATE_KEY"),
  EVM_PRIVATE_KEY: get("PRIVATE_KEY") || get("EVM_PRIVATE_KEY"),
  SUPABASE_URL: get("SUPABASE_URL") || get("VITE_SUPABASE_URL"),
  SUPABASE_PUBLISHABLE_KEY: get("SUPABASE_PUBLISHABLE_KEY") || get("VITE_SUPABASE_PUBLISHABLE_KEY"),
  VITE_SUPABASE_URL: get("VITE_SUPABASE_URL") || get("SUPABASE_URL"),
  VITE_SUPABASE_PUBLISHABLE_KEY: get("VITE_SUPABASE_PUBLISHABLE_KEY") || get("SUPABASE_PUBLISHABLE_KEY"),
  VITE_SUPABASE_PROJECT_ID: get("VITE_SUPABASE_PROJECT_ID") || get("SUPABASE_PROJECT_ID"),
  SUPABASE_PROJECT_ID: get("SUPABASE_PROJECT_ID") || get("VITE_SUPABASE_PROJECT_ID"),
};

for (const [k, v] of Object.entries(vars)) {
  console.log(`${k}: ${v ? `SET len=${v.length}` : "MISSING"}`);
}

const targets = ["production", "preview", "development"];
for (const [key, value] of Object.entries(vars)) {
  if (!value) continue;
  for (const target of targets) {
    const r = spawnSync(
      "npx",
      ["vercel", "env", "add", key, target, "--sensitive", "--force", "--yes", "--scope", "teamtitanlink"],
      {
        input: value + "\n",
        encoding: "utf8",
        shell: true,
        cwd: process.cwd(),
      },
    );
    const out = ((r.stdout || "") + (r.stderr || "")).trim().split(/\r?\n/).slice(-3).join(" | ");
    console.log(`ADD ${key} ${target}: exit=${r.status} ${out.slice(0, 180)}`);
  }
}
