import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// ======================================================
// Shared rate limiters, backed by Upstash Redis so limits
// hold across serverless invocations on Vercel (in-memory
// counters don't persist between cold starts / instances).
// ======================================================

const redis = Redis.fromEnv();

// Free-text chat -> hits the Gemini API on every message.
// 8 messages per 60s per IP is generous for a real visitor
// typing, but blocks scripted spam from running up API cost.
export const chatRatelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(8, "60 s"),
  prefix: "ratelimit:chat",
  analytics: true,
});

// Lead form -> sends a real email. Someone filling this out
// legitimately does it once; more than a few tries in a short
// window is spam, not a real visitor retrying a typo.
export const leadRatelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "10 m"),
  prefix: "ratelimit:lead",
  analytics: true,
});

// Vercel sets x-forwarded-for on incoming requests. Take the
// first IP in the list (the original client).
export function getClientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return "unknown";
}