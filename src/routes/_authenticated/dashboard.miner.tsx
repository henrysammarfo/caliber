import { createFileRoute } from "@tanstack/react-router";
import { Database, Radar, Timer, Zap } from "lucide-react";
import { DashHeader, DataTable, Panel, StatCard } from "@/components/dash/DashKit";
import { usePageView } from "@/lib/use-analytics";
import { trackCta } from "@/lib/analytics";
import { PROTOCOL_STATUS } from "@/lib/protocol-status";

export const Route = createFileRoute("/_authenticated/dashboard/miner")({
  head: () => ({
    meta: [
      { title: "Miner — CALIBER Console" },
      {
        name: "description",
        content: "TRUTHPORT miner build status: intents, YAML hash, registry and hosting gates.",
      },
      { property: "og:title", content: "Miner — CALIBER Console" },
      { property: "og:description", content: "Honest miner status — local detect, registry pending." },
    ],
  }),
  component: MinerConsole,
});

function MinerConsole() {
  usePageView("Miner");
  return (
    <>
      <DashHeader
        title="Miner"
        subtitle={`TRUTHPORT · ${PROTOCOL_STATUS.yaml.slug}`}
        action={
          <button className="btn-base btn-ghost-metal" onClick={() => trackCta("Console · Re-publish YAML")}>
            YAML draft
          </button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={Radar}
          label="Intents"
          value={String(PROTOCOL_STATUS.vertical.intents.length)}
          delta={PROTOCOL_STATUS.vertical.intents.join(" · ")}
          delay={0.1}
        />
        <StatCard icon={Timer} label="Local miner" value=":8787" delta="cd protocol && npm run miner" delay={0.2} />
        <StatCard
          icon={Database}
          label="Eval coverage"
          value="CI"
          delta={`${PROTOCOL_STATUS.holdout.rows} synthetic rows · RAID open`}
          delay={0.3}
        />
        <StatCard
          icon={Zap}
          label="Public URL"
          value={PROTOCOL_STATUS.yaml.baseUrlLive ? "Live" : "Placeholder"}
          delta={PROTOCOL_STATUS.yaml.baseUrl}
          delay={0.4}
        />
      </div>

      <div className="mt-5 grid gap-4 xl:grid-cols-2">
        <Panel title="Intent surface">
          <DataTable
            head={["Intent", "Endpoint", "Floor"]}
            rows={PROTOCOL_STATUS.vertical.intents.map((intent) => [
              intent,
              "POST /detect",
              `${PROTOCOL_STATUS.x402.floorUsdc} USDC`,
            ])}
          />
        </Panel>
        <Panel title="Declaration status">
          <DataTable
            head={["Field", "Value", "Status"]}
            rows={[
              ["YAML path", PROTOCOL_STATUS.yaml.path, "Draft"],
              ["sha256", `${PROTOCOL_STATUS.yaml.sha256.slice(0, 16)}…`, "Re-hash after edits"],
              ["Registry", PROTOCOL_STATUS.registry.registered ? "Yes" : "No", "Needs wallet"],
              ["x402", PROTOCOL_STATUS.x402.exercised ? "Yes" : "No", "Needs wallet + HTTPS"],
            ]}
          />
        </Panel>
      </div>
    </>
  );
}
