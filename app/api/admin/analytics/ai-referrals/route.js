import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import {
  requireAdminAuth,
  parseDateRange,
  computeAiReferralAnalytics,
} from "@/lib/analytics/adminQueries";

export const dynamic = "force-dynamic";

/**
 * GET /api/admin/analytics/ai-referrals
 * Returns dedicated AI Referral metrics, platform breakdown, and AI conversion funnel.
 */
export async function GET(request) {
  try {
    const auth = await requireAdminAuth(request);
    if (!auth.authenticated) return auth.response;

    const supabase = getSupabaseServerClient();
    const rangeInfo = parseDateRange(request.nextUrl.searchParams);

    const [sessionsRes, pageViewsRes, eventsRes] = await Promise.all([
      supabase
        .from("sessions")
        .select("session_id, visitor_id, traffic_source, referrer, utm_source, utm_medium, started_at")
        .gte("started_at", rangeInfo.from.toISOString())
        .lte("started_at", rangeInfo.to.toISOString()),
      supabase
        .from("page_views")
        .select("session_id, path, viewed_at")
        .gte("viewed_at", rangeInfo.from.toISOString())
        .lte("viewed_at", rangeInfo.to.toISOString()),
      supabase
        .from("analytics_events")
        .select("session_id, event_name, created_at")
        .gte("created_at", rangeInfo.from.toISOString())
        .lte("created_at", rangeInfo.to.toISOString()),
    ]);

    if (sessionsRes.error) throw sessionsRes.error;
    if (pageViewsRes.error) throw pageViewsRes.error;
    if (eventsRes.error) throw eventsRes.error;

    const aiReferrals = computeAiReferralAnalytics(
      sessionsRes.data || [],
      pageViewsRes.data || [],
      eventsRes.data || []
    );

    return NextResponse.json(
      {
        success: true,
        data: aiReferrals,
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
    console.error("Admin Analytics API Error [ai-referrals]:", error);
    return NextResponse.json({ success: false, error: "Failed to retrieve AI referral analytics" }, { status: 500 });
  }
}
