import { createFileRoute } from "@tanstack/react-router";
import { queryTelegraph, INTENTS, type TelegraphIntent } from "../lib/telegraph-client";
import {
  applySetCookies,
  createSupabaseServerClient,
  getSupabaseAdmin,
} from "../integrations/supabase/server-client";
import { checkIntelRateLimit } from "../lib/intel-rate-limit";

/** Same-origin only — no wildcard CORS (paid wallet path). */
const CORS: HeadersInit = {
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Credentials": "true",
};

function json(
  data: unknown,
  status = 200,
  extra?: { cookiesToSet?: ReturnType<typeof createSupabaseServerClient>["cookiesToSet"]; rate?: HeadersInit },
): Response {
  const headers = new Headers({ ...CORS, "Content-Type": "application/json" });
  if (extra?.rate) {
    for (const [k, v] of Object.entries(extra.rate)) headers.set(k, String(v));
  }
  if (extra?.cookiesToSet) applySetCookies(headers, extra.cookiesToSet);
  return new Response(JSON.stringify(data), { status, headers });
}

function deferLog(
  intent: string,
  queryText: string,
  result: Awaited<ReturnType<typeof queryTelegraph>>,
  userId: string,
) {
  const run = async () => {
    try {
      const sb = getSupabaseAdmin();
      if (!sb) return;
      await sb.from("query_log").insert({
        user_id: userId,
        intent,
        query_text: queryText.slice(0, 2000),
        miner_slug: result.minerSlug || null,
        miner_id: result.minerId || null,
        response: result.response as never,
        confidence: result.confidence ?? null,
        x402_tx: result.x402Tx || null,
        cost_usdc: result.costUsdc ?? null,
      });
    } catch {
      /* logging must never break the query */
    }
  };
  // Fire-and-forget — do not await on the hot path
  void run();
}

export const Route = createFileRoute("/intel")({
  server: {
    handlers: {
      OPTIONS: async ({ request }) => {
        const origin = request.headers.get("Origin");
        const headers = new Headers(CORS);
        if (origin) {
          try {
            const o = new URL(origin);
            const host = request.headers.get("Host") || "";
            if (o.host === host) headers.set("Access-Control-Allow-Origin", origin);
          } catch {
            /* ignore */
          }
        }
        return new Response(null, { status: 204, headers });
      },

      POST: async ({ request }) => {
        const { supabase, cookiesToSet } = createSupabaseServerClient(request);
        const { data: userData, error: userError } = await supabase.auth.getUser();
        if (userError || !userData.user) {
          return json({ error: "authentication required", ok: false }, 401, { cookiesToSet });
        }
        const userId = userData.user.id;

        const limit = checkIntelRateLimit(userId);
        if (!limit.ok) {
          return json(
            { error: `rate limit exceeded (${limit.reason})`, ok: false, retryAfterSec: limit.retryAfterSec },
            429,
            {
              cookiesToSet,
              rate: {
                "Retry-After": String(limit.retryAfterSec),
                "X-RateLimit-Reason": limit.reason,
              },
            },
          );
        }

        let body: Record<string, unknown>;
        try {
          body = (await request.json()) as Record<string, unknown>;
        } catch {
          return json({ error: "invalid JSON body", ok: false }, 400, { cookiesToSet });
        }

        const intent = body["intent"] as string | undefined;
        const query = body["query"] as string | undefined;
        const params = (body["params"] as Record<string, unknown>) || undefined;
        const subnetId = body["subnetId"] as number | undefined;

        if (!intent || !INTENTS.includes(intent as TelegraphIntent)) {
          return json({ error: `intent must be one of: ${INTENTS.join(", ")}`, ok: false }, 400, {
            cookiesToSet,
          });
        }
        if (!query || typeof query !== "string" || query.trim().length === 0) {
          return json({ error: "query is required", ok: false }, 400, { cookiesToSet });
        }

        const started = Date.now();
        const result = await queryTelegraph({
          intent: intent as TelegraphIntent,
          query: query.trim(),
          ...(params ? { params } : {}),
          ...(subnetId ? { subnetId } : {}),
        });
        const totalMs = Date.now() - started;

        deferLog(intent, query, result, userId);

        return json(
          {
            ...result,
            latencyMs: result.latencyMs || totalMs,
            totalMs,
            paymentMs: result.paymentMs ?? result.latencyMs ?? totalMs,
            minerMs: result.minerMs ?? result.latencyMs ?? totalMs,
            remainingMinute: limit.remainingMinute,
            remainingDay: limit.remainingDay,
          },
          result.ok ? 200 : 502,
          {
            cookiesToSet,
            rate: {
              "X-RateLimit-Remaining-Minute": String(limit.remainingMinute),
              "X-RateLimit-Remaining-Day": String(limit.remainingDay),
            },
          },
        );
      },

      GET: async ({ request }) => {
        const { cookiesToSet } = createSupabaseServerClient(request);
        return json(
          {
            service: "caliber-intel",
            intents: INTENTS,
            auth: "required",
            description:
              "Paid multi-intent console — POST { intent, query } with cookie session. Public demos use POST /detect (local).",
          },
          200,
          { cookiesToSet },
        );
      },
    },
  },
});
