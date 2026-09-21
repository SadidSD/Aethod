/**
 * Aeethod Studio — Universal AI Platform Registry & Referrer Engine
 *
 * Centralized, extensible registry for identifying conversational AI referral traffic:
 * - ChatGPT / OpenAI (chatgpt.com, chat.openai.com, openai.com, com.openai.chatgpt)
 * - Gemini (gemini.google.com, bard.google.com, aistudio.google.com, notebooklm.google.com)
 * - Claude (claude.ai, claude.ai/referral/*, anthropic.com, com.anthropic.claude)
 * - DeepSeek (deepseek.com, deepseek.ai, chat.deepseek.com, com.deepseek.chat)
 * - Perplexity (perplexity.ai, *.perplexity.ai, ai.perplexity.app)
 * - Microsoft Copilot (copilot.microsoft.com, copilot.cloud.microsoft, bing.com/chat, bing.com/copilot)
 * - Grok (grok.com, x.ai, x.com/i/grok)
 * - Meta AI (meta.ai, imagine.meta.com)
 * - You.com (you.com, youchat.com)
 * - Poe (poe.com, com.poe.app)
 * - Mistral / Le Chat (chat.mistral.ai, mistral.ai)
 * - Character.AI (character.ai, beta.character.ai)
 * - Extensible: Qwen, Kimi, Pi, HuggingChat, Phind, future AI models
 *
 * STRICT GUIDELINES:
 * - Never guess or fabricate AI traffic without a measurable attribution signal.
 * - document.referrer missing + no explicit AI UTM -> strictly Direct (not AI).
 * - Standard search (Google, Bing) -> strictly Organic Search.
 * - Standard social (Facebook, X/Twitter, LinkedIn) -> strictly Social.
 * - Substring matching is forbidden (e.g., fake-chatgpt.com is NOT ChatGPT).
 */

export const AI_ATTRIBUTION_TYPES = {
  VERIFIED_AI_REFERRAL: "VERIFIED_AI_REFERRAL",
  UNKNOWN_AI: "UNKNOWN_AI",
};

