/**
 * Aeethod Studio — Server-Side Analytics & Attribution Priority Engine
 *
 * Provides:
 * - Anti-abuse rate limiting per client IP
 * - Geo metadata extraction from Edge / Cloud headers without raw IP storage
 * - Crawler / Bot detection & separation from human referral telemetry
 * - Deterministic acquisition resolution (resolveAcquisition)
 * - Request validation and sanitization
 */

import { z } from "zod";
import {
  normalizeReferrer,
  normalizeHostname,
  normalizeSearchParams,
  detectAIPlatform,
  AI_ATTRIBUTION_TYPES,
} from "./aiPlatforms.js";

// Rate limiter: Map<ip, { count: number, resetAt: number }>
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 150; // max 150 requests / min per IP

/**
 * Cleans and validates raw IP candidates (removes ports, brackets, invalid strings).
 * @param {string|null} raw
 * @returns {string|null}
 */
function cleanCandidateIp(raw) {
  if (!raw || typeof raw !== "string") return null;
  let ip = raw.trim();
  // Remove wrapping brackets from IPv6 with port e.g. [2001:db8::1]:8080
  if (ip.startsWith("[") && ip.includes("]")) {
    ip = ip.slice(1, ip.indexOf("]"));
  } else if (ip.includes(":") && !ip.includes("::") && ip.split(":").length === 2) {
    // IPv4 with port e.g. 198.51.100.1:8080
    ip = ip.split(":")[0];
  }
  const lower = ip.toLowerCase();
  if (!ip || lower === "unknown" || lower === "null" || ip.length > 45) return null;
  return ip;
}

/**
 * Resolves the client IP address server-side from trusted infrastructure headers.
 * NEVER trusts client-supplied body fields or arbitrary spoofed headers.
 * Handles Cloudflare, Vercel, Fastly, AWS, Nginx, localhost, IPv4 and IPv6.
 *
 * @param {Request} request
 * @returns {string}
 */
export function resolveClientIp(request) {
  if (!request?.headers) return "0.0.0.0";

  // 1. Vercel Edge Network (Authoritative for Vercel deployment)
  const vercelIp = request.headers.get("x-vercel-forwarded-for");
  if (vercelIp) {
    const first = cleanCandidateIp(vercelIp.split(",")[0]);
    if (first && !isPrivateIp(first)) return first;
  }

  // 2. Cloudflare CDN (Authoritative when routed through Cloudflare)
  const cfIp = cleanCandidateIp(request.headers.get("cf-connecting-ip"));
  if (cfIp && !isPrivateIp(cfIp)) return cfIp;

  // 3. Fastly / Akamai / AWS CloudFront
  const trueClientIp = cleanCandidateIp(request.headers.get("true-client-ip"));
  if (trueClientIp && !isPrivateIp(trueClientIp)) return trueClientIp;

  // 4. Trusted Reverse Proxy (Nginx / Caddy / Traefik)
  const realIp = cleanCandidateIp(request.headers.get("x-real-ip"));
  if (realIp && !isPrivateIp(realIp)) return realIp;

  // 5. Standard proxy forwarded header (client IP is leftmost non-private IP)
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const parts = forwarded.split(",").map((p) => cleanCandidateIp(p)).filter(Boolean);
    const publicCandidate = parts.find((ip) => !isPrivateIp(ip));
    if (publicCandidate) return publicCandidate;
    if (parts[0]) return parts[0];
  }

  return "0.0.0.0";
}

// Alias for backwards compatibility
export const extractClientIp = resolveClientIp;

/**
 * Basic IP-based rate limiting to prevent telemetry flooding.
 * Does NOT permanently record IP addresses.
 *
 * @param {Request} request
 * @returns {boolean} true if request is allowed, false if rate limited
 */
export function checkRateLimit(request) {
  const ip = extractClientIp(request);

  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now > record.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }

  record.count += 1;
  if (record.count > MAX_REQUESTS_PER_WINDOW) {
    return false;
  }

  return true;
}

// Periodic cleanup of rate limiter to prevent memory leaks
if (typeof setInterval !== "undefined") {
  const timer = setInterval(() => {
    const now = Date.now();
    for (const [ip, record] of rateLimitMap.entries()) {
      if (now > record.resetAt) {
        rateLimitMap.delete(ip);
      }
    }
  }, 5 * 60 * 1000);
  if (timer.unref) timer.unref();
}

