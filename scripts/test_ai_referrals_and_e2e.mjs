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

async function runUniversalEngineTests() {
  console.log("\n==================================================");
  console.log("AEETHOD 360 — UNIVERSAL AI REFERRAL DETECTION ENGINE");
  console.log("FULL TEST SUITE & END-TO-END ACCURACY AUDIT");
  console.log("==================================================\n");

  // Dynamically import project modules
  const {
    normalizeHostname,
    normalizeReferrer,
    detectAIPlatform,
    getAiPlatformFromRecord,
    registerAIPlatform,
    resetAIPlatformRegistry,
    AI_PLATFORMS,
    AI_ATTRIBUTION_TYPES,
  } = await import("../lib/analytics/aiPlatforms.js");

  const {
    isCrawler,
    isSearchEngine,
    isSocialPlatform,
    isPaidTraffic,
    resolveAcquisition,
  } = await import("../lib/analytics/serverAnalytics.js");

  const { classifyTrafficSource } = await import(
    "../lib/analytics/trafficSource.js"
  );

  const {
    computeAiReferralAnalytics,
    computeAiDiagnostics,
    getAllAnalyticsData,
  } = await import("../lib/analytics/adminQueries.js");

  // Reset registry before tests
  resetAIPlatformRegistry();

  // ==========================================
  // 1. HOSTNAME & REFERRER NORMALIZATION
  // ==========================================
  console.log("--- 1. Testing Hostname & Referrer Normalization ---");

  assert(normalizeHostname("HTTPS://WWW.ChatGPT.com/") === "chatgpt.com", "normalizeHostname: HTTPS://WWW.ChatGPT.com/ -> chatgpt.com");
  assert(normalizeHostname("https://chatgpt.com:443/") === "chatgpt.com", "normalizeHostname: https://chatgpt.com:443/ -> chatgpt.com");
  assert(normalizeHostname("http://chatgpt.com") === "chatgpt.com", "normalizeHostname: http://chatgpt.com -> chatgpt.com");
  assert(normalizeHostname("CHATGPT.COM") === "chatgpt.com", "normalizeHostname: CHATGPT.COM -> chatgpt.com");
  assert(normalizeHostname("chatgpt.com/") === "chatgpt.com", "normalizeHostname: chatgpt.com/ -> chatgpt.com");
  assert(normalizeHostname("https://chatgpt.com/some/path") === "chatgpt.com", "normalizeHostname: https://chatgpt.com/some/path -> chatgpt.com");
  assert(normalizeHostname("chatgpt.com.:8080") === "chatgpt.com", "normalizeHostname: chatgpt.com.:8080 (trailing dot + port) -> chatgpt.com");

  const normClaudePath = normalizeReferrer("https://claude.ai/referral/2026-09-21");
  assert(normClaudePath.host === "claude.ai" && normClaudePath.pathname === "/referral/2026-09-21", "normalizeReferrer preserves referral path: /referral/2026-09-21");

  const normApp = normalizeReferrer("android-app://com.openai.chatgpt/https/aeethod.com");
  assert(normApp.isApp === true && normApp.appPackage === "com.openai.chatgpt", "normalizeReferrer parses android-app:// package");

  // ==========================================
  // 2. AI PLATFORM REGISTRY DETECTION
  // ==========================================
  console.log("\n--- 2. Testing AI Platform Registry (All Supported Platforms) ---");

  // A. ChatGPT / OpenAI
  const c1 = detectAIPlatform("https://chatgpt.com/c/123");
  assert(c1.isAiReferral && c1.platform === "ChatGPT", "ChatGPT: https://chatgpt.com/c/123 -> ChatGPT");
  const c2 = detectAIPlatform("https://chat.openai.com/");
  assert(c2.isAiReferral && c2.platform === "ChatGPT", "ChatGPT: https://chat.openai.com/ -> ChatGPT");
  const c3 = detectAIPlatform("https://openai.com/");
  assert(c3.isAiReferral && c3.platform === "ChatGPT", "ChatGPT: https://openai.com/ -> ChatGPT");
  const c4 = detectAIPlatform("android-app://com.openai.chatgpt");
  assert(c4.isAiReferral && c4.platform === "ChatGPT", "ChatGPT: android-app://com.openai.chatgpt -> ChatGPT");
  const c5 = detectAIPlatform("", "utm_source=chatgpt.com");
  assert(c5.isAiReferral && c5.platform === "ChatGPT", "ChatGPT: utm_source=chatgpt.com -> ChatGPT");

  // B. Gemini
  const g1 = detectAIPlatform("https://gemini.google.com/app");
  assert(g1.isAiReferral && g1.platform === "Gemini", "Gemini: https://gemini.google.com/app -> Gemini");
  const g2 = detectAIPlatform("https://bard.google.com/");
  assert(g2.isAiReferral && g2.platform === "Gemini", "Gemini: https://bard.google.com/ -> Gemini");
  const g3 = detectAIPlatform("https://aistudio.google.com/");
  assert(g3.isAiReferral && g3.platform === "Gemini", "Gemini: https://aistudio.google.com/ -> Gemini");
  const g4 = detectAIPlatform("https://notebooklm.google.com/");
  assert(g4.isAiReferral && g4.platform === "Gemini", "Gemini: https://notebooklm.google.com/ -> Gemini");

  // C. Claude (with path normalization)
  const cl1 = detectAIPlatform("https://claude.ai/");
  assert(cl1.isAiReferral && cl1.platform === "Claude", "Claude: https://claude.ai/ -> Claude");
  const cl2 = detectAIPlatform("https://claude.ai/referral");
  assert(cl2.isAiReferral && cl2.platform === "Claude", "Claude: https://claude.ai/referral -> Claude");
  const cl3 = detectAIPlatform("https://claude.ai/referral/2026-09-21");
  assert(cl3.isAiReferral && cl3.platform === "Claude", "Claude: https://claude.ai/referral/2026-09-21 -> Claude");
  const cl4 = detectAIPlatform("https://anthropic.com/");
  assert(cl4.isAiReferral && cl4.platform === "Claude", "Claude: https://anthropic.com/ -> Claude");
  const cl5 = detectAIPlatform("android-app://com.anthropic.claude");
  assert(cl5.isAiReferral && cl5.platform === "Claude", "Claude: android-app://com.anthropic.claude -> Claude");

  // D. DeepSeek
  const d1 = detectAIPlatform("https://deepseek.com/");
  assert(d1.isAiReferral && d1.platform === "DeepSeek", "DeepSeek: https://deepseek.com/ -> DeepSeek");
  const d2 = detectAIPlatform("https://chat.deepseek.com/");
  assert(d2.isAiReferral && d2.platform === "DeepSeek", "DeepSeek: https://chat.deepseek.com/ -> DeepSeek");
  const d3 = detectAIPlatform("https://deepseek.ai/");
  assert(d3.isAiReferral && d3.platform === "DeepSeek", "DeepSeek: https://deepseek.ai/ -> DeepSeek");
  const d4 = detectAIPlatform("", "utm_source=deepseek.com");
  assert(d4.isAiReferral && d4.platform === "DeepSeek", "DeepSeek: utm_source=deepseek.com -> DeepSeek");

  // E. Perplexity
  const p1 = detectAIPlatform("https://perplexity.ai/");
  assert(p1.isAiReferral && p1.platform === "Perplexity", "Perplexity: https://perplexity.ai/ -> Perplexity");
  const p2 = detectAIPlatform("https://www.perplexity.ai/search?q=aeethod");
  assert(p2.isAiReferral && p2.platform === "Perplexity", "Perplexity: https://www.perplexity.ai/search -> Perplexity");
  const p3 = detectAIPlatform("https://labs.perplexity.ai/");
  assert(p3.isAiReferral && p3.platform === "Perplexity", "Perplexity: subdomain https://labs.perplexity.ai/ -> Perplexity");
  const p4 = detectAIPlatform("android-app://ai.perplexity.app");
  assert(p4.isAiReferral && p4.platform === "Perplexity", "Perplexity: android-app://ai.perplexity.app -> Perplexity");

  // F. Microsoft Copilot
  const cp1 = detectAIPlatform("https://copilot.microsoft.com/");
  assert(cp1.isAiReferral && cp1.platform === "Microsoft Copilot", "Copilot: https://copilot.microsoft.com/ -> Microsoft Copilot");
  const cp2 = detectAIPlatform("https://www.bing.com/chat?q=test");
  assert(cp2.isAiReferral && cp2.platform === "Microsoft Copilot", "Copilot: https://www.bing.com/chat -> Microsoft Copilot");
  const cp3 = detectAIPlatform("https://bing.com/copilot");
  assert(cp3.isAiReferral && cp3.platform === "Microsoft Copilot", "Copilot: https://bing.com/copilot -> Microsoft Copilot");

  // G. Grok
  const gr1 = detectAIPlatform("https://grok.com/");
  assert(gr1.isAiReferral && gr1.platform === "Grok", "Grok: https://grok.com/ -> Grok");
  const gr2 = detectAIPlatform("https://x.ai/");
  assert(gr2.isAiReferral && gr2.platform === "Grok", "Grok: https://x.ai/ -> Grok");
  const gr3 = detectAIPlatform("https://x.com/i/grok");
  assert(gr3.isAiReferral && gr3.platform === "Grok", "Grok: https://x.com/i/grok -> Grok");

  // H. Meta AI
  const m1 = detectAIPlatform("https://meta.ai/");
  assert(m1.isAiReferral && m1.platform === "Meta AI", "Meta AI: https://meta.ai/ -> Meta AI");
  const m2 = detectAIPlatform("https://imagine.meta.com/");
  assert(m2.isAiReferral && m2.platform === "Meta AI", "Meta AI: https://imagine.meta.com/ -> Meta AI");

  // I. You.com
  const y1 = detectAIPlatform("https://you.com/");
  assert(y1.isAiReferral && y1.platform === "You.com", "You.com: https://you.com/ -> You.com");

  // J. Poe
  const poe1 = detectAIPlatform("https://poe.com/");
  assert(poe1.isAiReferral && poe1.platform === "Poe", "Poe: https://poe.com/ -> Poe");

  // K. Mistral / Le Chat
  const mis1 = detectAIPlatform("https://chat.mistral.ai/");
  assert(mis1.isAiReferral && mis1.platform === "Mistral Le Chat", "Mistral: https://chat.mistral.ai/ -> Mistral Le Chat");
  const mis2 = detectAIPlatform("https://mistral.ai/");
  assert(mis2.isAiReferral && mis2.platform === "Mistral Le Chat", "Mistral: https://mistral.ai/ -> Mistral Le Chat");

  // L. Character.AI
  const ch1 = detectAIPlatform("https://character.ai/");
  assert(ch1.isAiReferral && ch1.platform === "Character.AI", "Character.AI: https://character.ai/ -> Character.AI");
  const ch2 = detectAIPlatform("https://beta.character.ai/");
  assert(ch2.isAiReferral && ch2.platform === "Character.AI", "Character.AI: https://beta.character.ai/ -> Character.AI");

  // ==========================================
  // 3. SEARCH ENGINE & SOCIAL PLATFORM PROTECTION
  // ==========================================
  console.log("\n--- 3. Testing Non-AI Channel Protection (Negative Controls) ---");

  // Google & Bing Organic Search (not AI)
  const googRes = resolveAcquisition({ serverReferer: "https://www.google.com/search?q=aeethod" });
  assert(googRes.source === "Organic Search", "Google search -> strictly 'Organic Search'");
  assert(googRes.aiPlatform === null, "Google search has NO AI platform");

  const bingRes = resolveAcquisition({ serverReferer: "https://www.bing.com/search?q=aeethod" });
  assert(bingRes.source === "Organic Search", "Standard Bing search -> strictly 'Organic Search'");
  assert(bingRes.aiPlatform === null, "Standard Bing search has NO AI platform");

  // Social (not AI)
  const fbRes = resolveAcquisition({ serverReferer: "https://www.facebook.com/" });
  assert(fbRes.source === "Social", "Facebook -> strictly 'Social'");

  const xRes = resolveAcquisition({ serverReferer: "https://x.com/profile" });
  assert(xRes.source === "Social", "Normal x.com -> strictly 'Social' (NOT Grok)");

  // Anti-Spoofing / False Positives
  assert(!detectAIPlatform("https://not-chatgpt.com").isAiReferral, "Anti-spoofing: not-chatgpt.com is NOT AI");
  assert(!detectAIPlatform("https://chatgpt.com.evil.com").isAiReferral, "Anti-spoofing: chatgpt.com.evil.com is NOT AI");
  assert(!detectAIPlatform("https://fake-deepseek.org").isAiReferral, "Anti-spoofing: fake-deepseek.org is NOT AI");
  assert(!detectAIPlatform("https://claude.ai.phishing.com").isAiReferral, "Anti-spoofing: claude.ai.phishing.com is NOT AI");
  assert(!detectAIPlatform("https://random.com/?ai=true").isAiReferral, "Anti-spoofing: random.com/?ai=true is NOT AI");
  assert(!detectAIPlatform("", "utm_source=my-company-ai").isAiReferral, "Anti-spoofing: utm_source=my-company-ai is NOT AI");

  // No referrer / Direct
  const directRes = resolveAcquisition({ serverReferer: null, clientReferrer: "" });
  assert(directRes.source === "Direct" && directRes.aiPlatform === null, "No referrer -> strictly 'Direct'");

  // ==========================================
  // 4. AI CRAWLER SEPARATION
  // ==========================================
  console.log("\n--- 4. Testing AI Crawler / Bot Separation ---");

  assert(isCrawler("Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; GPTBot/1.2; +https://openai.com/gptbot)").isCrawler, "GPTBot is recognized as a crawler");
  assert(isCrawler("Mozilla/5.0 ClaudeBot/1.0; +claudebot@anthropic.com").isCrawler, "ClaudeBot is recognized as a crawler");
  assert(isCrawler("Mozilla/5.0 (compatible; PerplexityBot/1.0; +https://perplexity.ai/perplexitybot)").isCrawler, "PerplexityBot is recognized as a crawler");
  assert(isCrawler("Googlebot/2.1 (+http://www.google.com/bot.html)").isCrawler, "Googlebot is recognized as a crawler");
  assert(!isCrawler("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36").isCrawler, "Real Chrome browser is NOT a crawler");

  const botAcq = resolveAcquisition({
    serverReferer: "https://chatgpt.com/",
    userAgent: "GPTBot/1.0",
  });
  assert(botAcq.source === "Bot" && botAcq.isCrawler === true, "Crawler request is categorized as Bot and excluded from AI referrals");

  // ==========================================
  // 5. UNKNOWN REFERRER DISCOVERY & REGISTRY EXTENSIBILITY
  // ==========================================
  console.log("\n--- 5. Testing Unknown Referrer Discovery & Runtime Extensibility ---");

  // 1. Unknown platform arrives
  const unkRes = resolveAcquisition({ serverReferer: "https://future-ai.example/share/123" });
  assert(unkRes.source === "Referral", "Unknown platform before registration: source = 'Referral'");
  assert(unkRes.aiPlatform === null, "Unknown platform before registration: aiPlatform = null (NOT hallucinated)");
  assert(unkRes.unknownReferrerHost === "future-ai.example", "Unknown host recorded for discovery: 'future-ai.example'");

  // 2. Register future platform
  registerAIPlatform({
    id: "future_ai",
    name: "Future AI",
    canonicalName: "Future AI",
    domains: ["future-ai.example"],
    utmSources: ["future_ai", "future-ai.example"],
    color: "#EC4899",
  });

  // 3. Test again after registration
  const regRes = resolveAcquisition({ serverReferer: "https://future-ai.example/share/123" });
  assert(regRes.source === "AI Referral", "After registration: source = 'AI Referral'");
  assert(regRes.aiPlatform === "Future AI", "After registration: aiPlatform = 'Future AI'");

  // ==========================================
  // 6. MULTIPLE AI SIGNALS & DETERMINISTIC PRECEDENCE
  // ==========================================
  console.log("\n--- 6. Testing Deterministic Signal Conflict Precedence ---");

  // Server Referer = claude.ai, Client UTM = chatgpt.com
  const conflictRes = resolveAcquisition({
    serverReferer: "https://claude.ai/chat/123",
    clientReferrer: "https://claude.ai/",
    searchParams: "utm_source=chatgpt.com",
  });

  assert(conflictRes.source === "AI Referral", "Conflict resolution: source = 'AI Referral'");
  assert(conflictRes.aiPlatform === "Claude", "Server-verified Referer takes precedence over client UTM: aiPlatform = 'Claude'");
  assert(conflictRes.conflict !== null, "Conflict was recorded for diagnostic debugging");

  // ==========================================
  // 7. COMPLETE PIPELINE: SUPABASE + PRESERVATION + CONVERSION
  // ==========================================
  console.log("\n--- 7. Testing Full Pipeline (Supabase, First-Touch Preservation, Conversion) ---");

  const testVisId = `test_vis_universal_${Date.now()}`;
  const testSesId = `test_ses_universal_${Date.now()}`;
  const time1 = new Date(Date.now() - 60000).toISOString();
  const time2 = new Date(Date.now() - 30000).toISOString();
  const time3 = new Date().toISOString();

  try {
    // 1. Visitor insertion
    await supabase.from("visitors").insert({
      visitor_id: testVisId,
      last_seen: time1,
    });

    // 2. Initial Pageview (Landing from Claude with referral path)
    await supabase.from("sessions").insert({
      session_id: testSesId,
      visitor_id: testVisId,
      started_at: time1,
      last_activity_at: time1,
      traffic_source: "AI Referral",
      referrer: "https://claude.ai/referral/2026-09-21",
      device_type: "Desktop",
      browser: "Chrome",
      operating_system: "macOS",
      country: "United States",
      city: "New York",
    });

    await supabase.from("page_views").insert({
      session_id: testSesId,
      visitor_id: testVisId,
      path: "/",
      referrer: "https://claude.ai/referral/2026-09-21",
      viewed_at: time1,
      duration_seconds: 35,
    });

    // 3. Internal Navigation: /work -> /services -> /contact
    // Verify attribution preservation
    const { data: existingSession } = await supabase
      .from("sessions")
      .select("traffic_source, referrer")
      .eq("session_id", testSesId)
      .single();

    let finalSource = existingSession.traffic_source;
    let finalRef = existingSession.referrer;

    assert(finalSource === "AI Referral", "Internal navigation: source remains 'AI Referral'");
    assert(finalRef === "https://claude.ai/referral/2026-09-21", "Internal navigation: original referrer preserved");

    await supabase.from("sessions").update({
      last_activity_at: time2,
      traffic_source: finalSource,
      referrer: finalRef,
    }).eq("session_id", testSesId);

    await supabase.from("page_views").insert([
      {
        session_id: testSesId,
        visitor_id: testVisId,
        path: "/work",
        referrer: "https://www.aeethod.com/",
        viewed_at: time2,
        duration_seconds: 45,
      },
      {
        session_id: testSesId,
        visitor_id: testVisId,
        path: "/contact",
        referrer: "https://www.aeethod.com/work",
        viewed_at: time3,
        duration_seconds: 50,
      },
    ]);

    // 4. Conversion Event: inquiry_submitted
    await supabase.from("analytics_events").insert({
      session_id: testSesId,
      visitor_id: testVisId,
      event_name: "inquiry_submitted",
      page_path: "/contact",
      created_at: time3,
    });

    // 5. Query Master Admin Aggregator on live Supabase
    const masterData = await getAllAnalyticsData(supabase, new URLSearchParams({ range: "today" }));
    const aiData = masterData.data.aiReferrals;

    assert(aiData.aiSessions >= 1, `Live Admin API: AI Sessions >= 1 (found ${aiData.aiSessions})`);
    assert(aiData.aiVisitors >= 1, `Live Admin API: AI Visitors >= 1 (found ${aiData.aiVisitors})`);
    assert(aiData.aiPageviews >= 3, `Live Admin API: AI Pageviews >= 3 (found ${aiData.aiPageviews})`);
    assert(aiData.aiInquiries >= 1, `Live Admin API: AI Inquiries >= 1 (found ${aiData.aiInquiries})`);
    assert(aiData.aiConversions >= 1, `Live Admin API: AI Conversions >= 1 (found ${aiData.aiConversions})`);

    const claudePlatform = aiData.platforms.find((p) => p.platform === "Claude");
    assert(claudePlatform !== undefined, "Claude platform is present in breakdown table");
    assert(claudePlatform.sessions >= 1, "Claude platform has >= 1 session");
    assert(claudePlatform.conversions >= 1, "Claude platform received the conversion yield");

    // Clean up temporary test records
    await supabase.from("analytics_events").delete().eq("session_id", testSesId);
    await supabase.from("page_views").delete().eq("session_id", testSesId);
    await supabase.from("sessions").delete().eq("session_id", testSesId);
    await supabase.from("visitors").delete().eq("visitor_id", testVisId);
    console.log("  [INFO] Cleaned up temporary test data from Supabase");
  } catch (err) {
    console.error("  [FAIL] Full pipeline error:", err);
    failed++;
  }

  // ==========================================
  // 8. DIAGNOSTICS & DISCOVERY REPORT TEST
  // ==========================================
  console.log("\n--- 8. Testing AI Diagnostics & Discovery Function ---");

  const mockSessions = [
    { session_id: "s1", traffic_source: "AI Referral", referrer: "https://chatgpt.com/", utm_source: null, ai_platform: "ChatGPT" },
    { session_id: "s2", traffic_source: "AI Referral", referrer: "https://claude.ai/referral", utm_source: null, ai_platform: "Claude" },
    { session_id: "s3", traffic_source: "AI Referral", referrer: null, utm_source: "deepseek.com", ai_platform: "DeepSeek" },
    { session_id: "s4", traffic_source: "Referral", referrer: "https://new-ai-tool.example/article", unknown_referrer_host: "new-ai-tool.example" },
    { session_id: "s5", traffic_source: "Direct", referrer: null, utm_source: null },
  ];

  const diag = computeAiDiagnostics(mockSessions, [], []);
  assert(diag.verifiedAiSessions === 3, "Diagnostics: verifiedAiSessions = 3");
  assert(diag.directSessions === 1, "Diagnostics: directSessions = 1");
  assert(diag.recognizedPlatforms.length === 3, "Diagnostics: 3 recognized platforms found");
  assert(diag.unknownReferrerHosts.some((h) => h.host === "new-ai-tool.example"), "Diagnostics discovered unknown host: 'new-ai-tool.example'");

  // ==========================================
  // 9. DATE RANGE TESTS
  // ==========================================
  console.log("\n--- 9. Testing All Date Ranges ---");
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

  console.log("\n==================================================");
  console.log(`AEETHOD UNIVERSAL ENGINE RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log("==================================================\n");

  if (failed > 0) {
    process.exit(1);
  }
}

runUniversalEngineTests().catch((err) => {
  console.error("Fatal test runner error:", err);
  process.exit(1);
});
