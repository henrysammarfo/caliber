/**
 * In-memory sliding-window rate limit for paid /intel (per user tenant).
 * Protects the shared x402 wallet. Resets on cold start — residual risk documented.
 */

type Bucket = { minute: number[]; day: number[] };

const buckets = new Map<string, Bucket>();

const LIMIT_PER_MINUTE = 30;
const LIMIT_PER_DAY = 200;

export type RateLimitResult =
  | { ok: true; remainingMinute: number; remainingDay: number }
  | { ok: false; retryAfterSec: number; reason: "minute" | "day" };

export function checkIntelRateLimit(userId: string, now = Date.now()): RateLimitResult {
  let b = buckets.get(userId);
  if (!b) {
    b = { minute: [], day: [] };
    buckets.set(userId, b);
  }

  const minuteAgo = now - 60_000;
  const dayAgo = now - 86_400_000;
  b.minute = b.minute.filter((t) => t > minuteAgo);
  b.day = b.day.filter((t) => t > dayAgo);

  if (b.minute.length >= LIMIT_PER_MINUTE) {
    const oldest = b.minute[0]!;
    return { ok: false, retryAfterSec: Math.max(1, Math.ceil((oldest + 60_000 - now) / 1000)), reason: "minute" };
  }
  if (b.day.length >= LIMIT_PER_DAY) {
    const oldest = b.day[0]!;
    return { ok: false, retryAfterSec: Math.max(1, Math.ceil((oldest + 86_400_000 - now) / 1000)), reason: "day" };
  }

  b.minute.push(now);
  b.day.push(now);
  return {
    ok: true,
    remainingMinute: LIMIT_PER_MINUTE - b.minute.length,
    remainingDay: LIMIT_PER_DAY - b.day.length,
  };
}
