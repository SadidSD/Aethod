"use client";

import styles from "./GeographyCard.module.css";

export default function GeographyCard({ geography }) {
  if (!geography) return null;

  const { countries = [] } = geography;
  const maxSessions = countries[0]?.sessions || 1;

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <div>
          <h2 className={styles.cardTitle}>Audience Geography</h2>
          <p className={styles.cardSubtext}>Global traffic origin by sovereign territory</p>
        </div>
        <span className={styles.countryCountBadge}>
          {countries.length} {countries.length === 1 ? "country" : "countries"}
        </span>
      </div>

      <div className={styles.geoGrid}>
        {/* Top Countries */}
        <div className={styles.geoCol}>
          <div className={styles.colHeader}>Top Countries</div>
          <div className={styles.countryList}>
            {countries.length === 0 ? (
              <div style={{ padding: "32px 16px", textAlign: "center", color: "var(--color-text-secondary, #94A3B8)", fontSize: "0.8125rem" }}>
                No country origins recorded for this period yet.
              </div>
            ) : (
              countries.map((item) => (
                <div key={item.country} className={styles.countryRow}>
                  <div className={styles.countryLeft}>
                    <span className={styles.countryCodeBadge}>{item.code}</span>
                    <span className={styles.countryName}>{item.country}</span>
                  </div>

                  <div className={styles.countryRight}>
                    <div className={styles.barTrack}>
                      <div
                        className={styles.barFill}
                        style={{ width: `${(item.sessions / maxSessions) * 100}%` }}
                      />
                    </div>
                    <span className={styles.countryCount}>
                      {item.sessions.toLocaleString()} {item.sessions === 1 ? "session" : "sessions"}
                    </span>
                    <span className={styles.countryPct}>{item.percentage}%</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
