/**
 * Core Client-Side Analytics Tracker
 *
 * Coordinates:
 * - Automatic pageview recording on route changes
 * - Heartbeat pulse every 20 seconds while page is active & visible
 * - Accurate page dwell time calculation
 * - Non-blocking beacon transmission on page unload
 * - Preserves first-touch AI attribution and source across all route navigation
 */

import { getOrCreateVisitorId } from "./visitor";
import { getOrCreateSessionId, getSessionAttribution, setSessionAttribution } from "./session";
import { getDeviceInfo } from "./device";
import { extractUtmParams } from "./trafficSource";
import { resolveAcquisition } from "./serverAnalytics.js";
import { AI_ATTRIBUTION_TYPES } from "./aiPlatforms.js";

const HEARTBEAT_INTERVAL_MS = 20000; // 20 seconds

class AnalyticsTracker {
  constructor() {
    this.currentPath = null;
    this.pageViewStartTime = null;
    this.heartbeatTimer = null;
    this.activeDwellSeconds = 0;
    this.isDocumentVisible = true;
    this.initialized = false;
    this.lastTrackedKey = null;
    this.lastTrackedTime = 0;
    this._flushedOnExit = false;
  }

  /**
   * Initializes global document event listeners (visibility, unload).
   */
  init() {
    if (this.initialized || typeof window === "undefined") return;
    this.initialized = true;

    // 1. Visibility change listener (pause heartbeat when tab is hidden)
    document.addEventListener("visibilitychange", () => {
      this.isDocumentVisible = document.visibilityState === "visible";
      if (!this.isDocumentVisible) {
        this.stopHeartbeat();
        this.flushDwellTime();
      } else {
        this.startHeartbeat();
      }
    });

    // 2. Page unload/hide listener — deduplicated
    const onExit = () => {
      if (this._flushedOnExit) return;
      this._flushedOnExit = true;
      this.flushDwellTime();
    };

    window.addEventListener("pagehide", onExit);
    window.addEventListener("beforeunload", onExit);
  }

  /**
   * Automatically tracks a pageview and starts the heartbeat.
   * Preserves first-touched attribution across route changes.
   *
   * @param {string} path - Next.js pathname
   * @param {URLSearchParams|string} [search] - Current URL search params
   */
  trackPageView(path, search = "") {
    if (typeof window === "undefined" || !path) return;

    // Do not track admin routes to keep public analytics pure
    if (path.startsWith("/yamal19") || path.startsWith("/admin")) {
      return;
    }

    // Deduplicate duplicate tracking calls in short timeframe (< 500ms)
    const now = Date.now();
    const routeKey = `${path}?${search}`;
    if (this.lastTrackedKey === routeKey && now - (this.lastTrackedTime || 0) < 500) {
      return;
    }
    this.lastTrackedKey = routeKey;
    this.lastTrackedTime = now;

    this.init();

    // If changing from an existing page, flush dwell time for the previous page
    if (this.currentPath && this.currentPath !== path) {
      this.flushDwellTime();
    }

    this.currentPath = path;
    this.pageViewStartTime = Date.now();
    this.activeDwellSeconds = 0;

    const { visitorId, isNewVisitor } = getOrCreateVisitorId();
    const { sessionId, isNewSession } = getOrCreateSessionId();
    const device = getDeviceInfo();

    // Fallback to window.location.search if search string was not provided or empty
    const activeSearch =
      search && String(search).trim().length > 0
        ? search
        : typeof window !== "undefined"
        ? window.location.search
        : "";

    const rawReferrer = typeof document !== "undefined" && document.referrer ? document.referrer : "";
    const currentUtm = extractUtmParams(activeSearch);

    // Retrieve or initialize preserved session attribution
    let sessionAttr = isNewSession ? null : getSessionAttribution();

    // Evaluate client-side acquisition
    const resolved = resolveAcquisition({
      clientReferrer: rawReferrer,
      searchParams: activeSearch,
      currentOrigin: typeof window !== "undefined" ? window.location.origin : "",
    });

    const isCurrentSourceReliable = resolved.source && resolved.source !== "Direct" && resolved.source !== "Bot";
    const isStoredSourceReliable = sessionAttr?.trafficSource && sessionAttr.trafficSource !== "Direct";

    if (!sessionAttr || (!isStoredSourceReliable && isCurrentSourceReliable)) {
      // First-touch or upgrade from unclassified Direct
      sessionAttr = {
        trafficSource: resolved.source === "Bot" ? "Direct" : resolved.source,
        aiPlatform: resolved.aiPlatform || null,
        aiAttributionType:
          resolved.source === "AI Referral"
            ? AI_ATTRIBUTION_TYPES.VERIFIED_AI_REFERRAL
            : AI_ATTRIBUTION_TYPES.UNKNOWN_AI,
        detectionMethod: resolved.detectionMethod || (resolved.source === "AI Referral" ? "referrer" : null),
        aiReferrerHost: resolved.referrerHost || null,
        aiReferrerPath: resolved.referrerPath || null,
        unknownReferrerHost: resolved.unknownReferrerHost || null,
        landingPage: sessionAttr?.landingPage || path,
        referrer: rawReferrer,
        utm: currentUtm,
      };
      setSessionAttribution(sessionAttr);

      // Also persist at visitor level in localStorage for cross-session first-touch reference
      try {
        if (typeof window !== "undefined" && isCurrentSourceReliable) {
          const storedVisitorAttr = localStorage.getItem("aeethod_v_first_touch");
          if (!storedVisitorAttr) {
            localStorage.setItem("aeethod_v_first_touch", JSON.stringify(sessionAttr));
          }
        }
      } catch {
        // Storage restricted, ignore
      }
    }

    const payload = {
      visitorId,
      sessionId,
      path,
      landingPage: sessionAttr?.landingPage || path,
      referrer: sessionAttr?.referrer || rawReferrer,
      trafficSource: sessionAttr?.trafficSource || "Direct",
      aiPlatform: sessionAttr?.aiPlatform || null,
      aiAttributionType: sessionAttr?.aiAttributionType || AI_ATTRIBUTION_TYPES.UNKNOWN_AI,
      detectionMethod: sessionAttr?.detectionMethod || resolved.detectionMethod || null,
      aiReferrerHost: sessionAttr?.aiReferrerHost || null,
      aiReferrerPath: sessionAttr?.aiReferrerPath || null,
      unknownReferrerHost: sessionAttr?.unknownReferrerHost || null,
      utm: sessionAttr?.utm || currentUtm,
      device,
      isNewVisitor,
      isNewSession,
    };

    // Send pageview request
    fetch("/api/analytics/pageview", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      keepalive: true,
    }).catch(() => {
      // Fail silently
    });

