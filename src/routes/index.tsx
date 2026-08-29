import { createFileRoute, Link } from "@tanstack/react-router";
import { Boxes, Gauge, Radar, ShieldCheck, Workflow, Zap } from "lucide-react";
import { Grain, useAppear } from "@/components/site/Chrome";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { FeatureCard, Section } from "@/components/site/Page";
import heroBg from "@/assets/hero-bg.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CALIBER — Calibrated Intelligence for Telegraph" },
      {
        name: "description",
        content:
          "CALIBER supplies a vertical miner, an anti-game WASM grader, and a demand app so Telegraph signal is ranked, paid, and provable.",
      },
      { property: "og:title", content: "CALIBER — Calibrated Intelligence for Telegraph" },
      {
        property: "og:description",
        content: "Miner, WASM grader, and demand app for verified vertical intelligence.",
      },
    ],
  }),
  component: Index,
});

const STATS = [
  { icon: Workflow, value: "3-phase", label: "season thesis, H1 → H3" },
  { icon: ShieldCheck, value: "Brier-scored", label: "anti-game calibration grading" },
  { icon: Zap, value: "x402", label: "paid fetch on Base registry" },
];

function Index() {
  useAppear();
  return (
    <div className="relative min-h-screen bg-background">
      <Grain />
      <img
        src={heroBg}
        alt=""
        aria-hidden="true"
        width={1920}
        height={1080}
        className="pointer-events-none fixed inset-0 h-full w-full object-cover"
      />
      <div className="relative z-1 flex min-h-screen flex-col">
        <SiteHeader />

        <main className="flex flex-1 flex-col">
          <section className="flex flex-1 items-end justify-center px-6 pt-8 pb-16 lg:pb-[85px]">
            <div className="w-full max-w-[860px] text-center">
              <span className="badge-metal appear appear--pop [--d:0.22s]">
                <Radar className="h-4 w-4" strokeWidth={1.7} />
                Calibrated Vertical Intelligence
              </span>
              <h1 className="mt-[22px] flex flex-col text-[clamp(34px,5.6vw,64px)] leading-[1.12] font-medium tracking-[-0.045em]">
                <span className="headline-line appear appear--mask [--d:0.42s]">
                  Rank the <em className="serif-em hero-em not-italic">signal</em> before
                </span>
                <span className="headline-line appear appear--mask [--d:0.62s]">
                  anyone pays for it.
                </span>
              </h1>
              <p className="appear appear--soft mx-auto mt-[18px] max-w-[470px] text-[15.5px] leading-[1.55] tracking-[-0.015em] text-muted-ink [--d:0.82s]">
                CALIBER registers a vertical miner, scores it with a proper-scoring WASM grader, and
                drives demand that only works on ranked, paid signal.
              </p>
              <div className="mt-[26px] flex flex-wrap justify-center gap-2.5">
                <Link
                  to="/dashboard"
                  className="btn-base btn-solid appear appear--btn h-[42px] px-[18px] [--d:0.96s]"
                >
                  Open the Console
                </Link>
                <Link
                  to="/protocol"
                  className="btn-base btn-ghost-metal appear appear--side h-[42px] px-[18px] [--d:1.1s]"
                >
                  See the thesis
                </Link>
              </div>
            </div>
          </section>

          <div className="flex flex-col items-center justify-between gap-4 px-6 pb-9 text-[13.5px] text-stat lg:flex-row lg:px-[72px]">
            {STATS.map((s, i) => (
              <span
                key={s.label}
                className="appear appear--stat inline-flex items-center gap-3.5 tracking-[-0.015em]"
                style={{ ["--d" as string]: `${1.12 + i * 0.16}s` }}
              >
                <s.icon className="h-5 w-5 text-[#e8e8e8]" strokeWidth={1.6} />
                <span>
                  <strong className="font-medium text-foreground">{s.value}</strong> {s.label}
                </span>
              </span>
            ))}
          </div>

          <Section
            kicker="Modules"
            title="Three parts. One compounding loop."
          >
            <div className="grid gap-4 md:grid-cols-3">
              <FeatureCard
                icon={Radar}
                title="TRUTHPORT — Miner"
                body="One sharp vertical backed by real labeled ground truth, published through the YAML Standard and registered on Base."
                meta="H1 · shipping"
              />
              <FeatureCard
                icon={Gauge}
                title="GRADELOCK — WASM Grader"
                body="Proper scoring rules and calibration, not substring matching. Adversarial miners lose rank on the record."
                meta="H1 → H2 · hardening"
              />
              <FeatureCard
                icon={Boxes}
                title="Demand App"
                body="A product that only works by paying CALIBER's miner, turning ranking quality into mainnet consumption."
                meta="H2 / H3"
              />
            </div>
          </Section>

          <Section kicker="Why it wins" title="Anti-game math, not a YAML wrapper.">
            <div className="grid gap-4 md:grid-cols-2">
              <FeatureCard
                icon={ShieldCheck}
                title="Gaming resistance is measured"
                body="Every grader release ships adversarial miner tests with documented rank drops, so validators can reproduce the claim."
              />
              <FeatureCard
                icon={Zap}
                title="Paid path exercised end to end"
                body="x402 receipts, on-chain registry fields matching the YAML, and an agent framework integration documented in the README."
              />
            </div>
          </Section>
        </main>

        <SiteFooter />
      </div>
    </div>
  );
}
