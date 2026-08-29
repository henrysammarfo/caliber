import { createFileRoute, Outlet, redirect, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { track } from "@/lib/analytics";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async () => {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) throw redirect({ to: "/auth" });
    return { user: data.user };
  },
  component: AuthenticatedLayout,
});

/** Sign the operator out after this much inactivity. */
const IDLE_TIMEOUT_MS = 30 * 60 * 1000;
const ACTIVITY_EVENTS = ["mousedown", "keydown", "scroll", "touchstart", "visibilitychange"] as const;

function AuthenticatedLayout() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let active = true;

    async function endSession(reason: "timeout" | "revoked") {
      if (!active) return;
      active = false;
      if (reason === "timeout") await track("session_timeout", { label: "idle_30m" });
      await queryClient.cancelQueries();
      queryClient.clear();
      await supabase.auth.signOut();
      navigate({ to: "/auth", replace: true, search: { reason } as never });
    }

    function reset() {
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => void endSession("timeout"), IDLE_TIMEOUT_MS);
    }

    reset();
    ACTIVITY_EVENTS.forEach((e) => window.addEventListener(e, reset, { passive: true }));

    // Token refresh + revocation handling for the protected subtree.
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "TOKEN_REFRESHED") {
        void track("token_refresh", { label: "console" });
        return;
      }
      if (event === "SIGNED_OUT" || (event === "INITIAL_SESSION" && !session)) {
        queryClient.clear();
        navigate({ to: "/auth", replace: true });
      }
    });

    // Belt-and-braces: re-validate the session when the tab regains focus.
    const onFocus = async () => {
      const { data: userData, error } = await supabase.auth.getUser();
      if (error || !userData.user) void endSession("revoked");
    };
    window.addEventListener("focus", onFocus);

    return () => {
      if (timer.current) clearTimeout(timer.current);
      ACTIVITY_EVENTS.forEach((e) => window.removeEventListener(e, reset));
      window.removeEventListener("focus", onFocus);
      data.subscription.unsubscribe();
    };
  }, [navigate, queryClient]);

  return <Outlet />;
}
