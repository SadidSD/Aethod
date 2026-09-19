/**
 * JSDoc Type Definitions for Aeethod Analytics Database
 *
 * Since this project uses JavaScript (not TypeScript), these JSDoc typedefs
 * provide IDE autocompletion and inline documentation for all analytics tables.
 *
 * Usage in other files:
 *   /** @type {import("@/lib/supabase/types").Visitor} *\/
 *   const visitor = { ... };
 */

/**
 * Persistent anonymous visitor identity.
 * Tracks unique visitors without storing personally identifiable information.
 *
 * @typedef {Object} Visitor
 * @property {string} id - UUID primary key (auto-generated)
 * @property {string} visitor_id - Unique anonymous visitor identifier
 * @property {string} first_seen - ISO 8601 timestamp of first visit (TIMESTAMPTZ)
 * @property {string} last_seen - ISO 8601 timestamp of most recent visit (TIMESTAMPTZ)
 * @property {string|null} device_type - Device category: "desktop", "mobile", "tablet"
 * @property {string|null} operating_system - OS name: "Windows", "macOS", "iOS", "Android", "Linux"
 * @property {string|null} browser - Browser name: "Chrome", "Firefox", "Safari", "Edge"
 * @property {string|null} country - Country name or ISO code
 * @property {string|null} city - City name
 */

/**
 * Browsing session with traffic attribution and device/geo metadata.
 *
 * @typedef {Object} Session
 * @property {string} id - UUID primary key (auto-generated)
 * @property {string} session_id - Unique session identifier
 * @property {string} visitor_id - FK → visitors.visitor_id
 * @property {string} started_at - ISO 8601 timestamp (TIMESTAMPTZ)
 * @property {string} last_activity_at - ISO 8601 timestamp (TIMESTAMPTZ)
 * @property {string|null} ended_at - ISO 8601 timestamp when session ended (nullable)
 * @property {string|null} referrer - HTTP referrer URL
 * @property {string|null} utm_source - UTM source parameter
 * @property {string|null} utm_medium - UTM medium parameter
 * @property {string|null} utm_campaign - UTM campaign parameter
 * @property {string|null} utm_term - UTM term parameter
 * @property {string|null} utm_content - UTM content parameter
 * @property {string} traffic_source - Classification: "Direct", "Organic Search", "Social", "Paid Ads", "Referral"
 * @property {string|null} device_type - Device category
 * @property {string|null} operating_system - OS name
 * @property {string|null} browser - Browser name
 * @property {string|null} country - Country name or ISO code
 * @property {string|null} city - City name
 */

/**
 * Individual page view event within a session.
 *
 * @typedef {Object} PageView
 * @property {string} id - UUID primary key (auto-generated)
 * @property {string} session_id - FK → sessions.session_id
 * @property {string} visitor_id - FK → visitors.visitor_id
 * @property {string} path - Page path (e.g., "/works", "/services/automation")
 * @property {string} viewed_at - ISO 8601 timestamp (TIMESTAMPTZ)
 * @property {number} duration_seconds - Time spent on page in seconds (default: 0)
 * @property {string|null} referrer - Referring page URL (nullable)
 */

/**
 * Meaningful user action or conversion event.
 *
 * @typedef {Object} AnalyticsEvent
 * @property {string} id - UUID primary key (auto-generated)
 * @property {string} session_id - FK → sessions.session_id
 * @property {string} visitor_id - FK → visitors.visitor_id
 * @property {string} event_name - Event identifier (e.g., "cta_click", "inquiry_submitted")
 * @property {Object|null} event_value - Arbitrary event metadata (JSONB)
 * @property {string|null} page_path - Page where the event occurred
 * @property {string} created_at - ISO 8601 timestamp (TIMESTAMPTZ)
 */

/**
 * Valid traffic source classifications.
 * @typedef {"Direct"|"Organic Search"|"Social"|"Paid Ads"|"Referral"} TrafficSource
 */

/**
 * Valid device type classifications.
 * @typedef {"desktop"|"mobile"|"tablet"} DeviceType
 */

/**
 * Standard analytics event names used across Aeethod Studio.
 * @typedef {"explore_services"|"view_work"|"start_contact"|"inquiry_submitted"|"call_booked"|"cta_click"|"navigation_click"} AnalyticsEventName
 */

// Export nothing — this file is purely for JSDoc type definitions.
// Import types via: /** @type {import("@/lib/supabase/types").Visitor} */
export {};
