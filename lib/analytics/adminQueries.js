/**
 * Aeethod Studio — Admin Analytics Query & Aggregation Engine
 *
 * Provides server-side data extraction, time bucketing, funnel analysis,
 * attribution modeling, and metric calculations using Supabase Service Role client.
 */

import { verifySessionToken, SESSION_COOKIE_NAME } from "../session.js";
import {
  getAiPlatformFromRecord,
  detectAiReferral,
  normalizeReferrer,
  AI_PLATFORMS,
  AI_ATTRIBUTION_TYPES,
} from "./aiPlatforms.js";
import {
  isSearchEngine,
  isSocialPlatform,
  resolveCountry,
  COUNTRY_CODE_TO_NAME,
  validateGeoConsistency,
} from "./serverAnalytics.js";

// Re-export for backwards compatibility and tests
export { resolveCountry, COUNTRY_CODE_TO_NAME };

// Standard UI chart colors matching Aeethod editorial aesthetic
export const DEVICE_COLORS = {
  Desktop: "#7C5CFC",
  Mobile: "#60A5FA",
  Tablet: "#C4B5FD",
  Other: "#A78BFA",
};

export const SOURCE_COLORS = {
  Direct: "#7C5CFC",
  "Organic Search": "#60A5FA",
  Social: "#34D399",
  Referral: "#FBBF24",
  "Paid Ads": "#F87171",
  "AI Referral": "#10B981",
  Other: "#94A3B8",
};

export const PAGE_TITLES = {
  "/": "Home — Aeethod Studio",
  "/works": "Works & Case Studies",
  "/services": "Services Overview",
  "/services/automation": "Autonomous Automation Systems",
  "/studio": "Studio Identity & Philosophy",
  "/contact": "Direct Contact & Booking",
  "/yamal19": "Admin Login Gateway",
  "/yamal19/analytics": "Executive Analytics Console",
};

/**
 * Format a URL path into a human-readable editorial title.
 */
export function formatPageTitle(path) {
  if (!path) return "Unknown Page";
  const cleanPath = path.split("?")[0].replace(/\/$/, "") || "/";
  if (PAGE_TITLES[cleanPath]) return PAGE_TITLES[cleanPath];

  // Derive title from segments: "/services/ai-design" -> "Services — Ai Design"
  const segments = cleanPath
    .split("/")
    .filter(Boolean)
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1).replace(/-/g, " "));

  if (segments.length === 0) return "Home — Aeethod Studio";
  return segments.join(" — ") + " — Aeethod Studio";
}

/**
 * Validates admin session cookie on incoming requests.
 * @param {Request} request
 * @returns {Promise<{ authenticated: boolean, session?: any, response?: NextResponse }>}
 */
export async function requireAdminAuth(request) {
  const cookie = request.cookies.get(SESSION_COOKIE_NAME);
  const token = cookie?.value;

  if (!token) {
    return {
      authenticated: false,
      response: Response.json(
        { success: false, error: "Unauthorized: Missing session token" },
        { status: 401 }
      ),
    };
  }

  const session = await verifySessionToken(token);
  if (!session || !session.email) {
    return {
      authenticated: false,
      response: Response.json(
        { success: false, error: "Unauthorized: Invalid or expired session token" },
        { status: 401 }
      ),
    };
  }

  return { authenticated: true, session };
}

/**
 * Parses and computes current & previous date windows for comparative analytics.
 * All computations are time-zone anchored in UTC.
 *
 * @param {URLSearchParams} searchParams
 * @returns {{
 *   range: "today" | "yesterday" | "7d" | "30d" | "custom",
 *   rangeLabel: string,
 *   comparisonLabel: string,
 *   from: Date,
 *   to: Date,
 *   prevFrom: Date,
 *   prevTo: Date
 * }}
 */
export function parseDateRange(searchParams) {
  const rangeParam = (searchParams.get("range") || "7d").toLowerCase();
  const now = new Date();

  if (rangeParam === "today") {
    const from = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 0, 0, 0, 0));
    const to = now;

    // Yesterday same elapsed duration
    const elapsedMs = to.getTime() - from.getTime();
    const prevFrom = new Date(from.getTime() - 24 * 60 * 60 * 1000);
    const prevTo = new Date(prevFrom.getTime() + elapsedMs);

    return {
      range: "today",
      rangeLabel: "Today (Last 24 Hours)",
      comparisonLabel: "vs yesterday",
      from,
      to,
      prevFrom,
      prevTo,
    };
  }

  if (rangeParam === "yesterday") {
    const from = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - 1, 0, 0, 0, 0));
    const to = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - 1, 23, 59, 59, 999));

    const prevFrom = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - 2, 0, 0, 0, 0));
    const prevTo = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - 2, 23, 59, 59, 999));

    return {
      range: "yesterday",
      rangeLabel: "Yesterday",
      comparisonLabel: "vs previous day",
      from,
      to,
      prevFrom,
      prevTo,
    };
  }

  if (rangeParam === "30d") {
    const to = now;
    const from = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const prevTo = from;
    const prevFrom = new Date(from.getTime() - 30 * 24 * 60 * 60 * 1000);

    return {
      range: "30d",
      rangeLabel: "Last 30 Days",
      comparisonLabel: "vs previous 30 days",
      from,
      to,
      prevFrom,
      prevTo,
    };
  }

  if (rangeParam === "custom") {
    const customFromStr = searchParams.get("from");
    const customToStr = searchParams.get("to");

    let from = customFromStr ? new Date(customFromStr) : null;
    let to = customToStr ? new Date(customToStr) : null;

    if (!from || isNaN(from.getTime()) || !to || isNaN(to.getTime())) {
      // Fallback to 7d if custom dates invalid
      to = now;
      from = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    }

    const durationMs = to.getTime() - from.getTime();
    const prevTo = new Date(from.getTime());
    const prevFrom = new Date(from.getTime() - durationMs);

    return {
      range: "custom",
      rangeLabel: "Custom Range",
      comparisonLabel: "vs previous period",
      from,
      to,
      prevFrom,
      prevTo,
    };
  }

  // Default: 7d
  const to = now;
  const from = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const prevTo = from;
  const prevFrom = new Date(from.getTime() - 7 * 24 * 60 * 60 * 1000);

  return {
    range: "7d",
    rangeLabel: "Last 7 Days",
    comparisonLabel: "vs previous 7 days",
    from,
    to,
    prevFrom,
    prevTo,
  };
}

