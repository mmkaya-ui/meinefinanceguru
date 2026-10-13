const rateLimitCache = new Map<string, { count: number, resetTime: number }>();

const MAX_REQUESTS = 10;
const WINDOW_MS = 60000; // 1 minute window

export function checkRateLimit(ip: string, route: string = "chat"): boolean {
  const now = Date.now();
  const key = `${ip}:${route}`;

  // Lazy GC: cleanup expired entries before processing
  for (const [k, v] of rateLimitCache.entries()) {
    if (now > v.resetTime) {
      rateLimitCache.delete(k);
    }
  }

  const record = rateLimitCache.get(key);

  if (!record) {
    rateLimitCache.set(key, { count: 1, resetTime: now + WINDOW_MS });
    return true;
  }

  if (now > record.resetTime) {
    rateLimitCache.set(key, { count: 1, resetTime: now + WINDOW_MS });
    return true;
  }

  if (record.count >= MAX_REQUESTS) {
    return false;
  }

  record.count += 1;
  return true;
}
