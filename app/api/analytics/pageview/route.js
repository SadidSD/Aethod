import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import {
  checkRateLimit,
  extractGeoFromHeaders,
  isCrawler,
  resolveAcquisition,
  PageViewSchema,
} from "@/lib/analytics/serverAnalytics";
import { parseDeviceInfo } from "@/lib/analytics/device";
import { AI_ATTRIBUTION_TYPES } from "@/lib/analytics/aiPlatforms.js";

// Cache of supported session table columns in Supabase
let supportedSessionColumns = null;

async function getSupportedSessionColumns(supabase) {
  if (supportedSessionColumns !== null) return supportedSessionColumns;

  const candidateColumns = [
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

  const detected = new Set();

  await Promise.all(
    candidateColumns.map(async (col) => {
      try {
        const { error } = await supabase.from("sessions").select(col).limit(0);
        if (!error) {
          detected.add(col);
        }
      } catch {
        // column not available
      }
    })
  );

  supportedSessionColumns = detected;
  return supportedSessionColumns;
}

export async function POST(request) {
  try {
    // 1. Rate limiting check
    if (!checkRateLimit(request)) {
      return NextResponse.json(
        { error: "Too many requests" },
        { status: 429 }
      );
    }

    const userAgent = request.headers.get("user-agent") || "";
    const serverReferer = request.headers.get("referer") || null;

    // 2. Separate AI Crawlers / Bots from human referral visitors
    const crawlerCheck = isCrawler(userAgent);
    if (crawlerCheck.isCrawler) {
      return NextResponse.json(
        { message: "Crawler acknowledged, excluded from analytics", bot: crawlerCheck.botName },
        { status: 200 }
      );
    }

    // 3. Parse & Validate body
    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const parseResult = PageViewSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        { error: "Invalid payload", details: parseResult.error.format() },
        { status: 400 }
      );
    }

    const {
      visitorId,
      sessionId,
      path,
      landingPage,
      referrer,
      trafficSource,
      aiPlatform,
      aiAttributionType,
      aiReferrerHost,
      aiReferrerPath,
      unknownReferrerHost,
      utm,
      device,
    } = parseResult.data;

    // 4. Server-Side Acquisition Resolution (Server is Source of Truth)
    const utmSearch = new URLSearchParams();
    if (utm?.utm_source) utmSearch.set("utm_source", utm.utm_source);
    if (utm?.utm_medium) utmSearch.set("utm_medium", utm.utm_medium);
    if (utm?.utm_campaign) utmSearch.set("utm_campaign", utm.utm_campaign);

    const serverAcquisition = resolveAcquisition({
      serverReferer,
      clientReferrer: referrer,
      searchParams: utmSearch,
      currentOrigin: request.nextUrl.origin,
      userAgent,
    });

    // Determine effective acquisition attributes
    let effectiveTrafficSource = serverAcquisition.source;
    if (effectiveTrafficSource === "Bot") effectiveTrafficSource = "Direct";

    // If client had a valid verified AI referral from landing and server referer was empty, respect client verified signal
    if (effectiveTrafficSource === "Direct" && trafficSource === "AI Referral") {
      effectiveTrafficSource = "AI Referral";
    }

    let effectiveAiPlatform = serverAcquisition.aiPlatform || (effectiveTrafficSource === "AI Referral" ? aiPlatform : null);
    let effectiveAiAttributionType =
      effectiveTrafficSource === "AI Referral"
        ? AI_ATTRIBUTION_TYPES.VERIFIED_AI_REFERRAL
        : AI_ATTRIBUTION_TYPES.UNKNOWN_AI;
    let effectiveAiReferrerHost = serverAcquisition.referrerHost || aiReferrerHost || null;
    let effectiveAiReferrerPath = serverAcquisition.referrerPath || aiReferrerPath || null;
    let effectiveUnknownReferrerHost = serverAcquisition.unknownReferrerHost || unknownReferrerHost || null;
    let effectiveLandingPage = landingPage || path || "/";
    let effectiveReason = serverAcquisition.reason;

    // 5. Extract non-sensitive geo metadata from Edge headers (or IP fallback)
    const geoData = await extractGeoFromHeaders(request);
    const storedCountry = geoData.country && geoData.country !== "Unknown" ? geoData.country : null;
    const storedCity = geoData.city && geoData.city !== "Unknown" ? geoData.city : null;

    // Fallback: derive device, OS, and browser server-side from user-agent if client telemetry is missing
    const serverDevice = (!device?.browser || device.browser === "Other")
      ? parseDeviceInfo(userAgent)
      : device;

    const finalDeviceType = device?.device_type || serverDevice.device_type || "desktop";
    const finalOS = device?.operating_system || serverDevice.operating_system || "Other";
    const finalBrowser = device?.browser || serverDevice.browser || "Other";

    const supabase = getSupabaseServerClient();
    const nowIso = new Date().toISOString();

    // 6. Upsert Visitor record
    const { error: visitorError } = await supabase.from("visitors").upsert(
      {
        visitor_id: visitorId,
        last_seen: nowIso,
        device_type: finalDeviceType,
        operating_system: finalOS,
        browser: finalBrowser,
        country: storedCountry,
        city: storedCity,
      },
      {
        onConflict: "visitor_id",
        ignoreDuplicates: false,
      }
    );

    if (visitorError) {
      console.error("Analytics Error [visitor upsert]:", visitorError.message);
    }

    // 7. Upsert Session record with First-Touch Source Preservation
    const availableCols = await getSupportedSessionColumns(supabase);

    const sessionSelectFields = [
      "traffic_source",
      "referrer",
      "utm_source",
      "utm_medium",
      "utm_campaign",
      "utm_term",
      "utm_content",
      ...Array.from(availableCols),
    ].join(", ");

    const { data: existingSession } = await supabase
      .from("sessions")
      .select(sessionSelectFields)
      .eq("session_id", sessionId)
      .maybeSingle();

    let finalTrafficSource = effectiveTrafficSource;
    let finalReferrer = referrer || serverReferer || null;
    let finalAiPlatform = effectiveAiPlatform || null;
    let finalAiAttributionType = effectiveAiAttributionType || null;
    let finalAiReferrerHost = effectiveAiReferrerHost || null;
    let finalAiReferrerPath = effectiveAiReferrerPath || null;
    let finalUnknownReferrerHost = effectiveUnknownReferrerHost || null;
    let finalLandingPage = effectiveLandingPage;
    let finalReason = effectiveReason;
    let finalUtmSource = utm?.utm_source || null;
    let finalUtmMedium = utm?.utm_medium || null;
    let finalUtmCampaign = utm?.utm_campaign || null;
    let finalUtmTerm = utm?.utm_term || null;
    let finalUtmContent = utm?.utm_content || null;

    if (existingSession && existingSession.traffic_source && existingSession.traffic_source !== "Direct") {
      // First-touch preservation: never downgrade reliable attribution to Direct
      if (!effectiveTrafficSource || effectiveTrafficSource === "Direct") {
        finalTrafficSource = existingSession.traffic_source;
        finalReferrer = existingSession.referrer;
        finalUtmSource = existingSession.utm_source;
        finalUtmMedium = existingSession.utm_medium;
        finalUtmCampaign = existingSession.utm_campaign;
        finalUtmTerm = existingSession.utm_term;
        finalUtmContent = existingSession.utm_content;
        finalAiPlatform = existingSession.ai_platform || finalAiPlatform;
        finalAiAttributionType = existingSession.ai_attribution_type || finalAiAttributionType;
        finalAiReferrerHost = existingSession.ai_referrer_host || finalAiReferrerHost;
        finalAiReferrerPath = existingSession.ai_referrer_path || finalAiReferrerPath;
        finalUnknownReferrerHost = existingSession.unknown_referrer_host || finalUnknownReferrerHost;
        finalLandingPage = existingSession.landing_page || finalLandingPage;
        finalReason = existingSession.attribution_reason || finalReason;
      }
    }

    const sessionPayload = {
      session_id: sessionId,
      visitor_id: visitorId,
      last_activity_at: nowIso,
      referrer: finalReferrer,
      utm_source: finalUtmSource,
      utm_medium: finalUtmMedium,
      utm_campaign: finalUtmCampaign,
      utm_term: finalUtmTerm,
      utm_content: finalUtmContent,
      traffic_source: finalTrafficSource,
      device_type: finalDeviceType,
      operating_system: finalOS,
      browser: finalBrowser,
      country: storedCountry,
      city: storedCity,
    };

    // Dynamically attach optional columns supported by Supabase schema
    if (availableCols.has("ai_platform")) sessionPayload.ai_platform = finalAiPlatform;
    if (availableCols.has("ai_attribution_type")) sessionPayload.ai_attribution_type = finalAiAttributionType;
    if (availableCols.has("ai_referrer_host")) sessionPayload.ai_referrer_host = finalAiReferrerHost;
    if (availableCols.has("ai_referrer_path")) sessionPayload.ai_referrer_path = finalAiReferrerPath;
    if (availableCols.has("landing_page")) sessionPayload.landing_page = finalLandingPage;
    if (availableCols.has("unknown_referrer_host")) sessionPayload.unknown_referrer_host = finalUnknownReferrerHost;
    if (availableCols.has("attribution_reason")) sessionPayload.attribution_reason = finalReason;
    if (availableCols.has("country_code")) sessionPayload.country_code = geoData.countryCode || null;
    if (availableCols.has("country_name")) sessionPayload.country_name = geoData.countryName || null;
    if (availableCols.has("region_code")) sessionPayload.region_code = geoData.regionCode || null;
    if (availableCols.has("region_name")) sessionPayload.region_name = geoData.regionName || null;
    if (availableCols.has("metro")) sessionPayload.metro = geoData.metro || null;
    if (availableCols.has("timezone")) sessionPayload.timezone = geoData.timezone || null;

    const { error: sessionError } = await supabase.from("sessions").upsert(
      sessionPayload,
      {
        onConflict: "session_id",
        ignoreDuplicates: false,
      }
    );

    if (sessionError) {
      console.error("Analytics Error [session upsert]:", sessionError.message);
    }

    // 8. Insert Page View record
    const { data: pageViewData, error: pageViewError } = await supabase
      .from("page_views")
      .insert({
        session_id: sessionId,
        visitor_id: visitorId,
        path: path,
        referrer: referrer || null,
        viewed_at: nowIso,
        duration_seconds: 0,
      })
      .select("id")
      .single();

    if (pageViewError) {
      console.error("Analytics Error [page_view insert]:", pageViewError.message);
      return NextResponse.json({ error: "Failed to record pageview" }, { status: 500 });
    }

    return NextResponse.json(
      {
        success: true,
        pageViewId: pageViewData?.id,
        acquisition: {
          source: finalTrafficSource,
          aiPlatform: finalAiPlatform,
          confidence: serverAcquisition.confidence,
        },
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("Analytics Pageview Unhandled Error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
