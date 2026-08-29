import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import {
  Activity,
  Gauge,
  LayoutDashboard,
  Link2,
  Radar,
  Settings,
  Wallet,
} from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { Grain, useAppear } from "@/components/site/Chrome";

export const Route = createFileRoute("/dashboard")({
  component: DashboardLayout,
});

const NAV = [
  { to: "/dashboard", label: "Overview", icon: LayoutDashboard, exact: true },
  { to: "/dashboard/miner", label: "Miner", icon: Radar },
  { to: "/dashboard/grader", label: "Grader", icon: Gauge },
  { to: "/dashboard/registry", label: "Registry", icon: Link2 },
  { to: "/dashboard/payments", label: "Payments", icon: Wallet },
  { to: "/dashboard/activity", label: "Activity", icon: Activity },
  { to: "/dashboard/settings", label: "Settings", icon: Settings },
] as const;

function DashboardLayout() {
  useAppear();
  return (
    <div className="relative min-h-screen bg-background">
      <Grain />
      <div className="relative z-1 flex min-h-screen flex-col lg:flex-row">
        <aside className="border-b border-hair-soft px-5 py-5 lg:w-64 lg:shrink-0 lg:border-r lg:border-b-0 lg:px-6 lg:py-7">
          <Logo />
          <nav className="mt-7 flex gap-2 overflow-x-auto lg:flex-col lg:overflow-visible">
            {NAV.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                activeOptions={{ exact: "exact" in n ? n.exact : false }}
                activeProps={{ className: "bg-white/8 text-foreground border-hair" }}
                inactiveProps={{ className: "text-muted-ink border-transparent" }}
                className="inline-flex items-center gap-2.5 rounded-md border px-3 py-2.5 text-[13.5px] whitespace-nowrap transition-colors hover:bg-white/5 hover:text-foreground"
              >
                <n.icon className="h-4 w-4" strokeWidth={1.6} />
                {n.label}
              </Link>
            ))}
          </nav>
          <Link to="/" className="btn-base btn-ghost-metal mt-8 hidden w-full lg:inline-flex">
            Back to site
          </Link>
        </aside>
        <main className="flex-1 px-5 py-8 lg:px-10 lg:py-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
