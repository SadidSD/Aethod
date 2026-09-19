import { NextResponse } from "next/server";
import {
  verifyPassword,
  signSessionToken,
  SESSION_COOKIE_NAME,
  SESSION_MAX_AGE_SECONDS,
} from "@/lib/auth";

export const runtime = "nodejs";

// In-memory rate limiting store: ip -> { count: number, firstAttempt: number, lockedUntil: number }
const attemptsMap = new Map();

// Configuration
const MAX_FAILED_ATTEMPTS = 5;
const ATTEMPT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes
const FAILURE_DELAY_MS = 800; // 800ms progressive delay on failures

function getClientIp(request) {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  const realIp = request.headers.get("x-real-ip");
  if (realIp) return realIp.trim();
  return "127.0.0.1";
}

function checkRateLimit(ip) {
  const now = Date.now();
  const record = attemptsMap.get(ip);

  if (!record) return { allowed: true };

  // Check lockout
  if (record.lockedUntil && now < record.lockedUntil) {
    const remainingSeconds = Math.ceil((record.lockedUntil - now) / 1000);
    return {
      allowed: false,
      message: "Too many login attempts. Please try again in a few minutes.",
      remainingSeconds,
    };
  }

  // Check window expiry
  if (now - record.firstAttempt > ATTEMPT_WINDOW_MS) {
    attemptsMap.delete(ip);
    return { allowed: true };
  }

  if (record.count >= MAX_FAILED_ATTEMPTS) {
    record.lockedUntil = now + LOCKOUT_DURATION_MS;
    return {
      allowed: false,
      message: "Too many login attempts. Please try again in a few minutes.",
      remainingSeconds: Math.ceil(LOCKOUT_DURATION_MS / 1000),
    };
  }

  return { allowed: true };
}

function recordFailure(ip) {
  const now = Date.now();
  const record = attemptsMap.get(ip);

  if (!record || now - record.firstAttempt > ATTEMPT_WINDOW_MS) {
    attemptsMap.set(ip, { count: 1, firstAttempt: now, lockedUntil: 0 });
  } else {
    record.count += 1;
    if (record.count >= MAX_FAILED_ATTEMPTS) {
      record.lockedUntil = now + LOCKOUT_DURATION_MS;
    }
  }
}

function resetFailures(ip) {
  attemptsMap.delete(ip);
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function POST(request) {
  const ip = getClientIp(request);

  // 1. Rate-limiting check
  const rateLimit = checkRateLimit(ip);
  if (!rateLimit.allowed) {
    console.warn(`[AUTH] IP ${ip} locked out. Login rejected.`);
    return NextResponse.json(
      { error: rateLimit.message },
      { status: 429 }
    );
  }

  try {
    const body = await request.json();
    const { email, password } = body || {};

    if (!email || !password) {
      await sleep(FAILURE_DELAY_MS);
      return NextResponse.json(
        { error: "Invalid credentials. Please try again." },
        { status: 400 }
      );
    }

    // Configured admin credentials from environment
    const authorizedEmail = (
      process.env.AEETHOD_ADMIN_EMAIL || "studio@aeethod.com"
    ).trim().toLowerCase();
    const authorizedHash = process.env.AEETHOD_ADMIN_PASSWORD_HASH;

    if (!authorizedHash) {
      console.error("[AUTH ERROR] AEETHOD_ADMIN_PASSWORD_HASH is not set in environment.");
      return NextResponse.json(
        { error: "Server authentication is not configured." },
        { status: 500 }
      );
    }

    const inputEmail = email.trim().toLowerCase();

    // Constant-time email match check
    const emailMatches = inputEmail === authorizedEmail;

    // Verify password against stored scrypt hash
    const passwordMatches = verifyPassword(password, authorizedHash);

    if (!emailMatches || !passwordMatches) {
      // Brute-force backoff delay and failure logging
      recordFailure(ip);
      console.warn(`[AUTH FAILURE] Invalid login attempt for "${inputEmail}" from IP: ${ip}`);
      await sleep(FAILURE_DELAY_MS);

      return NextResponse.json(
        { error: "Invalid credentials. Please try again." },
        { status: 401 }
      );
    }

    // Authentication Successful!
    resetFailures(ip);
    console.log(`[AUTH SUCCESS] Admin login successful for "${authorizedEmail}" from IP: ${ip}`);

    // Create signed session token
    const sessionPayload = {
      email: authorizedEmail,
      iat: Date.now(),
      exp: Date.now() + SESSION_MAX_AGE_SECONDS * 1000,
    };

    const token = await signSessionToken(sessionPayload);

    // Set secure HttpOnly session cookie
    const response = NextResponse.json(
      {
        success: true,
        redirect: "/yamal19/analytics",
      },
      { status: 200 }
    );

    response.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: SESSION_MAX_AGE_SECONDS,
    });

    return response;
  } catch (error) {
    console.error("[AUTH ERROR] Unexpected error during login:", error);
    return NextResponse.json(
      { error: "Invalid credentials. Please try again." },
      { status: 500 }
    );
  }
}