    // Reset and start heartbeat
    this.startHeartbeat();
  }

  /**
   * Starts the 20-second active heartbeat pulse.
   */
  startHeartbeat() {
    this.stopHeartbeat();

    this.heartbeatTimer = setInterval(() => {
      if (document.visibilityState !== "visible") return;

      this.activeDwellSeconds += Math.round(HEARTBEAT_INTERVAL_MS / 1000);
      this.sendHeartbeat(Math.round(HEARTBEAT_INTERVAL_MS / 1000));
    }, HEARTBEAT_INTERVAL_MS);
  }

  /**
   * Stops the active heartbeat timer.
   */
  stopHeartbeat() {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
  }

  /**
   * Dispatches heartbeat update to backend.
   * @param {number} dwellIncrement - Seconds added since last heartbeat
   */
  sendHeartbeat(dwellIncrement = 20) {
    if (!this.currentPath || typeof window === "undefined") return;

    try {
      const { visitorId } = getOrCreateVisitorId();
      const { sessionId } = getOrCreateSessionId();

      const payload = {
        visitorId,
        sessionId,
        path: this.currentPath,
        dwellSeconds: dwellIncrement,
      };

      const bodyString = JSON.stringify(payload);
      const endpoint = "/api/analytics/heartbeat";

      if (typeof navigator !== "undefined" && typeof navigator.sendBeacon === "function") {
        const blob = new Blob([bodyString], { type: "application/json" });
        navigator.sendBeacon(endpoint, blob);
      } else {
        fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: bodyString,
          keepalive: true,
        }).catch(() => {});
      }
    } catch {
      // Fail silently
    }
  }

  /**
   * Flushes remaining dwell time when navigating away or closing the page.
   */
  flushDwellTime() {
    if (!this.pageViewStartTime || !this.currentPath) return;

    const totalElapsedSeconds = Math.round((Date.now() - this.pageViewStartTime) / 1000);
    const unrecordedSeconds = Math.max(0, totalElapsedSeconds - this.activeDwellSeconds);

    // Cap unrecorded time to prevent hidden-tab inflation
    // Max reasonable unrecorded time is 2x heartbeat interval
    const maxUnrecorded = Math.round((HEARTBEAT_INTERVAL_MS * 2) / 1000);
    const cappedUnrecorded = Math.min(unrecordedSeconds, maxUnrecorded);

    if (cappedUnrecorded > 2) {
      this.sendHeartbeat(cappedUnrecorded);
      this.activeDwellSeconds += cappedUnrecorded;
    }
  }
}

export const tracker = new AnalyticsTracker();