// ============================================================
// ISO 3166-1 ALPHA-2 COUNTRY CODE ↔ NAME MAPPING
// Canonical mapping table — prevents broken first-2-chars truncation.
// ============================================================
export const COUNTRY_CODE_TO_NAME = {
  AF: "Afghanistan", AL: "Albania", DZ: "Algeria", AD: "Andorra", AO: "Angola",
  AG: "Antigua and Barbuda", AR: "Argentina", AM: "Armenia", AU: "Australia", AT: "Austria",
  AZ: "Azerbaijan", BS: "Bahamas", BH: "Bahrain", BD: "Bangladesh", BB: "Barbados",
  BY: "Belarus", BE: "Belgium", BZ: "Belize", BJ: "Benin", BT: "Bhutan",
  BO: "Bolivia", BA: "Bosnia and Herzegovina", BW: "Botswana", BR: "Brazil", BN: "Brunei",
  BG: "Bulgaria", BF: "Burkina Faso", BI: "Burundi", CV: "Cape Verde", KH: "Cambodia",
  CM: "Cameroon", CA: "Canada", CF: "Central African Republic", TD: "Chad", CL: "Chile",
  CN: "China", CO: "Colombia", KM: "Comoros", CG: "Congo", CD: "DR Congo",
  CR: "Costa Rica", CI: "Côte d'Ivoire", HR: "Croatia", CU: "Cuba", CY: "Cyprus",
  CZ: "Czech Republic", DK: "Denmark", DJ: "Djibouti", DM: "Dominica", DO: "Dominican Republic",
  EC: "Ecuador", EG: "Egypt", SV: "El Salvador", GQ: "Equatorial Guinea", ER: "Eritrea",
  EE: "Estonia", SZ: "Eswatini", ET: "Ethiopia", FJ: "Fiji", FI: "Finland",
  FR: "France", GA: "Gabon", GM: "Gambia", GE: "Georgia", DE: "Germany",
  GH: "Ghana", GR: "Greece", GD: "Grenada", GT: "Guatemala", GN: "Guinea",
  GW: "Guinea-Bissau", GY: "Guyana", HT: "Haiti", HN: "Honduras", HU: "Hungary",
  IS: "Iceland", IN: "India", ID: "Indonesia", IR: "Iran", IQ: "Iraq",
  IE: "Ireland", IL: "Israel", IT: "Italy", JM: "Jamaica", JP: "Japan",
  JO: "Jordan", KZ: "Kazakhstan", KE: "Kenya", KI: "Kiribati", KP: "North Korea",
  KR: "South Korea", KW: "Kuwait", KG: "Kyrgyzstan", LA: "Laos", LV: "Latvia",
  LB: "Lebanon", LS: "Lesotho", LR: "Liberia", LY: "Libya", LI: "Liechtenstein",
  LT: "Lithuania", LU: "Luxembourg", MG: "Madagascar", MW: "Malawi", MY: "Malaysia",
  MV: "Maldives", ML: "Mali", MT: "Malta", MH: "Marshall Islands", MR: "Mauritania",
  MU: "Mauritius", MX: "Mexico", FM: "Micronesia", MD: "Moldova", MC: "Monaco",
  MN: "Mongolia", ME: "Montenegro", MA: "Morocco", MZ: "Mozambique", MM: "Myanmar",
  NA: "Namibia", NR: "Nauru", NP: "Nepal", NL: "Netherlands", NZ: "New Zealand",
  NI: "Nicaragua", NE: "Niger", NG: "Nigeria", MK: "North Macedonia", NO: "Norway",
  OM: "Oman", PK: "Pakistan", PW: "Palau", PA: "Panama", PG: "Papua New Guinea",
  PY: "Paraguay", PE: "Peru", PH: "Philippines", PL: "Poland", PT: "Portugal",
  QA: "Qatar", RO: "Romania", RU: "Russia", RW: "Rwanda", KN: "Saint Kitts and Nevis",
  LC: "Saint Lucia", VC: "Saint Vincent", WS: "Samoa", SM: "San Marino",
  ST: "São Tomé and Príncipe", SA: "Saudi Arabia", SN: "Senegal", RS: "Serbia",
  SC: "Seychelles", SL: "Sierra Leone", SG: "Singapore", SK: "Slovakia", SI: "Slovenia",
  SB: "Solomon Islands", SO: "Somalia", ZA: "South Africa", SS: "South Sudan", ES: "Spain",
  LK: "Sri Lanka", SD: "Sudan", SR: "Suriname", SE: "Sweden", CH: "Switzerland",
  SY: "Syria", TW: "Taiwan", TJ: "Tajikistan", TZ: "Tanzania", TH: "Thailand",
  TL: "Timor-Leste", TG: "Togo", TO: "Tonga", TT: "Trinidad and Tobago", TN: "Tunisia",
  TR: "Turkey", TM: "Turkmenistan", TV: "Tuvalu", UG: "Uganda", UA: "Ukraine",
  AE: "United Arab Emirates", GB: "United Kingdom", US: "United States", UY: "Uruguay",
  UZ: "Uzbekistan", VU: "Vanuatu", VA: "Vatican City", VE: "Venezuela", VN: "Vietnam",
  YE: "Yemen", ZM: "Zambia", ZW: "Zimbabwe",
  HK: "Hong Kong", MO: "Macau", PR: "Puerto Rico", GU: "Guam", VI: "US Virgin Islands",
  AS: "American Samoa", MP: "Northern Mariana Islands",
};

