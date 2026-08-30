import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");
const envPath = path.join(root, ".env");
const env = fs.existsSync(envPath) ? fs.readFileSync(envPath, "utf8") : "";

function get(k) {
  const m = env.match(new RegExp(`^${k}=(.*)$`, "m"));
  if (!m) return null;
  return m[1].trim().replace(/^["']|["']$/g, "");
}

const keys = [
  "TAVILY_API_KEY",
  "TINYFISH_API_KEY",
  "PRIVATE_KEY",
  "FACILITATOR_URL",
  "CALIBER_MINER_API_KEY",
];
for (const k of keys) {
  const v = get(k);
  console.log(
    `${k}:`,
    v ? `SET len=${v.length} prefix=${v.slice(0, 4)}...` : "MISSING",
  );
}

const pk = get("PRIVATE_KEY");
if (pk) {
  try {
    const { Wallet } = await import("ethers");
    const w = new Wallet(pk.startsWith("0x") ? pk : `0x${pk}`);
    console.log("PRIVATE_KEY address:", w.address);
  } catch {
    try {
      const { privateKeyToAccount } = await import("viem/accounts");
      const a = privateKeyToAccount(pk.startsWith("0x") ? pk : `0x${pk}`);
      console.log("PRIVATE_KEY address:", a.address);
    } catch {
      console.log("PRIVATE_KEY address: (need ethers/viem)");
    }
  }
}
