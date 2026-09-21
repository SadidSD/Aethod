import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import {
  requireAdminAuth,
  parseDateRange,
  fetchRawAnalyticsData,
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

    const rawData = await fetchRawAnalyticsData(supabase, rangeInfo.from, rangeInfo.to);

    const aiReferrals = computeAiReferralAnalytics(
      rawData.sessions,
      rawData.pageViews,
      rawData.events
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
