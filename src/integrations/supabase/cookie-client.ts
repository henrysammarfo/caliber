import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "./types";

function envUrl(): string {
  const url = import.meta.env["VITE_SUPABASE_URL"] || process.env["SUPABASE_URL"];
  if (!url) throw new Error("Missing VITE_SUPABASE_URL / SUPABASE_URL");
  return url;
}

function envKey(): string {
  const key = import.meta.env["VITE_SUPABASE_PUBLISHABLE_KEY"] || process.env["SUPABASE_PUBLISHABLE_KEY"];
  if (!key) throw new Error("Missing VITE_SUPABASE_PUBLISHABLE_KEY / SUPABASE_PUBLISHABLE_KEY");
  return key;
}

/**
 * Production browser client — session in cookies (no localStorage).
 * createBrowserClient persists via document.cookie; auth.storage is ignored.
 */
export function createCookieBrowserClient() {
  return createBrowserClient<Database>(envUrl(), envKey(), {
    cookieOptions: {
      path: "/",
      sameSite: "lax",
      secure: typeof window !== "undefined" ? window.location.protocol === "https:" : true,
    },
    isSingleton: true,
  });
}

export function isLovablePreviewHost(hostname = typeof window !== "undefined" ? window.location.hostname : ""): boolean {
  const PREVIEW_ZONES = [
    "lovableproject.com",
    "lovableproject-dev.com",
    "lovable.app",
    "gpt-eng.com",
    "gptengineer.run",
  ];
  return PREVIEW_ZONES.some((z) => hostname === z || hostname.endsWith("." + z));
}
