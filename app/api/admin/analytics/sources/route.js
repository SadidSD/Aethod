import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import {
  requireAdminAuth,
  parseDateRange,
  computeTrafficSources,
} from "@/lib/analytics/adminQueries";

export const dynamic = "force-dynamic";

/**
 * GET /api/admin/analytics/sources
 * Returns classified traffic sources (Direct, Organic, Social, Referral, Paid) with colors.
 */
export async function GET(request) {
  try {
    const auth = await requireAdminAuth(request);
    if (!auth.authenticated) return auth.response;

    const supabase = getSupabaseServerClient();
    const rangeInfo = parseDateRange(request.nextUrl.searchParams);

    const { data: sessions, error } = await supabase
      .from("sessions")
      .select("traffic_source")
      .gte("started_at", rangeInfo.from.toISOString())
      .lte("started_at", rangeInfo.to.toISOString());

    if (error) throw error;

    const trafficSources = computeTrafficSources(sessions || []);

    return NextResponse.json(
      {
        success: true,
        data: trafficSources,
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
    console.error("Admin Analytics API Error [sources]:", error);
    return NextResponse.json({ success: false, error: "Failed to retrieve traffic sources" }, { status: 500 });
  }
}
