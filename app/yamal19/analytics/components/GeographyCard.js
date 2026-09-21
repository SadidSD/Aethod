"use client";

import styles from "./GeographyCard.module.css";

export default function GeographyCard({ geography }) {
  if (!geography) return null;

  const { countries = [], cities = [] } = geography;
  const maxSessions = countries[0]?.sessions || 1;

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <div>
          <h2 className={styles.cardTitle}>Audience Geography</h2>
          <p className={styles.cardSubtext}>Global traffic origin by sovereign territory and major metro areas</p>
        </div>
        <span className={styles.countryCountBadge}>
          {countries.length} territories
        </span>
      </div>

      <div className={styles.geoGrid}>
        {/* Top Countries Column */}
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
                      {item.sessions.toLocaleString()}
                    </span>
                    <span className={styles.countryPct}>{item.percentage}%</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Top Cities Column */}
        <div className={styles.geoCol}>
          <div className={styles.colHeader}>Top Metros &amp; Hubs</div>
          <div className={styles.cityList}>
            {cities.length === 0 ? (
              <div style={{ padding: "32px 16px", textAlign: "center", color: "var(--color-text-secondary, #94A3B8)", fontSize: "0.8125rem" }}>
                No metro locations recorded for this period yet.
              </div>
            ) : (
              cities.map((cityItem, idx) => (
                <div key={cityItem.city} className={styles.cityRow}>
                  <div className={styles.cityRank}>0{idx + 1}</div>
                  <div className={styles.cityInfo}>
                    <span className={styles.cityName}>{cityItem.city}</span>
                    <span className={styles.cityCountry}>{cityItem.countryName || cityItem.country}</span>
                  </div>
                  <div className={styles.citySessions}>
                    <span className={styles.cityCount}>
                      {cityItem.sessions.toLocaleString()}
                    </span>
                    <span className={styles.cityUnit}>sessions</span>
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
