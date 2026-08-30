import { createFileRoute } from "@tanstack/react-router";
import { Coins, Receipt, TrendingUp, Wallet } from "lucide-react";
import { DashHeader, DataTable, Panel, StatCard } from "@/components/dash/DashKit";
import { usePageView } from "@/lib/use-analytics";
import { PROTOCOL_STATUS } from "@/lib/protocol-status";

export const Route = createFileRoute("/_authenticated/dashboard/payments")({
  head: () => ({
    meta: [
      { title: "Payments — CALIBER Console" },
      {
        name: "description",
        content: "x402 settlement status. Paid rail exercised on Telegraph dispatcher.",
      },
      { property: "og:title", content: "Payments — CALIBER Console" },
      { property: "og:description", content: "x402 status — rail exercised; miner proxy pending." },
    ],
  }),
  component: PaymentsConsole,
});

function PaymentsConsole() {
  usePageView("Payments");
  const x = PROTOCOL_STATUS.x402;
  const txShort = x.txHash ? `${x.txHash.slice(0, 10)}…${x.txHash.slice(-6)}` : "—";
  return (
    <>
      <DashHeader title="Payments" subtitle="x402 settlement · Base Sepolia" />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={Coins}
          label="Last settle"
          value={x.exercised ? "0.01 USDC" : "—"}
          delta={x.asOf ? `as of ${x.asOf}` : "no receipt"}
          delay={0.1}
        />
        <StatCard
          icon={Wallet}
          label="Price floor"
          value={`${x.floorUsdc} USDC`}
          delta="On-chain minPriceUsdc"
          delay={0.2}
        />
        <StatCard
          icon={Receipt}
          label="Path exercised"
          value={x.exercised ? "Yes" : "No"}
          delta={x.exercised ? "dispatcher /v1/x402-test" : "pending"}
          delay={0.3}
        />
        <StatCard
          icon={TrendingUp}
          label="Miner proxy"
          value="Pending"
          delta="YAML id 91001 collision"
          delay={0.4}
        />
      </div>

      <div className="mt-5 grid gap-4">
        <Panel title="Receipts">
          <p className="text-[13.5px] text-muted-ink">
            {x.exercised
              ? "Telegraph dispatcher x402 rail verified. Residual risk: facilitator trust — see memory/THREAT_MODEL.md."
              : "Empty until 402 → pay → PAYMENT-SIGNATURE against a live facilitator."}
          </p>
          <DataTable
            head={["Receipt", "Path", "Amount", "Tx"]}
            rows={
              x.exercised
                ? [[x.receiptPath ?? "saved", "/v1/x402-test", "0.01 USDC", txShort]]
                : [["—", "—", "—", "—"]]
            }
          />
        </Panel>
      </div>
    </>
  );
}
