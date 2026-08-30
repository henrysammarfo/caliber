import { createFileRoute } from "@tanstack/react-router";
import { Crosshair, ShieldAlert, Sigma, TestTube2 } from "lucide-react";
import { DashHeader, DataTable, Panel, StatCard } from "@/components/dash/DashKit";
import { usePageView } from "@/lib/use-analytics";
import { trackCta } from "@/lib/analytics";
import { PROTOCOL_STATUS } from "@/lib/protocol-status";

export const Route = createFileRoute("/_authenticated/dashboard/grader")({
  head: () => ({
    meta: [
      { title: "Grader — CALIBER Console" },
      {
        name: "description",
        content: "GRADELOCK status from protocol smoke: Brier, WASM build, and adversarial rank drops.",
      },
      { property: "og:title", content: "Grader — CALIBER Console" },
      { property: "og:description", content: "Honest CI grader metrics — not live mainnet." },
    ],
  }),
  component: GraderConsole,
});

function GraderConsole() {
  usePageView("Grader");
  const passed = PROTOCOL_STATUS.smoke.adversarial.filter((a) => a.passed).length;
  return (
    <>
      <DashHeader
        title="Grader"
        subtitle={`GRADELOCK · ${PROTOCOL_STATUS.wasm.path} · ABI ${PROTOCOL_STATUS.wasm.abi}`}
        action={
          <button className="btn-base btn-solid" onClick={() => trackCta("Console · Run adversarial suite")}>
            See protocol smoke
          </button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={Sigma}
          label="Honest mean Brier"
          value={PROTOCOL_STATUS.smoke.honestMeanBrier.toFixed(3)}
          delta="Lower is better · synthetic-ci"
          delay={0.1}
        />
        <StatCard
          icon={Crosshair}
          label="Holdout rows"
          value={String(PROTOCOL_STATUS.holdout.holdoutPartitionRows)}
          delta={`${PROTOCOL_STATUS.holdout.rows} total fixture · RAID not imported`}
          delay={0.2}
        />
        <StatCard
          icon={ShieldAlert}
          label="Attacks worse than honest"
          value={`${passed} / ${PROTOCOL_STATUS.smoke.adversarial.length}`}
          delta={`Smoke ${PROTOCOL_STATUS.smoke.asOf}`}
          delay={0.3}
        />
        <StatCard
          icon={TestTube2}
          label="WASM"
          value={PROTOCOL_STATUS.wasm.built ? "Built" : "Missing"}
          delta={PROTOCOL_STATUS.wasm.abiNote}
          delay={0.4}
        />
      </div>

      <div className="mt-5 grid gap-4 xl:grid-cols-2">
        <Panel title="Holdout provenance">
          <p className="text-[13.5px] leading-relaxed text-muted-ink">{PROTOCOL_STATUS.holdout.note}</p>
          <p className="mt-3 text-[13.5px] text-muted-ink">
            Run locally: <code className="text-stat">cd protocol && npm run smoke</code>
          </p>
        </Panel>
        <Panel title="Adversarial suite">
          <DataTable
            head={["Attack", "Result", "Rank drop"]}
            rows={PROTOCOL_STATUS.smoke.adversarial.map((a) => [
              a.name,
              a.passed ? "Pass" : "Fail",
              `-${a.rankDrop}`,
            ])}
          />
        </Panel>
      </div>
    </>
  );
}
