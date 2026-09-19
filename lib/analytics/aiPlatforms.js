/**
 * Aeethod Studio — Centralized & Extensible AI Platform Registry
 *
 * Provides reliable, measurable attribution for AI-generated referral traffic:
 * - ChatGPT (chatgpt.com, chat.openai.com)
 * - Perplexity (perplexity.ai)
 * - Gemini (gemini.google.com, bard.google.com)
 * - Claude (claude.ai)
 * - Microsoft Copilot (copilot.microsoft.com, bing.com/chat)
 * - Poe (poe.com)
 * - You.com (you.com)
 * - DeepSeek (chat.deepseek.com, deepseek.com)
 * - Grok (grok.com, x.ai)
 * - Meta AI (meta.ai)
 *
 * STRICT GUIDELINES:
 * - Never guess or infer AI traffic without measurable signals (referrer domain or explicit UTM).
 * - Standard Google/Bing web search is classified as Organic Search.
 * - Standard website links are classified as Referral.
 */

export const AI_PLATFORMS = [
  {
    id: "chatgpt",
    name: "ChatGPT",
    domains: ["chatgpt.com", "chat.openai.com"],
    domainPrefixes: ["chatgpt.", "chat.openai."],
    utmSources: ["chatgpt", "openai", "chat_gpt", "gpt-4", "gpt-3.5"],
    color: "#10A37F",
  },
  {
    id: "perplexity",
    name: "Perplexity",
    domains: ["perplexity.ai", "www.perplexity.ai", "labs.perplexity.ai"],
    domainPrefixes: ["perplexity."],
    utmSources: ["perplexity", "perplexity_ai", "perplexity.ai"],
    color: "#20B8CD",
  },
  {
    id: "gemini",
    name: "Gemini",
    domains: ["gemini.google.com", "bard.google.com"],
    domainPrefixes: ["gemini.google.", "bard.google."],
    utmSources: ["gemini", "bard", "google_gemini", "google-gemini"],
    color: "#4E88F5",
  },
  {
    id: "claude",
    name: "Claude",
    domains: ["claude.ai"],
    domainPrefixes: ["claude."],
    utmSources: ["claude", "anthropic", "claude_ai", "claude.ai"],
    color: "#D97706",
  },
  {
    id: "copilot",
    name: "Microsoft Copilot",
    domains: ["copilot.microsoft.com", "edgeservices.bing.com", "sydney.bing.com"],
    domainPrefixes: ["copilot.microsoft."],
    pathPatterns: ["bing.com/chat"],
    utmSources: ["copilot", "bing_chat", "bingchat", "ms_copilot", "microsoft_copilot"],
    color: "#0078D4",
  },
  {
    id: "poe",
    name: "Poe",
    domains: ["poe.com"],
    domainPrefixes: ["poe."],
    utmSources: ["poe", "poe_ai", "poe.com"],
    color: "#8B5CF6",
  },
  {
    id: "you",
    name: "You.com",
    domains: ["you.com"],
    domainPrefixes: ["you."],
    utmSources: ["you.com", "youchat", "you_chat"],
    color: "#0EA5E9",
  },
  {
    id: "deepseek",
    name: "DeepSeek",
    domains: ["deepseek.com", "chat.deepseek.com"],
    domainPrefixes: ["deepseek.", "chat.deepseek."],
    utmSources: ["deepseek", "deepseek_ai"],
    color: "#4F46E5",
  },
  {
    id: "grok",
    name: "Grok",
    domains: ["grok.com", "x.ai"],
    domainPrefixes: ["grok."],
    utmSources: ["grok", "x_ai"],
    color: "#EC4899",
  },
  {
    id: "meta_ai",
    name: "Meta AI",
    domains: ["meta.ai", "imagine.meta.com"],
    domainPrefixes: ["meta.ai", "imagine.meta."],
    utmSources: ["meta_ai", "meta-ai"],
    color: "#3B82F6",
  },
];

const AI_MEDIUMS = ["ai", "ai-referral", "ai_referral", "chat", "llm", "ai_assistant"];

/**
 * Detects if inbound visitor originated from a measurable AI referral source.
 *
 * @param {string} referrer - Raw document.referrer
 * @param {URLSearchParams|string} [search] - URL query string or URLSearchParams
 * @returns {{
 *   isAiReferral: boolean,
 *   platform: string | null,
 *   platformId: string | null,
 *   domain: string | null,
 *   color: string | null
 * }}
 */
export function detectAiReferral(referrer, search = "") {
  const params = typeof search === "string" ? new URLSearchParams(search) : search;
  const utmSource = (params?.get("utm_source") || "").trim().toLowerCase();
  const utmMedium = (params?.get("utm_medium") || "").trim().toLowerCase();

  let host = "";
  let fullUrl = "";
  if (referrer && referrer.trim() !== "") {
    try {
      const url = new URL(referrer);
      host = url.hostname.toLowerCase();
      fullUrl = (url.hostname + url.pathname).toLowerCase();
    } catch {
      // ignore invalid referrer url format
    }
  }

  // 1. Check known AI platforms by referrer domain/path
  if (host) {
    for (const p of AI_PLATFORMS) {
      const matchesDomain = p.domains.some((d) => host === d || host.endsWith("." + d));
      const matchesPrefix = p.domainPrefixes?.some((prefix) => host.startsWith(prefix));
      const matchesPath = p.pathPatterns?.some((pattern) => fullUrl.includes(pattern));

      if (matchesDomain || matchesPrefix || matchesPath) {
        return {
          isAiReferral: true,
          platform: p.name,
          platformId: p.id,
          domain: host,
          color: p.color,
        };
      }
    }
  }

  // 2. Check explicit UTM tags indicating AI referral
  if (utmSource || utmMedium) {
    for (const p of AI_PLATFORMS) {
      if (p.utmSources.includes(utmSource)) {
        return {
          isAiReferral: true,
          platform: p.name,
          platformId: p.id,
          domain: host || "utm-attribution",
          color: p.color,
        };
      }
    }

    if (AI_MEDIUMS.includes(utmMedium)) {
      // Explicit AI medium but generic/custom source name
      const cleanSourceName = utmSource ? utmSource.charAt(0).toUpperCase() + utmSource.slice(1) : "Other AI";
      return {
        isAiReferral: true,
        platform: cleanSourceName,
        platformId: "other_ai",
        domain: host || "utm-attribution",
        color: "#10B981",
      };
    }
  }

  // No measurable AI signal
  return {
    isAiReferral: false,
    platform: null,
    platformId: null,
    domain: null,
    color: null,
  };
}

/**
 * Server-safe helper to identify AI platform from stored session record.
 *
 * @param {string|null} referrer
 * @param {string|null} utmSource
 * @param {string|null} utmMedium
 * @returns {string} Platform name or "Other AI"
 */
export function getAiPlatformFromRecord(referrer, utmSource, utmMedium) {
  const dummySearch = new URLSearchParams();
  if (utmSource) dummySearch.set("utm_source", utmSource);
  if (utmMedium) dummySearch.set("utm_medium", utmMedium);

  const detection = detectAiReferral(referrer || "", dummySearch);
  if (detection.isAiReferral && detection.platform) {
    return detection.platform;
  }
  return "Other AI";
}