/**
 * Format duration in seconds into "Xm Ys" format.
 */
export function formatDuration(seconds) {
  if (!seconds || seconds <= 0) return "< 1m";
  const mins = Math.floor(seconds / 60);
  const secs = Math.round(seconds % 60);
  if (mins === 0) return `${secs}s`;
  return `${mins}m ${secs.toString().padStart(2, "0")}s`;
}

/**
 * Calculates percentage change and formatted sign.
 */
export function formatPercentageChange(current, previous, isBetterWhenLower = false) {
  if (previous === 0) {
    if (current === 0) return { change: "+0.0%", isPositive: true };
    return { change: "+100.0%", isPositive: !isBetterWhenLower };
  }

  const diff = ((current - previous) / previous) * 100;
  const sign = diff >= 0 ? "+" : "";
  const change = `${sign}${diff.toFixed(1)}%`;
  const isPositive = isBetterWhenLower ? diff <= 0 : diff >= 0;

  return { change, isPositive };
}

/**
 * Fetch raw records for a given date window.
 */
export async function fetchRawAnalyticsData(supabase, from, to) {
  const fromIso = from.toISOString();
  const toIso = to.toISOString();

  const candidateCols = [
    "ai_platform",
    "ai_attribution_type",
    "ai_referrer_host",
    "ai_referrer_path",
    "landing_page",
    "unknown_referrer_host",
    "attribution_reason",
    "country_code",
    "country_name",
    "region_code",
    "region_name",
    "metro",
    "timezone",
  ];
  let availableCols = [];
  try {
    const { error } = await supabase.from("sessions").select(candidateCols.join(", ")).limit(0);
    if (!error) {
      availableCols = candidateCols;
    } else {
      const { error: aiErr } = await supabase.from("sessions").select("ai_platform").limit(0);
      if (!aiErr) availableCols.push("ai_platform", "ai_attribution_type");
    }
  } catch {
    availableCols = [];
  }

  const baseCols = "session_id, visitor_id, started_at, last_activity_at, device_type, traffic_source, referrer, browser, operating_system, country, city, utm_source, utm_medium, utm_campaign";
  const sessionSelect = availableCols.length > 0 ? `${baseCols}, ${availableCols.join(", ")}` : baseCols;

  const [sessionsRes, pageViewsRes, eventsRes] = await Promise.all([
    supabase
      .from("sessions")
      .select(sessionSelect)
      .gte("started_at", fromIso)
      .lte("started_at", toIso),
    supabase
      .from("page_views")
      .select("id, session_id, visitor_id, path, viewed_at, duration_seconds")
      .gte("viewed_at", fromIso)
      .lte("viewed_at", toIso),
    supabase
      .from("analytics_events")
      .select("id, session_id, visitor_id, event_name, event_value, page_path, created_at")
      .gte("created_at", fromIso)
      .lte("created_at", toIso),
  ]);

  if (sessionsRes.error) console.error("Supabase Error [sessions]:", sessionsRes.error.message);
  if (pageViewsRes.error) console.error("Supabase Error [page_views]:", pageViewsRes.error.message);
  if (eventsRes.error) console.error("Supabase Error [analytics_events]:", eventsRes.error.message);

  return {
    sessions: sessionsRes.data || [],
    pageViews: pageViewsRes.data || [],
    events: eventsRes.data || [],
  };
}

/**
 * Get count of active live visitors (sessions active within the last 5 minutes).
 */
export async function getLiveVisitorsCount(supabase) {
  const fiveMinAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
  const { data, error } = await supabase
    .from("sessions")
    .select("visitor_id")
    .gte("last_activity_at", fiveMinAgo);

  if (error) {
    console.error("Supabase Error [live visitors]:", error.message);
    return 0;
  }

  const distinctVisitors = new Set((data || []).map((s) => s.visitor_id));
  return distinctVisitors.size;
}

/**
 * Computes high-level aggregated metrics for a single period.
 */
