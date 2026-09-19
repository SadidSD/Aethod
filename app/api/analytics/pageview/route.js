import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import {
  checkRateLimit,
  extractGeoFromHeaders,
  PageViewSchema,
} from "@/lib/analytics/serverAnalytics";

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

    // 5. Upsert Session record with First-Touch Source Preservation
    const { data: existingSession } = await supabase
      .from("sessions")
      .select("traffic_source, referrer, utm_source, utm_medium, utm_campaign, utm_term, utm_content")
      .eq("session_id", sessionId)
      .maybeSingle();

    let finalTrafficSource = trafficSource;
    let finalReferrer = referrer || null;
    let finalUtmSource = utm?.utm_source || null;
    let finalUtmMedium = utm?.utm_medium || null;
    let finalUtmCampaign = utm?.utm_campaign || null;
    let finalUtmTerm = utm?.utm_term || null;
    let finalUtmContent = utm?.utm_content || null;

    if (existingSession && existingSession.traffic_source && existingSession.traffic_source !== "Direct") {
      // Preserve first-touched source: do not overwrite reliable attribution with Direct
      if (!trafficSource || trafficSource === "Direct") {
        finalTrafficSource = existingSession.traffic_source;
        finalReferrer = existingSession.referrer;
        finalUtmSource = existingSession.utm_source;
        finalUtmMedium = existingSession.utm_medium;
        finalUtmCampaign = existingSession.utm_campaign;
        finalUtmTerm = existingSession.utm_term;
        finalUtmContent = existingSession.utm_content;
      }
    }

    const { error: sessionError } = await supabase.from("sessions").upsert(
      {
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
      },
      {
        onConflict: "session_id",
        ignoreDuplicates: false,
      }
    );

    if (sessionError) {
      console.error("Analytics Error [session upsert]:", sessionError.message);
    }

    // 6. Insert Page View record
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
