"use client";

import { useState, useEffect, useCallback } from "react";
import styles from "./PartnerTrackersCard.module.css";

// Helper: Convert ISO 2-letter country code to flag emoji
function getCountryFlag(countryCode) {
  if (!countryCode || typeof countryCode !== "string" || countryCode.length !== 2) {
    return "🌐";
  }
  const code = countryCode.toUpperCase();
  if (code === "UN" || code === "XX" || code === "T1") return "🌐";
  try {
    const codePoints = code
      .split("")
      .map((char) => 127397 + char.charCodeAt(0));
    return String.fromCodePoint(...codePoints);
  } catch {
    return "🌐";
  }
}

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (e) {
      console.error("Clipboard copy failed:", e);
    }
  };

  return (
    <button
      type="button"
      className={`${styles.copyBtn} ${copied ? styles.copyBtnSuccess : ""}`}
      onClick={handleCopy}
      title="Copy tracking link to clipboard"
    >
      {copied ? (
        <>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <span>Copied!</span>
        </>
      ) : (
        <>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
          </svg>
          <span>Copy Link</span>
        </>
      )}
    </button>
  );
}

function PartnerIcon({ id }) {
  if (id === "rng_gamez") {
    return (
      <div className={`${styles.iconCircle} ${styles.iconRng}`}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="6" y1="12" x2="10" y2="12" />
          <line x1="8" y1="10" x2="8" y2="14" />
          <line x1="15" y1="13" x2="15.01" y2="13" />
          <line x1="18" y1="11" x2="18.01" y2="11" />
          <rect x="2" y="6" width="20" height="12" rx="6" />
        </svg>
      </div>
    );
  }

  // Murakkaz / Client Credit
  return (
    <div className={`${styles.iconCircle} ${styles.iconMurakkaz}`}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <polyline points="9 12 11 14 15 10" />
      </svg>
    </div>
  );
}

