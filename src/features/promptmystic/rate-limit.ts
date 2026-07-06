/**
 * Minimal in-memory sliding-window rate limiter keyed by user id.
 *
 * This is a lightweight safeguard against runaway API cost/abuse for the MVP.
 * It lives in module memory, so it is per-instance only and resets on cold
 * start — good enough for a single-region launch. Swap for a durable store
 * (e.g. Upstash Redis) if/when the app scales to multiple instances.
 */
const WINDOW_MS = 60_000;
const MAX_REQUESTS_PER_WINDOW = 15;

const hits = new Map<string, number[]>();

export function checkRateLimit(userId: string): { allowed: boolean; retryAfterSeconds: number } {
  const now = Date.now();
  const windowStart = now - WINDOW_MS;

  const timestamps = (hits.get(userId) ?? []).filter((t) => t > windowStart);

  if (timestamps.length >= MAX_REQUESTS_PER_WINDOW) {
    const retryAfterMs = timestamps[0] + WINDOW_MS - now;
    return { allowed: false, retryAfterSeconds: Math.max(1, Math.ceil(retryAfterMs / 1000)) };
  }

  timestamps.push(now);
  hits.set(userId, timestamps);
  return { allowed: true, retryAfterSeconds: 0 };
}