function computePeriodMetrics(sessions, pageViews, events) {
  const totalSessions = sessions.length;
  const uniqueVisitors = new Set(sessions.map((s) => s.visitor_id)).size;
  const totalPageviews = pageViews.length;

  // Session duration calculation:
  // Use difference between last_activity_at and started_at per session, capped to 4h max to avoid stale tab distortions
  let totalDurationSeconds = 0;
  for (const s of sessions) {
    const started = new Date(s.started_at).getTime();
    const lastActive = new Date(s.last_activity_at).getTime();
    let sessionSpan = Math.max(0, (lastActive - started) / 1000);
    // Cap individual session to 4 hours max per Rule 13
    if (sessionSpan > 14400) sessionSpan = 14400;
    totalDurationSeconds += sessionSpan;
  }
  const avgDurationSeconds = totalSessions > 0 ? totalDurationSeconds / totalSessions : 0;

  // Bounce Rate: sessions with <= 1 pageview and no conversion/engagement events per Rule 15
  const pvCountBySession = {};
  for (const pv of pageViews) {
    pvCountBySession[pv.session_id] = (pvCountBySession[pv.session_id] || 0) + 1;
  }

  const engagedSessionIds = new Set(events.map((e) => e.session_id));

  let bounceCount = 0;
  for (const s of sessions) {
    const pvs = pvCountBySession[s.session_id] || 0;
    const hasEngagement = engagedSessionIds.has(s.session_id);
    if (pvs <= 1 && !hasEngagement) {
      bounceCount += 1;
    }
  }
  const bounceRateNum = totalSessions > 0 ? (bounceCount / totalSessions) * 100 : 0;

  // Inquiries / Conversions
  const conversionEventNames = new Set([
    "inquiry_submitted",
    "inquiry_submit",
    "call_booked",
    "call_book",
    "contact_form_submit",
  ]);

  const inquiryEvents = events.filter((e) => conversionEventNames.has(e.event_name));
  const inquiries = inquiryEvents.length;
  const conversionRateNum = totalSessions > 0 ? (inquiries / totalSessions) * 100 : 0;

  return {
    totalSessions,
    uniqueVisitors,
    totalPageviews,
    avgDurationSeconds,
    bounceRateNum,
    inquiries,
    conversionRateNum,
  };
}

/**
 * Computes Overview Metrics cards with comparisons.
 */
export function computeOverviewMetrics(currentData, prevData, liveVisitors) {
  const cur = computePeriodMetrics(currentData.sessions, currentData.pageViews, currentData.events);
  const prev = computePeriodMetrics(prevData.sessions, prevData.pageViews, prevData.events);

  const uvChange = formatPercentageChange(cur.uniqueVisitors, prev.uniqueVisitors);
  const sessChange = formatPercentageChange(cur.totalSessions, prev.totalSessions);
  const pvChange = formatPercentageChange(cur.totalPageviews, prev.totalPageviews);

  // Duration change formatted in seconds
  const durDiff = Math.round(cur.avgDurationSeconds - prev.avgDurationSeconds);
  const durChangeSign = durDiff >= 0 ? `+${durDiff}s` : `${durDiff}s`;

  // Bounce rate change (lower is better!)
  const brChange = formatPercentageChange(cur.bounceRateNum, prev.bounceRateNum, true);

  // Inquiries change
  const inqDiff = cur.inquiries - prev.inquiries;
  const inqChangeSign = inqDiff >= 0 ? `+${inqDiff}` : `${inqDiff}`;

  // Conversion rate change
  const crDiff = cur.conversionRateNum - prev.conversionRateNum;
  const crChangeSign = crDiff >= 0 ? `+${crDiff.toFixed(1)}%` : `${crDiff.toFixed(1)}%`;

  return {
    liveVisitors,
    uniqueVisitors: {
      value: cur.uniqueVisitors,
      change: uvChange.change,
      isPositive: uvChange.isPositive,
    },
    totalSessions: {
      value: cur.totalSessions,
      change: sessChange.change,
      isPositive: sessChange.isPositive,
    },
    pageviews: {
      value: cur.totalPageviews,
      change: pvChange.change,
      isPositive: pvChange.isPositive,
    },
    avgDuration: {
      value: formatDuration(cur.avgDurationSeconds),
      change: durChangeSign,
      isPositive: durDiff >= 0,
    },
    bounceRate: {
      value: `${cur.bounceRateNum.toFixed(1)}%`,
      change: brChange.change,
      isPositive: brChange.isPositive,
    },
    inquiries: {
      value: cur.inquiries,
      change: inqChangeSign,
      isPositive: inqDiff >= 0,
    },
    conversionRate: {
      value: `${cur.conversionRateNum.toFixed(1)}%`,
      change: crChangeSign,
      isPositive: crDiff >= 0,
    },
  };
}

/**
 * Computes Time Series bucketing for the traffic chart.
 */