export const INITIAL_AI_PLATFORMS = [
  {
    id: "chatgpt",
    name: "ChatGPT",
    canonicalName: "ChatGPT",
    color: "#10A37F",
    domains: ["chatgpt.com", "openai.com"],
    aliases: ["chat.openai.com", "ios.chatgpt.com"],
    appPackages: ["com.openai.chatgpt"],
    utmSources: [
      "chatgpt",
      "chatgpt.com",
      "openai",
      "openai.com",
      "chat.openai.com",
      "chat_gpt",
      "chat-gpt",
      "gpt-4",
      "gpt-3.5",
      "gpt4",
      "gpt",
    ],
  },
  {
    id: "gemini",
    name: "Gemini",
    canonicalName: "Gemini",
    color: "#4E88F5",
    domains: ["gemini.google.com", "bard.google.com"],
    aliases: [
      "ai.google.com",
      "aistudio.google.com",
      "notebooklm.google.com",
      "notebooklm.google",
      "labs.google.com",
      "labs.google",
    ],
    appPackages: [
      "com.google.android.apps.bard",
      "com.google.android.apps.gemini",
    ],
    utmSources: [
      "gemini",
      "gemini.google.com",
      "bard",
      "bard.google.com",
      "google_gemini",
      "google-gemini",
      "google_ai",
      "google-ai",
      "notebooklm",
      "aistudio",
    ],
  },
  {
    id: "claude",
    name: "Claude",
    canonicalName: "Claude",
    color: "#D97706",
    domains: ["claude.ai", "anthropic.com"],
    aliases: ["www.claude.ai", "www.anthropic.com"],
    pathRules: [
      {
        hostSuffix: "claude.ai",
        pathPrefixes: ["/referral", "/chat"],
      },
    ],
    appPackages: ["com.anthropic.claude"],
    utmSources: [
      "claude",
      "claude.ai",
      "anthropic",
      "anthropic.com",
      "claude_ai",
      "claude-ai",
    ],
  },
  {
    id: "deepseek",
    name: "DeepSeek",
    canonicalName: "DeepSeek",
    color: "#4F46E5",
    domains: ["deepseek.com", "deepseek.ai"],
    aliases: ["chat.deepseek.com"],
    appPackages: ["com.deepseek.chat"],
    utmSources: [
      "deepseek",
      "deepseek.com",
      "deepseek.ai",
      "chat.deepseek.com",
      "deepseek_ai",
      "deepseek-ai",
    ],
  },
  {
    id: "perplexity",
    name: "Perplexity",
    canonicalName: "Perplexity",
    color: "#20B8CD",
    domains: ["perplexity.ai"],
    aliases: ["www.perplexity.ai", "labs.perplexity.ai"],
    appPackages: ["ai.perplexity.app"],
    utmSources: [
      "perplexity",
      "perplexity.ai",
      "perplexity_ai",
      "perplexity-ai",
    ],
  },
  {
    id: "copilot",
    name: "Microsoft Copilot",
    canonicalName: "Microsoft Copilot",
    color: "#0078D4",
    domains: [
      "copilot.microsoft.com",
      "copilot.cloud.microsoft",
      "edgeservices.bing.com",
      "sydney.bing.com",
    ],
    aliases: [],
    pathRules: [
      {
        hostSuffix: "bing.com",
        pathPrefixes: ["/chat", "/copilot", "/images/create"],
      },
    ],
    appPackages: ["com.microsoft.copilot"],
    utmSources: [
      "copilot",
      "copilot.microsoft.com",
      "bing_chat",
      "bingchat",
      "bing-chat",
      "ms_copilot",
      "microsoft_copilot",
      "ms-copilot",
    ],
  },
  {
    id: "grok",
    name: "Grok",
    canonicalName: "Grok",
    color: "#EC4899",
    domains: ["grok.com", "x.ai"],
    aliases: [],
    pathRules: [
      {
        hostSuffix: "x.com",
        pathPrefixes: ["/i/grok"],
      },
    ],
    appPackages: ["com.x.ai"],
    utmSources: ["grok", "grok.com", "x_ai", "x.ai", "xai"],
  },
  {
    id: "meta_ai",
    name: "Meta AI",
    canonicalName: "Meta AI",
    color: "#3B82F6",
    domains: ["meta.ai"],
    aliases: ["imagine.meta.com"],
    appPackages: ["com.meta.ai"],
    utmSources: ["meta_ai", "meta-ai", "meta.ai", "metaai"],
  },
  {
    id: "you",
    name: "You.com",
    canonicalName: "You.com",
    color: "#0EA5E9",
    domains: ["you.com"],
    aliases: ["youchat.com"],
    appPackages: [],
    utmSources: ["you.com", "youchat", "you_chat", "you-chat"],
  },
  {
    id: "poe",
    name: "Poe",
    canonicalName: "Poe",
    color: "#8B5CF6",
    domains: ["poe.com"],
    aliases: [],
    appPackages: ["com.poe.app"],
    utmSources: ["poe", "poe.com", "poe_ai", "poe-ai"],
  },
  {
    id: "mistral",
    name: "Mistral Le Chat",
    canonicalName: "Mistral Le Chat",
    color: "#F97316",
    domains: ["chat.mistral.ai", "mistral.ai"],
    aliases: [],
    appPackages: [],
    utmSources: ["mistral", "mistral.ai", "lechat", "le_chat", "le-chat"],
  },
  {
    id: "character_ai",
    name: "Character.AI",
    canonicalName: "Character.AI",
    color: "#A855F7",
    domains: ["character.ai"],
    aliases: ["beta.character.ai"],
    appPackages: ["ai.character.app"],
    utmSources: ["character.ai", "character_ai", "characterai", "character-ai"],
  },
  {
    id: "qwen",
    name: "Qwen",
    canonicalName: "Qwen",
    color: "#6366F1",
    domains: ["chat.qwen.ai", "qwen.ai", "qwenlm.ai"],
    aliases: [],
    appPackages: [],
    utmSources: ["qwen", "qwen.ai"],
  },
  {
    id: "kimi",
    name: "Kimi",
    canonicalName: "Kimi",
    color: "#06B6D4",
    domains: ["kimi.moonshot.cn", "kimi.ai"],
    aliases: [],
    appPackages: [],
    utmSources: ["kimi", "kimi.ai", "moonshot"],
  },
  {
    id: "pi",
    name: "Pi",
    canonicalName: "Pi",
    color: "#EAB308",
    domains: ["pi.ai"],
    aliases: [],
    appPackages: [],
    utmSources: ["pi.ai", "heypi"],
  },
  {
    id: "huggingchat",
    name: "HuggingChat",
    canonicalName: "HuggingChat",
    color: "#FFD21E",
    domains: ["huggingface.co"],
    aliases: [],
    pathRules: [
      {
        hostSuffix: "huggingface.co",
        pathPrefixes: ["/chat"],
      },
    ],
    appPackages: [],
    utmSources: ["huggingchat", "huggingface_chat"],
  },
  {
    id: "phind",
    name: "Phind",
    canonicalName: "Phind",
    color: "#14B8A6",
    domains: ["phind.com"],
    aliases: [],
    appPackages: [],
    utmSources: ["phind", "phind.com"],
  },
];

