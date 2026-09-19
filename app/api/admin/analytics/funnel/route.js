import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import {
  requireAdminAuth,
  parseDateRange,
  fetchRawAnalyticsData,
  computeFunnel,
} from "@/lib/analytics/adminQueries";

export const dynamic = "force-dynamic";

/**
 * GET /api/admin/analytics/funnel
 * Returns 4-stage visitor progression funnel with conversion rates and dropoffs.
 */
export async function GET(request) {
  try {
    const auth = await requireAdminAuth(request);
    if (!auth.authenticated) return auth.response;

    const supabase = getSupabaseServerClient();
    const rangeInfo = parseDateRange(request.nextUrl.searchParams);

    const currentRaw = await fetchRawAnalyticsData(supabase, rangeInfo.from, rangeInfo.to);
    const funnel = computeFunnel(currentRaw.sessions, currentRaw.pageViews, currentRaw.events);

    return NextResponse.json(
      {
        success: true,
        data: funnel,
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
    console.error("Admin Analytics API Error [funnel]:", error);
    return NextResponse.json({ success: false, error: "Failed to retrieve funnel metrics" }, { status: 500 });
  }
}
