import { createFileRoute } from "@tanstack/react-router";
import { Shirt } from "lucide-react";
import { CaliberMark } from "@/components/brand/Logo";
import { PageHero, PageShell, Section } from "@/components/site/Page";

export const Route = createFileRoute("/merch")({
  head: () => ({
    meta: [
      { title: "Merch & Brand — CALIBER" },
      {
        name: "description",
        content:
          "The CALIBER brand kit: caliper mark, wordmark lockups, monochrome palette, and print rules for hoodies and tees.",
      },
      { property: "og:title", content: "Merch & Brand — CALIBER" },
      { property: "og:description", content: "Brand kit and merch lockups for the CALIBER mark." },
    ],
  }),
  component: MerchPage,
});

const DROPS = [
  { name: "Calibration Hoodie", detail: "Heavyweight black · white mark, left chest · 'RANK THE SIGNAL' on the back" },
  { name: "GRADELOCK Tee", detail: "Black tee · Brier curve print · serif italic 'signal' wordmark" },
  { name: "Registry Cap", detail: "Black cap · embroidered caliper mark only" },
];

function MerchPage() {
  return (
    <PageShell>
      <PageHero
        eyebrow="Brand kit"
        title="One mark, built for"
        em="cotton"
        lede="The caliper mark is a single closed silhouette: it embroiders, screen-prints, and reads at 16px without change."
      />

      <Section kicker="Mark" title="Lockups.">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="panel flex h-56 items-center justify-center">
            <CaliberMark size={72} className="text-foreground" />
          </div>
          <div className="panel flex h-56 items-center justify-center gap-3 text-[28px] font-semibold tracking-[-0.04em]">
            <CaliberMark size={34} />
            CALIBER
          </div>
          <div className="panel flex h-56 flex-col items-center justify-center gap-3">
            <CaliberMark size={34} />
            <span className="text-[13px] tracking-[0.28em] text-stat uppercase">Caliber</span>
          </div>
        </div>
      </Section>

      <Section kicker="Rules" title="Palette and print.">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="panel p-6">
            <h3 className="text-[15px] font-medium">Palette</h3>
            <div className="mt-4 grid grid-cols-4 gap-3">
              {[
                ["#000000", "Ink"],
                ["#ffffff", "Paper"],
                ["#9a9a9a", "Muted"],
                ["#d8d8d8", "Stat"],
              ].map(([hex, name]) => (
                <div key={hex}>
                  <div
                    className="h-16 rounded-md border border-hair"
                    style={{ backgroundColor: hex }}
                  />
                  <p className="mt-2 text-[12px] text-muted-ink">
                    {name} · {hex}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div className="panel p-6">
            <h3 className="text-[15px] font-medium">Print rules</h3>
            <ul className="mt-4 space-y-2.5 text-[13.5px] text-muted-ink">
              <li>Mark clear space equals the width of one bar on every side.</li>
              <li>Minimum embroidered size 18mm; below that use the mark alone.</li>
              <li>Never rotate, recolor, outline, or add gradients to the mark.</li>
              <li>Wordmark is Inter 600 at -0.03em tracking; italics are Instrument Serif only.</li>
            </ul>
          </div>
        </div>
      </Section>

      <Section kicker="Drops" title="Season I merch.">
        <div className="grid gap-4 md:grid-cols-3">
          {DROPS.map((d) => (
            <article key={d.name} className="panel p-6">
              <Shirt className="h-5 w-5 text-stat" strokeWidth={1.6} />
              <h3 className="mt-4 text-[16px] font-medium tracking-[-0.02em]">{d.name}</h3>
              <p className="mt-2 text-[13.5px] leading-relaxed text-muted-ink">{d.detail}</p>
              <p className="mt-4 text-[12px] tracking-[0.04em] text-stat uppercase">Waitlist</p>
            </article>
          ))}
        </div>
      </Section>
    </PageShell>
  );
}
