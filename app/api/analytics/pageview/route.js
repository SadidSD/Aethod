import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import {
  checkRateLimit,
  extractGeoFromHeaders,
  PageViewSchema,
} from "@/lib/analytics/serverAnalytics";
import { detectAiReferral, AI_ATTRIBUTION_TYPES } from "@/lib/analytics/aiPlatforms.js";

// Cached flag to check if sessions table has ai_platform and ai_attribution_type columns
let hasAiColumns = null;
async function getHasAiColumns(supabase) {
  if (hasAiColumns !== null) return hasAiColumns;
  try {
    const { error } = await supabase.from("sessions").select("ai_platform").limit(0);
    hasAiColumns = !error;
  } catch {
    hasAiColumns = false;
  }
  return hasAiColumns;
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

    // 2. Parse & Validate body
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
      referrer,
      trafficSource,
      aiPlatform,
      aiAttributionType,
      utm,
      device,
    } = parseResult.data;

    // 3. Extract non-sensitive geo metadata from Edge headers
    const { country, city } = extractGeoFromHeaders(request);

    const supabase = getSupabaseServerClient();
    const nowIso = new Date().toISOString();

    // 4. Upsert Visitor record
    const { error: visitorError } = await supabase.from("visitors").upsert(
      {
        visitor_id: visitorId,
        last_seen: nowIso,
        device_type: device?.device_type || null,
        operating_system: device?.operating_system || null,
        browser: device?.browser || null,
        country: country || null,
        city: city || null,
      },
      {
        onConflict: "visitor_id",
        ignoreDuplicates: false,
      }
    );

    if (visitorError) {
      console.error("Analytics Error [visitor upsert]:", visitorError.message);
    }

    // 5. Server-side verification of AI signal
    let effectiveTrafficSource = trafficSource || "Direct";
    let effectiveAiPlatform = aiPlatform || null;
    let effectiveAiAttributionType = aiAttributionType || null;

    if (effectiveTrafficSource !== "AI Referral") {
      const dummySearch = new URLSearchParams();
      if (utm?.utm_source) dummySearch.set("utm_source", utm.utm_source);
      if (utm?.utm_medium) dummySearch.set("utm_medium", utm.utm_medium);

      const serverAiCheck = detectAiReferral(referrer || "", dummySearch);
      if (serverAiCheck.isAiReferral && serverAiCheck.attributionType === AI_ATTRIBUTION_TYPES.VERIFIED_AI_REFERRAL) {
        effectiveTrafficSource = "AI Referral";
        effectiveAiPlatform = serverAiCheck.platform;
        effectiveAiAttributionType = AI_ATTRIBUTION_TYPES.VERIFIED_AI_REFERRAL;
      }
    } else if (!effectiveAiPlatform && (referrer || utm?.utm_source)) {
      const dummySearch = new URLSearchParams();
      if (utm?.utm_source) dummySearch.set("utm_source", utm.utm_source);
      if (utm?.utm_medium) dummySearch.set("utm_medium", utm.utm_medium);
      const serverAiCheck = detectAiReferral(referrer || "", dummySearch);
      if (serverAiCheck.isAiReferral) {
        effectiveAiPlatform = serverAiCheck.platform;
        effectiveAiAttributionType = serverAiCheck.attributionType;
      }
    }

    // 6. Upsert Session record with First-Touch Source Preservation
    const supportsAiColumns = await getHasAiColumns(supabase);

    const sessionSelectFields = supportsAiColumns
      ? "traffic_source, referrer, utm_source, utm_medium, utm_campaign, utm_term, utm_content, ai_platform, ai_attribution_type"
      : "traffic_source, referrer, utm_source, utm_medium, utm_campaign, utm_term, utm_content";

    const { data: existingSession } = await supabase
      .from("sessions")
      .select(sessionSelectFields)
      .eq("session_id", sessionId)
      .maybeSingle();

    let finalTrafficSource = effectiveTrafficSource;
    let finalReferrer = referrer || null;
    let finalAiPlatform = effectiveAiPlatform || null;
    let finalAiAttributionType = effectiveAiAttributionType || null;
    let finalUtmSource = utm?.utm_source || null;
    let finalUtmMedium = utm?.utm_medium || null;
    let finalUtmCampaign = utm?.utm_campaign || null;
    let finalUtmTerm = utm?.utm_term || null;
    let finalUtmContent = utm?.utm_content || null;

    if (existingSession && existingSession.traffic_source && existingSession.traffic_source !== "Direct") {
      // Preserve first-touched source: do not overwrite reliable attribution with Direct
      if (!effectiveTrafficSource || effectiveTrafficSource === "Direct") {
        finalTrafficSource = existingSession.traffic_source;
        finalReferrer = existingSession.referrer;
        finalUtmSource = existingSession.utm_source;
        finalUtmMedium = existingSession.utm_medium;
        finalUtmCampaign = existingSession.utm_campaign;
        finalUtmTerm = existingSession.utm_term;
        finalUtmContent = existingSession.utm_content;
        if (supportsAiColumns) {
          finalAiPlatform = existingSession.ai_platform || finalAiPlatform;
          finalAiAttributionType = existingSession.ai_attribution_type || finalAiAttributionType;
        }
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
      device_type: device?.device_type || null,
      operating_system: device?.operating_system || null,
      browser: device?.browser || null,
      country: country || null,
      city: city || null,
    };

    if (supportsAiColumns) {
      sessionPayload.ai_platform = finalAiPlatform;
      sessionPayload.ai_attribution_type = finalAiAttributionType;
    }

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

    // 7. Insert Page View record
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
      { success: true, pageViewId: pageViewData?.id },
      { status: 201 }
    );
  } catch (err) {
    console.error("Analytics Pageview Unhandled Error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
