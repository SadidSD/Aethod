/**
 * Aeethod Studio — Centralized & Extensible AI Platform Registry
 *
 * Provides reliable, verified attribution for AI-generated referral traffic:
 * - ChatGPT (chatgpt.com, chat.openai.com, com.openai.chatgpt)
 * - Perplexity (perplexity.ai, ai.perplexity.app)
 * - Gemini (gemini.google.com, bard.google.com, ai.google.com, aistudio.google.com)
 * - Claude (claude.ai, anthropic.com, com.anthropic.claude)
 * - Microsoft Copilot (copilot.microsoft.com, copilot.cloud.microsoft, bing.com/chat)
 * - Additional recognized platforms: Poe, You.com, DeepSeek, Grok, Meta AI
 *
 * STRICT GUIDELINES:
 * - Never guess or infer AI traffic without an actual, measurable attribution signal.
 * - document.referrer missing + no explicit AI UTM -> NEVER claim AI referral.
 * - Regular search (Google, Bing Search) -> classified strictly as Organic Search.
 * - Regular websites / social networks -> classified strictly as Referral / Social.
 * - Substring matching is forbidden (e.g. fake-chatgpt.com or random-ai.org are NOT AI).
 */

export const AI_ATTRIBUTION_TYPES = {
  VERIFIED_AI_REFERRAL: "VERIFIED_AI_REFERRAL",
  UNKNOWN_AI: "UNKNOWN_AI",
};

export const AI_PLATFORMS = [
  {
    id: "chatgpt",
    name: "ChatGPT",
    color: "#10A37F",
    domains: ["chatgpt.com", "openai.com"],
    appPackages: ["com.openai.chatgpt"],
    utmSources: ["chatgpt", "openai", "chat_gpt", "chat-gpt", "gpt-4", "gpt-3.5", "gpt4"],
  },
  {
    id: "perplexity",
    name: "Perplexity",
    color: "#20B8CD",
    domains: ["perplexity.ai"],
    appPackages: ["ai.perplexity.app"],
    utmSources: ["perplexity", "perplexity_ai", "perplexity.ai"],
  },
  {
    id: "gemini",
    name: "Gemini",
    color: "#4E88F5",
    domains: [
      "gemini.google.com",
      "bard.google.com",
      "ai.google.com",
      "aistudio.google.com",
    ],
    appPackages: ["com.google.android.apps.bard"],
    utmSources: [
      "gemini",
      "bard",
      "google_gemini",
      "google-gemini",
      "google_ai",
      "google-ai",
    ],
  },
  {
    id: "claude",
    name: "Claude",
    color: "#D97706",
    domains: ["claude.ai", "anthropic.com"],
    appPackages: ["com.anthropic.claude"],
    utmSources: ["claude", "anthropic", "claude_ai", "claude.ai"],
  },
  {
    id: "copilot",
    name: "Microsoft Copilot",
    color: "#0078D4",
    domains: [
      "copilot.microsoft.com",
      "copilot.cloud.microsoft",
      "edgeservices.bing.com",
      "sydney.bing.com",
    ],
    pathRules: [
      {
        hostSuffix: "bing.com",
        pathPrefix: "/chat",
      },
    ],
    appPackages: ["com.microsoft.copilot"],
    utmSources: [
      "copilot",
      "bing_chat",
      "bingchat",
      "ms_copilot",
      "microsoft_copilot",
      "ms-copilot",
    ],
  },
  {
    id: "poe",
    name: "Poe",
    color: "#8B5CF6",
    domains: ["poe.com"],
    appPackages: ["com.poe.app"],
    utmSources: ["poe", "poe_ai", "poe.com"],
  },
  {
    id: "you",
    name: "You.com",
    color: "#0EA5E9",
    domains: ["you.com"],
    appPackages: [],
    utmSources: ["you.com", "youchat", "you_chat"],
  },
  {
    id: "deepseek",
    name: "DeepSeek",
    color: "#4F46E5",
    domains: ["deepseek.com", "chat.deepseek.com"],
    appPackages: [],
    utmSources: ["deepseek", "deepseek_ai", "deepseek-ai"],
  },
  {
    id: "grok",
    name: "Grok",
    color: "#EC4899",
    domains: ["grok.com", "x.ai"],
    appPackages: [],
    utmSources: ["grok", "x_ai", "x.ai"],
  },
  {
    id: "meta_ai",
    name: "Meta AI",
    color: "#3B82F6",
    domains: ["meta.ai", "imagine.meta.com"],
    appPackages: [],
    utmSources: ["meta_ai", "meta-ai", "meta.ai"],
  },
];

/**
 * Normalizes a raw referrer string.
 * Handles:
 * - protocols (https, http, android-app://)
 * - ports (:8080)
 * - trailing dots (DNS root)
 * - www prefixes
 * - case differences
 * - mobile app schemes
 *
 * @param {string|null} referrer
 * @returns {{ host: string, pathname: string, fullUrl: string, isApp: boolean, appPackage: string }}
 */
