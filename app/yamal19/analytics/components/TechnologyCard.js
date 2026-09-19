"use client";

import styles from "./TechnologyCard.module.css";

export default function TechnologyCard({ technology }) {
  if (!technology) return null;

  const { browsers = [], os = [] } = technology;

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <div>
          <h2 className={styles.cardTitle}>Technology</h2>
          <p className={styles.cardSubtext}>Client runtime engines and desktop/mobile operating environments</p>
        </div>
      </div>

      <div className={styles.techGrid}>
        {/* Browsers Subpanel */}
        <div className={styles.techCol}>
          <div className={styles.subHeadingRow}>
            <span className={styles.subHeading}>Browsers</span>
            <span className={styles.subHeadingTag}>Engine</span>
          </div>

          <div className={styles.techList}>
            {browsers.map((item) => (
              <div key={item.name} className={styles.techRow}>
                <div className={styles.techNameRow}>
                  <span className={styles.techName}>{item.name}</span>
                  <div className={styles.techNumbers}>
                    <span className={styles.techCount}>{item.count.toLocaleString()}</span>
                    <span className={styles.techPct}>{item.percentage}%</span>
                  </div>
                </div>
                <div className={styles.techTrack}>
                  <div
                    className={styles.techFill}
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Operating Systems Subpanel */}
        <div className={styles.techCol}>
          <div className={styles.subHeadingRow}>
            <span className={styles.subHeading}>Operating Systems</span>
            <span className={styles.subHeadingTag}>Kernel</span>
          </div>

          <div className={styles.techList}>
            {os.map((item) => (
              <div key={item.name} className={styles.techRow}>
                <div className={styles.techNameRow}>
                  <span className={styles.techName}>{item.name}</span>
                  <div className={styles.techNumbers}>
                    <span className={styles.techCount}>{item.count.toLocaleString()}</span>
                    <span className={styles.techPct}>{item.percentage}%</span>
                  </div>
                </div>
                <div className={styles.techTrack}>
                  <div
                    className={`${styles.techFill} ${styles.osFill}`}
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
