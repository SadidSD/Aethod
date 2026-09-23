"use client";

import styles from "./CapabilityGrid.module.css";

const capabilityCards = [
  {
    id: "storefronts",
    titlePrefix: "Custom ",
    titleAccent: "Storefronts",
    description:
      "High-performance digital storefronts built specifically for TCG catalog scale. Own your customer accounts, community brand, and direct sales without platform transaction tax.",
    pills: ["Direct Commerce", "SEO & Discovery", "Custom UX", "Customer Accounts"],
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <path d="M16 10a4 4 0 0 1-8 0" />
      </svg>
    )
  },
  {
    id: "inventory",
    titlePrefix: "Centralized ",
    titleAccent: "Inventory",
    description:
      "A single source of truth unifying tens of thousands of SKUs across raw singles, graded cards, and sealed products across all physical locations and online storefronts.",
    pills: ["Multi-Location Stock", "SKU Unification", "Graded Vault", "100% Channel Sync"],
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <ellipse cx="12" cy="5" rx="9" ry="3" />
        <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
        <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
      </svg>
    )
  },
  {
    id: "integrations",
    titlePrefix: "Marketplace ",
    titleAccent: "Integrations",
    description:
      "Real-time, bi-directional conduits connecting TCGplayer, eBay, Cardmarket, Shopify, and ManaPool. Automatically de-list sold cards and stop double-selling forever.",
    pills: ["TCGplayer Sync", "eBay & Cardmarket", "ManaPool API", "Auto-Delisting"],
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 3 21 3 21 8" />
        <line x1="4" y1="20" x2="21" y2="3" />
        <polyline points="21 16 21 21 16 21" />
        <line x1="15" y1="15" x2="21" y2="21" />
        <polyline points="8 21 3 21 3 16" />
        <line x1="3" y1="21" x2="10" y2="14" />
      </svg>
    )
  },
  {
    id: "buylist",
    titlePrefix: "Buylist & ",
    titleAccent: "Trade-in Portals",
    description:
      "Automated card submission and valuation workflows for both online customers and counter trade-ins. Condition grading rules, instant payout quotes, and seamless stock intake.",
    pills: ["Online Intake", "Condition Rules", "Instant Cash / Credit", "Counter POS"],
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
      </svg>
    )
  },
  {
    id: "pricing",
    titlePrefix: "Pricing ",
    titleAccent: "Automation",
    description:
      "Algorithmic market-tracking engines that dynamically adjust single and sealed card pricing based on real-time market trends, condition shifts, and margin targets.",
    pills: ["Market Tracking", "Rule-Based Repricing", "Margin Protection", "Bulk Pricing Engine"],
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="1" x2="12" y2="23" />
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    )
  },
  {
    id: "fulfillment",
    titlePrefix: "Fulfillment ",
    titleAccent: "& Automation",
    description:
      "End-to-end automation from order routing to batch picking, label generation, and exception tracking. Eliminate repetitive manual tasks so store staff focus on growth.",
    pills: ["Order Routing", "Batch Picking", "Shipping Rules", "Exception Alerts"],
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
        <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
      </svg>
    )
  },
  {
    id: "saas",
    titlePrefix: "Custom SaaS & ",
    titleAccent: "Intelligence",
    description:
      "Proprietary internal tools, custom analytics, and specialized AI sorting agents built around how your store actually operates. Scalable architecture that evolves with you.",
    pills: ["Internal Tooling", "Business Analytics", "AI Sorting Agents", "Continuous Evolution"],
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="4" width="16" height="16" rx="2" />
        <rect x="9" y="9" width="6" height="6" />
        <line x1="9" y1="1" x2="9" y2="4" />
        <line x1="15" y1="1" x2="15" y2="4" />
        <line x1="9" y1="20" x2="9" y2="23" />
        <line x1="15" y1="20" x2="15" y2="23" />
        <line x1="20" y1="9" x2="23" y2="9" />
        <line x1="20" y1="14" x2="23" y2="14" />
        <line x1="1" y1="9" x2="4" y2="9" />
        <line x1="1" y1="14" x2="4" y2="14" />
      </svg>
    )
  }
];

export default function CapabilityGrid({ className = "" }) {
  return (
    <div className={`${styles.gridContainer} ${className}`}>
      {capabilityCards.map((card) => (
        <div key={card.id} className={styles.card}>
          <div>
            <div className={styles.cardHeader}>
              <div className={styles.iconWrapper}>{card.icon}</div>
              <h3 className={styles.cardTitle}>
                {card.titlePrefix}
                <span className={styles.purpleAccent}>{card.titleAccent}</span>
              </h3>
            </div>
            <p className={styles.cardDescription}>{card.description}</p>
          </div>
          <div className={styles.pillContainer}>
            {card.pills.map((pill, idx) => (
              <span key={idx} className={styles.pill}>
                {pill}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
