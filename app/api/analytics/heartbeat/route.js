import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import {
  checkRateLimit,
  HeartbeatSchema,
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

    const parseResult = HeartbeatSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        { error: "Invalid payload", details: parseResult.error.format() },
        { status: 400 }
      );
    }

    const { visitorId, sessionId, path, dwellSeconds } = parseResult.data;

    const supabase = getSupabaseServerClient();
    const nowIso = new Date().toISOString();

    // 3. Update Session last activity
    const { error: sessionError } = await supabase
      .from("sessions")
      .update({ last_activity_at: nowIso })
      .eq("session_id", sessionId);

    if (sessionError) {
      console.error("Analytics Error [heartbeat session update]:", sessionError.message);
    }

    // 4. Update Visitor last seen
    const { error: visitorError } = await supabase
      .from("visitors")
      .update({ last_seen: nowIso })
      .eq("visitor_id", visitorId);

    if (visitorError) {
      console.error("Analytics Error [heartbeat visitor update]:", visitorError.message);
    }

    // 5. Increment page_views duration for the most recent pageview of this session & path
    const { data: recentPv } = await supabase
      .from("page_views")
      .select("id, duration_seconds")
      .eq("session_id", sessionId)
      .eq("path", path)
      .order("viewed_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (recentPv) {
      const currentDuration = recentPv.duration_seconds || 0;
      await supabase
        .from("page_views")
        .update({ duration_seconds: currentDuration + dwellSeconds })
        .eq("id", recentPv.id);
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error("Analytics Heartbeat Unhandled Error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
