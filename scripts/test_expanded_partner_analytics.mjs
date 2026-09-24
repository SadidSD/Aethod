import assert from "node:assert";
import {
  computePartnerTrackers,
  getAnonymousVisitorLabel,
  formatTimeAgo,
} from "../lib/analytics/adminQueries.js";

console.log("============================================================");
console.log("TESTING EXPANDED PARTNER REFERRAL ANALYTICS SYSTEM");
console.log("============================================================");

// 1. Anonymous visitor label
console.log("Testing Anonymous Visitor Labeling...");
assert.strictEqual(getAnonymousVisitorLabel("v_0ab00ff73286"), "Visitor #3286");
assert.strictEqual(getAnonymousVisitorLabel("7c5cfc10a82f"), "Visitor #A82F");
assert.strictEqual(getAnonymousVisitorLabel("abc"), "Visitor #0ABC");
console.log("✅ getAnonymousVisitorLabel passed");

// 2. formatTimeAgo
console.log("Testing formatTimeAgo...");
const now = Date.now();
assert.strictEqual(formatTimeAgo(new Date(now - 10000).toISOString(), now), "just now");
assert.strictEqual(formatTimeAgo(new Date(now - 45000).toISOString(), now), "45s ago");
assert.strictEqual(formatTimeAgo(new Date(now - 120000).toISOString(), now), "2m ago");
assert.strictEqual(formatTimeAgo(new Date(now - 3600000).toISOString(), now), "1h ago");
console.log("✅ formatTimeAgo passed");

// 3. Realistic Mock Data
const nowIso = new Date().toISOString();
const twoMinAgo = new Date(Date.now() - 2 * 60 * 1000).toISOString();
const fourMinAgo = new Date(Date.now() - 4 * 60 * 1000).toISOString();
const tenMinAgo = new Date(Date.now() - 10 * 60 * 1000).toISOString();

const mockSessions = [
  // RNG Gamez Active Visitor #1
  {
    session_id: "sess_rng_1",
    visitor_id: "vis_rng_a82f",
    started_at: fourMinAgo,
    last_activity_at: twoMinAgo,
    landing_page: "https://www.aeethod.com/?ref=rng-gamez",
    traffic_source: "Referral",
    referrer: "https://rnggamez.com",
    utm_source: "rng-gamez",
    utm_medium: "referral",
    utm_campaign: "rng-gamez",
    device_type: "desktop",
    browser: "Chrome",
    operating_system: "macOS",
    country: "United States",
    country_code: "US",
    city: "San Francisco",
  },
  // Murakkaz Inactive Visitor #2
  {
    session_id: "sess_mur_1",
    visitor_id: "vis_mur_7286",
    started_at: tenMinAgo,
    last_activity_at: tenMinAgo,
    landing_page: "https://www.aeethod.com/?utm_source=murakkaz.com&utm_medium=referral&utm_campaign=footer_credit",
    traffic_source: "Referral",
    referrer: "https://murakkaz.com",
    utm_source: "murakkaz.com",
    utm_medium: "referral",
    utm_campaign: "footer_credit",
    device_type: "mobile",
    browser: "Safari",
    operating_system: "iOS",
    country: "Bangladesh",
    country_code: "BD",
    city: "Dhaka",
  },
];

const mockPageViews = [
  // RNG Visitor journey pageviews
  {
    id: "pv_1",
    session_id: "sess_rng_1",
    visitor_id: "vis_rng_a82f",
    path: "/",
    viewed_at: fourMinAgo,
    duration_seconds: 35,
  },
  {
    id: "pv_2",
    session_id: "sess_rng_1",
    visitor_id: "vis_rng_a82f",
    path: "/works/rng-gamez",
    viewed_at: new Date(Date.now() - 3 * 60 * 1000).toISOString(),
    duration_seconds: 80,
  },
  {
    id: "pv_3",
    session_id: "sess_rng_1",
    visitor_id: "vis_rng_a82f",
    path: "/contact",
    viewed_at: twoMinAgo,
    duration_seconds: 45,
  },
  // Murakkaz Visitor pageview
  {
    id: "pv_4",
    session_id: "sess_mur_1",
    visitor_id: "vis_mur_7286",
    path: "/",
    viewed_at: tenMinAgo,
    duration_seconds: 25,
  },
];

const mockEvents = [
  // RNG Events
  {
    id: "ev_1",
    session_id: "sess_rng_1",
    visitor_id: "vis_rng_a82f",
    event_name: "scroll_depth",
    event_value: { scrollPercent: 75, referralSource: "rng-gamez" },
    page_path: "/works/rng-gamez",
    created_at: new Date(Date.now() - 3 * 60 * 1000).toISOString(),
  },
  {
    id: "ev_2",
    session_id: "sess_rng_1",
    visitor_id: "vis_rng_a82f",
    event_name: "cta_click",
    event_value: { buttonText: "Get in Touch", referralSource: "rng-gamez" },
    page_path: "/works/rng-gamez",
    created_at: new Date(Date.now() - 2.5 * 60 * 1000).toISOString(),
  },
  {
    id: "ev_3",
    session_id: "sess_rng_1",
    visitor_id: "vis_rng_a82f",
    event_name: "form_submitted",
    event_value: { formType: "contact", isConversion: true, referralSource: "rng-gamez" },
    page_path: "/contact",
    created_at: twoMinAgo,
  },
  // Murakkaz Events
  {
    id: "ev_4",
    session_id: "sess_mur_1",
    visitor_id: "vis_mur_7286",
    event_name: "scroll_depth",
    event_value: { scrollPercent: 50, referralSource: "murakkaz" },
    page_path: "/",
    created_at: tenMinAgo,
  },
];

