"use client";

import { useCallback } from "react";
import styles from "./TcgAutomation.module.css";

const PACKAGES = [
  {
    tier: "STARTER AUTOMATION",
    turnaround: "2–3 Weeks Turnaround",
    title: "Intelligent Repricing & Alerts",
    priceRange: "$3,200 – $4,500",
    desc: "An automated price adjustment engine that protects your margins from stale tournament prices and alerts staff before popular sealed products sell out.",
    featured: false,
    cta: "Select Repricing Engine",
    deliverables: [
      { text: "Dynamic market repricer (Storefront + TCGplayer Direct)", included: true },
      { text: "Strict profit floor guardrails (Never sell below cost/minimum margin)", included: true },
      { text: "Tournament spike & market trend anomaly detection (< 60s update)", included: true },
      { text: "Low inventory & sealed product restock alert webhooks (Discord/Slack/Email)", included: true },
      { text: "Automated end-of-day sales & pricing velocity audit digest", included: true },
      { text: "14 days post-launch staff training & threshold calibration", included: true },
      { text: "1-Click thermal batch fulfillment & multi-channel shipping pipeline", included: false },
      { text: "Warehouse bin-sorted single-path pick lists", included: false },
      { text: "High-speed optical card scanner ingestion pipeline", included: false }
    ]
  },
  {
    tier: "CARD SHOP STANDARD",
    turnaround: "4–5 Weeks Turnaround",
    title: "Full Shop Automation Suite",
    priceRange: "$6,800 – $8,800",
    desc: "The complete operational automation suite. Automated multi-channel repricing with fee padding, 1-click thermal batch fulfillment, single-path bin pick lists, and scanner intake.",
    featured: true,
    cta: "Deploy Automation Suite →",
    deliverables: [
      { text: "Everything in Intelligent Repricing & Alerts included", included: true },
      { text: "Multi-channel synchronized repricing (Storefront + TCGplayer + eBay)", included: true },
      { text: "Automated marketplace commission fee padding (+13.2% auto-calculated)", included: true },
      { text: "1-Click ESC/POS thermal batch label printing (Bubble mailer & slab box presets)", included: true },
      { text: "Single-path warehouse bin pick lists (Linear walking order through vault/cases)", included: true },
      { text: "High-speed card scanner intake API integration (1 card/sec auto-cataloging)", included: true },
      { text: "Zero monthly SaaS fees: Dedicated pipeline running on your own infrastructure", included: true },
      { text: "30 days engineering warranty & priority staff onboarding", included: true },
      { text: "Multi-warehouse split-fulfillment routing & AI optical slab pre-grading", included: false }
    ]
  },
  {
    tier: "ENTERPRISE DISTRIBUTION",
    turnaround: "6–8 Weeks Turnaround",
    title: "Autonomous Distribution System",
    priceRange: "$12,000 – $15,500",
    desc: "Engineered for high-volume distributor hubs, multi-warehouse card retailers, and massive convention vendor operations needing fully autonomous fulfillment.",
    featured: false,
    cta: "Deploy Enterprise System →",
    deliverables: [
      { text: "Everything in Full Shop Automation Suite included", included: true },
      { text: "Multi-warehouse split-fulfillment routing & automated stock balancing", included: true },
      { text: "High-res optical pre-grading pipeline (Automated centering & edge wear analysis)", included: true },
      { text: "Industrial conveyor barcode scanning & automated weight verification scale bridge", included: true },
      { text: "Custom international carrier rate-shopping & cross-border customs generation", included: true },
      { text: "Dedicated Systems Architect SLA & 24/7 priority emergency response", included: true },
      { text: "Quarterly architectural scaling reviews and stress-load testing", included: true }
    ]
  }
];

export default function TcgAutomationPricingCards() {
  const playClickSound = useCallback(() => {
    try {
      const audio = new Audio("/touchpad sd.mp3");
      audio.volume = 0.8;
      audio.play().catch(() => {});
    } catch (e) {
      /* ignore */
    }
  }, []);

  return (
    <div className={styles.componentCard}>
      <div className={styles.pricingHeader}>
        <div className={styles.sectionBadge}>
          <span className={styles.badgeDot} />
          Stage 02 · Packages & Pricing
        </div>
        <h3 className={styles.componentTitle}>
          Transparent Automation <span className={styles.componentTitleHighlight}>Packages</span>
        </h3>
        <p className={styles.componentDesc} style={{ margin: "0 auto" }}>
          Turnkey autonomous pipelines with zero monthly subscription fees. You own your repricing rules, shipping code, and serverless infrastructure forever.
        </p>
      </div>

      <div className={styles.pricingGrid}>
        {PACKAGES.map((pkg) => (
          <div
            key={pkg.title}
            className={`${styles.pricingCard} ${pkg.featured ? styles.pricingCardFeatured : ""}`}
          >
            {pkg.featured && <div className={styles.popularBadge}>★ Most Popular · Card Shop Standard</div>}

            <div className={styles.pricingTierName}>{pkg.tier}</div>
            <div style={{ fontSize: "11px", color: "var(--text-secondary, #64748b)", marginBottom: "8px" }}>
              {pkg.turnaround}
            </div>
            <h4 className={styles.pricingPackageTitle}>{pkg.title}</h4>
            <p className={styles.pricingDesc}>{pkg.desc}</p>

            <div className={styles.priceDisplay}>
              <div className={styles.priceAmount}>{pkg.priceRange}</div>
              <div className={styles.priceType}>One-time turnkey deployment • 0% ongoing platform cut</div>
            </div>

            <button
              className={`${styles.pricingCtaBtn} ${pkg.featured ? styles.pricingCtaBtnFeatured : ""}`}
              onClick={() => {
                playClickSound();
                document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              {pkg.cta}
            </button>

            <ul className={styles.deliverablesList}>
              {pkg.deliverables.map((item, idx) => (
                <li key={idx} className={styles.deliverableItem}>
                  {item.included ? (
                    <span className={styles.deliverableItemCheck}>✓</span>
                  ) : (
                    <span className={styles.deliverableItemCross}>✕</span>
                  )}
                  <span style={{ opacity: item.included ? 1 : 0.45 }}>{item.text}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
