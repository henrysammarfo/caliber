import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Logo } from "@/components/brand/Logo";
import { Grain, useAppear } from "@/components/site/Chrome";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { track } from "@/lib/analytics";

type AuthSearch = { reason?: string | undefined; from?: string | undefined };

const REASON_NOTICE: Record<string, string> = {
  timeout: "You were signed out after 30 minutes of inactivity. Sign in again to continue.",
  expired: "Your session expired and could not be renewed. Please sign in again.",
  revoked: "Your session ended on this device. Sign in again to reopen the console.",
  signin: "The console is restricted — sign in to continue.",
};

export const Route = createFileRoute("/auth")({
  validateSearch: (search: Record<string, unknown>): AuthSearch => ({
    reason: typeof search["reason"] === "string" ? (search["reason"] as string) : undefined,
    from:
      typeof search["from"] === "string" && (search["from"] as string).startsWith("/")
        ? (search["from"] as string)
        : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Sign in — CALIBER Console" },
      {
        name: "description",
        content:
          "Sign in to the CALIBER console to review miner health, grader calibration, x402 settlement and engagement metrics.",
      },
      { property: "og:title", content: "Sign in — CALIBER Console" },
      { property: "og:description", content: "Access the CALIBER operator console." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  useAppear();
  const navigate = useNavigate();
  const { reason, from } = Route.useSearch();
  const notice = reason ? (REASON_NOTICE[reason] ?? REASON_NOTICE["signin"]) : null;
  const destination = from ?? "/dashboard";
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void supabase.auth.getUser().then(({ data }) => {
      if (data.user) navigate({ to: destination, replace: true });
    });
  }, [navigate, destination]);



  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setMessage(null);
    try {
      if (mode === "signup") {
        const { data, error: err } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin,
            data: { display_name: name || email.split("@")[0] },
          },
        });
        if (err) throw err;
        if (data.session) {
          await track("sign_in", { label: "email_signup" });
          navigate({ to: destination, replace: true });
        } else {
          setMessage("Check your email to confirm your account, then sign in.");
        }
      } else {
        const { error: err } = await supabase.auth.signInWithPassword({ email, password });
        if (err) throw err;
        await track("sign_in", { label: "email_password" });
        navigate({ to: destination, replace: true });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  async function onGoogle() {
    setError(null);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      setError("Google sign-in failed. Try again.");
      return;
    }
    if (result.redirected) return;
    await track("sign_in", { label: "google" });
    navigate({ to: destination, replace: true });
  }

  return (
    <div className="relative flex min-h-screen flex-col bg-background">
      <Grain />
      <div className="relative z-1 flex flex-1 items-center justify-center px-5 py-14">
        <div className="panel appear appear--soft w-full max-w-[420px] p-7 [--d:0.06s]">
          <Logo />
          <h1 className="mt-7 text-[24px] font-medium tracking-[-0.04em]">
            {mode === "signin" ? "Open the console" : "Create an operator account"}
          </h1>
          <p className="mt-1.5 text-[13.5px] text-muted-ink">
            The CALIBER console is restricted to signed-in operators.
          </p>

          {notice ? (
            <p
              role="status"
              aria-live="polite"
              className="mt-4 rounded-md border border-hair bg-white/5 px-3.5 py-2.5 text-[12.5px] text-foreground"
            >
              {notice}
            </p>
          ) : null}



          <button type="button" onClick={onGoogle} className="btn-base btn-ghost-metal mt-6 w-full">
            Continue with Google
          </button>

          <div className="my-5 flex items-center gap-3 text-[11.5px] tracking-[0.06em] text-stat uppercase">
            <span className="h-px flex-1 bg-hair-soft" />
            or
            <span className="h-px flex-1 bg-hair-soft" />
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            {mode === "signup" ? (
              <div className="space-y-2">
                <Label htmlFor="name">Display name</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
              </div>
            ) : null}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete={mode === "signin" ? "current-password" : "new-password"}
              />
            </div>

            {error ? <p className="text-[12.5px] text-red-400">{error}</p> : null}
            {message ? <p className="text-[12.5px] text-muted-ink">{message}</p> : null}

            <button type="submit" disabled={busy} className="btn-base btn-solid w-full disabled:opacity-60">
              {busy ? "Working…" : mode === "signin" ? "Sign in" : "Create account"}
            </button>
          </form>

          <button
            type="button"
            onClick={() => {
              setMode(mode === "signin" ? "signup" : "signin");
              setError(null);
              setMessage(null);
            }}
            className="mt-5 w-full text-[13px] text-muted-ink transition-colors hover:text-foreground"
          >
            {mode === "signin" ? "No account? Create one" : "Already registered? Sign in"}
          </button>
        </div>
      </div>
    </div>
  );
}