// ========================================================
// VISITOR DETAIL DRAWER (Inspection Panel)
// ========================================================
function VisitorDrawer({ visitor, tracker, onClose }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!visitor) return null;

  const isRng = tracker.id === "rng_gamez";
  const flag = getCountryFlag(visitor.countryCode);

  return (
    <div className={styles.drawerOverlay} onClick={onClose}>
      <div className={styles.drawer} onClick={(e) => e.stopPropagation()}>
        {/* Drawer Header */}
        <div className={styles.drawerHeader}>
          <div>
            <div className={styles.drawerTitleRow}>
              <h3 className={styles.drawerTitle}>{visitor.visitorLabel}</h3>
              <span className={`${styles.categoryBadge} ${isRng ? styles.rngBadge : styles.murakkazBadge}`}>
                {tracker.name} Inbound
              </span>
              {visitor.isCurrentlyActive ? (
                <span className={styles.liveNowPill}>
                  <span className={styles.livePulseDot} />
                  ACTIVE NOW
                </span>
              ) : (
                <span className={styles.lastSeenBadge}>
                  {visitor.lastSeenFormatted}
                </span>
              )}
            </div>
            <p className={styles.drawerSubtitle}>
              {visitor.sessionsCount} {visitor.sessionsCount === 1 ? "Session" : "Sessions"} · {visitor.pageviewsCount} Pageviews · {visitor.totalDurationFormatted} Dwell Time
            </p>
          </div>
          <button
            type="button"
            className={styles.drawerCloseBtn}
            onClick={onClose}
            aria-label="Close visitor inspection"
          >
            ✕
          </button>
        </div>

        {/* Metadata Chips / Cards Grid */}
        <div className={styles.drawerMetaGrid}>
          <div className={styles.metaCard}>
            <span className={styles.metaCardLabel}>Location</span>
            <span className={styles.metaCardVal}>
              {flag} {visitor.country !== "Unknown" ? visitor.country : "Undetected Location"}
              {visitor.city ? ` (${visitor.city})` : ""}
            </span>
          </div>

          <div className={styles.metaCard}>
            <span className={styles.metaCardLabel}>Device & OS</span>
            <span className={styles.metaCardVal}>
              {visitor.device ? visitor.device.charAt(0).toUpperCase() + visitor.device.slice(1) : "Desktop"} · {visitor.os}
            </span>
          </div>

          <div className={styles.metaCard}>
            <span className={styles.metaCardLabel}>Browser</span>
            <span className={styles.metaCardVal}>
              {visitor.browser || "Unknown"}
            </span>
          </div>

          <div className={styles.metaCard}>
            <span className={styles.metaCardLabel}>Screen & Lang</span>
            <span className={styles.metaCardVal}>
              {visitor.screenResolution || "—"} · {visitor.language || "en"}
            </span>
          </div>

          <div className={styles.metaCard}>
            <span className={styles.metaCardLabel}>Landing Page</span>
            <span className={`${styles.metaCardVal} ${styles.monoText}`} title={visitor.landingPage}>
              {visitor.landingPage}
            </span>
          </div>

          <div className={styles.metaCard}>
            <span className={styles.metaCardLabel}>Conversion Status</span>
            <span className={visitor.hasConverted ? styles.metaConverted : styles.metaCardVal}>
              {visitor.hasConverted ? "✓ Converted Lead" : "Browsing / Prospect"}
            </span>
          </div>
        </div>

        {/* Timeline Header */}
        <div className={styles.timelineHeader}>
          <h4 className={styles.timelineTitle}>Session Journey Timeline</h4>
          <span className={styles.timelineCount}>{visitor.journey?.length || 0} Events Recorded</span>
        </div>

        {/* Chronological Journey Timeline */}
        <div className={styles.timelineList}>
          {visitor.journey && visitor.journey.length > 0 ? (
            visitor.journey.map((step, idx) => {
              const isLast = idx === visitor.journey.length - 1;
              const formattedTime = step.timestamp
                ? new Date(step.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })
                : "—";

              return (
                <div key={step.id || idx} className={`${styles.timelineStep} ${step.isConversion ? styles.stepConversion : ""}`}>
                  <div className={styles.timelineTrack}>
                    <div className={`${styles.timelineDot} ${step.isConversion ? styles.dotConversion : ""}`}>
                      {step.isConversion ? "★" : ""}
                    </div>
                    {!isLast && <div className={styles.timelineLine} />}
                  </div>

                  <div className={styles.timelineBody}>
                    <div className={styles.stepTopRow}>
                      <span className={`${styles.stepBadge} ${step.isConversion ? styles.badgeConversion : ""}`}>
                        {step.badge || "ACTION"}
                      </span>
                      <span className={styles.stepTime}>{formattedTime}</span>
                    </div>

                    <div className={styles.stepTitle}>{step.title}</div>
                    {step.subtitle && <div className={styles.stepSubtitle}>{step.subtitle}</div>}

                    {step.path && (
                      <div className={styles.stepPath}>
                        <code>{step.path}</code>
                        {step.dwellSeconds && (
                          <span className={styles.stepDwell}>· {step.dwellSeconds}s</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className={styles.emptyNotice}>
              No chronological telemetry events recorded yet for this visitor.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ========================================================
// LIVE VISITORS STRIP (Real-time active visitors)
// ========================================================
function LiveVisitorsStrip({ liveVisitors = [], tracker, onSelectVisitor }) {
  const isRng = tracker.id === "rng_gamez";

  if (!liveVisitors || liveVisitors.length === 0) {
    return (
      <div className={styles.liveStandbyBox}>
        <div className={styles.standbyLeft}>
          <span className={styles.standbyDot} />
          <span className={styles.standbyText}>
            No live visitors from <strong>{tracker.name}</strong> right now. Telemetry listener is on standby.
          </span>
        </div>
        <span className={styles.standbyHint}>Last checked: Just now (5m window)</span>
      </div>
    );
  }

  return (
    <div className={styles.liveActiveSection}>
      <div className={styles.liveActiveHeader}>
        <div className={styles.liveActiveTitleRow}>
          <span className={styles.liveActivePulse} />
          <h4 className={styles.liveActiveTitle}>
            Live Right Now ({liveVisitors.length} {liveVisitors.length === 1 ? "Visitor" : "Visitors"} from {tracker.name})
          </h4>
        </div>
        <span className={styles.liveActiveSub}>Click any active visitor to inspect their live journey</span>
      </div>

      <div className={styles.liveCardsGrid}>
        {liveVisitors.map((v) => {
          const flag = getCountryFlag(v.countryCode);
          return (
            <div
              key={v.visitorId}
              className={`${styles.liveCard} ${isRng ? styles.liveCardRng : styles.liveCardMurakkaz}`}
              onClick={() => onSelectVisitor(v)}
              role="button"
              tabIndex={0}
            >
              <div className={styles.liveCardTop}>
                <span className={styles.liveCardId}>{v.visitorLabel}</span>
                <span className={styles.liveCardTimeAgo}>{v.activeTimeAgo}</span>
              </div>

              <div className={styles.liveCardViewing}>
                <span className={styles.viewingLabel}>Viewing:</span>
                <span className={styles.viewingPath}>{v.currentViewingPage || "/"}</span>
              </div>

              <div className={styles.liveCardMeta}>
                <span>{flag} {v.country !== "Unknown" ? v.country : "Global"}</span>
                <span>·</span>
                <span>{v.device}</span>
                <span>·</span>
                <span className={styles.inspectHint}>Inspect Journey →</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ========================================================
// PAGE ACTIVITY TABLE
// ========================================================
function PageActivityTable({ pageActivity = [], partnerName }) {
  if (!pageActivity || pageActivity.length === 0) {
    return (
      <div className={styles.emptyNotice}>
        No page telemetry recorded for {partnerName} yet. Share or test the tracking link above.
      </div>
    );
  }

  return (
    <div className={styles.tableResponsive}>
      <table className={styles.dataTable}>
        <thead>
          <tr>
            <th>Page Path</th>
            <th>Total Views</th>
            <th>Unique Visitors</th>
            <th>Avg. Dwell Time</th>
            <th>Avg. Scroll Depth</th>
            <th>Exit Rate</th>
          </tr>
        </thead>
        <tbody>
          {pageActivity.map((pg, idx) => (
            <tr key={idx}>
              <td className={styles.monoCell}>
                <strong>{pg.path}</strong>
              </td>
              <td>{pg.views.toLocaleString()}</td>
              <td>{pg.uniqueVisitors.toLocaleString()}</td>
              <td>{pg.avgDurationFormatted}</td>
              <td>
                <span className={styles.metricBadge}>{pg.avgScrollDepth}</span>
              </td>
              <td>{pg.exitRate}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ========================================================
// COUNTRY ANALYTICS VIEW
// ========================================================
function CountryAnalyticsView({ countryAnalytics = [], partnerName }) {
  if (!countryAnalytics || countryAnalytics.length === 0) {
    return (
      <div className={styles.emptyNotice}>
        No geographic traffic records recorded for {partnerName} yet.
      </div>
    );
  }

  return (
    <div className={styles.countrySection}>
      <div className={styles.countryGrid}>
        {countryAnalytics.map((c, idx) => {
          const flag = getCountryFlag(c.countryCode);
          return (
            <div key={idx} className={styles.countryCard}>
              <div className={styles.countryHeader}>
                <span className={styles.countryFlag}>{flag}</span>
                <div>
                  <h5 className={styles.countryName}>{c.country}</h5>
                  <span className={styles.countryShare}>{c.percentage} of referral traffic</span>
                </div>
              </div>

              <div className={styles.countryStatsGrid}>
                <div className={styles.countryStatItem}>
                  <span className={styles.statLabel}>Visitors</span>
                  <span className={styles.statVal}>{c.visitors.toLocaleString()}</span>
                </div>
                <div className={styles.countryStatItem}>
                  <span className={styles.statLabel}>Sessions</span>
                  <span className={styles.statVal}>{c.sessions.toLocaleString()}</span>
                </div>
                <div className={styles.countryStatItem}>
                  <span className={styles.statLabel}>Pageviews</span>
                  <span className={styles.statVal}>{c.pageviews.toLocaleString()}</span>
                </div>
                <div className={styles.countryStatItem}>
                  <span className={styles.statLabel}>Avg. Dwell</span>
                  <span className={styles.statVal}>{c.avgDurationFormatted}</span>
                </div>
              </div>

              {c.topPages && c.topPages.length > 0 && (
                <div className={styles.countryTopPages}>
                  <span className={styles.topPagesLabel}>Top Pages:</span>
                  <div className={styles.topPagesPills}>
                    {c.topPages.map((p, pIdx) => (
                      <span key={pIdx} className={styles.smallPill}>
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ========================================================
// DEVICE & TECHNOLOGY VIEW
// ========================================================
function DeviceAnalyticsView({ deviceAnalytics = {}, partnerName }) {
  if (!deviceAnalytics || (!deviceAnalytics.desktop && !deviceAnalytics.mobile)) {
    return (
      <div className={styles.emptyNotice}>
        No device telemetry recorded for {partnerName} yet.
      </div>
    );
  }

  const { desktop, mobile, tablet, browsers = [], operatingSystems = [] } = deviceAnalytics;

  return (
    <div className={styles.techSection}>
      {/* 1. Device Categories Split */}
      <div className={styles.techCol}>
        <h5 className={styles.techSubheading}>Device Categories</h5>
        <div className={styles.deviceRow}>
          <div className={styles.devBox}>
            <span className={styles.devType}>Desktop</span>
            <span className={styles.devCount}>{desktop?.count || 0} visits</span>
            <span className={styles.devPct}>{desktop?.percentage || "0.0%"}</span>
          </div>

          <div className={styles.devBox}>
            <span className={styles.devType}>Mobile</span>
            <span className={styles.devCount}>{mobile?.count || 0} visits</span>
            <span className={styles.devPct}>{mobile?.percentage || "0.0%"}</span>
          </div>

          <div className={styles.devBox}>
            <span className={styles.devType}>Tablet</span>
            <span className={styles.devCount}>{tablet?.count || 0} visits</span>
            <span className={styles.devPct}>{tablet?.percentage || "0.0%"}</span>
          </div>
        </div>
      </div>

      {/* 2. Top Browsers & Operating Systems */}
      <div className={styles.techSplitCols}>
        <div className={styles.techCol}>
          <h5 className={styles.techSubheading}>Top Browsers</h5>
          <div className={styles.techList}>
            {browsers.length > 0 ? (
              browsers.slice(0, 5).map((b, idx) => (
                <div key={idx} className={styles.techListItem}>
                  <span className={styles.techName}>{b.name}</span>
                  <span className={styles.techCount}>
                    {b.count} ({b.percentage})
                  </span>
                </div>
              ))
            ) : (
              <span className={styles.emptyNotice}>No browser data</span>
            )}
          </div>
        </div>

        <div className={styles.techCol}>
          <h5 className={styles.techSubheading}>Operating Systems</h5>
          <div className={styles.techList}>
            {operatingSystems.length > 0 ? (
              operatingSystems.slice(0, 5).map((os, idx) => (
                <div key={idx} className={styles.techListItem}>
                  <span className={styles.techName}>{os.name}</span>
                  <span className={styles.techCount}>
                    {os.count} ({os.percentage})
                  </span>
                </div>
              ))
            ) : (
              <span className={styles.emptyNotice}>No OS data</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ========================================================
// RECENT ACTIVITY VIEW
// ========================================================
function RecentActivityView({ recentActivity = [], partnerName, onSelectVisitor }) {
  if (!recentActivity || recentActivity.length === 0) {
    return (
      <div className={styles.emptyNotice}>
        No recent activity stream for {partnerName} yet.
      </div>
    );
  }

  return (
    <div className={styles.activityStream}>
      {recentActivity.map((item, idx) => (
        <div key={item.id || idx} className={`${styles.streamItem} ${item.isConversion ? styles.streamConversion : ""}`}>
          <div className={styles.streamLeft}>
            <span className={`${styles.streamBadge} ${item.isConversion ? styles.badgeConversion : ""}`}>
              {item.badge}
            </span>
            <div className={styles.streamInfo}>
              <span className={styles.streamTitle}>{item.title}</span>
              {item.path && <span className={styles.streamPath}>{item.path}</span>}
            </div>
          </div>

          <div className={styles.streamRight}>
            <button
              type="button"
              className={styles.streamVisitorLink}
              onClick={() => onSelectVisitor({ visitorId: item.visitorId })}
              title="Inspect complete journey of this visitor"
            >
              {item.visitorLabel}
            </button>
            <span className={styles.streamTime}>{item.timeAgo}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

// ========================================================
// ALL VISITORS DIRECTORY
// ========================================================
function VisitorsDirectoryView({ visitors = [], partnerName, onSelectVisitor }) {
  if (!visitors || visitors.length === 0) {
    return (
      <div className={styles.emptyNotice}>
        No attributed visitors found for {partnerName} in this date range.
      </div>
    );
  }

  return (
    <div className={styles.directoryGrid}>
      {visitors.map((v) => {
        const flag = getCountryFlag(v.countryCode);
        return (
          <div
            key={v.visitorId}
            className={styles.visitorCard}
            onClick={() => onSelectVisitor(v)}
            role="button"
            tabIndex={0}
          >
            <div className={styles.vCardTop}>
              <div className={styles.vCardIdRow}>
                <span className={styles.vCardId}>{v.visitorLabel}</span>
                {v.isCurrentlyActive ? (
                  <span className={styles.liveNowPill}>
                    <span className={styles.livePulseDot} />
                    LIVE
                  </span>
                ) : (
                  <span className={styles.vCardTimeAgo}>{v.activeTimeAgo}</span>
                )}
              </div>
              <span className={v.hasConverted ? styles.metaConverted : styles.vCardStatus}>
                {v.hasConverted ? "✓ Converted" : "Visitor"}
              </span>
            </div>

            <div className={styles.vCardBody}>
              <div className={styles.vCardLine}>
                <span className={styles.vCardLineLabel}>Geo:</span>
                <span>{flag} {v.country}</span>
              </div>
              <div className={styles.vCardLine}>
                <span className={styles.vCardLineLabel}>Device:</span>
                <span>{v.device} · {v.browser}</span>
              </div>
              <div className={styles.vCardLine}>
                <span className={styles.vCardLineLabel}>Landing:</span>
                <span className={styles.monoText}>{v.landingPage}</span>
              </div>
              <div className={styles.vCardLine}>
                <span className={styles.vCardLineLabel}>Dwell:</span>
                <span>{v.totalDurationFormatted} ({v.pageviewsCount} views)</span>
              </div>
            </div>

            <div className={styles.vCardAction}>
              <span>Inspect Step-by-Step Journey</span>
              <span>→</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ========================================================
// SINGLE PARTNER SECTION (RNG Gamez or Murakkaz)
// ========================================================
function SinglePartnerSection({ tracker }) {
  const isRng = tracker.id === "rng_gamez";
  const [activeTab, setActiveTab] = useState("activity"); // "activity" | "pages" | "countries" | "tech" | "visitors"
  const [selectedVisitor, setSelectedVisitor] = useState(null);

  // Helper to open visitor drawer by visitorId if only partial object passed
  const handleSelectVisitor = useCallback((target) => {
    if (!target) return;
    if (target.journey) {
      setSelectedVisitor(target);
    } else if (target.visitorId && tracker.allVisitorsList) {
      const full = tracker.allVisitorsList.find((v) => v.visitorId === target.visitorId);
      if (full) setSelectedVisitor(full);
    }
  }, [tracker.allVisitorsList]);

  return (
    <div className={`${styles.trackerCard} ${isRng ? styles.rngBorder : styles.murakkazBorder}`}>
      {/* 1. Header with Name, Domain, Category and Live Pulse */}
      <div className={styles.sectionHeader}>
        <div className={styles.headerLeft}>
          <PartnerIcon id={tracker.id} />
          <div>
            <div className={styles.titleRow}>
              <h3 className={styles.partnerName}>{tracker.name}</h3>
              <span className={`${styles.categoryBadge} ${isRng ? styles.rngBadge : styles.murakkazBadge}`}>
                {tracker.badgeText}
              </span>
            </div>
            <p className={styles.partnerDesc}>{tracker.description}</p>
          </div>
        </div>

        <div className={styles.headerRight}>
          {tracker.isLive ? (
            <span className={styles.liveNowPill}>
              <span className={styles.livePulseDot} />
              LIVE VISITOR
            </span>
          ) : (
            <span className={styles.trackingActivePill}>
              <span className={styles.idleDot} />
              TELEMETRY ACTIVE
            </span>
          )}
        </div>
      </div>

      {/* 2. Tracking URL Bar with One-Click Copy */}
      <div className={styles.urlBar}>
        <div className={styles.urlLeft}>
          <span className={styles.urlLabel}>Tracking URL:</span>
          <span className={styles.urlText} title={tracker.trackingUrl}>
            {tracker.trackingUrl}
          </span>
        </div>
        <div className={styles.urlActions}>
          <CopyButton text={tracker.trackingUrl} />
          <a
            href={tracker.trackingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.testLinkBtn}
            title="Open tracking link in new tab to test telemetry"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
            <span>Test Link</span>
          </a>
        </div>
      </div>

      {/* 3. Four Core Metric Counter Cards */}
      <div className={styles.kpiGrid}>
        {/* Metric 1: Visitors */}
        <div className={styles.kpiBox}>
          <span className={styles.kpiLabel}>Unique Visitors</span>
          <div className={styles.kpiNumberRow}>
            <span className={styles.kpiNumber}>{tracker.visitors.toLocaleString()}</span>
            <span className={styles.kpiSub}>people</span>
          </div>
          <span className={styles.kpiFootnote}>Attributed to this link</span>
        </div>

        {/* Metric 2: Sessions */}
        <div className={styles.kpiBox}>
          <span className={styles.kpiLabel}>Total Sessions</span>
          <div className={styles.kpiNumberRow}>
            <span className={styles.kpiNumber}>{tracker.sessions.toLocaleString()}</span>
            <span className={styles.kpiSub}>visits</span>
          </div>
          <span className={styles.kpiFootnote}>Legitimate browsing visits</span>
        </div>

        {/* Metric 3: Pageviews */}
        <div className={styles.kpiBox}>
          <span className={styles.kpiLabel}>Total Pageviews</span>
          <div className={styles.kpiNumberRow}>
            <span className={styles.kpiNumber}>{tracker.pageviews.toLocaleString()}</span>
            <span className={styles.kpiSub}>views</span>
          </div>
          <span className={styles.kpiFootnote}>Pages explored on Aeethod</span>
        </div>

        {/* Metric 4: Avg Dwell Time */}
        <div className={styles.kpiBox}>
          <span className={styles.kpiLabel}>Avg. Dwell Time</span>
          <div className={styles.kpiNumberRow}>
            <span className={styles.kpiNumber}>{tracker.avgDurationFormatted}</span>
          </div>
          <span className={styles.kpiFootnote}>Time spent exploring</span>
        </div>
      </div>

      {/* 4. Secondary Engagement & Conversion Badges */}
      <div className={styles.secondaryRow}>
        <div className={styles.secItem}>
          <span className={styles.secLabel}>Conversions / Inquiries</span>
          <span className={styles.secValueBold}>{tracker.conversions} leads ({tracker.conversionRate})</span>
        </div>

        <div className={styles.secDivider} />

        <div className={styles.secItem}>
          <span className={styles.secLabel}>Bounce Rate</span>
          <span className={styles.secValue}>{tracker.bounceRate}</span>
        </div>

        <div className={styles.secDivider} />

        <div className={styles.secItem}>
          <span className={styles.secLabel}>Device Mix</span>
          <span className={styles.secValue}>
            {tracker.devices.desktop} Desktop · {tracker.devices.mobile} Mobile
          </span>
        </div>

        <div className={styles.secDivider} />

        <div className={styles.secItem}>
          <span className={styles.secLabel}>Latest Inbound Activity</span>
          <span className={styles.secValue}>
            {tracker.latestActivity
              ? new Date(tracker.latestActivity).toLocaleString(undefined, {
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "No visits in this period"}
          </span>
        </div>
      </div>

      {/* 5. Top Visited Pages Pills */}
      <div className={styles.pagesSection}>
        <span className={styles.pagesHeading}>Top Explored Pages by {tracker.name} Visitors:</span>
        {tracker.topPages && tracker.topPages.length > 0 ? (
          <div className={styles.pagePillsList}>
            {tracker.topPages.map((pg, idx) => (
              <span key={idx} className={styles.pagePill}>
                <span className={styles.pagePath}>{pg.path}</span>
                <span className={styles.pageViewsBadge}>{pg.views} {pg.views === 1 ? "view" : "views"}</span>
              </span>
            ))}
          </div>
        ) : (
          <span className={styles.noPagesNotice}>
            No inbound visits recorded in this range. Share or click the tracking link above to record telemetry.
          </span>
        )}
      </div>

      {/* 6. EXPANDED: LIVE NOW VISITOR STRIP */}
      <LiveVisitorsStrip
        liveVisitors={tracker.liveVisitors || []}
        tracker={tracker}
        onSelectVisitor={handleSelectVisitor}
      />

      {/* 7. EXPANDED: ANALYTICS SUB-TABS */}
      <div className={styles.expandedWrapper}>
        <div className={styles.subTabsNav}>
          <button
            type="button"
            className={`${styles.subTabBtn} ${activeTab === "activity" ? styles.subTabBtnActive : ""}`}
            onClick={() => setActiveTab("activity")}
          >
            ⚡ Recent Activity
          </button>
          <button
            type="button"
            className={`${styles.subTabBtn} ${activeTab === "pages" ? styles.subTabBtnActive : ""}`}
            onClick={() => setActiveTab("pages")}
          >
            📄 Page Activity ({tracker.pageActivity?.length || 0})
          </button>
          <button
            type="button"
            className={`${styles.subTabBtn} ${activeTab === "countries" ? styles.subTabBtnActive : ""}`}
            onClick={() => setActiveTab("countries")}
          >
            🌍 Geography ({tracker.countryAnalytics?.length || 0})
          </button>
          <button
            type="button"
            className={`${styles.subTabBtn} ${activeTab === "tech" ? styles.subTabBtnActive : ""}`}
            onClick={() => setActiveTab("tech")}
          >
            💻 Devices & Tech
          </button>
          <button
            type="button"
            className={`${styles.subTabBtn} ${activeTab === "visitors" ? styles.subTabBtnActive : ""}`}
            onClick={() => setActiveTab("visitors")}
          >
            👥 Visitors Directory ({tracker.allVisitorsList?.length || 0})
          </button>
        </div>

        {/* Tab Content Panels */}
        <div className={styles.subTabContent}>
          {activeTab === "activity" && (
            <RecentActivityView
              recentActivity={tracker.recentActivity || []}
              partnerName={tracker.name}
              onSelectVisitor={handleSelectVisitor}
            />
          )}

          {activeTab === "pages" && (
            <PageActivityTable
              pageActivity={tracker.pageActivity || []}
              partnerName={tracker.name}
            />
          )}

          {activeTab === "countries" && (
            <CountryAnalyticsView
              countryAnalytics={tracker.countryAnalytics || []}
              partnerName={tracker.name}
            />
          )}

          {activeTab === "tech" && (
            <DeviceAnalyticsView
              deviceAnalytics={tracker.deviceAnalytics || {}}
              partnerName={tracker.name}
            />
          )}

          {activeTab === "visitors" && (
            <VisitorsDirectoryView
              visitors={tracker.allVisitorsList || []}
              partnerName={tracker.name}
              onSelectVisitor={handleSelectVisitor}
            />
          )}
        </div>
      </div>

      {/* 8. Slide-Over Visitor Journey Inspection Drawer */}
      {selectedVisitor && (
        <VisitorDrawer
          visitor={selectedVisitor}
          tracker={tracker}
          onClose={() => setSelectedVisitor(null)}
        />
      )}
    </div>
  );
}

// ========================================================
// MAIN EXPORT: PartnerTrackersCard
// ========================================================
export default function PartnerTrackersCard({ trackers = [] }) {
  if (!trackers || trackers.length === 0) return null;

  const totalPartnerVisitors = trackers.reduce((sum, t) => sum + (t.visitors || 0), 0);
  const totalPartnerSessions = trackers.reduce((sum, t) => sum + (t.sessions || 0), 0);

  return (
    <div className={styles.wrapper}>
      {/* Container Header */}
      <div className={styles.mainHeader}>
        <div>
          <div className={styles.mainTitleRow}>
            <h2 className={styles.mainTitle}>Inbound Partner Link Trackers</h2>
            <span className={styles.liveIndicator}>
              <span className={styles.pulseDot} />
              Real-Time Tracking
            </span>
          </div>
          <p className={styles.mainSubtext}>
            Dedicated dual telemetry sections tracking visits, sessions, and conversions from <strong>RNG Gamez</strong> and <strong>Murakkaz</strong>.
          </p>
        </div>

        <div className={styles.aggregatePill}>
          <span>Total Partner Traffic:</span>
          <strong>{totalPartnerVisitors.toLocaleString()} visitors · {totalPartnerSessions.toLocaleString()} sessions</strong>
        </div>
      </div>

      {/* Two Dedicated Sections / Cards */}
      <div className={styles.trackersGrid}>
        {trackers.map((tracker) => (
          <SinglePartnerSection key={tracker.id} tracker={tracker} />
        ))}
      </div>
    </div>
  );
}
