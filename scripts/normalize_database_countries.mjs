import { getSupabaseServerClient } from "../lib/supabase/server.js";
import { resolveCountry } from "../lib/analytics/serverAnalytics.js";

async function normalizeDatabase() {
  const supabase = getSupabaseServerClient();

  console.log("--> Fetching all sessions from Supabase...");
  const { data: sessions, error: sessErr } = await supabase
    .from("sessions")
    .select("session_id, country, city");

  if (sessErr) {
    console.error("Error fetching sessions:", sessErr.message);
    process.exit(1);
  }

  console.log(`Found ${sessions.length} sessions.`);

  let updatedCount = 0;
  for (const s of sessions) {
    const resolved = resolveCountry(s.country);
    const canonicalName = resolved.name !== "Unknown" ? resolved.name : null;
    const needsCountryUpdate = s.country !== canonicalName && (s.country || canonicalName);
    const needsCityNull = s.city !== null;

    if (needsCountryUpdate || needsCityNull) {
      const { error: upErr } = await supabase
        .from("sessions")
        .update({
          country: canonicalName,
          city: null,
        })
        .eq("session_id", s.session_id);

      if (upErr) {
        console.error(`Failed to update session ${s.session_id}:`, upErr.message);
      } else {
        updatedCount++;
      }
    }
  }

  console.log(`Successfully normalized ${updatedCount} sessions in Supabase.`);

  // Also normalize visitors
  console.log("--> Normalizing visitors table...");
  const { data: visitors, error: visErr } = await supabase
    .from("visitors")
    .select("visitor_id, country, city");

  if (!visErr && visitors) {
    let visUpdated = 0;
    for (const v of visitors) {
      const resolved = resolveCountry(v.country);
      const canonicalName = resolved.name !== "Unknown" ? resolved.name : null;
      if (v.country !== canonicalName || v.city !== null) {
        await supabase
          .from("visitors")
          .update({
            country: canonicalName,
            city: null,
          })
          .eq("visitor_id", v.visitor_id);
        visUpdated++;
      }
    }
    console.log(`Successfully normalized ${visUpdated} visitors in Supabase.`);
  }

  // Verify resulting sessions count and country distribution
  const { data: verifiedSessions } = await supabase
    .from("sessions")
    .select("country, city");

  const distribution = {};
  for (const s of verifiedSessions || []) {
    const k = s.country || "Unknown";
    distribution[k] = (distribution[k] || 0) + 1;
  }

  console.log("\nNormalized Supabase Country Distribution:");
  console.table(distribution);
}

normalizeDatabase().catch(console.error);
