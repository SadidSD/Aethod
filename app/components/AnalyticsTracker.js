"use client";

import { useEffect, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { tracker } from "@/lib/analytics/tracker";
import { trackEvent } from "@/lib/analytics/events";

function AnalyticsTrackerContent() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!pathname) return;

    const searchString = searchParams ? searchParams.toString() : "";
    tracker.trackPageView(pathname, searchString);

    // Automatic Agency Funnel Stage Triggers based on route navigation
    if (pathname.startsWith("/services") || pathname.startsWith("/works")) {
      trackEvent("explore_services", { route: pathname }, pathname);
    } else if (pathname === "/contact") {
      trackEvent("start_contact", { route: pathname }, pathname);
    }
  }, [pathname, searchParams]);

  return null;
}

export default function AnalyticsTracker() {
  return (
    <Suspense fallback={null}>
      <AnalyticsTrackerContent />
    </Suspense>
  );
}
