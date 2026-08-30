/**
 * TRUTHPORT miner HTTP server (node:http).
 *
 * Rate-limit: placeholder — production should enforce Redis/token-bucket
 * keyed by API key / IP. See YAML rate_limit_per_sec. No secrets embedded.
 */

import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import { pathToFileURL } from "node:url";
import { resolve } from "node:path";
import { detect } from "./detector.js";
import { DetectRequestSchema } from "./schemas.js";
import { MAX_TEXT_CHARS } from "../shared/types.js";

const PORT = Number(process.env.CALIBER_MINER_PORT ?? 8787);
const HOST = process.env.CALIBER_MINER_HOST ?? "127.0.0.1";

export function createMinerServer() {
  return createServer(async (req, res) => {
    try {
      await handle(req, res);
    } catch (err) {
      const message = err instanceof Error ? err.message : "internal error";
      sendJson(res, 500, { error: message });
    }
  });
}

async function handle(req: IncomingMessage, res: ServerResponse): Promise<void> {
  // RATE-LIMIT PLACEHOLDER: inspect X-Forwarded-For / Authorization here;
  // reject with 429 when over YAML rate_limit_per_sec in production.
  const url = new URL(req.url ?? "/", `http://${req.headers.host ?? "localhost"}`);

  if (req.method === "GET" && url.pathname === "/health") {
    sendJson(res, 200, {
      ok: true,
      service: "caliber-truthport",
      model: "caliber-truthport-v1",
    });
    return;
  }

  if (req.method === "POST" && url.pathname === "/detect") {
    const body = await readBody(req, MAX_TEXT_CHARS + 4096);
    let parsed: unknown;
    try {
      parsed = JSON.parse(body);
    } catch {
      sendJson(res, 400, { error: "invalid JSON body" });
      return;
    }

    const validated = DetectRequestSchema.safeParse(parsed);
    if (!validated.success) {
      sendJson(res, 400, {
        error: "validation failed",
        details: validated.error.flatten(),
      });
      return;
    }

    const data = validated.data;
    if (data.texts) {
      const results = detect({ texts: data.texts });
      sendJson(res, 200, { results });
      return;
    }
    const result = detect({ text: data.text! });
    sendJson(res, 200, result);
    return;
  }

  sendJson(res, 404, { error: "not found" });
}

function readBody(req: IncomingMessage, maxBytes: number): Promise<string> {
  return new Promise((resolvePromise, reject) => {
    const chunks: Buffer[] = [];
    let total = 0;
    req.on("data", (chunk: Buffer) => {
      total += chunk.length;
      if (total > maxBytes) {
        reject(new Error(`body exceeds ${maxBytes} bytes`));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on("end", () => resolvePromise(Buffer.concat(chunks).toString("utf8")));
    req.on("error", reject);
  });
}

function sendJson(res: ServerResponse, status: number, payload: unknown): void {
  const body = JSON.stringify(payload);
  res.writeHead(status, {
    "content-type": "application/json; charset=utf-8",
    "content-length": Buffer.byteLength(body),
  });
  res.end(body);
}

export function startMinerServer(port = PORT, host = HOST) {
  const server = createMinerServer();
  server.listen(port, host, () => {
    console.log(`CALIBER TRUTHPORT listening on http://${host}:${port}`);
    console.log(`  POST /detect  GET /health`);
  });
  return server;
}

const isMain =
  typeof process.argv[1] === "string" &&
  import.meta.url === pathToFileURL(resolve(process.argv[1])).href;

if (isMain) {
  startMinerServer();
}
