import { createFileRoute, Link } from "@tanstack/react-router";
import { Database, FileCode2, Link2, Radar, ScrollText, Wallet } from "lucide-react";
import { FeatureCard, PageHero, PageShell, Section } from "@/components/site/Page";

export const Route = createFileRoute("/miner")({
  head: () => ({
    meta: [
      { title: "TRUTHPORT Miner — CALIBER" },
      {
        name: "description",
        content:
          "TRUTHPORT is CALIBER's vertical Telegraph miner: labeled ground truth, YAML Standard declaration, Base registry, and x402 paid fetch.",
      },
      { property: "og:title", content: "TRUTHPORT Miner — CALIBER" },
      {
        property: "og:description",
        content: "A vertical miner with real labeled ground truth and a paid fetch path.",
      },
    ],
  }),
  component: MinerPage,
});

const YAML = `name: caliber-truthport
version: 0.4.1
intents:
  - vertical.lookup
  - vertical.verify
endpoint: https://miner.caliber.xyz/v1/answer
checksum: sha256:9f2c…41ab
payment:
  scheme: x402
  floor: 0.02 USDC
eval:
  labeled_set: caliber-gold-v3
  size: 4128`;

function MinerPage() {
  return (
    <PageShell>
      <PageHero
        eyebrow="TRUTHPORT"
        title="A miner with real"
        em="ground truth"
        lede="One sharp vertical, a labeled evaluation set, and a declaration that matches the chain byte for byte."
      >
        <Link to="/dashboard/miner" className="btn-base btn-solid">
          Miner console
        </Link>
        <Link to="/docs" className="btn-base btn-ghost-metal">
          Read the docs
        </Link>
      </PageHero>

      <Section kicker="Capabilities" title="What ships in H1.">
        <div className="grid gap-4 md:grid-cols-3">
          <FeatureCard icon={Radar} title="Vertical focus" body="A single intent surface chosen for label availability, not breadth." meta="Locked in build" />
          <FeatureCard icon={Database} title="Labeled eval set" body="Ground truth assembled from research dumps with provenance recorded per row." meta="4,128 rows" />
          <FeatureCard icon={FileCode2} title="YAML Standard" body="End-to-end declaration: intents, endpoint, checksum, price floor." meta="Spec-complete" />
          <FeatureCard icon={Link2} title="Base registry" body="MinerRegistry entry mirrors the YAML fields; drift is a failed check." meta="On-chain" />
          <FeatureCard icon={Wallet} title="x402 paid fetch" body="Every consumer request settles with a verifiable receipt artifact." meta="Receipted" />
          <FeatureCard icon={ScrollText} title="Agent integration" body="Documented adapters so agent frameworks can call the miner directly." meta="Documented" />
        </div>
      </Section>

      <Section kicker="Declaration" title="miner.yaml">
        <pre className="panel overflow-x-auto p-6 font-mono text-[12.5px] leading-relaxed text-stat">
          {YAML}
        </pre>
      </Section>
    </PageShell>
  );
}