export function computeTimeSeries(sessions, pageViews, range, from, to) {
  if (range === "today" || range === "yesterday") {
    // 8 buckets of 3 hours: 00:00, 03:00, 06:00, 09:00, 12:00, 15:00, 18:00, 21:00
    const buckets = [
      { label: "00:00", hourStart: 0, hourEnd: 3, visitors: new Set(), pageviews: 0 },
      { label: "03:00", hourStart: 3, hourEnd: 6, visitors: new Set(), pageviews: 0 },
      { label: "06:00", hourStart: 6, hourEnd: 9, visitors: new Set(), pageviews: 0 },
      { label: "09:00", hourStart: 9, hourEnd: 12, visitors: new Set(), pageviews: 0 },
      { label: "12:00", hourStart: 12, hourEnd: 15, visitors: new Set(), pageviews: 0 },
      { label: "15:00", hourStart: 15, hourEnd: 18, visitors: new Set(), pageviews: 0 },
      { label: "18:00", hourStart: 18, hourEnd: 21, visitors: new Set(), pageviews: 0 },
      { label: "21:00", hourStart: 21, hourEnd: 24, visitors: new Set(), pageviews: 0 },
    ];

    for (const s of sessions) {
      const d = new Date(s.started_at);
      const h = d.getUTCHours();
      const bucket = buckets.find((b) => h >= b.hourStart && h < b.hourEnd);
      if (bucket) bucket.visitors.add(s.visitor_id);
    }

    for (const pv of pageViews) {
      const d = new Date(pv.viewed_at);
      const h = d.getUTCHours();
      const bucket = buckets.find((b) => h >= b.hourStart && h < b.hourEnd);
      if (bucket) bucket.pageviews += 1;
    }

    return buckets.map((b) => ({
      label: b.label,
      visitors: b.visitors.size,
      pageviews: b.pageviews,
    }));
  }

  if (range === "7d") {
    // 7 daily buckets: Mon, Tue, etc.
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const buckets = [];
    const dayMs = 24 * 60 * 60 * 1000;

    for (let i = 6; i >= 0; i--) {
      const targetDate = new Date(to.getTime() - i * dayMs);
      const dayStart = new Date(Date.UTC(targetDate.getUTCFullYear(), targetDate.getUTCMonth(), targetDate.getUTCDate(), 0, 0, 0, 0));
      const dayEnd = new Date(Date.UTC(targetDate.getUTCFullYear(), targetDate.getUTCMonth(), targetDate.getUTCDate(), 23, 59, 59, 999));
      buckets.push({
        label: dayNames[dayStart.getUTCDay()],
        dateKey: dayStart.toISOString().slice(0, 10),
        start: dayStart.getTime(),
        end: dayEnd.getTime(),
        visitors: new Set(),
        pageviews: 0,
      });
    }

    for (const s of sessions) {
      const t = new Date(s.started_at).getTime();
      const b = buckets.find((bucket) => t >= bucket.start && t <= bucket.end);
      if (b) b.visitors.add(s.visitor_id);
    }

    for (const pv of pageViews) {
      const t = new Date(pv.viewed_at).getTime();
      const b = buckets.find((bucket) => t >= bucket.start && t <= bucket.end);
      if (b) b.pageviews += 1;
    }

    return buckets.map((b) => ({
      label: b.label,
      visitors: b.visitors.size,
      pageviews: b.pageviews,
    }));
  }

  if (range === "30d") {
    // 4 weekly buckets: Week 1, Week 2, Week 3, Week 4
    const buckets = [
      { label: "Week 1", startOffsetDays: 30, endOffsetDays: 22, visitors: new Set(), pageviews: 0 },
      { label: "Week 2", startOffsetDays: 22, endOffsetDays: 15, visitors: new Set(), pageviews: 0 },
      { label: "Week 3", startOffsetDays: 15, endOffsetDays: 7, visitors: new Set(), pageviews: 0 },
      { label: "Week 4", startOffsetDays: 7, endOffsetDays: 0, visitors: new Set(), pageviews: 0 },
    ];

    const toTime = to.getTime();
    const dayMs = 24 * 60 * 60 * 1000;

    const initializedBuckets = buckets.map((b) => ({
      label: b.label,
      start: toTime - b.startOffsetDays * dayMs,
      end: toTime - b.endOffsetDays * dayMs,
      visitors: new Set(),
      pageviews: 0,
    }));

    for (const s of sessions) {
      const t = new Date(s.started_at).getTime();
      const b = initializedBuckets.find((bucket) => t >= bucket.start && t <= bucket.end);
      if (b) b.visitors.add(s.visitor_id);
    }

    for (const pv of pageViews) {
      const t = new Date(pv.viewed_at).getTime();
      const b = initializedBuckets.find((bucket) => t >= bucket.start && t <= bucket.end);
      if (b) b.pageviews += 1;
    }

    return initializedBuckets.map((b) => ({
      label: b.label,
      visitors: b.visitors.size,
      pageviews: b.pageviews,
    }));
  }

  // Custom range: split span into 4 to 8 proportional chunks
  const totalDuration = to.getTime() - from.getTime();
  const numBuckets = Math.min(8, Math.max(3, Math.round(totalDuration / (24 * 60 * 60 * 1000))));
  const bucketDuration = totalDuration / numBuckets;

  const buckets = [];
  for (let i = 0; i < numBuckets; i++) {
    const bStart = from.getTime() + i * bucketDuration;
    const bEnd = from.getTime() + (i + 1) * bucketDuration;
    const labelDate = new Date(bStart);
    const label = `${labelDate.getUTCMonth() + 1}/${labelDate.getUTCDate()}`;
    buckets.push({
      label,
      start: bStart,
      end: bEnd,
      visitors: new Set(),
      pageviews: 0,
    });
  }

  for (const s of sessions) {
    const t = new Date(s.started_at).getTime();
    const b = buckets.find((bucket) => t >= bucket.start && t <= bucket.end);
    if (b) b.visitors.add(s.visitor_id);
  }

  for (const pv of pageViews) {
    const t = new Date(pv.viewed_at).getTime();
    const b = buckets.find((bucket) => t >= bucket.start && t <= bucket.end);
    if (b) b.pageviews += 1;
  }

  return buckets.map((b) => ({
    label: b.label,
    visitors: b.visitors.size,
    pageviews: b.pageviews,
  }));
}

/**
 * Computes 4-stage funnel metrics:
 * 1. Website Visits (all sessions)
 * 2. Explored Services / Work (sessions that viewed /services, /works or fired explore events)
 * 3. Started Contact (sessions that navigated to /contact or fired start_contact)
 * 4. Inquiry / Call Booked (sessions that converted via inquiry_submitted / call_booked)
 */
