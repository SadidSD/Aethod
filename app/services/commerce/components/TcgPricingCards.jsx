"use client";

import { useCallback } from "react";
import Link from "next/link";
import styles from "./TcgComponents.module.css";

const PACKAGES = [
  {
    id: "shopify",
    name: "Shopify TCG Kickstart",
    tag: "STARTER DEPLOYMENT",
    priceRange: "$3,500 – $4,800",
    period: "One-time investment · 0% revenue cut",
    timeline: "2–3 Weeks Turnaround",
    description:
      "A professionally configured Shopify storefront tailored for card shops entering online sales without custom engineering overhead.",
    highlight: false,
    badge: null,
    bestFor: "Best for: Newer shops with under 5,000 SKUs starting out on Shopify.",
    features: [
      { text: "TCG-optimized Shopify theme layer & brand styling", included: true },
      { text: "Curated variant apps (bypassing basic display limits)", included: true },
      { text: "Singles, sealed product & accessory templates", included: true },
      { text: "Automated CSV catalog import (TCGplayer / BinderPOS)", included: true },
      { text: "Mobile checkout & Apple Pay / Google Pay setup", included: true },
      { text: "Standard payment processing (Stripe / Shopify Pay)", included: true },
      { text: "14 days post-launch support & staff onboarding", included: true },
      { text: "Deep multi-condition matrix (subject to 100-variant limit)", included: false },
      { text: "Sub-40ms edge-indexed faceted search engine", included: false },
      { text: "100% bespoke Next.js codebase ownership", included: false },
      { text: "Self-service customer buylist trade-in engine", included: false },
      { text: "Real-time TCGplayer & eBay multi-channel sync", included: false }
    ],
    ctaText: "Select Shopify Kickstart",
    ctaHref: "/contact"
  },
  {
    id: "custom",
    name: "Custom TCG Commerce Platform",
    tag: "FLAGSHIP STOREFRONT",
    priceRange: "$7,800 – $9,800",
    period: "One-time turnkey deployment · You own 100% of code",
    timeline: "4–6 Weeks Turnkey Delivery",
    description:
      "The dedicated high-performance storefront engineered from scratch. Solves the 100-variant limit, provides sub-second search across 100k+ singles, and captures 100% of direct sales margins.",
    highlight: true,
    badge: "★ MOST POPULAR · THE CARD SHOP STANDARD",
    bestFor: "Best for: Growing card shops ($20k–$100k+/mo) ready to own their storefront and eliminate marketplace commissions.",
    features: [
      { text: "100% Bespoke Next.js / React storefront (Zero theme bloat)", included: true },
      { text: "Native Deep-Variant Engine (Zero 100-variant limit)", included: true },
      { text: "Sub-40ms Faceted Search (Game, Set, Number, Rarity, Foil, Condition)", included: true },
      { text: "Zero Marketplace Commission Checkout (Stripe direct, keep 100% profit)", included: true },
      { text: "High-Res Graded Slab Inspector with PSA/BGS/CGC cert verification", included: true },
      { text: "In-Store Counter Pickup scheduling synced with prep desk", included: true },
      { text: "Turnkey catalog migration from Shopify, BinderPOS, or TCGplayer", included: true },
      { text: "TCG Schema (JSON-LD) for high Google & AI card ranking", included: true },
      { text: "30 days dedicated engineering warranty & priority staff training", included: true },
      { text: "Self-service customer buylist trade-in engine", included: false },
      { text: "Real-time multi-channel sync (TCGplayer, eBay, POS auto-delist)", included: false },
      { text: "Automated market price absorption engine", included: false }
    ],
    ctaText: "Build Your Custom Platform →",
    ctaHref: "/contact"
  },
  {
    id: "advanced",
    name: "Advanced Omnichannel TCG System",
    tag: "ENTERPRISE ECOSYSTEM",
    priceRange: "$14,500 – $18,500",
    period: "Turnkey enterprise deployment · Complete automation",
    timeline: "6–8 Weeks Turnkey Delivery",
    description:
      "The complete card retail operating system. Unifies your custom storefront with an automated customer buylist, live multi-channel inventory sync, and market price absorption.",
    highlight: false,
    badge: null,
    bestFor: "Best for: High-volume multi-location stores, top convention vendors, and high-frequency card operations ($100k+/mo).",
    features: [
      { text: "Everything in Custom Commerce Platform included", included: true },
      { text: "Automated Customer Buylist Portal (Cash vs +20% Store Credit)", included: true },
      { text: "Real-Time Multi-Channel Sync (Storefront + TCGplayer + eBay + POS)", included: true },
      { text: "Instant Auto-Delisting Engine (Eliminates double-selling forever)", included: true },
      { text: "Automated Market Price Absorption (TCGplayer & PriceCharting sync)", included: true },
      { text: "Bot-Resistant High-Demand Drop Queuing for sealed box releases", included: true },
      { text: "VIP Collector Vault & Consignment Accounting Registry", included: true },
      { text: "In-store counter kiosk trade-in workflow integration", included: true },
      { text: "Dedicated Lead Systems Architect SLA & 24/7 emergency support", included: true },
      { text: "Quarterly architectural scaling reviews & load testing", included: true },
      { text: "Custom warehouse bin location barcodes & picker routes", included: true },
      { text: "Priority migration engineer with zero inventory downtime", included: true }
    ],
    ctaText: "Deploy Advanced System →",
    ctaHref: "/contact"
  }
];

export default function TcgPricingCards() {
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
          Transparent Engineering <span className={styles.accentText}>Packages</span>
        </h2>
        <p className={styles.pricingSubtitle}>
          Choose the infrastructure tier that matches your current catalog scale.
          Unlike SaaS platforms, we take <strong>0% of your sales revenue</strong> and lock zero features behind monthly paywalls.
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
          <h4>100% Intellectual Property & Code Ownership Guarantee</h4>
          <p>
            You own 100% of the repository, the custom frontend code, the database schema, and the customer data.
            If you ever decide to bring engineering in-house, your system transfers cleanly with zero vendor lock-in and zero penalties.
          </p>
        </div>
      </div>
    </div>
  );
}
