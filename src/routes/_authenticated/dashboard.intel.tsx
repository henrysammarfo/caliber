import { createFileRoute } from "@tanstack/react-router";
import { useState, useCallback } from "react";
import {
  Brain,
  CloudSun,
  Coins,
  ShieldAlert,
  Newspaper,
  Loader2,
  CheckCircle2,
  XCircle,
  Zap,
  Clock,
} from "lucide-react";
import { DashHeader, Panel, StatCard } from "@/components/dash/DashKit";
import { usePageView } from "@/lib/use-analytics";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/dashboard/intel")({
  head: () => ({
    meta: [
      { title: "Intelligence Console — CALIBER" },
      {
        name: "description",
        content: "Query Telegraph miners across 5 intents via x402 — AI text detection, weather, crypto, fraud, news.",
      },
    ],
  }),
  component: IntelPage,
});

const INTENT_CONFIG = [
  {
    id: "AI_TEXT_DETECTION" as const,
    label: "AI Text",
    icon: Brain,
    placeholder: "Paste text to check if AI-generated...",
    inputType: "textarea" as const,
  },
  {
    id: "WEATHER_FORECAST" as const,
    label: "Weather",
    icon: CloudSun,
    placeholder: "e.g. What's the weather in New York?",
    inputType: "text" as const,
  },
  {
    id: "CRYPTO_PRICE" as const,
    label: "Crypto",
    icon: Coins,
    placeholder: "e.g. What is the current price of Bitcoin?",
    inputType: "text" as const,
  },
  {
    id: "FRAUD_DETECTION" as const,
    label: "Fraud",
    icon: ShieldAlert,
    placeholder: "Describe a transaction or paste data to scan...",
    inputType: "textarea" as const,
  },
  {
    id: "NEWS_SEARCH" as const,
    label: "News",
    icon: Newspaper,
    placeholder: "e.g. Latest news about AI regulation",
    inputType: "text" as const,
  },
] as const;

type Intent = (typeof INTENT_CONFIG)[number]["id"];

interface QueryResult {
  id: string;
  intent: Intent;
  query: string;
  ok: boolean;
  minerSlug?: string;
  confidence?: number;
  response: unknown;
  x402Tx?: string;
  costUsdc?: number;
  latencyMs: number;
  error?: string;
  timestamp: Date;
}

