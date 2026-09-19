import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import {
  requireAdminAuth,
  parseDateRange,
  fetchRawAnalyticsData,
  computeTimeSeries,
} from "@/lib/analytics/adminQueries";

export const dynamic = "force-dynamic";

/**
 * GET /api/admin/analytics/timeseries
 * Returns time-bucketed visitor and pageview trends for the traffic chart.
 */
export async function GET(request) {
  try {
    const auth = await requireAdminAuth(request);
    if (!auth.authenticated) return auth.response;

    const supabase = getSupabaseServerClient();
    const rangeInfo = parseDateRange(request.nextUrl.searchParams);

    const currentRaw = await fetchRawAnalyticsData(supabase, rangeInfo.from, rangeInfo.to);
    const trafficChart = computeTimeSeries(
      currentRaw.sessions,
      currentRaw.pageViews,
      rangeInfo.range,
      rangeInfo.from,
      rangeInfo.to
    );

    return NextResponse.json(
      {
        success: true,
        data: trafficChart,
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
    console.error("Admin Analytics API Error [timeseries]:", error);
    return NextResponse.json({ success: false, error: "Failed to retrieve timeseries data" }, { status: 500 });
  }
}
