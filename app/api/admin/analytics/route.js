import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { requireAdminAuth, getAllAnalyticsData } from "@/lib/analytics/adminQueries";

export const dynamic = "force-dynamic";

/**
 * GET /api/admin/analytics
 * Master analytics endpoint returning complete 360° metrics in a single payload.
 *
 * Query Params:
 * - range: "today" | "yesterday" | "7d" | "30d" | "custom" (default: "7d")
 * - from: ISO date string (for custom range)
 * - to: ISO date string (for custom range)
 *
 * Security: Requires valid 'aeethod_admin_session' cookie.
 */
export async function GET(request) {
  try {
    // 1. Enforce Admin Authentication
    const auth = await requireAdminAuth(request);
    if (!auth.authenticated) {
      return auth.response;
    }

    // 2. Fetch analytics through server Supabase client
    const supabase = getSupabaseServerClient();
    const result = await getAllAnalyticsData(supabase, request.nextUrl.searchParams);

    return NextResponse.json(
      {
        success: true,
        data: result.data,
        meta: result.meta,
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "private, no-cache, no-store, must-revalidate",
        },
      }
    );
  } catch (error) {
    console.error("Admin Analytics API Error [master route]:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to retrieve analytics data",
        details: process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}
