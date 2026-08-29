import { createFileRoute } from "@tanstack/react-router";
import { Crosshair, ShieldAlert, Sigma, TestTube2 } from "lucide-react";
import { DashHeader, DataTable, Panel, StatCard } from "@/components/dash/DashKit";

export const Route = createFileRoute("/_authenticated/dashboard/grader")({
  head: () => ({
    meta: [
      { title: "Grader — CALIBER Console" },
      {
        name: "description",
        content: "GRADELOCK WASM grader status: Brier score, calibration bins and adversarial test results.",
      },
      { property: "og:title", content: "Grader — CALIBER Console" },
      { property: "og:description", content: "Brier, calibration bins and adversarial suite results." },
    ],
  }),
  component: GraderConsole,
});

const BINS = [
  ["0.0 – 0.2", "0.07", "0.09"],
  ["0.2 – 0.4", "0.29", "0.31"],
  ["0.4 – 0.6", "0.51", "0.49"],
  ["0.6 – 0.8", "0.72", "0.70"],
  ["0.8 – 1.0", "0.93", "0.91"],
];

function GraderConsole() {
  return (
    <>
      <DashHeader
        title="Grader"
        subtitle="GRADELOCK · gradelock.wasm · deterministic build 0x7c4e"
        action={<button className="btn-base btn-solid">Run adversarial suite</button>}
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={Sigma} label="Brier score" value="0.081" delta="Lower is better" delay={0.1} />
        <StatCard icon={Crosshair} label="Calibration error" value="0.019" delta="Expected calibration error" delay={0.2} />
        <StatCard icon={ShieldAlert} label="Attacks blocked" value="4 / 4" delta="Last run 2h ago" delay={0.3} />
        <StatCard icon={TestTube2} label="Agreement" value="0.912" delta="vs caliber-gold-v3" delay={0.4} />
      </div>

      <div className="mt-5 grid gap-4 xl:grid-cols-2">
        <Panel title="Reliability bins">
          <DataTable
            head={["Confidence", "Predicted", "Observed"]}
            rows={BINS}
          />
        </Panel>
        <Panel title="Adversarial suite">
          <DataTable
            head={["Attack", "Result", "Rank delta"]}
            rows={[
              ["Confidence inflation", "Blocked", "-38"],
              ["Hedge spam", "Blocked", "-21"],
              ["Label echo", "Blocked", "-64"],
              ["Volume flood", "Blocked", "-12"],
            ]}
          />
        </Panel>
      </div>
    </>
  );
}
