"use client";

import styles from "./FunnelChart.module.css";

export default function FunnelChart({ funnel = [] }) {
  if (!funnel || funnel.length === 0) return null;

  return (
    <div className={styles.funnelCard}>
      <div className={styles.cardHeader}>
        <div>
          <h2 className={styles.cardTitle}>Agency Conversion Funnel</h2>
          <p className={styles.cardSubtext}>
            End-to-end client qualification progression from initial visit to consultation booking
          </p>
        </div>
        <div className={styles.funnelBadge}>
          Lead Pipeline
        </div>
      </div>

      <div className={styles.funnelContainer}>
        {funnel.map((step, idx) => {
          const isFirst = idx === 0;
          const isLast = idx === funnel.length - 1;
          const prevStep = idx > 0 ? funnel[idx - 1] : null;

          // Drop-off percentage from previous stage (guarded against division by zero)
          const dropoffPct = prevStep
            ? (prevStep.count > 0
                ? (((prevStep.count - step.count) / prevStep.count) * 100).toFixed(1)
                : (step.dropoff !== null && step.dropoff !== undefined ? step.dropoff : "0.0"))
            : null;


          return (
            <div key={idx} className={styles.stepBlock}>
              {/* Drop-off connector pill between stages */}
              {!isFirst && (
                <div className={styles.dropoffConnector}>
                  <div className={styles.connectorLine} />
                  <span className={styles.dropoffBadge}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <line x1="12" y1="5" x2="12" y2="19" />
                      <polyline points="19 12 12 19 5 12" />
                    </svg>
                    -{dropoffPct}% drop-off
                  </span>
                </div>
              )}

              {/* Stage Card */}
              <div className={`${styles.stageCard} ${isLast ? styles.finalStage : ""}`}>
                <div className={styles.stageTop}>
                  <div className={styles.stageTitleRow}>
                    <span className={styles.stageIndex}>0{idx + 1}</span>
                    <span className={styles.stageName}>{step.stage}</span>
                  </div>
                  <div className={styles.stageStats}>
                    <span className={styles.stageCount}>{step.count.toLocaleString()}</span>
                    <span className={styles.stagePercentage}>({step.percentage}%)</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className={styles.progressBarWrapper}>
                  <div
                    className={`${styles.progressBarFill} ${
                      isLast ? styles.finalProgressFill : ""
                    }`}
                    style={{ width: `${Math.max(step.percentage, 2)}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary Insights Row */}
      <div className={styles.funnelFooter}>
        <div className={styles.insightItem}>
          <span className={styles.insightLabel}>Overall Funnel Yield</span>
          <span className={styles.insightValue}>
            {funnel[funnel.length - 1]?.percentage ?? 0}%
          </span>
        </div>
        <div className={styles.insightDivider} />
        <div className={styles.insightItem}>
          <span className={styles.insightLabel}>Exploration Rate</span>
          <span className={styles.insightValue}>
            {funnel[1]?.percentage ?? 0}%
          </span>
        </div>
        <div className={styles.insightDivider} />
        <div className={styles.insightItem}>
          <span className={styles.insightLabel}>Contact Initiation</span>
          <span className={styles.insightValue}>
            {funnel[2]?.percentage ?? 0}%
          </span>
        </div>

      </div>
    </div>
  );
}
