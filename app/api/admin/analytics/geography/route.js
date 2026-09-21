import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import {
  requireAdminAuth,
  parseDateRange,
  computeGeography,
} from "@/lib/analytics/adminQueries";

export const dynamic = "force-dynamic";

/**
 * GET /api/admin/analytics/geography
 * Returns geographic audience breakdown (top countries and top cities).
 */
export async function GET(request) {
  try {
    const auth = await requireAdminAuth(request);
    if (!auth.authenticated) return auth.response;

    const supabase = getSupabaseServerClient();
    const rangeInfo = parseDateRange(request.nextUrl.searchParams);

    const { data: sessions, error } = await supabase
      .from("sessions")
      .select("session_id, started_at, country, traffic_source, device_type, browser, operating_system")
      .gte("started_at", rangeInfo.from.toISOString())
      .lte("started_at", rangeInfo.to.toISOString());

    if (error) throw error;

    const geography = computeGeography(sessions || []);

    return NextResponse.json(
      {
        success: true,
        data: geography,
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
    console.error("Admin Analytics API Error [geography]:", error);
    return NextResponse.json({ success: false, error: "Failed to retrieve geography data" }, { status: 500 });
  }
}