export const COUNTRY_NAME_TO_CODE = {};
for (const [code, name] of Object.entries(COUNTRY_CODE_TO_NAME)) {
  COUNTRY_NAME_TO_CODE[name.toLowerCase()] = code;
}
COUNTRY_NAME_TO_CODE["usa"] = "US";
COUNTRY_NAME_TO_CODE["united states of america"] = "US";
COUNTRY_NAME_TO_CODE["uk"] = "GB";
COUNTRY_NAME_TO_CODE["great britain"] = "GB";
COUNTRY_NAME_TO_CODE["korea"] = "KR";
COUNTRY_NAME_TO_CODE["republic of korea"] = "KR";
COUNTRY_NAME_TO_CODE["czechia"] = "CZ";
COUNTRY_NAME_TO_CODE["türkiye"] = "TR";
COUNTRY_NAME_TO_CODE["turkiye"] = "TR";

/**
 * Resolves raw country string into canonical { code, name }.
 * NEVER uses "UN" as a country code. Returns Unknown if null or unresolvable.
 *
 * @param {string|null} raw
 * @returns {{ code: string | null, name: string }}
 */
export function resolveCountry(raw) {
  if (!raw || typeof raw !== "string") return { code: null, name: "Unknown" };
  const trimmed = raw.trim();
  if (!trimmed) return { code: null, name: "Unknown" };

  // Explicitly reject placeholder codes
  const upper = trimmed.toUpperCase();
  if (upper === "UN" || upper === "XX" || upper === "T1" || upper === "UNKNOWN") {
    return { code: null, name: "Unknown" };
  }

  // Check 2-letter ISO code
  if (upper.length === 2 && COUNTRY_CODE_TO_NAME[upper]) {
    return { code: upper, name: COUNTRY_CODE_TO_NAME[upper] };
  }

  // Check country name
  const lowerName = trimmed.toLowerCase();
  if (COUNTRY_NAME_TO_CODE[lowerName]) {
    const code = COUNTRY_NAME_TO_CODE[lowerName];
    return { code, name: COUNTRY_CODE_TO_NAME[code] };
  }

  return { code: null, name: trimmed };
}

/**
 * Normalizes city names: trims whitespace, removes "Unknown" placeholders.
 * NEVER fabricates a city when one is not supplied.
 *
 * @param {string|null} city
 * @returns {string|null}
 */
export function normalizeCity(city) {
  if (!city || typeof city !== "string") return null;
  const trimmed = city.trim();
  if (!trimmed || trimmed.toLowerCase() === "unknown" || trimmed.toLowerCase() === "null") {
    return null;
  }
  return trimmed;
}

