import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Download, MousePointerClick, PanelsTopLeft, Route as RouteIcon, Users } from "lucide-react";
import { DashHeader, DataTable, Panel, StatCard } from "@/components/dash/DashKit";
import { supabase } from "@/integrations/supabase/client";
import { trackCta } from "@/lib/analytics";
import { usePageView } from "@/lib/use-analytics";

export const Route = createFileRoute("/_authenticated/dashboard/engagement")({
  head: () => ({
    meta: [
      { title: "Engagement — CALIBER Console" },
      {
        name: "description",
        content:
          "Product analytics for CALIBER: route visits, CTA clicks, sessions and unique visitors with date filters, charts and CSV export.",
      },
      { property: "og:title", content: "Engagement — CALIBER Console" },
      { property: "og:description", content: "Route visits, CTA clicks, sessions and unique visitors." },
    ],
  }),
  component: EngagementConsole,
});

type EventRow = {
  event_name: string;
  path: string | null;
  label: string | null;
  visitor_id: string;
  user_id: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
};

const RANGES = [
  { days: 7, label: "7 days" },
  { days: 30, label: "30 days" },
  { days: 90, label: "90 days" },
] as const;

const SLICE_COLORS = ["#f5f5f5", "#a3a3a3", "#737373", "#525252", "#3f3f3f", "#2a2a2a"];

function topOf(rows: EventRow[], key: (r: EventRow) => string | null, limit = 8) {
  const counts = new Map<string, number>();
  for (const r of rows) {
    const k = key(r);
    if (!k) continue;
    counts.set(k, (counts.get(k) ?? 0) + 1);
  }
  return [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, limit);
}

function toCsv(rows: EventRow[]) {
  const head = ["created_at", "event_name", "path", "label", "visitor_id", "user_id", "session_id"];
  const escape = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const body = rows.map((r) =>
    [
      r.created_at,
      r.event_name,
      r.path ?? "",
      r.label ?? "",
      r.visitor_id,
      r.user_id ?? "",
      (r.metadata?.["session_id"] as string) ?? "",
    ]
      .map(escape)
      .join(","),
  );
  return [head.join(","), ...body].join("\n");
}

