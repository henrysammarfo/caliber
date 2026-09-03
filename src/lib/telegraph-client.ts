/**
 * Telegraph x402 client — server-side only.
 * Wraps fetch with automatic x402 payment handling via EVM_PRIVATE_KEY / PRIVATE_KEY.
 */
import { wrapFetchWithPayment, x402Client } from "@x402/fetch";
import { ExactEvmScheme } from "@x402/evm/exact/client";
import { privateKeyToAccount } from "viem/accounts";

const TELEGRAPH_NODE = "http://13.237.89.59:7044";
const DISPATCHER = `${TELEGRAPH_NODE}/miner-dispatcher`;
const DEFAULT_RPC = "https://sepolia.base.org";
const TRUTHPORT_SUBNET_ID = 20260830;

export const INTENTS = [
  "AI_TEXT_DETECTION",
  "WEATHER_FORECAST",
  "CRYPTO_PRICE",
  "FRAUD_DETECTION",
  "NEWS_SEARCH",
] as const;

export type TelegraphIntent = (typeof INTENTS)[number];

/** Dispatcher routes for Track 3 intents — live catalog 2026-09-03. */
const INTENT_ROUTES: Record<
  TelegraphIntent,
  { id: number; slug: string; path: string; method: "GET" | "POST" }
> = {
  AI_TEXT_DETECTION: { id: TRUTHPORT_SUBNET_ID, slug: "caliber-truthport-text-auth", path: "/detect", method: "POST" },
  WEATHER_FORECAST: { id: 82920263, slug: "weathertop-v3", path: "/weather-forecast", method: "GET" },
  CRYPTO_PRICE: { id: 7311, slug: "optivis-crypto-price", path: "/price", method: "GET" },
  FRAUD_DETECTION: { id: 91001, slug: "sarzops-transaction-risk", path: "/fraud", method: "POST" },
  NEWS_SEARCH: { id: 9004, slug: "verity-news-search", path: "/news", method: "GET" },
};

export interface IntelQuery {
  intent: TelegraphIntent;
  query: string;
  params?: Record<string, unknown> | undefined;
  subnetId?: number | undefined;
}

export interface IntelResult {
  ok: boolean;
  intent: TelegraphIntent;
  query: string;
  minerSlug?: string | undefined;
  minerId?: number | undefined;
  confidence?: number | undefined;
  response: unknown;
  x402Tx?: string | undefined;
  costUsdc?: number | undefined;
  latencyMs: number;
  error?: string | undefined;
}

function getPrivateKey(): `0x${string}` {
  const key = process.env["EVM_PRIVATE_KEY"] ?? process.env["PRIVATE_KEY"];
  if (!key) throw new Error("EVM_PRIVATE_KEY not set");
  return (key.startsWith("0x") ? key : `0x${key}`) as `0x${string}`;
}

let _paidFetch: typeof fetch | null = null;

function getPaidFetch(): typeof fetch {
  if (_paidFetch) return _paidFetch;
  const account = privateKeyToAccount(getPrivateKey());
  const rpcUrl = process.env["EVM_RPC_URL"] || process.env["BASE_SEPOLIA_RPC"] || DEFAULT_RPC;
  const client = new x402Client();
  client.register("eip155:*", new ExactEvmScheme(account, { rpcUrl }));
  _paidFetch = wrapFetchWithPayment(fetch, client);
  return _paidFetch;
}

function decodePaymentHeader(value: string | null): { txHash?: string | undefined; amount?: number | undefined } {
  if (!value) return {};
  try {
    const json = value.startsWith("{")
      ? JSON.parse(value)
      : JSON.parse(Buffer.from(value, "base64").toString("utf8"));
    const txHash = json.txHash || json.transaction_hash || json.transaction;
    const rawAmount = json.amount ?? json.value;
    return {
      txHash: typeof txHash === "string" ? txHash : undefined,
      amount: rawAmount != null ? Number(rawAmount) / 1e6 : undefined,
    };
  } catch {
    return {};
  }
}

/**
 * Query Telegraph miners via miner-dispatcher with automatic x402 payment.
 * AI_TEXT_DETECTION always hits TRUTHPORT so Track 3 demand counts for our miner.
 */
export async function queryTelegraph(q: IntelQuery): Promise<IntelResult> {
  const start = Date.now();
  const paidFetch = getPaidFetch();
  const route = INTENT_ROUTES[q.intent];
  const minerId = q.subnetId ?? route.id;
  const path = route.path.replace(/^\//, "");
  const urlBase = `${DISPATCHER}/v1/${minerId}/${path}`;

  const payload: Record<string, unknown> = {
    query: q.query,
    text: q.query,
    q: q.query,
    location: q.query,
    symbol: q.query,
    ...q.params,
  };

  try {
    const url =
      route.method === "GET"
        ? `${urlBase}?${new URLSearchParams({
            query: q.query,
            text: q.query,
            q: q.query,
          }).toString()}`
        : urlBase;

    const res = await paidFetch(url, {
      method: route.method,
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      ...(route.method === "POST" ? { body: JSON.stringify(payload) } : {}),
    });

    const payment = decodePaymentHeader(
      res.headers.get("PAYMENT-RESPONSE") || res.headers.get("X-PAYMENT-RESPONSE"),
    );

    if (!res.ok) {
      const text = await res.text();
      return {
        ok: false,
        intent: q.intent,
        query: q.query,
        minerSlug: route.slug,
        minerId,
        response: null,
        latencyMs: Date.now() - start,
        error: `HTTP ${res.status} ${url}: ${text.slice(0, 500)}`,
      };
    }

    const data = (await res.json()) as Record<string, unknown>;
    const nested = (data["result"] ?? data["data"] ?? data) as Record<string, unknown>;
    return {
      ok: true,
      intent: q.intent,
      query: q.query,
      minerSlug: (data["miner_slug"] as string) || (data["model"] as string) || route.slug,
      minerId,
      confidence: (nested["confidence"] as number) ?? (nested["score"] as number) ?? (data["confidence"] as number),
      response: data,
      x402Tx: payment.txHash,
      costUsdc: payment.amount ?? 0.01,
      latencyMs: Date.now() - start,
    };
  } catch (e) {
    return {
      ok: false,
      intent: q.intent,
      query: q.query,
      minerSlug: route.slug,
      minerId,
      response: null,
      latencyMs: Date.now() - start,
      error: e instanceof Error ? e.message : "Unknown error",
    };
  }
}

/** List all integrations from the node (free, no payment). */
export async function listIntegrations(): Promise<unknown[]> {
  const res = await fetch(`${TELEGRAPH_NODE}/miner-dispatcher/integrations`);
  if (!res.ok) throw new Error(`Node returned ${res.status}`);
  const data = await res.json();
  return Array.isArray(data) ? data : data.integrations ?? [];
}
