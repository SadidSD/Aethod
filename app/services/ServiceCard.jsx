"use client";

import Link from "next/link";
import styles from "./ServiceCard.module.css";

export const servicesData = [
  {
    id: "commerce",
    href: "/services/commerce",
    stage: "Stage 01 · Own the Storefront",
    titlePrefix: "Custom Commerce ",
    titleAccent: "Platforms",
    featured: true,
    description:
      "Bespoke digital storefronts engineered from scratch specifically for high-velocity TCG catalogs. Advanced search, real-time set, rarity, condition and foil filtering, graded slabs, and zero marketplace commission fees.",
    pills: ["Custom TCG Storefront", "Card Variant Filtering", "Graded Slabs & Sets", "Direct Checkout", "Zero Marketplace Fees"],
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <path d="M16 10a4 4 0 0 1-8 0" />
      </svg>
    )
  },
  {
    id: "integrations",
    href: "/services/integrations",
    stage: "Stage 02 · Unify Channels",
    titlePrefix: "Commerce & Marketplace ",
    titleAccent: "Integration",
    featured: false,
    description:
      "One central inventory connecting TCGplayer, eBay, Cardmarket, Shopify, and your store POS. Automatic delisting when cards sell anywhere—stop managing the same inventory six times and eliminate double-selling forever.",
    pills: ["TCGplayer API", "eBay Real-Time Sync", "Cardmarket Conduits", "Auto-Delisting"],
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
    id: "operations",
    href: "/services/operations",
    stage: "Stage 03 · Behind The Counter",
    titlePrefix: "TCG Operations ",
    titleAccent: "Systems",
    featured: false,
    description:
      "Custom business infrastructure built for the complicated parts of card retail. Automated customer buylist trade-in valuation, condition grading matrices, vault tracking, and in-store counter POS synchronization.",
    pills: ["Online Buylist Intake", "Condition Valuation", "Counter POS", "Graded Vault Tracking"],
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
      </svg>
    )
  },
  {
    id: "automation",
    href: "/services/automation",
    stage: "Stage 04 · Remove Manual Work",
    titlePrefix: "Business ",
    titleAccent: "Automation",
    featured: false,
    description:
      "Automated pipelines that handle routine retail labor. Instant stock scanning and publishing, automated order batching, shipping label printing, and dynamic market repricing that protects your margins.",
    pills: ["Market Repricing Rules", "Batch Order Routing", "Label Generation", "Stock Ingestion"],
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
        <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
      </svg>
    )
  },
  {
    id: "intelligence",
    href: "/services/intelligence",
    stage: "Stage 05 · Scale Intelligently",
    titlePrefix: "Custom Intelligence & ",
    titleAccent: "SaaS",
    featured: false,
    description:
      "Proprietary internal tools, tournament meta tracking, market shift alerts, and specialized AI sorting agents built around how your store operates. Bespoke software assets your business owns.",
    pills: ["Market Velocity Alerts", "AI Sorting Agents", "Custom Dashboards", "Proprietary SaaS"],
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

export default function ServicesList({ onCardClick }) {
  return (
    <div className={styles.servicesGrid}>
      {servicesData.map((item) => (
        <Link
          key={item.id}
          href={item.href}
          className={`${styles.card} ${item.featured ? styles.featuredCard : ""}`}
          onClick={() => onCardClick && onCardClick()}
        >
          <div>
            <div className={styles.topRow}>
              <span className={styles.stageBadge}>{item.stage}</span>
              <div className={styles.iconWrapper}>{item.icon}</div>
            </div>
            <h3 className={styles.cardTitle}>
              {item.titlePrefix}
              <span className={styles.purpleAccent}>{item.titleAccent}</span>
            </h3>
            <p className={styles.cardDesc}>{item.description}</p>
          </div>
          <div className={styles.pillContainer}>
            {item.pills.map((pill, pIdx) => (
              <span key={pIdx} className={styles.pill}>
                {pill}
              </span>
            ))}
          </div>
          <div className={styles.footerRow}>
            <span className={styles.learnMoreLink}>
              Explore Service Blueprint <span>→</span>
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}
