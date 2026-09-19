import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import {
  requireAdminAuth,
  parseDateRange,
  fetchRawAnalyticsData,
  getLiveVisitorsCount,
  computeOverviewMetrics,
} from "@/lib/analytics/adminQueries";

export const dynamic = "force-dynamic";

/**
 * GET /api/admin/analytics/overview
 * Returns executive KPI metric cards with period-over-period delta comparisons.
 */
export async function GET(request) {
  try {
    const auth = await requireAdminAuth(request);
    if (!auth.authenticated) return auth.response;

    const supabase = getSupabaseServerClient();
    const rangeInfo = parseDateRange(request.nextUrl.searchParams);

    const [currentRaw, prevRaw, liveVisitors] = await Promise.all([
      fetchRawAnalyticsData(supabase, rangeInfo.from, rangeInfo.to),
      fetchRawAnalyticsData(supabase, rangeInfo.prevFrom, rangeInfo.prevTo),
      getLiveVisitorsCount(supabase),
    ]);

    const metrics = computeOverviewMetrics(currentRaw, prevRaw, liveVisitors);

    return NextResponse.json(
      {
        success: true,
        data: metrics,
        meta: {
          range: rangeInfo.range,
          from: rangeInfo.from.toISOString(),
          to: rangeInfo.to.toISOString(),
          comparisonLabel: rangeInfo.comparisonLabel,
        },
      },
      {
        status: 200,
        headers: { "Cache-Control": "private, no-cache, no-store, must-revalidate" },
      }
    );
  } catch (error) {
    console.error("Admin Analytics API Error [overview]:", error);
    return NextResponse.json({ success: false, error: "Failed to retrieve overview metrics" }, { status: 500 });
  }
}
