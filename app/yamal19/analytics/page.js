"use client";

import { useState, useEffect, useTransition, useCallback } from "react";
import styles from "./page.module.css";
import { useTheme } from "../../context/ThemeContext";
import { fetchAdminAnalytics, fetchLiveVisitorsCount } from "@/lib/analytics/clientAnalytics";

// Modular Dashboard Components
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import MetricCards from "./components/MetricCards";
import TrafficChart from "./components/TrafficChart";
import FunnelChart from "./components/FunnelChart";
import DeviceDonut from "./components/DeviceDonut";
import TrafficSourcesCard from "./components/TrafficSourcesCard";
import TopPagesTable from "./components/TopPagesTable";
import GeographyCard from "./components/GeographyCard";
import TechnologyCard from "./components/TechnologyCard";
import CampaignTable from "./components/CampaignTable";
import LoadingSkeleton from "./components/LoadingSkeleton";

export default function StudioAnalyticsPage() {
  const { isDark } = useTheme();

  // Navigation & Filter States
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedRange, setSelectedRange] = useState("7d");
  const [customDates, setCustomDates] = useState(() => {
    const to = new Date();
    const from = new Date(to.getTime() - 14 * 24 * 60 * 60 * 1000);
    return {
      from: from.toISOString().slice(0, 10),
      to: to.toISOString().slice(0, 10),
    };
  });

  // Data & Network States
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [lastUpdated, setLastUpdated] = useState("Just now");
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [, startTransition] = useTransition();

  // Core Data Fetcher
  const loadData = useCallback(async (signal) => {
    try {
      const fromIso =
        selectedRange === "custom"
          ? new Date(customDates.from + "T00:00:00.000Z").toISOString()
          : undefined;
      const toIso =
        selectedRange === "custom"
          ? new Date(customDates.to + "T23:59:59.999Z").toISOString()
          : undefined;

      const result = await fetchAdminAnalytics({
        range: selectedRange,
        from: fromIso,
        to: toIso,
        signal,
      });

      startTransition(() => {
        setData(result);
        setError(null);
        setIsLoading(false);
        const now = new Date();
        setLastUpdated(
          now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        );
      });
    } catch (err) {
      if (err.name === "AbortError") return;
      console.error("Analytics fetch error:", err);
      setError(err.message || "Failed to load real-time analytics data");
      setIsLoading(false);
    }
  }, [selectedRange, customDates.from, customDates.to]);

  // Load analytics dataset when range or custom dates change
  useEffect(() => {
    const controller = new AbortController();
    setIsLoading(true);
    loadData(controller.signal);

    return () => {
      controller.abort();
    };
  }, [loadData]);

  // Background Live Visitors Poller (polls every 30s for live metric without refetching the full dashboard)
  useEffect(() => {
    if (typeof window === "undefined") return;

    const intervalId = setInterval(async () => {
      if (document.visibilityState !== "visible") return;

      const liveCount = await fetchLiveVisitorsCount({ range: selectedRange });
      if (typeof liveCount === "number") {
        setData((prev) => {
          if (!prev || !prev.metrics) return prev;
          if (prev.metrics.liveVisitors === liveCount) return prev;
          return {
            ...prev,
            metrics: {
              ...prev.metrics,
              liveVisitors: liveCount,
            },
          };
        });
      }
    }, 30000);

    return () => clearInterval(intervalId);
  }, [selectedRange]);

  // Handle manual refresh
  const handleRefresh = async () => {
    if (isRefreshing) return;
    setIsRefreshing(true);
    setError(null);

    try {
      await loadData();
    } finally {
      setTimeout(() => setIsRefreshing(false), 450);
    }
  };

  // Secure Logout Handler
  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);

    try {
      await fetch("/api/admin/logout", {
        method: "POST",
      });
    } catch (err) {
      console.error("Logout request failed:", err);
    } finally {
      window.location.href = "/yamal19";
    }
  };

  return (
    <div
      className={styles.dashboardShell}
      data-theme={isDark ? "dark" : "light"}
      suppressHydrationWarning={true}
    >
      {/* Left Sidebar / Navigation */}
      <Sidebar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        isMobileOpen={isMobileNavOpen}
        onCloseMobile={() => setIsMobileNavOpen(false)}
        onLogout={handleLogout}
        isLoggingOut={isLoggingOut}
      />

      {/* Main Content Area */}
      <div className={styles.mainWrapper}>
        <div className={styles.contentContainer}>
          {/* Header */}
          <Header
            selectedRange={selectedRange}
            onRangeChange={setSelectedRange}
            customDates={customDates}
            onCustomDatesChange={setCustomDates}
            isRefreshing={isRefreshing}
            onRefresh={handleRefresh}
            onToggleMobileMenu={() => setIsMobileNavOpen(true)}
            lastUpdated={lastUpdated}
          />

          {/* Minimalist Error Banner with Retry */}
          {error && (
            <div className={styles.errorBanner} role="alert">
              <div className={styles.errorTextWrapper}>
                <svg
                  className={styles.errorIcon}
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <span className={styles.errorMessage}>{error}</span>
              </div>
              <button
                type="button"
                className={styles.retryBtn}
                onClick={handleRefresh}
              >
                Retry Telemetry Sync
              </button>
            </div>
          )}

          {/* Loading Skeleton during filter transitions and initial load */}
          {isLoading || !data ? (
            <LoadingSkeleton />
          ) : (
            <main className={styles.dashboardBody}>
              {/* Overview Tab (Full 360 View) */}
              {activeTab === "overview" && (
                <>
                  {/* 1. Top 8 Metrics */}
                  <MetricCards
                    metrics={data.metrics}
                    comparisonLabel={data.comparisonLabel}
                  />

                  {/* 2. Traffic & Pageviews Line/Area Chart */}
                  <TrafficChart
                    data={data.trafficChart}
                    rangeLabel={data.rangeLabel}
                  />

                  {/* 3. Agency Conversion Funnel */}
                  <FunnelChart funnel={data.funnel} />

                  {/* 4. Two Column: Devices & Traffic Sources */}
                  <div className={styles.twoColGrid}>
                    <DeviceDonut devices={data.devices} />
                    <TrafficSourcesCard sources={data.trafficSources} />
                  </div>

                  {/* 5. Top Pages Table */}
                  <TopPagesTable pages={data.topPages} />

                  {/* 6. Two Column: Geography & Technology */}
                  <div className={styles.twoColGrid}>
                    <GeographyCard geography={data.geography} />
                    <TechnologyCard technology={data.technology} />
                  </div>

                  {/* 7. Campaign Performance Table */}
                  <CampaignTable campaigns={data.campaigns} />
                </>
              )}

              {/* Traffic Tab */}
              {activeTab === "traffic" && (
                <>
                  <MetricCards
                    metrics={data.metrics}
                    comparisonLabel={data.comparisonLabel}
                  />
                  <TrafficChart
                    data={data.trafficChart}
                    rangeLabel={data.rangeLabel}
                  />
                  <div className={styles.twoColGrid}>
                    <TrafficSourcesCard sources={data.trafficSources} />
                    <DeviceDonut devices={data.devices} />
                  </div>
                </>
              )}

              {/* Pages Tab */}
              {activeTab === "pages" && (
                <>
                  <TopPagesTable pages={data.topPages} />
                  <div className={styles.twoColGrid}>
                    <TechnologyCard technology={data.technology} />
                    <DeviceDonut devices={data.devices} />
                  </div>
                </>
              )}

              {/* Audience Tab */}
              {activeTab === "audience" && (
                <>
                  <GeographyCard geography={data.geography} />
                  <div className={styles.twoColGrid}>
                    <DeviceDonut devices={data.devices} />
                    <TechnologyCard technology={data.technology} />
                  </div>
                </>
              )}

              {/* Conversions Tab */}
              {activeTab === "conversions" && (
                <>
                  <FunnelChart funnel={data.funnel} />
                  <CampaignTable campaigns={data.campaigns} />
                </>
              )}

              {/* Campaigns Tab */}
              {activeTab === "campaigns" && (
                <>
                  <CampaignTable campaigns={data.campaigns} />
                  <TrafficSourcesCard sources={data.trafficSources} />
                </>
              )}

              {/* Settings / System Telemetry Tab */}
              {activeTab === "settings" && (
                <div className={styles.settingsPanel}>
                  <div className={styles.settingsCard}>
                    <h2 className={styles.settingsTitle}>Database &amp; Pipeline Status</h2>
                    <p className={styles.settingsDesc}>
                      Aeethod Studio private telemetric telemetry architecture status.
                    </p>

                    <div className={styles.statusList}>
                      <div className={styles.statusRow}>
                        <div className={styles.statusLeft}>
                          <span className={styles.statusDotLive} />
                          <span className={styles.statusName}>PostgreSQL Database Foundation</span>
                        </div>
                        <span className={styles.statusTagActive}>Verified &amp; Connected</span>
                      </div>

                      <div className={styles.statusRow}>
                        <div className={styles.statusLeft}>
                          <span className={styles.statusDotLive} />
                          <span className={styles.statusName}>Row-Level Security (RLS)</span>
                        </div>
                        <span className={styles.statusTagActive}>Enforced (No Public Access)</span>
                      </div>

                      <div className={styles.statusRow}>
                        <div className={styles.statusLeft}>
                          <span className={styles.statusDotLive} />
                          <span className={styles.statusName}>Data Privacy Compliance</span>
                        </div>
                        <span className={styles.statusTagActive}>Zero Raw IP Persistence</span>
                      </div>

                      <div className={styles.statusRow}>
                        <div className={styles.statusLeft}>
                          <span className={styles.statusDotLive} />
                          <span className={styles.statusName}>Tracking Engine &amp; API Pipeline</span>
                        </div>
                        <span className={styles.statusTagActive}>Active &amp; Ingesting</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </main>
          )}

          {/* Footer note */}
          <footer className={styles.dashboardFooter}>
            <span>Aeethod Studio Telemetry · Private 360° Analytics v1.0</span>
            <span className={styles.footerNodeBadge}>NODE SECURED</span>
          </footer>
        </div>
      </div>
    </div>
  );
}
