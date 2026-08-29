import { createFileRoute, Link } from "@tanstack/react-router";
import { Binary, Crosshair, Gauge, ShieldAlert, Sigma, TestTube2 } from "lucide-react";
import { FeatureCard, PageHero, PageShell, Section } from "@/components/site/Page";
import { trackCta } from "@/lib/analytics";

export const Route = createFileRoute("/grader")({
  head: () => ({
    meta: [
      { title: "GRADELOCK Grader — CALIBER" },
      {
        name: "description",
        content:
          "GRADELOCK is a WASM grader using proper scoring rules and calibration to rank Telegraph miners and drop adversarial submissions.",
      },
      { property: "og:title", content: "GRADELOCK Grader — CALIBER" },
      {
        property: "og:description",
        content: "Proper scoring in WASM with published adversarial rank drops.",
      },
    ],
  }),
  component: GraderPage,
});

const TESTS = [
  { name: "Confidence inflation", drop: "-38 rank", note: "Overconfident wrong answers punished by Brier." },
  { name: "Hedge spam", drop: "-21 rank", note: "Uniform 0.5 predictions score below the base rate." },
  { name: "Label echo", drop: "-64 rank", note: "Replay of leaked labels caught by holdout partition." },
  { name: "Volume flood", drop: "-12 rank", note: "Per-intent normalisation removes throughput advantage." },
];

function GraderPage() {
  return (
    <PageShell>
      <PageHero
        eyebrow="GRADELOCK"
        title="Scoring math that"
        em="cannot be gamed"
        lede="Brier score, calibration curves, and holdout partitions compiled to WASM — with adversarial tests shipped alongside."
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
          <FeatureCard icon={Sigma} title="Proper scoring" body="Brier and log loss reward honest probabilities instead of confident guesses." />
          <FeatureCard icon={Crosshair} title="Calibration" body="Reliability bins expose systematic over- and under-confidence per intent." />
          <FeatureCard icon={Binary} title="Deterministic WASM" body="Same bytes, same score, anywhere a validator runs it." />
          <FeatureCard icon={ShieldAlert} title="Anti-game rules" body="Holdout partitions, per-intent normalisation, and duplicate detection." />
          <FeatureCard icon={TestTube2} title="Adversarial suite" body="Named attacks with reproducible rank deltas checked into the repo." />
          <FeatureCard icon={Gauge} title="Agreement metric" body="Grader agreement against the labeled set is the published pass bar." />
        </div>
      </Section>

      <Section kicker="Evidence" title="Adversarial miners lose rank.">
        <div className="panel overflow-hidden">
          <table className="w-full text-left text-[13.5px]">
            <thead className="border-b border-hair-soft text-[11.5px] tracking-[0.06em] text-stat uppercase">
              <tr>
                <th className="px-5 py-3 font-normal">Attack</th>
                <th className="px-5 py-3 font-normal">Rank delta</th>
                <th className="hidden px-5 py-3 font-normal md:table-cell">Why it fails</th>
              </tr>
            </thead>
            <tbody>
              {TESTS.map((t) => (
                <tr key={t.name} className="border-b border-hair-soft last:border-0">
                  <td className="px-5 py-3.5">{t.name}</td>
                  <td className="px-5 py-3.5 font-medium">{t.drop}</td>
                  <td className="hidden px-5 py-3.5 text-muted-ink md:table-cell">{t.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>
    </PageShell>
  );
}
