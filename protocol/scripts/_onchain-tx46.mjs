/**
 * eth_getTransactionReceipt for registration 46 tx; confirm yamlUrl/hash from event.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createPublicClient, http, decodeEventLog, parseAbi } from "viem";
import { baseSepolia } from "viem/chains";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TX =
  "0xbed2fd2c72cce57838c654de729b8d1ae88bf8096bdc29ac60df460ae0ed6c20";
const DIAMOND = "0x122396E8602BEed349434AA6E83123E7dD97F5A0";
const EXPECTED =
  "69f4d780f931eb5c07e7ebe6b3558f51b24d4da2a7fa944c0cf3c477de99095e";
const OUR_URL =
  "https://caliber-teamtitanlink.vercel.app/protocol/caliber-truthport.yaml";

const abi = parseAbi([
  "event MinerRegistered(uint256 indexed registrationId, address indexed feeAddress, string yamlUrl, bytes32 yamlHash)",
  "event MinerDeregistered(uint256 indexed registrationId)",
]);

const client = createPublicClient({
  chain: baseSepolia,
  transport: http("https://sepolia.base.org"),
});

const receipt = await client.getTransactionReceipt({ hash: TX });
const decoded = [];
for (const log of receipt.logs) {
  if (log.address.toLowerCase() !== DIAMOND.toLowerCase()) continue;
  try {
    const d = decodeEventLog({ abi, data: log.data, topics: log.topics });
    decoded.push({
      eventName: d.eventName,
      args: JSON.parse(
        JSON.stringify(d.args, (_, v) =>
          typeof v === "bigint" ? v.toString() : v,
        ),
      ),
    });
  } catch {
    decoded.push({
      topics: log.topics,
      dataLen: log.data?.length,
    });
  }
}

const reg = decoded.find((d) => d.eventName === "MinerRegistered");
const out = {
  tx: TX,
  status: receipt.status,
  blockNumber: Number(receipt.blockNumber),
  decoded,
  check: reg
    ? {
        registrationId: reg.args.registrationId,
        yamlUrl: reg.args.yamlUrl,
        yamlHash: reg.args.yamlHash,
        urlMatches: reg.args.yamlUrl === OUR_URL,
        hashMatchesExpected:
          String(reg.args.yamlHash).replace(/^0x/, "").toLowerCase() ===
          EXPECTED,
      }
    : null,
};
fs.writeFileSync(
  path.join(__dirname, "_onchain-tx46.json"),
  JSON.stringify(out, null, 2),
);
console.log(JSON.stringify(out.check || out, null, 2));
