import { createFileRoute } from "@tanstack/react-router";
import { readFileSync } from "node:fs";
import { join } from "node:path";

/**
 * Serve miner YAML with Content-Type application/yaml (matches live proofgate miners).
 * Public static /protocol/caliber-truthport.yaml remains as backup.
 */
export const Route = createFileRoute("/miner.yaml")({
  server: {
    handlers: {
      GET: async () => {
        const path = join(process.cwd(), "public", "protocol", "caliber-truthport.yaml");
        let body: string;
        try {
          body = readFileSync(path, "utf8");
        } catch {
          return new Response("miner yaml missing", { status: 404 });
        }
        return new Response(body, {
          status: 200,
          headers: {
            "Content-Type": "application/yaml; charset=utf-8",
            "Cache-Control": "public, max-age=60",
            "Access-Control-Allow-Origin": "*",
          },
        });
      },
    },
  },
});