// Known major cities mapping for consistency validation
const KNOWN_CITY_COUNTRIES = {
  "dhaka": "BD",
  "chittagong": "BD",
  "sylhet": "BD",
  "rajshahi": "BD",
  "khulna": "BD",
  "new york": "US",
  "san francisco": "US",
  "los angeles": "US",
  "chicago": "US",
  "seattle": "US",
  "boston": "US",
  "austin": "US",
  "washington": "US",
  "london": "GB",
  "manchester": "GB",
  "birmingham": "GB",
  "edinburgh": "GB",
  "tokyo": "JP",
  "osaka": "JP",
  "kyoto": "JP",
  "delhi": "IN",
  "mumbai": "IN",
  "bangalore": "IN",
  "hyderabad": "IN",
  "kolkata": "IN",
  "singapore": "SG",
  "berlin": "DE",
  "munich": "DE",
  "frankfurt": "DE",
  "paris": "FR",
  "toronto": "CA",
  "vancouver": "CA",
  "sydney": "AU",
  "melbourne": "AU",
};

/**
 * Validates geographic consistency between country and city.
 * Prevents cross-contamination like "New York" in "BD" or "Dhaka" in "US".
 *
 * @param {string|null} countryCode - 2-letter ISO code
 * @param {string|null} city - City name
 * @returns {boolean} true if consistent or unverified, false if contradictory
 */
export function validateGeoConsistency(countryCode, city) {
  if (!countryCode || !city) return true;
  const normCity = city.trim().toLowerCase();
  const normCode = countryCode.trim().toUpperCase();

  const expectedCountry = KNOWN_CITY_COUNTRIES[normCity];
  if (expectedCountry && expectedCountry !== normCode) {
    return false; // Contradiction: e.g. New York + BD is INVALID
  }

  return true;
}

/**
 * Checks if an IP is a private, loopback, or invalid address.
 */
export function isPrivateIp(ip) {
  if (!ip || typeof ip !== "string") return true;
  const cleanIp = ip.trim();
  return (
    cleanIp === "0.0.0.0" ||
    cleanIp === "127.0.0.1" ||
    cleanIp === "::1" ||
    cleanIp === "unknown" ||
    cleanIp.startsWith("10.") ||
    cleanIp.startsWith("192.168.") ||
    cleanIp.startsWith("172.16.") ||
    cleanIp.startsWith("172.17.") ||
    cleanIp.startsWith("172.18.") ||
    cleanIp.startsWith("172.19.") ||
    cleanIp.startsWith("172.2") ||
    cleanIp.startsWith("172.30.") ||
    cleanIp.startsWith("172.31.") ||
    cleanIp.startsWith("169.254.") ||
    cleanIp.startsWith("fc00:") ||
    cleanIp.startsWith("fe80:")
  );
}

// In-memory cache for IP country lookups
const IP_COUNTRY_CACHE = new Map();
const IP_COUNTRY_CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

/**
 * Flushes the in-memory IP country lookup cache.
 */
export function clearIpCountryCache() {
  IP_COUNTRY_CACHE.clear();
}

/**
 * Authoritative Server-Side Country Geolocation Resolver.
 * Resolves ONLY country ({ countryCode, countryName }) from the visitor's IP address.
 *
 * Rules:
 * - Never infers country from browser language.
 * - Never infers country from timezone.
 * - Never infers country from city.
 * - Never infers country from frontend data.
 * - Never uses hardcoded country values.
 * - Never fabricates missing country.
 * - If country cannot be reliably determined, returns "Unknown".
 * - Does not use city/metro data anywhere in the country calculation.
 *
 * @param {string} ip
 * @returns {Promise<{ countryCode: string | null, countryName: string }>}
 */
export async function resolveCountryFromIp(ip) {
  const unknownResult = { countryCode: null, countryName: "Unknown" };

  if (!ip || typeof ip !== "string") {
    return unknownResult;
  }

  const cleanIp = cleanCandidateIp(ip);
  if (!cleanIp || isPrivateIp(cleanIp)) {
    return unknownResult;
  }

  // Check in-memory cache
  const cached = IP_COUNTRY_CACHE.get(cleanIp);
  if (cached && Date.now() - cached.timestamp < IP_COUNTRY_CACHE_TTL_MS) {
    return cached.data;
  }

  try {
    const response = await fetch(
      `http://ip-api.com/json/${encodeURIComponent(cleanIp)}?fields=status,message,country,countryCode`,
      { signal: AbortSignal.timeout(3000) }
    );

    if (!response.ok) return unknownResult;
    const data = await response.json();

    if (data.status === "success" && data.countryCode) {
      const canonical = resolveCountry(data.countryCode);
      const result = {
        countryCode: canonical.code || data.countryCode.toUpperCase(),
        countryName: canonical.name !== "Unknown" ? canonical.name : (data.country || "Unknown"),
      };
      IP_COUNTRY_CACHE.set(cleanIp, { data: result, timestamp: Date.now() });
      return result;
    }
  } catch {
    // Network or timeout failure
  }

  return unknownResult;
}

