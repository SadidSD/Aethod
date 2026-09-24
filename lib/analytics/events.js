/**
 * Meaningful Action & Conversion Event Tracking
 *
 * Supports the Aeethod Agency Funnel:
 * - visit (implicit session start)
 * - explore_services / service_view
 * - view_work / work_view
 * - start_contact / contact_start
 * - inquiry_submitted / inquiry_submit
 * - call_booked / call_book
 * - cta_click
 */

import { getOrCreateVisitorId } from "./visitor";
import { getOrCreateSessionId, getSessionAttribution } from "./session";
import { getDeviceInfo } from "./device";

const DISALLOWED_KEYS = [
  "password",
  "passcode",
  "token",
  "secret",
  "auth",
  "credit",
  "card",
  "cvv",
  "ssn",
];

/**
 * Sanitizes arbitrary event metadata to ensure no sensitive information or PII is sent.
 * @param {any} val
 * @returns {any}
 */
function sanitizeEventValue(val) {
  if (!val || typeof val !== "object") {
    return val;
  }

  if (Array.isArray(val)) {
    return val.map(sanitizeEventValue);
  }

  const clean = {};
  for (const [k, v] of Object.entries(val)) {
    const lowerKey = k.toLowerCase();
    if (DISALLOWED_KEYS.some((badKey) => lowerKey.includes(badKey))) {
      continue; // Filter out sensitive fields
    }
    if (typeof v === "object" && v !== null) {
      clean[k] = sanitizeEventValue(v);
    } else if (typeof v === "string") {
      clean[k] = v.slice(0, 500); // Prevent excessively long string injection
    } else {
      clean[k] = v;
    }
  }
  return clean;
}

export const EVENT_ALIASES = {
  service_view: "explore_services",
  work_view: "view_work",
  contact_start: "start_contact",
  inquiry_submit: "inquiry_submitted",
  call_book: "call_booked",
};

/**
 * Tracks a custom event or agency conversion action.
 * Fails silently if network or browser errors occur.
 *
 * @param {string} eventName - e.g. "explore_services", "view_work", "start_contact", "inquiry_submitted", "cta_click", "scroll_depth", etc.
 * @param {Object} [eventValue={}] - Non-sensitive event metadata
 * @param {string} [pagePath] - Optional path override
 */
export function trackEvent(eventName, eventValue = null, pagePath = null) {
  if (typeof window === "undefined" || !eventName) return;

  try {
    const rawName = String(eventName).trim().slice(0, 80);
    const normalizedName = EVENT_ALIASES[rawName] || rawName;

    const { visitorId } = getOrCreateVisitorId();
    const { sessionId } = getOrCreateSessionId();
    const currentPath = pagePath || window.location.pathname || "/";
    const sessionAttr = getSessionAttribution();
    const device = getDeviceInfo();

    // Determine referral source attribution persisted for this session
    let referralSource = sessionAttr?.referralPartner || null;
    if (!referralSource && sessionAttr) {
      const land = (sessionAttr.landingPage || "").toLowerCase();
      const ref = (sessionAttr.referrer || "").toLowerCase();
      if (land.includes("ref=rng-gamez") || land.includes("rng-gamez") || ref.includes("rnggamez") || ref.includes("rng-gamez")) {
        referralSource = "rng-gamez";
      } else if (land.includes("murakkaz") || ref.includes("murakkaz") || sessionAttr.utm?.utm_campaign === "footer_credit") {
        referralSource = "murakkaz";
      }
    }

    const sanitizedUserValue = sanitizeEventValue(eventValue) || {};

    const enrichedValue = {
      ...sanitizedUserValue,
      referralSource: referralSource || undefined,
      pageTitle: typeof document !== "undefined" ? document.title?.slice(0, 120) : undefined,
      deviceCategory: device?.device_type || undefined,
      browser: device?.browser || undefined,
      operatingSystem: device?.operating_system || undefined,
      screenResolution: typeof window !== "undefined" ? `${window.innerWidth}x${window.innerHeight}` : undefined,
      language: typeof navigator !== "undefined" ? navigator.language : undefined,
      timestamp: new Date().toISOString(),
    };

    const payload = {
      visitorId,
      sessionId,
      eventName: normalizedName,
      eventValue: enrichedValue,
      pagePath: String(currentPath).slice(0, 200),
    };

    const endpoint = "/api/analytics/event";
    const bodyString = JSON.stringify(payload);


    // Prefer sendBeacon for non-blocking reliability
    if (typeof navigator !== "undefined" && typeof navigator.sendBeacon === "function") {
      const blob = new Blob([bodyString], { type: "application/json" });
      const sent = navigator.sendBeacon(endpoint, blob);
      if (sent) return;
    }

    // Fallback to fetch with keepalive
    fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: bodyString,
      keepalive: true,
    }).catch(() => {
      // Silently catch errors — never degrade user experience
    });
  } catch {
    // Fail silently
  }
}

// Attach to window object for convenient non-React component use if available
if (typeof window !== "undefined") {
  window.aeethodTrack = trackEvent;
}
