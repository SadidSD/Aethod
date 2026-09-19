"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./page.module.css";
import { useTheme } from "../../context/ThemeContext";

export default function StudioAnalyticsPage() {
  const { isDark } = useTheme();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

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
      className={styles.dashboardWrapper}
      data-theme={isDark ? "dark" : "light"}
      suppressHydrationWarning={true}
    >
      {/* Studio Navigation Bar */}
      <header className={styles.topBar}>
        <div className={styles.brandArea}>
          <div className={styles.logoCircle}>
            <img
              src="/logo-icon.png"
              alt="Aeethod Logo"
              className={styles.brandLogo}
            />
          </div>
          <div className={styles.brandText}>
            <span className={styles.brandTitle}>Aeethod Studio</span>
            <span className={styles.brandSubtitle}>
              Systems Operations &amp; Telemetry
            </span>
          </div>
        </div>

        <div className={styles.topActions}>
          <div className={styles.statusPill}>
            <span className={styles.liveDot} />
            NODE SECURED
          </div>

          <Link href="/admin" className={styles.navLinkBtn}>
            Content Manager
          </Link>

          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className={styles.logoutBtn}
            aria-label="Log out of Aeethod Studio"
          >
            {isLoggingOut ? "Logging out..." : "Log out"}
          </button>
        </div>
      </header>

      {/* Main Dashboard Content */}
      <main className={styles.mainContainer}>
        <div className={styles.sectionHeader}>
          <div>
            <h1 className={styles.pageTitle}>Studio Analytics</h1>
            <p className={styles.pageSubtext}>
              Real-time telemetry, autonomous pipeline operations, and system nodes.
            </p>
          </div>
        </div>

        {/* Top-Level Metrics Grid */}
        <div className={styles.metricsGrid}>
          <div className={styles.metricCard}>
            <span className={styles.metricLabel}>Active System Nodes</span>
            <span className={styles.metricValue}>6 / 6</span>
            <span className={styles.metricDelta}>100% Operational</span>
          </div>

          <div className={styles.metricCard}>
            <span className={styles.metricLabel}>Intelligence Latency</span>
            <span className={styles.metricValue}>24ms</span>
            <span className={styles.metricDelta}>Optimal Speed</span>
          </div>

          <div className={styles.metricCard}>
            <span className={styles.metricLabel}>Telemetry Events (24h)</span>
            <span className={styles.metricValue}>18,420</span>
            <span className={styles.metricDelta}>+14.2% vs yesterday</span>
          </div>

          <div className={styles.metricCard}>
            <span className={styles.metricLabel}>Active Consultations</span>
            <span className={styles.metricValue}>12</span>
            <span className={styles.metricDelta}>Client Pipelines</span>
          </div>
        </div>

        {/* Two-Column Telemetry & Activity Feed */}
        <div className={styles.dashboardCols}>
          {/* Autonomous Node Architecture */}
          <div className={styles.panelCard}>
            <div className={styles.panelHeader}>
              <h2 className={styles.panelHeading}>Subsystem Nodes</h2>
              <span className={styles.panelBadge}>Core Health 100%</span>
            </div>

            <div className={styles.nodeList}>
              <div className={styles.nodeRow}>
                <div className={styles.nodeInfo}>
                  <span className={styles.nodeName}>
                    Core Architecture Node (Smith)
                  </span>
                  <span className={styles.nodeDetail}>
                    Subagent Engine &amp; Conversational Reasoning
                  </span>
                </div>
                <div className={styles.nodeStatus}>
                  <span className={styles.liveDot} /> Active
                </div>
              </div>

              <div className={styles.nodeRow}>
                <div className={styles.nodeInfo}>
                  <span className={styles.nodeName}>
                    Content Publishing Pipeline
                  </span>
                  <span className={styles.nodeDetail}>
                    Works Case Studies, Research &amp; Blog Dispatch
                  </span>
                </div>
                <div className={styles.nodeStatus}>
                  <span className={styles.liveDot} /> Synchronized
                </div>
              </div>

              <div className={styles.nodeRow}>
                <div className={styles.nodeInfo}>
                  <span className={styles.nodeName}>
                    Neumorphic Edge Asset Cache
                  </span>
                  <span className={styles.nodeDetail}>
                    Instant WebP &amp; SVG Distribution
                  </span>
                </div>
                <div className={styles.nodeStatus}>
                  <span className={styles.liveDot} /> Optimized
                </div>
              </div>

              <div className={styles.nodeRow}>
                <div className={styles.nodeInfo}>
                  <span className={styles.nodeName}>
                    Admin Security Gateway (/yamal19)
                  </span>
                  <span className={styles.nodeDetail}>
                    Edge Middleware, Argon2/Scrypt Verification
                  </span>
                </div>
                <div className={styles.nodeStatus}>
                  <span className={styles.liveDot} /> Protected
                </div>
              </div>
            </div>
          </div>

          {/* Operational Audit Log */}
          <div className={styles.panelCard}>
            <div className={styles.panelHeader}>
              <h2 className={styles.panelHeading}>Recent Audit Log</h2>
              <span className={styles.panelBadge}>Encrypted</span>
            </div>

            <div className={styles.activityList}>
              <div className={styles.activityItem}>
                <span className={styles.activityDot} />
                <div className={styles.activityContent}>
                  <span className={styles.activityTitle}>
                    Admin gateway session authenticated
                  </span>
                  <span className={styles.activityTime}>Just now</span>
                </div>
              </div>

              <div className={styles.activityItem}>
                <span className={styles.activityDot} />
                <div className={styles.activityContent}>
                  <span className={styles.activityTitle}>
                    Work project cards WebP skeleton optimized
                  </span>
                  <span className={styles.activityTime}>1 hour ago</span>
                </div>
              </div>

              <div className={styles.activityItem}>
                <span className={styles.activityDot} />
                <div className={styles.activityContent}>
                  <span className={styles.activityTitle}>
                    Chatbox launcher aligned to bottom-right corner
                  </span>
                  <span className={styles.activityTime}>2 hours ago</span>
                </div>
              </div>

              <div className={styles.activityItem}>
                <span className={styles.activityDot} />
                <div className={styles.activityContent}>
                  <span className={styles.activityTitle}>
                    System telemetry health check passed
                  </span>
                  <span className={styles.activityTime}>4 hours ago</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