/**
 * Legacy Geolocation Resolver: kept for backward compatibility.
 * Delegates to resolveCountryFromIp and strictly guarantees NO city/metro fabrication.
 *
 * @param {string} ip
 */
export async function resolveGeoFromIp(ip) {
  const res = await resolveCountryFromIp(ip);
  return {
    countryCode: res.countryCode,
    countryName: res.countryName !== "Unknown" ? res.countryName : null,
    regionCode: null,
    regionName: null,
    city: null,
    metro: null,
    timezone: null,
  };
}

/**
 * Extracts non-sensitive country location from trusted IP or Edge headers.
 * Never stores or exposes raw IP addresses.
 * Resolves ONLY country level data; all city and metro fields are strictly null.
 *
 * @param {Request} request
 * @returns {Promise<{
 *   countryCode: string | null,
 *   countryName: string,
 *   country: string | null,
 *   city: null,
 *   metro: null,
 *   regionCode: null,
 *   regionName: null,
 *   timezone: null
 * }>}
 */
export async function extractGeoFromHeaders(request) {
  const unknownGeo = {
    countryCode: null,
    countryName: "Unknown",
    country: null,
    city: null,
    metro: null,
    regionCode: null,
    regionName: null,
    timezone: null,
  };

  if (!request) return unknownGeo;

  // 1. Resolve actual client IP from trusted infrastructure headers
  const clientIp = resolveClientIp(request);

  // 2. If client IP is a valid public IP, resolve country authoritatively
  if (!isPrivateIp(clientIp)) {
    const countryRes = await resolveCountryFromIp(clientIp);
    if (countryRes.countryCode && countryRes.countryName !== "Unknown") {
      return {
        countryCode: countryRes.countryCode,
        countryName: countryRes.countryName,
        country: countryRes.countryName,
        city: null,
        metro: null,
        regionCode: null,
        regionName: null,
        timezone: null,
      };
    }
  }

  // 3. Deployment Edge header fallback (Cloudflare / Vercel Edge networks)
  const edgeCountry =
    request.headers?.get("cf-ipcountry") ||
    request.headers?.get("x-vercel-ip-country") ||
    null;

  if (edgeCountry) {
    const upper = edgeCountry.trim().toUpperCase();
    if (upper && upper !== "UN" && upper !== "XX" && upper !== "T1" && upper !== "UNKNOWN") {
      const canonical = resolveCountry(upper);
      if (canonical.name !== "Unknown") {
        return {
          countryCode: canonical.code,
          countryName: canonical.name,
          country: canonical.name,
          city: null,
          metro: null,
          regionCode: null,
          regionName: null,
          timezone: null,
        };
      }
    }
  }

  return unknownGeo;
}

// ============================================================
// BOT / CRAWLER DETECTION
// ============================================================

const KNOWN_CRAWLER_TOKENS = [
  "gptbot",
  "claudebot",
  "claude-web",
  "anthropic-ai",
  "perplexitybot",
  "googlebot",
  "google-inspectiontool",
  "bingbot",
  "msnbot",
  "yandexbot",
  "baiduspider",
  "duckduckbot",
  "slurp",
  "applebot",
  "facebookexternalhit",
  "meta-externalagent",
  "bytespider",
  "twitterbot",
  "linkedinbot",
  "slackbot",
  "discordbot",
  "whatsapp",
  "telegrambot",
  "headlesschrome",
  "phantomjs",
  "ahrefsbot",
  "semrushbot",
  "dotbot",
  "roguebot",
  "ccbot",
  "diffbot",
];

/**
 * Determines whether an incoming request originates from an automated AI or search crawler.
 * Crawlers must be separated from human referral visitors and conversion sessions.
 *
 * @param {string|null} userAgent
 * @returns {{ isCrawler: boolean, botName: string|null }}
 */
