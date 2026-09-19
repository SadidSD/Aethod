import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import {
  requireAdminAuth,
  parseDateRange,
  computeTechnology,
} from "@/lib/analytics/adminQueries";

export const dynamic = "force-dynamic";

/**
 * GET /api/admin/analytics/technology
 * Returns technology profile (browsers and operating systems).
 */
export async function GET(request) {
  try {
    const auth = await requireAdminAuth(request);
    if (!auth.authenticated) return auth.response;

    const supabase = getSupabaseServerClient();
    const rangeInfo = parseDateRange(request.nextUrl.searchParams);

    const { data: sessions, error } = await supabase
      .from("sessions")
      .select("browser, operating_system")
      .gte("started_at", rangeInfo.from.toISOString())
      .lte("started_at", rangeInfo.to.toISOString());

    if (error) throw error;

    const technology = computeTechnology(sessions || []);

    return NextResponse.json(
      {
        success: true,
        data: technology,
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
    console.error("Admin Analytics API Error [technology]:", error);
    return NextResponse.json({ success: false, error: "Failed to retrieve technology data" }, { status: 500 });
  }
}
