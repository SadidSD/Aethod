/**
 * Aeethod Studio — Edge-Compatible Session Management
 * Uses standard Web Crypto API (crypto.subtle) HMAC-SHA256.
 * Completely safe for Next.js Edge Middleware and Node.js runtimes.
 */

export const SESSION_COOKIE_NAME = "aeethod_admin_session";
export const SESSION_MAX_AGE_SECONDS = 8 * 60 * 60; // 8 hours

const DEFAULT_SECRET = "aeethod-studio-secure-auth-secret-key-production-fallback";
const encoder = new TextEncoder();

/**
 * Retrieves the server auth secret.
 */
export function getAuthSecret() {
  return process.env.AEETHOD_AUTH_SECRET || DEFAULT_SECRET;
}

/**
 * Base64URL string encoder
 */
function bufferToBase64Url(buffer) {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

/**
 * Base64URL string decoder
 */
function base64UrlToUint8Array(base64Url) {
  let base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4) {
    base64 += "=";
  }
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

/**
 * Imports a CryptoKey for HMAC-SHA256 signing & verification.
 */
async function getCryptoKey(secret) {
  const keyData = encoder.encode(secret);
  return await crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "HMAC", hash: { name: "SHA-256" } },
    false,
    ["sign", "verify"]
  );
}

/**
 * Signs a session payload using HMAC-SHA256.
 * Payload includes { email, iat, exp }.
 * Returns a compact token: base64Url(payload) + "." + base64Url(signature)
 */
export async function signSessionToken(payload, secret = getAuthSecret()) {
  const key = await getCryptoKey(secret);
  const json = JSON.stringify(payload);
  const payloadB64 = bufferToBase64Url(encoder.encode(json));
  const signatureBuffer = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(payloadB64)
  );
  const signatureB64 = bufferToBase64Url(signatureBuffer);
  return `${payloadB64}.${signatureB64}`;
}

/**
 * Verifies a session token.
 * Returns the decoded payload if valid and unexpired; otherwise null.
 */
export async function verifySessionToken(token, secret = getAuthSecret()) {
  if (!token || typeof token !== "string") return null;
  const parts = token.split(".");
  if (parts.length !== 2) return null;

  const [payloadB64, signatureB64] = parts;

  try {
    const key = await getCryptoKey(secret);
    const signatureBytes = base64UrlToUint8Array(signatureB64);
    const isValid = await crypto.subtle.verify(
      "HMAC",
      key,
      signatureBytes,
      encoder.encode(payloadB64)
    );

    if (!isValid) return null;

    const payloadJson = new TextDecoder().decode(base64UrlToUint8Array(payloadB64));
    const payload = JSON.parse(payloadJson);

    // Check expiration
    if (!payload.exp || Date.now() > payload.exp) {
      return null;
    }

    return payload;
  } catch (err) {
    return null;
  }
}
