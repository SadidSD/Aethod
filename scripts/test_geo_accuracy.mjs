#!/usr/bin/env node
/**
 * AEETHOD 360° — Geography Accuracy Test Suite
 *
 * Tests:
 * - ISO country code normalization
 * - Country code <-> name resolution
 * - Never-show-cities rule (Audience Geography shows Top Countries ONLY)
 * - Authoritative resolveCountryFromIp(ip)
 * - "UN" never appears as a country code
 * - Dashboard data format verification
 * - Stress test: 1000 sessions
 *
 * Run: node scripts/test_geo_accuracy.mjs
 */

import { computeGeography } from "../lib/analytics/adminQueries.js";
import {
  resolveCountry,
  COUNTRY_CODE_TO_NAME,
  validateGeoConsistency,
  isPrivateIp,
  extractClientIp,
  resolveCountryFromIp,
} from "../lib/analytics/serverAnalytics.js";

// ============================================================
// TEST RUNNER
// ============================================================

let passed = 0;
let failed = 0;
const failures = [];

function assert(condition, testName) {
  if (condition) {
    passed++;
    console.log(`  ✅ ${testName}`);
  } else {
    failed++;
    failures.push(testName);
    console.log(`  ❌ ${testName}`);
  }
}

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

async function runAll() {
  // ============================================================
  // TEST SUITE 1: Country Code Resolution
  // ============================================================

  console.log("\n🌍 TEST SUITE 1: Country Code Resolution\n");

  assertEqual(resolveCountry("BD").name, "Bangladesh", "BD → Bangladesh");
  assertEqual(resolveCountry("BD").code, "BD", "BD code stays BD");
  assertEqual(resolveCountry("US").name, "United States", "US → United States");
  assertEqual(resolveCountry("US").code, "US", "US code stays US");
  assertEqual(resolveCountry("GB").name, "United Kingdom", "GB → United Kingdom");
  assertEqual(resolveCountry("JP").name, "Japan", "JP → Japan");
  assertEqual(resolveCountry("IN").name, "India", "IN → India");
  assertEqual(resolveCountry("SG").name, "Singapore", "SG → Singapore");
  assertEqual(resolveCountry("DE").name, "Germany", "DE → Germany");
  assertEqual(resolveCountry("CA").name, "Canada", "CA → Canada");

  // Country name to code
  assertEqual(resolveCountry("Bangladesh").code, "BD", "Bangladesh → BD");
  assertEqual(resolveCountry("United States").code, "US", "United States → US");
  assertEqual(resolveCountry("United Kingdom").code, "GB", "United Kingdom → GB");
  assertEqual(resolveCountry("Japan").code, "JP", "Japan → JP");

  // Aliases
  assertEqual(resolveCountry("USA").code, "US", "USA alias → US");
  assertEqual(resolveCountry("UK").code, "GB", "UK alias → GB");

  // Case insensitivity
  assertEqual(resolveCountry("bd").name, "Bangladesh", "lowercase 'bd' → Bangladesh");
  assertEqual(resolveCountry("us").name, "United States", "lowercase 'us' → United States");
  assertEqual(resolveCountry("bangladesh").code, "BD", "lowercase 'bangladesh' → BD");

  // Null / empty handling
  assertEqual(resolveCountry(null).name, "Unknown", "null → Unknown");
  assertEqual(resolveCountry("").name, "Unknown", "empty string → Unknown");
  assertEqual(resolveCountry(undefined).name, "Unknown", "undefined → Unknown");
  assertEqual(resolveCountry("   ").name, "Unknown", "whitespace → Unknown");
  assertEqual(resolveCountry(null).code, null, "null country has null code");

  // ============================================================
  // TEST SUITE 2: 'UN' Must NEVER Be a Country Code
  // ============================================================

  console.log("\n🚫 TEST SUITE 2: 'UN' Must NEVER Be a Country Code\n");

  assert(!COUNTRY_CODE_TO_NAME["UN"], "'UN' is NOT a valid country code");
  assertEqual(resolveCountry("UN").name, "Unknown", "'UN' placeholder maps to 'Unknown'");

  const sessionsWithNullCountry = [{ country: null }, { country: "" }, { country: "UN" }];
  const geoNull = computeGeography(sessionsWithNullCountry);
  const unCode = geoNull.countries.find((c) => c.code === "UN");
  assert(!unCode, "No 'UN' country code in geography output for null-country sessions");

  const unknownCountry = geoNull.countries.find((c) => c.country === "Unknown");
  assert(unknownCountry !== undefined, "Null countries aggregate as 'Unknown'");

  // ============================================================
  // TEST SUITE 3: Top Countries ONLY — No Cities / Metros
  // ============================================================

  console.log("\n🏙️ TEST SUITE 3: Top Countries ONLY — Never Show Cities/Metros\n");

  const sessionsNullCity = [
    { country: "BD", city: null },
    { country: "US", city: null },
    { country: "GB", city: null },
  ];
  const geoNullCity = computeGeography(sessionsNullCity);
  assertEqual(geoNullCity.cities.length, 0, "No cities when all cities are null");

  const sessionsMixed = [
    { country: "BD", city: "Dhaka" },
    { country: "BD", city: null },
    { country: "US", city: "New York" },
    { country: "US", city: null },
    { country: "GB", city: null },
  ];
  const geoMixed = computeGeography(sessionsMixed);
  assertEqual(geoMixed.cities.length, 0, "Cities array is strictly empty in computeGeography");
  assertEqual(geoMixed.countries.length, 3, "Only countries are returned in computeGeography");

  // ============================================================
  // TEST SUITE 4: Authoritative resolveCountryFromIp(ip)
  // ============================================================

  console.log("\n🌐 TEST SUITE 4: Authoritative resolveCountryFromIp(ip)\n");

  const bdIpRes = await resolveCountryFromIp("119.30.32.1");
  assertEqual(bdIpRes.countryCode, "BD", "resolveCountryFromIp(119.30.32.1) code = BD");
  assertEqual(bdIpRes.countryName, "Bangladesh", "resolveCountryFromIp(119.30.32.1) name = Bangladesh");

  const deIpRes = await resolveCountryFromIp("185.220.101.5");
  assertEqual(deIpRes.countryCode, "DE", "resolveCountryFromIp(185.220.101.5) code = DE (Germany VPN/relay)");
  assertEqual(deIpRes.countryName, "Germany", "resolveCountryFromIp(185.220.101.5) name = Germany");

  const usIpRes = await resolveCountryFromIp("8.8.8.8");
  assertEqual(usIpRes.countryCode, "US", "resolveCountryFromIp(8.8.8.8) code = US");
  assertEqual(usIpRes.countryName, "United States", "resolveCountryFromIp(8.8.8.8) name = United States");

  const loopbackIpRes = await resolveCountryFromIp("127.0.0.1");
  assertEqual(loopbackIpRes.countryCode, null, "Loopback IP 127.0.0.1 code = null");
  assertEqual(loopbackIpRes.countryName, "Unknown", "Loopback IP 127.0.0.1 name = Unknown");

  const privateIpRes = await resolveCountryFromIp("192.168.1.1");
  assertEqual(privateIpRes.countryCode, null, "Private IP 192.168.1.1 code = null");
  assertEqual(privateIpRes.countryName, "Unknown", "Private IP 192.168.1.1 name = Unknown");

  const invalidIpRes = await resolveCountryFromIp("invalid_ip");
  assertEqual(invalidIpRes.countryCode, null, "Invalid IP string code = null");
  assertEqual(invalidIpRes.countryName, "Unknown", "Invalid IP string name = Unknown");

  // ============================================================
  // TEST SUITE 5: Country Code Derivation Correctness
  // ============================================================

  console.log("\n📋 TEST SUITE 5: Country Code Derivation (No More Truncation)\n");

  const sessionsCodeBug = [
    { country: "United States" },
    { country: "Bangladesh" },
  ];
  const geoCodeBug = computeGeography(sessionsCodeBug);

  const usEntry = geoCodeBug.countries.find((c) => c.country === "United States");
  assertEqual(usEntry?.code, "US", "United States → code US (not 'UN' from truncation)");

  const bdEntry = geoCodeBug.countries.find((c) => c.country === "Bangladesh");
  assertEqual(bdEntry?.code, "BD", "Bangladesh → code BD (not 'BA' from truncation)");

  // ============================================================
  // TEST SUITE 6: Geo Consistency & IP Extraction
  // ============================================================

  console.log("\n🛡️ TEST SUITE 6: Geo Consistency Function & IP Extraction\n");

  assert(!validateGeoConsistency("BD", "New York"), "Consistency: BD + New York = INVALID (false)");
  assert(!validateGeoConsistency("JP", "New York"), "Consistency: JP + New York = INVALID (false)");
  assert(!validateGeoConsistency("US", "Dhaka"), "Consistency: US + Dhaka = INVALID (false)");
  assert(!validateGeoConsistency("GB", "Tokyo"), "Consistency: GB + Tokyo = INVALID (false)");

  assert(validateGeoConsistency("US", "New York"), "Consistency: US + New York = VALID (true)");
  assert(validateGeoConsistency("BD", "Dhaka"), "Consistency: BD + Dhaka = VALID (true)");
  assert(validateGeoConsistency("GB", "London"), "Consistency: GB + London = VALID (true)");
  assert(validateGeoConsistency("JP", "Tokyo"), "Consistency: JP + Tokyo = VALID (true)");

  assert(isPrivateIp("127.0.0.1"), "Private IP: 127.0.0.1 is private");
  assert(isPrivateIp("::1"), "Private IP: ::1 is loopback");
  assert(isPrivateIp("192.168.0.1"), "Private IP: 192.168.x is private");
  assert(isPrivateIp("10.0.0.1"), "Private IP: 10.x is private");
  assert(isPrivateIp("172.16.0.1"), "Private IP: 172.16.x is private");
  assert(isPrivateIp("0.0.0.0"), "Private IP: 0.0.0.0 is invalid/private");
  assert(isPrivateIp(""), "Private IP: empty is private");
  assert(isPrivateIp(null), "Private IP: null is private");

  assert(!isPrivateIp("8.8.8.8"), "Public IP: 8.8.8.8 is NOT private");
  assert(!isPrivateIp("103.145.120.1"), "Public IP: 103.145.120.1 is NOT private");
  assert(!isPrivateIp("142.250.190.46"), "Public IP: 142.250.190.46 is NOT private");

  // extractClientIp
  const mockHeadersCf = new Headers({ "cf-connecting-ip": "1.2.3.4" });
  assertEqual(extractClientIp({ headers: mockHeadersCf }), "1.2.3.4", "extractClientIp: Cloudflare cf-connecting-ip is authoritative");

  const mockHeadersVercel = new Headers({ "x-vercel-forwarded-for": "5.6.7.8, 9.10.11.12" });
  assertEqual(extractClientIp({ headers: mockHeadersVercel }), "5.6.7.8", "extractClientIp: Vercel x-vercel-forwarded-for is prioritized");

  const mockHeadersRealIp = new Headers({ "x-real-ip": "13.14.15.16" });
  assertEqual(extractClientIp({ headers: mockHeadersRealIp }), "13.14.15.16", "extractClientIp: x-real-ip reverse proxy header used");

  const mockHeadersForwarded = new Headers({ "x-forwarded-for": "17.18.19.20, 21.22.23.24" });
  assertEqual(extractClientIp({ headers: mockHeadersForwarded }), "17.18.19.20", "extractClientIp: leftmost x-forwarded-for is client IP");

  assertEqual(extractClientIp({ headers: new Headers() }), "0.0.0.0", "extractClientIp: empty headers fall back to 0.0.0.0");

  // ============================================================
  // TEST SUITE 7: Dashboard Data Format Verification
  // ============================================================

  console.log("\n📊 TEST SUITE 7: Dashboard Data Format Verification\n");

  const sessionsFormat = [
    { country: "BD" },
    { country: "BD" },
    { country: "US" },
    { country: "GB" },
    { country: "JP" },
    { country: "IN" },
    { country: "SG" },
    { country: null },
  ];

  const geoFormat = computeGeography(sessionsFormat);

  assert(geoFormat.countries.length > 0, "Countries array is non-empty");
  for (const c of geoFormat.countries) {
    assert(typeof c.country === "string", `Country has name: ${c.country}`);
    assert(typeof c.code === "string", `Country has code: ${c.code}`);
    assert(typeof c.sessions === "number", `Country has sessions: ${c.sessions}`);
    assert(typeof c.percentage === "number", `Country has percentage: ${c.percentage}`);
  }

  assertEqual(geoFormat.cities.length, 0, "Cities array is strictly empty in dashboard format");

  const unknownC = geoFormat.countries.find((c) => c.country === "Unknown");
  assert(unknownC !== undefined, "'Unknown' country listed for null-country sessions");
  assertEqual(unknownC?.code, "—", "Unknown country code is '—'");

  const totalCountrySessions = geoFormat.countries.reduce((sum, c) => sum + c.sessions, 0);
  assertEqual(totalCountrySessions, sessionsFormat.length, "Total country sessions matches input count");

  const totalPct = geoFormat.countries.reduce((sum, c) => sum + c.percentage, 0);
  assert(Math.abs(totalPct - 100) < 1, `Percentages sum to ~100 (got ${totalPct})`);

  // ============================================================
  // TEST SUITE 8: Stress Test — 1000 Sessions
  // ============================================================

  console.log("\n💪 TEST SUITE 8: Stress Test — 1000 Sessions\n");

  const stressSessions = [];
  const stressCountries = ["BD", "US", "GB", "JP", "IN", "SG", "DE", "CA", "FR", "AU"];

  for (let i = 0; i < 1000; i++) {
    const country = stressCountries[i % stressCountries.length];
    stressSessions.push({ country });
  }

  const geoStress = computeGeography(stressSessions);

  assertEqual(geoStress.cities.length, 0, "Stress: Cities array strictly empty");
  assertEqual(geoStress.countries.length, 10, "Stress: All 10 sovereign countries accounted for");
  const totalStress = geoStress.countries.reduce((sum, c) => sum + c.sessions, 0);
  assertEqual(totalStress, 1000, "Stress: Sum of sessions equals 1000");

  assert(!geoStress.countries.some((c) => c.code === "UN"), "Stress: No 'UN' code in countries");

  // ============================================================
  // RESULTS
  // ============================================================

  console.log("\n" + "=".repeat(60));
  console.log(`📊 GEOGRAPHY ACCURACY TEST RESULTS`);
  console.log("=".repeat(60));
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📋 Total:  ${passed + failed}`);

  if (failures.length > 0) {
    console.log("\nFailed tests:");
    failures.forEach((f) => console.log(`  ⛔ ${f}`));
  }

  console.log("\n" + (failed === 0 ? "🎉 ALL GEOGRAPHY TESTS PASSED!" : "⚠️  SOME TESTS FAILED — REVIEW REQUIRED"));
  process.exit(failed > 0 ? 1 : 0);
}

runAll().catch((err) => {
  console.error("Test runner error:", err);
  process.exit(1);
});