export function computeFunnel(sessions, pageViews, events) {
  const stage1Sessions = new Set(sessions.map((s) => s.session_id));
  const stage2Sessions = new Set();
  const stage3Sessions = new Set();
  const stage4Sessions = new Set();

  // Inspect pageviews
  for (const pv of pageViews) {
    const p = pv.path || "";
    if (p.startsWith("/services") || p.startsWith("/works")) {
      stage2Sessions.add(pv.session_id);
    }
    if (p === "/contact" || p.startsWith("/contact/")) {
      stage3Sessions.add(pv.session_id);
    }
  }

  // Inspect events
  for (const e of events) {
    const name = e.event_name;
    if (
      name === "explore_services" ||
      name === "service_view" ||
      name === "view_work" ||
      name === "work_view"
    ) {
      stage2Sessions.add(e.session_id);
    }
    if (name === "start_contact" || name === "contact_start") {
      stage3Sessions.add(e.session_id);
    }
    if (
      name === "inquiry_submitted" ||
      name === "inquiry_submit" ||
      name === "call_booked" ||
      name === "call_book" ||
      name === "contact_form_submit"
    ) {
      stage4Sessions.add(e.session_id);
    }
  }


  const s1Count = stage1Sessions.size;
  // Funnel logic: each downstream step can never exceed previous step
  const s2Count = Math.min(s1Count, stage2Sessions.size);
  const s3Count = Math.min(s2Count, stage3Sessions.size);
  const s4Count = Math.min(s3Count, stage4Sessions.size);

  const s1Pct = s1Count > 0 ? 100 : 0;
  const s2Pct = s1Count > 0 ? Number(((s2Count / s1Count) * 100).toFixed(1)) : 0;
  const s3Pct = s1Count > 0 ? Number(((s3Count / s1Count) * 100).toFixed(1)) : 0;
  const s4Pct = s1Count > 0 ? Number(((s4Count / s1Count) * 100).toFixed(1)) : 0;

  const s2Dropoff = s1Count > 0 ? Number((100 - (s2Count / s1Count) * 100).toFixed(1)) : 0;
  const s3Dropoff = s2Count > 0 ? Number((100 - (s3Count / s2Count) * 100).toFixed(1)) : (s1Count > 0 ? 100 : 0);
  const s4Dropoff = s3Count > 0 ? Number((100 - (s4Count / s3Count) * 100).toFixed(1)) : (s2Count > 0 ? 100 : 0);

  return [
    { stage: "Website Visits", count: s1Count, percentage: s1Pct, dropoff: null },
    { stage: "Explored Services / Work", count: s2Count, percentage: s2Pct, dropoff: s2Dropoff },
    { stage: "Started Contact", count: s3Count, percentage: s3Pct, dropoff: s3Dropoff },
    { stage: "Inquiry / Call Booked", count: s4Count, percentage: s4Pct, dropoff: s4Dropoff },
  ];
}

/**
 * Computes device breakdown (Desktop, Mobile, Tablet).
 */
export function computeDeviceBreakdown(sessions) {
  const counts = { Desktop: 0, Mobile: 0, Tablet: 0 };
  const total = sessions.length;

  for (const s of sessions) {
    const rawType = (s.device_type || "").toLowerCase();
    if (rawType.includes("mobile") || rawType.includes("phone")) {
      counts.Mobile += 1;
    } else if (rawType.includes("tablet") || rawType.includes("ipad")) {
      counts.Tablet += 1;
    } else {
      counts.Desktop += 1; // Default to desktop
    }
  }

  return [
    {
      type: "Desktop",
      percentage: total > 0 ? Number(((counts.Desktop / total) * 100).toFixed(1)) : 0,
      count: counts.Desktop,
      color: DEVICE_COLORS.Desktop,
    },
    {
      type: "Mobile",
      percentage: total > 0 ? Number(((counts.Mobile / total) * 100).toFixed(1)) : 0,
      count: counts.Mobile,
      color: DEVICE_COLORS.Mobile,
    },
    {
      type: "Tablet",
      percentage: total > 0 ? Number(((counts.Tablet / total) * 100).toFixed(1)) : 0,
      count: counts.Tablet,
      color: DEVICE_COLORS.Tablet,
    },
  ];
}

/**
 * Computes classified traffic source distribution.
 */
export function computeTrafficSources(sessions) {
  const sources = {
    Direct: 0,
    "Organic Search": 0,
    Social: 0,
    Referral: 0,
    "Paid Ads": 0,
    "AI Referral": 0,
  };
  const total = sessions.length;

  for (const s of sessions) {
    let rawSource = s.traffic_source || "Direct";
    if (rawSource !== "AI Referral" && (s.referrer || s.utm_source)) {
      const dummySearch = new URLSearchParams();
      if (s.utm_source) dummySearch.set("utm_source", s.utm_source);
      if (s.utm_medium) dummySearch.set("utm_medium", s.utm_medium);
      const aiCheck = detectAiReferral(s.referrer, dummySearch);
      if (aiCheck.isAiReferral && aiCheck.attributionType === AI_ATTRIBUTION_TYPES.VERIFIED_AI_REFERRAL) {
        rawSource = "AI Referral";
      }
    }

    if (sources[rawSource] !== undefined) {
      sources[rawSource] += 1;
    } else {
      sources.Direct += 1;
    }
  }

  return Object.entries(sources).map(([source, count]) => ({
    source,
    count,
    percentage: total > 0 ? Number(((count / total) * 100).toFixed(1)) : 0,
    color: SOURCE_COLORS[source] || SOURCE_COLORS.Other,
  }));
}


/**
 * Computes Top Pages viewed in period.
 */
export function computeTopPages(pageViews, limit = 10) {
  const map = {};

  for (const pv of pageViews) {
    const path = pv.path || "/";
    if (!map[path]) {
      map[path] = {
        path,
        views: 0,
        visitors: new Set(),
        totalDuration: 0,
      };
    }
    map[path].views += 1;
    if (pv.visitor_id) map[path].visitors.add(pv.visitor_id);
    map[path].totalDuration += pv.duration_seconds || 0;
  }

  const sorted = Object.values(map)
    .sort((a, b) => b.views - a.views)
    .slice(0, limit);

  return sorted.map((p) => ({
    title: formatPageTitle(p.path),
    path: p.path,
    views: p.views,
    uniqueVisitors: p.visitors.size,
    avgTime: formatDuration(p.views > 0 ? p.totalDuration / p.views : 0),
  }));
}

