import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { MousePointerClick, PanelsTopLeft, Route as RouteIcon, Users } from "lucide-react";
import { DashHeader, DataTable, Panel, StatCard } from "@/components/dash/DashKit";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/dashboard/engagement")({
  head: () => ({
    meta: [
      { title: "Engagement — CALIBER Console" },
      {
        name: "description",
        content:
          "Product analytics for CALIBER: route visits, CTA clicks, menu interactions and unique visitors over the last 30 days.",
      },
      { property: "og:title", content: "Engagement — CALIBER Console" },
      { property: "og:description", content: "Route visits, CTA clicks and unique visitors." },
    ],
  }),
  component: EngagementConsole,
});

type EventRow = {
  event_name: string;
  path: string | null;
  label: string | null;
  visitor_id: string;
  created_at: string;
};

function topOf(rows: EventRow[], key: (r: EventRow) => string | null, limit = 8) {
  const counts = new Map<string, number>();
  for (const r of rows) {
    const k = key(r);
    if (!k) continue;
    counts.set(k, (counts.get(k) ?? 0) + 1);
  }
  return [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, limit);
}

function EngagementConsole() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["analytics-events"],
    queryFn: async () => {
      const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
      const { data, error } = await supabase
        .from("analytics_events")
        .select("event_name, path, label, visitor_id, created_at")
        .gte("created_at", since)
        .order("created_at", { ascending: false })
        .limit(5000);
      if (error) throw error;
      return (data ?? []) as EventRow[];
    },
  });

  const rows = data ?? [];
  const visits = rows.filter((r) => r.event_name === "route_visit");
  const ctas = rows.filter((r) => r.event_name === "cta_click");
  const menus = rows.filter((r) => r.event_name === "menu_open" || r.event_name === "menu_close");
  const uniques = new Set(rows.map((r) => r.visitor_id)).size;

  return (
    <>
      <DashHeader
        title="Engagement"
        subtitle="Product analytics · last 30 days · live from the event stream"
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={Users} label="Unique visitors" value={String(uniques)} delta="Distinct visitor ids" delay={0.1} />
        <StatCard icon={RouteIcon} label="Route visits" value={String(visits.length)} delta="Client-side navigations" delay={0.2} />
        <StatCard icon={MousePointerClick} label="CTA clicks" value={String(ctas.length)} delta="Tracked buttons and links" delay={0.3} />
        <StatCard icon={PanelsTopLeft} label="Menu interactions" value={String(menus.length)} delta="Opens and closes" delay={0.4} />
      </div>

      {isLoading ? <p className="mt-5 text-[13.5px] text-muted-ink">Loading events…</p> : null}
      {error ? <p className="mt-5 text-[13.5px] text-red-400">Could not load engagement data.</p> : null}

      <div className="mt-5 grid gap-4 xl:grid-cols-2">
        <Panel title="Most visited routes">
          <DataTable
            head={["Path", "Visits"]}
            rows={topOf(visits, (r) => r.path).map(([p, n]) => [p, String(n)])}
          />
        </Panel>
        <Panel title="Top CTA clicks">
          <DataTable
            head={["Label", "Clicks"]}
            rows={topOf(ctas, (r) => r.label).map(([l, n]) => [l, String(n)])}
          />
        </Panel>
        <Panel title="Event mix">
          <DataTable
            head={["Event", "Count"]}
            rows={topOf(rows, (r) => r.event_name, 12).map(([e, n]) => [e, String(n)])}
          />
        </Panel>
        <Panel title="Latest events">
          <DataTable
            head={["Event", "Path", "Label", "When"]}
            rows={rows.slice(0, 10).map((r) => [
              r.event_name,
              r.path ?? "—",
              r.label ?? "—",
              new Date(r.created_at).toLocaleTimeString(),
            ])}
          />
        </Panel>
      </div>
    </>
  );
}
