// In-memory rate limiter. This state is per-process, so it works for a single
// container: if the app ever scales horizontally, replace the Map with a
// shared store (Redis/Upstash) while keeping this API.

type Entry = { count: number; resetAt: number };

const buckets = new Map<string, Entry>();
const MAX_BUCKETS = 10_000;

function pruneExpired(now: number) {
  for (const [key, entry] of buckets) {
    if (entry.resetAt <= now) {
      buckets.delete(key);
    }
  }
}

export function checkRateLimit(
  key: string,
  { limit, windowMs }: { limit: number; windowMs: number },
  now: number = Date.now(),
): { ok: boolean; retryAfterMs: number } {
  const entry = buckets.get(key);
  if (!entry || entry.resetAt <= now) {
    if (buckets.size >= MAX_BUCKETS) {
      pruneExpired(now);
    }
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, retryAfterMs: 0 };
  }
  entry.count += 1;
  if (entry.count > limit) {
    return { ok: false, retryAfterMs: entry.resetAt - now };
  }
  return { ok: true, retryAfterMs: 0 };
}

export function resetRateLimit(key: string) {
  buckets.delete(key);
}