/**
 * Computes Audience Geography (Countries & Cities).
 */
export function computeGeography(sessions) {
  const countryMap = {};
  const cityMap = {};
  const total = sessions.length;

  for (const s of sessions) {
    // Prefer normalized country fields if available, fallback to legacy country column
    const rawCountry = s.country_name || s.country_code || s.country;
    const resolved = resolveCountry(rawCountry);
    const countryKey = resolved.name;
    // Prefer metro if available, fallback to city
    const rawMetro = s.metro && typeof s.metro === "string" && s.metro.trim() ? s.metro.trim() : null;
    const rawCity = s.city && typeof s.city === "string" && s.city.trim() ? s.city.trim() : null;
    const city = rawMetro || rawCity;

    // Aggregate countries (include "Unknown" for null countries)
    countryMap[countryKey] = (countryMap[countryKey] || { code: resolved.code, name: resolved.name, sessions: 0 });
    countryMap[countryKey].sessions += 1;

    // Aggregate cities / metros — ONLY if genuinely available and geographically consistent
    if (city && validateGeoConsistency(resolved.code, city)) {
      const cityKey = `${city}|${countryKey}`;
      if (!cityMap[cityKey]) {
        cityMap[cityKey] = {
          city,
          countryCode: resolved.code,
          countryName: resolved.name,
          sessions: 0,
        };
      }
      cityMap[cityKey].sessions += 1;
    }
  }

  const countries = Object.values(countryMap)
    .map((c) => ({
      country: c.name,
      code: c.code || "—",
      sessions: c.sessions,
      percentage: total > 0 ? Number(((c.sessions / total) * 100).toFixed(1)) : 0,
    }))
    .sort((a, b) => b.sessions - a.sessions)
    .slice(0, 7);

  const cities = Object.values(cityMap)
    .filter((c) => c.city && c.city !== "Unknown") // Never show fabricated cities
    .map((c) => ({
      city: c.city,
      country: c.countryCode || "—",
      countryName: c.countryName || "Unknown",
      sessions: c.sessions,
    }))
    .sort((a, b) => b.sessions - a.sessions)
    .slice(0, 6);

  return { countries, cities };
}

/**
 * Computes Technology Breakdown (Browsers & Operating Systems).
 */
export function computeTechnology(sessions) {
  const browserMap = {
    Chrome: 0,
    Safari: 0,
    Edge: 0,
    Firefox: 0,
    "Samsung Internet": 0,
    Opera: 0,
    "Android Browser": 0,
    Other: 0,
  };
  const osMap = {
    macOS: 0,
    Windows: 0,
    iOS: 0,
    Android: 0,
    Linux: 0,
    ChromeOS: 0,
    Other: 0,
  };
  const total = sessions.length;

  for (const s of sessions) {
    const b = s.browser || "Other";
    if (browserMap[b] !== undefined) browserMap[b] += 1;
    else browserMap.Other += 1;

    const os = s.operating_system || "Other";
    if (osMap[os] !== undefined) osMap[os] += 1;
    else osMap.Other += 1;
  }

  const browsers = Object.entries(browserMap).map(([name, count]) => ({
    name,
    percentage: total > 0 ? Number(((count / total) * 100).toFixed(1)) : 0,
    count,
  }));

  const os = Object.entries(osMap).map(([name, count]) => ({
    name,
    percentage: total > 0 ? Number(((count / total) * 100).toFixed(1)) : 0,
    count,
  }));

  return { browsers, os };
}

/**
 * Computes Campaign Performance (UTM campaigns).
 */
export function computeCampaigns(sessions, events) {
  const conversionSessionIds = new Set(
    events
      .filter((e) => ["inquiry_submitted", "call_booked", "contact_form_submit"].includes(e.event_name))
      .map((e) => e.session_id)
  );

  const campaignMap = {};

  for (const s of sessions) {
    if (!s.utm_campaign && !s.utm_source) continue;

    const campaignKey = `${s.utm_source || "Direct"}|${s.utm_medium || "Referral"}|${s.utm_campaign || "general"}`;
    if (!campaignMap[campaignKey]) {
      campaignMap[campaignKey] = {
        source: s.utm_source || "Direct",
        medium: s.utm_medium || "Referral",
        campaign: s.utm_campaign || "general",
        sessions: 0,
        visitors: new Set(),
        conversions: 0,
      };
    }

    campaignMap[campaignKey].sessions += 1;
    if (s.visitor_id) campaignMap[campaignKey].visitors.add(s.visitor_id);
    if (conversionSessionIds.has(s.session_id)) {
      campaignMap[campaignKey].conversions += 1;
    }
  }

  return Object.values(campaignMap)
    .sort((a, b) => b.sessions - a.sessions)
    .slice(0, 10)
    .map((c) => ({
      source: c.source,
      medium: c.medium,
      campaign: c.campaign,
      sessions: c.sessions,
      visitors: c.visitors.size,
      conversions: c.conversions,
      rate: c.sessions > 0 ? `${((c.conversions / c.sessions) * 100).toFixed(1)}%` : "0.0%",
    }));
}

/**
 * Computes dedicated AI Referral analytics:
 * - Overall metrics: aiVisitors, aiSessions, aiPageviews, aiInquiries, aiConversions, aiConversionRate
 * - Platform breakdown: Platform, Visitors, Sessions, Pageviews, Inquiries, Conversions, Conversion Rate
 * - AI conversion funnel: Visit -> Explore Services/Work -> Start Contact -> Inquiry / Call Booked
 */
