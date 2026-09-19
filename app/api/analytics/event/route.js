import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import {
  checkRateLimit,
  EventSchema,
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

    const parseResult = EventSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        { error: "Invalid payload", details: parseResult.error.format() },
        { status: 400 }
      );
    }

    const {
      visitorId,
      sessionId,
      eventName,
      eventValue,
      pagePath,
    } = parseResult.data;

    const supabase = getSupabaseServerClient();
    const nowIso = new Date().toISOString();

    // 3. Ensure foreign key targets exist (upsert minimal records if needed)
    await supabase.from("visitors").upsert(
      {
        visitor_id: visitorId,
        last_seen: nowIso,
      },
      { onConflict: "visitor_id" }
    );

    await supabase.from("sessions").upsert(
      {
        session_id: sessionId,
        visitor_id: visitorId,
        last_activity_at: nowIso,
      },
      { onConflict: "session_id" }
    );

    // 4. Insert Analytics Event
    const { data: eventData, error: eventError } = await supabase
      .from("analytics_events")
      .insert({
        session_id: sessionId,
        visitor_id: visitorId,
        event_name: eventName,
        event_value: eventValue || null,
        page_path: pagePath || null,
        created_at: nowIso,
      })
      .select("id")
      .single();

    if (eventError) {
      console.error("Analytics Error [event insert]:", eventError.message);
      return NextResponse.json({ error: "Failed to record event" }, { status: 500 });
    }

    return NextResponse.json(
      { success: true, eventId: eventData?.id },
      { status: 201 }
    );
  } catch (err) {
    console.error("Analytics Event Unhandled Error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
