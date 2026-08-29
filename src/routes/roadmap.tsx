import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, Circle, Flag } from "lucide-react";
import { PageHero, PageShell, Section } from "@/components/site/Page";
import { trackCta } from "@/lib/analytics";

export const Route = createFileRoute("/roadmap")({
  head: () => ({
    meta: [
      { title: "Roadmap — CALIBER" },
      {
        name: "description",
        content:
          "CALIBER's Telegraph Season I roadmap: H1 miner and registry, H2 hardened grader and pull-through, H3 mainnet consumption.",
      },
      { property: "og:title", content: "Roadmap — CALIBER" },
      { property: "og:description", content: "H1 to H3: miner, grader, demand app." },
    ],
  }),
  component: RoadmapPage,
});

const PHASES = [
  {
    phase: "H1",
    when: "Sep 7 · 12:00 UTC",
    pool: "$5k",
    ship: "Miner and script · YAML · Base registry · x402",
    items: [
      { done: true, t: "Lock vertical and labeled eval set" },
      { done: true, t: "YAML miner + MinerRegistry entry" },
      { done: false, t: "GRADELOCK WASM + gaming tests" },
      { done: false, t: "Build thread, video, submission" },
    ],
  },
  {
    phase: "H2",
    when: "mid-October",
    pool: "$10k",
    ship: "Harden grader · apps pull the miner · public proof",
    items: [
      { done: false, t: "Grader hardening pass" },
      { done: false, t: "First external app pulls the miner" },
      { done: false, t: "Demand app stub shipped" },
    ],
  },
  {
    phase: "H3",
    when: "Dec 2026+",
    pool: "TBD",
    ship: "Mainnet consumption · vertical as paid agent intent",
    items: [
      { done: false, t: "Mainnet consumption live" },
      { done: false, t: "Hosted vertical API" },
    ],
  },
];

function RoadmapPage() {
  return (
    <PageShell>
      <PageHero
        eyebrow="Telegraph Season I"
        title="A season thesis, not a"
        em="weekend toy"
        lede="Every phase depends on the last. Re-check the portal before submit; pools update from the live source."
      >
        <Link to="/dashboard" onClick={() => trackCta("Roadmap · Open console")} className="btn-base btn-solid">
          Track progress
        </Link>
      </PageHero>

      <Section kicker="Phases" title="H1 → H3">
        <div className="grid gap-4 md:grid-cols-3">
          {PHASES.map((p) => (
            <article key={p.phase} className="panel p-6">
              <div className="flex items-center justify-between">
                <span className="chip">
                  <Flag className="h-3.5 w-3.5" strokeWidth={1.7} />
                  {p.phase}
                </span>
                <span className="text-[13.5px] font-medium">{p.pool}</span>
              </div>
              <h3 className="mt-4 text-[15px] font-medium tracking-[-0.02em]">{p.ship}</h3>
              <p className="mt-1 text-[12.5px] text-muted-ink">{p.when}</p>
              <ul className="mt-5 space-y-2.5">
                {p.items.map((it) => (
                  <li key={it.t} className="flex items-start gap-2.5 text-[13.5px] text-muted-ink">
                    {it.done ? (
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-foreground" strokeWidth={1.7} />
                    ) : (
                      <Circle className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={1.5} />
                    )}
                    <span className={it.done ? "text-foreground" : ""}>{it.t}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </Section>

      <Section kicker="Pass bars" title="How each phase is judged.">
        <div className="panel overflow-hidden">
          <table className="w-full text-left text-[13.5px]">
            <thead className="border-b border-hair-soft text-[11.5px] tracking-[0.06em] text-stat uppercase">
              <tr>
                <th className="px-5 py-3 font-normal">Metric</th>
                <th className="px-5 py-3 font-normal">Pass</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Ranking quality", "Grader agreement vs the labeled set, defined in the README"],
                ["Gaming resistance", "Adversarial miner rank drop documented"],
                ["Paid path", "x402 transaction artifact"],
                ["Registry", "On-chain fields match the YAML"],
                ["Season", "Demand app that cannot work without the miner"],
              ].map(([k, v]) => (
                <tr key={k} className="border-b border-hair-soft last:border-0">
                  <td className="px-5 py-3.5">{k}</td>
                  <td className="px-5 py-3.5 text-muted-ink">{v}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>
    </PageShell>
  );
}
