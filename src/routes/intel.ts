import { createFileRoute } from "@tanstack/react-router";
import { queryTelegraph, INTENTS, type TelegraphIntent } from "../lib/telegraph-client";
import { createClient } from "@supabase/supabase-js";

const CORS: HeadersInit = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

function json(data: unknown, status = 200): Response {
  return Response.json(data, { status, headers: CORS });
}

function getSupabaseAdmin() {
  const url = process.env["SUPABASE_URL"] || process.env["VITE_SUPABASE_URL"];
  const key = process.env["SUPABASE_SERVICE_ROLE_KEY"] || process.env["SUPABASE_PUBLISHABLE_KEY"] || process.env["VITE_SUPABASE_PUBLISHABLE_KEY"];
  if (!url || !key) return null;
  return createClient(url, key);
}

async function logQuery(
  intent: string,
  queryText: string,
  result: Awaited<ReturnType<typeof queryTelegraph>>,
  userId?: string,
) {
  try {
    const sb = getSupabaseAdmin();
    if (!sb) return;
    await (sb as ReturnType<typeof createClient>).from("query_log").insert({
      user_id: userId || null,
      intent,
      query_text: queryText.slice(0, 2000),
      miner_slug: result.minerSlug || null,
      miner_id: result.minerId || null,
      response: result.response as Record<string, unknown>,
      confidence: result.confidence ?? null,
      x402_tx: result.x402Tx || null,
      cost_usdc: result.costUsdc ?? null,
    } as never);
  } catch {
    // logging must never break the query
  }
}

export const Route = createFileRoute("/intel")({
  server: {
    handlers: {
      OPTIONS: async () => new Response(null, { status: 204, headers: CORS }),
      POST: async ({ request }) => {
        let body: Record<string, unknown>;
        try {
          body = (await request.json()) as Record<string, unknown>;
        } catch {
          return json({ error: "invalid JSON body" }, 400);
        }

        const intent = body["intent"] as string | undefined;
        const query = body["query"] as string | undefined;
        const params = (body["params"] as Record<string, unknown>) || undefined;
        const subnetId = body["subnetId"] as number | undefined;

        if (!intent || !INTENTS.includes(intent as TelegraphIntent)) {
          return json({ error: `intent must be one of: ${INTENTS.join(", ")}` }, 400);
        }
        if (!query || typeof query !== "string" || query.trim().length === 0) {
          return json({ error: "query is required" }, 400);
        }

        const result = await queryTelegraph({
          intent: intent as TelegraphIntent,
          query: query.trim(),
          ...(params ? { params } : {}),
          ...(subnetId ? { subnetId } : {}),
        });

        // best-effort log
        const authHeader = request.headers.get("Authorization");
        let userId: string | undefined;
        if (authHeader) {
          try {
            const sb = getSupabaseAdmin();
            if (sb) {
              const { data } = await sb.auth.getUser(authHeader.replace("Bearer ", ""));
              userId = data.user?.id;
            }
          } catch { /* ignore */ }
        }
        await logQuery(intent, query, result, userId);

        return json(result, result.ok ? 200 : 502);
      },

      GET: async () => {
        return json({
          service: "caliber-intel",
          intents: INTENTS,
          description: "Multi-intent intelligence console — POST { intent, query } to query Telegraph miners via x402",
        });
      },
    },
  },
});