function EngagementConsole() {
  usePageView("Engagement");
  const [days, setDays] = useState<number>(30);
  const [exportNote, setExportNote] = useState<string | null>(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ["analytics-events", days],
    queryFn: async () => {
      const until = new Date();
      const since = new Date(until.getTime() - days * 24 * 60 * 60 * 1000);
      const { data, error } = await supabase
        .from("analytics_events")
        .select("event_name, path, label, visitor_id, user_id, metadata, created_at")
        .gte("created_at", since.toISOString())
        .lte("created_at", until.toISOString())
        .order("created_at", { ascending: false })
        .limit(5000);
      if (error) throw error;
      return {
        since: since.toISOString(),
        until: until.toISOString(),
        rows: (data ?? []) as EventRow[],
      };
    },
  });

  // Single source of truth: charts, tables and the CSV all read `rows`,
  // which is re-filtered against the exact window the query was issued for.
  const window = useMemo(
    () => ({
      since: data?.since ?? new Date(Date.now() - days * 86400000).toISOString(),
      until: data?.until ?? new Date().toISOString(),
    }),
    [data, days],
  );

  const rows = useMemo(
    () => (data?.rows ?? []).filter((r) => r.created_at >= window.since && r.created_at <= window.until),
    [data, window],
  );
  const visits = rows.filter((r) => r.event_name === "route_visit");
  const ctas = rows.filter((r) => r.event_name === "cta_click");
  const menus = rows.filter((r) => r.event_name === "menu_open" || r.event_name === "menu_close");
  const uniques = new Set(rows.map((r) => r.visitor_id)).size;
  const sessions = new Set(
    rows.map((r) => (r.metadata?.["session_id"] as string) ?? r.visitor_id),
  ).size;

  const daily = useMemo(() => {
    const buckets = new Map<string, { day: string; visits: number; ctas: number; other: number }>();
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(Date.now() - i * 86400000).toISOString().slice(0, 10);
      buckets.set(d, { day: d.slice(5), visits: 0, ctas: 0, other: 0 });
    }
    for (const r of rows) {
      const key = r.created_at.slice(0, 10);
      const b = buckets.get(key);
      if (!b) continue;
      if (r.event_name === "route_visit") b.visits += 1;
      else if (r.event_name === "cta_click") b.ctas += 1;
      else b.other += 1;
    }
    return [...buckets.values()];
  }, [rows, days]);

  const routeBars = topOf(visits, (r) => r.label ?? r.path, 7).map(([name, value]) => ({
    name: name.length > 18 ? `${name.slice(0, 17)}…` : name,
    value,
  }));
  const mix = topOf(rows, (r) => r.event_name, 6).map(([name, value]) => ({ name, value }));

  function exportCsv() {
    setExportNote(null);
    if (isLoading) {
      setExportNote("Still loading events — try again in a moment.");
      return;
    }
    if (error) {
      setExportNote("Export blocked: the current view failed to load.");
      return;
    }
    if (rows.length === 0) {
      setExportNote(`No events in the last ${days} days to export.`);
      return;
    }
    // Validation: every exported row must fall inside the active filter window
    // and match the row count rendered on screen.
    const outOfRange = rows.filter((r) => r.created_at < window.since || r.created_at > window.until);
    if (outOfRange.length > 0) {
      setExportNote("Export blocked: some rows fell outside the selected range. Refresh and retry.");
      return;
    }

    const csv = toCsv(rows);
    const lines = csv.split("\n").length - 1; // minus header
    if (lines !== rows.length) {
      setExportNote("Export blocked: row count did not match the filtered view.");
      return;
    }

    trackCta("Console · Export engagement CSV", { days, rows: rows.length, since: window.since, until: window.until });
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `caliber-engagement-${days}d-${window.until.slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    setExportNote(
      `Exported ${rows.length} rows · ${window.since.slice(0, 10)} → ${window.until.slice(0, 10)} (last ${days} days).`,
    );
  }


  return (
    <>
      <DashHeader
        title="Engagement"
        subtitle={`Product analytics · last ${days} days · live from the event stream`}
        action={
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex overflow-hidden rounded-md border border-hair">
              {RANGES.map((r) => (
                <button
                  key={r.days}
                  type="button"
                  onClick={() => setDays(r.days)}
                  className={`px-3 py-2 text-[12.5px] transition-colors ${
                    days === r.days ? "bg-white/10 text-foreground" : "text-muted-ink hover:bg-white/5"
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
            <button type="button" onClick={exportCsv} className="btn-base btn-ghost-metal gap-2">
              <Download className="h-4 w-4" strokeWidth={1.6} />
              Export CSV
            </button>
          </div>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={Users} label="Unique visitors" value={String(uniques)} delta={`${sessions} sessions`} delay={0.1} />
        <StatCard icon={RouteIcon} label="Route visits" value={String(visits.length)} delta="Client-side navigations" delay={0.2} />
        <StatCard icon={MousePointerClick} label="CTA clicks" value={String(ctas.length)} delta="Tracked buttons and links" delay={0.3} />
        <StatCard icon={PanelsTopLeft} label="Menu interactions" value={String(menus.length)} delta="Opens and closes" delay={0.4} />
      </div>

      {isLoading ? <p className="mt-5 text-[13.5px] text-muted-ink">Loading events…</p> : null}
      {error ? <p className="mt-5 text-[13.5px] text-red-400">Could not load engagement data.</p> : null}

      <div className="mt-5 grid gap-4">
        <Panel title="Activity over time">
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={daily} margin={{ top: 8, right: 8, bottom: 0, left: -20 }}>
                <defs>
                  <linearGradient id="gVisits" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ffffff" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#ffffff" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gCtas" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8f8f8f" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#8f8f8f" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
                <XAxis dataKey="day" tick={{ fill: "#7d7d7d", fontSize: 11 }} tickLine={false} axisLine={false} minTickGap={16} />
                <YAxis tick={{ fill: "#7d7d7d", fontSize: 11 }} tickLine={false} axisLine={false} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ background: "#0b0b0b", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 8, fontSize: 12 }}
                  labelStyle={{ color: "#c9c9c9" }}
                />
                <Area type="monotone" dataKey="visits" stroke="#ffffff" fill="url(#gVisits)" strokeWidth={1.5} />
                <Area type="monotone" dataKey="ctas" stroke="#8f8f8f" fill="url(#gCtas)" strokeWidth={1.5} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Panel>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-2">
        <Panel title="Top surfaces">
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={routeBars} margin={{ top: 8, right: 8, bottom: 0, left: -20 }}>
                <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
                <XAxis dataKey="name" tick={{ fill: "#7d7d7d", fontSize: 11 }} tickLine={false} axisLine={false} interval={0} angle={-18} height={48} textAnchor="end" />
                <YAxis tick={{ fill: "#7d7d7d", fontSize: 11 }} tickLine={false} axisLine={false} allowDecimals={false} />
                <Tooltip
                  cursor={{ fill: "rgba(255,255,255,0.04)" }}
                  contentStyle={{ background: "#0b0b0b", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 8, fontSize: 12 }}
                />
                <Bar dataKey="value" fill="#e5e5e5" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel title="Event mix">
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={mix} dataKey="value" nameKey="name" innerRadius={52} outerRadius={86} paddingAngle={2} stroke="none">
                  {mix.map((entry, i) => (
                    <Cell key={entry.name} fill={SLICE_COLORS[i % SLICE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ background: "#0b0b0b", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 8, fontSize: 12 }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Panel>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-2">
        <Panel title="Most visited routes">
          <DataTable head={["Path", "Visits"]} rows={topOf(visits, (r) => r.path).map(([p, n]) => [p, String(n)])} />
        </Panel>
        <Panel title="Top CTA clicks">
          <DataTable head={["Label", "Clicks"]} rows={topOf(ctas, (r) => r.label).map(([l, n]) => [l, String(n)])} />
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
        <Panel title="Signed-in activity">
          <DataTable
            head={["User", "Events"]}
            rows={topOf(rows, (r) => r.user_id).map(([u, n]) => [`${u.slice(0, 8)}…`, String(n)])}
          />
        </Panel>
      </div>
    </>
  );
}
