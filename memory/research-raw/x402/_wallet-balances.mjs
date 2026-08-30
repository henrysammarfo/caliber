import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import { pathToFileURL } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");
const protocolDir = path.join(root, "protocol");
const require = createRequire(path.join(protocolDir, "package.json"));

const env = fs.readFileSync(path.join(root, ".env"), "utf8");
function get(k) {
  const m = env.match(new RegExp(`^${k}=(.*)$`, "m"));
  if (!m) return null;
  return m[1].trim().replace(/^["']|["']$/g, "");
}
const pk = get("PRIVATE_KEY");
if (!pk) {
  console.log("PRIVATE_KEY MISSING");
  process.exit(1);
}

const { privateKeyToAccount } = await import(
  pathToFileURL(require.resolve("viem/accounts")).href
);
const address = privateKeyToAccount(pk.startsWith("0x") ? pk : `0x${pk}`).address;

const RPC = "https://sepolia.base.org";
const USDC = "0x036CbD53842c5426634e7929541eC2318f3dCF7e";
const FEE = "0x9ADd0ac311e9E528800afc3F4A04e9cDe52C9cE0";

async function balanceOf(who) {
  const data = "0x70a08231000000000000000000000000" + who.slice(2).toLowerCase();
  const res = await fetch(RPC, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: 1,
      method: "eth_call",
      params: [{ to: USDC, data }, "latest"],
    }),
  });
  const j = await res.json();
  return BigInt(j.result);
}

async function ethBalance(who) {
  const res = await fetch(RPC, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: 1,
      method: "eth_getBalance",
      params: [who, "latest"],
    }),
  });
  const j = await res.json();
  return BigInt(j.result);
}

const usdcPayer = await balanceOf(address);
const usdcFee = await balanceOf(FEE);
const ethPayer = await ethBalance(address);
console.log("payerAddress", address);
console.log("payer===fee", address.toLowerCase() === FEE.toLowerCase());
console.log("payerUsdc", (Number(usdcPayer) / 1e6).toFixed(6));
console.log("feeUsdc", (Number(usdcFee) / 1e6).toFixed(6));
console.log("payerEth", (Number(ethPayer) / 1e18).toFixed(6));
