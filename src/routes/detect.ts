import { createFileRoute } from "@tanstack/react-router";
import { detect, resolveTextInput } from "../lib/miner/detector";
import { DetectRequestSchema } from "../lib/miner/schemas";

const CORS: HeadersInit = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, PAYMENT-SIGNATURE",
};

function json(data: unknown, status = 200): Response {
  return Response.json(data, { status, headers: CORS });
}

async function handleDetect(request: Request): Promise<Response> {
  let body: Record<string, unknown> = {};
  if (request.method === "GET") {
    const url = new URL(request.url);
    body = {
      text: url.searchParams.get("text") ?? undefined,
      query: url.searchParams.get("query") ?? undefined,
    };
  } else {
    try {
      body = (await request.json()) as Record<string, unknown>;
    } catch {
      return json({ error: "invalid JSON body" }, 400);
    }
  }

  const resolved = resolveTextInput(body);
  const parsed = DetectRequestSchema.safeParse({
    ...resolved,
    texts: resolved.texts,
  });
  if (!parsed.success) {
    return json({ error: "validation failed", details: parsed.error.flatten() }, 400);
  }

  const { text, query, texts } = parsed.data;
  const single = text ?? query;
  try {
    if (texts !== undefined) {
      return json({ results: detect({ texts }) });
    }
    return json(detect({ text: single! }));
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : "detect failed" }, 400);
  }
}

export const Route = createFileRoute("/detect")({
  server: {
    handlers: {
      OPTIONS: async () => new Response(null, { status: 204, headers: CORS }),
      GET: async ({ request }) => {
        const url = new URL(request.url);
        if (!url.searchParams.has("text") && !url.searchParams.has("query")) {
          return json({
            ok: true,
            service: "caliber-truthport",
            model: "caliber-truthport-v2",
            version: "2.0.0",
            intents: ["AI_TEXT_DETECTION"],
            endpoints: ["/detect", "/predict", "/ai-detect"],
          });
        }
        return handleDetect(request);
      },
      POST: async ({ request }) => handleDetect(request),
    },
  },
});
