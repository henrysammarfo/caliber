import { createFileRoute, Link } from "@tanstack/react-router";
import { useRef, useState } from "react";
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
          "Free local TRUTHPORT AI-text check. Sign in for paid multi-intent Telegraph x402 queries.",
      },
      { property: "og:title", content: "AI Text Checker — CALIBER" },
      {
        property: "og:description",
        content: "Paste text for a fast local AI detection verdict from CALIBER TRUTHPORT.",
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
  latencyMs: number;
  error?: string;
}

function DemandAppPage() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CheckResult | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  async function handleCheck() {
    if (!text.trim() || loading) return;
    abortRef.current?.abort();
    const ac = new AbortController();
    abortRef.current = ac;
    setLoading(true);
    setResult(null);
    trackCta("Public checker · Local detect");

    const started = Date.now();
    try {
      const res = await fetch("/detect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: text.trim() }),
        signal: ac.signal,
        credentials: "same-origin",
      });
      const data = (await res.json()) as Record<string, unknown>;
      if (!res.ok) {
        setResult({
          ok: false,
          response: null,
          latencyMs: Date.now() - started,
          error: String(data["error"] ?? `HTTP ${res.status}`),
        });
        return;
      }
      const confidence = typeof data["confidence"] === "number" ? data["confidence"] : undefined;
      setResult({
        ok: true,
        minerSlug: String(data["model"] ?? "caliber-truthport-v2"),
        ...(confidence !== undefined ? { confidence } : {}),
        response: data,
        latencyMs: Date.now() - started,
      });
    } catch (e) {
      if (e instanceof DOMException && e.name === "AbortError") return;
      setResult({
        ok: false,
        response: null,
        latencyMs: Date.now() - started,
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
            Free local check via CALIBER TRUTHPORT (in-process stylometry). Sign in for paid Telegraph-routed
            multi-intent queries via x402.
          </p>
        </div>
      </section>

      <Section kicker="Local · free" title="Check text now">
        <div className="mx-auto max-w-2xl space-y-4">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste or type text to analyze..."
            rows={6}
            className="w-full rounded-md border border-hair-soft bg-black/20 px-4 py-3 text-[14px] text-foreground placeholder:text-muted-ink/50 focus:outline-none focus:ring-1 focus:ring-stat resize-none backdrop-blur-sm"
          />

          <div className="flex items-center justify-between gap-3">
            <p className="text-[12px] text-muted-ink">
              Local TRUTHPORT · no x402 · residual detector error remains
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

          {result && (
            <div className="panel p-6 mt-4">
              <div className="flex items-center gap-3 mb-4">
                {result.ok ? (
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-500" />
                )}
                <h3 className="text-[16px] font-medium">{result.ok ? "Verdict" : "Error"}</h3>
                <span className="text-[12px] text-muted-ink ml-auto">{result.latencyMs}ms</span>
              </div>

              {result.error && <p className="text-[13.5px] text-red-400 mb-3">{result.error}</p>}

              {result.ok && result.response && (
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-4">
                    {result.confidence != null && (
                      <div>
                        <p className="text-[11.5px] tracking-[0.05em] text-muted-ink uppercase">Confidence</p>
                        <p className="text-[24px] font-medium tracking-[-0.04em]">
                          {(result.confidence * 100).toFixed(1)}%
                        </p>
                      </div>
                    )}
                    {Boolean(result.response["label"]) && (
                      <div>
                        <p className="text-[11.5px] tracking-[0.05em] text-muted-ink uppercase">Label</p>
                        <p className="text-[24px] font-medium tracking-[-0.04em]">
                          {String(result.response["label"])}
                        </p>
                      </div>
                    )}
                    {Boolean(result.response["verdict"]) && (
                      <div>
                        <p className="text-[11.5px] tracking-[0.05em] text-muted-ink uppercase">Verdict</p>
                        <p className="text-[24px] font-medium tracking-[-0.04em]">
                          {String(result.response["verdict"])}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-4 text-[12px] text-muted-ink border-t border-hair-soft pt-3">
                    {result.minerSlug && (
                      <span>
                        Model: <span className="text-foreground">{result.minerSlug}</span>
                      </span>
                    )}
                    <span>
                      Path: <span className="text-foreground">local /detect</span>
                    </span>
                  </div>

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

          <div className="panel p-5 flex items-center justify-between mt-6 gap-4">
            <div>
              <p className="text-[14px] font-medium">Paid Telegraph multi-intent</p>
              <p className="text-[12.5px] text-muted-ink mt-1">
                Weather, crypto, fraud, news + dispatcher-routed AI text — requires sign-in (cookie session).
              </p>
            </div>
            <Link
              to="/auth"
              onClick={() => trackCta("Public checker · Sign in CTA")}
              className="btn-base btn-solid inline-flex items-center gap-2 shrink-0"
            >
              Console <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </Section>
    </PageShell>
  );
}
