import { createFileRoute } from "@tanstack/react-router";
import { detect } from "../lib/miner/detector";
import { DetectRequestSchema } from "../lib/miner/schemas";

const CORS_HEADERS: HeadersInit = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

function json(data: unknown, status = 200): Response {
  return Response.json(data, { status, headers: CORS_HEADERS });
}

export const Route = createFileRoute("/detect")({
  server: {
    handlers: {
      OPTIONS: async () =>
        new Response(null, { status: 204, headers: CORS_HEADERS }),
      GET: async () =>
        json({
          ok: true,
          service: "caliber-truthport",
          model: "caliber-truthport-v1",
        }),
      POST: async ({ request }) => {
        let body: unknown;
        try {
          body = await request.json();
        } catch {
          return json({ error: "invalid JSON body" }, 400);
        }

        const parsed = DetectRequestSchema.safeParse(body);
        if (!parsed.success) {
          return json(
            {
              error: "validation failed",
              details: parsed.error.flatten(),
            },
            400,
          );
        }

        const { text, texts } = parsed.data;
        if (texts !== undefined) {
          const results = detect({ texts });
          return json({ results });
        }
        return json(detect({ text: text! }));
      },
    },
  },
});
