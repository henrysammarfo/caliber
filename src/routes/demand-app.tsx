import { createFileRoute, Link } from "@tanstack/react-router";
import { Boxes, CircuitBoard, Coins, LineChart, Plug, Users } from "lucide-react";
import { FeatureCard, PageHero, PageShell, Section } from "@/components/site/Page";
import { trackCta } from "@/lib/analytics";

export const Route = createFileRoute("/demand-app")({
  head: () => ({
    meta: [
      { title: "Demand App — CALIBER" },
      {
        name: "description",
        content:
          "The CALIBER demand app is a product that only works by paying the miner, turning ranked signal into mainnet consumption in H2 and H3.",
      },
      { property: "og:title", content: "Demand App — CALIBER" },
      {
        property: "og:description",
        content: "A product that cannot work without paying CALIBER's miner.",
      },
    ],
  }),
  component: DemandAppPage,
});

function DemandAppPage() {
  return (
    <PageShell>
      <PageHero
        eyebrow="H2 / H3"
        title="Demand that closes the"
        em="loop"
        lede="Ranking only compounds when something pays for it. The demand app is designed so it cannot function without CALIBER's miner."
      >
        <Link to="/roadmap" onClick={() => trackCta("Demand app · Roadmap")} className="btn-base btn-solid">
          See the season map
        </Link>
        <Link to="/pricing" className="btn-base btn-ghost-metal">
          Consumption pricing
        </Link>
      </PageHero>

      <Section kicker="Design" title="Built to be dependent, on purpose.">
        <div className="grid gap-4 md:grid-cols-3">
          <FeatureCard icon={Plug} title="Single source of signal" body="Every answer surface resolves through the registered miner intent, not a fallback API." />
          <FeatureCard icon={Coins} title="x402 at the edge" body="Each user action carries a paid fetch, so usage is settlement, not a vanity metric." />
          <FeatureCard icon={CircuitBoard} title="Grader in the product" body="Confidence shown to the user is the same calibrated score validators see." />
          <FeatureCard icon={LineChart} title="Consumption telemetry" body="Paid calls, receipts, and rank movement tracked in one console view." />
          <FeatureCard icon={Users} title="Agent-first surface" body="Agents call the same intents humans do — the vertical becomes paid agent intent." />
          <FeatureCard icon={Boxes} title="Season continuity" body="H1 miner and grader are the runtime, not a demo discarded after submission." />
        </div>
      </Section>
    </PageShell>
  );
}
