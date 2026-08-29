import { createFileRoute, Link } from "@tanstack/react-router";
import { Boxes, FileCode2, Gauge, Layers, Radar, ShieldCheck } from "lucide-react";
import { FeatureCard, PageHero, PageShell, Section } from "@/components/site/Page";

export const Route = createFileRoute("/protocol")({
  head: () => ({
    meta: [
      { title: "Protocol — CALIBER" },
      {
        name: "description",
        content:
          "How CALIBER turns Telegraph supply into ranked, paid intelligence: miner, WASM grader, registry, and x402 settlement.",
      },
      { property: "og:title", content: "Protocol — CALIBER" },
      {
        property: "og:description",
        content: "Miner, WASM grader, registry, and x402 settlement in one loop.",
      },
    ],
  }),
  component: ProtocolPage,
});

const FLOW = [
  { icon: Radar, title: "1 · Supply", body: "TRUTHPORT publishes vertical answers against a labeled evaluation set." },
  { icon: FileCode2, title: "2 · Declare", body: "The YAML Standard describes intents, endpoints, SHA-256, and the price floor." },
  { icon: Layers, title: "3 · Register", body: "MinerRegistry on Base anchors URL, hash, intents and floor on-chain." },
  { icon: Gauge, title: "4 · Grade", body: "GRADELOCK scores each response in WASM with proper scoring and calibration." },
  { icon: ShieldCheck, title: "5 · Defend", body: "Adversarial submissions are ranked down and the drop is published." },
  { icon: Boxes, title: "6 · Consume", body: "x402 settles the paid fetch; demand compounds the miner's ranking." },
];

function ProtocolPage() {
  return (
    <PageShell>
      <PageHero
        eyebrow="Season I thesis"
        title="Supply is noise without a"
        em="quality layer"
        lede="Telegraph rewards ranked signal. CALIBER makes ranking measurable, adversarial-tested, and payable."
      >
        <Link to="/miner" className="btn-base btn-solid">
          Inspect the miner
        </Link>
        <Link to="/grader" className="btn-base btn-ghost-metal">
          Inspect the grader
        </Link>
      </PageHero>

      <Section kicker="Loop" title="Six steps, one compounding cycle.">
        <div className="grid gap-4 md:grid-cols-3">
          {FLOW.map((f) => (
            <FeatureCard key={f.title} icon={f.icon} title={f.title} body={f.body} />
          ))}
        </div>
      </Section>

      <Section kicker="Guardrails" title="What CALIBER will not ship.">
        <ul className="grid gap-3 md:grid-cols-2">
          {[
            "Homepage deepfake cosplay without unique labeled data.",
            "An H1 toy with no H2 demand path.",
            "A string-match \u201cgrader\u201d dressed up as scoring.",
            "\u201cVerified truth\u201d claims with no published methodology.",
          ].map((t) => (
            <li key={t} className="panel px-5 py-4 text-[13.5px] text-muted-ink">
              {t}
            </li>
          ))}
        </ul>
      </Section>
    </PageShell>
  );
}
