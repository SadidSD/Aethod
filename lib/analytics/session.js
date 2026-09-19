/**
 * Anonymous Browsing Session Manager
 *
 * Scoped to browser tabs/windows using sessionStorage.
 * A new window/tab gets a new session ID.
 */

const SESSION_KEY = "aeethod_sid";
const SESSION_START_KEY = "aeethod_sst";

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
      startedAt: new Date().toISOString(),
    };
  }
}
