import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import {
  requireAdminAuth,
  parseDateRange,
  fetchRawAnalyticsData,
  partitionSessions,
  computeTopPages,
} from "@/lib/analytics/adminQueries";

export const dynamic = "force-dynamic";

/**
 * GET /api/admin/analytics/pages
 * Returns top viewed pages ranked by views, with unique visitor counts and dwell times.
 */
export async function GET(request) {
  try {
    const auth = await requireAdminAuth(request);
    if (!auth.authenticated) return auth.response;

    const supabase = getSupabaseServerClient();
    const rangeInfo = parseDateRange(request.nextUrl.searchParams);
    const limitParam = parseInt(request.nextUrl.searchParams.get("limit") || "10", 10);
    const limit = isNaN(limitParam) ? 10 : Math.max(1, Math.min(limitParam, 50));

    const rawData = await fetchRawAnalyticsData(supabase, rangeInfo.from, rangeInfo.to);
    const { legitimate } = partitionSessions(rawData.sessions || []);
    const legitimateIdSet = new Set(legitimate.map((s) => s.session_id));
    const legitimatePageViews = (rawData.pageViews || []).filter((pv) => legitimateIdSet.has(pv.session_id));

    const topPages = computeTopPages(legitimatePageViews, limit);

    return NextResponse.json(
      {
        success: true,
        data: topPages,
        meta: {
          range: rangeInfo.range,
          from: rangeInfo.from.toISOString(),
          to: rangeInfo.to.toISOString(),
          limit,
        },
      },
      {
        status: 200,
        headers: { "Cache-Control": "private, no-cache, no-store, must-revalidate" },
      }
    );
  } catch (error) {
    console.error("Admin Analytics API Error [pages]:", error);
    return NextResponse.json({ success: false, error: "Failed to retrieve top pages" }, { status: 500 });
  }
}
