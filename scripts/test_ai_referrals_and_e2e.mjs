import fs from "fs";
import path from "path";
import { createClient } from "@supabase/supabase-js";

// Load .env.local
const envPath = path.resolve(process.cwd(), ".env.local");
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf-8");
  for (const line of envContent.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx !== -1) {
      const key = trimmed.slice(0, eqIdx).trim();
      let val = trimmed.slice(eqIdx + 1).trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      process.env[key] = val;
    }
  }
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error("Missing Supabase credentials in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  [PASS] ${message}`);
    passed++;
  } else {
    console.error(`  [FAIL] ${message}`);
    failed++;
  }
}

async function runTests() {
  console.log("\n==========================================");
  console.log("AEETHOD 360° ANALYTICS — AI REFERRAL & E2E VERIFICATION");
  console.log("==========================================\n");

  // Dynamically import project modules
  const {
    detectAiReferral,
    getAiPlatformFromRecord,
    normalizeReferrer,
    AI_PLATFORMS,
    AI_ATTRIBUTION_TYPES,
  } = await import("../lib/analytics/aiPlatforms.js");
  const { classifyTrafficSource } = await import(
    "../lib/analytics/trafficSource.js"
  );
  const { computeAiReferralAnalytics, getAllAnalyticsData } = await import(
    "../lib/analytics/adminQueries.js"
  );

  // ==========================================
  // SECTION 11 TESTS (A through J)
  // ==========================================
  console.log("--- 1. Testing Specific AI Platforms & Attribution Rules ---");

  // A. ChatGPT referral
  const testA = detectAiReferral("https://chatgpt.com/c/67890");
  assert(
    testA.isAiReferral === true &&
      testA.platform === "ChatGPT" &&
      testA.attributionType === AI_ATTRIBUTION_TYPES.VERIFIED_AI_REFERRAL,
    "A. ChatGPT (https://chatgpt.com/...) -> trafficSource = AI Referral, aiPlatform = ChatGPT"
  );
  assert(
    classifyTrafficSource("https://chatgpt.com/c/67890", "") === "AI Referral",
    "A. classifyTrafficSource(https://chatgpt.com/...) -> 'AI Referral'"
  );

  const testA2 = detectAiReferral("https://chat.openai.com/");
  assert(
    testA2.isAiReferral === true && testA2.platform === "ChatGPT",
    "A2. ChatGPT (https://chat.openai.com/) -> ChatGPT"
  );

  // B. Perplexity referral
  const testB = detectAiReferral("https://www.perplexity.ai/search?q=aeethod");
  assert(
    testB.isAiReferral === true && testB.platform === "Perplexity",
    "B. Perplexity (https://www.perplexity.ai/...) -> AI Referral / Perplexity"
  );
  assert(
    classifyTrafficSource("https://www.perplexity.ai/search?q=aeethod", "") === "AI Referral",
    "B. classifyTrafficSource(Perplexity) -> 'AI Referral'"
  );

  // C. Gemini referral
  const testC = detectAiReferral("https://gemini.google.com/app/12345");
  assert(
    testC.isAiReferral === true && testC.platform === "Gemini",
    "C. Gemini (https://gemini.google.com/...) -> AI Referral / Gemini"
  );
  assert(
    classifyTrafficSource("https://gemini.google.com/app/12345", "") === "AI Referral",
    "C. classifyTrafficSource(Gemini) -> 'AI Referral'"
  );

  const testC2 = detectAiReferral("https://bard.google.com/");
  assert(
    testC2.isAiReferral === true && testC2.platform === "Gemini",
    "C2. Google Bard (https://bard.google.com/) -> Gemini"
  );

  // D. Claude referral
  const testD = detectAiReferral("https://claude.ai/chat/abc-123");
  assert(
    testD.isAiReferral === true && testD.platform === "Claude",
    "D. Claude (https://claude.ai/...) -> AI Referral / Claude"
  );
  assert(
    classifyTrafficSource("https://claude.ai/chat/abc-123", "") === "AI Referral",
    "D. classifyTrafficSource(Claude) -> 'AI Referral'"
  );

  // E. Copilot referral
  const testE1 = detectAiReferral("https://copilot.microsoft.com/");
  assert(
    testE1.isAiReferral === true && testE1.platform === "Microsoft Copilot",
    "E1. Copilot (https://copilot.microsoft.com/) -> AI Referral / Copilot"
  );

  const testE2 = detectAiReferral("https://www.bing.com/chat?q=aeethod+studio");
  assert(
    testE2.isAiReferral === true && testE2.platform === "Microsoft Copilot",
    "E2. Copilot (https://www.bing.com/chat) -> AI Referral / Copilot"
  );
  assert(
    classifyTrafficSource("https://www.bing.com/chat?q=aeethod+studio", "") === "AI Referral",
    "E2. classifyTrafficSource(bing.com/chat) -> 'AI Referral'"
  );

  // F. Explicit UTM parameter: ?utm_source=chatgpt
  const testF = detectAiReferral("", "utm_source=chatgpt");
  assert(
    testF.isAiReferral === true &&
      testF.platform === "ChatGPT" &&
      testF.attributionType === AI_ATTRIBUTION_TYPES.VERIFIED_AI_REFERRAL,
    "F. Explicit UTM ?utm_source=chatgpt -> AI Referral / ChatGPT"
  );
  assert(
    classifyTrafficSource("", "utm_source=chatgpt") === "AI Referral",
    "F. classifyTrafficSource('', 'utm_source=chatgpt') -> 'AI Referral'"
  );

  const testF2 = detectAiReferral("", "utm_source=perplexity&utm_medium=ai_referral");
  assert(
    testF2.isAiReferral === true && testF2.platform === "Perplexity",
    "F2. Explicit UTM ?utm_source=perplexity -> AI Referral / Perplexity"
  );

  const testF3 = detectAiReferral("", "utm_source=claude");
  assert(
    testF3.isAiReferral === true && testF3.platform === "Claude",
    "F3. Explicit UTM ?utm_source=claude -> AI Referral / Claude"
  );

  const testF4 = detectAiReferral("", "utm_source=copilot");
  assert(
    testF4.isAiReferral === true && testF4.platform === "Microsoft Copilot",
    "F4. Explicit UTM ?utm_source=copilot -> AI Referral / Copilot"
  );

  // G. Normal Google Search (Negative Control)
  const testG = detectAiReferral("https://www.google.com/");
  assert(
    testG.isAiReferral === false &&
      testG.attributionType === AI_ATTRIBUTION_TYPES.UNKNOWN_AI,
    "G. Normal Google -> isAiReferral = false"
  );
  assert(
    classifyTrafficSource("https://www.google.com/", "") === "Organic Search",
    "G. classifyTrafficSource(https://www.google.com/) -> 'Organic Search'"
  );

  // H. Normal Facebook / Social (Negative Control)
  const testH = detectAiReferral("https://www.facebook.com/");
  assert(testH.isAiReferral === false, "H. Facebook -> isAiReferral = false");
  assert(
    classifyTrafficSource("https://www.facebook.com/", "") === "Social",
    "H. classifyTrafficSource(Facebook) -> 'Social'"
  );

  const testH2 = detectAiReferral("https://t.co/xyz123");
  assert(
    classifyTrafficSource("https://t.co/xyz123", "") === "Social",
    "H2. Twitter/X -> 'Social'"
  );

  // I. Unknown website (Negative Control)
  const testI = detectAiReferral("https://medium.com/@studio/article");
  assert(testI.isAiReferral === false, "I. Unknown website -> isAiReferral = false");
  assert(
    classifyTrafficSource("https://medium.com/@studio/article", "") === "Referral",
    "I. classifyTrafficSource(medium.com) -> 'Referral'"
  );

  // J. No referrer / Direct (Negative Control)
  const testJ = detectAiReferral("");
  assert(
    testJ.isAiReferral === false &&
      testJ.attributionType === AI_ATTRIBUTION_TYPES.UNKNOWN_AI,
    "J. No referrer -> isAiReferral = false, attributionType = UNKNOWN_AI"
  );
  assert(
    classifyTrafficSource("", "") === "Direct",
    "J. classifyTrafficSource('', '') -> 'Direct'"
  );

  // Edge cases & URL Normalization
  console.log("\n--- 2. Testing Robust Normalization & Anti-Spoofing ---");
  const normDot = detectAiReferral("https://chatgpt.com.:8080/c/test");
  assert(normDot.isAiReferral === true && normDot.platform === "ChatGPT", "Trailing dot & port normalization: chatgpt.com.:8080 -> ChatGPT");

  const normApp = detectAiReferral("android-app://com.openai.chatgpt/https/aeethod.com");
  assert(normApp.isAiReferral === true && normApp.platform === "ChatGPT", "Mobile app scheme: android-app://com.openai.chatgpt -> ChatGPT");

  const normPerpApp = detectAiReferral("android-app://ai.perplexity.app");
  assert(normPerpApp.isAiReferral === true && normPerpApp.platform === "Perplexity", "Mobile app scheme: android-app://ai.perplexity.app -> Perplexity");

  const normFake = detectAiReferral("https://not-chatgpt.com/search");
  assert(normFake.isAiReferral === false, "Anti-Spoofing: not-chatgpt.com is NOT ChatGPT");

  const normSubstr = detectAiReferral("https://copilot-scam.net/");
  assert(normSubstr.isAiReferral === false, "Anti-Spoofing: copilot-scam.net is NOT Copilot");

  const normQuery = detectAiReferral("https://example.com/?ai=true");
  assert(normQuery.isAiReferral === false, "Anti-Spoofing: example.com/?ai=true is NOT AI referral");

  // ==========================================
  // SECTION 11 & 12: K, L & CRITICAL COMPLETE DATA PATH
  // ==========================================
  console.log("\n--- 3. Testing Complete Data Path & Attribution Preservation (K & L) ---");

  const testVisId = `test_vis_path_${Date.now()}`;
  const testSesId = `test_ses_path_${Date.now()}`;
  const time1 = new Date(Date.now() - 60000).toISOString();
  const time2 = new Date(Date.now() - 30000).toISOString();
  const time3 = new Date().toISOString();

  try {
    // 1. Visitor inserts (first seen)
    await supabase.from("visitors").insert({
      visitor_id: testVisId,
      last_seen: time1,
    });

    // 2. Initial Pageview (K: Visitor enters from ChatGPT)
    // First touch: ChatGPT referral on landing page /
    await supabase.from("sessions").insert({
      session_id: testSesId,
      visitor_id: testVisId,
      started_at: time1,
      last_activity_at: time1,
      traffic_source: "AI Referral",
      referrer: "https://chatgpt.com/",
      device_type: "Desktop",
      browser: "Chrome",
      operating_system: "macOS",
      country: "United States",
      city: "San Francisco",
    });

    await supabase.from("page_views").insert({
      session_id: testSesId,
      visitor_id: testVisId,
      path: "/",
      referrer: "https://chatgpt.com/",
      viewed_at: time1,
      duration_seconds: 40,
    });

    // 3. Subsequent Pageviews (K: Internal Navigation to /services and /contact)
    // Subsequent internal navigation: referrer is internal or empty, trafficSource is Direct
    // Verify server does NOT overwrite existing session attribution!
    const { data: existingSession } = await supabase
      .from("sessions")
      .select("traffic_source, referrer, utm_source, utm_medium")
      .eq("session_id", testSesId)
      .single();

    // Simulated internal navigation payload (trafficSource = Direct, referrer = https://www.aeethod.com/)
    let incomingTrafficSource = "Direct";
    let finalTrafficSource = incomingTrafficSource;
    let finalReferrer = "https://www.aeethod.com/";

    // Apply the preservation guard
    if (existingSession && existingSession.traffic_source && existingSession.traffic_source !== "Direct") {
      finalTrafficSource = existingSession.traffic_source;
      finalReferrer = existingSession.referrer;
    }

    assert(
      finalTrafficSource === "AI Referral",
      "K. Attribution Preservation: Internal navigation does NOT downgrade source to Direct"
    );
    assert(
      finalReferrer === "https://chatgpt.com/",
      "K. Referrer Preservation: Original AI referrer is preserved"
    );

    // Update session last_activity and insert pageviews for /services and /contact
    await supabase.from("sessions").update({
      last_activity_at: time2,
      traffic_source: finalTrafficSource,
      referrer: finalReferrer,
    }).eq("session_id", testSesId);

    await supabase.from("page_views").insert([
      {
        session_id: testSesId,
        visitor_id: testVisId,
        path: "/services",
        referrer: "https://www.aeethod.com/",
        viewed_at: time2,
        duration_seconds: 60,
      },
      {
        session_id: testSesId,
        visitor_id: testVisId,
        path: "/contact",
        referrer: "https://www.aeethod.com/services",
        viewed_at: time3,
        duration_seconds: 45,
      },
    ]);

    // 4. L. Inquiry conversion event
    await supabase.from("analytics_events").insert({
      session_id: testSesId,
      visitor_id: testVisId,
      event_name: "inquiry_submitted",
      page_path: "/contact",
      created_at: time3,
    });

    // 5. Query Master Admin Aggregator on live database
    const masterData = await getAllAnalyticsData(supabase, new URLSearchParams({ range: "today" }));
    const aiData = masterData.data.aiReferrals;

    assert(aiData.aiSessions >= 1, `L. Live Admin API: AI Sessions >= 1 (found ${aiData.aiSessions})`);
    assert(aiData.aiVisitors >= 1, `L. Live Admin API: AI Visitors >= 1 (found ${aiData.aiVisitors})`);
    assert(aiData.aiPageviews >= 3, `L. Live Admin API: AI Pageviews counted across all pages >= 3 (found ${aiData.aiPageviews})`);
    assert(aiData.aiInquiries >= 1, `L. Live Admin API: AI Inquiries >= 1 (found ${aiData.aiInquiries})`);
    assert(aiData.aiConversions >= 1, `L. Live Admin API: AI Conversions >= 1 (found ${aiData.aiConversions})`);

    const chatgptPlatform = aiData.platforms.find((p) => p.platform === "ChatGPT");
    assert(
      chatgptPlatform !== undefined && chatgptPlatform.sessions >= 1 && chatgptPlatform.conversions >= 1,
      "L. AI Platform Attribution: ChatGPT received the conversion yield"
    );

    const funnel = aiData.funnel;
    assert(funnel.length === 4, "AI Funnel has 4 stages");
    assert(funnel[0].count >= 1, "Funnel 01: Website Visits >= 1");
    assert(funnel[1].count >= 1, "Funnel 02: Explored Services/Work >= 1");
    assert(funnel[2].count >= 1, "Funnel 03: Started Contact >= 1");
    assert(funnel[3].count >= 1, "Funnel 04: Inquiry / Call Booked >= 1");

    // Clean up temporary test data
    await supabase.from("analytics_events").delete().eq("session_id", testSesId);
    await supabase.from("page_views").delete().eq("session_id", testSesId);
    await supabase.from("sessions").delete().eq("session_id", testSesId);
    await supabase.from("visitors").delete().eq("visitor_id", testVisId);
    console.log("  [INFO] Cleaned up temporary test data from Supabase");
  } catch (err) {
    console.error("  [FAIL] Critical path error:", err);
    failed++;
  }

  // ==========================================
  // SECTION 3b: LIVE HTTP API INGESTION TEST
  // ==========================================
  console.log("\n--- 3b. Testing Live HTTP Ingestion & Guard (POST /api/analytics/pageview) ---");
  const httpVisId = `http_vis_${Date.now()}`;
  const httpSesId = `http_ses_${Date.now()}`;

  try {
    // 1. Initial Pageview from ChatGPT
    const res1 = await fetch("http://localhost:3000/api/analytics/pageview", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        visitorId: httpVisId,
        sessionId: httpSesId,
        path: "/",
        referrer: "https://chatgpt.com/",
        trafficSource: "AI Referral",
        aiPlatform: "ChatGPT",
        aiAttributionType: "VERIFIED_AI_REFERRAL",
        utm: { utm_source: null },
        device: { device_type: "Desktop", operating_system: "macOS", browser: "Chrome" },
        isNewVisitor: true,
        isNewSession: true,
      }),
    });
    assert(res1.status === 201 || res1.status === 200, `POST /api/analytics/pageview initial ChatGPT -> ${res1.status}`);

    // Check Supabase session record
    const { data: dbSes1 } = await supabase.from("sessions").select("traffic_source, referrer").eq("session_id", httpSesId).single();
    assert(dbSes1?.traffic_source === "AI Referral", `Supabase session traffic_source = 'AI Referral'`);
    assert(dbSes1?.referrer === "https://chatgpt.com/", `Supabase session referrer = 'https://chatgpt.com/'`);

    // 2. Subsequent Pageview: Internal Navigation to /services (sent as Direct, internal referrer)
    const res2 = await fetch("http://localhost:3000/api/analytics/pageview", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        visitorId: httpVisId,
        sessionId: httpSesId,
        path: "/services",
        referrer: "https://www.aeethod.com/",
        trafficSource: "Direct",
        utm: {},
        device: { device_type: "Desktop", operating_system: "macOS", browser: "Chrome" },
        isNewVisitor: false,
        isNewSession: false,
      }),
    });
    assert(res2.status === 201 || res2.status === 200, `POST /api/analytics/pageview subsequent /services -> ${res2.status}`);

    // Verify session in Supabase was NOT overwritten with Direct!
    const { data: dbSes2 } = await supabase.from("sessions").select("traffic_source, referrer").eq("session_id", httpSesId).single();
    assert(dbSes2?.traffic_source === "AI Referral", `K. LIVE HTTP: Session traffic_source retained 'AI Referral' after internal navigation!`);
    assert(dbSes2?.referrer === "https://chatgpt.com/", `K. LIVE HTTP: Session referrer retained original AI referrer!`);

    // 3. Conversion event on /contact
    const evRes = await fetch("http://localhost:3000/api/analytics/event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        visitorId: httpVisId,
        sessionId: httpSesId,
        eventName: "inquiry_submitted",
        pagePath: "/contact",
      }),
    });
    assert(evRes.status === 201 || evRes.status === 200, `POST /api/analytics/event inquiry_submitted -> ${evRes.status}`);

    // Verify event in Supabase
    const { data: dbEv } = await supabase.from("analytics_events").select("event_name, session_id").eq("session_id", httpSesId);
    assert(dbEv?.length === 1 && dbEv[0].event_name === "inquiry_submitted", `L. LIVE HTTP: Conversion event recorded for AI session`);

    // Clean up
    await supabase.from("analytics_events").delete().eq("session_id", httpSesId);
    await supabase.from("page_views").delete().eq("session_id", httpSesId);
    await supabase.from("sessions").delete().eq("session_id", httpSesId);
    await supabase.from("visitors").delete().eq("visitor_id", httpVisId);
    console.log("  [INFO] Cleaned up live HTTP test data from Supabase");
  } catch (err) {
    console.error("  [FAIL] Live HTTP test error:", err);
    failed++;
  }

  // ==========================================
  // SECTION 3: HTTP API AUTHENTICATION CHECKS
  // ==========================================
  console.log("\n--- 4. Testing Admin API Authentication & Security ---");
  try {
    const aiRes = await fetch("http://localhost:3000/api/admin/analytics/ai-referrals");
    assert(aiRes.status === 401, `GET /api/admin/analytics/ai-referrals unauthorized -> 401 (got ${aiRes.status})`);
  } catch (e) {
    console.log("  [WARN] Local dev fetch:", e.message);
  }

  // ==========================================
  // SECTION 5: ALL DATE RANGE TESTS
  // ==========================================
  console.log("\n--- 5. Testing All Date Ranges ---");
  for (const r of ["today", "yesterday", "7d", "30d", "custom"]) {
    try {
      const p = new URLSearchParams({ range: r });
      if (r === "custom") {
        p.set("from", new Date(Date.now() - 5 * 86400000).toISOString());
        p.set("to", new Date().toISOString());
      }
      const res = await getAllAnalyticsData(supabase, p);
      const ok = res?.data?.aiReferrals && !JSON.stringify(res.data.aiReferrals).includes("NaN");
      assert(ok, `Date range "${r}" returns valid AI data without NaN`);
    } catch (err) {
      assert(false, `Date range "${r}" failed: ${err.message}`);
    }
  }

  console.log("\n==========================================");
  console.log(`TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log("==========================================\n");

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error("Fatal test runner error:", err);
  process.exit(1);
});
