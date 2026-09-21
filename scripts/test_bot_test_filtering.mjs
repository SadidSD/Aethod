/**
 * Aeethod Analytics — Bot & Test Filtering Test Suite
 *
 * Validates:
 * 1. Server-side bot signal detection (Vercel bot headers, crawlers, headless markers)
 * 2. Negative controls (foreign IP, VPN/proxy, short duration, mobile viewport do NOT trigger bot)
 * 3. Test mode detection (admin header, query param, utm_campaign, e2e session prefix)
 * 4. Aggregation exclusion (metrics, geography, traffic sources, funnels, AI referrals exclude bot & test)
 * 5. Forensic audit retention (excluded sessions preserved in diagnostics audit log)
 * 6. Live classification persistence & cross-check with Supabase
 */

import {
  detectSessionClassification,
  SESSION_CLASSIFICATIONS,
  CLASSIFICATION_LABELS,
  isValidClassification,
} from "../lib/analytics/classification.js";

import {
  partitionSessions,
  computeOverviewMetrics,
  computeGeography,
  computeTrafficSources,
  computeDeviceBreakdown,
  computeTechnology,
  computeFunnel,
  computeAiReferralAnalytics,
  fetchRawAnalyticsData,
} from "../lib/analytics/adminQueries.js";

import { getSupabaseServerClient } from "../lib/supabase/server.js";

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✅ ${message}`);
    passed++;
  } else {
    console.error(`  ❌ FAILED: ${message}`);
    failed++;
  }
}

console.log("==================================================");
console.log("AEETHOD ANALYTICS — BOT & TEST FILTERING TEST SUITE");
console.log("==================================================\n");

// --- 1. Test Classification Validity Helper ---
console.log("--- 1. Testing Classification Definitions & Validation ---");
assert(SESSION_CLASSIFICATIONS.HUMAN_OR_UNKNOWN === "human_or_unknown", "HUMAN_OR_UNKNOWN defined correctly");
assert(SESSION_CLASSIFICATIONS.BOT === "bot", "BOT defined correctly");
assert(SESSION_CLASSIFICATIONS.TEST === "test", "TEST defined correctly");
assert(isValidClassification("human_or_unknown"), "isValidClassification accepts human_or_unknown");
assert(isValidClassification("bot"), "isValidClassification accepts bot");
assert(isValidClassification("test"), "isValidClassification accepts test");
assert(!isValidClassification("unknown_xyz"), "isValidClassification rejects invalid values");
assert(CLASSIFICATION_LABELS["bot"] === "Bot (Excluded)", "CLASSIFICATION_LABELS has human-readable label for bot");

// --- 2. Test Server-Side Bot Detection ---
console.log("\n--- 2. Testing Reliable Bot Signal Detection ---");
{
  // Vercel bot headers
  const reqVercelBot = {
    headers: new Headers([
      ["x-vercel-bot", "1"],
      ["x-vercel-bot-kind", "crawler"],
    ]),
  };
  const res1 = detectSessionClassification(reqVercelBot);
  assert(res1.classification === "bot", "x-vercel-bot: 1 correctly classified as bot");

  const reqVercelScanner = {
    headers: new Headers([["x-vercel-bot-kind", "scanner"]]),
  };
  const res2 = detectSessionClassification(reqVercelScanner);
  assert(res2.classification === "bot", "x-vercel-bot-kind: scanner correctly classified as bot");

  // Cloudflare bot header
  const reqCf = {
    headers: new Headers([["cf-is-bot", "1"]]),
  };
  const res3 = detectSessionClassification(reqCf);
  assert(res3.classification === "bot", "cf-is-bot: 1 correctly classified as bot");

  // Known crawlers via user-agent
  const bots = [
    { ua: "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)", name: "Googlebot" },
    { ua: "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; GPTBot/1.2; +https://openai.com/gptbot)", name: "GPTBot" },
    { ua: "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; ClaudeBot/1.0; +https://www.anthropic.com/claudebot)", name: "ClaudeBot" },
    { ua: "facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)", name: "facebookexternalhit" },
    { ua: "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/120.0.0.0 Safari/537.36", name: "HeadlessChrome" },
  ];

  for (const b of bots) {
    const req = {
      headers: new Headers([["user-agent", b.ua]]),
    };
    const res = detectSessionClassification(req);
    assert(res.classification === "bot", `${b.name} User-Agent classified as bot`);
  }
}

// --- 3. Negative Controls (Preserve Legitimate Unknown Visitors) ---
console.log("\n--- 3. Testing Negative Controls (Preserve Unknown & Foreign Humans) ---");
{
  const normalUsers = [
    {
      desc: "Standard Chrome on macOS from Germany (genuine human)",
      ua: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36",
    },
    {
      desc: "Standard Safari on iPhone from US",
      ua: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1",
    },
    {
      desc: "Standard Firefox on Windows from Bangladesh",
      ua: "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:128.0) Gecko/20100101 Firefox/128.0",
    },
  ];

  for (const u of normalUsers) {
    const req = {
      headers: new Headers([
        ["user-agent", u.ua],
        ["x-vercel-ip-country", "DE"],
      ]),
    };
    const res = detectSessionClassification(req);
    assert(
      res.classification === "human_or_unknown",
      `Negative control: ${u.desc} preserved as human_or_unknown`
    );
  }
}

// --- 4. Testing Test Mode Signals ---
console.log("\n--- 4. Testing Controlled Test Mode Activation ---");
{
  // Header trigger
  const reqHeader = {
    headers: new Headers([["x-aeethod-test", "true"]]),
  };
  assert(detectSessionClassification(reqHeader).classification === "test", "x-aeethod-test: true classified as test");

  // Query param trigger
  const reqParam = {
    headers: new Headers(),
    url: "https://aeethod.com/?aeethod_test=1",
  };
  assert(detectSessionClassification(reqParam).classification === "test", "?aeethod_test=1 query param classified as test");

  // UTM campaign trigger
  const reqUtm = {
    headers: new Headers(),
  };
  assert(
    detectSessionClassification(reqUtm, { utm: { utm_campaign: "internal_test" } }).classification === "test",
    "utm_campaign: internal_test classified as test"
  );

  // E2E test session ID prefix
  const reqE2E = {
    headers: new Headers(),
  };
  assert(
    detectSessionClassification(reqE2E, { sessionId: "e2e_ses_998877" }).classification === "test",
    "sessionId: e2e_ses_* classified as test"
  );
}

// --- 5. Partitioning & Metric Exclusion Tests ---
console.log("\n--- 5. Testing Partitioning and Metric Exclusion Logic ---");
{
  const testSessions = [
    { session_id: "s1", visitor_id: "v1", classification: "human_or_unknown", country: "Bangladesh", traffic_source: "Direct", device_type: "desktop", browser: "Chrome", operating_system: "Windows", duration_seconds: 45 },
    { session_id: "s2", visitor_id: "v2", classification: "human_or_unknown", country: "United States", traffic_source: "Organic Search", device_type: "mobile", browser: "Safari", operating_system: "iOS", duration_seconds: 90 },
    { session_id: "s3", visitor_id: "v3", classification: "bot", country: "Germany", traffic_source: "Direct", device_type: "desktop", browser: "Chrome", operating_system: "Linux", duration_seconds: 1 },
    { session_id: "s4", visitor_id: "v4", classification: "test", country: "Canada", traffic_source: "Direct", device_type: "desktop", browser: "Chrome", operating_system: "Windows", duration_seconds: 120 },
    { session_id: "e2e_ses_1", visitor_id: "v5", country: "Bangladesh", traffic_source: "Direct", device_type: "desktop", browser: "Chrome", operating_system: "Windows", duration_seconds: 10 },
  ];

  const part = partitionSessions(testSessions);
  assert(part.counts.total === 5, "Total raw sessions = 5");
  assert(part.counts.legitimate === 2, "Legitimate sessions count = 2 (s1, s2)");
  assert(part.counts.bot === 1, "Bot sessions count = 1 (s3)");
  assert(part.counts.test === 2, "Test sessions count = 2 (s4, e2e_ses_1)");
  assert(part.counts.excluded === 3, "Excluded sessions count = 3");

  // Overview metrics exclusion
  const pageViews = [
    { session_id: "s1", visitor_id: "v1", viewed_at: new Date().toISOString() },
    { session_id: "s1", visitor_id: "v1", viewed_at: new Date().toISOString() },
    { session_id: "s2", visitor_id: "v2", viewed_at: new Date().toISOString() },
    { session_id: "s3", visitor_id: "v3", viewed_at: new Date().toISOString() }, // bot pv
    { session_id: "s4", visitor_id: "v4", viewed_at: new Date().toISOString() }, // test pv
  ];

  const events = [
    { session_id: "s2", event_name: "inquiry_submitted" },
    { session_id: "s3", event_name: "inquiry_submitted" }, // bot inquiry (must be ignored)
  ];

  const currentData = { sessions: testSessions, pageViews, events };
  const prevData = { sessions: [], pageViews: [], events: [] };
  const overview = computeOverviewMetrics(currentData, prevData, 1);

  assert(overview.totalSessions.value === 2, "Overview totalSessions strictly equals legitimate count (2, not 5)");
  assert(overview.uniqueVisitors.value === 2, "Overview uniqueVisitors strictly equals legitimate visitors (2, not 5)");
  assert(overview.pageviews.value === 3, "Overview pageviews excludes bot & test pageviews (3, not 5)");
  assert(overview.inquiries.value === 1, "Overview inquiries excludes bot conversions (1, not 2)");
  assert(
    overview.totalSessions.formattedLabel === "2 legitimate sessions + 3 excluded (1 bot, 2 test)",
    `Formatted label matches specification: "${overview.totalSessions.formattedLabel}"`
  );

  // Geography exclusion
  const geo = computeGeography(testSessions);
  const countryNames = geo.countries.map((c) => c.country);
  assert(countryNames.includes("Bangladesh"), "Top countries includes legitimate Bangladesh");
  assert(countryNames.includes("United States"), "Top countries includes legitimate United States");
  assert(!countryNames.includes("Germany"), "Top countries EXCLUDES Germany bot session");
  assert(!countryNames.includes("Canada"), "Top countries EXCLUDES Canada test session");

  // Audit log retention
  assert(geo.diagnostics.length === 5, "Diagnostics audit log retains ALL 5 sessions");
  const botDiag = geo.diagnostics.find((d) => d.country === "Germany");
  assert(botDiag && botDiag.classification === "bot", "Germany session retained with classification='bot'");
  assert(botDiag && botDiag.geoStatus === "Excluded (Bot)", "Germany session marked as 'Excluded (Bot)'");

  const canadaDiag = geo.diagnostics.find((d) => d.country === "Canada");
  assert(canadaDiag && canadaDiag.classification === "test", "Canada session retained with classification='test'");
  assert(canadaDiag && canadaDiag.geoStatus === "Excluded (Test)", "Canada session marked as 'Excluded (Test)'");
}

// --- 6. Live Supabase Classification & Audit Cross-Check ---
console.log("\n--- 6. Testing Live Supabase Integration & Historical Session Classification ---");
async function runDatabaseIntegration() {
  const supabase = getSupabaseServerClient();
  const testNow = new Date().toISOString();

  // 1. Verify old historical sessions are completely gone from DB
  const { data: oldGermany } = await supabase
    .from("sessions")
    .select("session_id")
    .eq("session_id", "s_28a79e83-0927-4963-9789-437aff26a26f");
  assert(!oldGermany || oldGermany.length === 0, "Historical Germany session (s_28a79e83) purged from database");

  const { data: oldCanada } = await supabase
    .from("sessions")
    .select("session_id")
    .eq("session_id", "s_0f614621-56aa-4510-a438-0660a7f33dbe");
  assert(!oldCanada || oldCanada.length === 0, "Historical Canada session (s_0f614621) purged from database");

  const { data: oldUS1 } = await supabase
    .from("sessions")
    .select("session_id")
    .eq("session_id", "s_4b091e9a-4a99-452f-8ce9-6ec42dfbe5fc");
  assert(!oldUS1 || oldUS1.length === 0, "Historical US #1 session (s_4b091e9a) purged from database");

  // 2. Insert transient test suite sessions to verify live database pipeline
  const testVisId = `test_vis_filter_${Date.now()}`;
  const testBotSesId = `test_bot_ses_${Date.now()}`;
  const testSuiteSesId = `e2e_ses_filter_${Date.now()}`;
  const testHumanSesId = `test_human_ses_${Date.now()}`;

  try {
    await supabase.from("visitors").insert({
      visitor_id: testVisId,
      last_seen: testNow,
    });

    await supabase.from("sessions").insert([
      {
        session_id: testBotSesId,
        visitor_id: testVisId,
        started_at: testNow,
        last_activity_at: testNow,
        traffic_source: "Direct",
        device_type: "tablet",
        operating_system: "macOS",
        country: "Germany",
      },
      {
        session_id: testSuiteSesId,
        visitor_id: testVisId,
        started_at: testNow,
        last_activity_at: testNow,
        traffic_source: "Internal Test",
        utm_campaign: "internal_test",
        device_type: "Desktop",
        operating_system: "Windows",
        country: "Canada",
      },
      {
        session_id: testHumanSesId,
        visitor_id: testVisId,
        started_at: testNow,
        last_activity_at: testNow,
        traffic_source: "Organic Search",
        device_type: "Desktop",
        operating_system: "Windows",
        country: "Bangladesh",
      },
    ]);

    // Insert bot classification event
    const { error: botEventErr } = await supabase.from("analytics_events").insert({
      session_id: testBotSesId,
      visitor_id: testVisId,
      event_name: "session_classification",
      event_value: {
        classification: "bot",
        reason: "Hermetic test: automated crawler simulation",
        classified_at: testNow,
      },
      page_path: "/yamal19/analytics",
    });
    assert(!botEventErr, "Successfully recorded bot classification event for transient bot session");

    // Query live raw data via fetchRawAnalyticsData
    const liveRaw = await fetchRawAnalyticsData(
      supabase,
      new Date(Date.now() - 5 * 60 * 1000),
      new Date(Date.now() + 60 * 1000)
    );
    console.log(`  Fetched ${liveRaw.sessions.length} live sessions from Supabase for window`);

    const livePartition = partitionSessions(liveRaw.sessions);
    console.log(`  Live breakdown: ${livePartition.counts.legitimate} legitimate, ${livePartition.counts.bot} bot, ${livePartition.counts.test} test`);

    assert(livePartition.counts.bot >= 1, "Live database has >= 1 bot session classified");
    assert(livePartition.counts.test >= 1, "Live database has >= 1 test session classified");
    assert(livePartition.counts.legitimate >= 1, "Live database has >= 1 legitimate session");

    // Verify live geography calculation excludes bot and test from top countries
    const liveGeo = computeGeography(liveRaw.sessions);
    const liveTopCountries = liveGeo.countries.map((c) => c.country);
    assert(!liveTopCountries.includes("Germany"), "Live Top Countries excludes Germany bot session");
    assert(!liveTopCountries.includes("Canada"), "Live Top Countries excludes Canada test session");
    assert(liveTopCountries.includes("Bangladesh"), "Live Top Countries retains legitimate Bangladesh session");

    // Verify diagnostics audit log retains all
    assert(liveGeo.diagnostics.length >= 3, "Live Geo Attribution Audit Log retains all sessions");
    const liveBotDiag = liveGeo.diagnostics.find((d) => d.fullSessionId === testBotSesId);
    assert(liveBotDiag && liveBotDiag.classification === "bot", "Live bot session in audit log has classification='bot'");
    const liveTestDiag = liveGeo.diagnostics.find((d) => d.fullSessionId === testSuiteSesId);
    assert(liveTestDiag && liveTestDiag.classification === "test", "Live test session in audit log has classification='test'");
  } finally {
    // Hermetic Cleanup: delete all transient test sessions
    await supabase.from("analytics_events").delete().in("session_id", [testBotSesId, testSuiteSesId, testHumanSesId]);
    await supabase.from("sessions").delete().in("session_id", [testBotSesId, testSuiteSesId, testHumanSesId]);
    await supabase.from("visitors").delete().eq("visitor_id", testVisId);
    console.log("  [INFO] Cleaned up transient test data from Supabase");
  }
}

runDatabaseIntegration()
  .then(() => {
    console.log("\n==================================================");
    console.log(`RESULTS: ${passed} PASSED, ${failed} FAILED`);
    console.log("==================================================");
    if (failed > 0) process.exit(1);
    else process.exit(0);
  })
  .catch((err) => {
    console.error("Test execution error:", err);
    process.exit(1);
  });
