// NOTE: This in-process store resets on every cold start (serverless / Vercel).
// The limit is advisory only in multi-instance deployments. For hard enforcement
// replace with an Upstash Redis rate limiter.
const store = new Map<string, { count: number; resetAt: number }>();

// Prune expired entries every 5 minutes to prevent unbounded memory growth
// in long-lived processes (local dev, traditional Node servers).
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of store) {
      if (now > entry.resetAt) store.delete(key);
    }
  }, 5 * 60 * 1000).unref?.();
}

export function checkRateLimit(key: string, maxRequests: number, windowMs: number): boolean {
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || now > entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (entry.count >= maxRequests) return false;

  entry.count += 1;
  return true;
}