export function isCrawler(userAgent) {
  if (!userAgent || typeof userAgent !== "string") {
    return { isCrawler: false, botName: null };
  }

  const lowerUA = userAgent.toLowerCase();
  for (const token of KNOWN_CRAWLER_TOKENS) {
    if (lowerUA.includes(token)) {
      return { isCrawler: true, botName: token };
    }
  }

  return { isCrawler: false, botName: null };
}

// ============================================================
// SEARCH & SOCIAL RECOGNITION REGISTRIES
// ============================================================

const SEARCH_ENGINE_DOMAINS = [
  "google.",
  "bing.",
  "duckduckgo.",
  "yahoo.",
  "baidu.",
  "yandex.",
  "ecosia.",
  "ask.",
  "qwant.",
  "brave.",
  "startpage.",
  "searx.",
];

const SOCIAL_PLATFORM_DOMAINS = [
  "facebook.com",
  "instagram.com",
  "twitter.com",
  "x.com",
  "t.co",
  "linkedin.com",
  "reddit.com",
  "youtube.com",
  "youtu.be",
  "tiktok.com",
  "threads.net",
  "pinterest.",
  "dribbble.com",
  "behance.net",
  "substack.com",
  "medium.com",
  "mastodon.",
  "bsky.app",
];

const PAID_MEDIUM_TOKENS = [
  "cpc",
  "ppc",
  "paid",
  "paidsocial",
  "paidsearch",
  "ad",
  "ads",
  "display",
  "retargeting",
  "sponsored",
];

export function isSearchEngine(host) {
  if (!host) return false;
  return SEARCH_ENGINE_DOMAINS.some(
    (domain) => host === domain || host.endsWith("." + domain) || host.includes(domain)
  );
}

export function isSocialPlatform(host) {
  if (!host) return false;
  return SOCIAL_PLATFORM_DOMAINS.some(
    (domain) => host === domain || host.endsWith("." + domain) || host.includes(domain)
  );
}

export function isPaidTraffic(params) {
  if (!params) return false;
  const medium = params.get("utm_medium")?.toLowerCase() || "";
  const hasPaidAdId =
    params.has("gclid") ||
    params.has("fbclid") ||
    params.has("ttclid") ||
    params.has("wbraid") ||
    params.has("msclkid");

  return hasPaidAdId || PAID_MEDIUM_TOKENS.includes(medium);
}

/**
 * Deterministic Acquisition Resolution Engine
 *
 * Evaluates attribution priority:
 * 1. Crawler check (discards bots from referral counts)
 * 2. Paid traffic check (ad IDs / paid mediums)
 * 3. Server HTTP Referer (Source of Truth)
 * 4. Client Referrer (fallback if server header stripped)
 * 5. Explicit AI Campaign / UTM allowlist
 * 6. External Unclassified Referrer (flags unknownReferrerHost for discovery)
 * 7. Direct (no attribution signal)
 *
 * @param {Object} options
 * @param {string|null} [options.serverReferer] - request.headers.get("referer")
 * @param {string|null} [options.clientReferrer] - document.referrer submitted by client
 * @param {URLSearchParams|string|null} [options.searchParams] - query params / UTM
 * @param {string} [options.currentOrigin] - server host or window origin to filter self-referrals
 * @param {string|null} [options.userAgent] - request user-agent
 * @returns {{
 *   source: "AI Referral" | "Organic Search" | "Social" | "Paid Ads" | "Referral" | "Direct" | "Bot",
 *   isCrawler: boolean,
 *   aiPlatform: string | null,
 *   confidence: "high" | "medium" | "low" | "unknown",
 *   referrerHost: string | null,
 *   referrerPath: string | null,
 *   unknownReferrerHost: string | null,
 *   reason: string,
 *   conflict: Object | null
 * }}
 */
