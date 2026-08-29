import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

export function DashHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle: string;
  action?: ReactNode;
}) {
  return (
    <header className="appear appear--soft mb-8 flex flex-wrap items-end justify-between gap-4 [--d:0.06s]">
      <div>
        <h1 className="text-[26px] font-medium tracking-[-0.04em]">{title}</h1>
        <p className="mt-1.5 text-[13.5px] text-muted-ink">{subtitle}</p>
      </div>
      {action}
    </header>
  );
}

export function StatCard({
  icon: Icon,
  label,
  value,
  delta,
  delay = 0.1,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  delta?: string;
  delay?: number;
}) {
  return (
    <div className="panel appear appear--stat p-5" style={{ ["--d" as string]: `${delay}s` }}>
      <div className="flex items-center justify-between">
        <span className="text-[12px] tracking-[0.05em] text-muted-ink uppercase">{label}</span>
        <Icon className="h-4 w-4 text-stat" strokeWidth={1.6} />
      </div>
      <p className="mt-4 text-[28px] leading-none font-medium tracking-[-0.04em]">{value}</p>
      {delta ? <p className="mt-2 text-[12.5px] text-muted-ink">{delta}</p> : null}
    </div>
  );
}

export function Panel({
  title,
  children,
  aside,
}: {
  title: string;
  children: ReactNode;
  aside?: ReactNode;
}) {
  return (
    <section className="panel appear appear--soft p-6 [--d:0.2s]">
      <div className="mb-5 flex items-center justify-between gap-3">
        <h2 className="text-[15px] font-medium tracking-[-0.02em]">{title}</h2>
        {aside}
      </div>
      {children}
    </section>
  );
}

export function DataTable({ head, rows }: { head: string[]; rows: ReactNode[][] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-[13.5px]">
        <thead className="border-b border-hair-soft text-[11.5px] tracking-[0.06em] text-stat uppercase">
          <tr>
            {head.map((h) => (
              <th key={h} className="px-2 py-2.5 font-normal">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-b border-hair-soft last:border-0">
              {r.map((c, j) => (
                <td key={j} className="px-2 py-3 text-muted-ink first:text-foreground">
                  {c}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
