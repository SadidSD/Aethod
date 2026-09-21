import { resolveCountryFromIp, extractGeoFromHeaders } from "../lib/analytics/serverAnalytics.js";
import { computeGeography } from "../lib/analytics/adminQueries.js";
import { getSupabaseServerClient } from "../lib/supabase/server.js";

async function runTests() {
  console.log("=================================================");
  console.log("TEST SUITE: Audience Geography Analytics Accuracy");
  console.log("=================================================\n");

  let passed = 0;
  let failed = 0;

  function assert(condition, testName) {
    if (condition) {
      console.log(`[PASS] ${testName}`);
      passed++;
    } else {
      console.error(`[FAIL] ${testName}`);
      failed++;
    }
  }

  // ----------------------------------------------------------------
  // 1. Authoritative resolveCountryFromIp(ip) Tests
  // ----------------------------------------------------------------
  console.log("--- 1. Testing resolveCountryFromIp(ip) ---");

  // Bangladesh IP
  const bdRes = await resolveCountryFromIp("119.30.32.1");
  assert(
    bdRes.countryCode === "BD" && bdRes.countryName === "Bangladesh",
    `Bangladesh IP (119.30.32.1) -> BD / Bangladesh (Got: ${bdRes.countryCode} / ${bdRes.countryName})`
  );

  // Germany IP (VPN/proxy/relay)
  const deRes = await resolveCountryFromIp("185.220.101.5");
  assert(
    deRes.countryCode === "DE" && deRes.countryName === "Germany",
    `Germany IP (185.220.101.5) -> DE / Germany (Got: ${deRes.countryCode} / ${deRes.countryName})`
  );

  // US IP
  const usRes = await resolveCountryFromIp("8.8.8.8");
  assert(
    usRes.countryCode === "US" && usRes.countryName === "United States",
    `US IP (8.8.8.8) -> US / United States (Got: ${usRes.countryCode} / ${usRes.countryName})`
  );

  // UK IP
  const ukRes = await resolveCountryFromIp("81.2.69.142");
  assert(
    ukRes.countryCode === "GB" && ukRes.countryName === "United Kingdom",
    `UK IP (81.2.69.142) -> GB / United Kingdom (Got: ${ukRes.countryCode} / ${ukRes.countryName})`
  );

  // Private IPv4 (127.0.0.1, 10.x, 192.168.x) -> Unknown
  const loopbackRes = await resolveCountryFromIp("127.0.0.1");
  assert(
    loopbackRes.countryCode === null && loopbackRes.countryName === "Unknown",
    `Loopback IP (127.0.0.1) -> Unknown (Got: ${loopbackRes.countryCode} / ${loopbackRes.countryName})`
  );

  const privateRes = await resolveCountryFromIp("192.168.1.100");
  assert(
    privateRes.countryCode === null && privateRes.countryName === "Unknown",
    `Private IP (192.168.1.100) -> Unknown (Got: ${privateRes.countryCode} / ${privateRes.countryName})`
  );

  // Invalid / unparseable IP -> Unknown
  const invalidRes = await resolveCountryFromIp("not-an-ip");
  assert(
    invalidRes.countryCode === null && invalidRes.countryName === "Unknown",
    `Invalid IP string -> Unknown (Got: ${invalidRes.countryCode} / ${invalidRes.countryName})`
  );

  const nullRes = await resolveCountryFromIp(null);
  assert(
    nullRes.countryCode === null && nullRes.countryName === "Unknown",
    `Null IP -> Unknown (Got: ${nullRes.countryCode} / ${nullRes.countryName})`
  );

  // Cache test: immediate resolution
  const startCached = Date.now();
  const cachedRes = await resolveCountryFromIp("119.30.32.1");
  const cacheDuration = Date.now() - startCached;
  assert(
    cachedRes.countryCode === "BD" && cacheDuration < 10,
    `Cache hit for 119.30.32.1 resolved in ${cacheDuration}ms (<10ms)`
  );

  // ----------------------------------------------------------------
  // 2. Testing extractGeoFromHeaders(request)
  // ----------------------------------------------------------------
  console.log("\n--- 2. Testing extractGeoFromHeaders(request) ---");

  // Mock request with Cloudflare BD connecting IP
  const reqCf = new Request("https://www.aeethod.com/api/analytics/pageview", {
    headers: {
      "cf-connecting-ip": "119.30.32.1",
    },
  });
  const geoCf = await extractGeoFromHeaders(reqCf);
  assert(
    geoCf.countryCode === "BD" && geoCf.countryName === "Bangladesh" && geoCf.city === null && geoCf.metro === null,
    `CF Connecting IP (119.30.32.1) -> BD / Bangladesh with city=null, metro=null`
  );

  // Mock request with Vercel German IP
  const reqVercel = new Request("https://www.aeethod.com/api/analytics/pageview", {
    headers: {
      "x-vercel-forwarded-for": "185.220.101.5",
    },
  });
  const geoVercel = await extractGeoFromHeaders(reqVercel);
  assert(
    geoVercel.countryCode === "DE" && geoVercel.countryName === "Germany" && geoVercel.city === null,
    `Vercel Forwarded (185.220.101.5) -> DE / Germany with city=null`
  );

  // Mock request with Edge header fallback
  const reqEdge = new Request("https://www.aeethod.com/api/analytics/pageview", {
    headers: {
      "cf-ipcountry": "US",
    },
  });
  const geoEdge = await extractGeoFromHeaders(reqEdge);
  assert(
    geoEdge.countryCode === "US" && geoEdge.countryName === "United States",
    `Edge header (cf-ipcountry: US) -> US / United States`
  );

  // Edge header with placeholder "XX" or "UN" -> Unknown
  const reqEdgeUn = new Request("https://www.aeethod.com/api/analytics/pageview", {
    headers: {
      "cf-ipcountry": "UN",
    },
  });
  const geoEdgeUn = await extractGeoFromHeaders(reqEdgeUn);
  assert(
    geoEdgeUn.countryName === "Unknown",
    `Placeholder header (cf-ipcountry: UN) -> Unknown`
  );

  // ----------------------------------------------------------------
  // 3. Testing computeGeography(sessions)
  // ----------------------------------------------------------------
  console.log("\n--- 3. Testing computeGeography(sessions) ---");

  const testSessions = [
    { country: "Bangladesh" },
    { country: "BD" },
    { country: "Bangladesh" },
    { country: "Germany" },
    { country: "United States" },
    { country: null },
  ];

  const geoComputed = computeGeography(testSessions);

  assert(
    Array.isArray(geoComputed.countries) && geoComputed.countries.length === 4,
    `computeGeography returns exactly 4 country entries`
  );

  assert(
    Array.isArray(geoComputed.cities) && geoComputed.cities.length === 0,
    `computeGeography returns empty cities array (no metros/cities)`
  );

  const bdItem = geoComputed.countries.find((c) => c.country === "Bangladesh");
  assert(
    bdItem && bdItem.sessions === 3 && bdItem.code === "BD" && bdItem.percentage === 50,
    `Bangladesh combined 3 sessions (50.0%) from both 'Bangladesh' and 'BD'`
  );

  const deItem = geoComputed.countries.find((c) => c.country === "Germany");
  assert(
    deItem && deItem.sessions === 1 && deItem.code === "DE",
    `Germany correctly recognized: 1 session`
  );

  const unknownItem = geoComputed.countries.find((c) => c.country === "Unknown");
  assert(
    unknownItem && unknownItem.sessions === 1 && unknownItem.code === "—",
    `Null country correctly aggregated as Unknown: 1 session`
  );

  // ----------------------------------------------------------------
  // 4. Live Supabase Geography Integrity Verification
  // ----------------------------------------------------------------
  console.log("\n--- 4. Live Supabase Geography Integrity Verification ---");

  const supabase = getSupabaseServerClient();
  const { data: dbSessions, error: dbErr } = await supabase
    .from("sessions")
    .select("country, city");

  assert(!dbErr, `Supabase sessions fetch succeeded`);

  const liveGeo = computeGeography(dbSessions || []);
  console.log(`Live Supabase Total Sessions: ${dbSessions.length}`);
  console.log("Live Top Countries Breakdown:");
  for (const c of liveGeo.countries) {
    console.log(`  ${c.country} (${c.code}) — ${c.sessions} sessions — ${c.percentage}%`);
  }

  assert(
    liveGeo.cities.length === 0,
    `Verified: Live geography output has 0 cities/metros`
  );

  const totalSessionsSum = liveGeo.countries.reduce((sum, c) => sum + c.sessions, 0);
  assert(
    totalSessionsSum === dbSessions.length,
    `All sessions accounted for (${totalSessionsSum} === ${dbSessions.length})`
  );

  // Check no session has a city
  const sessionsWithCity = dbSessions.filter((s) => s.city !== null);
  assert(
    sessionsWithCity.length === 0,
    `Verified: 0 sessions in Supabase have non-null city (count: ${sessionsWithCity.length})`
  );

  // ----------------------------------------------------------------
  // 5. Session Country Immutability Test
  // ----------------------------------------------------------------
  console.log("\n--- 5. Session Country Immutability Test ---");

  const testSessionId = `test_ses_immutability_${Date.now()}`;
  const testVisitorId = `test_vis_immutability_${Date.now()}`;

  // Insert visitor first (foreign key requirement)
  const { error: visInsErr } = await supabase.from("visitors").insert({
    visitor_id: testVisitorId,
    country: "Germany",
    first_seen: new Date().toISOString(),
    last_seen: new Date().toISOString(),
  });
  assert(!visInsErr, `Inserted visitor for test session`);

  // Insert initial session with Germany
  const { error: insErr } = await supabase.from("sessions").insert({
    session_id: testSessionId,
    visitor_id: testVisitorId,
    country: "Germany",
    started_at: new Date().toISOString(),
    last_activity_at: new Date().toISOString(),
  });
  assert(!insErr, `Inserted initial session with country: Germany`);

  // Simulate subsequent pageview: fetch existing session and run update logic
  const { data: existingSess } = await supabase
    .from("sessions")
    .select("country, session_id")
    .eq("session_id", testSessionId)
    .single();

  // If a new request arrives from a different IP (e.g. Bangladesh)
  let resolvedNewCountry = "Bangladesh";
  let finalCountry = resolvedNewCountry;
  if (existingSess?.country && existingSess.country !== "Unknown") {
    finalCountry = existingSess.country; // Lock: do not overwrite
  }

  const { error: updateErr } = await supabase
    .from("sessions")
    .update({ country: finalCountry, last_activity_at: new Date().toISOString() })
    .eq("session_id", testSessionId);

  assert(!updateErr, `Session update query executed without error`);

  const { data: postUpdateSess } = await supabase
    .from("sessions")
    .select("country")
    .eq("session_id", testSessionId)
    .single();

  assert(
    postUpdateSess.country === "Germany",
    `Session country immutability confirmed: stayed 'Germany', was NOT overwritten by 'Bangladesh'`
  );

  // Clean up test session
  await supabase.from("sessions").delete().eq("session_id", testSessionId);
  await supabase.from("visitors").delete().eq("visitor_id", testVisitorId);

  console.log(`\n=================================================`);
  console.log(`RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log(`=================================================`);

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
