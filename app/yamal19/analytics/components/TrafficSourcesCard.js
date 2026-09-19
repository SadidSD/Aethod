"use client";

import styles from "./TrafficSourcesCard.module.css";

export default function TrafficSourcesCard({ sources = [] }) {
  if (!sources || sources.length === 0) return null;

  const total = sources.reduce((sum, s) => sum + s.count, 0);

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <div>
          <h2 className={styles.cardTitle}>Traffic Sources</h2>
          <p className={styles.cardSubtext}>Inbound acquisition channel distribution</p>
        </div>
        <span className={styles.totalBadge}>
          {total.toLocaleString()} sessions
        </span>
      </div>

      {/* Multi-segment stacked horizontal bar */}
      <div className={styles.stackedBar}>
        {sources.map((item) => (
          <div
            key={item.source}
            className={styles.barSegment}
            style={{
              width: `${item.percentage}%`,
              backgroundColor: item.color,
            }}
            title={`${item.source}: ${item.percentage}% (${item.count.toLocaleString()})`}
          />
        ))}
      </div>

      {/* Ranked source breakdown list */}
      <div className={styles.sourceList}>
        {sources.map((item) => (
          <div key={item.source} className={styles.sourceRow}>
            <div className={styles.sourceLeft}>
              <span
                className={styles.sourceColorIndicator}
                style={{ backgroundColor: item.color }}
              />
              <span className={styles.sourceName}>{item.source}</span>
            </div>

            <div className={styles.sourceRight}>
              <div className={styles.miniBarTrack}>
                <div
                  className={styles.miniBarFill}
                  style={{
                    width: `${sources[0]?.percentage > 0 ? (item.percentage / sources[0].percentage) * 100 : 0}%`,
                    backgroundColor: item.color,
                  }}

                />
              </div>
              <span className={styles.sourceCount}>
                {item.count.toLocaleString()}
              </span>
              <span className={styles.sourcePct}>{item.percentage}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
