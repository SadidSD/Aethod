"use client";

import styles from "./TopPagesTable.module.css";

export default function TopPagesTable({ pages = [] }) {
  if (!pages || pages.length === 0) {
    return (
      <div className={styles.tableCard}>
        <div className={styles.cardHeader}>
          <div>
            <h2 className={styles.cardTitle}>Top Pages</h2>
            <p className={styles.cardSubtext}>Highest velocity routes, engagement dwell times, and audience volume</p>
          </div>
          <span className={styles.totalBadge}>0 active routes</span>
        </div>
        <div style={{ padding: "48px 24px", textAlign: "center", color: "var(--color-text-secondary, #94A3B8)", fontSize: "0.875rem" }}>
          No pageviews recorded yet for this period. Visited routes will populate here automatically.
        </div>
      </div>
    );
  }

  const maxViews = Math.max(...pages.map((p) => p.views), 1);


  return (
    <div className={styles.tableCard}>
      <div className={styles.cardHeader}>
        <div>
          <h2 className={styles.cardTitle}>Top Pages</h2>
          <p className={styles.cardSubtext}>Highest velocity routes, engagement dwell times, and audience volume</p>
        </div>
        <span className={styles.totalBadge}>
          {pages.length} active routes
        </span>
      </div>

      <div className={styles.tableScrollWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.thPage}>Page Route</th>
              <th className={styles.thViews}>Pageviews</th>
              <th className={styles.thUnique}>Unique Visitors</th>
              <th className={styles.thTime}>Avg. Dwell Time</th>
            </tr>
          </thead>
          <tbody>
            {pages.map((page, idx) => {
              const relativeBarPct = (page.views / maxViews) * 100;
              return (
                <tr key={idx} className={styles.tr}>
                  {/* Page Route */}
                  <td className={styles.tdPage}>
                    <div className={styles.pageTitleMeta}>
                      <span className={styles.pageTitleText}>{page.title}</span>
                      <span className={styles.pathBadge}>{page.path}</span>
                    </div>
                  </td>

                  {/* Views + Relative Mini Bar */}
                  <td className={styles.tdViews}>
                    <div className={styles.viewsCell}>
                      <span className={styles.viewsCount}>
                        {page.views.toLocaleString()}
                      </span>
                      <div className={styles.viewBarTrack}>
                        <div
                          className={styles.viewBarFill}
                          style={{ width: `${relativeBarPct}%` }}
                        />
                      </div>
                    </div>
                  </td>

                  {/* Unique Visitors */}
                  <td className={styles.tdUnique}>
                    <span className={styles.uniqueCount}>
                      {page.uniqueVisitors.toLocaleString()}
                    </span>
                  </td>

                  {/* Avg. Time */}
                  <td className={styles.tdTime}>
                    <span className={styles.dwellTimePill}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                      </svg>
                      {page.avgTime}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
