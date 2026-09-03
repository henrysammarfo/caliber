import { supabase } from "@/integrations/supabase/client";

const SESSION_KEY = "caliber.session";
let memoryVisitor: string | null = null;

/** Ephemeral visitor id — in-memory only (no localStorage). */
function visitorId(): string {
  if (typeof window === "undefined") return "ssr";
  if (!memoryVisitor) memoryVisitor = crypto.randomUUID();
  return memoryVisitor;
}

/** Per-tab analytics session via sessionStorage (non-auth). */
export function sessionId(): string {
  if (typeof window === "undefined") return "ssr";
  try {
    let id = window.sessionStorage.getItem(SESSION_KEY);
    if (!id) {
      id = crypto.randomUUID();
      window.sessionStorage.setItem(SESSION_KEY, id);
    }
    return id;
  } catch {
    return visitorId();
  }
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
    const { data } = await supabase.auth.getUser();
    const userId = data.user?.id ?? null;
    await supabase.from("analytics_events").insert({
      event_name: event,
      label: options.label ?? null,
      path: options.path ?? window.location.pathname,
      visitor_id: userId ?? visitorId(),
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
