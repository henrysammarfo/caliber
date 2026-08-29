import { createFileRoute } from "@tanstack/react-router";
import { DashHeader, Panel } from "@/components/dash/DashKit";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export const Route = createFileRoute("/dashboard/settings")({
  head: () => ({
    meta: [
      { title: "Settings — CALIBER Console" },
      {
        name: "description",
        content: "Configure the CALIBER miner endpoint, price floor, grader strictness and public proof posting.",
      },
      { property: "og:title", content: "Settings — CALIBER Console" },
      { property: "og:description", content: "Endpoint, price floor, grader strictness and proof posting." },
    ],
  }),
  component: SettingsConsole,
});

const TOGGLES = [
  ["Publish adversarial results", "Every suite run is written to the public build log.", true],
  ["Enforce checksum drift halt", "Serving stops if the YAML no longer matches the registry.", true],
  ["Auto-retry failed settlements", "Retry x402 settlement up to three times before flagging.", false],
] as const;

function SettingsConsole() {
  return (
    <>
      <DashHeader title="Settings" subtitle="Miner, grader and settlement configuration" />

      <div className="grid gap-4 xl:grid-cols-2">
        <Panel title="Miner">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="endpoint">Endpoint</Label>
              <Input id="endpoint" defaultValue="https://miner.caliber.xyz/v1/answer" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="floor">Price floor (USDC)</Label>
              <Input id="floor" defaultValue="0.02" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="evalset">Labeled eval set</Label>
              <Input id="evalset" defaultValue="caliber-gold-v3" />
            </div>
            <button className="btn-base btn-solid mt-2">Save miner config</button>
          </div>
        </Panel>

        <Panel title="Policies">
          <div className="space-y-5">
            {TOGGLES.map(([title, body, on]) => (
              <div key={title} className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[14px]">{title}</p>
                  <p className="mt-1 text-[12.5px] text-muted-ink">{body}</p>
                </div>
                <Switch defaultChecked={on} />
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </>
  );
}
