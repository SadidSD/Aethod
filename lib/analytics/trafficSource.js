/**
 * Traffic Source & Attribution Classifier
 *
 * Classifies inbound traffic according to agency analytics taxonomy:
 * - Paid Ads
 * - AI Referral
 * - Organic Search
 * - Social
 * - Referral
 * - Direct
 */

import { detectAiReferral } from "./aiPlatforms.js";

const SEARCH_DOMAINS = [
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
];

const SOCIAL_DOMAINS = [
  "twitter.com",
  "x.com",
  "t.co",
  "linkedin.com",
  "instagram.com",
  "facebook.com",
  "reddit.com",
  "youtube.com",
  "youtu.be",
  "threads.net",
  "tiktok.com",
  "pinterest.",
  "dribbble.com",
  "behance.net",
  "substack.com",
];

const PAID_MEDIUMS = [
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

/**
 * Extracts standard UTM parameters from search parameters.
 * @param {URLSearchParams|string} search
 * @returns {{ utm_source: string|null, utm_medium: string|null, utm_campaign: string|null, utm_term: string|null, utm_content: string|null }}
 */
export function extractUtmParams(search) {
  const params = typeof search === "string" ? new URLSearchParams(search) : search;
  if (!params) {
    return {
      utm_source: null,
      utm_medium: null,
      utm_campaign: null,
      utm_term: null,
      utm_content: null,
    };
  }

  return {
    utm_source: params.get("utm_source") || null,
    utm_medium: params.get("utm_medium") || null,
    utm_campaign: params.get("utm_campaign") || null,
    utm_term: params.get("utm_term") || null,
    utm_content: params.get("utm_content") || null,
  };
}

/**
 * Classifies traffic source from referrer and UTM parameters.
 *
 * @param {string} referrer - document.referrer
 * @param {URLSearchParams|string} search - URL query string or URLSearchParams
 * @param {string} currentOrigin - window.location.origin
 * @returns {"Direct"|"Organic Search"|"Social"|"Paid Ads"|"Referral"|"AI Referral"}
 */
export function classifyTrafficSource(referrer, search, currentOrigin = "") {
  const params = typeof search === "string" ? new URLSearchParams(search) : search;
  const medium = params?.get("utm_medium")?.toLowerCase() || "";
  const hasPaidAdId =
    params?.has("gclid") ||
    params?.has("fbclid") ||
    params?.has("ttclid") ||
    params?.has("wbraid") ||
    params?.has("msclkid");

  // 1. Paid Ads Check (UTM medium or advertising click IDs)
  if (hasPaidAdId || PAID_MEDIUMS.includes(medium)) {
    return "Paid Ads";
  }

  // 2. AI Referral Check (reliable known AI domains, app packages, or explicit AI UTM allowlist)
  const aiDetection = detectAiReferral(referrer, params);
  if (aiDetection.isAiReferral) {
    return "AI Referral";
  }

  // 3. Medium-based classification overrides for Organic / Social
  if (medium === "organic" || medium === "search") {
    return "Organic Search";
  }
  if (medium === "social" || medium === "social-network" || medium === "social-media") {
    return "Social";
  }

  // 4. Direct Check (No referrer, or internal self-referral)
  if (!referrer || referrer.trim() === "") {
    return "Direct";
  }

  try {
    const refUrl = new URL(referrer.startsWith("http") ? referrer : "https://" + referrer);
    if (currentOrigin) {
      try {
        const curUrl = new URL(currentOrigin);
        if (refUrl.hostname.toLowerCase() === curUrl.hostname.toLowerCase()) {
          return "Direct";
        }
      } catch {
        if (refUrl.origin === currentOrigin) {
          return "Direct";
        }
      }
    }

    const host = refUrl.hostname.toLowerCase();

    // 5. Organic Search Check
    if (SEARCH_DOMAINS.some((domain) => host === domain || host.includes(domain))) {
      return "Organic Search";
    }

    // 6. Social Media Check
    if (SOCIAL_DOMAINS.some((domain) => host === domain || host.endsWith("." + domain) || host.includes(domain))) {
      return "Social";
    }

    // 7. Default External Referral
    return "Referral";
  } catch {
    return "Direct";
  }
}
