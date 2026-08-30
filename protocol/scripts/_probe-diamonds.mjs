import { createPublicClient, http, parseAbi } from "viem";
import { baseSepolia } from "viem/chains";

const CONSOLE = "0x5a2324aA18613FAD4e44bDF0d6c73Ec1f6D87ff8";
const DOCS = "0x122396E8602BEed349434AA6E83123E7dD97F5A0";
const YAML_URL = "https://gateway.pinata.cloud/ipfs/QmVTkdLFe6sxJpXqBkPeHzBGwy392q9ezDRP7WgEobxYS6";
const YAML_HASH = "0x5d9c3d2d95589a699b84a50f3e46ed42facb3c479f159bd2c8cbb1eeca03fe3c";
const FEE = "0x9ADd0ac311e9E528800afc3F4A04e9cDe52C9cE0";
const MIN_PRICE = 10000n;
const INTENTS = ["AI_TEXT_DETECTION"];

const abi = parseAbi([
  "function registerMiner(string yamlUrl, bytes32 yamlHash, address feeAddress, uint256 minPriceUsdc, string[] intents) returns (uint256)",
  "function registerWasm(bytes32 wasmHash, string wasmUrl, string intent) returns (uint256)",
]);

const client = createPublicClient({
  chain: baseSepolia,
  transport: http("https://sepolia.base.org", { timeout: 25_000 }),
});

async function probe(label, addr) {
  const out = { label, addr };
  for (const fn of ["registerMiner", "registerWasm"]) {
    try {
      if (fn === "registerMiner") {
        await client.simulateContract({
          address: addr,
          abi,
          functionName: "registerMiner",
          args: [YAML_URL, YAML_HASH, FEE, MIN_PRICE, INTENTS],
          account: FEE,
        });
        out[fn] = "simulate_ok";
      } else {
        await client.simulateContract({
          address: addr,
          abi,
          functionName: "registerWasm",
          args: ["0x" + "11".repeat(32), "https://example.com/x.wasm", "AI_TEXT_DETECTION"],
          account: FEE,
        });
        out[fn] = "simulate_ok_or_logic";
      }
    } catch (e) {
      out[fn] = (e.shortMessage || e.message || String(e)).slice(0, 280);
    }
  }
  console.log(JSON.stringify(out, null, 2));
}

await probe("console", CONSOLE);
await probe("docs", DOCS);
