/**
 * Core Client-Side Analytics Tracker
 *
 * Coordinates:
 * - Automatic pageview recording on route changes
 * - Heartbeat pulse every 20 seconds while page is active & visible
 * - Accurate page dwell time calculation
 * - Non-blocking beacon transmission on page unload
 */

import { getOrCreateVisitorId } from "./visitor";
import { getOrCreateSessionId } from "./session";
import { getDeviceInfo } from "./device";
import { extractUtmParams, classifyTrafficSource } from "./trafficSource";

const HEARTBEAT_INTERVAL_MS = 20000; // 20 seconds

class AnalyticsTracker {
  constructor() {
    this.currentPath = null;
    this.pageViewStartTime = null;
    this.heartbeatTimer = null;
    this.activeDwellSeconds = 0;
    this.isDocumentVisible = true;
    this.initialized = false;
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

    // 2. Page unload/hide listener
    window.addEventListener("pagehide", () => {
      this.flushDwellTime();
    });

    window.addEventListener("beforeunload", () => {
      this.flushDwellTime();
    });
  }

  /**
   * Automatically tracks a pageview and starts the heartbeat.
   * @param {string} path - Next.js pathname
   * @param {URLSearchParams|string} [search] - Current URL search params
   */
  trackPageView(path, search = "") {
    if (typeof window === "undefined" || !path) return;

    // Do not track admin routes to keep public analytics pure
    if (path.startsWith("/yamal19") || path.startsWith("/admin")) {
      return;
    }

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
    const utm = extractUtmParams(search);
    const referrer = document.referrer || "";
    const trafficSource = classifyTrafficSource(referrer, search, window.location.origin);

    const payload = {
      visitorId,
      sessionId,
      path,
      referrer,
      trafficSource,
      utm,
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

    if (unrecordedSeconds > 2) {
      this.sendHeartbeat(unrecordedSeconds);
      this.activeDwellSeconds += unrecordedSeconds;
    }
  }
}

export const tracker = new AnalyticsTracker();
