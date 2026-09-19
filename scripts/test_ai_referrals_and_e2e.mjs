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
  const { detectAiReferral, getAiPlatformFromRecord, AI_PLATFORMS } = await import(
    "../lib/analytics/aiPlatforms.js"
  );
  const { classifyTrafficSource } = await import(
    "../lib/analytics/trafficSource.js"
  );
  const { computeAiReferralAnalytics, getAllAnalyticsData } = await import(
    "../lib/analytics/adminQueries.js"
  );

  // 1. UNIT TESTS: AI Platform Detection
  console.log("--- 1. Testing AI Platform Detection ---");
  const testCases = [
    { ref: "https://chatgpt.com/", search: "", expected: "ChatGPT" },
    { ref: "https://chat.openai.com/", search: "", expected: "ChatGPT" },
    { ref: "https://www.perplexity.ai/search?q=aeethod", search: "", expected: "Perplexity" },
    { ref: "https://gemini.google.com/app", search: "", expected: "Gemini" },
    { ref: "https://claude.ai/chat/123", search: "", expected: "Claude" },
    { ref: "https://copilot.microsoft.com/", search: "", expected: "Microsoft Copilot" },
    { ref: "https://www.bing.com/chat?q=aeethod", search: "", expected: "Microsoft Copilot" },
    { ref: "https://poe.com/", search: "", expected: "Poe" },
    { ref: "https://you.com/search", search: "", expected: "You.com" },
    { ref: "https://chat.deepseek.com/", search: "", expected: "DeepSeek" },
    { ref: "https://grok.com/", search: "", expected: "Grok" },
    { ref: "https://x.ai/", search: "", expected: "Grok" },
    { ref: "https://www.meta.ai/", search: "", expected: "Meta AI" },
    { ref: "", search: "utm_source=chatgpt&utm_medium=referral", expected: "ChatGPT" },
    { ref: "", search: "utm_source=perplexity&utm_medium=ai", expected: "Perplexity" },
    { ref: "", search: "utm_source=claude&utm_medium=ai_referral", expected: "Claude" },
  ];

  for (const tc of testCases) {
    const params = new URLSearchParams(tc.search);
    const result = detectAiReferral(tc.ref, params);
    assert(
      result.isAiReferral === true && result.platform === tc.expected,
      `detectAiReferral("${tc.ref || tc.search}") -> ${tc.expected}`
    );

    const classified = classifyTrafficSource(tc.ref, params);
    assert(
      classified === "AI Referral",
      `classifyTrafficSource("${tc.ref || tc.search}") -> "AI Referral"`
    );
  }

  // 2. NEGATIVE CONTROLS: ZERO FALSE POSITIVES
  console.log("\n--- 2. Testing Negative Controls (Zero False Positives) ---");
  const negativeCases = [
    { ref: "https://www.google.com/", search: "", expected: "Organic Search" },
    { ref: "https://www.bing.com/search?q=aeethod", search: "", expected: "Organic Search" },
    { ref: "https://t.co/abc123", search: "", expected: "Social" },
    { ref: "https://www.instagram.com/", search: "", expected: "Social" },
    { ref: "https://www.linkedin.com/feed/", search: "", expected: "Social" },
    { ref: "https://medium.com/@design/article", search: "", expected: "Referral" },
    { ref: "https://awwwards.com/sites/aeethod", search: "", expected: "Referral" },
    { ref: "", search: "", expected: "Direct" },
  ];

  for (const nc of negativeCases) {
    const params = new URLSearchParams(nc.search);
    const aiCheck = detectAiReferral(nc.ref, params);
    assert(
      aiCheck.isAiReferral === false,
      `Negative Control: detectAiReferral("${nc.ref}") -> isAiReferral === false`
    );

    const classified = classifyTrafficSource(nc.ref, params);
    assert(
      classified === nc.expected,
      `Negative Control: classifyTrafficSource("${nc.ref}") -> "${nc.expected}"`
    );
  }

  // 3. API AUTHENTICATION TESTS (401 on unauthenticated requests)
  console.log("\n--- 3. Testing Admin API Authentication Protection ---");
  try {
    const aiRes = await fetch("http://localhost:3000/api/admin/analytics/ai-referrals");
    assert(aiRes.status === 401, `GET /api/admin/analytics/ai-referrals without auth returns 401 (got ${aiRes.status})`);
  } catch (err) {
    console.log("  [WARN] Local dev server might not be answering fetch directly:", err.message);
  }

  try {
    const masterRes = await fetch("http://localhost:3000/api/admin/analytics");
    assert(masterRes.status === 401, `GET /api/admin/analytics without auth returns 401 (got ${masterRes.status})`);
  } catch (err) {
    console.log("  [WARN] Local dev server might not be answering fetch directly:", err.message);
  }

  // 4. LIVE DATABASE ROUND-TRIP TEST WITH REAL SUPABASE
  console.log("\n--- 4. Live Supabase Ingestion & Attribution Round-Trip ---");
  const testVisitorId = `test_ai_vis_${Date.now()}`;
  const testSessionId = `test_ai_ses_${Date.now()}`;
  const now = new Date().toISOString();

  try {
    // A. Insert test visitor
    const { error: visErr } = await supabase.from("visitors").insert({
      visitor_id: testVisitorId,
      last_seen: now,
    });
    assert(!visErr, `Supabase insert test visitor: ${visErr?.message || "OK"}`);

    // B. Insert test AI session (ChatGPT)
    const { error: sesErr } = await supabase.from("sessions").insert({
      session_id: testSessionId,
      visitor_id: testVisitorId,
      started_at: now,
      last_activity_at: now,
      traffic_source: "AI Referral",
      referrer: "https://chatgpt.com/",
      device_type: "Desktop",
      browser: "Chrome",
      operating_system: "macOS",
      country: "United States",
      city: "San Francisco",
    });
    assert(!sesErr, `Supabase insert test AI session: ${sesErr?.message || "OK"}`);

    // C. Insert page views for the session (/ -> /services -> /contact)
    const { error: pvErr } = await supabase.from("page_views").insert([
      {
        session_id: testSessionId,
        visitor_id: testVisitorId,
        path: "/",
        viewed_at: now,
        duration_seconds: 45,
      },
      {
        session_id: testSessionId,
        visitor_id: testVisitorId,
        path: "/services",
        viewed_at: now,
        duration_seconds: 60,
      },
      {
        session_id: testSessionId,
        visitor_id: testVisitorId,
        path: "/contact",
        viewed_at: now,
        duration_seconds: 30,
      },
    ]);
    assert(!pvErr, `Supabase insert test page views: ${pvErr?.message || "OK"}`);

    // D. Insert inquiry conversion event
    const { error: evErr } = await supabase.from("analytics_events").insert({
      session_id: testSessionId,
      visitor_id: testVisitorId,
      event_name: "inquiry_submitted",
      page_path: "/contact",
      created_at: now,
    });
    assert(!evErr, `Supabase insert conversion event: ${evErr?.message || "OK"}`);

    // E. Execute analytics query engine on this data
    const queryResult = await getAllAnalyticsData(supabase, new URLSearchParams({ range: "today" }));
    const aiData = queryResult.data.aiReferrals;

    assert(aiData.aiSessions >= 1, `AI Sessions counted >= 1 (found ${aiData.aiSessions})`);
    assert(aiData.aiVisitors >= 1, `AI Visitors counted >= 1 (found ${aiData.aiVisitors})`);
    assert(aiData.aiConversions >= 1, `AI Conversions counted >= 1 (found ${aiData.aiConversions})`);

    const chatgptPlatform = aiData.platforms.find((p) => p.platform === "ChatGPT");
    assert(
      chatgptPlatform !== undefined && chatgptPlatform.sessions >= 1,
      `ChatGPT attributed correctly in platforms breakdown`
    );

    const funnelStages = aiData.funnel;
    assert(funnelStages.length === 4, `AI Funnel has 4 stages`);
    assert(funnelStages[0].count >= 1, `Funnel Stage 1 (Visits) has >= 1`);
    assert(funnelStages[1].count >= 1, `Funnel Stage 2 (Explored) has >= 1`);
    assert(funnelStages[2].count >= 1, `Funnel Stage 3 (Contact) has >= 1`);
    assert(funnelStages[3].count >= 1, `Funnel Stage 4 (Inquiry/Booked) has >= 1`);

    console.log("\n  Attributed AI Platforms Snapshot:");
    for (const p of aiData.platforms) {
      console.log(`    - ${p.platform}: ${p.sessions} sessions, ${p.visitors} visitors, ${p.conversions} conv (${p.conversionRate})`);
    }

    // F. Cleanup test records
    await supabase.from("analytics_events").delete().eq("session_id", testSessionId);
    await supabase.from("page_views").delete().eq("session_id", testSessionId);
    await supabase.from("sessions").delete().eq("session_id", testSessionId);
    await supabase.from("visitors").delete().eq("visitor_id", testVisitorId);
    console.log("  [INFO] Cleaned up temporary test records from Supabase");
  } catch (err) {
    console.error("  [FAIL] Supabase live test error:", err);
    failed++;
  }

  // 5. TEST ALL DATE RANGES
  console.log("\n--- 5. Testing All Date Ranges ---");
  const ranges = ["today", "yesterday", "7d", "30d", "custom"];
  for (const r of ranges) {
    try {
      const params = new URLSearchParams({ range: r });
      if (r === "custom") {
        params.set("from", new Date(Date.now() - 3 * 86400000).toISOString());
        params.set("to", new Date().toISOString());
      }
      const res = await getAllAnalyticsData(supabase, params);
      const hasAi = res.data && res.data.aiReferrals && typeof res.data.aiReferrals.aiSessions === "number";
      const noNaN = !JSON.stringify(res.data.aiReferrals).includes("NaN");
      assert(hasAi && noNaN, `Date range "${r}" returns valid aiReferrals without NaN`);
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
