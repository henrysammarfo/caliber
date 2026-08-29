import { createFileRoute, Outlet, redirect, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { track } from "@/lib/analytics";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async ({ location }) => {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) {
      throw redirect({ to: "/auth", search: { reason: "signin", from: location.href } });
    }
    return { user: data.user };
  },
  component: AuthenticatedLayout,
});

/** Sign the operator out after this much inactivity. */
const IDLE_TIMEOUT_MS = 30 * 60 * 1000;
/** Refresh the access token this long before it expires. */
const REFRESH_LEAD_MS = 60 * 1000;
/** How often we re-check the token's remaining lifetime. */
const REFRESH_POLL_MS = 60 * 1000;
const ACTIVITY_EVENTS = ["mousedown", "keydown", "scroll", "touchstart", "visibilitychange"] as const;

export type EndReason = "timeout" | "expired" | "revoked" | "signin";

function AuthenticatedLayout() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const ending = useRef(false);

  const endSession = useCallback(
    async (reason: EndReason) => {
      if (ending.current) return;
      ending.current = true;
      if (reason === "timeout") await track("session_timeout", { label: "idle_30m" });
      try {
        await queryClient.cancelQueries();
        queryClient.clear();
        await supabase.auth.signOut();
      } catch {
        /* signing out is best-effort — always land the user on /auth */
      }
      navigate({
        to: "/auth",
        replace: true,
        search: { reason, from: window.location.pathname },
      });
    },
    [navigate, queryClient],
  );

  useEffect(() => {
    ending.current = false;

    function reset() {
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => void endSession("timeout"), IDLE_TIMEOUT_MS);
    }

    reset();
    ACTIVITY_EVENTS.forEach((e) => window.addEventListener(e, reset, { passive: true }));

    // Proactive token refresh: renew shortly before expiry, and end the
    // session with a clear reason when the refresh token is no longer valid.
    async function ensureFreshToken() {
      const { data, error } = await supabase.auth.getSession();
      if (error || !data.session) {
        void endSession("expired");
        return;
      }
      const expiresAt = (data.session.expires_at ?? 0) * 1000;
      if (expiresAt - Date.now() > REFRESH_LEAD_MS) return;
      const { data: refreshed, error: refreshError } = await supabase.auth.refreshSession();
      if (refreshError || !refreshed.session) {
        void endSession("expired");
        return;
      }
      void track("token_refresh", { label: "proactive" });
    }

    void ensureFreshToken();
    const poll = setInterval(() => void ensureFreshToken(), REFRESH_POLL_MS);

    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "TOKEN_REFRESHED") {
        void track("token_refresh", { label: "console" });
        return;
      }
      if (event === "SIGNED_OUT" || (event === "INITIAL_SESSION" && !session)) {
        void endSession(event === "SIGNED_OUT" ? "revoked" : "expired");
      }
    });

    // Re-validate whenever the tab regains focus (laptop wake, long idle tab).
    const onFocus = () => void ensureFreshToken();
    window.addEventListener("focus", onFocus);

    return () => {
      if (timer.current) clearTimeout(timer.current);
      clearInterval(poll);
      ACTIVITY_EVENTS.forEach((e) => window.removeEventListener(e, reset));
      window.removeEventListener("focus", onFocus);
      data.subscription.unsubscribe();
    };
  }, [endSession]);

  return <Outlet />;
}
