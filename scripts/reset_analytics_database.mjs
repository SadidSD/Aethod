#!/usr/bin/env node
/**
 * AEETHOD 360° — Complete Analytics Data Reset Script
 *
 * Purges all historical records from:
 * 1. analytics_events
 * 2. page_views
 * 3. sessions
 * 4. visitors
 *
 * Respects foreign-key dependencies.
 * Run: node --env-file=.env.local scripts/reset_analytics_database.mjs
 */

import { getSupabaseServerClient } from "../lib/supabase/server.js";

async function resetAnalytics() {
  const resetTimestamp = new Date().toISOString();
  console.log("================================================================");
  console.log("⚠️  AEETHOD ANALYTICS COMPLETE DATA RESET");
  console.log(`🕒 Timestamp: ${resetTimestamp}`);
  console.log("================================================================\n");

  const supabase = getSupabaseServerClient();

  // Step 1: Pre-reset count audit
  console.log("📊 Pre-reset Table Counts:");
  const tables = ["analytics_events", "page_views", "sessions", "visitors"];
  for (const table of tables) {
    const { count, error } = await supabase.from(table).select("*", { count: "exact", head: true });
    if (error) {
      console.error(`  ❌ Error querying ${table}:`, error.message);
      process.exit(1);
    }
    console.log(`  - ${table}: ${count} rows`);
  }

  // Step 2: Delete in foreign-key dependency order
  console.log("\n🗑️  Executing Foreign-Key Ordered Purge...");

  // 1. analytics_events
  console.log("  Purging analytics_events...");
  const { error: errEvents } = await supabase
    .from("analytics_events")
    .delete()
    .neq("id", "00000000-0000-0000-0000-000000000000");
  if (errEvents) {
    console.error("  ❌ Failed to purge analytics_events:", errEvents.message);
    process.exit(1);
  }
  console.log("  ✅ analytics_events purged.");

  // 2. page_views
  console.log("  Purging page_views...");
  const { error: errViews } = await supabase
    .from("page_views")
    .delete()
    .neq("id", "00000000-0000-0000-0000-000000000000");
  if (errViews) {
    console.error("  ❌ Failed to purge page_views:", errViews.message);
    process.exit(1);
  }
  console.log("  ✅ page_views purged.");

  // 3. sessions
  console.log("  Purging sessions...");
  const { error: errSessions } = await supabase
    .from("sessions")
    .delete()
    .neq("id", "00000000-0000-0000-0000-000000000000");
  if (errSessions) {
    console.error("  ❌ Failed to purge sessions:", errSessions.message);
    process.exit(1);
  }
  console.log("  ✅ sessions purged.");

  // 4. visitors
  console.log("  Purging visitors...");
  const { error: errVisitors } = await supabase
    .from("visitors")
    .delete()
    .neq("id", "00000000-0000-0000-0000-000000000000");
  if (errVisitors) {
    console.error("  ❌ Failed to purge visitors:", errVisitors.message);
    process.exit(1);
  }
  console.log("  ✅ visitors purged.");

  // Step 3: Post-reset verification
  console.log("\n🔍 Post-Reset Verification:");
  let allZero = true;
  for (const table of tables) {
    const { count, error } = await supabase.from(table).select("*", { count: "exact", head: true });
    if (error) {
      console.error(`  ❌ Error querying ${table}:`, error.message);
      process.exit(1);
    }
    console.log(`  - ${table}: ${count} rows`);
    if (count !== 0) {
      allZero = false;
    }
  }

  if (allZero) {
    console.log("\n================================================================");
    console.log("🎉 SUCCESS: All analytics records completely purged! Counts: 0/0/0/0");
    console.log(`analytics_reset_at = "${resetTimestamp}"`);
    console.log("================================================================");
    return resetTimestamp;
  } else {
    console.error("\n❌ ERROR: Some tables still contain records!");
    process.exit(1);
  }
}

resetAnalytics().catch((err) => {
  console.error("Unhandled fatal error:", err);
  process.exit(1);
});
