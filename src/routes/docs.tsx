import { createFileRoute, Link } from "@tanstack/react-router";
import { BookOpen, Braces, KeyRound, TerminalSquare } from "lucide-react";
import { FeatureCard, PageHero, PageShell, Section } from "@/components/site/Page";
import { trackCta } from "@/lib/analytics";

export const Route = createFileRoute("/docs")({
  head: () => ({
    meta: [
      { title: "Docs — CALIBER" },
      {
        name: "description",
        content:
          "Quickstart for calling the CALIBER miner: registry lookup, x402 paid fetch, and reading calibrated grader scores.",
      },
      { property: "og:title", content: "Docs — CALIBER" },
      { property: "og:description", content: "Quickstart, paid fetch, and grader score reference." },
    ],
  }),
  component: DocsPage,
});

const SNIPPET = `import { resolveMiner, paidFetch } from "@caliber/sdk";

const miner = await resolveMiner("caliber-truthport");

const { data, receipt, score } = await paidFetch(miner, {
  intent: "vertical.verify",
  input: { claim: "…" },
  maxPrice: "0.02 USDC",
});

console.log(score.brier, score.calibration, receipt.tx);`;

function DocsPage() {
  return (
    <PageShell>
      <PageHero
        eyebrow="Docs"
        title="Call the miner in"
        em="four lines"
        lede="Resolve from the on-chain registry, pay with x402, and read the calibrated score alongside the answer."
      >
        <Link to="/dashboard/registry" onClick={() => trackCta("Docs · Registry console")} className="btn-base btn-solid">
          Registry explorer
        </Link>
      </PageHero>

      <Section kicker="Quickstart" title="Paid fetch">
        <pre className="panel overflow-x-auto p-6 font-mono text-[12.5px] leading-relaxed text-stat">
          {SNIPPET}
        </pre>
      </Section>

      <Section kicker="Reference" title="Where to go next.">
        <div className="grid gap-4 md:grid-cols-2">
          <FeatureCard icon={Braces} title="YAML Standard" body="Field-by-field declaration format and the checksum rules the registry enforces." />
          <FeatureCard icon={KeyRound} title="x402 settlement" body="Payment headers, price floors, retry semantics, and receipt verification." />
          <FeatureCard icon={TerminalSquare} title="Grader CLI" body="Run GRADELOCK locally against a submission and reproduce published rank deltas." />
          <FeatureCard icon={BookOpen} title="Methodology" body="How the labeled set is built, partitioned, and audited before scoring." />
        </div>
      </Section>
    </PageShell>
  );
}
