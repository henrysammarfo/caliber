import { createFileRoute, Link } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { PageHero, PageShell, Section } from "@/components/site/Page";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing — CALIBER" },
      {
        name: "description",
        content:
          "CALIBER pricing: metered x402 paid fetch per intent, plus hosted vertical API tiers for teams and agent fleets.",
      },
      { property: "og:title", content: "Pricing — CALIBER" },
      { property: "og:description", content: "Metered paid fetch and hosted vertical API tiers." },
    ],
  }),
  component: PricingPage,
});

const TIERS = [
  {
    name: "Probe",
    price: "Free",
    unit: "1k graded calls / mo",
    features: ["Public intents", "Calibrated confidence returned", "Registry lookup", "Community support"],
    cta: "Start probing",
    solid: false,
  },
  {
    name: "Operator",
    price: "$0.02",
    unit: "per paid fetch, x402 settled",
    features: ["All intents", "Receipt artifacts", "Grader score per response", "Adversarial audit log", "Priority routing"],
    cta: "Open console",
    solid: true,
  },
  {
    name: "Vertical",
    price: "Custom",
    unit: "hosted API + labeled set access",
    features: ["Dedicated miner shard", "Custom eval partition", "Demand app integration", "SLA + on-call"],
    cta: "Talk to us",
    solid: false,
  },
];

function PricingPage() {
  return (
    <PageShell>
      <PageHero
        eyebrow="Pricing"
        title="Pay for ranked"
        em="signal"
        lede="No seats, no shelfware. Settlement happens per fetch, and the score travels with the answer."
      />
      <Section kicker="Tiers" title="Three ways to consume.">
        <div className="grid gap-4 md:grid-cols-3">
          {TIERS.map((t) => (
            <article
              key={t.name}
              className={`panel flex flex-col p-6 ${t.solid ? "border-white/30" : ""}`}
            >
              <span className="chip">{t.name}</span>
              <p className="mt-5 text-[34px] leading-none font-medium tracking-[-0.04em]">{t.price}</p>
              <p className="mt-2 text-[13px] text-muted-ink">{t.unit}</p>
              <ul className="mt-6 flex-1 space-y-2.5">
                {t.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-[13.5px] text-muted-ink">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-foreground" strokeWidth={1.7} />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                to="/dashboard"
                className={`mt-7 w-full ${t.solid ? "btn-base btn-solid" : "btn-base btn-ghost-metal"}`}
              >
                {t.cta}
              </Link>
            </article>
          ))}
        </div>
      </Section>
    </PageShell>
  );
}
