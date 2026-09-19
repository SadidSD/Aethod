/**
 * Non-sensitive Device & Environment Detection
 *
 * Infers device category, operating system, and browser from standard browser APIs.
 * Does NOT collect IP addresses, hardware serials, or fingerprinting data.
 */

/**
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

  // 1. Device category
  let device_type = "desktop";
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    device_type = "tablet";
  } else if (
    /Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/i.test(
      ua
    ) ||
    width < 640
  ) {
    device_type = "mobile";
  } else if (width >= 640 && width <= 1024) {
    device_type = "tablet";
  }

  // 2. Operating System
  let operating_system = "Other";
  if (/Mac OS X|Macintosh/i.test(ua)) {
    operating_system = "macOS";
  } else if (/Windows NT/i.test(ua)) {
    operating_system = "Windows";
  } else if (/iPhone|iPad|iPod/i.test(ua)) {
    operating_system = "iOS";
  } else if (/Android/i.test(ua)) {
    operating_system = "Android";
  } else if (/Linux/i.test(ua)) {
    operating_system = "Linux";
  }

  // 3. Browser
  let browser = "Other";
  if (/Edg\//i.test(ua)) {
    browser = "Edge";
  } else if (/Chrome|CriOS/i.test(ua) && !/Edg\//i.test(ua) && !/OPR/i.test(ua)) {
    browser = "Chrome";
  } else if (/Safari/i.test(ua) && !/Chrome|CriOS|Edg/i.test(ua)) {
    browser = "Safari";
  } else if (/Firefox|FxiOS/i.test(ua)) {
    browser = "Firefox";
  } else if (/OPR\//i.test(ua) || /Opera/i.test(ua)) {
    browser = "Opera";
  }

  // 4. Screen resolution
  let screen_resolution = "";
  if (typeof screen !== "undefined") {
    screen_resolution = `${screen.width}x${screen.height}`;
  }

  return {
    device_type,
    operating_system,
    browser,
    screen_resolution,
  };
}
