import { createFileRoute } from "@tanstack/react-router";
import { Coins, Receipt, TrendingUp, Wallet } from "lucide-react";
import { DashHeader, DataTable, Panel, StatCard } from "@/components/dash/DashKit";
import { usePageView } from "@/lib/use-analytics";

export const Route = createFileRoute("/_authenticated/dashboard/payments")({
  head: () => ({
    meta: [
      { title: "Payments — CALIBER Console" },
      {
        name: "description",
        content: "x402 settlement view: paid fetch volume, receipts, price floor and payout history.",
      },
      { property: "og:title", content: "Payments — CALIBER Console" },
      { property: "og:description", content: "x402 receipts, settled volume and payouts." },
    ],
  }),
  component: PaymentsConsole,
});

function PaymentsConsole() {
  usePageView("Payments");
  return (
    <>
      <DashHeader
        title="Payments"
        subtitle="x402 settlement · USDC on Base"
        action={<button className="btn-base btn-solid">Export receipts</button>}
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={Coins} label="Settled (7d)" value="367.8 USDC" delta="18,402 paid fetches" delay={0.1} />
        <StatCard icon={Wallet} label="Price floor" value="0.02 USDC" delta="Per graded response" delay={0.2} />
        <StatCard icon={Receipt} label="Receipts issued" value="18,402" delta="100% verifiable" delay={0.3} />
        <StatCard icon={TrendingUp} label="Failed settlements" value="3" delta="Retried and cleared" delay={0.4} />
      </div>

      <div className="mt-5 grid gap-4">
        <Panel title="Recent receipts">
          <DataTable
            head={["Receipt", "Consumer", "Amount", "Tx"]}
            rows={[
              ["rcpt_31f8", "agent-fleet-04", "0.02 USDC", "0x9a12…88b1"],
              ["rcpt_31f7", "demand-app-stub", "0.02 USDC", "0x9a11…4c77"],
              ["rcpt_31f6", "agent-fleet-01", "0.02 USDC", "0x9a0f…2d10"],
              ["rcpt_31f5", "eval-harness", "0.02 USDC", "0x9a0e…b3aa"],
              ["rcpt_31f4", "agent-fleet-04", "0.02 USDC", "0x9a0c…7f52"],
            ]}
          />
        </Panel>
      </div>
    </>
  );
}
