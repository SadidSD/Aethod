"use client";

import styles from "./Header.module.css";

const DATE_RANGES = [
  { id: "today", label: "Today" },
  { id: "yesterday", label: "Yesterday" },
  { id: "7d", label: "Last 7 Days" },
  { id: "30d", label: "Last 30 Days" },
  { id: "custom", label: "Custom Range" },
];

export default function Header({
  selectedRange,
  onRangeChange,
  customDates,
  onCustomDatesChange,
  isRefreshing,
  onRefresh,
  onToggleMobileMenu,
  lastUpdated,
}) {

  return (
    <header className={styles.header}>
      {/* Title & Subtitle Area */}
      <div className={styles.titleArea}>
        <div className={styles.mobileRow}>
          <button
            type="button"
            className={styles.hamburgerBtn}
            onClick={onToggleMobileMenu}
            aria-label="Open sidebar menu"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
          <div>
            <div className={styles.badgeRow}>
              <span className={styles.liveIndicator}>
                <span className={styles.pulseDot} />
                LIVE TELEMETRY
              </span>
              {lastUpdated && (
                <span className={styles.updatedAtText}>
                  Synced {lastUpdated}
                </span>
              )}
            </div>
            <h1 className={styles.pageHeading}>360° Analytics</h1>
          </div>
        </div>
        <p className={styles.pageSubtext}>
          Understand how visitors discover and interact with Aeethod.
        </p>
      </div>

      {/* Controls: Date Filter & Refresh */}
      <div className={styles.controlsArea}>
        {/* Date Range Selector Segmented Control */}
        <div className={styles.dateSegmentContainer} role="tablist" aria-label="Select Date Range">
          {DATE_RANGES.map((r) => {
            const isSelected = selectedRange === r.id;
            return (
              <button
                key={r.id}
                type="button"
                role="tab"
                aria-selected={isSelected}
                onClick={() => onRangeChange(r.id)}
                className={`${styles.dateSegmentBtn} ${
                  isSelected ? styles.dateSegmentActive : ""
                }`}
              >
                {r.label}
              </button>
            );
          })}
        </div>

        {/* Custom Date Inputs if 'custom' is active */}
        {selectedRange === "custom" && (

        <div className={styles.customDateWrapper}>
          <input
            type="date"
            className={styles.customDateInput}
            value={customDates?.from || ""}
            onChange={(e) => onCustomDatesChange?.({ ...customDates, from: e.target.value })}
            aria-label="Custom start date"
          />
          <span className={styles.dateSeparator}>to</span>
          <input
            type="date"
            className={styles.customDateInput}
            value={customDates?.to || ""}
            onChange={(e) => onCustomDatesChange?.({ ...customDates, to: e.target.value })}
            aria-label="Custom end date"
          />
        </div>
      )}

        {/* Refresh Button */}
        <button
          type="button"
          onClick={onRefresh}
          disabled={isRefreshing}
          className={`${styles.refreshBtn} ${
            isRefreshing ? styles.refreshing : ""
          }`}
          title="Refresh analytics telemetry"
          aria-label="Refresh analytics data"
        >
          <svg
            className={isRefreshing ? styles.spinningIcon : ""}
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="23 4 23 10 17 10" />
            <polyline points="1 20 1 14 7 14" />
            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
          </svg>
          <span className={styles.refreshBtnText}>
            {isRefreshing ? "Refreshing..." : "Refresh"}
          </span>
        </button>
      </div>
    </header>
  );
}