console.log("Running computePartnerTrackers...");
const trackers = computePartnerTrackers(mockSessions, mockPageViews, mockEvents);

assert.strictEqual(trackers.length, 2, "Should have exactly 2 partner trackers");

const rngTracker = trackers.find((t) => t.id === "rng_gamez");
const murTracker = trackers.find((t) => t.id === "murakkaz");

assert.ok(rngTracker, "RNG Gamez tracker exists");
assert.ok(murTracker, "Murakkaz tracker exists");

// Verify Separation
console.log("Verifying Independent Partner Attribution...");
assert.strictEqual(rngTracker.visitors, 1, "RNG has 1 visitor");
assert.strictEqual(rngTracker.sessions, 1, "RNG has 1 session");
assert.strictEqual(rngTracker.pageviews, 3, "RNG has 3 pageviews");
assert.strictEqual(rngTracker.conversions, 1, "RNG has 1 conversion");
assert.strictEqual(rngTracker.isLive, true, "RNG visitor is active within 5m");

assert.strictEqual(murTracker.visitors, 1, "Murakkaz has 1 visitor");
assert.strictEqual(murTracker.sessions, 1, "Murakkaz has 1 session");
assert.strictEqual(murTracker.pageviews, 1, "Murakkaz has 1 pageview");
assert.strictEqual(murTracker.conversions, 0, "Murakkaz has 0 conversions");
assert.strictEqual(murTracker.isLive, false, "Murakkaz visitor inactive (> 5m ago)");
console.log("✅ Partner isolation verified");

// Verify Live Visitors
console.log("Verifying Live Visitors...");
assert.strictEqual(rngTracker.liveVisitors.length, 1, "RNG has 1 live visitor");
const liveRng = rngTracker.liveVisitors[0];
assert.strictEqual(liveRng.visitorLabel, "Visitor #A82F");
assert.strictEqual(liveRng.currentViewingPage, "/contact");
assert.strictEqual(liveRng.country, "United States");
assert.strictEqual(liveRng.countryCode, "US");
assert.strictEqual(liveRng.device, "desktop");
assert.strictEqual(murTracker.liveVisitors.length, 0, "Murakkaz has 0 live visitors");
console.log("✅ Live visitors verified");

// Verify Visitor Directory & Journey
console.log("Verifying Journey Timeline...");
assert.strictEqual(rngTracker.allVisitorsList.length, 1);
const rngVisitor = rngTracker.allVisitorsList[0];
assert.ok(rngVisitor.journey.length >= 4, "RNG visitor should have multiple journey steps");
console.log(`RNG Visitor journey steps (${rngVisitor.journey.length}):`);
for (const step of rngVisitor.journey) {
  console.log(`  - [${step.badge}] ${step.title} (${step.path})`);
}
assert.strictEqual(rngVisitor.hasConverted, true, "Visitor marked as converted");
console.log("✅ Journey timeline verified");

// Verify Page Activity Table
console.log("Verifying Page Activity Table...");
assert.ok(rngTracker.pageActivity.length >= 3, "RNG has 3 explored pages");
const contactPage = rngTracker.pageActivity.find((p) => p.path === "/contact");
assert.ok(contactPage, "Contact page is in pageActivity");
assert.strictEqual(contactPage.views, 1);
assert.strictEqual(contactPage.exitRate, "100.0%", "Contact page was the exit page of the session");
console.log("✅ Page activity verified");

// Verify Country Analytics
console.log("Verifying Country Analytics...");
assert.strictEqual(rngTracker.countryAnalytics.length, 1);
assert.strictEqual(rngTracker.countryAnalytics[0].country, "United States");
assert.strictEqual(rngTracker.countryAnalytics[0].countryCode, "US");
assert.strictEqual(rngTracker.countryAnalytics[0].conversions, 1);

assert.strictEqual(murTracker.countryAnalytics.length, 1);
assert.strictEqual(murTracker.countryAnalytics[0].country, "Bangladesh");
assert.strictEqual(murTracker.countryAnalytics[0].countryCode, "BD");
console.log("✅ Country analytics verified");

// Verify Device Analytics
console.log("Verifying Device Analytics...");
assert.strictEqual(rngTracker.deviceAnalytics.desktop.count, 1);
assert.strictEqual(rngTracker.deviceAnalytics.desktop.percentage, "100.0%");
assert.strictEqual(murTracker.deviceAnalytics.mobile.count, 1);
assert.strictEqual(murTracker.deviceAnalytics.mobile.percentage, "100.0%");
console.log("✅ Device analytics verified");

// Verify Recent Activity
console.log("Verifying Recent Activity Feed...");
assert.ok(rngTracker.recentActivity.length >= 3);
console.log(`Latest activity for RNG: ${rngTracker.recentActivity[0].title}`);
assert.ok(rngTracker.recentActivity[0].timeAgo);
console.log("✅ Recent activity verified");

console.log("\n🎉 ALL EXPANDED PARTNER ANALYTICS TESTS PASSED SUCCESSFULLY!");
