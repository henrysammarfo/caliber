import { createFileRoute } from "@tanstack/react-router";
import { detect, resolveTextInput } from "../lib/miner/detector";
import { DetectRequestSchema } from "../lib/miner/schemas";

/** Veritarach-compatible path — POST /predict */
const CORS: HeadersInit = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, PAYMENT-SIGNATURE",
};

function json(data: unknown, status = 200): Response {
  return Response.json(data, { status, headers: CORS });
}

export const Route = createFileRoute("/predict")({
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
        const resolved = resolveTextInput(body);
        const parsed = DetectRequestSchema.safeParse(resolved);
        if (!parsed.success) {
          return json({ error: "validation failed", details: parsed.error.flatten() }, 400);
        }
        const single = parsed.data.text ?? parsed.data.query;
        try {
          if (parsed.data.texts) return json({ results: detect({ texts: parsed.data.texts }) });
          return json(detect({ text: single! }));
        } catch (e) {
          return json({ error: e instanceof Error ? e.message : "predict failed" }, 400);
        }
      },
    },
  },
});
