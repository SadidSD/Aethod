#!/usr/bin/env node
/**
 * AEETHOD 360° — Geography Accuracy Test Suite
 *
 * Tests:
 * - ISO country code normalization
 * - Country code ↔ name resolution
 * - Never-fabricate-city rule
 * - Geo consistency validation
 * - Regression: BD + New York = INVALID
 * - "UN" never appears as a country code
 * - Dashboard data format verification
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

// ============================================================
// TEST SUITE 1: Country Code Resolution
// ============================================================

console.log("\n🌍 TEST SUITE 1: Country Code Resolution\n");

// ISO code → full name
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

// Full name → code
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

// Null / empty / undefined
assertEqual(resolveCountry(null).name, "Unknown", "null → Unknown");
assertEqual(resolveCountry("").name, "Unknown", "empty string → Unknown");
assertEqual(resolveCountry(undefined).name, "Unknown", "undefined → Unknown");
assertEqual(resolveCountry("  ").name, "Unknown", "whitespace → Unknown");
assertEqual(resolveCountry(null).code, null, "null country has null code");

// ============================================================
// TEST SUITE 2: "UN" Must NEVER Be a Country Code
// ============================================================

console.log("\n🚫 TEST SUITE 2: 'UN' Must NEVER Be a Country Code\n");

assert(resolveCountry("UN").code === null, "'UN' is NOT a valid country code");
assertEqual(resolveCountry("UN").name, "Unknown", "'UN' placeholder maps to 'Unknown' per Requirement 11");

// Verify it never appears in computeGeography output
const sessionsWithNullCountry = [
  { country: null, city: null },
  { country: null, city: null },
  { country: null, city: null },
];
const geoNull = computeGeography(sessionsWithNullCountry);
const hasUN = geoNull.countries.some(c => c.code === "UN");
assert(!hasUN, "No 'UN' country code in geography output for null-country sessions");
assertEqual(geoNull.countries[0]?.country, "Unknown", "Null countries aggregate as 'Unknown'");

// ============================================================
// TEST SUITE 3: NEVER Fabricate City
// ============================================================

console.log("\n🏙️ TEST SUITE 3: NEVER Fabricate City\n");

// When city is null, it should NOT appear in cities list
const sessionsNullCity = [
  { country: "BD", city: null },
  { country: "US", city: null },
  { country: "GB", city: null },
];
const geoNullCity = computeGeography(sessionsNullCity);
assertEqual(geoNullCity.cities.length, 0, "No cities when all cities are null");

// When city is empty string
const sessionsEmptyCity = [
  { country: "US", city: "" },
  { country: "BD", city: "  " },
];
const geoEmptyCity = computeGeography(sessionsEmptyCity);
assertEqual(geoEmptyCity.cities.length, 0, "No cities when all cities are empty/whitespace");

// Mixed: some have city, some don't
const sessionsMixed = [
  { country: "BD", city: "Dhaka" },
  { country: "BD", city: null },
  { country: "US", city: "New York" },
  { country: "US", city: null },
  { country: "GB", city: null },
];
const geoMixed = computeGeography(sessionsMixed);
assertEqual(geoMixed.cities.length, 2, "Only 2 cities (Dhaka, New York) when 3 have null city");
assert(geoMixed.cities.some(c => c.city === "Dhaka"), "Dhaka is in cities list");
assert(geoMixed.cities.some(c => c.city === "New York"), "New York is in cities list");
assert(!geoMixed.cities.some(c => c.city === "Unknown"), "No 'Unknown' city in list");

// ============================================================
// TEST SUITE 4: Geo Consistency (PERMANENT REGRESSION TEST)
// ============================================================

console.log("\n🔒 TEST SUITE 4: Geo Consistency — Permanent Regression Tests\n");

// REGRESSION: BD + New York must NEVER appear
const sessionsRegression = [
  { country: "BD", city: null },   // Bangladesh visitor, no city
  { country: "BD", city: "Dhaka" }, // Bangladesh visitor with city
  { country: "US", city: "New York" }, // US visitor with city
  { country: "US", city: null },    // US visitor, no city
];
const geoRegression = computeGeography(sessionsRegression);

// Verify New York is only paired with United States
const nyEntry = geoRegression.cities.find(c => c.city === "New York");
assert(nyEntry !== undefined, "New York exists in cities");
assertEqual(nyEntry?.countryName, "United States", "New York paired with United States");
assert(nyEntry?.country === "US", "New York country code is US");

// Verify Dhaka is only paired with Bangladesh
const dhakaEntry = geoRegression.cities.find(c => c.city === "Dhaka");
assert(dhakaEntry !== undefined, "Dhaka exists in cities");
assertEqual(dhakaEntry?.countryName, "Bangladesh", "Dhaka paired with Bangladesh");
assert(dhakaEntry?.country === "BD", "Dhaka country code is BD");

// BD must NEVER be paired with New York
const invalidPair = geoRegression.cities.some(
  c => c.city === "New York" && (c.country === "BD" || c.countryName === "Bangladesh")
);
assert(!invalidPair, "REGRESSION: New York + BD never appears");

// US must NEVER be paired with Dhaka
const invalidPair2 = geoRegression.cities.some(
  c => c.city === "Dhaka" && (c.country === "US" || c.countryName === "United States")
);
assert(!invalidPair2, "REGRESSION: Dhaka + US never appears");

// JP + New York must not appear
const invalidPair3 = geoRegression.cities.some(
  c => c.city === "New York" && (c.country === "JP" || c.countryName === "Japan")
);
assert(!invalidPair3, "REGRESSION: New York + JP never appears");

// GB + London (valid check)
const sessionsGB = [{ country: "GB", city: "London" }];
const geoGB = computeGeography(sessionsGB);
const londonEntry = geoGB.cities.find(c => c.city === "London");
assertEqual(londonEntry?.countryName, "United Kingdom", "London paired with United Kingdom");
assertEqual(londonEntry?.country, "GB", "London country code is GB");

// ============================================================
// TEST SUITE 5: Country Code Derivation Correctness
// ============================================================

console.log("\n📋 TEST SUITE 5: Country Code Derivation (No More Truncation)\n");

// These are the exact bugs that were occurring
const sessionsCodeBug = [
  { country: "United States", city: "New York" },
  { country: "Bangladesh", city: "Dhaka" },
];
const geoCodeBug = computeGeography(sessionsCodeBug);

// "United States" must become code "US", NOT "UN"
const usEntry = geoCodeBug.countries.find(c => c.country === "United States");
assertEqual(usEntry?.code, "US", "United States → code US (not 'UN' from truncation)");

// "Bangladesh" must become code "BD", NOT "BA"
const bdEntry = geoCodeBug.countries.find(c => c.country === "Bangladesh");
assertEqual(bdEntry?.code, "BD", "Bangladesh → code BD (not 'BA' from truncation)");

// Cities should also have correct codes
const nyCityBug = geoCodeBug.cities.find(c => c.city === "New York");
assertEqual(nyCityBug?.country, "US", "New York city → country code US");
assertEqual(nyCityBug?.countryName, "United States", "New York city → country name United States");

const dhakaCityBug = geoCodeBug.cities.find(c => c.city === "Dhaka");
assertEqual(dhakaCityBug?.country, "BD", "Dhaka city → country code BD");
assertEqual(dhakaCityBug?.countryName, "Bangladesh", "Dhaka city → country name Bangladesh");

// ============================================================
// TEST SUITE: Geo Consistency Validator & IP Extraction
// ============================================================

console.log("\n🛡️ TEST SUITE: Geo Consistency Function & IP Extraction\n");

// validateGeoConsistency:
assert(!validateGeoConsistency("BD", "New York"), "Consistency: BD + New York = INVALID (false)");
assert(!validateGeoConsistency("JP", "New York"), "Consistency: JP + New York = INVALID (false)");
assert(!validateGeoConsistency("US", "Dhaka"), "Consistency: US + Dhaka = INVALID (false)");
assert(!validateGeoConsistency("GB", "Tokyo"), "Consistency: GB + Tokyo = INVALID (false)");

assert(validateGeoConsistency("US", "New York"), "Consistency: US + New York = VALID (true)");
assert(validateGeoConsistency("BD", "Dhaka"), "Consistency: BD + Dhaka = VALID (true)");
assert(validateGeoConsistency("GB", "London"), "Consistency: GB + London = VALID (true)");
assert(validateGeoConsistency("JP", "Tokyo"), "Consistency: JP + Tokyo = VALID (true)");
assert(validateGeoConsistency("IN", "Delhi"), "Consistency: IN + Delhi = VALID (true)");
assert(validateGeoConsistency("SG", "Singapore"), "Consistency: SG + Singapore = VALID (true)");
assert(validateGeoConsistency("FR", "Paris"), "Consistency: FR + Paris = VALID (true)");
assert(validateGeoConsistency("DE", "Berlin"), "Consistency: DE + Berlin = VALID (true)");
assert(validateGeoConsistency(null, "Anywhere"), "Consistency: null country allows unverified city");
assert(validateGeoConsistency("US", null), "Consistency: null city is valid");

// isPrivateIp:
assert(isPrivateIp("127.0.0.1"), "Private IP: 127.0.0.1 is private");
assert(isPrivateIp("::1"), "Private IP: ::1 is loopback");
assert(isPrivateIp("192.168.1.100"), "Private IP: 192.168.x is private");
assert(isPrivateIp("10.0.0.5"), "Private IP: 10.x is private");
assert(isPrivateIp("172.16.0.1"), "Private IP: 172.16.x is private");
assert(isPrivateIp("0.0.0.0"), "Private IP: 0.0.0.0 is invalid/private");
assert(isPrivateIp(""), "Private IP: empty is private");
assert(isPrivateIp(null), "Private IP: null is private");
assert(!isPrivateIp("8.8.8.8"), "Public IP: 8.8.8.8 is NOT private");
assert(!isPrivateIp("103.145.120.1"), "Public IP: 103.145.120.1 is NOT private");
assert(!isPrivateIp("142.250.190.46"), "Public IP: 142.250.190.46 is NOT private");

// extractClientIp from headers:
const mockReqCF = {
  headers: new Map([
    ["cf-connecting-ip", "203.0.113.195"],
    ["x-forwarded-for", "198.51.100.1"],
  ]),
};
mockReqCF.headers.get = (k) => mockReqCF.headers.get ? Map.prototype.get.call(mockReqCF.headers, k) : null;
assertEqual(extractClientIp({ headers: new Headers({ "cf-connecting-ip": "203.0.113.195", "x-forwarded-for": "198.51.100.1" }) }), "203.0.113.195", "extractClientIp: Cloudflare cf-connecting-ip is authoritative");
assertEqual(extractClientIp({ headers: new Headers({ "x-vercel-forwarded-for": "198.51.100.2, 10.0.0.1", "x-forwarded-for": "10.0.0.1" }) }), "198.51.100.2", "extractClientIp: Vercel x-vercel-forwarded-for is prioritized");
assertEqual(extractClientIp({ headers: new Headers({ "x-real-ip": "198.51.100.3" }) }), "198.51.100.3", "extractClientIp: x-real-ip reverse proxy header used");
assertEqual(extractClientIp({ headers: new Headers({ "x-forwarded-for": "198.51.100.4, 10.0.0.2" }) }), "198.51.100.4", "extractClientIp: leftmost x-forwarded-for is client IP");
assertEqual(extractClientIp({ headers: new Headers() }), "0.0.0.0", "extractClientIp: empty headers fall back to 0.0.0.0");

// ============================================================
// TEST SUITE 6: Dashboard Data Format
// ============================================================

console.log("\n📊 TEST SUITE 6: Dashboard Data Format Verification\n");

const sessionsFormat = [
  { country: "BD", city: "Dhaka" },
  { country: "BD", city: "Dhaka" },
  { country: "US", city: "New York" },
  { country: "GB", city: "London" },
  { country: "JP", city: "Tokyo" },
  { country: "IN", city: "Delhi" },
  { country: "SG", city: "Singapore" },
  { country: null, city: null },
];

const geoFormat = computeGeography(sessionsFormat);

// Countries should have: country (name), code, sessions, percentage
assert(geoFormat.countries.length > 0, "Countries array is non-empty");
for (const c of geoFormat.countries) {
  assert(typeof c.country === "string", `Country has name: ${c.country}`);
  assert(typeof c.code === "string", `Country has code: ${c.code}`);
  assert(typeof c.sessions === "number", `Country has sessions: ${c.sessions}`);
  assert(typeof c.percentage === "number", `Country has percentage: ${c.percentage}`);
}

// Cities should have: city, country (code), countryName, sessions
assert(geoFormat.cities.length > 0, "Cities array is non-empty");
for (const c of geoFormat.cities) {
  assert(typeof c.city === "string", `City has name: ${c.city}`);
  assert(typeof c.country === "string", `City has country code: ${c.country}`);
  assert(typeof c.countryName === "string", `City has countryName: ${c.countryName}`);
  assert(typeof c.sessions === "number", `City has sessions: ${c.sessions}`);
}

// Unknown country should be listed in countries (not fabricated as "United States")
const unknownCountry = geoFormat.countries.find(c => c.country === "Unknown");
assert(unknownCountry !== undefined, "'Unknown' country listed for null-country sessions");
assertEqual(unknownCountry?.code, "—", "Unknown country code is '—'");

// Total sessions should match
const totalCountrySessions = geoFormat.countries.reduce((sum, c) => sum + c.sessions, 0);
assertEqual(totalCountrySessions, sessionsFormat.length, "Total country sessions matches input count");

// Percentages should sum to ~100
const totalPct = geoFormat.countries.reduce((sum, c) => sum + c.percentage, 0);
assert(Math.abs(totalPct - 100) < 1, `Percentages sum to ~100 (got ${totalPct})`);

// ============================================================
// TEST SUITE 7: Stress Test — Large Session Count
// ============================================================

console.log("\n💪 TEST SUITE 7: Stress Test — 1000 Sessions\n");

const stressSessions = [];
const stressCountries = ["BD", "US", "GB", "JP", "IN", "SG", "DE", "CA", "FR", "AU"];
const stressCities = {
  BD: "Dhaka", US: "New York", GB: "London", JP: "Tokyo",
  IN: "Delhi", SG: "Singapore", DE: "Berlin", CA: "Toronto",
  FR: "Paris", AU: "Sydney",
};

for (let i = 0; i < 1000; i++) {
  const country = stressCountries[i % stressCountries.length];
  // 30% of sessions have no city
  const city = i % 3 === 0 ? null : stressCities[country];
  stressSessions.push({ country, city });
}

const geoStress = computeGeography(stressSessions);

// No cross-contamination
for (const c of geoStress.cities) {
  const expectedCountry = Object.entries(stressCities).find(([_, city]) => city === c.city)?.[0];
  if (expectedCountry) {
    assertEqual(c.country, expectedCountry, `Stress: ${c.city} paired with ${expectedCountry}`);
  }
}

// Total sessions across top 7 countries should equal 700 (100 per country)
assertEqual(geoStress.countries.length, 7, "Stress: Top 7 countries returned");
const totalStress = geoStress.countries.reduce((sum, c) => sum + c.sessions, 0);
assertEqual(totalStress, 700, "Stress: Top 7 countries sum to 700 sessions (70%)");

// No "UN" code anywhere
assert(!geoStress.countries.some(c => c.code === "UN"), "Stress: No 'UN' code in countries");
assert(!geoStress.cities.some(c => c.country === "UN"), "Stress: No 'UN' code in cities");

// No fabricated cities
assert(!geoStress.cities.some(c => c.city === "Unknown"), "Stress: No 'Unknown' cities");

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
  failures.forEach(f => console.log(`  ⛔ ${f}`));
}

console.log("\n" + (failed === 0 ? "🎉 ALL GEOGRAPHY TESTS PASSED!" : "⚠️  SOME TESTS FAILED — REVIEW REQUIRED"));
process.exit(failed > 0 ? 1 : 0);
