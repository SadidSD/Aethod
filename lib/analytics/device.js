/**
 * Non-sensitive Device & Environment Detection
 *
 * Infers device category, operating system, and browser from standard browser APIs.
 * Does NOT collect IP addresses, hardware serials, or fingerprinting data.
 */

/**
 * Parses user agent, viewport width, and screen info into device telemetry.
 *
 * @param {string} ua - User-Agent string
 * @param {number} [width=1024] - Window inner width
 * @param {number} [maxTouchPoints=0] - Navigator max touch points (for modern iPadOS)
 * @param {{ width?: number, height?: number }} [screenObj={}] - Screen object
 * @returns {{ device_type: string, operating_system: string, browser: string, screen_resolution: string }}
 */
/**
 * Classifies device category from User-Agent and viewport/touch context.
 *
 * @param {string} ua - User-Agent string
 * @param {number} [width=1024] - Viewport width
 * @param {number} [maxTouchPoints=0] - Navigator max touch points
 * @returns {"desktop" | "mobile" | "tablet"}
 */
export function parseDevice(ua = "", width = 1024, maxTouchPoints = 0) {
  const safeUa = ua || "";
  const isIPadOS = /Macintosh/i.test(safeUa) && maxTouchPoints > 1;

  if (/(ipad|playbook|silk)|(android(?!.*mobi))/i.test(safeUa) || isIPadOS) {
    return "tablet";
  }
  if (/tablet/i.test(safeUa) && !/mobile/i.test(safeUa)) {
    return "tablet";
  }
  if (
    /Mobile|iP(hone|od)|Android.*Mobile|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/i.test(
      safeUa
    ) ||
    width < 640
  ) {
    return "mobile";
  }
  if (width >= 640 && width <= 1024 && (maxTouchPoints > 0 || /Mobile|Tablet/i.test(safeUa))) {
    return "tablet";
  }

  return "desktop";
}

/**
 * Detects Operating System from User-Agent string.
 * Order of evaluation is critical to prevent false positives.
 *
 * @param {string} ua - User-Agent string
 * @param {number} [maxTouchPoints=0] - Navigator max touch points
 * @returns {"Windows" | "macOS" | "iOS" | "Android" | "Linux" | "ChromeOS" | "Other"}
 */
export function parseOS(ua = "", maxTouchPoints = 0) {
  const safeUa = ua || "";
  const isIPadOS = /Macintosh/i.test(safeUa) && maxTouchPoints > 1;

  if (/iPhone|iPad|iPod/i.test(safeUa) || isIPadOS) {
    return "iOS";
  }
  if (/Android/i.test(safeUa)) {
    return "Android";
  }
  if (/CrOS|ChromeOS/i.test(safeUa)) {
    return "ChromeOS";
  }
  if (/Windows NT|Windows/i.test(safeUa)) {
    return "Windows";
  }
  if (/Mac OS X|Macintosh/i.test(safeUa)) {
    return "macOS";
  }
  if (/Linux/i.test(safeUa)) {
    return "Linux";
  }
  return "Other";
}

/**
 * Detects Browser from User-Agent string.
 * Order of evaluation is critical: specialized browsers before generic engines.
 *
 * @param {string} ua - User-Agent string
 * @returns {"Chrome" | "Safari" | "Firefox" | "Edge" | "Samsung Internet" | "Opera" | "Android Browser" | "Other"}
 */
export function parseBrowser(ua = "") {
  const safeUa = ua || "";

  if (/Edg\//i.test(safeUa)) {
    return "Edge";
  }
  if (/SamsungBrowser\//i.test(safeUa)) {
    return "Samsung Internet";
  }
  if (/OPR\/|Opera/i.test(safeUa)) {
    return "Opera";
  }
  if (/Firefox|FxiOS\//i.test(safeUa)) {
    return "Firefox";
  }
  // Android stock browser / WebView: contains Android + Version/X, without Chrome or with stock WebKit
  if (/Android/i.test(safeUa) && /Version\/[0-9.]+/i.test(safeUa) && !/Chrome|CriOS/i.test(safeUa)) {
    return "Android Browser";
  }
  if (/Chrome|CriOS\//i.test(safeUa)) {
    return "Chrome";
  }
  if (/Safari/i.test(safeUa)) {
    return "Safari";
  }

  return "Other";
}

/**
 * Parses user agent, viewport width, and screen info into full device telemetry.
 *
 * @param {string} ua - User-Agent string
 * @param {number} [width=1024] - Window inner width
 * @param {number} [maxTouchPoints=0] - Navigator max touch points (for modern iPadOS)
 * @param {{ width?: number, height?: number }} [screenObj={}] - Screen object
 * @returns {{ device_type: string, operating_system: string, browser: string, screen_resolution: string }}
 */
export function parseDeviceInfo(ua = "", width = 1024, maxTouchPoints = 0, screenObj = {}) {
  const device_type = parseDevice(ua, width, maxTouchPoints);
  const operating_system = parseOS(ua, maxTouchPoints);
  const browser = parseBrowser(ua);

  let screen_resolution = "";
  if (screenObj?.width && screenObj?.height) {
    screen_resolution = `${screenObj.width}x${screenObj.height}`;
  }

  return {
    device_type,
    operating_system,
    browser,
    screen_resolution,
  };
}

/**
 * Client-side entrypoint reading from window & navigator.
 * @returns {{ device_type: string, operating_system: string, browser: string, screen_resolution: string }}
 */
export function getDeviceInfo() {
  if (typeof window === "undefined") {
    return {
      device_type: "desktop",
      operating_system: "Other",
      browser: "Other",
      screen_resolution: "",
    };
  }

  const ua = navigator.userAgent || "";
  const width = window.innerWidth || 1024;
  const maxTouchPoints = navigator.maxTouchPoints || 0;
  const screenObj = typeof screen !== "undefined" ? { width: screen.width, height: screen.height } : {};

  return parseDeviceInfo(ua, width, maxTouchPoints, screenObj);
}
