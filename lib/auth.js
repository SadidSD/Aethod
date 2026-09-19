import nodeCrypto from "node:crypto";
export * from "./session.js";

/**
 * Hashes a password using Node.js scrypt with a cryptographically secure 16-byte salt.
 * Returns a formatted string: "scrypt:<salt_hex>:<hash_hex>"
 */
export function hashPassword(password) {
  const salt = nodeCrypto.randomBytes(16).toString("hex");
  const hash = nodeCrypto.scryptSync(password, salt, 64).toString("hex");
  return `scrypt:${salt}:${hash}`;
}

/**
 * Verifies a plain text password against a stored "scrypt:<salt>:<hash>" string
 * using constant-time equality comparison (timingSafeEqual) to prevent timing attacks.
 */
export function verifyPassword(password, storedHash) {
  if (!password || !storedHash || typeof storedHash !== "string") return false;

  const parts = storedHash.split(":");
  if (parts.length !== 3 || parts[0] !== "scrypt") return false;

  const salt = parts[1];
  const targetHashBuf = Buffer.from(parts[2], "hex");
  const derivedBuf = nodeCrypto.scryptSync(password, salt, 64);

  if (targetHashBuf.length !== derivedBuf.length) return false;
  return nodeCrypto.timingSafeEqual(targetHashBuf, derivedBuf);
}
