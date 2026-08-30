import { createFileRoute, Link } from "@tanstack/react-router";
import { Binary, Crosshair, Gauge, ShieldAlert, Sigma, TestTube2 } from "lucide-react";
import { FeatureCard, PageHero, PageShell, Section } from "@/components/site/Page";
import { trackCta } from "@/lib/analytics";
import { PROTOCOL_STATUS } from "@/lib/protocol-status";

export const Route = createFileRoute("/grader")({
  head: () => ({
    meta: [
      { title: "GRADELOCK Grader — CALIBER" },
      {
        name: "description",
        content:
          "GRADELOCK ranks Telegraph miners with Brier proper scoring and published adversarial tests, compiled to WASM.",
      },
      { property: "og:title", content: "GRADELOCK Grader — CALIBER" },
      {
        property: "og:description",
        content: "Proper scoring in WASM with measured adversarial rank drops on the CI holdout.",
      },
    ],
  }),
  component: GraderPage,
});

function GraderPage() {
  return (
    <PageShell>
      <PageHero
        eyebrow="GRADELOCK"
        title="Scoring math with"
        em="resistance to gaming"
        lede="Brier score and holdout partitions compiled to WASM. Adversarial miners lose rank — residual risk remains; we do not claim ungameable."
      >
        <Link to="/dashboard/grader" onClick={() => trackCta("Grader · Grader console")} className="btn-base btn-solid">
          Grader console
        </Link>
        <Link to="/protocol" className="btn-base btn-ghost-metal">
          How it plugs in
        </Link>
      </PageHero>

      <Section kicker="Method" title="Beyond hello-world WASM.">
        <div className="grid gap-4 md:grid-cols-3">
          <FeatureCard icon={Sigma} title="Proper scoring" body="Brier rewards honest probabilities instead of confident guesses." />
          <FeatureCard icon={Crosshair} title="Calibration" body="Reliability bins expose systematic over- and under-confidence." />
          <FeatureCard
            icon={Binary}
            title="Deterministic WASM"
            body="gradelock.wasm built in-repo. Official Telegraph ABI still PARTIAL — community checker target."
          />
          <FeatureCard icon={ShieldAlert} title="Anti-game suite" body="Named attacks with measured rank drops in CI smoke." />
          <FeatureCard icon={TestTube2} title="Adversarial suite" body="Inflation, hedge spam, label echo, and volume attacks checked in." />
          <FeatureCard
            icon={Gauge}
            title="Pass bar"
            body={`Honest mean Brier ≈ ${PROTOCOL_STATUS.smoke.honestMeanBrier.toFixed(3)} on synthetic-ci holdout (${PROTOCOL_STATUS.smoke.asOf}).`}
          />
        </div>
      </Section>

      <Section kicker="Evidence" title="Adversarial miners lose rank.">
        <div className="panel overflow-hidden">
          <table className="w-full text-left text-[13.5px]">
            <thead className="border-b border-hair-soft text-[11.5px] tracking-[0.06em] text-stat uppercase">
              <tr>
                <th className="px-5 py-3 font-normal">Attack</th>
                <th className="px-5 py-3 font-normal">Rank drop</th>
                <th className="hidden px-5 py-3 font-normal md:table-cell">Status</th>
              </tr>
            </thead>
            <tbody>
              {PROTOCOL_STATUS.smoke.adversarial.map((t) => (
                <tr key={t.name} className="border-b border-hair-soft last:border-0">
                  <td className="px-5 py-3.5">{t.name}</td>
                  <td className="px-5 py-3.5 font-medium">-{t.rankDrop}</td>
                  <td className="hidden px-5 py-3.5 text-muted-ink md:table-cell">
                    {t.passed ? "Worse than honest on CI holdout" : "Failing"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="border-t border-hair-soft px-5 py-3 text-[12.5px] text-muted-ink">
            Source: <code className="text-stat">protocol</code> smoke · synthetic-ci only · RAID import still open.
          </p>
        </div>
      </Section>
    </PageShell>
  );
}
