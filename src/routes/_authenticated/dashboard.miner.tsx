import { createFileRoute } from "@tanstack/react-router";
import { Database, Radar, Timer, Zap } from "lucide-react";
import { DashHeader, DataTable, Panel, StatCard } from "@/components/dash/DashKit";

export const Route = createFileRoute("/dashboard/miner")({
  head: () => ({
    meta: [
      { title: "Miner — CALIBER Console" },
      {
        name: "description",
        content: "TRUTHPORT miner health: intents served, latency, eval coverage and declaration drift.",
      },
      { property: "og:title", content: "Miner — CALIBER Console" },
      { property: "og:description", content: "Intents, latency, eval coverage and drift checks." },
    ],
  }),
  component: MinerConsole,
});

function MinerConsole() {
  return (
    <>
      <DashHeader
        title="Miner"
        subtitle="TRUTHPORT · caliber-truthport v0.4.1"
        action={<button className="btn-base btn-ghost-metal">Re-publish YAML</button>}
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={Radar} label="Intents served" value="2" delta="verify · lookup" delay={0.1} />
        <StatCard icon={Timer} label="p95 latency" value="412ms" delta="-38ms week over week" delay={0.2} />
        <StatCard icon={Database} label="Eval coverage" value="96.4%" delta="3,979 / 4,128 labeled rows" delay={0.3} />
        <StatCard icon={Zap} label="Uptime (30d)" value="99.93%" delta="1 planned restart" delay={0.4} />
      </div>

      <div className="mt-5 grid gap-4 xl:grid-cols-2">
        <Panel title="Intent performance">
          <DataTable
            head={["Intent", "Calls (7d)", "Brier", "Floor"]}
            rows={[
              ["vertical.verify", "12,914", "0.079", "0.02 USDC"],
              ["vertical.lookup", "5,488", "0.088", "0.02 USDC"],
            ]}
          />
        </Panel>
        <Panel title="Declaration drift">
          <DataTable
            head={["Field", "YAML", "On-chain"]}
            rows={[
              ["endpoint", "miner.caliber.xyz", "match"],
              ["checksum", "sha256:9f2c…41ab", "match"],
              ["intents", "2", "match"],
              ["floor", "0.02 USDC", "match"],
            ]}
          />
        </Panel>
      </div>
    </>
  );
}
