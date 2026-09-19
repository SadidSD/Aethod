/**
 * Anonymous Browsing Session Manager
 *
 * Scoped to browser tabs/windows using sessionStorage.
 * A new window/tab gets a new session ID.
 * Preserves first-touch session attribution across internal page navigations.
 */

const SESSION_KEY = "aeethod_sid";
const SESSION_START_KEY = "aeethod_sst";
const SESSION_ATTR_KEY = "aeethod_s_attr";

function generateUUID() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Returns the active session ID from sessionStorage or creates a new one.
 * @returns {{ sessionId: string, isNewSession: boolean, startedAt: string }}
 */
export function getOrCreateSessionId() {
  if (typeof window === "undefined") {
    return { sessionId: "", isNewSession: false, startedAt: new Date().toISOString() };
  }

  try {
    const existing = sessionStorage.getItem(SESSION_KEY);
    const existingStart = sessionStorage.getItem(SESSION_START_KEY);

    if (existing && existing.length >= 10 && existing.length <= 64) {
      return {
        sessionId: existing,
        isNewSession: false,
        startedAt: existingStart || new Date().toISOString(),
      };
    }

    const newSessionId = `s_${generateUUID()}`;
    const startedAt = new Date().toISOString();

    sessionStorage.setItem(SESSION_KEY, newSessionId);
    sessionStorage.setItem(SESSION_START_KEY, startedAt);
    // Remove stale session attribution on brand new session creation
    sessionStorage.removeItem(SESSION_ATTR_KEY);

    return {
      sessionId: newSessionId,
      isNewSession: true,
      startedAt,
    };
  } catch {
    // If sessionStorage is restricted
    const fallbackId = `s_${generateUUID()}`;
    return {
      sessionId: fallbackId,
      isNewSession: true,
      startedAt,
    };
  }
}

/**
 * Retrieves preserved first-touch session attribution from sessionStorage.
 * @returns {{
 *   trafficSource: string,
 *   aiPlatform: string | null,
 *   aiAttributionType: string | null,
 *   referrer: string | null,
 *   utm: Object | null
 * } | null}
 */
export function getSessionAttribution() {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(SESSION_ATTR_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

/**
 * Persists session attribution in sessionStorage.
 * @param {{
 *   trafficSource: string,
 *   aiPlatform?: string | null,
 *   aiAttributionType?: string | null,
 *   referrer?: string | null,
 *   utm?: Object | null
 * }} attribution
 */
export function setSessionAttribution(attribution) {
  if (typeof window === "undefined" || !attribution) return;
  try {
    sessionStorage.setItem(SESSION_ATTR_KEY, JSON.stringify(attribution));
  } catch {
    // Fail silently if storage restricted
  }
}
