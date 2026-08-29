import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { Grain, useAppear } from "@/components/site/Chrome";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import heroBg from "@/assets/hero-bg.jpg";

export function PageShell({ children }: { children: ReactNode }) {
  useAppear();
  return (
    <div className="relative min-h-screen bg-background">
      <Grain />
      <img
        src={heroBg}
        alt=""
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 h-full w-full object-cover opacity-70"
      />
      <div className="relative z-1 flex min-h-screen flex-col">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </div>
    </div>
  );
}

export function PageHero({
  eyebrow,
  title,
  em,
  lede,
  children,
}: {
  eyebrow: string;
  title: string;
  em?: string;
  lede: string;
  children?: ReactNode;
}) {
  return (
    <section className="px-5 pt-16 pb-14 lg:px-10 lg:pt-24">
      <div className="mx-auto w-full max-w-3xl text-center">
        <span className="badge-metal appear appear--pop [--d:0.12s]">{eyebrow}</span>
        <h1 className="mt-6 text-[clamp(34px,6vw,60px)] leading-[1.12] font-medium tracking-[-0.045em]">
          <span className="headline-line appear appear--mask [--d:0.3s]">
            {title} {em ? <em className="serif-em hero-em not-italic">{em}</em> : null}
          </span>
        </h1>
        <p className="appear appear--soft mx-auto mt-5 max-w-[520px] text-[15.5px] leading-[1.55] tracking-[-0.015em] text-muted-ink [--d:0.6s]">
          {lede}
        </p>
        {children ? (
          <div className="appear appear--btn mt-7 flex flex-wrap justify-center gap-2.5 [--d:0.8s]">
            {children}
          </div>
        ) : null}
      </div>
    </section>
  );
}

export function Section({
  title,
  kicker,
  children,
}: {
  title: string;
  kicker?: string;
  children: ReactNode;
}) {
  return (
    <section className="px-5 py-14 lg:px-10">
      <div className="mx-auto w-full max-w-6xl">
        <div className="mb-8">
          {kicker ? <span className="chip">{kicker}</span> : null}
          <h2 className="mt-3 text-[clamp(24px,3.2vw,34px)] font-medium tracking-[-0.04em]">
            {title}
          </h2>
        </div>
        {children}
      </div>
    </section>
  );
}

export function FeatureCard({
  icon: Icon,
  title,
  body,
  meta,
}: {
  icon: LucideIcon;
  title: string;
  body: string;
  meta?: string;
}) {
  return (
    <article className="panel p-6">
      <Icon className="h-5 w-5 text-stat" strokeWidth={1.6} />
      <h3 className="mt-4 text-[16px] font-medium tracking-[-0.02em]">{title}</h3>
      <p className="mt-2 text-[13.5px] leading-relaxed text-muted-ink">{body}</p>
      {meta ? <p className="mt-4 text-[12px] tracking-[0.04em] text-stat uppercase">{meta}</p> : null}
    </article>
  );
}
