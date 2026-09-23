"use client";

import { useCallback } from "react";
import Link from "next/link";
import styles from "./TcgIntegrations.module.css";

const PACKAGES = [
  {
    id: "dual",
    name: "Dual-Channel Sync Kickstart",
    tag: "STARTER INTEGRATION",
    priceRange: "$3,200 – $4,500",
    period: "One-time investment · 0% ongoing cuts",
    timeline: "2–3 Weeks Turnaround",
    description:
      "Connect your direct storefront with ONE major external marketplace (TCGplayer OR eBay) with automated bi-directional stock delisting.",
    highlight: false,
    badge: null,
    bestFor: "Best for: Shops establishing their first reliable sync between website and one primary marketplace.",
    features: [
      { text: "Bi-directional sync: Storefront + 1 Channel (TCGplayer OR eBay)", included: true },
      { text: "Sub-5s auto-delisting webhooks when cards sell", included: true },
      { text: "Single-listing stock reservation logic", included: true },
      { text: "Automated CSV catalog matching and reconciliation", included: true },
      { text: "Discord / Slack webhook alerts if a marketplace API fails", included: true },
      { text: "14 days post-launch support & staff walkthrough", included: true },
      { text: "Simultaneous 3+ channel sync (TCGplayer + eBay + Web)", included: false },
      { text: "In-store physical counter POS hardware bridge", included: false },
      { text: "Consolidated multi-channel warehouse bin fulfillment queue", included: false },
      { text: "Concurrency conflict arbiter for simultaneous checkouts", included: false }
    ],
    ctaText: "Select Dual-Channel Kickstart",
    ctaHref: "/contact"
  },
  {
    id: "omnichannel",
    name: "Omnichannel Tri-Sync Engine",
    tag: "CARD SHOP STANDARD",
    priceRange: "$6,800 – $8,800",
    period: "Turnkey pipeline deployment · You own the integration",
    timeline: "4–5 Weeks Turnkey Delivery",
    description:
      "The complete multi-channel operating system. Unifies your Website, TCGplayer Direct, eBay Multi-Variation, and physical in-store Counter POS into one real-time engine.",
    highlight: true,
    badge: "★ MOST POPULAR · THE CARD SHOP STANDARD",
    bestFor: "Best for: Established card shops selling actively on their website, TCGplayer, eBay, and over their physical store counter.",
    features: [
      { text: "Full Tri-Channel Sync: Storefront + TCGplayer + eBay + Counter POS", included: true },
      { text: "Sub-3s Real-Time Auto-Delisting Engine (Zero double-selling)", included: true },
      { text: "Master SKU Canonicalization Engine (Scan once, list everywhere)", included: true },
      { text: "Counter POS Hardware Bridge (Square, Shopify POS, or custom barcode)", included: true },
      { text: "Consolidated Multi-Channel Packing Queue with physical bin locations", included: true },
      { text: "Concurrency Conflict Arbiter for millisecond checkout collisions", included: true },
      { text: "Zero monthly SaaS taxes (Saves $300–$1,000/mo in recurring tool fees)", included: true },
      { text: "30 days dedicated engineering warranty & priority staff training", included: true },
      { text: "Cardmarket European cross-border multi-currency sync", included: false },
      { text: "Multi-location warehouse / convention crate inventory routing", included: false },
      { text: "Automated live market algorithmic repricing rules", included: false }
    ],
    ctaText: "Deploy Omnichannel Engine →",
    ctaHref: "/contact"
  },
  {
    id: "enterprise",
    name: "Enterprise Global Marketplace",
    tag: "GLOBAL ECOSYSTEM",
    priceRange: "$12,500 – $16,500",
    period: "Enterprise turnkey deployment · Global automation",
    timeline: "6–8 Weeks Turnkey Delivery",
    description:
      "Engineered for high-volume multi-location stores, European cross-border sellers (Cardmarket), and major convention powerhouses needing enterprise scale.",
    highlight: false,
    badge: null,
    bestFor: "Best for: Multi-store card chains, high-volume convention vendors, and cross-border international sellers ($100k+/mo volume).",
    features: [
      { text: "Everything in Omnichannel Tri-Sync Engine included", included: true },
      { text: "Cardmarket Global Sync (EUR/USD conversion & international VAT rules)", included: true },
      { text: "Multi-Location Inventory Routing (Multiple stores, vaults & road crates)", included: true },
      { text: "Automated Market Repricing Engine (TCGplayer Market & eBay sold sync)", included: true },
      { text: "Automated High-Res Photo Ingestion & Slab Cert Scan Distribution", included: true },
      { text: "Thermal Barcode & Shipping Label Printer Hardware Integration", included: true },
      { text: "Priority Dedicated Systems Architect SLA & 24/7 emergency response", included: true },
      { text: "Quarterly architectural scaling reviews and stress-load testing", included: true }
    ],
    ctaText: "Deploy Enterprise Ecosystem →",
    ctaHref: "/contact"
  }
];

