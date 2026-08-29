import { Link } from "@tanstack/react-router";
import { CaliberMark } from "@/components/brand/Logo";

const GROUPS: { title: string; links: { label: string; to: string }[] }[] = [
  {
    title: "Protocol",
    links: [
      { label: "Overview", to: "/protocol" },
      { label: "TRUTHPORT Miner", to: "/miner" },
      { label: "GRADELOCK Grader", to: "/grader" },
      { label: "Demand App", to: "/demand-app" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Roadmap", to: "/roadmap" },
      { label: "Pricing", to: "/pricing" },
      { label: "Merch", to: "/merch" },
      { label: "FAQs", to: "/faqs" },
    ],
  },
  {
    title: "Build",
    links: [
      { label: "Docs", to: "/docs" },
      { label: "Console", to: "/dashboard" },
      { label: "Registry", to: "/dashboard/registry" },
      { label: "Payments", to: "/dashboard/payments" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-hair-soft px-5 py-12 lg:px-10">
      <div className="mx-auto grid w-full max-w-6xl gap-10 md:grid-cols-[1.4fr_repeat(3,1fr)]">
        <div>
          <div className="flex items-center gap-[9px] text-[15.5px] font-semibold tracking-[-0.03em]">
            <CaliberMark />
            CALIBER<span className="font-normal text-muted-ink">.xyz</span>
          </div>
          <p className="mt-3 max-w-xs text-[13.5px] leading-relaxed text-muted-ink">
            A calibrated vertical of paid intelligence on Telegraph. Signal, scoring, and demand —
            across the full season.
          </p>
        </div>
        {GROUPS.map((g) => (
          <div key={g.title}>
            <h3 className="text-[12px] tracking-[0.08em] text-stat uppercase">{g.title}</h3>
            <ul className="mt-4 space-y-2.5">
              {g.links.map((l) => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    className="text-[13.5px] text-muted-ink transition-colors hover:text-foreground"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="mx-auto mt-10 flex w-full max-w-6xl flex-wrap items-center justify-between gap-3 border-t border-hair-soft pt-6 text-[12.5px] text-muted-ink">
        <span>© {new Date().getFullYear()} CALIBER. Telegraph Season I.</span>
        <span>Built for calibration, not cosplay.</span>
      </div>
    </footer>
  );
}