export function computeAiReferralAnalytics(sessions, pageViews, events) {
  // Identify verified AI sessions
  const aiSessions = [];
  for (const s of sessions) {
    if (s.traffic_source === "AI Referral") {
      aiSessions.push(s);
    } else if (s.ai_attribution_type === AI_ATTRIBUTION_TYPES.VERIFIED_AI_REFERRAL) {
      aiSessions.push(s);
    } else if (s.referrer || s.utm_source || s.utm_medium) {
      const dummySearch = new URLSearchParams();
      if (s.utm_source) dummySearch.set("utm_source", s.utm_source);
      if (s.utm_medium) dummySearch.set("utm_medium", s.utm_medium);
      const check = detectAiReferral(s.referrer || "", dummySearch);
      if (check.isAiReferral && check.attributionType === AI_ATTRIBUTION_TYPES.VERIFIED_AI_REFERRAL) {
        aiSessions.push(s);
      }
    }
  }

  const aiSessionIds = new Set(aiSessions.map((s) => s.session_id));
  const aiVisitorIds = new Set(aiSessions.map((s) => s.visitor_id));

  // AI Pageviews
  const aiPageViewList = pageViews.filter((pv) => aiSessionIds.has(pv.session_id));
  const aiPageviews = aiPageViewList.length;

  // AI Conversion Events
  const conversionNames = new Set([
    "inquiry_submitted",
    "inquiry_submit",
    "call_booked",
    "call_book",
    "contact_form_submit",
  ]);

  const aiEvents = events.filter((e) => aiSessionIds.has(e.session_id));
  const aiInquiryEvents = aiEvents.filter((e) => conversionNames.has(e.event_name));
  const aiInquiries = aiInquiryEvents.length;

  const convertingAiSessionIds = new Set(aiInquiryEvents.map((e) => e.session_id));
  const aiConversions = convertingAiSessionIds.size;
  const aiConversionRate =
    aiSessions.length > 0
      ? `${((aiConversions / aiSessions.length) * 100).toFixed(1)}%`
      : "0.0%";

  // AI Platform Breakdown
  const platformMap = {};

  for (const s of aiSessions) {
    const platformName = getAiPlatformFromRecord(
      s.referrer,
      s.utm_source,
      s.utm_medium,
      s.ai_platform
    );
    if (!platformMap[platformName]) {
      const matchedConfig = AI_PLATFORMS.find(
        (p) => p.name.toLowerCase() === platformName.toLowerCase()
      );
      platformMap[platformName] = {
        platform: platformName,
        sessions: 0,
        visitors: new Set(),
        pageviews: 0,
        inquiries: 0,
        conversions: 0,
        color: matchedConfig?.color || "#10B981",
        sessionIds: new Set(),
      };
    }
    platformMap[platformName].sessions += 1;
    if (s.visitor_id) platformMap[platformName].visitors.add(s.visitor_id);
    platformMap[platformName].sessionIds.add(s.session_id);
  }

  for (const pv of aiPageViewList) {
    for (const p of Object.values(platformMap)) {
      if (p.sessionIds.has(pv.session_id)) {
        p.pageviews += 1;
      }
    }
  }

  for (const e of aiInquiryEvents) {
    for (const p of Object.values(platformMap)) {
      if (p.sessionIds.has(e.session_id)) {
        p.inquiries += 1;
      }
    }
  }

  const platforms = Object.values(platformMap)
    .sort((a, b) => b.sessions - a.sessions)
    .map((p) => {
      const convCount = Array.from(p.sessionIds).filter((id) => convertingAiSessionIds.has(id)).length;
      return {
        platform: p.platform,
        visitors: p.visitors.size,
        sessions: p.sessions,
        pageviews: p.pageviews,
        inquiries: p.inquiries,
        conversions: convCount,
        conversionRate: p.sessions > 0 ? `${((convCount / p.sessions) * 100).toFixed(1)}%` : "0.0%",
        color: p.color,
      };
    });

  // AI Funnel
  const s1Count = aiSessions.length;
  const stage2Sessions = new Set();
  const stage3Sessions = new Set();

  for (const pv of aiPageViewList) {
    const p = pv.path || "";
    if (p.startsWith("/services") || p.startsWith("/works")) {
      stage2Sessions.add(pv.session_id);
    }
    if (p === "/contact" || p.startsWith("/contact/")) {
      stage3Sessions.add(pv.session_id);
    }
  }

  for (const e of aiEvents) {
    if (
      e.event_name === "explore_services" ||
      e.event_name === "service_view" ||
      e.event_name === "view_work" ||
      e.event_name === "work_view"
    ) {
      stage2Sessions.add(e.session_id);
    }
    if (e.event_name === "start_contact" || e.event_name === "contact_start") {
      stage3Sessions.add(e.session_id);
    }
  }

  const s2Count = Math.min(s1Count, stage2Sessions.size);
  const s3Count = Math.min(s2Count, stage3Sessions.size);
  const s4Count = Math.min(s3Count, aiConversions);

  const funnel = [
    {
      stage: "Website Visits",
      count: s1Count,
      percentage: s1Count > 0 ? 100 : 0,
      dropoff: null,
    },
    {
      stage: "Explored Services / Work",
      count: s2Count,
      percentage: s1Count > 0 ? Number(((s2Count / s1Count) * 100).toFixed(1)) : 0,
      dropoff: s1Count > 0 ? Number((100 - (s2Count / s1Count) * 100).toFixed(1)) : 0,
    },
    {
      stage: "Started Contact",
      count: s3Count,
      percentage: s1Count > 0 ? Number(((s3Count / s1Count) * 100).toFixed(1)) : 0,
      dropoff: s2Count > 0 ? Number((100 - (s3Count / s2Count) * 100).toFixed(1)) : (s1Count > 0 ? 100 : 0),
    },
    {
      stage: "Inquiry / Call Booked",
      count: s4Count,
      percentage: s1Count > 0 ? Number(((s4Count / s1Count) * 100).toFixed(1)) : 0,
      dropoff: s3Count > 0 ? Number((100 - (s4Count / s3Count) * 100).toFixed(1)) : (s2Count > 0 ? 100 : 0),
    },
  ];

  return {
    aiVisitors: aiVisitorIds.size,
    aiSessions: s1Count,
    aiPageviews,
    aiInquiries,
    aiConversions,
    aiConversionRate,
    platforms,
    funnel,
  };
}

