"use client";

import styles from "./CampaignTable.module.css";

export default function CampaignTable({ campaigns = [] }) {
  if (!campaigns || campaigns.length === 0) {
    return (
      <div className={styles.tableCard}>
        <div className={styles.cardHeader}>
          <div>
            <h2 className={styles.cardTitle}>Campaign Performance</h2>
            <p className={styles.cardSubtext}>Attributed UTM campaign parameters, inquiry conversions, and lead yield</p>
          </div>
          <span className={styles.campaignBadge}>0 active initiatives</span>
        </div>
        <div style={{ padding: "48px 24px", textAlign: "center", color: "var(--color-text-secondary, #94A3B8)", fontSize: "0.875rem" }}>
          No campaign parameters (UTM tags) detected in this period. Inbound links with utm_source, utm_medium, or utm_campaign will appear here automatically.
        </div>
      </div>
    );
  }


  return (
    <div className={styles.tableCard}>
      <div className={styles.cardHeader}>
        <div>
          <h2 className={styles.cardTitle}>Campaign Performance</h2>
          <p className={styles.cardSubtext}>Attributed UTM campaign parameters, inquiry conversions, and lead yield</p>
        </div>
        <span className={styles.campaignBadge}>
          {campaigns.length} active initiatives
        </span>
      </div>

      <div className={styles.tableScrollWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.thCampaign}>Campaign</th>
              <th className={styles.thSource}>Source / Medium</th>
              <th className={styles.thSessions}>Sessions</th>
              <th className={styles.thVisitors}>Visitors</th>
              <th className={styles.thConversions}>Conversions</th>
              <th className={styles.thRate}>Yield Rate</th>
            </tr>
          </thead>
          <tbody>
            {campaigns.map((camp, idx) => (
              <tr key={idx} className={styles.tr}>
                {/* Campaign */}
                <td className={styles.tdCampaign}>
                  <span className={styles.campaignName}>{camp.campaign}</span>
                </td>

                {/* Source / Medium */}
                <td className={styles.tdSource}>
                  <div className={styles.sourceBadges}>
                    <span className={styles.sourceTag}>{camp.source}</span>
                    <span className={styles.mediumTag}>{camp.medium}</span>
                  </div>
                </td>

                {/* Sessions */}
                <td className={styles.tdSessions}>
                  <span className={styles.num}>{camp.sessions.toLocaleString()}</span>
                </td>

                {/* Visitors */}
                <td className={styles.tdVisitors}>
                  <span className={styles.num}>{camp.visitors.toLocaleString()}</span>
                </td>

                {/* Conversions */}
                <td className={styles.tdConversions}>
                  <span className={styles.conversionBadge}>
                    {camp.conversions} leads
                  </span>
                </td>

                {/* Conversion Rate */}
                <td className={styles.tdRate}>
                  <span className={styles.rateHighlight}>{camp.rate}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
