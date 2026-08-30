import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, Circle, Flag } from "lucide-react";
import { PageHero, PageShell, Section } from "@/components/site/Page";
import { trackCta } from "@/lib/analytics";
import { PROTOCOL_STATUS } from "@/lib/protocol-status";

export const Route = createFileRoute("/roadmap")({
  head: () => ({
    meta: [
      { title: "Roadmap — CALIBER" },
      {
        name: "description",
        content:
          "CALIBER Telegraph Season I roadmap: H1 miner and grader, H2 hardening, H3 mainnet — honest done/open status.",
      },
      { property: "og:title", content: "Roadmap — CALIBER" },
      { property: "og:description", content: "H1 to H3 with live checklist status." },
    ],
  }),
  component: RoadmapPage,
});

const PHASES = [
  {
    phase: "H1",
    when: "Miner/Script Aug 31; Apps Sep 7",
    pool: "$5k",
    ship: "Miner + Script · YAML · registry · x402",
    items: PROTOCOL_STATUS.checklist.map((c) => ({ done: c.done, t: c.label })),
  },
  {
    phase: "H2",
    when: "mid-October",
    pool: "$10k",
    ship: "Harden grader · apps pull the miner · public proof",
    items: [
      { done: false, t: "Grader hardening on RAID holdout" },
      { done: false, t: "First external app pulls the miner" },
      { done: false, t: "Demand app that only works via miner" },
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
        lede="Every phase depends on the last. Track 1/2 (Miner+Script) close Aug 31, 2026; Track 3 apps Aug 31-Sep 7 (portal rules)."
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
    </PageShell>
  );
}
