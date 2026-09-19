import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import {
  requireAdminAuth,
  parseDateRange,
  computeDeviceBreakdown,
} from "@/lib/analytics/adminQueries";

export const dynamic = "force-dynamic";

/**
 * GET /api/admin/analytics/devices
 * Returns device breakdown (Desktop, Mobile, Tablet) with counts, shares, and color keys.
 */
export async function GET(request) {
  try {
    const auth = await requireAdminAuth(request);
    if (!auth.authenticated) return auth.response;

    const supabase = getSupabaseServerClient();
    const rangeInfo = parseDateRange(request.nextUrl.searchParams);

    const { data: sessions, error } = await supabase
      .from("sessions")
      .select("device_type")
      .gte("started_at", rangeInfo.from.toISOString())
      .lte("started_at", rangeInfo.to.toISOString());

    if (error) throw error;

    const devices = computeDeviceBreakdown(sessions || []);

    return NextResponse.json(
      {
        success: true,
        data: devices,
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
    console.error("Admin Analytics API Error [devices]:", error);
    return NextResponse.json({ success: false, error: "Failed to retrieve device breakdown" }, { status: 500 });
  }
}
