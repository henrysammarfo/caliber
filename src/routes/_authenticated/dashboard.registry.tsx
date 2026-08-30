import { createFileRoute } from "@tanstack/react-router";
import { Hash, Link2, Server, ShieldCheck } from "lucide-react";
import { DashHeader, DataTable, Panel, StatCard } from "@/components/dash/DashKit";
import { usePageView } from "@/lib/use-analytics";
import { PROTOCOL_STATUS } from "@/lib/protocol-status";

export const Route = createFileRoute("/_authenticated/dashboard/registry")({
  head: () => ({
    meta: [
      { title: "Registry — CALIBER Console" },
      {
        name: "description",
        content: "MinerRegistry status. Not registered until Base Sepolia registerMiner succeeds.",
      },
      { property: "og:title", content: "Registry — CALIBER Console" },
      { property: "og:description", content: "On-chain registration status — pending." },
    ],
  }),
  component: RegistryConsole,
});

function RegistryConsole() {
  usePageView("Registry");
  return (
    <>
      <DashHeader
        title="Registry"
        subtitle={`MinerRegistry · ${PROTOCOL_STATUS.registry.network} · docs diamond ${PROTOCOL_STATUS.registry.diamondDocs.slice(0, 10)}…`}
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={Link2}
          label="Status"
          value={PROTOCOL_STATUS.registry.registered ? "Registered" : "Not registered"}
          delta="Blocked on wallet + public YAML URL"
          delay={0.1}
        />
        <StatCard
          icon={Hash}
          label="YAML sha256"
          value={`${PROTOCOL_STATUS.yaml.sha256.slice(0, 8)}…`}
          delta="Local draft hash"
          delay={0.2}
        />
        <StatCard
          icon={Server}
          label="base_url"
          value={PROTOCOL_STATUS.yaml.baseUrlLive ? "Live" : "Placeholder"}
          delta={PROTOCOL_STATUS.yaml.baseUrl}
          delay={0.3}
        />
        <StatCard icon={ShieldCheck} label="Drift checks" value="—" delta="Start after first registration" delay={0.4} />
      </div>

      <div className="mt-5 grid gap-4">
        <Panel title="Registration history">
          <DataTable
            head={["Tx", "Action", "Version", "Block"]}
            rows={[["—", "None yet", "yaml draft", "—"]]}
          />
        </Panel>
      </div>
    </>
  );
}