export function resolveAcquisition({
  serverReferer = null,
  clientReferrer = null,
  searchParams = "",
  currentOrigin = "",
  userAgent = "",
}) {
  const params = normalizeSearchParams(searchParams);

  // 1. Crawler / Bot Check
  const crawlerInfo = isCrawler(userAgent);
  if (crawlerInfo.isCrawler) {
    return {
      source: "Bot",
      isCrawler: true,
      aiPlatform: null,
      confidence: "high",
      referrerHost: null,
      referrerPath: null,
      unknownReferrerHost: null,
      reason: `crawler_detected:${crawlerInfo.botName}`,
      conflict: null,
    };
  }

  // 2. Paid Ads Check (Ad click IDs or paid UTM mediums)
  if (isPaidTraffic(params)) {
    return {
      source: "Paid Ads",
      isCrawler: false,
      aiPlatform: null,
      confidence: "high",
      referrerHost: null,
      referrerPath: null,
      unknownReferrerHost: null,
      reason: "paid_campaign_signals",
      conflict: null,
    };
  }

  // Normalize server & client referrers
  const normServer = normalizeReferrer(serverReferer);
  const normClient = normalizeReferrer(clientReferrer);

  // Normalize current origin hostname to filter self-referrals
  const originHost = normalizeHostname(currentOrigin);

  // Check client UTM for potential conflict comparison
  const clientUtmAi = detectAIPlatform("", params);

  // Helper to test if a normalized host is internal
  const isSelf = (host) => {
    if (!host || !originHost) return false;
    return host === originHost || host.endsWith("." + originHost);
  };

  // 3. Evaluate Server HTTP Referer (Primary Source of Truth)
  if (normServer.host && !isSelf(normServer.host)) {
    // A. Check AI Platform Registry
    const serverAi = detectAIPlatform(normServer, params);
    if (serverAi.isAiReferral && serverAi.attributionType === AI_ATTRIBUTION_TYPES.VERIFIED_AI_REFERRAL) {
      let conflict = null;
      if (clientUtmAi.isAiReferral && clientUtmAi.platform !== serverAi.platform) {
        conflict = {
          serverRefererPlatform: serverAi.platform,
          clientUtmPlatform: clientUtmAi.platform,
        };
      }

      return {
        source: "AI Referral",
        isCrawler: false,
        aiPlatform: serverAi.platform,
        confidence: "high",
        detectionMethod: serverAi.detectionMethod || "referrer",
        referrerHost: normServer.host,
        referrerPath: normServer.pathname,
        unknownReferrerHost: null,
        reason: "server_referer_ai_match",
        conflict,
      };
    }

    // B. Check Search Engine Registry
    if (isSearchEngine(normServer.host)) {
      return {
        source: "Organic Search",
        isCrawler: false,
        aiPlatform: null,
        confidence: "high",
        referrerHost: normServer.host,
        referrerPath: normServer.pathname,
        unknownReferrerHost: null,
        reason: "recognized_search_engine",
        conflict: null,
      };
    }

    // C. Check Social Platform Registry
    if (isSocialPlatform(normServer.host)) {
      return {
        source: "Social",
        isCrawler: false,
        aiPlatform: null,
        confidence: "high",
        referrerHost: normServer.host,
        referrerPath: normServer.pathname,
        unknownReferrerHost: null,
        reason: "recognized_social_network",
        conflict: null,
      };
    }

    // D. External Unclassified Referrer (Candidate for Unknown Referrer Discovery)
    return {
      source: "Referral",
      isCrawler: false,
      aiPlatform: null,
      confidence: "medium",
      referrerHost: normServer.host,
      referrerPath: normServer.pathname,
      unknownReferrerHost: normServer.host,
      reason: "external_referral_unclassified",
      conflict: null,
    };
  }

  // 4. Evaluate Client Referrer (Fallback if proxy stripped server Referer)
  if (normClient.host && !isSelf(normClient.host)) {
    // A. Check AI Platform Registry
    const clientAi = detectAIPlatform(normClient, params);
    if (clientAi.isAiReferral && clientAi.attributionType === AI_ATTRIBUTION_TYPES.VERIFIED_AI_REFERRAL) {
      return {
        source: "AI Referral",
        isCrawler: false,
        aiPlatform: clientAi.platform,
        confidence: "high",
        detectionMethod: clientAi.detectionMethod || "referrer",
        referrerHost: normClient.host,
        referrerPath: normClient.pathname,
        unknownReferrerHost: null,
        reason: "client_referer_ai_match",
        conflict: null,
      };
    }

    // B. Check Search Engine Registry
    if (isSearchEngine(normClient.host)) {
      return {
        source: "Organic Search",
        isCrawler: false,
        aiPlatform: null,
        confidence: "high",
        detectionMethod: "referrer",
        referrerHost: normClient.host,
        referrerPath: normClient.pathname,
        unknownReferrerHost: null,
        reason: "client_search_engine",
        conflict: null,
      };
    }

    // C. Check Social Platform Registry
    if (isSocialPlatform(normClient.host)) {
      return {
        source: "Social",
        isCrawler: false,
        aiPlatform: null,
        confidence: "high",
        detectionMethod: "referrer",
        referrerHost: normClient.host,
        referrerPath: normClient.pathname,
        unknownReferrerHost: null,
        reason: "client_social_network",
        conflict: null,
      };
    }

    // D. External Unclassified Referrer
    return {
      source: "Referral",
      isCrawler: false,
      aiPlatform: null,
      confidence: "medium",
      detectionMethod: "referrer",
      referrerHost: normClient.host,
      referrerPath: normClient.pathname,
      unknownReferrerHost: normClient.host,
      reason: "client_referral_unclassified",
      conflict: null,
    };
  }

  // 5. Explicit AI Campaign UTM Parameters (Referrer stripped or privacy mode)
  if (clientUtmAi.isAiReferral && clientUtmAi.attributionType === AI_ATTRIBUTION_TYPES.VERIFIED_AI_REFERRAL) {
    return {
      source: "AI Referral",
      isCrawler: false,
      aiPlatform: clientUtmAi.platform,
      confidence: "high",
      detectionMethod: "utm",
      referrerHost: clientUtmAi.domain || "utm-campaign",
      referrerPath: null,
      unknownReferrerHost: null,
      reason: "explicit_ai_campaign",
      conflict: null,
    };
  }

  // 6. Direct / Unattributed (No referrer, no campaign)
  return {
    source: "Direct",
    isCrawler: false,
    aiPlatform: null,
    confidence: "unknown",
    detectionMethod: null,
    referrerHost: null,
    referrerPath: null,
    unknownReferrerHost: null,
    reason: "no_attribution_signal",
    conflict: null,
  };
}

