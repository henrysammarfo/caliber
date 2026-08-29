import { supabase } from "@/integrations/supabase/client";

const VISITOR_KEY = "caliber.visitor";
const SESSION_KEY = "caliber.session";

function visitorId(): string {
  if (typeof window === "undefined") return "ssr";
  let id = window.localStorage.getItem(VISITOR_KEY);
  if (!id) {
    id = crypto.randomUUID();
    window.localStorage.setItem(VISITOR_KEY, id);
  }
  return id;
}

/** Per-tab-session id: rotates whenever the browser session ends. */
export function sessionId(): string {
  if (typeof window === "undefined") return "ssr";
  let id = window.sessionStorage.getItem(SESSION_KEY);
  if (!id) {
    id = crypto.randomUUID();
    window.sessionStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

export type AnalyticsEvent =
  | "route_visit"
  | "menu_open"
  | "menu_close"
  | "cta_click"
  | "sign_in"
  | "sign_out"
  | "session_timeout"
  | "token_refresh";

export async function track(
  event: AnalyticsEvent,
  options: { label?: string; path?: string; metadata?: Record<string, unknown> } = {},
) {
  if (typeof window === "undefined") return;
  try {
    const { data } = await supabase.auth.getSession();
    const userId = data.session?.user.id ?? null;
    await supabase.from("analytics_events").insert({
      event_name: event,
      label: options.label ?? null,
      path: options.path ?? window.location.pathname,
      visitor_id: visitorId(),
      user_id: userId,
      metadata: {
        ...(options.metadata ?? {}),
        session_id: sessionId(),
        user_id: userId,
        authenticated: Boolean(userId),
      } as never,
    });
  } catch {
    // analytics must never break the UI
  }
}

/** Track a primary CTA click. Never blocks the click handler. */
export function trackCta(label: string, metadata?: Record<string, unknown>) {
  void track("cta_click", { label, ...(metadata ? { metadata } : {}) });
}
