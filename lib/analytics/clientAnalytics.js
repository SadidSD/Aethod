/**
 * Aeethod Studio — Client-Side Admin Analytics Data Layer
 *
 * Connects the /yamal19/analytics dashboard to the real-time Admin Analytics API.
 * Uses browser-standard fetch with AbortController support for cancellation,
 * error handling, and lightweight background live-visitor polling.
 */

/**
 * Fetch complete analytics dataset for a given date range.
 *
 * @param {Object} options
 * @param {"today"|"yesterday"|"7d"|"30d"|"custom"} [options.range="7d"]
 * @param {string} [options.from] - ISO string for custom range
 * @param {string} [options.to] - ISO string for custom range
 * @param {AbortSignal} [options.signal] - AbortSignal for request cancellation
 * @returns {Promise<import("./types").MasterAnalyticsPayload>}
 */
export async function fetchAdminAnalytics({ range = "7d", from, to, signal } = {}) {
  let url = `/api/admin/analytics?range=${encodeURIComponent(range)}`;

  if (range === "custom" && from && to) {
    url += `&from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`;
  }

  const res = await fetch(url, {
    method: "GET",
    signal,
    headers: {
      Accept: "application/json",
    },
    cache: "no-store",
  });

  if (res.status === 401) {
    // Session expired or unauthenticated — forward to login
    if (typeof window !== "undefined") {
      window.location.href = "/yamal19";
    }
    throw new Error("Session expired. Please log in again.");
  }

  if (!res.ok) {
    let errorMessage = "Unable to fetch analytics telemetry. Please try again.";
    try {
      const errJson = await res.json();
      if (errJson?.error) {
        errorMessage = errJson.error;
      }
    } catch {
      // Ignore JSON parse errors on non-200 responses
    }
    throw new Error(errorMessage);
  }

  const json = await res.json();
  if (!json.success || !json.data) {
    throw new Error("Invalid analytics response payload received.");
  }

  return json.data;
}

/**
 * Lightweight poller fetching only current Live Active Visitors
 * without refetching the entire analytics dashboard.
 *
 * @param {Object} options
 * @param {"today"|"yesterday"|"7d"|"30d"|"custom"} [options.range="7d"]
 * @param {AbortSignal} [options.signal]
 * @returns {Promise<number|null>}
 */
export async function fetchLiveVisitorsCount({ range = "7d", signal } = {}) {
  try {
    const res = await fetch(`/api/admin/analytics/overview?range=${encodeURIComponent(range)}`, {
      method: "GET",
      signal,
      headers: { Accept: "application/json" },
      cache: "no-store",
    });

    if (res.status === 401) {
      return null;
    }

    if (!res.ok) return null;

    const json = await res.json();
    if (json.success && json.data && typeof json.data.liveVisitors === "number") {
      return json.data.liveVisitors;
    }
    return null;
  } catch (err) {
    // Ignore aborted or network blips during polling
    return null;
  }
}
