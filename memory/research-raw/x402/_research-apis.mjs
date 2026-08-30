/**
 * Research helper — reads keys from process.env only (set by caller).
 * Never prints key values.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const outDir = path.dirname(fileURLToPath(import.meta.url));
const tavily = process.env.TAVILY_API_KEY;
const tiny = process.env.TINYFISH_API_KEY;
console.log("TAVILY", tavily ? "SET" : "MISSING", "TINYFISH", tiny ? "SET" : "MISSING");

if (tavily) {
  const body = {
    api_key: tavily,
    query:
      "Telegraph Protocol miner-dispatcher x402 Base Sepolia subnet-dispatcher integrate.telegraphprotocol.com servers URL",
    search_depth: "advanced",
    include_answer: true,
    max_results: 10,
  };
  const res = await fetch("https://api.tavily.com/search", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
  const json = await res.json();
  // strip api_key if echoed
  fs.writeFileSync(
    path.join(outDir, "tavily-x402-dispatcher-2026-08-30.json"),
    JSON.stringify({ status: res.status, ...json }, null, 2),
  );
  console.log("tavily status", res.status, "answer?", Boolean(json.answer));
}

if (tiny) {
  const searchUrl = new URL("https://api.search.tinyfish.ai");
  searchUrl.searchParams.set(
    "query",
    "Telegraph miner-dispatcher x402 Base Sepolia API URL subnet",
  );
  const sres = await fetch(searchUrl, { headers: { "X-API-Key": tiny } });
  const stext = await sres.text();
  fs.writeFileSync(
    path.join(outDir, "tinyfish-search-x402-2026-08-30.json"),
    JSON.stringify({ status: sres.status, body: (() => { try { return JSON.parse(stext); } catch { return stext.slice(0, 5000); } })() }, null, 2),
  );
  console.log("tinyfish search", sres.status);

  const fres = await fetch("https://api.fetch.tinyfish.ai/", {
    method: "POST",
    headers: { "X-API-Key": tiny, "content-type": "application/json" },
    body: JSON.stringify({
      urls: [
        "https://telegraph-2.gitbook.io/telegraph/miner-registry/x402-payment.md",
        "https://integrate.telegraphprotocol.com/",
        "https://github.com/telegraphprotocol/Telegraph-api-docs",
      ],
      format: "markdown",
    }),
  });
  const ftext = await fres.text();
  fs.writeFileSync(
    path.join(outDir, "tinyfish-fetch-x402-2026-08-30.json"),
    JSON.stringify({ status: fres.status, body: (() => { try { return JSON.parse(ftext); } catch { return ftext.slice(0, 8000); } })() }, null, 2),
  );
  console.log("tinyfish fetch", fres.status);
}
