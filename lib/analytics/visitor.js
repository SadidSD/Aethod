/**
 * Persistent Anonymous Visitor Identity
 *
 * Generates and persists a random UUID in localStorage.
 * Does NOT collect or store any PII (no name, email, phone, IP).
 */

const VISITOR_KEY = "aeethod_vid";

function generateUUID() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  // Fallback RFC4122 v4 UUID generator
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Returns the existing anonymous visitor ID from localStorage or creates a new one.
 * @returns {{ visitorId: string, isNewVisitor: boolean }}
 */
export function getOrCreateVisitorId() {
  if (typeof window === "undefined") {
    return { visitorId: "", isNewVisitor: false };
  }

  try {
    const existing = localStorage.getItem(VISITOR_KEY);
    if (existing && existing.length >= 10 && existing.length <= 64) {
      return { visitorId: existing, isNewVisitor: false };
    }

    const newId = `v_${generateUUID()}`;
    localStorage.setItem(VISITOR_KEY, newId);
    return { visitorId: newId, isNewVisitor: true };
  } catch {
    // If localStorage is blocked or throws (e.g. strict private mode)
    return { visitorId: `v_${generateUUID()}`, isNewVisitor: true };
  }
}
