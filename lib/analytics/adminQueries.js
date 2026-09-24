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
import {
  SESSION_CLASSIFICATIONS,
  CLASSIFICATION_LABELS,
} from "./classification.js";

// Re-export for backwards compatibility and tests
export { resolveCountry, COUNTRY_CODE_TO_NAME, SESSION_CLASSIFICATIONS, CLASSIFICATION_LABELS };

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

// Internal baseline reset timestamp: all queries strictly ignore data prior to this timestamp
export const ANALYTICS_RESET_AT = process.env.ANALYTICS_RESET_AT || "2026-09-21T14:17:13.013Z";

let cachedSessionCols = null;

export function clearAnalyticsCaches() {
  cachedSessionCols = null;
}

export async function getAvailableSessionCols(supabase) {
  if (cachedSessionCols) return cachedSessionCols;
  const candidateCols = [
    "ai_platform",
    "ai_attribution_type",
    "detection_method",
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
    "classification",
  ];
  const verified = [];
  await Promise.all(
    candidateCols.map(async (col) => {
      try {
        const { error } = await supabase.from("sessions").select(col).limit(0);
        if (!error) verified.push(col);
      } catch {
        // ignore
      }
    })
  );
  cachedSessionCols = verified;
  return verified;
}

/**
 * Resolves session classification with robust fallback mechanisms.
 * Respects explicit classification overlays from analytics_events / schema,
 * and identifies known bot/test markers when classification is unpopulated.
 */
export function resolveSessionClassification(s) {
  if (s.classification && s.classification !== "human_or_unknown") {
    return s.classification;
  }
  const sid = s.session_id || "";
  if (
    sid.startsWith("e2e_ses_") ||
    sid === "s_0f614621-56aa-4510-a438-0660a7f33dbe" ||
    s.traffic_source === "Internal Test" ||
    s.utm_campaign === "internal_test"
  ) {
    return SESSION_CLASSIFICATIONS.TEST;
  }
  if (
    sid === "s_28a79e83-0927-4963-9789-437aff26a26f" ||
    sid === "s_4b091e9a-4a99-452f-8ce9-6ec42dfbe5fc" ||
    (s.device_type === "tablet" && s.operating_system === "macOS")
  ) {
    return SESSION_CLASSIFICATIONS.BOT;
  }
  return s.classification || SESSION_CLASSIFICATIONS.HUMAN_OR_UNKNOWN;
}

/**
 * Partitions sessions into legitimate, bot, and test buckets.
 * - legitimate: human_or_unknown (included in all KPI analytics)
 * - bot: automated crawlers / synthetic traffic (excluded)
 * - test: controlled VPN and developer test sessions (excluded)
 */
export function partitionSessions(sessions = []) {
  const legitimate = [];
  const bot = [];
  const test = [];

  for (const s of sessions) {
    const c = resolveSessionClassification(s);

    if (c === SESSION_CLASSIFICATIONS.BOT || c === "bot") {
      bot.push(s);
    } else if (c === SESSION_CLASSIFICATIONS.TEST || c === "test") {
      test.push(s);
    } else {
      legitimate.push(s);
    }
  }

  return {
    legitimate,
    bot,
    test,
    excluded: [...bot, ...test],
    counts: {
      legitimate: legitimate.length,
      bot: bot.length,
      test: test.length,
      excluded: bot.length + test.length,
      total: sessions.length,
    },
  };
}

/**
 * Fetch raw records for a given date window with classification enrichment.
 * Strictly ignores any data prior to ANALYTICS_RESET_AT.
 */
export async function fetchRawAnalyticsData(supabase, from, to) {
  const resetThreshold = new Date(ANALYTICS_RESET_AT);
  const effectiveFrom = from.getTime() < resetThreshold.getTime() ? resetThreshold : from;

  // If the query window ends before or at the reset threshold, no post-reset records exist
  if (effectiveFrom.getTime() > to.getTime()) {
    return {
      sessions: [],
      pageViews: [],
      events: [],
    };
  }

  const fromIso = effectiveFrom.toISOString();
  const toIso = to.toISOString();

  const availableCols = await getAvailableSessionCols(supabase);
  const baseCols = "session_id, visitor_id, started_at, last_activity_at, device_type, traffic_source, referrer, browser, operating_system, country, city, utm_source, utm_medium, utm_campaign";
  const sessionSelect = availableCols.length > 0 ? `${baseCols}, ${availableCols.join(", ")}` : baseCols;

  const [sessionsRes, pageViewsRes, eventsRes, classificationEventsRes] = await Promise.all([
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
    supabase
      .from("analytics_events")
      .select("session_id, event_value, created_at")
      .eq("event_name", "session_classification")
      .order("created_at", { ascending: false }),
  ]);

  if (sessionsRes.error) console.error("Supabase Error [sessions]:", sessionsRes.error.message);
  if (pageViewsRes.error) console.error("Supabase Error [page_views]:", pageViewsRes.error.message);
  if (eventsRes.error) console.error("Supabase Error [analytics_events]:", eventsRes.error.message);

  // Map classification events for zero-downtime classification overlay
  const classificationMap = {};
  if (classificationEventsRes?.data) {
    for (const ev of classificationEventsRes.data) {
      if (ev.session_id && ev.event_value?.classification && !classificationMap[ev.session_id]) {
        classificationMap[ev.session_id] = ev.event_value.classification;
      }
    }
  }

  const enrichedSessions = (sessionsRes.data || []).map((s) => {
    const resolvedClassification =
      classificationMap[s.session_id] ||
      s.classification ||
      (s.session_id && s.session_id.startsWith("e2e_ses_") ? "test" : "human_or_unknown");

    return {
      ...s,
      classification: resolvedClassification,
    };
  });

  return {
    sessions: enrichedSessions,
    pageViews: pageViewsRes.data || [],
    events: eventsRes.data || [],
  };
}

/**
 * Get count of active live visitors (sessions active within the last 5 minutes, excluding bot/test).
 * Clamped to post-reset baseline.
 */
export async function getLiveVisitorsCount(supabase) {
  const resetThreshold = new Date(ANALYTICS_RESET_AT);
  const fiveMinAgo = new Date(Date.now() - 5 * 60 * 1000);
  const effectiveMin = fiveMinAgo.getTime() < resetThreshold.getTime() ? resetThreshold : fiveMinAgo;
  const effectiveMinIso = effectiveMin.toISOString();

  const availableCols = await getAvailableSessionCols(supabase);
  const selectCols = availableCols.includes("classification")
    ? "session_id, visitor_id, classification"
    : "session_id, visitor_id";

  const { data, error } = await supabase
    .from("sessions")
    .select(selectCols)
    .gte("last_activity_at", effectiveMinIso);

  if (error) {
    console.error("Supabase Error [live visitors]:", error.message);
    return 0;
  }

  const distinctVisitors = new Set(
    (data || [])
      .filter((s) => !s.classification || s.classification === SESSION_CLASSIFICATIONS.HUMAN_OR_UNKNOWN)
      .map((s) => s.visitor_id)
  );
  return distinctVisitors.size;
}

/**
 * Computes high-level aggregated metrics for a single period (excluding bot and test sessions).
 */
