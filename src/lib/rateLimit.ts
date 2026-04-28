import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// ─── Local fallback (used when Upstash env vars are not set — local dev) ───────

const localStore = new Map<string, { count: number; resetAt: number }>();

if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of localStore) {
      if (now > entry.resetAt) localStore.delete(key);
    }
  }, 5 * 60 * 1000).unref?.();
}

function localCheck(key: string, maxRequests: number, windowMs: number): boolean {
  const now = Date.now();
  const entry = localStore.get(key);
  if (!entry || now > entry.resetAt) {
    localStore.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (entry.count >= maxRequests) return false;
  entry.count += 1;
  return true;
}

// ─── Upstash distributed rate limiter ──────────────────────────────────────────

function msToWindow(ms: number): `${number} ${'ms' | 's' | 'm' | 'h' | 'd'}` {
  if (ms % (60 * 60 * 1000) === 0) return `${ms / (60 * 60 * 1000)} h`;
  if (ms % 60_000 === 0) return `${ms / 60_000} m`;
  if (ms % 1_000 === 0) return `${ms / 1_000} s`;
  return `${ms} ms`;
}

// Cache one Ratelimit instance per (maxRequests, windowMs) pair so we don't
// re-create a Redis client on every request.
const limiterCache = new Map<string, Ratelimit>();

function getLimiter(maxRequests: number, windowMs: number): Ratelimit {
  const key = `${maxRequests}:${windowMs}`;
  if (!limiterCache.has(key)) {
    limiterCache.set(key, new Ratelimit({
      redis: Redis.fromEnv(),
      limiter: Ratelimit.slidingWindow(maxRequests, msToWindow(windowMs)),
    }));
  }
  return limiterCache.get(key)!;
}

const UPSTASH_CONFIGURED =
  Boolean(process.env.UPSTASH_REDIS_REST_URL) &&
  Boolean(process.env.UPSTASH_REDIS_REST_TOKEN);

// ─── Public API ────────────────────────────────────────────────────────────────

/**
 * Returns true if the request is within the limit, false if it should be blocked.
 * Uses Upstash Redis sliding window in production, in-process Map in local dev.
 */
export async function checkRateLimit(
  key: string,
  maxRequests: number,
  windowMs: number,
): Promise<boolean> {
  if (!UPSTASH_CONFIGURED) {
    return localCheck(key, maxRequests, windowMs);
  }
  const { success } = await getLimiter(maxRequests, windowMs).limit(key);
  return success;
}
