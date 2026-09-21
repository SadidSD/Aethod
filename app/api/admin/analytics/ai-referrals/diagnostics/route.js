import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import {
  requireAdminAuth,
  parseDateRange,
  fetchRawAnalyticsData,
  computeAiDiagnostics,
} from "@/lib/analytics/adminQueries";
import { AI_PLATFORMS } from "@/lib/analytics/aiPlatforms";

export const dynamic = "force-dynamic";

/**
 * GET /api/admin/analytics/ai-referrals/diagnostics
 *
 * Internal diagnostic and discovery endpoint:
 * - Monitors recognized AI platform counts
 * - Discovers unclassified candidate AI referrer domains (unknown_referrer_host)
 * - Inspects UTM campaign detections
 * - Audits unattributed direct sessions
 */
export async function GET(request) {
  try {
    const auth = await requireAdminAuth(request);
    if (!auth.authenticated) return auth.response;

    const supabase = getSupabaseServerClient();
    const rangeInfo = parseDateRange(request.nextUrl.searchParams);

    const rawData = await fetchRawAnalyticsData(supabase, rangeInfo.from, rangeInfo.to);
    const diagnostics = computeAiDiagnostics(rawData.sessions, rawData.pageViews, rawData.events);

    return NextResponse.json(
      {
        success: true,
        meta: {
          range: rangeInfo.range,
          from: rangeInfo.from.toISOString(),
          to: rangeInfo.to.toISOString(),
          registeredPlatformsCount: AI_PLATFORMS.length,
        },
        diagnostics,
        registeredPlatforms: AI_PLATFORMS.map((p) => ({
          id: p.id,
          name: p.canonicalName || p.name,
          domains: p.domains,
          aliases: p.aliases,
          utmSources: p.utmSources,
        })),
      },
      {
        status: 200,
        headers: { "Cache-Control": "private, no-cache, no-store, must-revalidate" },
      }
    );
  } catch (error) {
    console.error("Admin Analytics API Error [ai-referrals/diagnostics]:", error);
    return NextResponse.json({ success: false, error: "Failed to retrieve diagnostics" }, { status: 500 });
  }
}
