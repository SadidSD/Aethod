"use client";

import styles from "./MetricCards.module.css";

export default function MetricCards({ metrics, comparisonLabel = "vs previous period" }) {
  if (!metrics) return null;

  const {
    liveVisitors,
    uniqueVisitors,
    totalSessions,
    pageviews,
    avgDuration,
    bounceRate,
    inquiries,
    conversionRate,
  } = metrics;

  return (
    <section className={styles.metricsSection} aria-label="Key Performance Metrics">
      <div className={styles.grid}>
        {/* 1. Live Active Visitors */}
        <div className={`${styles.card} ${styles.liveCard}`}>
          <div className={styles.cardHeader}>
            <span className={styles.cardLabel}>Live Active Visitors</span>
            <span className={styles.liveBadge}>
              <span className={styles.pulsingDot} />
              active now
            </span>
          </div>
          <div className={styles.cardBody}>
            <span className={styles.liveNumber}>{liveVisitors}</span>
            <span className={styles.liveSubtext}>Browsing studio nodes</span>
          </div>
          <div className={styles.cardFooter}>
            <span className={styles.realtimePill}>Real-time telemetry</span>
          </div>
        </div>

        {/* 2. Unique Visitors */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <span className={styles.cardLabel}>Unique Visitors</span>
            <span className={`${styles.deltaPill} ${uniqueVisitors.isPositive ? styles.deltaPositive : styles.deltaNegative}`}>
              {uniqueVisitors.change}
            </span>
          </div>
          <div className={styles.cardBody}>
            <span className={styles.mainNumber}>{uniqueVisitors.value.toLocaleString()}</span>
          </div>
          <div className={styles.cardFooter}>
            <span className={styles.comparisonText}>{comparisonLabel}</span>
          </div>
        </div>

        {/* 3. Total Sessions */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <span className={styles.cardLabel}>Total Sessions</span>
            <span className={`${styles.deltaPill} ${totalSessions.isPositive ? styles.deltaPositive : styles.deltaNegative}`}>
              {totalSessions.change}
            </span>
          </div>
          <div className={styles.cardBody}>
            <span className={styles.mainNumber}>{totalSessions.value.toLocaleString()}</span>
          </div>
          <div className={styles.cardFooter}>
            <span
              className={styles.comparisonText}
              title={totalSessions.formattedLabel || comparisonLabel}
            >
              {totalSessions.formattedLabel || comparisonLabel}
            </span>
          </div>
        </div>

        {/* 4. Pageviews */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <span className={styles.cardLabel}>Pageviews</span>
            <span className={`${styles.deltaPill} ${pageviews.isPositive ? styles.deltaPositive : styles.deltaNegative}`}>
              {pageviews.change}
            </span>
          </div>
          <div className={styles.cardBody}>
            <span className={styles.mainNumber}>{pageviews.value.toLocaleString()}</span>
          </div>
          <div className={styles.cardFooter}>
            <span className={styles.comparisonText}>{comparisonLabel}</span>
          </div>
        </div>

        {/* 5. Average Session Duration */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <span className={styles.cardLabel}>Avg. Duration</span>
            <span className={`${styles.deltaPill} ${avgDuration.isPositive ? styles.deltaPositive : styles.deltaNegative}`}>
              {avgDuration.change}
            </span>
          </div>
          <div className={styles.cardBody}>
            <span className={styles.mainNumber}>{avgDuration.value}</span>
          </div>
          <div className={styles.cardFooter}>
            <span className={styles.comparisonText}>Time spent exploring</span>
          </div>
        </div>

        {/* 6. Bounce Rate */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <span className={styles.cardLabel}>Bounce Rate</span>
            <span className={`${styles.deltaPill} ${bounceRate.isPositive ? styles.deltaPositive : styles.deltaNegative}`}>
              {bounceRate.change}
            </span>
          </div>
          <div className={styles.cardBody}>
            <span className={styles.mainNumber}>{bounceRate.value}</span>
          </div>
          <div className={styles.cardFooter}>
            <span className={styles.comparisonText}>Single-interaction exits</span>
          </div>
        </div>

        {/* 7. Total Inquiries */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <span className={styles.cardLabel}>Total Inquiries</span>
            <span className={`${styles.deltaPill} ${inquiries.isPositive ? styles.deltaPositive : styles.deltaNegative}`}>
              {inquiries.change}
            </span>
          </div>
          <div className={styles.cardBody}>
            <span className={styles.mainNumber}>{inquiries.value}</span>
          </div>
          <div className={styles.cardFooter}>
            <span className={styles.comparisonText}>Submissions + Booked Calls</span>
          </div>
        </div>

        {/* 8. Conversion Rate */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <span className={styles.cardLabel}>Conversion Rate</span>
            <span className={`${styles.deltaPill} ${conversionRate.isPositive ? styles.deltaPositive : styles.deltaNegative}`}>
              {conversionRate.change}
            </span>
          </div>
          <div className={styles.cardBody}>
            <span className={styles.mainNumber}>{conversionRate.value}</span>
          </div>
          <div className={styles.cardFooter}>
            <span className={styles.comparisonText}>Agency lead conversion</span>
          </div>
        </div>
      </div>
    </section>
  );
}
