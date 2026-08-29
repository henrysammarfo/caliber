import { createFileRoute } from "@tanstack/react-router";
import { Hash, Link2, Server, ShieldCheck } from "lucide-react";
import { DashHeader, DataTable, Panel, StatCard } from "@/components/dash/DashKit";

export const Route = createFileRoute("/dashboard/registry")({
  head: () => ({
    meta: [
      { title: "Registry — CALIBER Console" },
      {
        name: "description",
        content: "MinerRegistry on Base: registered URL, SHA-256 checksum, declared intents and price floor.",
      },
      { property: "og:title", content: "Registry — CALIBER Console" },
      { property: "og:description", content: "On-chain miner registration and checksum history." },
    ],
  }),
  component: RegistryConsole,
});

function RegistryConsole() {
  return (
    <>
      <DashHeader
        title="Registry"
        subtitle="MinerRegistry · Base · 0x4b21…9de0"
        action={<button className="btn-base btn-ghost-metal">Verify on-chain</button>}
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={Link2} label="Status" value="Registered" delta="Block 24,881,402" delay={0.1} />
        <StatCard icon={Hash} label="Checksum" value="9f2c…41ab" delta="SHA-256 of miner.yaml" delay={0.2} />
        <StatCard icon={Server} label="Endpoint" value="miner.caliber.xyz" delta="TLS pinned" delay={0.3} />
        <StatCard icon={ShieldCheck} label="Drift checks" value="0 open" delta="Hourly reconciliation" delay={0.4} />
      </div>

      <div className="mt-5 grid gap-4">
        <Panel title="Registration history">
          <DataTable
            head={["Tx", "Action", "Version", "Block"]}
            rows={[
              ["0x8c1a…44f2", "Update checksum", "0.4.1", "24,881,402"],
              ["0x71bd…9e07", "Set price floor", "0.4.0", "24,802,119"],
              ["0x22ef…10ba", "Add intent vertical.lookup", "0.3.2", "24,744,880"],
              ["0x09aa…7c31", "Initial registration", "0.1.0", "24,610,255"],
            ]}
          />
        </Panel>
      </div>
    </>
  );
}
