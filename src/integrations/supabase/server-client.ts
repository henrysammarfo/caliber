import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";

export type CookieToSet = { name: string; value: string; options?: CookieOptions };

function envUrl(): string {
  const url = process.env["SUPABASE_URL"] || process.env["VITE_SUPABASE_URL"];
  if (!url) throw new Error("Missing SUPABASE_URL");
  return url;
}

function envKey(): string {
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"] || process.env["VITE_SUPABASE_PUBLISHABLE_KEY"];
  if (!key) throw new Error("Missing SUPABASE_PUBLISHABLE_KEY");
  return key;
}

function parseCookieHeader(header: string | null): { name: string; value: string }[] {
  if (!header) return [];
  return header.split(";").flatMap((part) => {
    const idx = part.indexOf("=");
    if (idx < 0) return [];
    const name = part.slice(0, idx).trim();
    const value = part.slice(idx + 1).trim();
    if (!name) return [];
    return [{ name, value }];
  });
}

function serializeCookie(c: CookieToSet): string {
  const parts = [`${c.name}=${c.value}`];
  const o = c.options ?? {};
  if (o.maxAge != null) parts.push(`Max-Age=${o.maxAge}`);
  if (o.domain) parts.push(`Domain=${o.domain}`);
  if (o.path) parts.push(`Path=${o.path}`);
  if (o.expires) parts.push(`Expires=${o.expires.toUTCString()}`);
  if (o.httpOnly) parts.push("HttpOnly");
  if (o.secure) parts.push("Secure");
  if (o.sameSite) {
    const s = typeof o.sameSite === "string" ? o.sameSite : "lax";
    parts.push(`SameSite=${s[0]!.toUpperCase()}${s.slice(1)}`);
  }
  return parts.join("; ");
}

/**
 * Per-request Supabase server client bound to incoming Cookie header.
 * Collects Set-Cookie mutations so the route can attach them to the response.
 */
export function createSupabaseServerClient(request: Request) {
  const cookiesToSet: CookieToSet[] = [];
  const supabase = createServerClient<Database>(envUrl(), envKey(), {
    cookies: {
      getAll() {
        return parseCookieHeader(request.headers.get("cookie"));
      },
      setAll(cookies) {
        for (const c of cookies) {
          cookiesToSet.push({ name: c.name, value: c.value, options: c.options });
        }
      },
    },
    cookieOptions: {
      path: "/",
      sameSite: "lax",
      secure: true,
      httpOnly: true,
    },
  });
  return { supabase, cookiesToSet };
}

export function applySetCookies(headers: Headers, cookiesToSet: CookieToSet[]) {
  for (const c of cookiesToSet) {
    headers.append("Set-Cookie", serializeCookie(c));
  }
}

/** Service-role or publishable admin client for deferred inserts (server only). */
export function getSupabaseAdmin() {
  const url = process.env["SUPABASE_URL"] || process.env["VITE_SUPABASE_URL"];
  const key =
    process.env["SUPABASE_SERVICE_ROLE_KEY"] ||
    process.env["SUPABASE_PUBLISHABLE_KEY"] ||
    process.env["VITE_SUPABASE_PUBLISHABLE_KEY"];
  if (!url || !key) return null;
  return createClient<Database>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
