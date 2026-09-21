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
 *
 * Uses the deterministic resolveAcquisition priority engine.
 */

import { resolveAcquisition, extractGeoFromHeaders } from "./serverAnalytics.js";

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
  const resolved = resolveAcquisition({
    clientReferrer: referrer,
    searchParams: search,
    currentOrigin,
  });

  if (resolved.source === "Bot") {
    return "Direct";
  }

  return resolved.source;
}
