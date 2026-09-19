import { NextResponse } from "next/server";
import { verifySessionToken, SESSION_COOKIE_NAME } from "./lib/session.js";

export const config = {
  matcher: [
    "/yamal19",
    "/yamal19/:path*",
    "/admin",
    "/admin/:path*",
  ],
};

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  const cookie = request.cookies.get(SESSION_COOKIE_NAME);
  const token = cookie ? cookie.value : null;

  const session = token ? await verifySessionToken(token) : null;
  const isAuthenticated = Boolean(session && session.email);

  // 1. Gateway entry: /yamal19
  if (pathname === "/yamal19") {
    if (isAuthenticated) {
      // Authenticated users are directly forwarded to the analytics dashboard
      const analyticsUrl = new URL("/yamal19/analytics", request.url);
      return NextResponse.redirect(analyticsUrl);
    }
    // Unauthenticated user is allowed to view the login gateway
    return NextResponse.next();
  }

  // 2. Protected admin & analytics routes (/yamal19/analytics, /admin, etc.)
  if (!isAuthenticated) {
    // Block unauthenticated direct access and redirect to the login gateway
    const loginUrl = new URL("/yamal19", request.url);
    return NextResponse.redirect(loginUrl);
  }

  // Authenticated user accessing protected routes
  return NextResponse.next();
}