// ============================================================
// ZOD SCHEMAS FOR ANALYTICS INGESTION
// ============================================================

export const PageViewSchema = z.object({
  visitorId: z.string().min(5).max(64),
  sessionId: z.string().min(5).max(64),
  path: z.string().min(1).max(500),
  landingPage: z.string().max(500).optional().nullable(),
  referrer: z.string().max(1000).optional().nullable(),
  trafficSource: z.enum(["Direct", "Organic Search", "Social", "Paid Ads", "Referral", "AI Referral"]).default("Direct"),
  aiPlatform: z.string().max(100).optional().nullable(),
  aiAttributionType: z.string().max(50).optional().nullable(),
  detectionMethod: z.string().max(50).optional().nullable(),
  aiReferrerHost: z.string().max(255).optional().nullable(),
  aiReferrerPath: z.string().max(500).optional().nullable(),
  unknownReferrerHost: z.string().max(255).optional().nullable(),
  utm: z
    .object({
      utm_source: z.string().max(200).optional().nullable(),
      utm_medium: z.string().max(200).optional().nullable(),
      utm_campaign: z.string().max(200).optional().nullable(),
      utm_term: z.string().max(200).optional().nullable(),
      utm_content: z.string().max(200).optional().nullable(),
    })
    .optional()
    .nullable(),
  device: z
    .object({
      device_type: z.string().max(50).optional().nullable(),
      operating_system: z.string().max(50).optional().nullable(),
      browser: z.string().max(50).optional().nullable(),
      screen_resolution: z.string().max(50).optional().nullable(),
    })
    .optional()
    .nullable(),
  isNewVisitor: z.boolean().optional(),
  isNewSession: z.boolean().optional(),
});

export const HeartbeatSchema = z.object({
  visitorId: z.string().min(5).max(64),
  sessionId: z.string().min(5).max(64),
  path: z.string().min(1).max(500),
  dwellSeconds: z.number().int().min(1).max(300).default(20),
});

export const EventSchema = z.object({
  visitorId: z.string().min(5).max(64),
  sessionId: z.string().min(5).max(64),
  eventName: z.string().min(1).max(80),
  eventValue: z.any().optional().nullable(),
  pagePath: z.string().max(500).optional().nullable(),
});