function IntelPage() {
  usePageView("Intelligence");
  const [activeIntent, setActiveIntent] = useState<Intent>("AI_TEXT_DETECTION");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<QueryResult[]>([]);
  const [totalQueries, setTotalQueries] = useState(0);
  const [totalCost, setTotalCost] = useState(0);

  const config = INTENT_CONFIG.find((c) => c.id === activeIntent)!;

  const runQuery = useCallback(async () => {
    if (!query.trim() || loading) return;
    setLoading(true);

    try {
      const session = await supabase.auth.getSession();
      const token = session.data.session?.access_token;

      const res = await fetch("/intel", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ intent: activeIntent, query: query.trim() }),
      });

      const data = await res.json();
      const result: QueryResult = {
        id: crypto.randomUUID(),
        intent: activeIntent,
        query: query.trim(),
        ok: data.ok ?? false,
        minerSlug: data.minerSlug,
        confidence: data.confidence,
        response: data.response,
        x402Tx: data.x402Tx,
        costUsdc: data.costUsdc,
        latencyMs: data.latencyMs ?? 0,
        error: data.error,
        timestamp: new Date(),
      };

      setResults((prev) => [result, ...prev]);
      setTotalQueries((n) => n + 1);
      if (result.costUsdc) setTotalCost((n) => n + result.costUsdc!);
      setQuery("");
    } catch (e) {
      const result: QueryResult = {
        id: crypto.randomUUID(),
        intent: activeIntent,
        query: query.trim(),
        ok: false,
        response: null,
        latencyMs: 0,
        error: e instanceof Error ? e.message : "Request failed",
        timestamp: new Date(),
      };
      setResults((prev) => [result, ...prev]);
    } finally {
      setLoading(false);
    }
  }, [query, activeIntent, loading]);

  return (
    <>
      <DashHeader
        title="Intelligence Console"
        subtitle="Query real Telegraph miners via x402 — every call is a paid, verified request"
      />

      {/* Stats row */}
      <div className="grid gap-4 sm:grid-cols-3 mb-6">
        <StatCard icon={Zap} label="Queries this session" value={String(totalQueries)} delay={0.1} />
        <StatCard icon={Coins} label="x402 spend (USDC)" value={`$${totalCost.toFixed(4)}`} delay={0.2} />
        <StatCard
          icon={Clock}
          label="Avg latency"
          value={
            results.length > 0
              ? `${Math.round(results.reduce((s, r) => s + r.latencyMs, 0) / results.length)}ms`
              : "—"
          }
          delay={0.3}
        />
      </div>

      {/* Intent tabs */}
      <div className="flex gap-2 overflow-x-auto mb-6">
        {INTENT_CONFIG.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => {
              setActiveIntent(c.id);
              setQuery("");
            }}
            className={`inline-flex items-center gap-2 rounded-md border px-3 py-2.5 text-[13.5px] whitespace-nowrap transition-colors ${
              activeIntent === c.id
                ? "bg-white/8 text-foreground border-hair"
                : "text-muted-ink border-transparent hover:bg-white/5 hover:text-foreground"
            }`}
          >
            <c.icon className="h-4 w-4" strokeWidth={1.6} />
            {c.label}
          </button>
        ))}
      </div>

      {/* Query input */}
      <Panel title={`${config.label} Query`} aside={<span className="chip">{activeIntent}</span>}>
        <div className="flex flex-col gap-3">
          {config.inputType === "textarea" ? (
            <textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={config.placeholder}
              rows={4}
              className="w-full rounded-md border border-hair-soft bg-transparent px-3 py-2.5 text-[13.5px] text-foreground placeholder:text-muted-ink/50 focus:outline-none focus:ring-1 focus:ring-stat resize-none"
              onKeyDown={(e) => {
                if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) runQuery();
              }}
            />
          ) : (
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={config.placeholder}
              className="w-full rounded-md border border-hair-soft bg-transparent px-3 py-2.5 text-[13.5px] text-foreground placeholder:text-muted-ink/50 focus:outline-none focus:ring-1 focus:ring-stat"
              onKeyDown={(e) => {
                if (e.key === "Enter") runQuery();
              }}
            />
          )}
          <div className="flex items-center justify-between">
            <p className="text-[12px] text-muted-ink">
              {config.inputType === "textarea" ? "Ctrl+Enter to send" : "Enter to send"} · Paid via x402 · ~$0.01/query
            </p>
            <button
              type="button"
              onClick={runQuery}
              disabled={loading || !query.trim()}
              className="btn-base btn-solid inline-flex items-center gap-2 disabled:opacity-50"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Zap className="h-4 w-4" />}
              {loading ? "Querying..." : "Send Query"}
            </button>
          </div>
        </div>
      </Panel>

      {/* Results */}
      {results.length > 0 && (
        <div className="mt-6 space-y-4">
          <h3 className="text-[15px] font-medium tracking-[-0.02em]">Results</h3>
          {results.map((r) => (
            <ResultCard key={r.id} result={r} />
          ))}
        </div>
      )}
    </>
  );
}

function ResultCard({ result }: { result: QueryResult }) {
  const [expanded, setExpanded] = useState(false);
  const intentConfig = INTENT_CONFIG.find((c) => c.id === result.intent);
  const Icon = intentConfig?.icon ?? Brain;

  return (
    <div className="panel p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <Icon className="h-4 w-4 text-stat" strokeWidth={1.6} />
          <span className="chip">{result.intent}</span>
          {result.ok ? (
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          ) : (
            <XCircle className="h-4 w-4 text-red-500" />
          )}
        </div>
        <span className="text-[11.5px] text-muted-ink">
          {result.timestamp.toLocaleTimeString()} · {result.latencyMs}ms
          {result.costUsdc ? ` · $${result.costUsdc.toFixed(4)}` : ""}
        </span>
      </div>

      <p className="mt-2.5 text-[13px] text-muted-ink line-clamp-2">{result.query}</p>

      {result.error && <p className="mt-2 text-[13px] text-red-400">{result.error}</p>}

      {result.ok && (
        <div className="mt-3 flex flex-wrap gap-3 text-[12px]">
          {result.minerSlug && (
            <span className="text-muted-ink">
              Miner: <span className="text-foreground">{result.minerSlug}</span>
            </span>
          )}
          {result.confidence != null && (
            <span className="text-muted-ink">
              Confidence: <span className="text-foreground">{(result.confidence * 100).toFixed(1)}%</span>
            </span>
          )}
          {result.x402Tx && (
            <span className="text-muted-ink">
              x402:{" "}
              <a
                href={`https://sepolia.basescan.org/tx/${result.x402Tx}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-stat hover:underline"
              >
                {result.x402Tx.slice(0, 10)}...
              </a>
            </span>
          )}
        </div>
      )}

      {result.ok && (
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="mt-3 text-[12px] text-stat hover:underline"
        >
          {expanded ? "Hide" : "Show"} raw response
        </button>
      )}

      {expanded && result.response != null && (
        <pre className="mt-2 overflow-x-auto rounded-md bg-black/30 p-3 text-[11.5px] text-muted-ink max-h-64 overflow-y-auto">
          {JSON.stringify(result.response, null, 2)}
        </pre>
      )}
    </div>
  );
}