// Active registry (extensible at runtime)
export let AI_PLATFORMS = [...INITIAL_AI_PLATFORMS];

/**
 * Extends the AI platform registry at runtime with new platforms or aliases.
 * @param {Object} platformConfig
 */
export function registerAIPlatform(platformConfig) {
  if (!platformConfig || !platformConfig.name) return;
  const canonicalName = platformConfig.canonicalName || platformConfig.name;
  const existingIdx = AI_PLATFORMS.findIndex(
    (p) => p.id === platformConfig.id || p.canonicalName.toLowerCase() === canonicalName.toLowerCase()
  );

  const normalizedConfig = {
    id: platformConfig.id || canonicalName.toLowerCase().replace(/[^a-z0-9]/g, "_"),
    name: canonicalName,
    canonicalName: canonicalName,
    color: platformConfig.color || "#10B981",
    domains: platformConfig.domains ? platformConfig.domains.map(normalizeHostname) : [],
    aliases: platformConfig.aliases ? platformConfig.aliases.map(normalizeHostname) : [],
    pathRules: platformConfig.pathRules || [],
    appPackages: platformConfig.appPackages || [],
    utmSources: platformConfig.utmSources ? platformConfig.utmSources.map((u) => u.toLowerCase()) : [],
  };

  if (existingIdx !== -1) {
    AI_PLATFORMS[existingIdx] = {
      ...AI_PLATFORMS[existingIdx],
      ...normalizedConfig,
      domains: Array.from(new Set([...AI_PLATFORMS[existingIdx].domains, ...normalizedConfig.domains])),
      aliases: Array.from(new Set([...(AI_PLATFORMS[existingIdx].aliases || []), ...normalizedConfig.aliases])),
      utmSources: Array.from(new Set([...AI_PLATFORMS[existingIdx].utmSources, ...normalizedConfig.utmSources])),
    };
  } else {
    AI_PLATFORMS.push(normalizedConfig);
  }
}

/**
 * Resets the active AI platform registry to its default definitions.
 */
export function resetAIPlatformRegistry() {
  AI_PLATFORMS = [...INITIAL_AI_PLATFORMS];
}

/**
 * Normalizes a raw hostname string.
 * Handles:
 * - casing (HTTPS://WWW.ChatGPT.com -> chatgpt.com)
 * - leading www.
 * - ports (:443, :80, :8080)
 * - trailing dots (DNS root: chatgpt.com.)
 * - URL encoded characters
 * - trailing slashes or query strings
 *
 * @param {string|null} rawHost
 * @returns {string} Normalized canonical hostname
 */
export function normalizeHostname(rawHost) {
  if (!rawHost || typeof rawHost !== "string") return "";

  let host = rawHost.trim().toLowerCase();
  if (!host) return "";

  // Strip protocol if included
  if (host.includes("://")) {
    host = host.split("://")[1] || "";
  }

  // Strip path or query if included
  const slashIdx = host.indexOf("/");
  if (slashIdx !== -1) {
    host = host.slice(0, slashIdx);
  }
  const queryIdx = host.indexOf("?");
  if (queryIdx !== -1) {
    host = host.slice(0, queryIdx);
  }

  // Strip port (:8080, :443)
  const colonIdx = host.indexOf(":");
  if (colonIdx !== -1) {
    host = host.slice(0, colonIdx);
  }

  // Strip trailing dots
  while (host.endsWith(".")) {
    host = host.slice(0, -1);
  }

  // Strip leading www.
  if (host.startsWith("www.")) {
    host = host.slice(4);
  }

  return host;
}

