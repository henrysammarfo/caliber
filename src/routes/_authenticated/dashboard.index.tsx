import { createFileRoute, Link } from "@tanstack/react-router";
import { Coins, Gauge, Radar, TrendingUp } from "lucide-react";
import { DashHeader, DataTable, Panel, StatCard } from "@/components/dash/DashKit";

export const Route = createFileRoute("/dashboard/")({
  head: () => ({
    meta: [
      { title: "Console Overview — CALIBER" },
      {
        name: "description",
        content: "Live view of miner rank, grader agreement, paid fetch volume and season progress.",
      },
      { property: "og:title", content: "Console Overview — CALIBER" },
      { property: "og:description", content: "Rank, agreement, settlement and season progress." },
    ],
  }),
  component: OverviewPage,
});

function OverviewPage() {
  return (
    <>
      <DashHeader
        title="Overview"
        subtitle="TRUTHPORT · vertical.verify · Base mainnet registry"
        action={
          <Link to="/dashboard/payments" className="btn-base btn-solid">
            View receipts
          </Link>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={Radar} label="Miner rank" value="#4" delta="+6 since last epoch" delay={0.1} />
        <StatCard icon={Gauge} label="Grader agreement" value="0.912" delta="Brier 0.081 · well calibrated" delay={0.2} />
        <StatCard icon={Coins} label="Paid fetches (7d)" value="18,402" delta="367.8 USDC settled" delay={0.3} />
        <StatCard icon={TrendingUp} label="Adversarial drops" value="4 / 4" delta="All attacks ranked down" delay={0.4} />
      </div>

      <div className="mt-5 grid gap-4 xl:grid-cols-[1.5fr_1fr]">
        <Panel title="Recent graded responses" aside={<span className="chip">Live</span>}>
          <DataTable
            head={["Request", "Intent", "Brier", "Rank effect"]}
            rows={[
              ["req_9f21", "vertical.verify", "0.043", "+0.4"],
              ["req_9f1e", "vertical.lookup", "0.098", "+0.1"],
              ["req_9f0c", "vertical.verify", "0.211", "-0.2"],
              ["req_9ef7", "vertical.verify", "0.061", "+0.3"],
              ["req_9ee2", "vertical.lookup", "0.075", "+0.2"],
            ]}
          />
        </Panel>

        <Panel title="Season checklist">
          <ul className="space-y-3 text-[13.5px]">
            {[
              ["YAML Standard end-to-end", true],
              ["MinerRegistry on Base", true],
              ["x402 payment path exercised", true],
              ["WASM beyond hello-world", false],
              ["Agent framework integration", false],
              ["Public build posts", false],
            ].map(([t, done]) => (
              <li key={t as string} className="flex items-center justify-between gap-3">
                <span className={done ? "" : "text-muted-ink"}>{t}</span>
                <span className="chip">{done ? "Done" : "Open"}</span>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </>
  );
}
