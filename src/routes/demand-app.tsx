import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Brain, CheckCircle2, XCircle, Loader2, ArrowRight } from "lucide-react";
import { PageShell, Section } from "@/components/site/Page";
import { trackCta } from "@/lib/analytics";

export const Route = createFileRoute("/demand-app")({
  head: () => ({
    meta: [
      { title: "AI Text Checker — CALIBER" },
      {
        name: "description",
        content:
          "Check if text is AI-generated using Telegraph's ranked miners via x402. Free to try, powered by real verified intelligence.",
      },
      { property: "og:title", content: "AI Text Checker — CALIBER" },
      {
        property: "og:description",
        content: "Paste text and get a verified AI detection verdict from Telegraph's top-ranked miners.",
      },
    ],
  }),
  component: DemandAppPage,
});

interface CheckResult {
  ok: boolean;
  minerSlug?: string;
  confidence?: number;
  response: Record<string, unknown> | null;
  x402Tx?: string;
  costUsdc?: number;
  latencyMs: number;
  error?: string;
}

function DemandAppPage() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CheckResult | null>(null);

  async function handleCheck() {
    if (!text.trim() || loading) return;
    setLoading(true);
    setResult(null);
    trackCta("Public checker · Check");

    try {
      const res = await fetch("/intel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ intent: "AI_TEXT_DETECTION", query: text.trim() }),
      });
      const data = await res.json();
      setResult({
        ok: data.ok ?? false,
        minerSlug: data.minerSlug,
        confidence: data.confidence,
        response: data.response,
        x402Tx: data.x402Tx,
        costUsdc: data.costUsdc,
        latencyMs: data.latencyMs ?? 0,
        error: data.error,
      });
    } catch (e) {
      setResult({
        ok: false,
        response: null,
        latencyMs: 0,
        error: e instanceof Error ? e.message : "Request failed",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <PageShell>
      <section className="px-5 pt-16 pb-10 lg:px-10 lg:pt-24">
        <div className="mx-auto w-full max-w-3xl text-center">
          <span className="badge-metal appear appear--pop [--d:0.12s]">Track 3</span>
          <h1 className="mt-6 text-[clamp(34px,6vw,56px)] leading-[1.12] font-medium tracking-[-0.045em]">
            <span className="headline-line appear appear--mask [--d:0.3s]">
              Is this text <em className="serif-em hero-em not-italic">AI</em>?
            </span>
          </h1>
          <p className="appear appear--soft mx-auto mt-5 max-w-[520px] text-[15.5px] leading-[1.55] tracking-[-0.015em] text-muted-ink [--d:0.6s]">
            Paste any text below. Telegraph routes your query to the highest-ranked AI text detection
            miner and returns a verified verdict — paid via x402.
          </p>
        </div>
      </section>

      <Section kicker="Live" title="Check text now">
        <div className="mx-auto max-w-2xl space-y-4">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste or type text to analyze..."
            rows={6}
            className="w-full rounded-md border border-hair-soft bg-black/20 px-4 py-3 text-[14px] text-foreground placeholder:text-muted-ink/50 focus:outline-none focus:ring-1 focus:ring-stat resize-none backdrop-blur-sm"
          />

          <div className="flex items-center justify-between">
            <p className="text-[12px] text-muted-ink">
              Powered by Telegraph x402 · ~$0.01/query · No sign-in required
            </p>
            <button
              type="button"
              onClick={handleCheck}
              disabled={loading || !text.trim()}
              className="btn-base btn-solid inline-flex items-center gap-2 disabled:opacity-50"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Brain className="h-4 w-4" />}
              {loading ? "Analyzing..." : "Check Text"}
            </button>
          </div>

          {/* Result display */}
          {result && (
            <div className="panel p-6 mt-4">
              <div className="flex items-center gap-3 mb-4">
                {result.ok ? (
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-500" />
                )}
                <h3 className="text-[16px] font-medium">
                  {result.ok ? "Verdict" : "Error"}
                </h3>
                <span className="text-[12px] text-muted-ink ml-auto">{result.latencyMs}ms</span>
              </div>

              {result.error && <p className="text-[13.5px] text-red-400 mb-3">{result.error}</p>}

              {result.ok && result.response && (
                <div className="space-y-3">
                  {/* Main verdict */}
                  <div className="flex flex-wrap gap-4">
                    {result.confidence != null && (
                      <div>
                        <p className="text-[11.5px] tracking-[0.05em] text-muted-ink uppercase">Confidence</p>
                        <p className="text-[24px] font-medium tracking-[-0.04em]">
                          {(result.confidence * 100).toFixed(1)}%
                        </p>
                      </div>
                    )}
                    {Boolean((result.response as Record<string, unknown>)["label"]) && (
                      <div>
                        <p className="text-[11.5px] tracking-[0.05em] text-muted-ink uppercase">Label</p>
                        <p className="text-[24px] font-medium tracking-[-0.04em]">
                          {String((result.response as Record<string, unknown>)["label"])}
                        </p>
                      </div>
                    )}
                    {Boolean((result.response as Record<string, unknown>)["verdict"]) && (
                      <div>
                        <p className="text-[11.5px] tracking-[0.05em] text-muted-ink uppercase">Verdict</p>
                        <p className="text-[24px] font-medium tracking-[-0.04em]">
                          {String((result.response as Record<string, unknown>)["verdict"])}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Meta */}
                  <div className="flex flex-wrap gap-4 text-[12px] text-muted-ink border-t border-hair-soft pt-3">
                    {result.minerSlug && <span>Miner: <span className="text-foreground">{result.minerSlug}</span></span>}
                    {result.costUsdc != null && <span>Cost: <span className="text-foreground">${result.costUsdc.toFixed(4)}</span></span>}
                    {result.x402Tx && (
                      <span>
                        x402:{" "}
                        <a
                          href={`https://sepolia.basescan.org/tx/${result.x402Tx}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-stat hover:underline"
                        >
                          {result.x402Tx.slice(0, 12)}...
                        </a>
                      </span>
                    )}
                  </div>

                  {/* Raw response toggle */}
                  <details className="text-[12px]">
                    <summary className="text-stat cursor-pointer hover:underline">Raw response</summary>
                    <pre className="mt-2 overflow-x-auto rounded-md bg-black/30 p-3 text-[11.5px] text-muted-ink max-h-48 overflow-y-auto">
                      {JSON.stringify(result.response, null, 2)}
                    </pre>
                  </details>
                </div>
              )}
            </div>
          )}

          {/* CTA to full console */}
          <div className="panel p-5 flex items-center justify-between mt-6">
            <div>
              <p className="text-[14px] font-medium">Want more intents?</p>
              <p className="text-[12.5px] text-muted-ink mt-1">
                Weather, crypto, fraud, news — sign in for the full multi-intent console.
              </p>
            </div>
            <Link
              to="/auth"
              onClick={() => trackCta("Public checker · Sign in CTA")}
              className="btn-base btn-solid inline-flex items-center gap-2"
            >
              Console <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </Section>
    </PageShell>
  );
}