/**
 * Normalizes a raw referrer string.
 * Handles:
 * - protocols (https, http, android-app://)
 * - default/custom ports
 * - trailing dots
 * - www prefixes
 * - case differences
 * - mobile app schemes
 * - referral paths
 *
 * @param {string|null} referrer
 * @returns {{ host: string, pathname: string, fullUrl: string, isApp: boolean, appPackage: string, raw: string }}
 */
export function normalizeReferrer(referrer) {
  if (!referrer || typeof referrer !== "string") {
    return { host: "", pathname: "", fullUrl: "", isApp: false, appPackage: "", raw: "" };
  }

  const raw = referrer.trim();
  if (!raw) {
    return { host: "", pathname: "", fullUrl: "", isApp: false, appPackage: "", raw: "" };
  }

  // Handle Android mobile app scheme: android-app://com.openai.chatgpt/...
  if (raw.toLowerCase().startsWith("android-app://")) {
    const withoutScheme = raw.slice("android-app://".length);
    const parts = withoutScheme.split("/");
    const appPackage = (parts[0] || "").toLowerCase().trim();
    const pathname = "/" + parts.slice(1).join("/");
    return {
      host: appPackage,
      pathname,
      fullUrl: raw.toLowerCase(),
      isApp: true,
      appPackage,
      raw,
    };
  }

  // Prepend protocol if missing for standard URL parsing
  let toParse = raw;
  if (!/^https?:\/\//i.test(toParse)) {
    toParse = "https://" + toParse;
  }

  try {
    const parsed = new URL(toParse);
    const host = normalizeHostname(parsed.hostname);
    const pathname = (parsed.pathname || "/").toLowerCase();
    const fullUrl = (host + pathname).toLowerCase();

    return {
      host,
      pathname,
      fullUrl,
      isApp: false,
      appPackage: "",
      raw,
    };
  } catch {
    // If URL parsing fails, attempt fallback string normalization
    const cleanHost = normalizeHostname(raw);
    return {
      host: cleanHost,
      pathname: "/",
      fullUrl: cleanHost,
      isApp: false,
      appPackage: "",
      raw,
    };
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
 * Detects if a normalized referrer or search query string belongs to a verified AI platform.
 *
 * @param {string|null} referrer - raw referrer or normalized referrer
 * @param {URLSearchParams|string|null} [search] - URL search params
 * @returns {{
 *   isAiReferral: boolean,
 *   attributionType: "VERIFIED_AI_REFERRAL" | "UNKNOWN_AI",
 *   platform: string | null,
 *   platformId: string | null,
 *   sourceType: "referrer_domain" | "app_package" | "path_pattern" | "utm_parameter" | null,
 *   domain: string | null,
 *   color: string | null,
 *   path: string | null
 * }}
 */
export function detectAIPlatform(referrer, search = "") {
  const norm = typeof referrer === "object" && referrer !== null && "host" in referrer
    ? referrer
    : normalizeReferrer(referrer);
  const params = normalizeSearchParams(search);

  let rawUtmSource = "";
  try {
    rawUtmSource = decodeURIComponent(params.get("utm_source") || "").trim().toLowerCase();
  } catch {
    rawUtmSource = (params.get("utm_source") || "").trim().toLowerCase();
  }

  // Normalize UTM source: strip trailing slashes, www. prefix
  const utmSource = rawUtmSource.replace(/\/+$/, "").replace(/^www\./, "");

  // 1. Evaluate Normalized Referrer Host / App Package
  if (norm.host) {
    for (const p of AI_PLATFORMS) {
      // A. Mobile App Package match (e.g. android-app://com.openai.chatgpt)
      if (norm.isApp && p.appPackages && p.appPackages.includes(norm.appPackage)) {
        return {
          isAiReferral: true,
          attributionType: AI_ATTRIBUTION_TYPES.VERIFIED_AI_REFERRAL,
          platform: p.canonicalName || p.name,
          platformId: p.id,
          sourceType: "app_package",
          domain: norm.appPackage,
          color: p.color,
          path: norm.pathname,
        };
      }

      // B. Path Rules match (e.g. claude.ai/referral, bing.com/chat, bing.com/copilot)
      if (p.pathRules) {
        for (const rule of p.pathRules) {
          const matchesHost =
            norm.host === rule.hostSuffix ||
            norm.host.endsWith("." + rule.hostSuffix);
          if (matchesHost) {
            const prefixes = Array.isArray(rule.pathPrefixes)
              ? rule.pathPrefixes
              : rule.pathPrefix
              ? [rule.pathPrefix]
              : [];
            const matchesPath = prefixes.some(
              (prefix) =>
                norm.pathname === prefix ||
                norm.pathname.startsWith(prefix + "/") ||
                norm.pathname.startsWith(prefix + "?")
            );
            if (matchesPath) {
              return {
                isAiReferral: true,
                attributionType: AI_ATTRIBUTION_TYPES.VERIFIED_AI_REFERRAL,
                platform: p.canonicalName || p.name,
                platformId: p.id,
                sourceType: "path_pattern",
                domain: norm.host,
                color: p.color,
                path: norm.pathname,
              };
            }
          }
        }
      }

      // C. Hostname Match against domains & aliases
      // Uses strict boundary check: host === d OR host.endsWith('.' + d)
      // Prevents false positives: 'not-chatgpt.com' or 'chatgpt.com.evil.com' will NOT match
      const allDomains = [...(p.domains || []), ...(p.aliases || [])];
      const matchesDomain = allDomains.some((d) => {
        const cleanD = normalizeHostname(d);
        if (!cleanD) return false;
        return norm.host === cleanD || norm.host.endsWith("." + cleanD);
      });

      if (matchesDomain) {
        return {
          isAiReferral: true,
          attributionType: AI_ATTRIBUTION_TYPES.VERIFIED_AI_REFERRAL,
          platform: p.canonicalName || p.name,
          platformId: p.id,
          sourceType: "referrer_domain",
          domain: norm.host,
          color: p.color,
          path: norm.pathname,
        };
      }
    }
  }

  // 2. Evaluate Explicit AI Campaign UTM Parameters against strict allowlist
  if (utmSource) {
    for (const p of AI_PLATFORMS) {
      const allDomains = [...(p.domains || []), ...(p.aliases || [])].map(normalizeHostname);
      const matchesUtm =
        (p.utmSources && p.utmSources.includes(utmSource)) ||
        allDomains.includes(utmSource);

      if (matchesUtm) {
        return {
          isAiReferral: true,
          attributionType: AI_ATTRIBUTION_TYPES.VERIFIED_AI_REFERRAL,
          platform: p.canonicalName || p.name,
          platformId: p.id,
          sourceType: "utm_parameter",
          domain: norm.host || utmSource,
          color: p.color,
          path: norm.pathname || null,
        };
      }
    }
  }

  // 3. No verified AI referral signal present
  return {
    isAiReferral: false,
    attributionType: AI_ATTRIBUTION_TYPES.UNKNOWN_AI,
    platform: null,
    platformId: null,
    sourceType: null,
    domain: null,
    color: null,
    path: null,
  };
}

/**
 * Backward-compatible wrapper for detectAIPlatform.
 */
export function detectAiReferral(referrer, search = "") {
  return detectAIPlatform(referrer, search);
}

/**
 * Identifies canonical AI platform name from stored record attributes.
 *
 * @param {string|null} referrer
 * @param {string|null} utmSource
 * @param {string|null} utmMedium
 * @param {string|null} [explicitAiPlatform]
 * @returns {string} Canonical platform name or "Other AI"
 */
export function getAiPlatformFromRecord(referrer, utmSource, utmMedium, explicitAiPlatform = null) {
  if (explicitAiPlatform && typeof explicitAiPlatform === "string" && explicitAiPlatform.trim()) {
    const trimmed = explicitAiPlatform.trim();
    const matched = AI_PLATFORMS.find(
      (p) =>
        p.canonicalName.toLowerCase() === trimmed.toLowerCase() ||
        p.name.toLowerCase() === trimmed.toLowerCase() ||
        p.id.toLowerCase() === trimmed.toLowerCase()
    );
    if (matched) return matched.canonicalName || matched.name;
    return trimmed;
  }

  const dummySearch = new URLSearchParams();
  if (utmSource) dummySearch.set("utm_source", utmSource);
  if (utmMedium) dummySearch.set("utm_medium", utmMedium);

  const detection = detectAIPlatform(referrer || "", dummySearch);
  if (detection.isAiReferral && detection.platform) {
    return detection.platform;
  }
  return "Other AI";
}
