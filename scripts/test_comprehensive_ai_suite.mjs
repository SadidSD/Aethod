import { createClient } from "@supabase/supabase-js";
import { detectAIPlatform, normalizeHostname, AI_PLATFORMS } from "../lib/analytics/aiPlatforms.js";
import { resolveAcquisition } from "../lib/analytics/serverAnalytics.js";
import {
  fetchRawAnalyticsData,
  computeTrafficSources,
  computeAiReferralAnalytics,
  computeAiDiagnostics,
  parseDateRange,
  isAiSession,
  deduceDetectionMethod
} from "../lib/analytics/adminQueries.js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false, autoRefreshToken: false }
});

let passedTests = 0;
let failedTests = 0;

function assert(condition, message) {
  if (condition) {
    passedTests++;
    console.log(`  [PASS] ${message}`);
  } else {
    failedTests++;
    console.error(`  [FAIL] ${message}`);
    throw new Error(`Assertion failed: ${message}`);
  }
}

async function runSuite() {
  console.log("================================================================================");
  console.log("             AEETHOD 360° AI REFERRAL ENGINE COMPREHENSIVE VERIFICATION        ");
  console.log("================================================================================\n");

  // =========================================================================
  // SECTION 1: SIGNAL NORMALIZATION TESTS
  // =========================================================================
  console.log("--- Section 1: Signal Normalization ---");
  assert(normalizeHostname("https://chatgpt.com/") === "chatgpt.com", "normalizeHostname chatgpt.com");
  assert(normalizeHostname("http://www.perplexity.ai/search?q=aeethod") === "perplexity.ai", "normalizeHostname perplexity.ai with query");
  assert(normalizeHostname("android-app://com.openai.chatgpt/") === "com.openai.chatgpt", "normalizeHostname android app package");
  assert(normalizeHostname("https://exit.chatgpt.com/link?url=xyz") === "exit.chatgpt.com", "normalizeHostname exit.chatgpt.com");
  assert(normalizeHostname("   HTTPS://GEMINI.GOOGLE.COM/app  ") === "gemini.google.com", "normalizeHostname uppercase and padding");
  assert(normalizeHostname("") === "", "normalizeHostname empty string");
  assert(normalizeHostname(null) === "", "normalizeHostname null");

  // =========================================================================
  // SECTION 2: AI PLATFORM DETECTION (REFERRER & UTM)
  // =========================================================================
  console.log("\n--- Section 2: AI Platform Detection (Referrer & UTM) ---");
  
  // ChatGPT
  const cg1 = detectAIPlatform("https://chatgpt.com/");
  assert(cg1.isAiReferral && cg1.platform === "ChatGPT" && cg1.detectionMethod === "referrer", "ChatGPT domain referrer");

  const cg2 = detectAIPlatform("https://exit.chatgpt.com/link");
  assert(cg2.isAiReferral && cg2.platform === "ChatGPT" && cg2.detectionMethod === "referrer", "ChatGPT exit redirect referrer");

  const cg3 = detectAIPlatform("https://chatgpt.com/c/67890-abcdef");
  assert(cg3.isAiReferral && cg3.platform === "ChatGPT" && cg3.detectionMethod === "redirect", "ChatGPT chat path rule");

  const cg4 = detectAIPlatform("", "utm_source=chatgpt.com");
  assert(cg4.isAiReferral && cg4.platform === "ChatGPT" && cg4.detectionMethod === "utm", "ChatGPT utm_source=chatgpt.com");

  const cg5 = detectAIPlatform("", "utm_source=openai-chatgpt");
  assert(cg5.isAiReferral && cg5.platform === "ChatGPT" && cg5.detectionMethod === "utm", "ChatGPT utm_source=openai-chatgpt");

  const cg6 = detectAIPlatform("", "utm_source=chatgptsearch");
  assert(cg6.isAiReferral && cg6.platform === "ChatGPT" && cg6.detectionMethod === "utm", "ChatGPT utm_source=chatgptsearch");

  // Perplexity
  const px1 = detectAIPlatform("https://www.perplexity.ai/");
  assert(px1.isAiReferral && px1.platform === "Perplexity" && px1.detectionMethod === "referrer", "Perplexity domain referrer");

  const px2 = detectAIPlatform("", "utm_source=perplexity.ai");
  assert(px2.isAiReferral && px2.platform === "Perplexity" && px2.detectionMethod === "utm", "Perplexity utm_source");

  // Claude
  const cl1 = detectAIPlatform("https://claude.ai/");
  assert(cl1.isAiReferral && cl1.platform === "Claude" && cl1.detectionMethod === "referrer", "Claude domain referrer");

  const cl2 = detectAIPlatform("", "utm_source=claude&utm_medium=ai");
  assert(cl2.isAiReferral && cl2.platform === "Claude" && cl2.detectionMethod === "utm", "Claude utm_source & utm_medium");

  // Gemini
  const gm1 = detectAIPlatform("https://gemini.google.com/");
  assert(gm1.isAiReferral && gm1.platform === "Gemini" && gm1.detectionMethod === "referrer", "Gemini domain referrer");

  const gm2 = detectAIPlatform("https://bard.google.com/");
  assert(gm2.isAiReferral && gm2.platform === "Gemini" && gm2.detectionMethod === "referrer", "Gemini (legacy Bard) referrer");

  const gm3 = detectAIPlatform("", "utm_source=google-gemini");
  assert(gm3.isAiReferral && gm3.platform === "Gemini" && gm3.detectionMethod === "utm", "Gemini utm_source");

  // Copilot
  const cp1 = detectAIPlatform("https://copilot.microsoft.com/");
  assert(cp1.isAiReferral && cp1.platform === "Microsoft Copilot" && cp1.detectionMethod === "referrer", "Copilot domain referrer");

  const cp2 = detectAIPlatform("https://www.bing.com/chat");
  assert(cp2.isAiReferral && cp2.platform === "Microsoft Copilot" && cp2.detectionMethod === "redirect", "Copilot bing.com/chat path rule");

  const cp3 = detectAIPlatform("", "utm_source=bing-copilot");
  assert(cp3.isAiReferral && cp3.platform === "Microsoft Copilot" && cp3.detectionMethod === "utm", "Copilot utm_source");

  // Generic AI utm_medium
  const med1 = detectAIPlatform("", "utm_medium=ai_referral&utm_source=some-ai-agent");
  assert(med1.isAiReferral && med1.detectionMethod === "utm", "Generic AI utm_medium detection");

  // =========================================================================
  // SECTION 3: NEGATIVE CONTROLS & SECURITY / SPOOFING PREVENTION
  // =========================================================================
  console.log("\n--- Section 3: Negative Controls & Anti-Spoofing ---");
  
  // Google Organic
  const negGoogle = resolveAcquisition({
    serverReferer: "https://www.google.com/search?q=aeethod",
    clientReferrer: "https://www.google.com/",
    searchParams: "",
    currentOrigin: "https://www.aeethod.com",
    userAgent: "Mozilla/5.0 Chrome/120.0"
  });
  assert(negGoogle.source === "Organic Search" && negGoogle.aiPlatform === null, "Google organic is NOT AI Referral");

  // Bing Organic (non-chat)
  const negBing = resolveAcquisition({
    serverReferer: "https://www.bing.com/search?q=aeethod",
    clientReferrer: "https://www.bing.com/search?q=aeethod",
    searchParams: "",
    currentOrigin: "https://www.aeethod.com",
    userAgent: "Mozilla/5.0 Chrome/120.0"
  });
  assert(negBing.source === "Organic Search" && negBing.aiPlatform === null, "Bing search is NOT AI Referral");

  // Facebook Social
  const negFb = resolveAcquisition({
    serverReferer: "https://l.facebook.com/",
    clientReferrer: "https://l.facebook.com/",
    searchParams: "",
    currentOrigin: "https://www.aeethod.com",
    userAgent: "Mozilla/5.0 Chrome/120.0"
  });
  assert(negFb.source === "Social" && negFb.aiPlatform === null, "Facebook is Social, NOT AI Referral");

  // Direct Traffic
  const negDirect = resolveAcquisition({
    serverReferer: "https://www.aeethod.com/",
    clientReferrer: "",
    searchParams: "",
    currentOrigin: "https://www.aeethod.com",
    userAgent: "Mozilla/5.0 Chrome/120.0"
  });
  assert(negDirect.source === "Direct" && negDirect.aiPlatform === null, "Direct traffic remains Direct");

  // Attacker domain spoofing (subdomain hijacking or partial name match)
  const spoof1 = detectAIPlatform("https://chatgpt.com.attacker.com/");
  assert(!spoof1.isAiReferral, "chatgpt.com.attacker.com is rejected");

  const spoof2 = detectAIPlatform("https://not-claude.ai/");
  assert(!spoof2.isAiReferral, "not-claude.ai is rejected");

  const spoof3 = detectAIPlatform("https://fakeperplexity.ai.evil.com/landing");
  assert(!spoof3.isAiReferral, "fakeperplexity.ai.evil.com is rejected");

  // =========================================================================
  // SECTION 4: SESSION ATTRIBUTION & FUNNEL PERSISTENCE
  // =========================================================================
  console.log("\n--- Section 4: First-Touch Session Attribution & Navigation ---");
  
  // Landing Page: /
  const landingAcq = resolveAcquisition({
    serverReferer: "https://www.aeethod.com/",
    clientReferrer: "https://chatgpt.com/",
    searchParams: "",
    currentOrigin: "https://www.aeethod.com",
    userAgent: "Mozilla/5.0 Chrome/120.0"
  });
  assert(landingAcq.source === "AI Referral" && landingAcq.aiPlatform === "ChatGPT", "Landing attributed to AI Referral (ChatGPT)");

  // Ongoing internal session object simulating Supabase session state
  const mockSession = {
    session_id: "s_test_persistence_123",
    visitor_id: "v_test_persistence_123",
    traffic_source: landingAcq.source,
    referrer: "https://chatgpt.com/",
    ai_platform: landingAcq.aiPlatform,
    ai_attribution_type: "verified_ai_referral",
    landing_page: "/",
  };

  // Navigating to /services (browser sets document.referrer = https://www.aeethod.com/, utm is empty)
  const internalNav1 = resolveAcquisition({
    serverReferer: "https://www.aeethod.com/services",
    clientReferrer: "https://www.aeethod.com/",
    searchParams: "",
    currentOrigin: "https://www.aeethod.com",
    userAgent: "Mozilla/5.0 Chrome/120.0"
  });
  // Without session context, internal nav would be Direct
  assert(internalNav1.source === "Direct", "Raw internal navigation alone resolves to Direct");

  // But with session preservation (simulating pageview route logic):
  let finalSource = internalNav1.source;
  let finalPlatform = internalNav1.aiPlatform;
  if (mockSession.traffic_source && mockSession.traffic_source !== "Direct") {
    if (!internalNav1.source || internalNav1.source === "Direct") {
      finalSource = mockSession.traffic_source;
      finalPlatform = mockSession.ai_platform;
    }
  }
  assert(finalSource === "AI Referral" && finalPlatform === "ChatGPT", "First-touch AI Referral preserved when navigating to /services");

  // Simulating 4 pageviews across session
  const pageViews = [
    { session_id: mockSession.session_id, path: "/" },
    { session_id: mockSession.session_id, path: "/services" },
    { session_id: mockSession.session_id, path: "/works" },
    { session_id: mockSession.session_id, path: "/contact" },
  ];
  const events = [
    { session_id: mockSession.session_id, event_name: "explore_services" },
    { session_id: mockSession.session_id, event_name: "inquiry_submitted" },
  ];

  const funnelResult = computeAiReferralAnalytics([mockSession], pageViews, events);
  assert(funnelResult.aiSessions === 1, "Session count is exactly 1 despite 4 pageviews");
  assert(funnelResult.aiPageviews === 4, "AI pageviews correctly recorded as 4");
  assert(funnelResult.aiInquiries === 1, "AI inquiries correctly recorded as 1");
  assert(funnelResult.funnel[0].count === 1, "Funnel stage 1: 1 visit");
  assert(funnelResult.funnel[1].count === 1, "Funnel stage 2: 1 explored services");
  assert(funnelResult.funnel[2].count === 1, "Funnel stage 3: 1 started contact");
  assert(funnelResult.funnel[3].count === 1, "Funnel stage 4: 1 converted inquiry");

  // =========================================================================
  // SECTION 5: DIRECT SESSION UPGRADE
  // =========================================================================
  console.log("\n--- Section 5: Direct Session Upgrade ---");
  const directSession = {
    session_id: "s_test_upgrade_456",
    traffic_source: "Direct",
    referrer: null,
    utm_source: null
  };
  const newSignal = resolveAcquisition({
    serverReferer: "https://www.aeethod.com/?utm_source=perplexity.ai",
    clientReferrer: "",
    searchParams: new URLSearchParams("utm_source=perplexity.ai"),
    currentOrigin: "https://www.aeethod.com",
    userAgent: "Mozilla/5.0 Chrome/120.0"
  });

  let upgradedSource = directSession.traffic_source;
  let upgradedPlatform = null;
  if (directSession.traffic_source === "Direct" && newSignal.source && newSignal.source !== "Direct") {
    upgradedSource = newSignal.source;
    upgradedPlatform = newSignal.aiPlatform;
  }
  assert(upgradedSource === "AI Referral" && upgradedPlatform === "Perplexity", "Direct session cleanly upgraded when AI signal arrives");

  // =========================================================================
  // SECTION 6: LIVE SUPABASE AGGREGATION & SYNCHRONIZATION
  // =========================================================================
  console.log("\n--- Section 6: Live Supabase Controlled Insertion & Deletion ---");
  
  // 1. Check baseline
  const baselineRaw = await fetchRawAnalyticsData(supabase, new Date(Date.now() - 7 * 86400000), new Date());
  const baselineSources = computeTrafficSources(baselineRaw.sessions);
  const baselineAi = computeAiReferralAnalytics(baselineRaw.sessions, baselineRaw.pageViews, baselineRaw.events);
  const baselineDiag = computeAiDiagnostics(baselineRaw.sessions, baselineRaw.pageViews, baselineRaw.events);

  const baselineAiCount = baselineSources.find(s => s.source === "AI Referral")?.count || 0;
  assert(baselineAiCount === baselineAi.aiSessions, `Baseline trafficSources (${baselineAiCount}) matches aiAnalytics (${baselineAi.aiSessions})`);
  assert(baselineAiCount === baselineDiag.verifiedAiSessions, `Baseline trafficSources (${baselineAiCount}) matches diagnostics (${baselineDiag.verifiedAiSessions})`);
  console.log(`  Current active baseline AI referrals count: ${baselineAiCount}`);

  // 2. Insert temporary test AI session into Supabase
  const testSessionId = `s_test_e2e_${Date.now()}`;
  const testVisitorId = `v_test_e2e_${Date.now()}`;
  const nowIso = new Date().toISOString();

  console.log(`  Inserting controlled test visitor: ${testVisitorId}...`);
  const { error: visErr } = await supabase.from("visitors").insert({
    visitor_id: testVisitorId,
    first_seen: nowIso,
    last_seen: nowIso,
  });
  if (visErr) throw new Error(`Visitor insert failed: ${visErr.message}`);

  console.log(`  Inserting controlled test session: ${testSessionId}...`);
  const { error: insertErr } = await supabase.from("sessions").insert({
    session_id: testSessionId,
    visitor_id: testVisitorId,
    started_at: nowIso,
    last_activity_at: nowIso,
    traffic_source: "AI Referral",
    referrer: "https://chatgpt.com/",
    browser: "Chrome",
    operating_system: "Windows",
    device_type: "Desktop",
    country: "US",
    city: "San Francisco"
  });

  if (insertErr) {
    throw new Error(`Failed to insert test session: ${insertErr.message}`);
  }

  // 3. Verify query detects the new session (+1)
  const updatedRaw = await fetchRawAnalyticsData(supabase, new Date(Date.now() - 7 * 86400000), new Date(Date.now() + 60000));
  const updatedSources = computeTrafficSources(updatedRaw.sessions);
  const updatedAi = computeAiReferralAnalytics(updatedRaw.sessions, updatedRaw.pageViews, updatedRaw.events);
  const updatedDiag = computeAiDiagnostics(updatedRaw.sessions, updatedRaw.pageViews, updatedRaw.events);

  const updatedAiCount = updatedSources.find(s => s.source === "AI Referral")?.count || 0;
  assert(updatedAiCount === baselineAiCount + 1, `Traffic Sources AI Referral incremented by 1 (${baselineAiCount} -> ${updatedAiCount})`);
  assert(updatedAi.aiSessions === baselineAi.aiSessions + 1, `AI Analytics aiSessions incremented by 1 (${baselineAi.aiSessions} -> ${updatedAi.aiSessions})`);
  assert(updatedDiag.verifiedAiSessions === baselineDiag.verifiedAiSessions + 1, `Diagnostics verifiedAiSessions incremented by 1 (${baselineDiag.verifiedAiSessions} -> ${updatedDiag.verifiedAiSessions})`);
  assert(updatedAiCount === updatedAi.aiSessions, "All aggregators in 100% lockstep agreement");

  // Verify detection methods and lastAiReferral
  assert(updatedAi.detectionMethods.referrer >= 1, "Detection methods tracked referrer signal");
  assert(new Date(updatedAi.lastAiReferral).getTime() >= new Date(nowIso).getTime() - 1000, "lastAiReferral timestamp updated to latest visit");

  // 4. Clean up test session and visitor
  console.log(`  Cleaning up test session ${testSessionId} and visitor ${testVisitorId}...`);
  const { error: deleteErr } = await supabase.from("sessions").delete().eq("session_id", testSessionId);
  if (deleteErr) {
    console.error("Warning: session cleanup failed:", deleteErr.message);
  }
  const { error: deleteVisErr } = await supabase.from("visitors").delete().eq("visitor_id", testVisitorId);
  if (deleteVisErr) {
    console.error("Warning: visitor cleanup failed:", deleteVisErr.message);
  }

  // 5. Verify restored baseline
  const finalRaw = await fetchRawAnalyticsData(supabase, new Date(Date.now() - 7 * 86400000), new Date());
  const finalAi = computeAiReferralAnalytics(finalRaw.sessions, finalRaw.pageViews, finalRaw.events);
  assert(finalAi.aiSessions === baselineAiCount, `Database cleanly restored to baseline count of ${baselineAiCount}`);

  // =========================================================================
  // SUMMARY
  // =========================================================================
  console.log("\n================================================================================");
  console.log(`TEST RESULTS: ${passedTests} PASSED, ${failedTests} FAILED`);
  console.log("================================================================================");
  if (failedTests > 0) {
    process.exit(1);
  }
}

runSuite().catch((err) => {
  console.error("Test Suite Failed with Exception:", err);
  process.exit(1);
});
