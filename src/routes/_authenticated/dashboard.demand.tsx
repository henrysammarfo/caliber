import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { Activity, Coins, TrendingUp, Zap } from "lucide-react";
import { DashHeader, Panel, StatCard, DataTable } from "@/components/dash/DashKit";
import { usePageView } from "@/lib/use-analytics";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/dashboard/demand")({
  head: () => ({
    meta: [
      { title: "Demand Analytics — CALIBER" },
      {
        name: "description",
        content: "Track 3 demand analytics — queries by intent, x402 spend, top miners, and usage over time.",
      },
    ],
  }),
  component: DemandPage,
});

interface QueryRow {
  id: string;
  intent: string;
  miner_slug: string | null;
  confidence: number | null;
  cost_usdc: number | null;
  x402_tx: string | null;
  created_at: string;
}

interface IntentStat {
  intent: string;
  count: number;
  totalCost: number;
}

interface DailyStat {
  date: string;
  count: number;
}

interface MinerStat {
  slug: string;
  count: number;
}

function DemandPage() {
  usePageView("Demand");
  const [rows, setRows] = useState<QueryRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data } = await (supabase as unknown as ReturnType<typeof import("@supabase/supabase-js").createClient>)
        .from("query_log")
        .select("id, intent, miner_slug, confidence, cost_usdc, x402_tx, created_at")
        .order("created_at", { ascending: false })
        .limit(1000);
      setRows((data as unknown as QueryRow[]) ?? []);
      setLoading(false);
    }
    load();
  }, []);

  const intentStats: IntentStat[] = [];
  const intentMap = new Map<string, IntentStat>();
  for (const r of rows) {
    let stat = intentMap.get(r.intent);
    if (!stat) {
      stat = { intent: r.intent, count: 0, totalCost: 0 };
      intentMap.set(r.intent, stat);
      intentStats.push(stat);
    }
    stat.count++;
    stat.totalCost += r.cost_usdc ?? 0;
  }
  intentStats.sort((a, b) => b.count - a.count);

  const dailyMap = new Map<string, number>();
  for (const r of rows) {
    const day = r.created_at.slice(0, 10);
    dailyMap.set(day, (dailyMap.get(day) ?? 0) + 1);
  }
  const dailyStats: DailyStat[] = Array.from(dailyMap.entries())
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date));

  const minerMap = new Map<string, number>();
  for (const r of rows) {
    const slug = r.miner_slug ?? "unknown";
    minerMap.set(slug, (minerMap.get(slug) ?? 0) + 1);
  }
  const minerStats: MinerStat[] = Array.from(minerMap.entries())
    .map(([slug, count]) => ({ slug, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  const totalQueries = rows.length;
  const totalCost = rows.reduce((s, r) => s + (r.cost_usdc ?? 0), 0);
  const uniqueMiners = new Set(rows.map((r) => r.miner_slug).filter(Boolean)).size;

  if (loading) {
    return (
      <>
        <DashHeader title="Demand Analytics" subtitle="Loading query history..." />
        <div className="flex items-center justify-center py-20 text-muted-ink">Loading...</div>
      </>
    );
  }

  return (
    <>
      <DashHeader title="Demand Analytics" subtitle="Track 3 — real x402 queries to Telegraph miners" />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4 mb-6">
        <StatCard icon={Zap} label="Total queries" value={String(totalQueries)} delay={0.1} />
        <StatCard icon={Coins} label="Total x402 spend" value={`$${totalCost.toFixed(4)}`} delay={0.2} />
        <StatCard icon={Activity} label="Unique miners" value={String(uniqueMiners)} delay={0.3} />
        <StatCard
          icon={TrendingUp}
          label="Intents used"
          value={String(intentStats.length)}
          delta={totalQueries >= 100 ? "Guardrail: 100+ met" : `${totalQueries}/100 guardrail`}
          delay={0.4}
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <Panel title="Queries by Intent">
          {intentStats.length > 0 ? (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={intentStats}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="intent" tick={{ fontSize: 11, fill: "#888" }} angle={-20} textAnchor="end" height={60} />
                <YAxis tick={{ fontSize: 11, fill: "#888" }} />
                <Tooltip
                  contentStyle={{ background: "#1a1a1a", border: "1px solid #333", borderRadius: 6, fontSize: 12 }}
                  labelStyle={{ color: "#ccc" }}
                />
                <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-[13px] text-muted-ink py-8 text-center">No queries yet — use the Intelligence Console to start</p>
          )}
        </Panel>

        <Panel title="Queries Over Time">
          {dailyStats.length > 0 ? (
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={dailyStats}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#888" }} />
                <YAxis tick={{ fontSize: 11, fill: "#888" }} />
                <Tooltip
                  contentStyle={{ background: "#1a1a1a", border: "1px solid #333", borderRadius: 6, fontSize: 12 }}
                  labelStyle={{ color: "#ccc" }}
                />
                <Line type="monotone" dataKey="count" stroke="#6366f1" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-[13px] text-muted-ink py-8 text-center">No data yet</p>
          )}
        </Panel>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-2">
        <Panel title="Top Miners Routed To">
          {minerStats.length > 0 ? (
            <DataTable
              head={["Miner", "Queries"]}
              rows={minerStats.map((m) => [m.slug, String(m.count)])}
            />
          ) : (
            <p className="text-[13px] text-muted-ink py-4 text-center">No miner data yet</p>
          )}
        </Panel>

        <Panel title="Cost by Intent">
          {intentStats.length > 0 ? (
            <DataTable
              head={["Intent", "Queries", "Total Cost"]}
              rows={intentStats.map((s) => [s.intent, String(s.count), `$${s.totalCost.toFixed(4)}`])}
            />
          ) : (
            <p className="text-[13px] text-muted-ink py-4 text-center">No data yet</p>
          )}
        </Panel>
      </div>
    </>
  );
}
