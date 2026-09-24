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

export async function proxy(request) {
  const { pathname } = request.nextUrl;
  const cookie = request.cookies.get(SESSION_COOKIE_NAME);
  const token = cookie ? cookie.value : null;

  const session = token ? await verifySessionToken(token) : null;
  const isAuthenticated = Boolean(session && session.email);

  // 1. Gateway entry: /yamal19
  if (pathname === "/yamal19") {
    if (isAuthenticated) {
      const analyticsUrl = new URL("/yamal19/analytics", request.url);
      const res = NextResponse.redirect(analyticsUrl);
      res.headers.set("X-Robots-Tag", "noindex, nofollow");
      return res;
    }
    const res = NextResponse.next();
    res.headers.set("X-Robots-Tag", "noindex, nofollow");
    return res;
  }

  // 2. Protected admin & analytics routes (/yamal19/analytics, /admin, etc.)
  if (!isAuthenticated) {
    const loginUrl = new URL("/yamal19", request.url);
    const res = NextResponse.redirect(loginUrl);
    res.headers.set("X-Robots-Tag", "noindex, nofollow");
    return res;
  }

  const res = NextResponse.next();
  res.headers.set("X-Robots-Tag", "noindex, nofollow");
  return res;
}
