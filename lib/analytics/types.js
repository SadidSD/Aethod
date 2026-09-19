/**
 * Aeethod Studio — Admin Analytics Type Definitions & Contracts
 * 
 * JSDoc definitions describing the analytical data model, request params,
 * and API responses for Aeethod's private 360° Analytics system.
 */

/**
 * @typedef {"today" | "yesterday" | "7d" | "30d" | "custom"} AnalyticsDateRange
 */

/**
 * @typedef {Object} MetricCardValue
 * @property {number|string} value - Current value (e.g. 1482 or "2m 48s" or "34.2%")
 * @property {string} change - Relative difference formatted with sign (e.g. "+18.4%", "-3.1%", "+2")
 * @property {boolean} isPositive - Whether change represents positive performance
 */

/**
 * @typedef {Object} AnalyticsOverviewMetrics
 * @property {number} liveVisitors - Count of active sessions in the last 5 minutes
 * @property {MetricCardValue} uniqueVisitors - Distinct visitors in current range
 * @property {MetricCardValue} totalSessions - Total sessions initiated in current range
 * @property {MetricCardValue} pageviews - Total page views in current range
 * @property {MetricCardValue} avgDuration - Average session duration
 * @property {MetricCardValue} bounceRate - % of single-page sessions
 * @property {MetricCardValue} inquiries - Meaningful conversion actions (inquiry submissions / calls booked)
 * @property {MetricCardValue} conversionRate - Inquiries divided by total sessions
 */

/**
 * @typedef {Object} TimeSeriesPoint
 * @property {string} label - Time bucket label (e.g. "09:00", "Mon", "Week 1", "2026-03-15")
 * @property {number} visitors - Unique visitors in this time bucket
 * @property {number} pageviews - Total pageviews in this time bucket
 */

/**
 * @typedef {Object} FunnelStage
 * @property {string} stage - Stage label (e.g. "Website Visits", "Explored Services / Work", "Started Contact", "Inquiry / Call Booked")
 * @property {number} count - Total count of sessions reaching this stage
 * @property {number} percentage - Percentage relative to stage 1 (0-100)
 * @property {number|null} dropoff - Dropoff percentage from preceding stage (0-100 or null for stage 1)
 */

/**
 * @typedef {Object} DeviceBreakdownItem
 * @property {"Desktop" | "Mobile" | "Tablet"} type - Device category
 * @property {number} percentage - Percentage of total sessions (0-100)
 * @property {number} count - Session count
 * @property {string} color - Hex color for chart rendering
 */

/**
 * @typedef {Object} TrafficSourceItem
 * @property {string} source - Classification (Direct, Organic Search, Social, Referral, Paid Ads)
 * @property {number} count - Session count
 * @property {number} percentage - Percentage of total sessions (0-100)
 * @property {string} color - Hex color for chart rendering
 */

/**
 * @typedef {Object} TopPageItem
 * @property {string} title - Human-readable page title
 * @property {string} path - URL path (e.g. "/", "/works", "/services/automation")
 * @property {number} views - Total pageview count
 * @property {number} uniqueVisitors - Distinct visitors who viewed this page
 * @property {string} avgTime - Average duration on this page (e.g. "1m 15s")
 */

/**
 * @typedef {Object} CountryItem
 * @property {string} country - Country name
 * @property {string} code - 2-letter ISO code (e.g. "US", "GB", "DE")
 * @property {number} sessions - Session count
 * @property {number} percentage - Share of total sessions
 */

/**
 * @typedef {Object} CityItem
 * @property {string} city - City name
 * @property {string} country - Country ISO code
 * @property {number} sessions - Session count
 */

/**
 * @typedef {Object} GeographyData
 * @property {CountryItem[]} countries - Top countries
 * @property {CityItem[]} cities - Top cities
 */

/**
 * @typedef {Object} TechItem
 * @property {string} name - Browser or OS name
 * @property {number} percentage - Share of total sessions
 * @property {number} count - Session count
 */

/**
 * @typedef {Object} TechnologyData
 * @property {TechItem[]} browsers - Browser distribution
 * @property {TechItem[]} os - Operating system distribution
 */

/**
 * @typedef {Object} CampaignItem
 * @property {string} source - utm_source (e.g. "LinkedIn", "Google")
 * @property {string} medium - utm_medium (e.g. "Social", "Organic", "cpc")
 * @property {string} campaign - utm_campaign name
 * @property {number} sessions - Total sessions
 * @property {number} visitors - Unique visitors
 * @property {number} conversions - Inquiries / bookings
 * @property {string} rate - Conversion rate formatted with % (e.g. "7.1%")
 */

/**
 * @typedef {Object} AiPlatformItem
 * @property {string} platform - AI platform name (e.g. "ChatGPT", "Perplexity", "Gemini", "Claude", "Microsoft Copilot")
 * @property {number} visitors - Unique visitors from this AI platform
 * @property {number} sessions - Total sessions from this AI platform
 * @property {number} pageviews - Total pageviews from this AI platform
 * @property {number} inquiries - Inquiry / booking events
 * @property {number} conversions - Distinct converting sessions
 * @property {string} conversionRate - Formatted conversion percentage (e.g. "5.2%")
 * @property {string} color - Brand hex color
 */

/**
 * @typedef {Object} AiReferralPayload
 * @property {number} aiVisitors - Total unique visitors referred by AI
 * @property {number} aiSessions - Total sessions referred by AI
 * @property {number} aiPageviews - Total pageviews generated by AI referrals
 * @property {number} aiInquiries - Total conversion actions initiated by AI referrals
 * @property {number} aiConversions - Distinct converting AI sessions
 * @property {string} aiConversionRate - Overall AI conversion rate (e.g. "4.8%")
 * @property {AiPlatformItem[]} platforms - Breakdown by platform
 * @property {FunnelStage[]} funnel - AI referral conversion funnel
 */

/**
 * @typedef {Object} MasterAnalyticsPayload
 * @property {AnalyticsDateRange} range - Active date range
 * @property {string} rangeLabel - Human-readable range description
 * @property {string} comparisonLabel - Comparison period description
 * @property {AnalyticsOverviewMetrics} metrics - Core overview metrics
 * @property {TimeSeriesPoint[]} trafficChart - Traffic time series
 * @property {FunnelStage[]} funnel - Progression funnel
 * @property {DeviceBreakdownItem[]} devices - Device distribution
 * @property {TrafficSourceItem[]} trafficSources - Traffic source distribution
 * @property {TopPageItem[]} topPages - Top viewed pages
 * @property {GeographyData} geography - Audience geography
 * @property {TechnologyData} technology - Technology profile
 * @property {CampaignItem[]} campaigns - Campaign attribution
 * @property {AiReferralPayload} aiReferrals - AI Referral attribution and breakdown
 */


/**
 * @typedef {Object} ApiResponseMeta
 * @property {AnalyticsDateRange} range
 * @property {string} from - ISO timestamp of start of period
 * @property {string} to - ISO timestamp of end of period
 * @property {string} prevFrom - ISO timestamp of comparison start
 * @property {string} prevTo - ISO timestamp of comparison end
 * @property {number} queryDurationMs - Server computation time in ms
 */

/**
 * @template T
 * @typedef {Object} ApiResponseEnvelope
 * @property {boolean} success
 * @property {T} data
 * @property {ApiResponseMeta} [meta]
 * @property {string} [error]
 */

export {};
