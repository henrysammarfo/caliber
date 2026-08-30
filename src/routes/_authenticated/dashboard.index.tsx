import { createFileRoute, Link } from "@tanstack/react-router";
import { Coins, Gauge, Radar, TrendingUp } from "lucide-react";
import { DashHeader, DataTable, Panel, StatCard } from "@/components/dash/DashKit";
import { usePageView } from "@/lib/use-analytics";
import { trackCta } from "@/lib/analytics";
import { PROTOCOL_STATUS } from "@/lib/protocol-status";

export const Route = createFileRoute("/_authenticated/dashboard/")({
  head: () => ({
    meta: [
      { title: "Console Overview — CALIBER" },
      {
        name: "description",
        content: "Honest build status: local smoke metrics, checklist, and what is still blocked on keys/hosting.",
      },
      { property: "og:title", content: "Console Overview — CALIBER" },
      { property: "og:description", content: "Build status for TRUTHPORT and GRADELOCK — no fake mainnet metrics." },
    ],
  }),
  component: OverviewPage,
});

function OverviewPage() {
  usePageView("Overview");
  const passed = PROTOCOL_STATUS.smoke.adversarial.filter((a) => a.passed).length;
  return (
    <>
      <DashHeader
        title="Overview"
        subtitle={`TRUTHPORT · ${PROTOCOL_STATUS.vertical.signalType} · registry ${PROTOCOL_STATUS.registry.registered ? "live" : "not registered"}`}
        action={
          <Link to="/dashboard/payments" onClick={() => trackCta("Console · View receipts")} className="btn-base btn-solid">
            Payments
          </Link>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={Radar} label="Miner status" value="Local" delta="Public HTTPS + registerMiner pending" delay={0.1} />
        <StatCard
          icon={Gauge}
          label="Honest mean Brier"
          value={PROTOCOL_STATUS.smoke.honestMeanBrier.toFixed(3)}
          delta={`synthetic-ci · ${PROTOCOL_STATUS.smoke.asOf}`}
          delay={0.2}
        />
        <StatCard icon={Coins} label="x402 path" value="Open" delta="Needs Base Sepolia wallet + live URL" delay={0.3} />
        <StatCard
          icon={TrendingUp}
          label="Adversarial drops"
          value={`${passed} / ${PROTOCOL_STATUS.smoke.adversarial.length}`}
          delta="All attacks ranked below honest"
          delay={0.4}
        />
      </div>

      <div className="mt-5 grid gap-4 xl:grid-cols-[1.5fr_1fr]">
        <Panel title="Adversarial smoke" aside={<span className="chip">CI</span>}>
          <DataTable
            head={["Attack", "Rank drop", "Result"]}
            rows={PROTOCOL_STATUS.smoke.adversarial.map((a) => [
              a.name,
              `-${a.rankDrop}`,
              a.passed ? "Worse than honest" : "Fail",
            ])}
          />
        </Panel>

        <Panel title="Season checklist">
          <ul className="space-y-3 text-[13.5px]">
            {PROTOCOL_STATUS.checklist.map((item) => (
              <li key={item.id} className="flex items-center justify-between gap-3">
                <span className={item.done ? "" : "text-muted-ink"}>{item.label}</span>
                <span className="chip">{item.done ? "Done" : "Open"}</span>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </>
  );
}
