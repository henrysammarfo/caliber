import { createFileRoute, Link } from "@tanstack/react-router";
import { Database, FileCode2, Link2, Radar, ScrollText, Wallet } from "lucide-react";
import { FeatureCard, PageHero, PageShell, Section } from "@/components/site/Page";
import { trackCta } from "@/lib/analytics";
import { PROTOCOL_STATUS, YAML_PREVIEW } from "@/lib/protocol-status";

export const Route = createFileRoute("/miner")({
  head: () => ({
    meta: [
      { title: "TRUTHPORT Miner — CALIBER" },
      {
        name: "description",
        content:
          "TRUTHPORT is CALIBER's AI text-authenticity Telegraph miner: labeled holdout path, YAML Standard draft, Base registry (planned), and x402 paid fetch.",
      },
      { property: "og:title", content: "TRUTHPORT Miner — CALIBER" },
      {
        property: "og:description",
        content: "Vertical miner for text_authenticity with a schema-valid YAML draft and local detect API.",
      },
    ],
  }),
  component: MinerPage,
});

function MinerPage() {
  return (
    <PageShell>
      <PageHero
        eyebrow="TRUTHPORT"
        title="A miner with real"
        em="ground truth"
        lede="Locked vertical: AI text authenticity. Local detector ships today; on-chain registry and public HTTPS are next."
      >
        <Link to="/dashboard/miner" onClick={() => trackCta("Miner · Miner console")} className="btn-base btn-solid">
          Miner console
        </Link>
        <Link to="/docs" className="btn-base btn-ghost-metal">
          Read the docs
        </Link>
      </PageHero>

      <Section kicker="Capabilities" title="What ships in H1.">
        <div className="grid gap-4 md:grid-cols-3">
          <FeatureCard
            icon={Radar}
            title="Vertical focus"
            body="Canonical signal text_authenticity with ai_text_detection intents — not a homepage deepfake clone."
            meta="Locked"
          />
          <FeatureCard
            icon={Database}
            title="Labeled eval path"
            body={PROTOCOL_STATUS.holdout.note}
            meta={`${PROTOCOL_STATUS.holdout.rows} CI rows · RAID pending`}
          />
          <FeatureCard
            icon={FileCode2}
            title="YAML Standard"
            body="Telegraph version 1 draft with bearer auth, /detect, and direct on-chain transform."
            meta="Draft · hash ready"
          />
          <FeatureCard
            icon={Link2}
            title="Base registry"
            body="registerMiner planned on Base Sepolia once wallet + public YAML URL exist."
            meta="Not registered"
          />
          <FeatureCard
            icon={Wallet}
            title="x402 paid fetch"
            body={
              PROTOCOL_STATUS.x402.exercised
                ? `Floor ${PROTOCOL_STATUS.x402.floorUsdc} USDC. Rail exercised via dispatcher /v1/x402-test (miner proxy pending free YAML id).`
                : `Floor ${PROTOCOL_STATUS.x402.floorUsdc} USDC in YAML. Paid path not exercised yet.`
            }
            meta="Pending wallet"
          />
          <FeatureCard
            icon={ScrollText}
            title="Agent integration"
            body="POST /detect JSON contract documented in protocol/README for agent frameworks."
            meta="Documented"
          />
        </div>
      </Section>

      <Section kicker="Declaration" title="caliber-truthport.yaml">
        <pre className="panel overflow-x-auto p-6 font-mono text-[12.5px] leading-relaxed text-stat">
          {YAML_PREVIEW}
        </pre>
      </Section>
    </PageShell>
  );
}
