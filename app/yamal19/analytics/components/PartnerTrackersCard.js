"use client";

import { useState } from "react";
import styles from "./PartnerTrackersCard.module.css";

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

function SinglePartnerSection({ tracker }) {
  const isRng = tracker.id === "rng_gamez";

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
    </div>
  );
}

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
