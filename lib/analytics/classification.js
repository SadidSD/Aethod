/**
 * Aeethod Studio — Session Classification & Bot/Test Filtering Engine
 *
 * Classifies browsing sessions into:
 * - human_or_unknown: Standard organic human or unclassified visitor (default)
 * - bot: Automated crawler, search engine bot, scraper, or synthetic monitor
 * - test: Controlled admin/developer test session (VPN test, E2E run, etc.)
 *
 * CRITICAL RULES:
 * - NEVER classify as bot solely due to country, VPN, proxy, short duration, or device type.
 * - Preserve all legitimate unknown visitors.
 * - Excluded sessions are NEVER deleted — preserved for forensic audit.
 */

import { isCrawler } from "./serverAnalytics.js";

export const SESSION_CLASSIFICATIONS = {
  HUMAN_OR_UNKNOWN: "human_or_unknown",
  BOT: "bot",
  TEST: "test",
};

export const CLASSIFICATION_LABELS = {
  [SESSION_CLASSIFICATIONS.HUMAN_OR_UNKNOWN]: "Legitimate",
  [SESSION_CLASSIFICATIONS.BOT]: "Bot (Excluded)",
  [SESSION_CLASSIFICATIONS.TEST]: "Test (Excluded)",
};

/**
 * Detects session classification using reliable server-side signals.
 *
 * @param {Request} request - Incoming HTTP request
 * @param {Object} [body={}] - Parsed JSON body payload
 * @returns {{ classification: string, reason: string }}
 */
export function detectSessionClassification(request, body = {}) {
  const headers = request?.headers;
  const userAgent = headers?.get("user-agent") || "";
  const url = request?.url ? new URL(request.url) : null;

  // 1. Explicit Test Mode Signals (controlled testing)
  // - Custom admin header: x-aeethod-test
  // - Query param: ?aeethod_test=1 or ?aeethod_test=true
  // - UTM campaign set to internal_test
  // - Explicit client telemetry flag: body.isTest === true
  // - Automated test session IDs: e2e_ses_*
  if (
    headers?.get("x-aeethod-test") === "true" ||
    headers?.get("x-aeethod-test") === "1" ||
    body?.isTest === true ||
    url?.searchParams.get("aeethod_test") === "1" ||
    url?.searchParams.get("aeethod_test") === "true" ||
    body?.utm?.utm_campaign === "internal_test" ||
    (body?.sessionId && body.sessionId.startsWith("e2e_ses_"))
  ) {
    return {
      classification: SESSION_CLASSIFICATIONS.TEST,
      reason: "Explicit test mode trigger (header / param / e2e)",
    };
  }

  // 2. Reliable Server-Side Bot / Crawler Signals
  // A. Vercel Edge Bot Protection headers
  const vercelBotHeader = headers?.get("x-vercel-bot");
  const vercelBotKind = headers?.get("x-vercel-bot-kind");
  if (vercelBotHeader === "1" || vercelBotHeader === "true") {
    return {
      classification: SESSION_CLASSIFICATIONS.BOT,
      reason: `Vercel BotID flagged request (${vercelBotKind || "automated"})`,
    };
  }
  if (vercelBotKind === "crawler" || vercelBotKind === "bot" || vercelBotKind === "scanner") {
    return {
      classification: SESSION_CLASSIFICATIONS.BOT,
      reason: `Vercel Edge Bot kind: ${vercelBotKind}`,
    };
  }

  // B. Cloudflare bot detection
  const cfIsBot = headers?.get("cf-is-bot");
  if (cfIsBot === "1" || cfIsBot === "true") {
    return {
      classification: SESSION_CLASSIFICATIONS.BOT,
      reason: "Cloudflare verified automated bot",
    };
  }

  // C. Server-side User-Agent crawler registry
  const crawlerCheck = isCrawler(userAgent);
  if (crawlerCheck.isCrawler) {
    return {
      classification: SESSION_CLASSIFICATIONS.BOT,
      reason: `Crawler user-agent matched: ${crawlerCheck.botName}`,
    };
  }

  // D. Automation tool headers (Headless Chrome / Playwright / Puppeteer markers)
  const secChUa = headers?.get("sec-ch-ua") || "";
  if (secChUa.includes("Headless") || /HeadlessChrome/i.test(userAgent)) {
    return {
      classification: SESSION_CLASSIFICATIONS.BOT,
      reason: "Headless browser automation signature",
    };
  }

  // 3. Default: Legitimate Human or Unknown Visitor
  // All other traffic (including unknown countries, residential VPNs, iCloud Private Relay, short visits)
  // MUST remain classified as human_or_unknown.
  return {
    classification: SESSION_CLASSIFICATIONS.HUMAN_OR_UNKNOWN,
    reason: "Standard organic visitor traffic",
  };
}

/**
 * Validates whether a classification value is recognized.
 * @param {string} val
 * @returns {boolean}
 */
export function isValidClassification(val) {
  return Object.values(SESSION_CLASSIFICATIONS).includes(val);
}
