"use client";

import { useEffect, Suspense, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { tracker } from "@/lib/analytics/tracker";
import { trackEvent } from "@/lib/analytics/events";

function AnalyticsTrackerContent() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const trackedScrollsRef = useRef(new Set());
  const formStartedRef = useRef(false);

  useEffect(() => {
    if (!pathname) return;

    // Reset page-level trackers
    trackedScrollsRef.current = new Set();
    formStartedRef.current = false;

    const searchString = searchParams ? searchParams.toString() : "";
    tracker.trackPageView(pathname, searchString);

    // Explicit page_view event for journey timeline
    trackEvent("page_view", {
      path: pathname,
      title: typeof document !== "undefined" ? document.title : "",
      search: searchString || undefined,
    }, pathname);

    // Automatic Agency Funnel & Navigation Action Triggers based on route
    if (pathname.startsWith("/services") || pathname.startsWith("/works")) {
      trackEvent("explore_services", { route: pathname }, pathname);
      if (pathname.startsWith("/works")) {
        trackEvent("works_click", { route: pathname }, pathname);
        if (pathname.includes("rng-gamez")) {
          trackEvent("project_click", { project: "RNG Gamez Case Study", path: pathname }, pathname);
        }
      }
    } else if (pathname === "/contact") {
      trackEvent("start_contact", { route: pathname }, pathname);
      trackEvent("contact_button_click", { route: pathname }, pathname);
    } else if (pathname.startsWith("/products")) {
      trackEvent("products_click", { route: pathname }, pathname);
    } else if (pathname.startsWith("/research")) {
      trackEvent("research_click", { route: pathname }, pathname);
    } else if (pathname.startsWith("/blog")) {
      trackEvent("blog_click", { route: pathname }, pathname);
    }
  }, [pathname, searchParams]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // 1. Scroll Depth Tracking (25%, 50%, 75%, 100%)
    let scrollRaf = null;
    const handleScroll = () => {
      if (scrollRaf) return;
      scrollRaf = requestAnimationFrame(() => {
        scrollRaf = null;
        const docElem = document.documentElement;
        const totalHeight = docElem.scrollHeight - docElem.clientHeight;
        if (totalHeight <= 0) return;
        const scrollPercent = Math.min(100, Math.round((window.scrollY / totalHeight) * 100));

        const milestones = [25, 50, 75, 100];
        for (const m of milestones) {
          if (scrollPercent >= m && !trackedScrollsRef.current.has(m)) {
            trackedScrollsRef.current.add(m);
            trackEvent("scroll_depth", { depth: m, percent: `${m}%`, path: pathname }, pathname);
          }
        }
      });
    };
    window.addEventListener("scroll", handleScroll, { passive: true });

    // 2. Global Delegated Click Tracking
    const handleClick = (e) => {
      try {
        const target = e.target;
        if (!target) return;

        const link = target.closest("a");
        const button = target.closest("button, [role='button'], [data-cta]");

        if (link && link.href) {
          const href = link.href;
          const linkText = (link.innerText || link.getAttribute("aria-label") || "").trim().slice(0, 80);

          try {
            const url = new URL(href, window.location.origin);
            const isExternal = url.origin !== window.location.origin;

            if (isExternal) {
              trackEvent("external_link_click", { url: href, text: linkText }, pathname);
              trackEvent("outbound_click", { url: href, text: linkText }, pathname);
              if (href.includes("rng-gamez") || href.includes("rnggamez")) {
                trackEvent("project_click", { project: "RNG Gamez", url: href }, pathname);
              } else if (href.includes("murakkaz")) {
                trackEvent("project_click", { project: "Murakkaz", url: href }, pathname);
              }
            } else {
              const localPath = url.pathname;
              if (localPath.startsWith("/works")) {
                trackEvent("works_click", { path: localPath, text: linkText }, pathname);
                if (localPath.includes("rng-gamez")) {
                  trackEvent("project_click", { project: "RNG Gamez Case Study", path: localPath }, pathname);
                }
              } else if (localPath.startsWith("/products")) {
                trackEvent("products_click", { path: localPath, text: linkText }, pathname);
              } else if (localPath.startsWith("/research")) {
                trackEvent("research_click", { path: localPath, text: linkText }, pathname);
              } else if (localPath.startsWith("/blog")) {
                trackEvent("blog_click", { path: localPath, text: linkText }, pathname);
              } else if (localPath === "/contact") {
                trackEvent("contact_button_click", { path: localPath, text: linkText }, pathname);
              } else {
                trackEvent("navigation_click", { path: localPath, text: linkText }, pathname);
              }
            }
          } catch {
            // invalid URL, ignore
          }
        } else if (button) {
          const btnText = (button.innerText || button.getAttribute("aria-label") || "").trim().slice(0, 80);
          const lower = btnText.toLowerCase();
          if (lower.includes("contact") || lower.includes("book") || lower.includes("inquire")) {
            trackEvent("contact_button_click", { text: btnText, buttonId: button.id || undefined }, pathname);
          }
          trackEvent("cta_click", { text: btnText, buttonId: button.id || undefined }, pathname);
        }
      } catch {
        // fail silently
      }
    };
    document.addEventListener("click", handleClick, { passive: true });

    // 3. Form Focus & Submission Tracking
    const handleFocusIn = (e) => {
      const target = e.target;
      if (!target) return;
      if (target.matches("input, textarea, select") && !formStartedRef.current) {
        formStartedRef.current = true;
        const form = target.closest("form");
        const formId = form?.id || form?.name || "contact_form";
        trackEvent("form_started", { formId, path: pathname }, pathname);
      }
    };
    document.addEventListener("focusin", handleFocusIn, { passive: true });

    const handleSubmit = (e) => {
      const form = e.target;
      if (form && form.tagName === "FORM") {
        const formId = form.id || form.name || "contact_form";
        trackEvent("form_submitted", { formId, path: pathname }, pathname);
      }
    };
    document.addEventListener("submit", handleSubmit, { passive: true });

    // 4. Video Events Tracking
    const handleVideoPlay = (e) => {
      const video = e.target;
      if (video && video.tagName === "VIDEO") {
        trackEvent("video_started", { src: video.currentSrc || "hero-animation", path: pathname }, pathname);
      }
    };
    const handleVideoEnded = (e) => {
      const video = e.target;
      if (video && video.tagName === "VIDEO") {
        trackEvent("video_completed", { src: video.currentSrc || "hero-animation", path: pathname }, pathname);
      }
    };
    document.addEventListener("play", handleVideoPlay, { capture: true, passive: true });
    document.addEventListener("ended", handleVideoEnded, { capture: true, passive: true });

    // 5. Page Exit Tracking
    const handleVisibility = () => {
      if (document.visibilityState === "hidden") {
        trackEvent("page_exit", { path: pathname, dwellSeconds: tracker.activeDwellSeconds }, pathname);
      }
    };
    document.addEventListener("visibilitychange", handleVisibility, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("click", handleClick);
      document.removeEventListener("focusin", handleFocusIn);
      document.removeEventListener("submit", handleSubmit);
      document.removeEventListener("play", handleVideoPlay, true);
      document.removeEventListener("ended", handleVideoEnded, true);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [pathname]);

  return null;
}

export default function AnalyticsTracker() {
  return (
    <Suspense fallback={null}>
      <AnalyticsTrackerContent />
    </Suspense>
  );
}
