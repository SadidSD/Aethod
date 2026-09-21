"use client";

import { useState, useEffect } from "react";
import styles from "./GeographyCard.module.css";

export default function GeographyCard({ geography }) {
  const [showDiagnostics, setShowDiagnostics] = useState(false);
  const [sessionList, setSessionList] = useState([]);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    if (geography?.diagnostics) {
      setSessionList(geography.diagnostics);
    }
  }, [geography?.diagnostics]);

  if (!geography) return null;

  const { countries = [], diagnostics = [] } = geography;
  const maxSessions = countries[0]?.sessions || 1;

  const handleClassificationChange = async (sessionId, newClassification) => {
    if (!sessionId || sessionId === "—") return;
    setUpdatingId(sessionId);

    // Optimistic UI update
    setSessionList((prev) =>
      prev.map((item) =>
        item.fullSessionId === sessionId
          ? {
              ...item,
              classification: newClassification,
              classificationLabel:
                newClassification === "bot"
                  ? "Bot (Excluded)"
                  : newClassification === "test"
                  ? "Test (Excluded)"
                  : "Legitimate",
              geoStatus:
                newClassification === "bot"
                  ? "Excluded (Bot)"
                  : newClassification === "test"
                  ? "Excluded (Test)"
                  : "Valid",
            }
          : item
      )
    );

    try {
      const res = await fetch("/api/admin/analytics/classify-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          classification: newClassification,
          reason: "Manual admin reclassification from audit log",
        }),
      });

      if (!res.ok) {
        console.error("Failed to reclassify session:", await res.text());
      }
    } catch (err) {
      console.error("Error reclassifying session:", err);
    } finally {
      setUpdatingId(null);
    }
  };

  const displayList = sessionList.length > 0 ? sessionList : diagnostics;
  const investigatedSessions = displayList.filter(
    (d) =>
      d.geoStatus === "Investigate" &&
      (!d.classification || d.classification === "human_or_unknown")
  );

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

      {/* Admin-Only Geo Diagnostics & Audit Log */}
      {displayList.length > 0 && (
        <div className={styles.diagSection}>
          <div className={styles.diagHeader}>
            <div className={styles.diagTitleWrapper}>
              <span className={styles.diagDot} />
              <span className={styles.diagTitle}>Geo Attribution Audit Log</span>
              <span className={styles.diagSubtitle}>Server IP Geolocation • Excluded Traffic Preserved</span>
            </div>
            <button
              type="button"
              className={styles.diagToggleBtn}
              onClick={() => setShowDiagnostics((prev) => !prev)}
            >
              {showDiagnostics ? "Hide Audit" : "Show Audit"} ({displayList.length})
            </button>
          </div>

          {showDiagnostics && (
            <div className={styles.diagBody}>
              {/* Detailed Forensic Audit Cards for Investigate / Excluded sessions */}
              {investigatedSessions.length > 0 && (
                <div className={styles.auditCardsWrapper}>
                  <div className={styles.auditCardsHeading}>Forensic Session & Classification Analysis</div>
                  <div className={styles.auditCardsGrid}>
                    {investigatedSessions.map((s, idx) => (
                      <div key={idx} className={styles.auditCard}>
                        <div className={styles.auditCardHeader}>
                          <span className={styles.auditCountryBadge}>
                            [{s.countryCode}] {s.country}
                          </span>
                          <span
                            className={
                              s.classification === "bot"
                                ? styles.statusBot
                                : s.classification === "test"
                                ? styles.statusTest
                                : s.geoStatus === "Investigate"
                                ? styles.statusInvestigate
                                : styles.statusValid
                            }
                          >
                            {s.classificationLabel || s.geoStatus}
                          </span>
                        </div>
                        <div className={styles.auditDetails}>
                          <div className={styles.auditRow}>
                            <span className={styles.auditLabel}>Session:</span>
                            <span className={styles.auditValCode}>{s.sessionId}</span>
                          </div>
                          <div className={styles.auditRow}>
                            <span className={styles.auditLabel}>Detected Country:</span>
                            <span className={styles.auditValBold}>{s.country}</span>
                          </div>
                          <div className={styles.auditRow}>
                            <span className={styles.auditLabel}>Classification:</span>
                            <select
                              className={styles.classificationSelect}
                              value={s.classification || "human_or_unknown"}
                              disabled={updatingId === s.fullSessionId}
                              onChange={(e) => handleClassificationChange(s.fullSessionId, e.target.value)}
                            >
                              <option value="human_or_unknown">Legitimate (Normal)</option>
                              <option value="bot">Bot (Exclude)</option>
                              <option value="test">Test (Exclude)</option>
                            </select>
                          </div>
                          <div className={styles.auditRow}>
                            <span className={styles.auditLabel}>Geo Provider:</span>
                            <span className={styles.auditVal}>{s.geoProvider}</span>
                          </div>
                          <div className={styles.auditRow}>
                            <span className={styles.auditLabel}>Detection Source:</span>
                            <span className={styles.auditVal}>{s.detectionSource}</span>
                          </div>
                          <div className={styles.auditRow}>
                            <span className={styles.auditLabel}>Confidence / Result:</span>
                            <span className={styles.auditValConfidence}>{s.confidence}</span>
                          </div>
                          <div className={styles.auditNoteRow}>
                            <span className={styles.auditNote}>{s.auditNote}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recent Sessions Table */}
              <div className={styles.tableWrapper}>
                <table className={styles.diagTable}>
                  <thead>
                    <tr>
                      <th>Time</th>
                      <th>Country</th>
                      <th>Source</th>
                      <th>Device</th>
                      <th>Browser</th>
                      <th>Classification</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayList.map((row, idx) => (
                      <tr
                        key={idx}
                        className={
                          row.classification === "bot"
                            ? styles.rowInvestigate
                            : row.classification === "test"
                            ? styles.rowInvestigate
                            : row.geoStatus === "Investigate"
                            ? styles.rowInvestigate
                            : ""
                        }
                      >
                        <td className={styles.tdTime}>{row.time}</td>
                        <td>
                          <span className={styles.tableCountry}>
                            <span className={styles.tableCodeBadge}>{row.countryCode}</span>
                            {row.country}
                          </span>
                        </td>
                        <td>{row.source}</td>
                        <td className={styles.tdCapitalize}>{row.device}</td>
                        <td>{row.browser}</td>
                        <td>
                          <span
                            className={
                              row.classification === "bot"
                                ? styles.statusBot
                                : row.classification === "test"
                                ? styles.statusTest
                                : row.geoStatus === "Investigate"
                                ? styles.statusInvestigate
                                : styles.statusValid
                            }
                          >
                            {row.classificationLabel || (row.geoStatus === "Valid" ? "Legitimate" : row.geoStatus)}
                          </span>
                        </td>
                        <td>
                          <select
                            className={styles.classificationSelect}
                            value={row.classification || "human_or_unknown"}
                            disabled={updatingId === row.fullSessionId}
                            onChange={(e) => handleClassificationChange(row.fullSessionId, e.target.value)}
                            title="Reclassify session traffic"
                          >
                            <option value="human_or_unknown">Legitimate</option>
                            <option value="bot">Bot (Exclude)</option>
                            <option value="test">Test (Exclude)</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
