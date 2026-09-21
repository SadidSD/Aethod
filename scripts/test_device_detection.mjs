#!/usr/bin/env node
/**
 * AEETHOD 360° — Device, Browser & OS Detection Test Suite
 *
 * Tests the client-side device detection in lib/analytics/device.js
 * against known User-Agent strings.
 *
 * Run: node scripts/test_device_detection.mjs
 */

import { parseDeviceInfo } from "../lib/analytics/device.js";

function detectFromUA(ua, width = 1024, maxTouchPoints = 0) {
  return parseDeviceInfo(ua, width, maxTouchPoints);
}

// ============================================================
// TEST RUNNER
// ============================================================

let passed = 0;
let failed = 0;
const failures = [];

function assertEqual(actual, expected, testName) {
  if (actual === expected) {
    passed++;
    console.log(`  ✅ ${testName}`);
  } else {
    failed++;
    failures.push(`${testName} — got: "${actual}", expected: "${expected}"`);
    console.log(`  ❌ ${testName} — got: "${actual}", expected: "${expected}"`);
  }
}

// ============================================================
// USER-AGENT FIXTURES
// ============================================================

const UA = {
  // Desktop browsers
  WINDOWS_CHROME: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  WINDOWS_EDGE: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0",
  WINDOWS_FIREFOX: "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0",
  MACOS_CHROME: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  MACOS_SAFARI: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2.1 Safari/605.1.15",
  LINUX_FIREFOX: "Mozilla/5.0 (X11; Linux x86_64; rv:121.0) Gecko/20100101 Firefox/121.0",
  LINUX_CHROME: "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  CHROMEOS_CHROME: "Mozilla/5.0 (X11; CrOS x86_64 14541.0.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  MACOS_OPERA: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 OPR/106.0.0.0",

  // Mobile browsers
  IPHONE_SAFARI: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_2_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Mobile/15E148 Safari/604.1",
  IPHONE_CHROME: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_2_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/120.0.6099.119 Mobile/15E148 Safari/604.1",
  ANDROID_CHROME: "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.6099.144 Mobile Safari/537.36",
  ANDROID_SAMSUNG: "Mozilla/5.0 (Linux; Android 14; SM-S918B) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/23.0 Chrome/115.0.0.0 Mobile Safari/537.36",
  ANDROID_FIREFOX: "Mozilla/5.0 (Android 14; Mobile; rv:121.0) Gecko/121.0 Firefox/121.0",

  // Tablets
  IPAD_SAFARI: "Mozilla/5.0 (iPad; CPU OS 17_2_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Mobile/15E148 Safari/604.1",
  IPAD_DESKTOP_UA: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Safari/605.1.15",
  ANDROID_TABLET: "Mozilla/5.0 (Linux; Android 14; SM-X810) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.6099.144 Safari/537.36",

  // Bots (should NOT crash detection — but detection is separate)
  GOOGLEBOT: "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
  GPTBOT: "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; GPTBot/1.2; +https://openai.com/gptbot)",
};

// ============================================================
// TESTS: Device Type Detection
// ============================================================

console.log("\n📱 TEST: Device Type Detection\n");

assertEqual(detectFromUA(UA.WINDOWS_CHROME, 1920).device_type, "desktop", "Windows Chrome → desktop");
assertEqual(detectFromUA(UA.WINDOWS_EDGE, 1920).device_type, "desktop", "Windows Edge → desktop");
assertEqual(detectFromUA(UA.MACOS_CHROME, 1440).device_type, "desktop", "macOS Chrome → desktop");
assertEqual(detectFromUA(UA.MACOS_SAFARI, 1440).device_type, "desktop", "macOS Safari → desktop");
assertEqual(detectFromUA(UA.LINUX_FIREFOX, 1920).device_type, "desktop", "Linux Firefox → desktop");
assertEqual(detectFromUA(UA.CHROMEOS_CHROME, 1366).device_type, "desktop", "ChromeOS Chrome → desktop");
assertEqual(detectFromUA(UA.IPHONE_SAFARI, 390).device_type, "mobile", "iPhone Safari → mobile");
assertEqual(detectFromUA(UA.IPHONE_CHROME, 390).device_type, "mobile", "iPhone Chrome → mobile");
assertEqual(detectFromUA(UA.ANDROID_CHROME, 412).device_type, "mobile", "Android Chrome → mobile");
assertEqual(detectFromUA(UA.ANDROID_FIREFOX, 412).device_type, "mobile", "Android Firefox → mobile");
assertEqual(detectFromUA(UA.IPAD_SAFARI, 810).device_type, "tablet", "iPad Safari → tablet");
assertEqual(detectFromUA(UA.IPAD_DESKTOP_UA, 1024, 5).device_type, "tablet", "Modern iPadOS (Macintosh UA + touch) → tablet");
assertEqual(detectFromUA(UA.ANDROID_TABLET, 1280).device_type, "tablet", "Android Tablet → tablet");

// ============================================================
// TESTS: Operating System Detection
// ============================================================

console.log("\n💻 TEST: Operating System Detection\n");

assertEqual(detectFromUA(UA.WINDOWS_CHROME).operating_system, "Windows", "Windows Chrome → Windows");
assertEqual(detectFromUA(UA.WINDOWS_EDGE).operating_system, "Windows", "Windows Edge → Windows");
assertEqual(detectFromUA(UA.WINDOWS_FIREFOX).operating_system, "Windows", "Windows Firefox → Windows");
assertEqual(detectFromUA(UA.MACOS_CHROME).operating_system, "macOS", "macOS Chrome → macOS");
assertEqual(detectFromUA(UA.MACOS_SAFARI).operating_system, "macOS", "macOS Safari → macOS");
assertEqual(detectFromUA(UA.IPHONE_SAFARI).operating_system, "iOS", "iPhone Safari → iOS");
assertEqual(detectFromUA(UA.IPHONE_CHROME).operating_system, "iOS", "iPhone Chrome → iOS");
assertEqual(detectFromUA(UA.ANDROID_CHROME).operating_system, "Android", "Android Chrome → Android");
assertEqual(detectFromUA(UA.ANDROID_SAMSUNG).operating_system, "Android", "Samsung Internet → Android");
assertEqual(detectFromUA(UA.IPAD_SAFARI).operating_system, "iOS", "iPad Safari → iOS");
assertEqual(detectFromUA(UA.IPAD_DESKTOP_UA, 1024, 5).operating_system, "iOS", "Modern iPadOS (Macintosh UA + touch) → iOS");
assertEqual(detectFromUA(UA.LINUX_FIREFOX).operating_system, "Linux", "Linux Firefox → Linux");
assertEqual(detectFromUA(UA.LINUX_CHROME).operating_system, "Linux", "Linux Chrome → Linux");
assertEqual(detectFromUA(UA.CHROMEOS_CHROME).operating_system, "ChromeOS", "ChromeOS Chrome → ChromeOS");

// ============================================================
// TESTS: Browser Detection
// ============================================================

console.log("\n🌐 TEST: Browser Detection\n");

assertEqual(detectFromUA(UA.WINDOWS_CHROME).browser, "Chrome", "Windows Chrome → Chrome");
assertEqual(detectFromUA(UA.MACOS_CHROME).browser, "Chrome", "macOS Chrome → Chrome");
assertEqual(detectFromUA(UA.LINUX_CHROME).browser, "Chrome", "Linux Chrome → Chrome");
assertEqual(detectFromUA(UA.ANDROID_CHROME).browser, "Chrome", "Android Chrome → Chrome");

// Edge must NOT be detected as Chrome
assertEqual(detectFromUA(UA.WINDOWS_EDGE).browser, "Edge", "Edge → Edge (not Chrome)");

// Samsung Internet must NOT be detected as Chrome
assertEqual(detectFromUA(UA.ANDROID_SAMSUNG).browser, "Samsung Internet", "Samsung Internet → Samsung Internet (not Chrome)");

// Safari must NOT be detected as Chrome
assertEqual(detectFromUA(UA.MACOS_SAFARI).browser, "Safari", "macOS Safari → Safari (not Chrome)");
assertEqual(detectFromUA(UA.IPHONE_SAFARI).browser, "Safari", "iPhone Safari → Safari");
assertEqual(detectFromUA(UA.IPAD_SAFARI).browser, "Safari", "iPad Safari → Safari");

// Chrome on iOS
assertEqual(detectFromUA(UA.IPHONE_CHROME).browser, "Chrome", "iPhone Chrome → Chrome");

// Firefox
assertEqual(detectFromUA(UA.WINDOWS_FIREFOX).browser, "Firefox", "Windows Firefox → Firefox");
assertEqual(detectFromUA(UA.LINUX_FIREFOX).browser, "Firefox", "Linux Firefox → Firefox");
assertEqual(detectFromUA(UA.ANDROID_FIREFOX).browser, "Firefox", "Android Firefox → Firefox");

// Opera
assertEqual(detectFromUA(UA.MACOS_OPERA).browser, "Opera", "macOS Opera → Opera");
assertEqual(detectFromUA(UA.MACOS_CHROME).browser, "Chrome", "macOS Chrome → Chrome");
assertEqual(detectFromUA(UA.LINUX_CHROME).browser, "Chrome", "Linux Chrome → Chrome");
assertEqual(detectFromUA(UA.ANDROID_CHROME).browser, "Chrome", "Android Chrome → Chrome");

// Edge must NOT be detected as Chrome
assertEqual(detectFromUA(UA.WINDOWS_EDGE).browser, "Edge", "Edge → Edge (not Chrome)");

// Safari must NOT be detected as Chrome
assertEqual(detectFromUA(UA.MACOS_SAFARI).browser, "Safari", "macOS Safari → Safari (not Chrome)");
assertEqual(detectFromUA(UA.IPHONE_SAFARI).browser, "Safari", "iPhone Safari → Safari");
assertEqual(detectFromUA(UA.IPAD_SAFARI).browser, "Safari", "iPad Safari → Safari");

// Chrome on iOS
assertEqual(detectFromUA(UA.IPHONE_CHROME).browser, "Chrome", "iPhone Chrome → Chrome");

// Firefox
assertEqual(detectFromUA(UA.WINDOWS_FIREFOX).browser, "Firefox", "Windows Firefox → Firefox");
assertEqual(detectFromUA(UA.LINUX_FIREFOX).browser, "Firefox", "Linux Firefox → Firefox");
assertEqual(detectFromUA(UA.ANDROID_FIREFOX).browser, "Firefox", "Android Firefox → Firefox");

// Opera
assertEqual(detectFromUA(UA.MACOS_OPERA).browser, "Opera", "macOS Opera → Opera");

// ============================================================
// TESTS: Edge Cases
// ============================================================

console.log("\n⚠️ TEST: Edge Cases\n");

const empty = detectFromUA("", 1920);
assertEqual(empty.device_type, "desktop", "Empty UA → desktop");
assertEqual(empty.operating_system, "Other", "Empty UA → Other OS");
assertEqual(empty.browser, "Other", "Empty UA → Other browser");

// ============================================================
// RESULTS
// ============================================================

console.log("\n" + "=".repeat(60));
console.log(`📊 DEVICE/BROWSER/OS DETECTION TEST RESULTS`);
console.log("=".repeat(60));
console.log(`✅ Passed: ${passed}`);
console.log(`❌ Failed: ${failed}`);
console.log(`📋 Total:  ${passed + failed}`);

if (failures.length > 0) {
  console.log("\nFailed tests:");
  failures.forEach(f => console.log(`  ⛔ ${f}`));
}

console.log("\n" + (failed === 0 ? "🎉 ALL DEVICE DETECTION TESTS PASSED!" : "⚠️  SOME TESTS FAILED — REVIEW REQUIRED"));
process.exit(failed > 0 ? 1 : 0);