export default function TcgIntegrationsPricingCards() {
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
    <div className={styles.pricingSectionWrapper} id="pricing-section">
      <div className={styles.pricingHeader}>
        <div className={styles.simulatorBadge}>
          <span className={styles.pulseDot} />
          <span>STAGE 02 · PACKAGES & PRICING</span>
        </div>
        <h2 className={styles.pricingMainTitle}>
          Transparent Integration <span className={styles.accentText}>Packages</span>
        </h2>
        <p className={styles.pricingSubtitle}>
          Choose the integration tier that matches your channel footprint.
          Unlike third-party SaaS tools that charge monthly subscriptions and transaction fees, you own your custom cloud sync pipeline forever.
        </p>
      </div>

      {/* 3-Column Pricing Grid */}
      <div className={styles.pricingCardsGrid}>
        {PACKAGES.map((pkg) => (
          <div
            key={pkg.id}
            className={`${styles.pricingPackageCard} ${
              pkg.highlight ? styles.pricingPackageHighlighted : ""
            }`}
          >
            {pkg.badge && (
              <div className={styles.packagePopularRibbon}>
                <span>{pkg.badge}</span>
              </div>
            )}

            <div className={styles.packageCardTop}>
              <div className={styles.packageHeaderRow}>
                <span className={styles.packageTag}>{pkg.tag}</span>
                <span className={styles.packageTimeline}>{pkg.timeline}</span>
              </div>

              <h3 className={styles.packageName}>{pkg.name}</h3>
              <p className={styles.packageDescription}>{pkg.description}</p>

              {/* Pricing Display */}
              <div className={styles.packagePriceWrapper}>
                <div className={styles.packagePriceAmount}>{pkg.priceRange}</div>
                <div className={styles.packagePricePeriod}>{pkg.period}</div>
              </div>

              <div className={styles.packageBestForBadge}>{pkg.bestFor}</div>

              {/* CTA Button */}
              <Link
                href={pkg.ctaHref}
                className={`${styles.packageCtaBtn} ${
                  pkg.highlight ? styles.packageCtaHighlighted : ""
                }`}
                onClick={playClickSound}
              >
                <span>{pkg.ctaText}</span>
              </Link>
            </div>

            {/* Feature List */}
            <div className={styles.packageFeaturesList}>
              <span className={styles.featuresHeading}>What&apos;s Included:</span>
              <ul>
                {pkg.features.map((feat, idx) => (
                  <li
                    key={idx}
                    className={feat.included ? styles.featureIncluded : styles.featureExcluded}
                  >
                    {feat.included ? (
                      <svg
                        className={styles.checkIcon}
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    ) : (
                      <svg
                        className={styles.crossIcon}
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    )}
                    <span>{feat.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      {/* Code Ownership & Guarantee Notice Banner */}
      <div className={styles.ownershipNoticeBanner}>
        <div className={styles.ownershipIcon}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        </div>
        <div className={styles.ownershipText}>
          <h4>100% Cloud Pipeline & Code Ownership Guarantee</h4>
          <p>
            Your multi-channel sync engine runs on your own dedicated serverless infrastructure. You own 100% of the integration code, the API connectors, and the database schema with zero vendor lock-in and zero recurring SaaS taxes.
          </p>
        </div>
      </div>
    </div>
  );
}
