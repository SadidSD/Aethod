import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { requireAdminAuth } from "@/lib/analytics/adminQueries";
import { isValidClassification, SESSION_CLASSIFICATIONS } from "@/lib/analytics/classification";

export const dynamic = "force-dynamic";

/**
 * POST /api/admin/analytics/classify-session
 * Admin-only endpoint to classify a session as human_or_unknown, bot, or test.
 *
 * Payload: { sessionId: string, classification: "human_or_unknown" | "bot" | "test", reason?: string }
 */
export async function POST(request) {
  try {
    const auth = await requireAdminAuth(request);
    if (!auth.authenticated) return auth.response;

    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ success: false, error: "Invalid JSON payload" }, { status: 400 });
    }

    const { sessionId, classification, reason } = body || {};

    if (!sessionId || typeof sessionId !== "string") {
      return NextResponse.json({ success: false, error: "Missing or invalid sessionId" }, { status: 400 });
    }

    if (!classification || !isValidClassification(classification)) {
      return NextResponse.json(
        {
          success: false,
          error: `Invalid classification: ${classification}. Must be one of: ${Object.values(SESSION_CLASSIFICATIONS).join(", ")}`,
        },
        { status: 400 }
      );
    }

    const supabase = getSupabaseServerClient();

    // Verify session exists
    const { data: session, error: sessErr } = await supabase
      .from("sessions")
      .select("session_id, visitor_id")
      .eq("session_id", sessionId)
      .single();

    if (sessErr || !session) {
      return NextResponse.json({ success: false, error: "Session not found in database" }, { status: 404 });
    }

    // 1. Try updating classification column on sessions table if it exists
    try {
      await supabase
        .from("sessions")
        .update({ classification })
        .eq("session_id", sessionId);
    } catch {
      // Column may not exist yet in schema, event-based fallback will handle it
    }

    // 2. Persist audit classification event in analytics_events for guaranteed retention and zero-downtime queryability
    const { error: eventErr } = await supabase.from("analytics_events").insert({
      session_id: sessionId,
      visitor_id: session.visitor_id,
      event_name: "session_classification",
      event_value: {
        classification,
        reason: reason || "Manual admin attribution in audit log",
        updated_at: new Date().toISOString(),
        updated_by: auth.session?.email || "admin",
      },
      page_path: "/yamal19/analytics",
    });

    if (eventErr) {
      console.error("Failed to insert session_classification event:", eventErr.message);
    }

    return NextResponse.json({
      success: true,
      sessionId,
      classification,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Admin Analytics API Error [classify-session]:", error);
    return NextResponse.json({ success: false, error: "Failed to classify session" }, { status: 500 });
  }
}
