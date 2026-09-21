"use client";

import styles from "./AiReferralsCard.module.css";

export default function AiReferralsCard({ aiReferrals }) {
  const safeData = aiReferrals || {
    aiVisitors: 0,
    aiSessions: 0,
    aiPageviews: 0,
    aiInquiries: 0,
    aiConversions: 0,
    aiConversionRate: "0.0%",
    platforms: [],
    funnel: [],
  };

  const {
    aiVisitors = 0,
    aiSessions = 0,
    aiPageviews = 0,
    aiInquiries = 0,
    aiConversions = 0,
    aiConversionRate = "0.0%",
    platforms = [],
    funnel = [],
    detectionMethods = { utm: 0, referrer: 0, redirect: 0, other: 0 },
    lastAiReferral = null,
  } = safeData;

  const hasTraffic = aiSessions > 0;

  return (
    <div className={styles.card}>
      {/* Header */}
      <div className={styles.cardHeader}>
        <div className={styles.headerLeft}>
          <div className={styles.aiIconWrapper}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="4" y="4" width="16" height="16" rx="2" />
              <rect x="9" y="9" width="6" height="6" />
              <line x1="9" y1="1" x2="9" y2="4" />
              <line x1="15" y1="1" x2="15" y2="4" />
              <line x1="9" y1="20" x2="9" y2="23" />
              <line x1="15" y1="20" x2="15" y2="23" />
              <line x1="20" y1="9" x2="23" y2="9" />
              <line x1="20" y1="14" x2="23" y2="14" />
              <line x1="1" y1="9" x2="4" y2="9" />
              <line x1="1" y1="14" x2="4" y2="14" />
            </svg>
          </div>
          <div>
            <h2 className={styles.cardTitle}>AI Referral Attribution</h2>
            <p className={styles.cardSubtext}>
              Telemetry from verified conversational AI platforms (ChatGPT, Perplexity, Gemini, Claude, Copilot)
            </p>
          </div>
        </div>
        <div className={styles.headerBadge}>
          <span className={styles.liveSignalDot} />
          <span>{hasTraffic ? `${aiSessions.toLocaleString()} AI Sessions Attributed` : "No verified AI referrals"}</span>
        </div>
      </div>

      {hasTraffic ? (
        <>
          {/* KPI Overview Pills */}
          <div className={styles.kpiGrid}>
            <div className={styles.kpiPill}>
              <span className={styles.kpiLabel}>AI Visitors</span>
              <span className={styles.kpiValue}>{aiVisitors.toLocaleString()}</span>
            </div>
            <div className={styles.kpiPill}>
              <span className={styles.kpiLabel}>AI Sessions</span>
              <span className={styles.kpiValue}>{aiSessions.toLocaleString()}</span>
            </div>
            <div className={styles.kpiPill}>
              <span className={styles.kpiLabel}>AI Pageviews</span>
              <span className={styles.kpiValue}>{aiPageviews.toLocaleString()}</span>
            </div>
            <div className={styles.kpiPill}>
              <span className={styles.kpiLabel}>AI Inquiries</span>
              <span className={styles.kpiValue}>{aiInquiries.toLocaleString()}</span>
            </div>
            <div className={styles.kpiPill}>
              <span className={styles.kpiLabel}>AI Conversions</span>
              <span className={styles.kpiValue}>{aiConversions.toLocaleString()}</span>
            </div>
            <div className={styles.kpiPill}>
              <span className={styles.kpiLabel}>Conversion Rate</span>
              <span className={`${styles.kpiValue} ${styles.kpiHighlight}`}>{aiConversionRate}</span>
            </div>
          </div>

          {/* Diagnostic Signals Ribbon */}
          <div className={styles.signalsRibbon}>
            <div className={styles.signalsLeft}>
              <span className={styles.signalsLabel}>Detection Signals:</span>
              <span className={styles.signalPill}>
                Referrer: <strong>{detectionMethods?.referrer || 0}</strong>
              </span>
              <span className={styles.signalPill}>
                UTM Campaign: <strong>{detectionMethods?.utm || 0}</strong>
              </span>
              {detectionMethods?.redirect > 0 && (
                <span className={styles.signalPill}>
                  Redirect/Path: <strong>{detectionMethods.redirect}</strong>
                </span>
              )}
              {detectionMethods?.other > 0 && (
                <span className={styles.signalPill}>
                  Other: <strong>{detectionMethods.other}</strong>
                </span>
              )}
            </div>
            {lastAiReferral && (
              <div className={styles.signalsRight}>
                <span className={styles.lastReferralLabel}>Last Inbound AI Visit:</span>
                <span className={styles.lastReferralTime}>
                  {new Date(lastAiReferral).toLocaleString(undefined, {
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            )}
          </div>

          {/* Platform Breakdown Table */}
          <div className={styles.tableSection}>
            <h3 className={styles.sectionHeading}>Platform Attribution Breakdown</h3>
            <div className={styles.tableScrollWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th className={styles.thPlatform}>AI Platform</th>
                    <th className={styles.thMetric}>Visitors</th>
                    <th className={styles.thMetric}>Sessions</th>
                    <th className={styles.thMetric}>Pageviews</th>
                    <th className={styles.thMetric}>Inquiries</th>
                    <th className={styles.thConversions}>Conversions</th>
                    <th className={styles.thRate}>Yield Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {platforms.map((p) => (
                    <tr key={p.platform} className={styles.tr}>
                      <td className={styles.tdPlatform}>
                        <div className={styles.platformCell}>
                          <span
                            className={styles.platformDot}
                            style={{ backgroundColor: p.color || "#10B981" }}
                          />
                          <span className={styles.platformName}>{p.platform}</span>
                        </div>
                      </td>
                      <td className={styles.tdNum}>
                        <span className={styles.num}>{p.visitors.toLocaleString()}</span>
                      </td>
                      <td className={styles.tdNum}>
                        <span className={styles.num}>{p.sessions.toLocaleString()}</span>
                      </td>
                      <td className={styles.tdNum}>
                        <span className={styles.num}>{p.pageviews.toLocaleString()}</span>
                      </td>
                      <td className={styles.tdNum}>
                        <span className={styles.num}>{p.inquiries.toLocaleString()}</span>
                      </td>
                      <td className={styles.tdNum}>
                        <span className={styles.conversionBadge}>
                          {p.conversions} leads
                        </span>
                      </td>
                      <td className={styles.tdNum}>
                        <span className={styles.rateHighlight}>
                          {p.conversionRate}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* AI Funnel Progression */}
          {funnel.length > 0 && (
            <div className={styles.funnelSection}>
              <h3 className={styles.sectionHeading}>AI Traffic Conversion Funnel</h3>
              <div className={styles.funnelGrid}>
                {funnel.map((step, idx) => (
                  <div key={idx} className={styles.funnelStep}>
                    <div className={styles.stepHeader}>
                      <span className={styles.stepNum}>0{idx + 1}</span>
                      {step.dropoff !== null && step.dropoff !== undefined && (
                        <span className={styles.stepDropoff}>-{step.dropoff}%</span>
                      )}
                    </div>
                    <h4 className={styles.stepTitle}>{step.stage}</h4>
                    <div className={styles.stepStats}>
                      <span className={styles.stepCount}>{step.count.toLocaleString()}</span>
                      <span className={styles.stepPct}>({step.percentage}%)</span>
                    </div>
                    <div className={styles.progressBarTrack}>
                      <div
                        className={styles.progressBarFill}
                        style={{ width: `${Math.max(step.percentage, step.count > 0 ? 4 : 0)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      ) : (
        <div className={styles.emptyState}>
          <p className={styles.emptyStateTitle}>No verified AI referrals</p>
          <p className={styles.emptyStateDesc}>
            No verified AI referral traffic was detected in this period. Inbound visits with verifiable AI referrer signals (ChatGPT, Perplexity, Gemini, Claude, Microsoft Copilot) or explicit AI campaign parameters will be attributed here automatically with zero false positives.
          </p>
        </div>
      )}
    </div>
  );
}
