import { supabase } from "@/integrations/supabase/client";

const VISITOR_KEY = "caliber.visitor";

function visitorId(): string {
  if (typeof window === "undefined") return "ssr";
  let id = window.localStorage.getItem(VISITOR_KEY);
  if (!id) {
    id = crypto.randomUUID();
    window.localStorage.setItem(VISITOR_KEY, id);
  }
  return id;
}

export type AnalyticsEvent =
  | "route_visit"
  | "menu_open"
  | "menu_close"
  | "cta_click"
  | "sign_in"
  | "sign_out";

export async function track(
  event: AnalyticsEvent,
  options: { label?: string; path?: string; metadata?: Record<string, unknown> } = {},
) {
  if (typeof window === "undefined") return;
  try {
    const { data } = await supabase.auth.getSession();
    await supabase.from("analytics_events").insert({
      event_name: event,
      label: options.label ?? null,
      path: options.path ?? window.location.pathname,
      visitor_id: visitorId(),
      user_id: data.session?.user.id ?? null,
      metadata: (options.metadata ?? {}) as never,
    });
  } catch {
    // analytics must never break the UI
  }
}
