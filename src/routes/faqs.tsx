import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { PageHero, PageShell, Section } from "@/components/site/Page";

export const Route = createFileRoute("/faqs")({
  head: () => ({
    meta: [
      { title: "FAQs — CALIBER" },
      {
        name: "description",
        content:
          "Answers on CALIBER's vertical choice, grading methodology, anti-gaming tests, x402 payments, and the Telegraph season plan.",
      },
      { property: "og:title", content: "FAQs — CALIBER" },
      { property: "og:description", content: "Vertical, grading, anti-gaming, payments, season plan." },
    ],
  }),
  component: FaqPage,
});

const FAQ = [
  ["What exactly does CALIBER own?", "A calibrated vertical of paid intelligence on Telegraph. The miner supplies signal, the WASM grader defines what good means, and the demand app makes ranking compound."],
  ["Why is a grader necessary?", "Telegraph supply is noise without a quality layer. Substring matching cannot separate a confident wrong answer from a calibrated right one; proper scoring can."],
  ["How is gaming prevented?", "Holdout partitions, per-intent normalisation, duplicate detection and a named adversarial test suite with published rank drops."],
  ["Which vertical is it?", "The vertical is locked inside the build against label availability. Any vertical without unique labeled ground truth is rejected outright."],
  ["How do payments work?", "x402 settles each fetch. Receipts are artifacts you can verify, and the on-chain registry fields must match the YAML declaration."],
  ["Is this only a hackathon entry?", "No. H1 is the miner and grader, H2 hardens and gets pulled by apps, H3 is mainnet consumption through the demand app."],
];

function FaqPage() {
  return (
    <PageShell>
      <PageHero
        eyebrow="FAQs"
        title="Straight answers, no"
        em="cosplay"
        lede="If a claim is not measurable or reproducible, it does not appear on this site."
      >
        <Link to="/docs" className="btn-base btn-ghost-metal">
          Read the docs
        </Link>
      </PageHero>

      <Section kicker="Questions" title="Everything people ask first.">
        <Accordion type="single" collapsible className="panel px-5">
          {FAQ.map(([q, a]) => (
            <AccordionItem key={q} value={q} className="border-hair-soft">
              <AccordionTrigger className="text-left text-[15px] tracking-[-0.02em]">
                {q}
              </AccordionTrigger>
              <AccordionContent className="text-[13.5px] leading-relaxed text-muted-ink">
                {a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Section>
    </PageShell>
  );
}