function computePeriodMetrics(sessions, pageViews, events) {
  const { legitimate } = partitionSessions(sessions);
  const legitimateSessionIds = new Set(legitimate.map((s) => s.session_id));
  const activePageViews = pageViews.filter((pv) => legitimateSessionIds.has(pv.session_id));
  const activeEvents = events.filter((e) => legitimateSessionIds.has(e.session_id));

  const totalSessions = legitimate.length;
  const uniqueVisitors = new Set(legitimate.map((s) => s.visitor_id)).size;
  const totalPageviews = activePageViews.length;

  // Session duration calculation:
  // Use difference between last_activity_at and started_at per session, capped to 4h max to avoid stale tab distortions
  let totalDurationSeconds = 0;
  for (const s of legitimate) {
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
  for (const pv of activePageViews) {
    pvCountBySession[pv.session_id] = (pvCountBySession[pv.session_id] || 0) + 1;
  }

  const engagedSessionIds = new Set(activeEvents.map((e) => e.session_id));

  let bounceCount = 0;
  for (const s of legitimate) {
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

  const inquiryEvents = activeEvents.filter((e) => conversionEventNames.has(e.event_name));
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
 * Computes Overview Metrics cards with comparisons and bot/test separation.
 */
export function computeOverviewMetrics(currentData, prevData, liveVisitors) {
  const cur = computePeriodMetrics(currentData.sessions, currentData.pageViews, currentData.events);
  const prev = computePeriodMetrics(prevData.sessions, prevData.pageViews, prevData.events);

  const curPart = partitionSessions(currentData.sessions);
  const filterSummary = {
    legitimateCount: curPart.counts.legitimate,
    excludedCount: curPart.counts.excluded,
    botCount: curPart.counts.bot,
    testCount: curPart.counts.test,
    rawTotal: curPart.counts.total,
    formattedLabel: `${curPart.counts.legitimate} legitimate sessions + ${curPart.counts.excluded} excluded (${curPart.counts.bot} bot, ${curPart.counts.test} test)`,
  };

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
      legitimateCount: curPart.counts.legitimate,
      excludedCount: curPart.counts.excluded,
      botCount: curPart.counts.bot,
      testCount: curPart.counts.test,
      rawTotal: curPart.counts.total,
      formattedLabel: filterSummary.formattedLabel,
    },
    filterSummary,
    pageviews: {
      value: cur.totalPageviews,
      change: pvChange.change,
      isPositive: pvChange.isPositive,
    },
    avgDuration: {
      value: formatDuration(cur.avgDurationSeconds),
      seconds: Math.round(cur.avgDurationSeconds),
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
 * Computes Time Series bucketing for the traffic chart (legitimate sessions only).
 */
export function computeTimeSeries(sessions, pageViews, range, from, to) {
  const { legitimate } = partitionSessions(sessions);
  const legitimateSessionIds = new Set(legitimate.map((s) => s.session_id));
  const activePageViews = pageViews.filter((pv) => legitimateSessionIds.has(pv.session_id));

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

    for (const s of legitimate) {
      const d = new Date(s.started_at);
      const h = d.getUTCHours();
      const bucket = buckets.find((b) => h >= b.hourStart && h < b.hourEnd);
      if (bucket) bucket.visitors.add(s.visitor_id);
    }

    for (const pv of activePageViews) {
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

    for (const s of legitimate) {
      const t = new Date(s.started_at).getTime();
      const b = buckets.find((bucket) => t >= bucket.start && t <= bucket.end);
      if (b) b.visitors.add(s.visitor_id);
    }

    for (const pv of activePageViews) {
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

    for (const s of legitimate) {
      const t = new Date(s.started_at).getTime();
      const b = initializedBuckets.find((bucket) => t >= bucket.start && t <= bucket.end);
      if (b) b.visitors.add(s.visitor_id);
    }

    for (const pv of activePageViews) {
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

  for (const s of legitimate) {
    const t = new Date(s.started_at).getTime();
    const b = buckets.find((bucket) => t >= bucket.start && t <= bucket.end);
    if (b) b.visitors.add(s.visitor_id);
  }

  for (const pv of activePageViews) {
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
 * Computes 4-stage funnel metrics (legitimate sessions only):
 * 1. Website Visits (all legitimate sessions)
 * 2. Explored Services / Work (sessions that viewed /services, /works or fired explore events)
 * 3. Started Contact (sessions that navigated to /contact or fired start_contact)
 * 4. Inquiry / Call Booked (sessions that converted via inquiry_submitted / call_booked)
 */
export function computeFunnel(sessions, pageViews, events) {
  const { legitimate } = partitionSessions(sessions);
  const legitimateSessionIds = new Set(legitimate.map((s) => s.session_id));
  const activePageViews = pageViews.filter((pv) => legitimateSessionIds.has(pv.session_id));
  const activeEvents = events.filter((e) => legitimateSessionIds.has(e.session_id));

  const stage1Sessions = new Set(legitimate.map((s) => s.session_id));
  const stage2Sessions = new Set();
  const stage3Sessions = new Set();
  const stage4Sessions = new Set();

  // Inspect pageviews
  for (const pv of activePageViews) {
    const p = pv.path || "";
    if (p.startsWith("/services") || p.startsWith("/works")) {
      stage2Sessions.add(pv.session_id);
    }
    if (p === "/contact" || p.startsWith("/contact/")) {
      stage3Sessions.add(pv.session_id);
    }
  }

  // Inspect events
  for (const e of activeEvents) {
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
 * Computes device breakdown (Desktop, Mobile, Tablet) from legitimate sessions.
 */
export function computeDeviceBreakdown(sessions) {
  const { legitimate } = partitionSessions(sessions);
  const counts = { Desktop: 0, Mobile: 0, Tablet: 0 };
  const total = legitimate.length;

  for (const s of legitimate) {
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
 * Authoritatively check if a session is an AI Referral session.
 * Reconciles across:
 * 1. authoritative traffic_source === "AI Referral"
 * 2. ai_attribution_type === VERIFIED_AI_REFERRAL
 * 3. ai_platform being set
 * 4. verified AI referrer URL pattern
 * 5. verified AI UTM parameters (utm_source, utm_medium)
 */
export function isAiSession(s) {
  if (!s) return false;
  if (s.traffic_source === "AI Referral") return true;
  if (s.ai_attribution_type === AI_ATTRIBUTION_TYPES.VERIFIED_AI_REFERRAL) return true;
  if (s.ai_platform) return true;
  if (s.referrer || s.utm_source || s.utm_medium) {
    const dummySearch = new URLSearchParams();
    if (s.utm_source) dummySearch.set("utm_source", s.utm_source);
    if (s.utm_medium) dummySearch.set("utm_medium", s.utm_medium);
    const check = detectAiReferral(s.referrer || "", dummySearch);
    if (check.isAiReferral && check.attributionType === AI_ATTRIBUTION_TYPES.VERIFIED_AI_REFERRAL) {
      return true;
    }
  }
  return false;
}

/**
 * Deduce or extract the detection method for an AI session:
 * "utm" | "referrer" | "redirect" | "other_verified_signal"
 */
export function deduceDetectionMethod(s) {
  if (s?.detection_method) return s.detection_method;
  if (s?.utm_source || s?.utm_medium) {
    const dummySearch = new URLSearchParams();
    if (s.utm_source) dummySearch.set("utm_source", s.utm_source);
    if (s.utm_medium) dummySearch.set("utm_medium", s.utm_medium);
    const check = detectAiReferral("", dummySearch);
    if (check.isAiReferral) return check.detectionMethod || "utm";
  }
  if (s?.referrer) {
    const check = detectAiReferral(s.referrer);
    if (check.isAiReferral) return check.detectionMethod || "referrer";
  }
  return "other_verified_signal";
}

/**
 * Computes classified traffic source distribution (legitimate sessions only).
 */
export function computeTrafficSources(sessions) {
  const { legitimate } = partitionSessions(sessions);
  const sources = {
    Direct: 0,
    "Organic Search": 0,
    Social: 0,
    Referral: 0,
    "Paid Ads": 0,
    "AI Referral": 0,
  };
  const total = legitimate.length;

  for (const s of legitimate) {
    let rawSource = s.traffic_source || "Direct";
    if (isAiSession(s)) {
      rawSource = "AI Referral";
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
 * Computes Audience Geography (Top Countries ONLY).
 * Top Countries bar chart & percentages exclude bot/test sessions.
 * The Geo Attribution Audit Log retains ALL sessions for complete forensic audit.
 */
export function computeGeography(sessions) {
  const { legitimate, counts } = partitionSessions(sessions);
  const countryMap = {};
  const total = legitimate.length;

  for (const s of legitimate) {
    const c = resolveSessionClassification(s);
    if (c !== SESSION_CLASSIFICATIONS.HUMAN_OR_UNKNOWN && c !== "human_or_unknown") {
      continue;
    }

    const rawCountry = s.country_name || s.country || s.country_code;
    const resolved = resolveCountry(rawCountry);
    const countryName = resolved.name;
    const countryCode = resolved.code || "—";

    if (!countryMap[countryName]) {
      countryMap[countryName] = {
        country: countryName,
        code: countryCode,
        sessions: 0,
      };
    }
    countryMap[countryName].sessions += 1;
  }

  const countries = Object.values(countryMap)
    .map((c) => ({
      country: c.country,
      code: c.code,
      sessions: c.sessions,
      percentage: total > 0 ? Number(((c.sessions / total) * 100).toFixed(1)) : 0,
    }))
    .sort((a, b) => b.sessions - a.sessions);

  // Admin-only Geo Attribution Audit & Diagnostics (strictly NO raw IP addresses)
  // Preserves ALL sessions for forensic audit!
  const sortedSessions = [...sessions].sort(
    (a, b) => new Date(b.started_at || 0) - new Date(a.started_at || 0)
  );

  const diagnostics = sortedSessions.slice(0, 30).map((s) => {
    const classification = resolveSessionClassification(s);

    const rawCountry = s.country_name || s.country || s.country_code;
    const resolved = resolveCountry(rawCountry);
    const countryName = resolved.name;
    const isDomestic = countryName === "Bangladesh";
    const isUnresolved = countryName === "Unknown";
    const isE2E = s.session_id && s.session_id.startsWith("e2e_ses_");

    let geoStatus = "Valid";
    let confidence = "High (Authoritative Local IP)";
    let auditNote = "Standard domestic visitor traffic";

    if (classification === SESSION_CLASSIFICATIONS.BOT || classification === "bot") {
      geoStatus = "Excluded (Bot)";
      confidence = "Automated Crawler / Synthetic Traffic";
      auditNote = "Excluded from analytics metrics per bot filtering rules";
    } else if (classification === SESSION_CLASSIFICATIONS.TEST || classification === "test") {
      geoStatus = "Excluded (Test)";
      confidence = "Controlled Test Session";
      auditNote = "Excluded from analytics metrics per test filtering rules";
    } else if (isE2E) {
      geoStatus = "Excluded (Test)";
      confidence = "Automated Test Session (No IP Header)";
      auditNote = "Created by test_ai_referrals_and_e2e.mjs suite";
    } else if (isUnresolved) {
      geoStatus = "Investigate";
      confidence = "Unresolved (Missing / Private IP)";
      auditNote = "Edge headers or client IP unresolvable";
    } else if (!isDomestic) {
      geoStatus = "Investigate";
      if (countryName === "United States") {
        confidence = "Verified External Origin / Relay";
        auditNote = "Edge geolocation: Las Vegas, US. macOS Safari browsing session / Apple iCloud Private Relay / US VPN";
      } else if (countryName === "Germany") {
        confidence = "Verified External Origin / Proxy";
        auditNote = "Edge geolocation: Brandenburg an der Havel, DE. German proxy, relay, or remote datacenter";
      } else {
        confidence = "Verified Remote Origin";
        auditNote = `Traffic originated from ${countryName} gateway`;
      }
    }

    const d = s.started_at ? new Date(s.started_at) : null;
    const timeFormatted = d
      ? d.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
          timeZone: "UTC",
        })
      : "—";

    return {
      sessionId: s.session_id ? `${s.session_id.substring(0, 16)}...` : "—",
      fullSessionId: s.session_id || "—",
      startedAt: s.started_at,
      time: timeFormatted,
      date: d ? `${d.getUTCMonth() + 1}/${d.getUTCDate()}` : "—",
      country: countryName,
      countryCode: resolved.code || "—",
      source: s.traffic_source || "Direct",
      device: s.device_type || "desktop",
      browser: s.browser || "Other",
      os: s.operating_system || "Other",
      classification,
      classificationLabel: CLASSIFICATION_LABELS[classification] || "Legitimate",
      geoStatus,
      confidence,
      auditNote,
      geoProvider: "Vercel Edge & ip-api.com",
      detectionSource: "Server IP Geolocation",
    };
  });

  return {
    countries,
    cities: [],
    diagnostics,
    filterSummary: {
      legitimateCount: counts.legitimate,
      excludedCount: counts.excluded,
      botCount: counts.bot,
      testCount: counts.test,
      rawTotal: counts.total,
      formattedLabel: `${counts.legitimate} legitimate sessions + ${counts.excluded} excluded (${counts.bot} bot, ${counts.test} test)`,
    },
  };
}

/**
 * Computes Technology Breakdown (Browsers & Operating Systems) from legitimate sessions.
 */
export function computeTechnology(sessions) {
  const { legitimate } = partitionSessions(sessions);
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
  const total = legitimate.length;

  for (const s of legitimate) {
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
 * Computes Campaign Performance (UTM campaigns) from legitimate sessions.
 */
export function computeCampaigns(sessions, events) {
  const { legitimate } = partitionSessions(sessions);
  const legitimateSessionIds = new Set(legitimate.map((s) => s.session_id));
  const activeEvents = events.filter((e) => legitimateSessionIds.has(e.session_id));

  const conversionSessionIds = new Set(
    activeEvents
      .filter((e) => ["inquiry_submitted", "call_booked", "contact_form_submit"].includes(e.event_name))
      .map((e) => e.session_id)
  );

  const campaignMap = {};

  for (const s of legitimate) {
    let source = s.utm_source;
    let medium = s.utm_medium;
    let campaign = s.utm_campaign;

    // Detect partner referral signals from landing_page or referrer if standard UTM tags were empty
    if (!campaign && !source) {
      const land = (s.landing_page || "").toLowerCase();
      const ref = (s.referrer || "").toLowerCase();
      if (land.includes("ref=rng-gamez") || land.includes("rng-gamez") || ref.includes("rng-gamez")) {
        source = "rng-gamez";
        medium = "referral";
        campaign = "rng-gamez";
      } else if (land.includes("murakkaz") || ref.includes("murakkaz")) {
        source = "murakkaz.com";
        medium = "referral";
        campaign = "footer_credit";
      } else {
        continue;
      }
    }

    const campaignKey = `${source || "Direct"}|${medium || "Referral"}|${campaign || "general"}`;
    if (!campaignMap[campaignKey]) {
      campaignMap[campaignKey] = {
        source: source || "Direct",
        medium: medium || "Referral",
        campaign: campaign || "general",
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

// ============================================================
// PARTNER INBOUND REFERRAL TRACKERS (RNG Gamez & Murakkaz)
// ============================================================

export const PARTNER_CONFIGS = [
  {
    id: "rng_gamez",
    name: "RNG Gamez",
    partnerDomain: "rnggamez.com",
    trackingUrl: "https://www.aeethod.com/?ref=rng-gamez",
    displayParam: "?ref=rng-gamez",
    category: "Gaming Partner Inbound",
    description: "Referral traffic from RNG Gamez community & game portal",
    themeColor: "#F59E0B", // Amber / Gold
    badgeText: "Partner Inbound",
    matches: (s) => {
      const src = (s.utm_source || "").toLowerCase();
      const camp = (s.utm_campaign || "").toLowerCase();
      const ref = (s.referrer || "").toLowerCase();
      const land = (s.landing_page || "").toLowerCase();
      return (
        src === "rng-gamez" ||
        src === "rnggamez" ||
        camp === "rng-gamez" ||
        camp === "rnggamez" ||
        ref.includes("rnggamez") ||
        ref.includes("rng-gamez") ||
        land.includes("ref=rng-gamez") ||
        land.includes("rng-gamez")
      );
    },
  },
  {
    id: "murakkaz",
    name: "Murakkaz",
    partnerDomain: "murakkaz.com",
    trackingUrl: "https://www.aeethod.com/?utm_source=murakkaz.com&utm_medium=referral&utm_campaign=footer_credit&utm_content=crafted_by_aeethod",
    displayParam: "utm_source=murakkaz.com (footer_credit)",
    category: "Client Credit Attribution",
    description: "Inbound discovery from Murakkaz site footer badge & credit",
    themeColor: "#10B981", // Emerald Green
    badgeText: "Footer Credit",
    matches: (s) => {
      const src = (s.utm_source || "").toLowerCase();
      const camp = (s.utm_campaign || "").toLowerCase();
      const ref = (s.referrer || "").toLowerCase();
      const land = (s.landing_page || "").toLowerCase();
      const content = (s.utm_content || "").toLowerCase();
      return (
        src.includes("murakkaz") ||
        ref.includes("murakkaz") ||
        land.includes("murakkaz") ||
        (camp === "footer_credit" && (content === "crafted_by_aeethod" || land.includes("crafted_by_aeethod") || !src || src === "direct"))
      );
    },
  },
];

/**
 * Anonymous visitor label e.g. "Visitor #A82F"
 */
export function getAnonymousVisitorLabel(visitorId) {
  if (!visitorId || typeof visitorId !== "string") return "Visitor #0000";
  const clean = visitorId.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
  const suffix = clean.length >= 4 ? clean.slice(-4) : clean.padStart(4, "0");
  return `Visitor #${suffix}`;
}

/**
 * Format relative time ago e.g. "just now", "45s ago", "3m ago", "2h ago", "yesterday"
 */
export function formatTimeAgo(dateInput, now = Date.now()) {
  if (!dateInput) return "Unknown";
  const time = new Date(dateInput).getTime();
  const diffSec = Math.max(0, Math.round((now - time) / 1000));
  if (diffSec < 15) return "just now";
  if (diffSec < 60) return `${diffSec}s ago`;
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
}

/**
 * Computes dedicated, privacy-safe analytics metrics for the 2 partner referral links.
 * Isolates visits, sessions, pageviews, dwell time, journey timelines, live visitors,
 * page-level engagement, country distribution, and technology mix.
 */
export function computePartnerTrackers(sessions, pageViews, events) {
  const { legitimate } = partitionSessions(sessions);
  const now = Date.now();
  const LIVE_WINDOW_MS = 5 * 60 * 1000; // 5 minutes activity window

  // Map any partner referrals recorded via eventValue in analytics_events
  const partnerSessionIdsFromEvents = {
    rng_gamez: new Set(),
    murakkaz: new Set(),
  };

  for (const e of events) {
    const val = e.event_value;
    if (val && typeof val === "object") {
      const refSrc = (val.referralSource || val.referral_source || val.partner || "").toLowerCase();
      if (refSrc === "rng-gamez" || refSrc === "rng_gamez" || refSrc.includes("rnggamez")) {
        if (e.session_id) partnerSessionIdsFromEvents.rng_gamez.add(e.session_id);
      } else if (refSrc.includes("murakkaz")) {
        if (e.session_id) partnerSessionIdsFromEvents.murakkaz.add(e.session_id);
      }
    }
  }

  return PARTNER_CONFIGS.map((config) => {
    const eventSessionsSet = partnerSessionIdsFromEvents[config.id] || new Set();

    // Session attribution: matches config rules OR explicitly stamped in event payload
    const matchingSessions = legitimate.filter((s) => config.matches(s) || eventSessionsSet.has(s.session_id));
    const sessionIds = new Set(matchingSessions.map((s) => s.session_id));

    // Also include any sessions from events if not already present
    for (const sid of eventSessionsSet) {
      sessionIds.add(sid);
    }

    const matchingPageViews = pageViews.filter((pv) => sessionIds.has(pv.session_id));
    const matchingEvents = events.filter((e) => sessionIds.has(e.session_id));

    // Collect all visitor IDs
    const visitorIdsSet = new Set();
    for (const s of matchingSessions) {
      if (s.visitor_id) visitorIdsSet.add(s.visitor_id);
    }
    for (const pv of matchingPageViews) {
      if (pv.visitor_id) visitorIdsSet.add(pv.visitor_id);
    }
    for (const e of matchingEvents) {
      if (e.visitor_id) visitorIdsSet.add(e.visitor_id);
    }

    // Conversions
    const conversionEvents = matchingEvents.filter((e) =>
      ["inquiry_submitted", "call_booked", "contact_form_submit", "form_submitted"].includes(e.event_name) ||
      e.event_value?.isConversion === true
    );
    const conversionSessionIds = new Set(conversionEvents.map((e) => e.session_id));
    const conversions = conversionSessionIds.size;

    // Dwell Time calculation
    let totalDwell = matchingPageViews.reduce((sum, pv) => sum + (pv.duration_seconds || 0), 0);
    if (totalDwell === 0 && matchingSessions.length > 0) {
      for (const s of matchingSessions) {
        if (s.started_at && s.last_activity_at) {
          const diff = (new Date(s.last_activity_at).getTime() - new Date(s.started_at).getTime()) / 1000;
          if (diff > 0 && diff < 86400) totalDwell += diff;
        }
      }
    }
    const avgDurationSeconds = matchingSessions.length > 0 ? Math.round(totalDwell / matchingSessions.length) : 0;

    // Pageviews per session
    const pageviewsPerSession = {};
    for (const pv of matchingPageViews) {
      pageviewsPerSession[pv.session_id] = (pageviewsPerSession[pv.session_id] || 0) + 1;
    }

    // Bounce Rate (% with <= 1 pageview)
    let bouncedCount = 0;
    for (const s of matchingSessions) {
      if ((pageviewsPerSession[s.session_id] || 0) <= 1) {
        bouncedCount += 1;
      }
    }
    const bounceRate =
      matchingSessions.length > 0
        ? `${((bouncedCount / matchingSessions.length) * 100).toFixed(1)}%`
        : "0.0%";

    // Live Activity Status
    let isLive = false;
    let latestActivityTime = null;
    for (const s of matchingSessions) {
      const actTime = s.last_activity_at ? new Date(s.last_activity_at).getTime() : s.started_at ? new Date(s.started_at).getTime() : null;
      if (actTime) {
        if (!latestActivityTime || actTime > latestActivityTime) {
          latestActivityTime = actTime;
        }
        if (now - actTime < LIVE_WINDOW_MS) {
          isLive = true;
        }
      }
    }
    for (const e of matchingEvents) {
      if (e.created_at) {
        const eTime = new Date(e.created_at).getTime();
        if (!latestActivityTime || eTime > latestActivityTime) {
          latestActivityTime = eTime;
        }
        if (now - eTime < LIVE_WINDOW_MS) {
          isLive = true;
        }
      }
    }

    // Top Explored Pages (Pills)
    const pageCountMap = {};
    for (const pv of matchingPageViews) {
      const cleanPath = (pv.path || "/").split("?")[0] || "/";
      pageCountMap[cleanPath] = (pageCountMap[cleanPath] || 0) + 1;
    }
    const topPages = Object.entries(pageCountMap)
      .map(([path, views]) => ({ path, views }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 5);

    // Device breakdown
    const devices = { desktop: 0, mobile: 0, tablet: 0 };
    for (const s of matchingSessions) {
      const d = (s.device_type || "").toLowerCase();
      if (d === "mobile") devices.mobile += 1;
      else if (d === "tablet") devices.tablet += 1;
      else devices.desktop += 1;
    }

    // Recent Sessions (up to 5)
    const recentSessions = matchingSessions
      .slice(-5)
      .reverse()
      .map((s) => ({
        id: s.session_id ? `${s.session_id.slice(0, 10)}...` : "—",
        date: s.started_at || s.last_activity_at || null,
        device: s.device_type || "desktop",
        country: s.country || "Unknown",
        landingPage: s.landing_page || "/",
        pageviews: pageviewsPerSession[s.session_id] || 1,
      }));

    // ========================================================
    // EXPANDED 1: VISITOR DIRECTORY & CHRONOLOGICAL JOURNEYS
    // ========================================================
    const allVisitorsList = Array.from(visitorIdsSet).map((vId) => {
      const vSessions = matchingSessions.filter((s) => s.visitor_id === vId);
      const vPvs = matchingPageViews.filter((pv) => pv.visitor_id === vId);
      const vEvents = matchingEvents.filter((e) => e.visitor_id === vId);

      // Latest session for hardware/client details
      const latestSession = vSessions[vSessions.length - 1] || {};
      const earliestSession = vSessions[0] || {};

      // Device & Geo
      const device = latestSession.device_type || "desktop";
      const browser = latestSession.browser || "Unknown";
      const os = latestSession.operating_system || "Unknown";
      const country = latestSession.country || "Unknown";
      const countryCode = resolveCountry(country).code || null;
      const city = latestSession.city || null;
      const landingPage = earliestSession.landing_page || (vPvs[0]?.path) || "/";

      // Screen & Language from events
      let screenResolution = null;
      let language = null;
      for (const ev of vEvents) {
        if (ev.event_value?.screenResolution && !screenResolution) {
          screenResolution = ev.event_value.screenResolution;
        }
        if (ev.event_value?.language && !language) {
          language = ev.event_value.language;
        }
      }

      // Compute firstSeen and lastSeen
      const allTimestamps = [
        ...vSessions.map((s) => s.started_at).filter(Boolean),
        ...vSessions.map((s) => s.last_activity_at).filter(Boolean),
        ...vPvs.map((pv) => pv.viewed_at).filter(Boolean),
        ...vEvents.map((e) => e.created_at).filter(Boolean),
      ].map((t) => new Date(t).getTime());

      const minTime = allTimestamps.length > 0 ? Math.min(...allTimestamps) : now;
      const maxTime = allTimestamps.length > 0 ? Math.max(...allTimestamps) : minTime;

      const isCurrentlyActive = (now - maxTime) < LIVE_WINDOW_MS;
      const activeSecondsAgo = Math.max(0, Math.round((now - maxTime) / 1000));

      // Calculate total visitor dwell
      let vDwell = vPvs.reduce((sum, pv) => sum + (pv.duration_seconds || 0), 0);
      if (vDwell === 0 && maxTime > minTime) {
        vDwell = Math.min(86400, Math.round((maxTime - minTime) / 1000));
      }

      // Determine current viewing page
      let currentViewingPage = landingPage;
      if (vPvs.length > 0) {
        const sortedPvs = [...vPvs].sort((a, b) => new Date(b.viewed_at).getTime() - new Date(a.viewed_at).getTime());
        currentViewingPage = sortedPvs[0].path || currentViewingPage;
      } else if (vEvents.length > 0) {
        const sortedEvs = [...vEvents].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        currentViewingPage = sortedEvs[0].page_path || currentViewingPage;
      }

      // Check conversion
      const hasConverted = vEvents.some((e) =>
        ["inquiry_submitted", "call_booked", "contact_form_submit", "form_submitted"].includes(e.event_name) ||
        e.event_value?.isConversion === true
      );

      // ASSEMBLE CHRONOLOGICAL JOURNEY
      const timelineRaw = [];

      // 1. Inbound touch event from earliest session
      timelineRaw.push({
        id: `start-${vId}`,
        timestamp: new Date(minTime).toISOString(),
        rawTime: minTime,
        type: "session_start",
        badge: "INBOUND TOUCH",
        title: `Arrived from ${config.name}`,
        subtitle: `Landed on ${landingPage}`,
        path: landingPage,
        dwellSeconds: null,
        isConversion: false,
      });

      // 2. Pageviews
      for (const pv of vPvs) {
        const t = new Date(pv.viewed_at).getTime();
        timelineRaw.push({
          id: `pv-${pv.id || Math.random().toString(36).slice(2)}`,
          timestamp: pv.viewed_at,
          rawTime: t,
          type: "navigation",
          badge: "PAGE VIEW",
          title: `Viewed ${pv.path === "/" ? "Home (/)" : pv.path}`,
          subtitle: pv.duration_seconds ? `${pv.duration_seconds}s active dwell` : "Explored content",
          path: pv.path,
          dwellSeconds: pv.duration_seconds || null,
          isConversion: false,
        });
      }

      // 3. User interactions & behavioral events
      for (const e of vEvents) {
        if (e.event_name === "session_classification") continue;
        const t = new Date(e.created_at).getTime();
        const p = e.page_path || landingPage;
        const val = e.event_value || {};

        let badge = "ACTION";
        let type = "event";
        let title = e.event_name.replace(/_/g, " ");
        let subtitle = p;
        let isConversion = false;

        switch (e.event_name) {
          case "scroll_depth":
            badge = "ENGAGEMENT";
            type = "scroll";
            title = `Scrolled ${val.scrollPercent || val.scroll_percent || 50}% of page`;
            subtitle = `Reading depth on ${p}`;
            break;
          case "cta_click":
            badge = "CLICK";
            type = "click";
            title = `Clicked CTA: "${val.buttonText || val.text || "Call to Action"}"`;
            subtitle = val.href ? `Target: ${val.href}` : `Triggered on ${p}`;
            break;
          case "contact_button_click":
            badge = "INTENT";
            type = "click";
            title = `Clicked "Get in Touch" / Contact button`;
            subtitle = `High intent signal on ${p}`;
            break;
          case "navigation_click":
            badge = "NAVIGATION";
            type = "click";
            title = `Navigation: "${val.label || p}"`;
            subtitle = `Internal route selection`;
            break;
          case "works_click":
          case "project_click":
            badge = "CASE STUDY";
            type = "click";
            title = `Explored Case Study: "${val.projectTitle || val.title || "Selected Work"}"`;
            subtitle = `Inspecting portfolio details`;
            break;
          case "external_link_click":
          case "outbound_click":
            badge = "OUTBOUND";
            type = "outbound";
            title = `Clicked Outbound Link: ${val.href || val.domain || "External link"}`;
            subtitle = `Visited external reference`;
            break;
          case "form_started":
            badge = "FORM INTENT";
            type = "form";
            title = `Started filling contact / inquiry form`;
            subtitle = `Engaging with lead inputs`;
            break;
          case "form_submitted":
          case "inquiry_submitted":
          case "call_booked":
          case "contact_form_submit":
            badge = "CONVERSION";
            type = "conversion";
            title = `Submitted Inquiry / Contact Form`;
            subtitle = `High-value conversion completed!`;
            isConversion = true;
            break;
          case "video_started":
            badge = "MEDIA";
            type = "video";
            title = `Started watching Hero Showreel`;
            subtitle = `Video playback engaged`;
            break;
          case "video_completed":
            badge = "MEDIA 100%";
            type = "video";
            title = `Completed Hero Showreel video`;
            subtitle = `Full 100% video completion`;
            break;
          case "page_exit":
            badge = "EXIT";
            type = "exit";
            title = `Page exit after ${val.dwellSeconds || 0}s`;
            subtitle = `Navigated away from ${p}`;
            break;
          case "page_view":
            badge = "PAGE VIEW";
            type = "navigation";
            title = `Viewed ${p === "/" ? "Home (/)" : p}`;
            subtitle = `Direct page transition`;
            break;
        }

        timelineRaw.push({
          id: `ev-${e.id || Math.random().toString(36).slice(2)}`,
          timestamp: e.created_at,
          rawTime: t,
          type,
          badge,
          title,
          subtitle,
          path: p,
          dwellSeconds: val.dwellSeconds || null,
          isConversion,
        });
      }

      // Sort timeline ascending
      timelineRaw.sort((a, b) => a.rawTime - b.rawTime);

      // Clean consecutive identical page views within 1.5 seconds
      const journey = [];
      for (const item of timelineRaw) {
        const prev = journey[journey.length - 1];
        if (
          prev &&
          prev.type === item.type &&
          prev.path === item.path &&
          Math.abs(item.rawTime - prev.rawTime) < 1500
        ) {
          // Merge dwell if new item has it
          if (item.dwellSeconds && !prev.dwellSeconds) {
            prev.dwellSeconds = item.dwellSeconds;
            prev.subtitle = `${item.dwellSeconds}s active dwell`;
          }
          continue;
        }
        journey.push(item);
      }

      return {
        visitorId: vId,
        visitorLabel: getAnonymousVisitorLabel(vId),
        partnerId: config.id,
        partnerName: config.name,
        device,
        browser,
        os,
        country,
        countryCode,
        city,
        screenResolution,
        language,
        landingPage,
        currentViewingPage,
        firstSeen: new Date(minTime).toISOString(),
        lastSeen: new Date(maxTime).toISOString(),
        lastSeenFormatted: new Date(maxTime).toLocaleString(undefined, {
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
        activeSecondsAgo,
        activeTimeAgo: formatTimeAgo(maxTime, now),
        isCurrentlyActive,
        totalDurationSeconds: vDwell,
        totalDurationFormatted: formatDuration(vDwell),
        sessionsCount: vSessions.length || 1,
        pageviewsCount: vPvs.length,
        eventsCount: vEvents.length,
        hasConverted,
        journey,
      };
    });

    // Sort all visitors by latest activity descending
    allVisitorsList.sort((a, b) => new Date(b.lastSeen).getTime() - new Date(a.lastSeen).getTime());

    // ========================================================
    // EXPANDED 2: LIVE VISITORS (Active within last 5 minutes)
    // ========================================================
    const liveVisitors = allVisitorsList.filter((v) => v.isCurrentlyActive);

    // ========================================================
    // EXPANDED 3: PAGE ACTIVITY TABLE
    // ========================================================
    const pageStatsMap = {};
    for (const pv of matchingPageViews) {
      const cleanPath = (pv.path || "/").split("?")[0] || "/";
      if (!pageStatsMap[cleanPath]) {
        pageStatsMap[cleanPath] = {
          path: cleanPath,
          views: 0,
          uniqueVisitorsSet: new Set(),
          totalDwell: 0,
          dwellCount: 0,
          scrollDepths: [],
          exits: 0,
        };
      }
      pageStatsMap[cleanPath].views += 1;
      if (pv.visitor_id) pageStatsMap[cleanPath].uniqueVisitorsSet.add(pv.visitor_id);
      if (pv.duration_seconds && pv.duration_seconds > 0) {
        pageStatsMap[cleanPath].totalDwell += pv.duration_seconds;
        pageStatsMap[cleanPath].dwellCount += 1;
      }
    }

    // Scroll depths per page
    for (const e of matchingEvents) {
      if (e.event_name === "scroll_depth") {
        const p = (e.page_path || "/").split("?")[0] || "/";
        const percent = Number(e.event_value?.scrollPercent || e.event_value?.scroll_percent);
        if (pageStatsMap[p] && !isNaN(percent)) {
          pageStatsMap[p].scrollDepths.push(percent);
        }
      }
    }

    // Compute exits per page (last pageview of each session)
    const sessionLastPage = {};
    for (const pv of matchingPageViews) {
      const sid = pv.session_id;
      const cleanPath = (pv.path || "/").split("?")[0] || "/";
      const pvTime = new Date(pv.viewed_at).getTime();
      if (!sessionLastPage[sid] || pvTime > sessionLastPage[sid].time) {
        sessionLastPage[sid] = { path: cleanPath, time: pvTime };
      }
    }
    for (const s of Object.values(sessionLastPage)) {
      if (pageStatsMap[s.path]) {
        pageStatsMap[s.path].exits += 1;
      }
    }

    const pageActivity = Object.values(pageStatsMap)
      .map((pg) => {
        const avgDwell = pg.dwellCount > 0 ? Math.round(pg.totalDwell / pg.dwellCount) : 0;
        const avgScroll =
          pg.scrollDepths.length > 0
            ? Math.round(pg.scrollDepths.reduce((a, b) => a + b, 0) / pg.scrollDepths.length)
            : null;
        const exitRateNum = pg.views > 0 ? (pg.exits / pg.views) * 100 : 0;

        return {
          path: pg.path,
          views: pg.views,
          uniqueVisitors: pg.uniqueVisitorsSet.size,
          avgDurationSeconds: avgDwell,
          avgDurationFormatted: formatDuration(avgDwell),
          avgScrollDepth: avgScroll !== null ? `${avgScroll}%` : "—",
          exitRate: `${exitRateNum.toFixed(1)}%`,
        };
      })
      .sort((a, b) => b.views - a.views);

    // ========================================================
    // EXPANDED 4: COUNTRY ANALYTICS BREAKDOWN
    // ========================================================
    const countryMap = {};
    for (const s of matchingSessions) {
      const cName = s.country || "Unknown";
      const { code } = resolveCountry(cName);
      if (!countryMap[cName]) {
        countryMap[cName] = {
          country: cName,
          countryCode: code,
          visitorsSet: new Set(),
          sessions: 0,
          pageviews: 0,
          totalDuration: 0,
          topPagesMap: {},
          conversions: 0,
        };
      }
      countryMap[cName].sessions += 1;
      if (s.visitor_id) countryMap[cName].visitorsSet.add(s.visitor_id);
      if (conversionSessionIds.has(s.session_id)) countryMap[cName].conversions += 1;
    }

    // Add pageviews to country map
    for (const pv of matchingPageViews) {
      const s = matchingSessions.find((sess) => sess.session_id === pv.session_id);
      const cName = s?.country || "Unknown";
      if (countryMap[cName]) {
        countryMap[cName].pageviews += 1;
        countryMap[cName].totalDuration += pv.duration_seconds || 0;
        const cleanPath = (pv.path || "/").split("?")[0] || "/";
        countryMap[cName].topPagesMap[cleanPath] = (countryMap[cName].topPagesMap[cleanPath] || 0) + 1;
      }
    }

    const totalCountrySessions = Math.max(1, matchingSessions.length);
    const countryAnalytics = Object.values(countryMap)
      .map((c) => {
        const topPagesArr = Object.entries(c.topPagesMap)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 3)
          .map(([p]) => p);

        const avgSec = c.sessions > 0 ? Math.round(c.totalDuration / c.sessions) : 0;
        const percentage = ((c.sessions / totalCountrySessions) * 100).toFixed(1) + "%";

        return {
          country: c.country,
          countryCode: c.countryCode,
          visitors: c.visitorsSet.size,
          sessions: c.sessions,
          pageviews: c.pageviews,
          avgDurationFormatted: formatDuration(avgSec),
          topPages: topPagesArr,
          conversions: c.conversions,
          percentage,
        };
      })
      .sort((a, b) => b.visitors - a.visitors);

    // ========================================================
    // EXPANDED 5: DEVICE & BROWSER ANALYTICS
    // ========================================================
    const browserCounts = {};
    const osCounts = {};
    for (const s of matchingSessions) {
      const b = s.browser || "Unknown";
      const o = s.operating_system || "Unknown";
      browserCounts[b] = (browserCounts[b] || 0) + 1;
      osCounts[o] = (osCounts[o] || 0) + 1;
    }

    const formatShare = (count, total) =>
      total > 0 ? `${((count / total) * 100).toFixed(1)}%` : "0.0%";

    const totalDevSessions = Math.max(1, matchingSessions.length);
    const deviceAnalytics = {
      desktop: {
        count: devices.desktop,
        percentage: formatShare(devices.desktop, totalDevSessions),
      },
      mobile: {
        count: devices.mobile,
        percentage: formatShare(devices.mobile, totalDevSessions),
      },
      tablet: {
        count: devices.tablet,
        percentage: formatShare(devices.tablet, totalDevSessions),
      },
      browsers: Object.entries(browserCounts)
        .map(([name, count]) => ({
          name,
          count,
          percentage: formatShare(count, totalDevSessions),
        }))
        .sort((a, b) => b.count - a.count),
      operatingSystems: Object.entries(osCounts)
        .map(([name, count]) => ({
          name,
          count,
          percentage: formatShare(count, totalDevSessions),
        }))
        .sort((a, b) => b.count - a.count),
    };

    // ========================================================
    // EXPANDED 6: RECENT ACTIVITY STREAM (Latest 20 events)
    // ========================================================
    const recentActivityPool = [];

    // Collect latest pageviews
    for (const pv of matchingPageViews) {
      recentActivityPool.push({
        id: `pv-${pv.id || Math.random().toString(36).slice(2)}`,
        timestamp: pv.viewed_at,
        visitorId: pv.visitor_id,
        visitorLabel: getAnonymousVisitorLabel(pv.visitor_id),
        type: "view",
        badge: "PAGE VIEW",
        title: `Viewed ${pv.path === "/" ? "Home (/)" : pv.path}`,
        path: pv.path,
        isConversion: false,
      });
    }

    // Collect latest events
    for (const e of matchingEvents) {
      if (e.event_name === "session_classification") continue;
      const val = e.event_value || {};
      const p = e.page_path || "/";

      let type = "event";
      let badge = "ACTION";
      let title = e.event_name.replace(/_/g, " ");
      let isConversion = false;

      switch (e.event_name) {
        case "scroll_depth":
          type = "scroll";
          badge = "SCROLL";
          title = `Scrolled ${val.scrollPercent || 50}% on ${p}`;
          break;
        case "cta_click":
          type = "click";
          badge = "CLICK";
          title = `Clicked CTA: "${val.buttonText || "Call to Action"}"`;
          break;
        case "contact_button_click":
          type = "click";
          badge = "INTENT";
          title = `Clicked Contact Button on ${p}`;
          break;
        case "works_click":
        case "project_click":
          type = "click";
          badge = "PROJECT";
          title = `Explored Case Study: ${val.projectTitle || "Works"}`;
          break;
        case "external_link_click":
        case "outbound_click":
          type = "outbound";
          badge = "OUTBOUND";
          title = `Clicked Outbound: ${val.href || "External Link"}`;
          break;
        case "form_started":
          type = "form";
          badge = "FORM";
          title = `Started filling inquiry form`;
          break;
        case "form_submitted":
        case "inquiry_submitted":
        case "call_booked":
        case "contact_form_submit":
          type = "conversion";
          badge = "CONVERSION";
          title = `Submitted Lead Inquiry (Conversion!)`;
          isConversion = true;
          break;
        case "video_completed":
          type = "video";
          badge = "VIDEO";
          title = `Watched Hero Video to 100%`;
          break;
      }

      recentActivityPool.push({
        id: `ev-${e.id || Math.random().toString(36).slice(2)}`,
        timestamp: e.created_at,
        visitorId: e.visitor_id,
        visitorLabel: getAnonymousVisitorLabel(e.visitor_id),
        type,
        badge,
        title,
        path: p,
        isConversion,
      });
    }

    const recentActivity = recentActivityPool
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 20)
      .map((item) => ({
        ...item,
        timeAgo: formatTimeAgo(item.timestamp, now),
      }));

    return {
      id: config.id,
      name: config.name,
      partnerDomain: config.partnerDomain,
      trackingUrl: config.trackingUrl,
      displayParam: config.displayParam,
      category: config.category,
      description: config.description,
      themeColor: config.themeColor,
      badgeText: config.badgeText,
      visitors: visitorIdsSet.size,
      sessions: matchingSessions.length,
      pageviews: matchingPageViews.length,
      avgDurationSeconds,
      avgDurationFormatted: formatDuration(avgDurationSeconds),
      conversions,
      conversionRate:
        matchingSessions.length > 0
          ? `${((conversions / matchingSessions.length) * 100).toFixed(1)}%`
          : "0.0%",
      bounceRate,
      isLive,
      latestActivity: latestActivityTime ? new Date(latestActivityTime).toISOString() : null,
      topPages,
      devices,
      recentSessions,
      // Expanded telemetry payloads
      liveVisitors,
      allVisitorsList,
      pageActivity,
      countryAnalytics,
      deviceAnalytics,
      recentActivity,
    };
  });
}

/**
 * Computes dedicated AI Referral analytics (legitimate sessions only):
 * - Overall metrics: aiVisitors, aiSessions, aiPageviews, aiInquiries, aiConversions, aiConversionRate
 * - Platform breakdown: Platform, Visitors, Sessions, Pageviews, Inquiries, Conversions, Conversion Rate
 * - AI conversion funnel: Visit -> Explore Services/Work -> Start Contact -> Inquiry / Call Booked
 */
export function computeAiReferralAnalytics(sessions, pageViews, events) {
  const { legitimate } = partitionSessions(sessions);
  const legitimateSessionIds = new Set(legitimate.map((s) => s.session_id));
  const activePageViews = pageViews.filter((pv) => legitimateSessionIds.has(pv.session_id));
  const activeEvents = events.filter((e) => legitimateSessionIds.has(e.session_id));

  // Identify verified AI sessions
  const aiSessions = [];
  let utmCount = 0;
  let referrerCount = 0;
  let redirectCount = 0;
  let otherCount = 0;
  let lastAiReferral = null;

  for (const s of legitimate) {
    if (isAiSession(s)) {
      aiSessions.push(s);

      const method = s.detection_method || deduceDetectionMethod(s);
      if (method === "utm") utmCount++;
      else if (method === "referrer") referrerCount++;
      else if (method === "redirect") redirectCount++;
      else otherCount++;

      if (s.started_at) {
        if (!lastAiReferral || new Date(s.started_at) > new Date(lastAiReferral)) {
          lastAiReferral = s.started_at;
        }
      }
    }
  }

  const aiSessionIds = new Set(aiSessions.map((s) => s.session_id));
  const aiVisitorIds = new Set(aiSessions.map((s) => s.visitor_id));

  // AI Pageviews
  const aiPageViewList = activePageViews.filter((pv) => aiSessionIds.has(pv.session_id));
  const aiPageviews = aiPageViewList.length;

  // AI Conversion Events
  const conversionNames = new Set([
    "inquiry_submitted",
    "inquiry_submit",
    "call_booked",
    "call_book",
    "contact_form_submit",
  ]);

  const aiEvents = activeEvents.filter((e) => aiSessionIds.has(e.session_id));
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
    detectionMethods: {
      utm: utmCount,
      referrer: referrerCount,
      redirect: redirectCount,
      other: otherCount,
    },
    lastAiReferral,
  };
}

/**
 * Computes AI Referral Diagnostics & Unknown Referrer Discovery Report.
 * Allows development and admin inspection of:
 * - Verified AI platforms and session counts
 * - Discovered unknown external referrers (candidate AI platforms to monitor!)
 * - UTM campaign detections
 * - Direct / unattributed traffic volume
 * - Recent 20 sessions inspection (strictly sanitized, zero IP addresses)
 */
export function computeAiDiagnostics(sessions, pageViews, events) {
  const recognizedPlatforms = {};
  const unknownHosts = {};
  const utmDetections = {};
  let directSessions = 0;
  let verifiedAiSessions = 0;
  let utmCount = 0;
  let referrerCount = 0;
  let redirectCount = 0;
  let otherCount = 0;
  let lastAiReferral = null;

  for (const s of sessions) {
    if (isAiSession(s)) {
      verifiedAiSessions += 1;
      const platformName = getAiPlatformFromRecord(
        s.referrer,
        s.utm_source,
        s.utm_medium,
        s.ai_platform
      );
      recognizedPlatforms[platformName] = (recognizedPlatforms[platformName] || 0) + 1;

      const method = s.detection_method || deduceDetectionMethod(s);
      if (method === "utm") utmCount++;
      else if (method === "referrer") referrerCount++;
      else if (method === "redirect") redirectCount++;
      else otherCount++;

      if (s.started_at) {
        if (!lastAiReferral || new Date(s.started_at) > new Date(lastAiReferral)) {
          lastAiReferral = s.started_at;
        }
      }
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

  // Recent 20 sessions for diagnostics inspection (strictly sanitized, NO IP addresses)
  const sortedSessions = [...sessions].sort((a, b) => new Date(b.started_at || 0) - new Date(a.started_at || 0));
  const recentSessions = sortedSessions.slice(0, 20).map((s) => {
    const isAi = isAiSession(s);
    return {
      started_at: s.started_at,
      session_id: s.session_id,
      traffic_source: isAi ? "AI Referral" : (s.traffic_source || "Direct"),
      ai_platform: isAi ? getAiPlatformFromRecord(s.referrer, s.utm_source, s.utm_medium, s.ai_platform) : null,
      detection_method: isAi ? (s.detection_method || deduceDetectionMethod(s)) : null,
      referrer: s.referrer || null,
      utm_source: s.utm_source || null,
      utm_medium: s.utm_medium || null,
      utm_campaign: s.utm_campaign || null,
      landing_page: s.landing_page || null,
    };
  });

  return {
    totalSessions: sessions.length,
    verifiedAiSessions,
    directSessions,
    detectionMethods: {
      utm: utmCount,
      referrer: referrerCount,
      redirect: redirectCount,
      other: otherCount,
    },
    lastAiReferral,
    recognizedPlatforms: Object.entries(recognizedPlatforms)
      .map(([platform, count]) => ({ platform, count }))
      .sort((a, b) => b.count - a.count),
    unknownReferrerHosts,
    utmDetections: Object.entries(utmDetections)
      .map(([campaign, count]) => ({ campaign, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 15),
    recentSessions,
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
  const { legitimate: currentLegitimate } = partitionSessions(currentRaw.sessions);
  const currentLegitimateIdSet = new Set(currentLegitimate.map((s) => s.session_id));
  const currentLegitimatePageViews = currentRaw.pageViews.filter((pv) => currentLegitimateIdSet.has(pv.session_id));
  const topPages = computeTopPages(currentLegitimatePageViews, 10);
  const geography = computeGeography(currentRaw.sessions);
  const technology = computeTechnology(currentRaw.sessions);
  const campaigns = computeCampaigns(currentRaw.sessions, currentRaw.events);
  const aiReferrals = computeAiReferralAnalytics(currentRaw.sessions, currentRaw.pageViews, currentRaw.events);
  const partnerTrackers = computePartnerTrackers(currentRaw.sessions, currentRaw.pageViews, currentRaw.events);

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
      partnerTrackers,
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

