import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import {
  requireAdminAuth,
  parseDateRange,
  fetchRawAnalyticsData,
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

    const rawData = await fetchRawAnalyticsData(supabase, rangeInfo.from, rangeInfo.to);
    const campaigns = computeCampaigns(rawData.sessions || [], rawData.events || []);

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
