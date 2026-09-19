import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import {
  requireAdminAuth,
  parseDateRange,
  computeCampaigns,
} from "@/lib/analytics/adminQueries";

export const dynamic = "force-dynamic";

/**
 * GET /api/admin/analytics/campaigns
 * Returns campaign performance metrics (UTM attribution, sessions, visitors, conversions).
 */
export async function GET(request) {
  try {
    const auth = await requireAdminAuth(request);
    if (!auth.authenticated) return auth.response;

    const supabase = getSupabaseServerClient();
    const rangeInfo = parseDateRange(request.nextUrl.searchParams);

    const [sessionsRes, eventsRes] = await Promise.all([
      supabase
        .from("sessions")
        .select("session_id, visitor_id, utm_source, utm_medium, utm_campaign")
        .gte("started_at", rangeInfo.from.toISOString())
        .lte("started_at", rangeInfo.to.toISOString()),
      supabase
        .from("analytics_events")
        .select("session_id, event_name")
        .gte("created_at", rangeInfo.from.toISOString())
        .lte("created_at", rangeInfo.to.toISOString())
        .in("event_name", ["inquiry_submitted", "call_booked", "contact_form_submit"]),
    ]);

    if (sessionsRes.error) throw sessionsRes.error;
    if (eventsRes.error) throw eventsRes.error;

    const campaigns = computeCampaigns(sessionsRes.data || [], eventsRes.data || []);

    return NextResponse.json(
      {
        success: true,
        data: campaigns,
        meta: {
          range: rangeInfo.range,
          from: rangeInfo.from.toISOString(),
          to: rangeInfo.to.toISOString(),
        },
      },
      {
        status: 200,
        headers: { "Cache-Control": "private, no-cache, no-store, must-revalidate" },
      }
    );
  } catch (error) {
    console.error("Admin Analytics API Error [campaigns]:", error);
    return NextResponse.json({ success: false, error: "Failed to retrieve campaign data" }, { status: 500 });
  }
}
