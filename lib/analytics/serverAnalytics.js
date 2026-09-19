/**
 * Server-Side Analytics Helpers & Rate Limiter
 *
 * Provides:
 * - Anti-abuse in-memory rate limiting per client IP
 * - Geo metadata extraction from Edge / Cloud headers without raw IP storage
 * - Request validation and sanitization
 */

import { z } from "zod";

// Rate limiter: Map<ip, { count: number, resetAt: number }>
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 150; // max 150 requests / min per IP

/**
 * Basic IP-based rate limiting to prevent telemetry flooding.
 * Does NOT permanently record IP addresses.
 *
 * @param {Request} request
 * @returns {boolean} true if request is allowed, false if rate limited
 */
export function checkRateLimit(request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";

  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now > record.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }

  record.count += 1;
  if (record.count > MAX_REQUESTS_PER_WINDOW) {
    return false;
  }

  return true;
}

// Periodic cleanup of rate limiter to prevent memory leaks
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [ip, record] of rateLimitMap.entries()) {
      if (now > record.resetAt) {
        rateLimitMap.delete(ip);
      }
    }
  }, 5 * 60 * 1000);
}

/**
 * Extracts non-sensitive geographic location from Edge headers.
 * Never stores or exposes raw IP addresses.
 *
 * @param {Request} request
 * @returns {{ country: string|null, city: string|null }}
 */
export function extractGeoFromHeaders(request) {
  const country =
    request.headers.get("x-vercel-ip-country") ||
    request.headers.get("cf-ipcountry") ||
    null;

  let city = request.headers.get("x-vercel-ip-city") || null;
  if (city) {
    try {
      city = decodeURIComponent(city);
    } catch {
      // ignore decode error
    }
  }

  return { country, city };
}

// ============================================================
// ZOD SCHEMAS FOR ANALYTICS INGESTION
// ============================================================

export const PageViewSchema = z.object({
  visitorId: z.string().min(5).max(64),
  sessionId: z.string().min(5).max(64),
  path: z.string().min(1).max(500),
  referrer: z.string().max(1000).optional().nullable(),
  trafficSource: z.enum(["Direct", "Organic Search", "Social", "Paid Ads", "Referral"]).default("Direct"),
  utm: z
    .object({
      utm_source: z.string().max(200).optional().nullable(),
      utm_medium: z.string().max(200).optional().nullable(),
      utm_campaign: z.string().max(200).optional().nullable(),
      utm_term: z.string().max(200).optional().nullable(),
      utm_content: z.string().max(200).optional().nullable(),
    })
    .optional()
    .nullable(),
  device: z
    .object({
      device_type: z.string().max(50).optional().nullable(),
      operating_system: z.string().max(50).optional().nullable(),
      browser: z.string().max(50).optional().nullable(),
      screen_resolution: z.string().max(50).optional().nullable(),
    })
    .optional()
    .nullable(),
  isNewVisitor: z.boolean().optional(),
  isNewSession: z.boolean().optional(),
});

export const HeartbeatSchema = z.object({
  visitorId: z.string().min(5).max(64),
  sessionId: z.string().min(5).max(64),
  path: z.string().min(1).max(500),
  dwellSeconds: z.number().int().min(1).max(300).default(20),
});

export const EventSchema = z.object({
  visitorId: z.string().min(5).max(64),
  sessionId: z.string().min(5).max(64),
  eventName: z.string().min(1).max(80),
  eventValue: z.any().optional().nullable(),
  pagePath: z.string().max(500).optional().nullable(),
});
