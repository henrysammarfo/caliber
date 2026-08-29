import { createFileRoute } from "@tanstack/react-router";
import { Activity, AlertTriangle, GitCommitVertical, MessageSquare } from "lucide-react";
import { DashHeader, Panel, StatCard } from "@/components/dash/DashKit";
import { usePageView } from "@/lib/use-analytics";

export const Route = createFileRoute("/_authenticated/dashboard/activity")({
  head: () => ({
    meta: [
      { title: "Activity — CALIBER Console" },
      {
        name: "description",
        content: "Build log for the CALIBER season: grader releases, registry updates, adversarial runs and public posts.",
      },
      { property: "og:title", content: "Activity — CALIBER Console" },
      { property: "og:description", content: "Season build log and public proof trail." },
    ],
  }),
  component: ActivityConsole,
});

const FEED = [
  { icon: GitCommitVertical, t: "GRADELOCK 0.6.0 — reliability bins per intent", when: "2h ago" },
  { icon: AlertTriangle, t: "Adversarial run: label echo blocked, -64 rank", when: "2h ago" },
  { icon: GitCommitVertical, t: "Registry checksum updated to 9f2c…41ab", when: "yesterday" },
  { icon: MessageSquare, t: "Public build post #7 published", when: "yesterday" },
  { icon: GitCommitVertical, t: "Eval set expanded to 4,128 labeled rows", when: "3d ago" },
  { icon: MessageSquare, t: "Upstream SDK issue filed: YAML checksum casing", when: "5d ago" },
];

function ActivityConsole() {
  usePageView("Activity");
  return (
    <>
      <DashHeader title="Activity" subtitle="Proof trail for validators and judges" />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard icon={Activity} label="Events (7d)" value="41" delay={0.1} />
        <StatCard icon={MessageSquare} label="Public posts" value="7" delta="Judging criterion" delay={0.2} />
        <StatCard icon={AlertTriangle} label="Upstream issues" value="2" delta="1 merged" delay={0.3} />
      </div>

      <div className="mt-5">
        <Panel title="Build log">
          <ul className="space-y-4">
            {FEED.map((f) => (
              <li key={f.t} className="flex items-start gap-3 text-[13.5px]">
                <f.icon className="mt-0.5 h-4 w-4 shrink-0 text-stat" strokeWidth={1.6} />
                <span className="flex-1">{f.t}</span>
                <span className="text-[12.5px] whitespace-nowrap text-muted-ink">{f.when}</span>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </>
  );
}