/**
 * Computes AI Referral Diagnostics & Unknown Referrer Discovery Report.
 * Allows development and admin inspection of:
 * - Verified AI platforms and session counts
 * - Discovered unknown external referrers (candidate AI platforms to monitor!)
 * - UTM campaign detections
 * - Direct / unattributed traffic volume
 */
export function computeAiDiagnostics(sessions, pageViews, events) {
  const recognizedPlatforms = {};
  const unknownHosts = {};
  const utmDetections = {};
  let directSessions = 0;
  let verifiedAiSessions = 0;

  for (const s of sessions) {
    if (s.traffic_source === "AI Referral") {
      verifiedAiSessions += 1;
      const platformName = getAiPlatformFromRecord(
        s.referrer,
        s.utm_source,
        s.utm_medium,
        s.ai_platform
      );
      recognizedPlatforms[platformName] = (recognizedPlatforms[platformName] || 0) + 1;
    } else if (s.traffic_source === "Direct") {
      directSessions += 1;
    }

    if (s.utm_source) {
      const utmKey = `${s.utm_source}${s.utm_medium ? " / " + s.utm_medium : ""}`;
      utmDetections[utmKey] = (utmDetections[utmKey] || 0) + 1;
    }

    // Discover unknown external hosts
    const unknownHost = s.unknown_referrer_host;
    if (unknownHost) {
      if (!unknownHosts[unknownHost]) {
        unknownHosts[unknownHost] = { host: unknownHost, sessions: 0, samplePath: s.referrer || "" };
      }
      unknownHosts[unknownHost].sessions += 1;
    } else if (s.traffic_source === "Referral" && s.referrer) {
      const norm = normalizeReferrer(s.referrer);
      if (norm.host && !isSearchEngine(norm.host) && !isSocialPlatform(norm.host)) {
        if (!unknownHosts[norm.host]) {
          unknownHosts[norm.host] = { host: norm.host, sessions: 0, samplePath: s.referrer };
        }
        unknownHosts[norm.host].sessions += 1;
      }
    }
  }

  const unknownReferrerHosts = Object.values(unknownHosts).sort((a, b) => b.sessions - a.sessions);

  return {
    totalSessions: sessions.length,
    verifiedAiSessions,
    directSessions,
    recognizedPlatforms: Object.entries(recognizedPlatforms)
      .map(([platform, count]) => ({ platform, count }))
      .sort((a, b) => b.count - a.count),
    unknownReferrerHosts,
    utmDetections: Object.entries(utmDetections)
      .map(([campaign, count]) => ({ campaign, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 15),
  };
}

/**
 * High-performance master aggregator fetching all sections in a single call.
 */
export async function getAllAnalyticsData(supabase, searchParams) {
  const startTime = Date.now();
  const rangeInfo = parseDateRange(searchParams);

  // Fetch current period, comparison period, and live visitors in parallel
  const [currentRaw, prevRaw, liveVisitors] = await Promise.all([
    fetchRawAnalyticsData(supabase, rangeInfo.from, rangeInfo.to),
    fetchRawAnalyticsData(supabase, rangeInfo.prevFrom, rangeInfo.prevTo),
    getLiveVisitorsCount(supabase),
  ]);

  const metrics = computeOverviewMetrics(currentRaw, prevRaw, liveVisitors);
  const trafficChart = computeTimeSeries(currentRaw.sessions, currentRaw.pageViews, rangeInfo.range, rangeInfo.from, rangeInfo.to);
  const funnel = computeFunnel(currentRaw.sessions, currentRaw.pageViews, currentRaw.events);
  const devices = computeDeviceBreakdown(currentRaw.sessions);
  const trafficSources = computeTrafficSources(currentRaw.sessions);
  const topPages = computeTopPages(currentRaw.pageViews, 10);
  const geography = computeGeography(currentRaw.sessions);
  const technology = computeTechnology(currentRaw.sessions);
  const campaigns = computeCampaigns(currentRaw.sessions, currentRaw.events);
  const aiReferrals = computeAiReferralAnalytics(currentRaw.sessions, currentRaw.pageViews, currentRaw.events);

  const queryDurationMs = Date.now() - startTime;

  return {
    data: {
      range: rangeInfo.range,
      rangeLabel: rangeInfo.rangeLabel,
      comparisonLabel: rangeInfo.comparisonLabel,
      metrics,
      trafficChart,
      funnel,
      devices,
      trafficSources,
      topPages,
      geography,
      technology,
      campaigns,
      aiReferrals,
    },
    meta: {
      range: rangeInfo.range,
      from: rangeInfo.from.toISOString(),
      to: rangeInfo.to.toISOString(),
      prevFrom: rangeInfo.prevFrom.toISOString(),
      prevTo: rangeInfo.prevTo.toISOString(),
      queryDurationMs,
    },
  };
}

