import { createFileRoute, Link } from "@tanstack/react-router";
import { BookOpen, Braces, KeyRound, TerminalSquare } from "lucide-react";
import { FeatureCard, PageHero, PageShell, Section } from "@/components/site/Page";
import { trackCta } from "@/lib/analytics";
import { PROTOCOL_STATUS } from "@/lib/protocol-status";

export const Route = createFileRoute("/docs")({
  head: () => ({
    meta: [
      { title: "Docs — CALIBER" },
      {
        name: "description",
        content: "Call TRUTHPORT locally today; paid registry fetch comes after Base registration.",
      },
      { property: "og:title", content: "Docs — CALIBER" },
      { property: "og:description", content: "Local detect quickstart and protocol references." },
    ],
  }),
  component: DocsPage,
});

const SNIPPET = `# Local miner (no chain yet)
curl -s http://127.0.0.1:8787/health

curl -s -X POST http://127.0.0.1:8787/detect \\
  -H "content-type: application/json" \\
  -d '{"text":"Your paragraph to score for AI-likeness."}'

# Response fields: confidence (0-1), isAI, explanation, model
# Intents (YAML): ${PROTOCOL_STATUS.vertical.intents.join(", ")}
# Grader: cd protocol && npm run smoke`;

function DocsPage() {
  return (
    <PageShell>
      <PageHero
        eyebrow="Docs"
        title="Detect locally in"
        em="one request"
        lede="Public registry + x402 come after HTTPS hosting and Base Sepolia registration. Until then, use the local miner."
      >
        <Link to="/dashboard/registry" onClick={() => trackCta("Docs · Registry console")} className="btn-base btn-solid">
          Registry status
        </Link>
      </PageHero>

      <Section kicker="Quickstart" title="Local detect">
        <pre className="panel overflow-x-auto p-6 font-mono text-[12.5px] leading-relaxed text-stat">{SNIPPET}</pre>
      </Section>

      <Section kicker="Reference" title="Where to go next.">
        <div className="grid gap-4 md:grid-cols-2">
          <FeatureCard icon={Braces} title="YAML Standard" body={`Draft at ${PROTOCOL_STATUS.yaml.path} — Telegraph version "1".`} />
          <FeatureCard icon={KeyRound} title="x402 settlement" body="402 → pay → PAYMENT-SIGNATURE. Not exercised live yet." />
          <FeatureCard icon={TerminalSquare} title="Grader CLI" body="cd protocol && npm run smoke · adversarial rank drops printed." />
          <FeatureCard icon={BookOpen} title="Methodology" body="Synthetic-ci holdout now; RAID (MIT) is the primary real holdout path." />
        </div>
      </Section>
    </PageShell>
  );
}
