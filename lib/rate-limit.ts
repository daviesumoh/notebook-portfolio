// Sliding-window rate limiter for API routes.
//
// State lives in process memory, so on serverless platforms each instance keeps
// its own counters. That is enough to blunt casual abuse; for a hard global
// limit use a shared store (e.g. Redis) or a platform firewall rule as well.

interface Bucket {
  hits: number[]
}

const buckets = new Map<string, Bucket>()
const MAX_TRACKED_KEYS = 5000

export interface RateLimitResult {
  allowed: boolean
  remaining: number
  retryAfterSeconds: number
}

export function rateLimit(key: string, limit: number, windowMs: number): RateLimitResult {
  const now = Date.now()
  const windowStart = now - windowMs

  // Drop expired entries so the map can't grow without bound.
  if (buckets.size > MAX_TRACKED_KEYS) {
    for (const [k, b] of buckets) {
      if (b.hits.length === 0 || b.hits[b.hits.length - 1] <= windowStart) buckets.delete(k)
    }
    if (buckets.size > MAX_TRACKED_KEYS) buckets.clear()
  }

  const bucket = buckets.get(key) ?? { hits: [] }
  bucket.hits = bucket.hits.filter((t) => t > windowStart)

  if (bucket.hits.length >= limit) {
    buckets.set(key, bucket)
    const retryAfterMs = bucket.hits[0] + windowMs - now
    return { allowed: false, remaining: 0, retryAfterSeconds: Math.max(1, Math.ceil(retryAfterMs / 1000)) }
  }

  bucket.hits.push(now)
  buckets.set(key, bucket)
  return { allowed: true, remaining: limit - bucket.hits.length, retryAfterSeconds: 0 }
}

export function getClientIp(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for")
  if (forwarded) return forwarded.split(",")[0].trim()
  return headers.get("x-real-ip") ?? "unknown"
}
