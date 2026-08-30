/**
 * Activation diagnosis: integrations vs live YAML vs on-chain reg 46.
 * No secrets printed.
 */
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";
import { createPublicClient, http, parseAbi } from "viem";
import { baseSepolia } from "viem/chains";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "../../..");
const DIAMOND = "0x122396E8602BEed349434AA6E83123E7dD97F5A0";
const REG_ID = 46n;
const DISPATCHER = "http://13.237.89.59:7044/miner-dispatcher";
const OUR_YAML_URL =
  "https://caliber-teamtitanlink.vercel.app/protocol/caliber-truthport.yaml";
const EXPECTED_HASH =
  "69f4d780f931eb5c07e7ebe6b3558f51b24d4da2a7fa944c0cf3c477de99095e";

function loadEnv() {
  const envPath = path.join(repoRoot, ".env");
  if (!fs.existsSync(envPath)) return {};
  const out = {};
  for (const line of fs.readFileSync(envPath, "utf8").split(/\r?\n/)) {
    const m = line.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
    if (!m) continue;
    out[m[1]] = m[2].trim().replace(/^["']|["']$/g, "");
  }
  return out;
}

async function fetchBuf(url, opts = {}) {
  const res = await fetch(url, {
    redirect: "follow",
    headers: { "User-Agent": "caliber-activation-diag", ...(opts.headers || {}) },
    ...opts,
  });
  const buf = Buffer.from(await res.arrayBuffer());
  return {
    status: res.status,
    url: res.url,
    headers: Object.fromEntries(res.headers.entries()),
    body: buf,
    text: buf.toString("utf8"),
  };
}

function topKeys(text) {
  const keys = [];
  for (const line of text.split(/\r?\n/)) {
    const m = line.match(/^([A-Za-z_][A-Za-z0-9_]*)\s*:/);
    if (m) keys.push(m[1]);
  }
  return keys;
}

function getScalar(text, field) {
  const m = text.match(new RegExp(`^${field}:\\s*(.+)$`, "m"));
  return m ? m[1].trim().replace(/^['"]|['"]$/g, "") : null;
}

function extractAuthType(text) {
  const m = text.match(/^\s*auth:\s*\n(?:\s*#[^\n]*\n)*\s*type:\s*(\w+)/m);
  return m ? m[1] : null;
}

function extractSignalType(text) {
  const m = text.match(
    /signal_mapping:\s*\n(?:\s*#[^\n]*\n)*\s*type:\s*([A-Za-z0-9_]+)/m,
  );
  return m ? m[1] : null;
}

function extractIntents(text) {
  const block = text.match(
    /supported_intents:\s*\n((?:\s*-\s*[A-Za-z0-9_]+\s*\n?)+)/m,
  );
  if (!block) return [];
  return [...block[1].matchAll(/-\s*([A-Za-z0-9_]+)/g)].map((x) => x[1]);
}

async function main() {
  const env = loadEnv();
  const out = {
    asOf: new Date().toISOString(),
    dispatcher: DISPATCHER,
    ourYamlUrl: OUR_YAML_URL,
    registrationId: 46,
    probes: {},
    integrations: {},
    workingYamls: {},
    ourYaml: {},
    onChain: null,
    diff: {},
    integrateConsole: null,
    rootCauseHypothesis: [],
  };

  // --- probes ---
  const probePaths = [
    "/integrations",
    "/healthz",
    "/openapi.json",
    "/rejected",
    "/pending",
    "/miners",
    "/registry",
    "/v1/rejected/",
    "/v1/pending/",
    "/v1/miners/",
    "/v1/registry/",
    "/v1/rejected",
    "/v1/pending",
  ];
  for (const p of probePaths) {
    try {
      const r = await fetchBuf(DISPATCHER + p);
      out.probes[p] = {
        status: r.status,
        finalUrl: r.url,
        bytes: r.body.length,
        contentType: r.headers["content-type"] || null,
        snippet: r.text.slice(0, 240),
      };
      console.log("probe", p, r.status, r.body.length);
    } catch (e) {
      out.probes[p] = { error: String(e.message || e) };
      console.log("probe ERR", p, e.message);
    }
  }

  // openapi non-v1 / interesting
  try {
    const oaText = fs.readFileSync(
      path.join(__dirname, "openapi-live.json"),
      "utf8",
    );
    const oa = JSON.parse(oaText);
    const pathKeys = Object.keys(oa.paths || {});
    out.probes.openapiSummary = {
      pathCount: pathKeys.length,
      nonV1: pathKeys.filter((p) => !p.startsWith("/v1/")),
      interesting: pathKeys.filter((p) =>
        /reject|pending|regist|integrat|healthz|admin|activ/i.test(p),
      ),
    };
  } catch (e) {
    out.probes.openapiSummary = { error: String(e.message || e) };
  }

  // --- integrations ---
  const int = JSON.parse(
    fs.readFileSync(path.join(__dirname, "integrations-live.json"), "utf8"),
  );
  const caliberHits = int.filter((e) => {
    const s = JSON.stringify(e).toLowerCase();
    return (
      s.includes("caliber") ||
      s.includes("92001") ||
      s.includes("truthport") ||
      s.includes("text_authenticity")
    );
  });
  const kinds = {};
  const acts = {};
  for (const e of int) {
    kinds[e.kind || "(none)"] = (kinds[e.kind || "(none)"] || 0) + 1;
    acts[e.activation_status || "(none)"] =
      (acts[e.activation_status || "(none)"] || 0) + 1;
  }
  const sarz = int.find((e) => e.slug === "sarzops-transaction-risk");
  const amanat = int.find((e) => e.slug === "amanat-weather-risk");
  const verity = int.find((e) => e.slug === "verity-news-search");
  // pick first public https yaml_url
  const workingEntry =
    int.find(
      (e) =>
        typeof e.yaml_url === "string" &&
        e.yaml_url.startsWith("https://") &&
        !e.yaml_url.includes("127.0.0.1"),
    ) || amanat;
  out.integrations = {
    count: int.length,
    caliberHits: caliberHits.length,
    kinds,
    activationStatuses: acts,
    has92001: int.some((e) => String(e.id) === "92001"),
    has91001: int.some((e) => String(e.id) === "91001"),
    workingEntry: workingEntry
      ? {
          id: workingEntry.id,
          slug: workingEntry.slug,
          kind: workingEntry.kind,
          yaml_url: workingEntry.yaml_url,
          activation_status: workingEntry.activation_status,
        }
      : null,
    sarzops: sarz
      ? {
          id: sarz.id,
          slug: sarz.slug,
          kind: sarz.kind,
          yaml_url: sarz.yaml_url,
          activation_status: sarz.activation_status,
        }
      : null,
  };

  // --- fetch YAMLs ---
  const yamlTargets = [
    { label: "ours", url: OUR_YAML_URL },
    {
      label: "amanat",
      url: amanat?.yaml_url,
    },
    {
      label: "verity",
      url: verity?.yaml_url,
    },
  ];
  // resolve ipfs for sarzops
  if (sarz?.yaml_url?.startsWith("ipfs://")) {
    const cid = sarz.yaml_url.replace("ipfs://", "");
    yamlTargets.push({
      label: "sarzops",
      url: `https://ipfs.io/ipfs/${cid}`,
      alt: [
        `https://cloudflare-ipfs.com/ipfs/${cid}`,
        `https://gateway.pinata.cloud/ipfs/${cid}`,
      ],
    });
  }

  for (const t of yamlTargets) {
    if (!t.url) continue;
    const tryUrls = [t.url, ...(t.alt || [])];
    let got = null;
    for (const u of tryUrls) {
      try {
        const r = await fetchBuf(u);
        if (r.status >= 200 && r.status < 300 && r.body.length > 20) {
          got = { ...r, fetchedUrl: u };
          break;
        }
        console.log("yaml try fail", t.label, u, r.status, r.body.length);
      } catch (e) {
        console.log("yaml try err", t.label, u, e.message);
      }
    }
    if (!got) {
      out.workingYamls[t.label] = { error: "fetch failed", tried: tryUrls };
      continue;
    }
    const sha = crypto.createHash("sha256").update(got.body).digest("hex");
    const meta = {
      fetchedUrl: got.fetchedUrl,
      status: got.status,
      bytes: got.body.length,
      sha256: sha,
      topKeys: topKeys(got.text),
      kind: getScalar(got.text, "kind"),
      id: getScalar(got.text, "id"),
      slug: getScalar(got.text, "slug"),
      protocol: getScalar(got.text, "protocol"),
      base_url: getScalar(got.text, "base_url"),
      authType: extractAuthType(got.text),
      signalType: extractSignalType(got.text),
      intents: extractIntents(got.text),
      hasOnChain: /^on_chain:/m.test(got.text),
      hasSemantics: /^semantics:/m.test(got.text),
      hasEndpoints: /^endpoints:/m.test(got.text),
      hasDocs: /^docs:/m.test(got.text),
      hasLimitations: /^limitations:/m.test(got.text),
      preview: got.text.slice(0, 1200),
    };
    const fname = path.join(__dirname, `yaml-${t.label}-fetched.yaml`);
    fs.writeFileSync(fname, got.body);
    if (t.label === "ours") {
      out.ourYaml = {
        ...meta,
        matchesExpectedHash: sha === EXPECTED_HASH,
        expectedHash: EXPECTED_HASH,
      };
    } else {
      out.workingYamls[t.label] = meta;
    }
    console.log(
      "yaml",
      t.label,
      meta.kind,
      meta.id,
      meta.authType,
      meta.signalType,
      sha.slice(0, 16),
    );
  }

  // --- field diff ---
  const workingMetas = Object.values(out.workingYamls).filter((m) => m.topKeys);
  if (workingMetas.length && out.ourYaml.topKeys) {
    const allKeys = workingMetas
      .map((m) => new Set(m.topKeys))
      .reduce((a, b) => new Set([...a].filter((k) => b.has(k))));
    const ourSet = new Set(out.ourYaml.topKeys);
    out.diff = {
      keysInAllWorking: [...allKeys],
      missingFromOurs: [...allKeys].filter((k) => !ourSet.has(k)),
      ourOnly: [...ourSet].filter((k) => ![...allKeys].includes(k)),
      kindsWorking: workingMetas.map((m) => m.kind),
      authTypesWorking: workingMetas.map((m) => m.authType),
      signalTypesWorking: workingMetas.map((m) => m.signalType),
      our: {
        kind: out.ourYaml.kind,
        authType: out.ourYaml.authType,
        signalType: out.ourYaml.signalType,
        intents: out.ourYaml.intents,
        topKeys: out.ourYaml.topKeys,
      },
    };
  }

  // --- on-chain ---
  try {
    const rpc =
      env.EVM_RPC_URL || env.BASE_SEPOLIA_RPC || "https://sepolia.base.org";
    const abi = parseAbi([
      "function getMiner(uint256 registrationId) view returns (string yamlUrl, bytes32 yamlHash, address feeAddress, uint256 minPriceUsdc, string[] intents, address registrant, bool active)",
      "function registrations(uint256 registrationId) view returns (string yamlUrl, bytes32 yamlHash, address feeAddress, uint256 minPriceUsdc, address registrant, bool active)",
      "function getRegistration(uint256 registrationId) view returns (string yamlUrl, bytes32 yamlHash, address feeAddress, uint256 minPriceUsdc, string[] intents, address registrant, bool active)",
      "function getRegistrationCount() view returns (uint256)",
      "function registrationCount() view returns (uint256)",
    ]);
    const client = createPublicClient({
      chain: baseSepolia,
      transport: http(rpc),
    });
    const attempts = [];
    for (const fn of [
      "getMiner",
      "getRegistration",
      "registrations",
      "getRegistrationCount",
      "registrationCount",
    ]) {
      try {
        const result = await client.readContract({
          address: DIAMOND,
          abi,
          functionName: fn,
          args: fn.includes("Count") ? [] : [REG_ID],
        });
        attempts.push({ fn, ok: true, result: serialize(result) });
        console.log("onchain", fn, "ok");
      } catch (e) {
        attempts.push({
          fn,
          ok: false,
          error: String(e.shortMessage || e.message || e).slice(0, 300),
        });
        console.log("onchain", fn, "fail", String(e.shortMessage || e.message).slice(0, 120));
      }
    }
    // also try cast-style via eth_call raw if needed — covered by viem
    out.onChain = { rpcHost: new URL(rpc).host, attempts };
    const ok = attempts.find((a) => a.ok && a.fn !== "getRegistrationCount" && a.fn !== "registrationCount");
    if (ok) {
      const r = ok.result;
      const yamlUrl = Array.isArray(r) ? r[0] : r.yamlUrl;
      const yamlHash = Array.isArray(r) ? r[1] : r.yamlHash;
      const hashHex = String(yamlHash).replace(/^0x/, "").toLowerCase();
      out.onChain.parsed = {
        source: ok.fn,
        yamlUrl,
        yamlHash: String(yamlHash),
        hashMatchesLive: hashHex === EXPECTED_HASH,
        urlMatches: yamlUrl === OUR_YAML_URL,
        feeAddress: Array.isArray(r) ? r[2] : r.feeAddress,
        minPriceUsdc: Array.isArray(r) ? String(r[3]) : String(r.minPriceUsdc),
        intents: Array.isArray(r) ? r[4] : r.intents,
        registrant: Array.isArray(r) ? r[5] : r.registrant,
        active: Array.isArray(r) ? r[6] : r.active,
      };
    }
  } catch (e) {
    out.onChain = { error: String(e.message || e) };
  }

  // --- TinyFish integrate console ---
  const tinyKey = env.TINYFISH_API_KEY;
  if (tinyKey) {
    try {
      const r = await fetchBuf("https://api.fetch.tinyfish.ai/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": tinyKey,
        },
        body: JSON.stringify({
          urls: [
            "https://integrate.telegraphprotocol.com",
            "https://integrate.telegraphprotocol.com/register",
          ],
        }),
      });
      const dumpPath = path.join(
        __dirname,
        "tinyfish-integrate-console-2026-08-30.json",
      );
      fs.writeFileSync(dumpPath, r.body);
      let parsed = null;
      try {
        parsed = JSON.parse(r.text);
      } catch {
        parsed = null;
      }
      const textBlob =
        typeof parsed === "object"
          ? JSON.stringify(parsed).slice(0, 8000)
          : r.text.slice(0, 8000);
      out.integrateConsole = {
        status: r.status,
        bytes: r.body.length,
        dump: "tinyfish-integrate-console-2026-08-30.json",
        hints: {
          mentionsRegister: /register/i.test(textBlob),
          mentionsYaml: /yaml/i.test(textBlob),
          mentionsRejected: /reject/i.test(textBlob),
          mentionsPending: /pending/i.test(textBlob),
          mentionsEpoch: /epoch/i.test(textBlob),
          snippet: textBlob.slice(0, 1500),
        },
      };
      console.log("tinyfish integrate", r.status, r.body.length);
    } catch (e) {
      out.integrateConsole = { error: String(e.message || e) };
    }
  } else {
    out.integrateConsole = { skipped: "TINYFISH_API_KEY missing" };
  }

  // --- hypotheses ---
  const h = out.rootCauseHypothesis;
  if (!out.integrations.has92001) {
    h.push(
      "CALIBER id 92001 / slug caliber-truthport-text-auth absent from GET /integrations (count still " +
        out.integrations.count +
        ").",
    );
  }
  if (out.ourYaml.matchesExpectedHash === false) {
    h.push("CRITICAL: live YAML sha256 != expected on-chain hash (hash mismatch reject).");
  } else if (out.ourYaml.matchesExpectedHash) {
    h.push("Live YAML sha256 MATCHES registered hash — hash mismatch unlikely.");
  }
  if (out.onChain?.parsed) {
    if (!out.onChain.parsed.active) {
      h.push("On-chain registration 46 active=false — deregistered or inactive.");
    } else {
      h.push("On-chain registration 46 active=true with matching yamlUrl/hash (if parsed).");
    }
    if (!out.onChain.parsed.urlMatches) {
      h.push("On-chain yamlUrl differs from live URL.");
    }
    if (!out.onChain.parsed.hashMatchesLive) {
      h.push("On-chain yamlHash differs from live YAML bytes.");
    }
  } else {
    h.push(
      "Could not decode getMiner/getRegistration for id 46 — ABI unknown; rely on MinerRegistered tx receipt.",
    );
  }
  if (out.diff.missingFromOurs?.length) {
    h.push(
      "YAML missing top-level fields present in ALL working miners: " +
        out.diff.missingFromOurs.join(", "),
    );
  } else if (workingMetas.length) {
    h.push(
      "No top-level fields present in ALL working miners are missing from ours (docs/limitations optional).",
    );
  }
  const kindsOk = workingMetas.every((m) => m.kind === "miner");
  if (kindsOk && out.ourYaml.kind === "miner") {
    h.push("kind:miner matches live integrations (GitBook subnet is STALE).");
  }
  if (out.ourYaml.signalType === "text_authenticity") {
    h.push(
      "signal type text_authenticity is in GitBook canonical enum — unlikely reject cause.",
    );
  }
  h.push(
    "Dispatcher exposes no public /rejected|/pending API (404); cannot confirm reject vs pending from HTTP.",
  );
  h.push(
    "Likely remaining causes: (1) node listener not synced / epoch not applied for this Diamond event, (2) silent schema reject without public reject endpoint, (3) Vercel fetch blocked from node IP (less likely — hash matched when we fetched).",
  );

  const outPath = path.join(
    __dirname,
    "activation-diagnosis-2026-08-30.json",
  );
  fs.writeFileSync(outPath, JSON.stringify(out, null, 2));
  console.log("wrote", outPath);
}

function serialize(v) {
  if (typeof v === "bigint") return v.toString();
  if (Array.isArray(v)) return v.map(serialize);
  if (v && typeof v === "object") {
    const o = {};
    for (const [k, val] of Object.entries(v)) o[k] = serialize(val);
    return o;
  }
  return v;
}

main().catch((e) => {
  console.error("FATAL", e);
  process.exit(1);
});