export function normalizeReferrer(referrer) {
  if (!referrer || typeof referrer !== "string") {
    return { host: "", pathname: "", fullUrl: "", isApp: false, appPackage: "" };
  }

  const raw = referrer.trim();
  if (!raw) {
    return { host: "", pathname: "", fullUrl: "", isApp: false, appPackage: "" };
  }

  // Handle Android mobile app scheme: android-app://com.openai.chatgpt/...
  if (raw.toLowerCase().startsWith("android-app://")) {
    const withoutScheme = raw.slice("android-app://".length);
    const parts = withoutScheme.split("/");
    const appPackage = (parts[0] || "").toLowerCase().trim();
    return {
      host: appPackage,
      pathname: parts.slice(1).join("/"),
      fullUrl: raw.toLowerCase(),
      isApp: true,
      appPackage,
    };
  }

  // Prepend protocol if missing for standard URL parsing
  let toParse = raw;
  if (!/^https?:\/\//i.test(toParse)) {
    toParse = "https://" + toParse;
  }

  try {
    const parsed = new URL(toParse);
    let host = parsed.hostname.toLowerCase().trim();

    // Strip trailing dot (e.g. chatgpt.com.)
    if (host.endsWith(".")) {
      host = host.slice(0, -1);
    }
    // Strip leading www.
    if (host.startsWith("www.")) {
      host = host.slice(4);
    }

    const pathname = parsed.pathname.toLowerCase();
    const fullUrl = (host + pathname).toLowerCase();

    return {
      host,
      pathname,
      fullUrl,
      isApp: false,
      appPackage: "",
    };
  } catch {
    return { host: "", pathname: "", fullUrl: "", isApp: false, appPackage: "" };
  }
}

/**
 * Normalizes search parameters into URLSearchParams.
 * @param {URLSearchParams|string|null} search
 * @returns {URLSearchParams}
 */
export function normalizeSearchParams(search) {
  if (!search) return new URLSearchParams();
  if (typeof search === "string") {
    const clean = search.startsWith("?") ? search.slice(1) : search;
    return new URLSearchParams(clean);
  }
  return search;
}

/**
 * Detects if an inbound request or stored session originated from a verified AI source.
 * Evaluates referrer domains, mobile app packages, and strict AI UTM allowlists.
 *
 * @param {string|null} referrer - document.referrer or stored referrer
 * @param {URLSearchParams|string|null} [search] - URL query string or URLSearchParams
 * @returns {{
 *   isAiReferral: boolean,
 *   attributionType: "VERIFIED_AI_REFERRAL" | "UNKNOWN_AI",
 *   platform: string | null,
 *   platformId: string | null,
 *   sourceType: "referrer_domain" | "app_package" | "path_pattern" | "utm_parameter" | null,
 *   domain: string | null,
 *   color: string | null
 * }}
 */
export function detectAiReferral(referrer, search = "") {
  const norm = normalizeReferrer(referrer);
  const params = normalizeSearchParams(search);

  const utmSource = (params.get("utm_source") || "").trim().toLowerCase();

  // 1. Check known AI platforms by normalized referrer domain / app package
  if (norm.host) {
    for (const p of AI_PLATFORMS) {
      // A. Mobile App Package match (e.g. android-app://com.openai.chatgpt)
      if (norm.isApp && p.appPackages && p.appPackages.includes(norm.appPackage)) {
        return {
          isAiReferral: true,
          attributionType: AI_ATTRIBUTION_TYPES.VERIFIED_AI_REFERRAL,
          platform: p.name,
          platformId: p.id,
          sourceType: "app_package",
          domain: norm.appPackage,
          color: p.color,
        };
      }

      // B. Hostname suffix match (e.g. chatgpt.com, ios.chatgpt.com)
      // Strict suffix matching prevents false positives (e.g. not-chatgpt.com will NOT match chatgpt.com)
      const matchesDomain = p.domains.some(
        (d) => norm.host === d || norm.host.endsWith("." + d)
      );

      if (matchesDomain) {
        return {
          isAiReferral: true,
          attributionType: AI_ATTRIBUTION_TYPES.VERIFIED_AI_REFERRAL,
          platform: p.name,
          platformId: p.id,
          sourceType: "referrer_domain",
          domain: norm.host,
          color: p.color,
        };
      }

      // C. Specific path rules (e.g. bing.com/chat)
      if (p.pathRules) {
        for (const rule of p.pathRules) {
          const matchesHost =
            norm.host === rule.hostSuffix ||
            norm.host.endsWith("." + rule.hostSuffix);
          const matchesPath = norm.pathname.startsWith(rule.pathPrefix);
          if (matchesHost && matchesPath) {
            return {
              isAiReferral: true,
              attributionType: AI_ATTRIBUTION_TYPES.VERIFIED_AI_REFERRAL,
              platform: p.name,
              platformId: p.id,
              sourceType: "path_pattern",
              domain: norm.host,
              color: p.color,
            };
          }
        }
      }
    }
  }

  // 2. Check explicit AI campaign UTM parameters against STRICT allowlist
  if (utmSource) {
    for (const p of AI_PLATFORMS) {
      if (p.utmSources.includes(utmSource)) {
        return {
          isAiReferral: true,
          attributionType: AI_ATTRIBUTION_TYPES.VERIFIED_AI_REFERRAL,
          platform: p.name,
          platformId: p.id,
          sourceType: "utm_parameter",
          domain: norm.host || "utm-campaign",
          color: p.color,
        };
      }
    }
  }

  // 3. No verified AI signal present
  return {
    isAiReferral: false,
    attributionType: AI_ATTRIBUTION_TYPES.UNKNOWN_AI,
    platform: null,
    platformId: null,
    sourceType: null,
    domain: null,
    color: null,
  };
}

/**
 * Server-safe helper to identify AI platform name from stored session records.
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
