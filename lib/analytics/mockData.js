/**
 * Aeethod Studio — Private 360° Analytics Mock Data Layer
 *
 * Provides structured, realistic agency analytics data behind clean data
 * access functions. When real Supabase APIs are implemented, only the
 * fetch functions in this file will be swapped for real API calls.
 */

/**
 * Generates mock analytics dataset for a given date range.
 * @param {"today"|"yesterday"|"7d"|"30d"|"custom"} range
 */
export function getMockAnalytics(range = "7d") {
  switch (range) {
    case "today":
      return {
        range: "today",
        rangeLabel: "Today (Last 24 Hours)",
        comparisonLabel: "vs yesterday",
        metrics: {
          liveVisitors: 6,
          uniqueVisitors: { value: 342, change: "+14.8%", isPositive: true },
          totalSessions: { value: 489, change: "+11.2%", isPositive: true },
          pageviews: { value: 1680, change: "+16.5%", isPositive: true },
          avgDuration: { value: "3m 12s", change: "+18s", isPositive: true },
          bounceRate: { value: "31.8%", change: "-2.4%", isPositive: true },
          inquiries: { value: 7, change: "+2", isPositive: true },
          conversionRate: { value: "4.1%", change: "+0.5%", isPositive: true },
        },
        trafficChart: [
          { label: "00:00", visitors: 14, pageviews: 38 },
          { label: "03:00", visitors: 8, pageviews: 22 },
          { label: "06:00", visitors: 18, pageviews: 54 },
          { label: "09:00", visitors: 46, pageviews: 162 },
          { label: "12:00", visitors: 62, pageviews: 240 },
          { label: "15:00", visitors: 78, pageviews: 310 },
          { label: "18:00", visitors: 64, pageviews: 265 },
          { label: "21:00", visitors: 52, pageviews: 189 },
        ],
        funnel: [
          { stage: "Website Visits", count: 489, percentage: 100, dropoff: null },
          { stage: "Explored Services / Work", count: 324, percentage: 66.3, dropoff: 33.7 },
          { stage: "Started Contact", count: 76, percentage: 15.5, dropoff: 76.5 },
          { stage: "Inquiry / Call Booked", count: 20, percentage: 4.1, dropoff: 73.7 },
        ],
        devices: [
          { type: "Desktop", percentage: 71.2, count: 348, color: "#7C5CFC" },
          { type: "Mobile", percentage: 24.8, count: 121, color: "#60A5FA" },
          { type: "Tablet", percentage: 4.0, count: 20, color: "#C4B5FD" },
        ],
        trafficSources: [
          { source: "Direct", count: 186, percentage: 38.0, color: "#7C5CFC" },
          { source: "Organic Search", count: 142, percentage: 29.0, color: "#60A5FA" },
          { source: "Social", count: 96, percentage: 19.6, color: "#34D399" },
          { source: "Referral", count: 44, percentage: 9.0, color: "#FBBF24" },
          { source: "Paid Ads", count: 21, percentage: 4.4, color: "#F87171" },
        ],
        topPages: [
          { title: "Home — Aeethod Studio", path: "/", views: 720, uniqueVisitors: 310, avgTime: "1m 18s" },
          { title: "Works & Case Studies", path: "/works", views: 490, uniqueVisitors: 260, avgTime: "3m 45s" },
          { title: "Autonomous Automation Systems", path: "/services/automation", views: 240, uniqueVisitors: 150, avgTime: "4m 20s" },
          { title: "Services Overview", path: "/services", views: 180, uniqueVisitors: 120, avgTime: "2m 10s" },
          { title: "Studio Identity & Philosophy", path: "/studio", views: 130, uniqueVisitors: 90, avgTime: "2m 35s" },
          { title: "Direct Contact & Booking", path: "/contact", views: 90, uniqueVisitors: 75, avgTime: "3m 25s" },
        ],
        geography: {
          countries: [
            { country: "United States", code: "US", sessions: 210, percentage: 42.9 },
            { country: "United Kingdom", code: "GB", sessions: 84, percentage: 17.2 },
            { country: "Germany", code: "DE", sessions: 58, percentage: 11.9 },
            { country: "Canada", code: "CA", sessions: 46, percentage: 9.4 },
            { country: "Japan", code: "JP", sessions: 38, percentage: 7.8 },
            { country: "Australia", code: "AU", sessions: 31, percentage: 6.3 },
            { country: "Other", code: "--", sessions: 22, percentage: 4.5 },
          ],
          cities: [
            { city: "New York", country: "US", sessions: 74 },
            { city: "London", country: "GB", sessions: 62 },
            { city: "San Francisco", country: "US", sessions: 51 },
            { city: "Berlin", country: "DE", sessions: 36 },
            { city: "Toronto", country: "CA", sessions: 28 },
            { city: "Tokyo", country: "JP", sessions: 25 },
          ],
        },
        technology: {
          browsers: [
            { name: "Chrome", percentage: 64.2, count: 314 },
            { name: "Safari", percentage: 23.5, count: 115 },
            { name: "Edge", percentage: 6.5, count: 32 },
            { name: "Firefox", percentage: 4.3, count: 21 },
            { name: "Other", percentage: 1.5, count: 7 },
          ],
          os: [
            { name: "macOS", percentage: 46.0, count: 225 },
            { name: "Windows", percentage: 30.5, count: 149 },
            { name: "iOS", percentage: 14.5, count: 71 },
            { name: "Android", percentage: 5.7, count: 28 },
            { name: "Linux", percentage: 3.3, count: 16 },
          ],
        },
        campaigns: [
          { source: "LinkedIn", medium: "Social", campaign: "q1-executive-outreach", sessions: 68, visitors: 58, conversions: 6, rate: "8.8%" },
          { source: "Twitter / X", medium: "Social", campaign: "studio-autonomous-demo", sessions: 52, visitors: 46, conversions: 4, rate: "7.7%" },
          { source: "Google", medium: "Organic", campaign: "brand-search", sessions: 94, visitors: 82, conversions: 3, rate: "3.2%" },
          { source: "Substack", medium: "Newsletter", campaign: "systems-deepdive-04", sessions: 38, visitors: 34, conversions: 3, rate: "7.9%" },
          { source: "Dribbble", medium: "Referral", campaign: "works-showcase", sessions: 28, visitors: 24, conversions: 2, rate: "7.1%" },
        ],
      };

    case "yesterday":
      return {
        range: "yesterday",
        rangeLabel: "Yesterday",
        comparisonLabel: "vs previous day",
        metrics: {
          liveVisitors: 3,
          uniqueVisitors: { value: 312, change: "+6.1%", isPositive: true },
          totalSessions: { value: 440, change: "+4.8%", isPositive: true },
          pageviews: { value: 1490, change: "+8.2%", isPositive: true },
          avgDuration: { value: "2m 54s", change: "-6s", isPositive: false },
          bounceRate: { value: "33.6%", change: "+0.8%", isPositive: false },
          inquiries: { value: 5, change: "+1", isPositive: true },
          conversionRate: { value: "3.6%", change: "+0.2%", isPositive: true },
        },
        trafficChart: [
          { label: "00:00", visitors: 11, pageviews: 29 },
          { label: "03:00", visitors: 6, pageviews: 18 },
          { label: "06:00", visitors: 15, pageviews: 42 },
          { label: "09:00", visitors: 42, pageviews: 148 },
          { label: "12:00", visitors: 58, pageviews: 218 },
          { label: "15:00", visitors: 69, pageviews: 280 },
          { label: "18:00", visitors: 59, pageviews: 235 },
          { label: "21:00", visitors: 48, pageviews: 165 },
        ],
        funnel: [
          { stage: "Website Visits", count: 440, percentage: 100, dropoff: null },
          { stage: "Explored Services / Work", count: 280, percentage: 63.6, dropoff: 36.4 },
          { stage: "Started Contact", count: 64, percentage: 14.5, dropoff: 77.1 },
          { stage: "Inquiry / Call Booked", count: 16, percentage: 3.6, dropoff: 75.0 },
        ],
        devices: [
          { type: "Desktop", percentage: 69.5, count: 306, color: "#7C5CFC" },
          { type: "Mobile", percentage: 26.1, count: 115, color: "#60A5FA" },
          { type: "Tablet", percentage: 4.4, count: 19, color: "#C4B5FD" },
        ],
        trafficSources: [
          { source: "Direct", count: 165, percentage: 37.5, color: "#7C5CFC" },
          { source: "Organic Search", count: 130, percentage: 29.5, color: "#60A5FA" },
          { source: "Social", count: 85, percentage: 19.3, color: "#34D399" },
          { source: "Referral", count: 40, percentage: 9.1, color: "#FBBF24" },
          { source: "Paid Ads", count: 20, percentage: 4.6, color: "#F87171" },
        ],
        topPages: [
          { title: "Home — Aeethod Studio", path: "/", views: 640, uniqueVisitors: 280, avgTime: "1m 12s" },
          { title: "Works & Case Studies", path: "/works", views: 430, uniqueVisitors: 235, avgTime: "3m 38s" },
          { title: "Autonomous Automation Systems", path: "/services/automation", views: 210, uniqueVisitors: 135, avgTime: "4m 12s" },
          { title: "Services Overview", path: "/services", views: 165, uniqueVisitors: 110, avgTime: "2m 02s" },
          { title: "Studio Identity & Philosophy", path: "/studio", views: 120, uniqueVisitors: 82, avgTime: "2m 28s" },
          { title: "Direct Contact & Booking", path: "/contact", views: 82, uniqueVisitors: 68, avgTime: "3m 15s" },
        ],
        geography: {
          countries: [
            { country: "United States", code: "US", sessions: 185, percentage: 42.0 },
            { country: "United Kingdom", code: "GB", sessions: 76, percentage: 17.3 },
            { country: "Germany", code: "DE", sessions: 52, percentage: 11.8 },
            { country: "Canada", code: "CA", sessions: 42, percentage: 9.5 },
            { country: "Japan", code: "JP", sessions: 35, percentage: 8.0 },
            { country: "Australia", code: "AU", sessions: 28, percentage: 6.4 },
            { country: "Other", code: "--", sessions: 22, percentage: 5.0 },
          ],
          cities: [
            { city: "New York", country: "US", sessions: 66 },
            { city: "London", country: "GB", sessions: 54 },
            { city: "San Francisco", country: "US", sessions: 45 },
            { city: "Berlin", country: "DE", sessions: 32 },
            { city: "Toronto", country: "CA", sessions: 24 },
            { city: "Tokyo", country: "JP", sessions: 22 },
          ],
        },
        technology: {
          browsers: [
            { name: "Chrome", percentage: 63.2, count: 278 },
            { name: "Safari", percentage: 24.1, count: 106 },
            { name: "Edge", percentage: 6.8, count: 30 },
            { name: "Firefox", percentage: 4.5, count: 20 },
            { name: "Other", percentage: 1.4, count: 6 },
          ],
          os: [
            { name: "macOS", percentage: 44.8, count: 197 },
            { name: "Windows", percentage: 31.4, count: 138 },
            { name: "iOS", percentage: 15.0, count: 66 },
            { name: "Android", percentage: 5.9, count: 26 },
            { name: "Linux", percentage: 2.9, count: 13 },
          ],
        },
        campaigns: [
          { source: "LinkedIn", medium: "Social", campaign: "q1-executive-outreach", sessions: 60, visitors: 52, conversions: 5, rate: "8.3%" },
          { source: "Twitter / X", medium: "Social", campaign: "studio-autonomous-demo", sessions: 48, visitors: 42, conversions: 3, rate: "6.3%" },
          { source: "Google", medium: "Organic", campaign: "brand-search", sessions: 84, visitors: 74, conversions: 3, rate: "3.6%" },
          { source: "Substack", medium: "Newsletter", campaign: "systems-deepdive-04", sessions: 32, visitors: 28, conversions: 2, rate: "6.3%" },
          { source: "Dribbble", medium: "Referral", campaign: "works-showcase", sessions: 24, visitors: 20, conversions: 1, rate: "4.2%" },
        ],
      };

    case "30d":
      return {
        range: "30d",
        rangeLabel: "Last 30 Days",
        comparisonLabel: "vs previous 30 days",
        metrics: {
          liveVisitors: 5,
          uniqueVisitors: { value: 6840, change: "+24.5%", isPositive: true },
          totalSessions: { value: 9420, change: "+19.2%", isPositive: true },
          pageviews: { value: 32900, change: "+28.1%", isPositive: true },
          avgDuration: { value: "3m 04s", change: "+22s", isPositive: true },
          bounceRate: { value: "32.4%", change: "-3.8%", isPositive: true },
          inquiries: { value: 118, change: "+32", isPositive: true },
          conversionRate: { value: "3.9%", change: "+0.7%", isPositive: true },
        },
        trafficChart: [
          { label: "Week 1", visitors: 1480, pageviews: 7120 },
          { label: "Week 2", visitors: 1690, pageviews: 8240 },
          { label: "Week 3", visitors: 1780, pageviews: 8650 },
          { label: "Week 4", visitors: 1890, pageviews: 8890 },
        ],
        funnel: [
          { stage: "Website Visits", count: 9420, percentage: 100, dropoff: null },
          { stage: "Explored Services / Work", count: 6120, percentage: 65.0, dropoff: 35.0 },
          { stage: "Started Contact", count: 1410, percentage: 15.0, dropoff: 77.0 },
          { stage: "Inquiry / Call Booked", count: 367, percentage: 3.9, dropoff: 74.0 },
        ],
        devices: [
          { type: "Desktop", percentage: 68.8, count: 6480, color: "#7C5CFC" },
          { type: "Mobile", percentage: 26.8, count: 2525, color: "#60A5FA" },
          { type: "Tablet", percentage: 4.4, count: 415, color: "#C4B5FD" },
        ],
        trafficSources: [
          { source: "Direct", count: 3580, percentage: 38.0, color: "#7C5CFC" },
          { source: "Organic Search", count: 2730, percentage: 29.0, color: "#60A5FA" },
          { source: "Social", count: 1840, percentage: 19.5, color: "#34D399" },
          { source: "Referral", count: 850, percentage: 9.0, color: "#FBBF24" },
          { source: "Paid Ads", count: 420, percentage: 4.5, color: "#F87171" },
        ],
        topPages: [
          { title: "Home — Aeethod Studio", path: "/", views: 13900, uniqueVisitors: 5400, avgTime: "1m 20s" },
          { title: "Works & Case Studies", path: "/works", views: 9800, uniqueVisitors: 4100, avgTime: "3m 52s" },
          { title: "Autonomous Automation Systems", path: "/services/automation", views: 4900, uniqueVisitors: 2800, avgTime: "4m 25s" },
          { title: "Services Overview", path: "/services", views: 3700, uniqueVisitors: 2200, avgTime: "2m 14s" },
          { title: "Studio Identity & Philosophy", path: "/studio", views: 2600, uniqueVisitors: 1750, avgTime: "2m 40s" },
          { title: "Direct Contact & Booking", path: "/contact", views: 1850, uniqueVisitors: 1420, avgTime: "3m 30s" },
        ],
        geography: {
          countries: [
            { country: "United States", code: "US", sessions: 3950, percentage: 41.9 },
            { country: "United Kingdom", code: "GB", sessions: 1560, percentage: 16.6 },
            { country: "Germany", code: "DE", sessions: 1180, percentage: 12.5 },
            { country: "Canada", code: "CA", sessions: 920, percentage: 9.8 },
            { country: "Japan", code: "JP", sessions: 760, percentage: 8.1 },
            { country: "Australia", code: "AU", sessions: 590, percentage: 6.3 },
            { country: "Other", code: "--", sessions: 460, percentage: 4.8 },
          ],
          cities: [
            { city: "New York", country: "US", sessions: 1380 },
            { city: "London", country: "GB", sessions: 1140 },
            { city: "San Francisco", country: "US", sessions: 910 },
            { city: "Berlin", country: "DE", sessions: 720 },
            { city: "Toronto", country: "CA", sessions: 580 },
            { city: "Tokyo", country: "JP", sessions: 520 },
          ],
        },
        technology: {
          browsers: [
            { name: "Chrome", percentage: 63.8, count: 6010 },
            { name: "Safari", percentage: 23.9, count: 2251 },
            { name: "Edge", percentage: 6.6, count: 622 },
            { name: "Firefox", percentage: 4.3, count: 405 },
            { name: "Other", percentage: 1.4, count: 132 },
          ],
          os: [
            { name: "macOS", percentage: 45.4, count: 4277 },
            { name: "Windows", percentage: 31.0, count: 2920 },
            { name: "iOS", percentage: 14.8, count: 1394 },
            { name: "Android", percentage: 5.8, count: 546 },
            { name: "Linux", percentage: 3.0, count: 283 },
          ],
        },
        campaigns: [
          { source: "LinkedIn", medium: "Social", campaign: "q1-executive-outreach", sessions: 1420, visitors: 1190, conversions: 112, rate: "7.9%" },
          { source: "Twitter / X", medium: "Social", campaign: "studio-autonomous-demo", sessions: 1180, visitors: 1040, conversions: 86, rate: "7.3%" },
          { source: "Google", medium: "Organic", campaign: "brand-search", sessions: 1980, visitors: 1720, conversions: 68, rate: "3.4%" },
          { source: "Substack", medium: "Newsletter", campaign: "systems-deepdive-04", sessions: 740, visitors: 660, conversions: 52, rate: "7.0%" },
          { source: "Dribbble", medium: "Referral", campaign: "works-showcase", sessions: 580, visitors: 510, conversions: 38, rate: "6.6%" },
        ],
      };

    case "custom":
      return {
        range: "custom",
        rangeLabel: "Custom Range (Q1 Benchmark)",
        comparisonLabel: "vs target model",
        metrics: {
          liveVisitors: 4,
          uniqueVisitors: { value: 18450, change: "+31.2%", isPositive: true },
          totalSessions: { value: 26100, change: "+28.4%", isPositive: true },
          pageviews: { value: 92400, change: "+34.0%", isPositive: true },
          avgDuration: { value: "3m 08s", change: "+26s", isPositive: true },
          bounceRate: { value: "31.9%", change: "-4.2%", isPositive: true },
          inquiries: { value: 342, change: "+88", isPositive: true },
          conversionRate: { value: "4.0%", change: "+0.8%", isPositive: true },
        },
        trafficChart: [
          { label: "Jan", visitors: 5420, pageviews: 27100 },
          { label: "Feb", visitors: 6180, pageviews: 31200 },
          { label: "Mar", visitors: 6850, pageviews: 34100 },
        ],
        funnel: [
          { stage: "Website Visits", count: 26100, percentage: 100, dropoff: null },
          { stage: "Explored Services / Work", count: 17200, percentage: 65.9, dropoff: 34.1 },
          { stage: "Started Contact", count: 3980, percentage: 15.2, dropoff: 76.9 },
          { stage: "Inquiry / Call Booked", count: 1044, percentage: 4.0, dropoff: 73.8 },
        ],
        devices: [
          { type: "Desktop", percentage: 69.1, count: 18035, color: "#7C5CFC" },
          { type: "Mobile", percentage: 26.5, count: 6917, color: "#60A5FA" },
          { type: "Tablet", percentage: 4.4, count: 1148, color: "#C4B5FD" },
        ],
        trafficSources: [
          { source: "Direct", count: 9918, percentage: 38.0, color: "#7C5CFC" },
          { source: "Organic Search", count: 7569, percentage: 29.0, color: "#60A5FA" },
          { source: "Social", count: 5090, percentage: 19.5, color: "#34D399" },
          { source: "Referral", count: 2349, percentage: 9.0, color: "#FBBF24" },
          { source: "Paid Ads", count: 1174, percentage: 4.5, color: "#F87171" },
        ],
        topPages: [
          { title: "Home — Aeethod Studio", path: "/", views: 38800, uniqueVisitors: 14800, avgTime: "1m 22s" },
          { title: "Works & Case Studies", path: "/works", views: 27400, uniqueVisitors: 11200, avgTime: "3m 55s" },
          { title: "Autonomous Automation Systems", path: "/services/automation", views: 13900, uniqueVisitors: 7800, avgTime: "4m 28s" },
          { title: "Services Overview", path: "/services", views: 10200, uniqueVisitors: 6100, avgTime: "2m 16s" },
          { title: "Studio Identity & Philosophy", path: "/studio", views: 7400, uniqueVisitors: 4800, avgTime: "2m 42s" },
          { title: "Direct Contact & Booking", path: "/contact", views: 5200, uniqueVisitors: 3900, avgTime: "3m 32s" },
        ],
        geography: {
          countries: [
            { country: "United States", code: "US", sessions: 11020, percentage: 42.2 },
            { country: "United Kingdom", code: "GB", sessions: 4320, percentage: 16.6 },
            { country: "Germany", code: "DE", sessions: 3260, percentage: 12.5 },
            { country: "Canada", code: "CA", sessions: 2540, percentage: 9.7 },
            { country: "Japan", code: "JP", sessions: 2110, percentage: 8.1 },
            { country: "Australia", code: "AU", sessions: 1620, percentage: 6.2 },
            { country: "Other", code: "--", sessions: 1230, percentage: 4.7 },
          ],
          cities: [
            { city: "New York", country: "US", sessions: 3860 },
            { city: "London", country: "GB", sessions: 3120 },
            { city: "San Francisco", country: "US", sessions: 2540 },
            { city: "Berlin", country: "DE", sessions: 1980 },
            { city: "Toronto", country: "CA", sessions: 1620 },
            { city: "Tokyo", country: "JP", sessions: 1440 },
          ],
        },
        technology: {
          browsers: [
            { name: "Chrome", percentage: 63.9, count: 16678 },
            { name: "Safari", percentage: 23.8, count: 6212 },
            { name: "Edge", percentage: 6.7, count: 1749 },
            { name: "Firefox", percentage: 4.2, count: 1096 },
            { name: "Other", percentage: 1.4, count: 365 },
          ],
          os: [
            { name: "macOS", percentage: 45.6, count: 11902 },
            { name: "Windows", percentage: 30.8, count: 8039 },
            { name: "iOS", percentage: 14.8, count: 3863 },
            { name: "Android", percentage: 5.7, count: 1488 },
            { name: "Linux", percentage: 3.1, count: 808 },
          ],
        },
        campaigns: [
          { source: "LinkedIn", medium: "Social", campaign: "q1-executive-outreach", sessions: 3920, visitors: 3320, conversions: 312, rate: "8.0%" },
          { source: "Twitter / X", medium: "Social", campaign: "studio-autonomous-demo", sessions: 3280, visitors: 2890, conversions: 242, rate: "7.4%" },
          { source: "Google", medium: "Organic", campaign: "brand-search", sessions: 5490, visitors: 4810, conversions: 188, rate: "3.4%" },
          { source: "Substack", medium: "Newsletter", campaign: "systems-deepdive-04", sessions: 2080, visitors: 1840, conversions: 148, rate: "7.1%" },
          { source: "Dribbble", medium: "Referral", campaign: "works-showcase", sessions: 1620, visitors: 1410, conversions: 106, rate: "6.5%" },
        ],
      };

    case "7d":
    default:
      return {
        range: "7d",
        rangeLabel: "Last 7 Days",
        comparisonLabel: "vs previous 7 days",
        metrics: {
          liveVisitors: 4,
          uniqueVisitors: { value: 1482, change: "+18.4%", isPositive: true },
          totalSessions: { value: 2190, change: "+12.6%", isPositive: true },
          pageviews: { value: 7840, change: "+15.2%", isPositive: true },
          avgDuration: { value: "2m 48s", change: "+14s", isPositive: true },
          bounceRate: { value: "34.2%", change: "-3.1%", isPositive: true },
          inquiries: { value: 28, change: "+21.7%", isPositive: true },
          conversionRate: { value: "3.8%", change: "+0.6%", isPositive: true },
        },
        trafficChart: [
          { label: "Mon", visitors: 182, pageviews: 940 },
          { label: "Tue", visitors: 210, pageviews: 1120 },
          { label: "Wed", visitors: 245, pageviews: 1280 },
          { label: "Thu", visitors: 230, pageviews: 1190 },
          { label: "Fri", visitors: 268, pageviews: 1420 },
          { label: "Sat", visitors: 172, pageviews: 890 },
          { label: "Sun", visitors: 175, pageviews: 1000 },
        ],
        funnel: [
          { stage: "Website Visits", count: 2190, percentage: 100, dropoff: null },
          { stage: "Explored Services / Work", count: 1380, percentage: 63.0, dropoff: 37.0 },
          { stage: "Started Contact", count: 312, percentage: 14.2, dropoff: 77.4 },
          { stage: "Inquiry / Call Booked", count: 84, percentage: 3.8, dropoff: 73.1 },
        ],
        devices: [
          { type: "Desktop", percentage: 68.4, count: 1498, color: "#7C5CFC" },
          { type: "Mobile", percentage: 27.2, count: 596, color: "#60A5FA" },
          { type: "Tablet", percentage: 4.4, count: 96, color: "#C4B5FD" },
        ],
        trafficSources: [
          { source: "Direct", count: 820, percentage: 37.4, color: "#7C5CFC" },
          { source: "Organic Search", count: 640, percentage: 29.2, color: "#60A5FA" },
          { source: "Social", count: 410, percentage: 18.7, color: "#34D399" },
          { source: "Referral", count: 210, percentage: 9.6, color: "#FBBF24" },
          { source: "Paid Ads", count: 110, percentage: 5.1, color: "#F87171" },
        ],
        topPages: [
          { title: "Home — Aeethod Studio", path: "/", views: 3240, uniqueVisitors: 1680, avgTime: "1m 15s" },
          { title: "Works & Case Studies", path: "/works", views: 2180, uniqueVisitors: 1240, avgTime: "3m 42s" },
          { title: "Autonomous Automation Systems", path: "/services/automation", views: 1120, uniqueVisitors: 710, avgTime: "4m 10s" },
          { title: "Services Overview", path: "/services", views: 860, uniqueVisitors: 590, avgTime: "2m 05s" },
          { title: "Studio Identity & Philosophy", path: "/studio", views: 640, uniqueVisitors: 430, avgTime: "2m 30s" },
          { title: "Direct Contact & Consultations", path: "/contact", views: 420, uniqueVisitors: 380, avgTime: "3m 15s" },
        ],
        geography: {
          countries: [
            { country: "United States", code: "US", sessions: 890, percentage: 40.6 },
            { country: "United Kingdom", code: "GB", sessions: 360, percentage: 16.4 },
            { country: "Germany", code: "DE", sessions: 280, percentage: 12.8 },
            { country: "Canada", code: "CA", sessions: 220, percentage: 10.0 },
            { country: "Japan", code: "JP", sessions: 180, percentage: 8.2 },
            { country: "Australia", code: "AU", sessions: 140, percentage: 6.4 },
            { country: "Other", code: "--", sessions: 120, percentage: 5.6 },
          ],
          cities: [
            { city: "New York", country: "US", sessions: 310 },
            { city: "London", country: "GB", sessions: 260 },
            { city: "San Francisco", country: "US", sessions: 210 },
            { city: "Berlin", country: "DE", sessions: 170 },
            { city: "Toronto", country: "CA", sessions: 140 },
            { city: "Tokyo", country: "JP", sessions: 120 },
          ],
        },
        technology: {
          browsers: [
            { name: "Chrome", percentage: 62.5, count: 1368 },
            { name: "Safari", percentage: 24.1, count: 528 },
            { name: "Edge", percentage: 6.8, count: 149 },
            { name: "Firefox", percentage: 4.7, count: 103 },
            { name: "Other", percentage: 1.9, count: 42 },
          ],
          os: [
            { name: "macOS", percentage: 44.2, count: 968 },
            { name: "Windows", percentage: 31.5, count: 690 },
            { name: "iOS", percentage: 15.3, count: 335 },
            { name: "Android", percentage: 6.1, count: 134 },
            { name: "Linux", percentage: 2.9, count: 63 },
          ],
        },
        campaigns: [
          { source: "LinkedIn", medium: "Social", campaign: "q1-executive-outreach", sessions: 340, visitors: 280, conversions: 24, rate: "7.1%" },
          { source: "Twitter / X", medium: "Social", campaign: "studio-autonomous-demo", sessions: 290, visitors: 260, conversions: 18, rate: "6.2%" },
          { source: "Google", medium: "Organic", campaign: "brand-search", sessions: 480, visitors: 410, conversions: 16, rate: "3.3%" },
          { source: "Substack", medium: "Newsletter", campaign: "systems-deepdive-04", sessions: 180, visitors: 160, conversions: 12, rate: "6.7%" },
          { source: "Dribbble", medium: "Referral", campaign: "works-showcase", sessions: 140, visitors: 120, conversions: 8, rate: "5.7%" },
        ],
      };
  }
}

/**
 * Clean data layer fetcher simulating async API fetch.
 * When real API endpoints are built, replace this implementation with:
 *   const res = await fetch(`/api/admin/analytics?range=${range}`);
 *   return await res.json();
 *
 * @param {"today"|"yesterday"|"7d"|"30d"|"custom"} range
 * @returns {Promise<ReturnType<typeof getMockAnalytics>>}
 */
export async function fetchAnalyticsData(range = "7d") {
  // Simulated low-latency network delay for realistic UI transition
  await new Promise((resolve) => setTimeout(resolve, 200));
  return getMockAnalytics(range);
}
