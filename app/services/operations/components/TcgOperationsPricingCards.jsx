"use client";

import { useCallback } from "react";
import styles from "./TcgOperations.module.css";

const PACKAGES = [
  {
    tier: "STARTER DEPLOYMENT",
    turnaround: "2–3 Weeks Turnaround",
    title: "Digital Buylist Portal",
    priceRange: "$3,400 – $4,800",
    desc: "A customer-facing online trade-in portal allowing collectors to submit card lists from home with live market valuations and cash/credit quotes.",
    featured: false,
    cta: "Select Buylist Portal",
    deliverables: [
      { text: "Customer-facing trade-in portal (Pokémon, MTG, One Piece, Yu-Gi-Oh)", included: true },
      { text: "Live TCG market valuation integration (Real-time buy rates)", included: true },
      { text: "Configurable Cash vs. Store Credit margin spreads", included: true },
      { text: "Trade manifest submission queue & customer email notifications", included: true },
      { text: "Customer store credit ledger for web purchases", included: true },
      { text: "14 days post-launch staff training & workflow support", included: true },
      { text: "Physical counter barcode scanner & POS integration", included: false },
      { text: "ESC/POS thermal trade ticket & label printing pipeline", included: false },
      { text: "Graded slab vault serial registry & shrinkage audit log", included: false }
    ]
  },
  {
    tier: "CARD SHOP STANDARD",
    turnaround: "4–5 Weeks Turnaround",
    title: "Counter Operations & Vault Engine",
    priceRange: "$6,900 – $8,900",
    desc: "The complete in-store operational backbone. Rapid counter trade-in terminal, standardized condition grading matrix, thermal slip printing, and graded slab vault security.",
    featured: true,
    cta: "Deploy Counter Engine →",
    deliverables: [
      { text: "Everything in Digital Buylist Portal included", included: true },
      { text: "High-speed counter staff intake terminal (1-click batch scans)", included: true },
      { text: "Standardized Condition Grading Matrix (Zero subjectivity disputes)", included: true },
      { text: "ESC/POS thermal printer bridge: Instant trade agreements & barcode labels", included: true },
      { text: "Graded slab vault serial registry & high-value certification tracker", included: true },
      { text: "Unified customer store credit ledger (Works at counter + online storefront)", included: true },
      { text: "Role-based manager cash overrides & daily drawer audit logs", included: true },
      { text: "Zero monthly SaaS fees: Dedicated pipeline you own forever", included: true },
      { text: "30 days engineering warranty & priority staff onboarding", included: true },
      { text: "Multi-location store transfer routing & convention crate mode", included: false }
    ]
  },
  {
    tier: "MULTI-STORE FLEET",
    turnaround: "6–8 Weeks Turnaround",
    title: "Multi-Store & Convention Fleet",
    priceRange: "$12,500 – $16,000",
    desc: "Engineered for high-volume regional chains, multi-location card shops, and major convention tour vendors needing synchronized vaults and offline resiliency.",
    featured: false,
    cta: "Deploy Fleet System →",
    deliverables: [
      { text: "Everything in Counter Operations & Vault Engine included", included: true },
      { text: "Multi-location inventory routing & inter-store transfer manifests", included: true },
      { text: "Convention travel crate mode: Offline trade caching with auto-cloud sync", included: true },
      { text: "High-risk fraud detection: Stolen cert blacklist & suspicious trade alerts", included: true },
      { text: "Automated buylist margin recalibration tied to inventory depth", included: true },
      { text: "Industrial high-capacity barcode & RFID tag encoding pipeline", included: true },
      { text: "Dedicated Systems Architect SLA & 24/7 priority emergency response", included: true },
      { text: "Quarterly performance tuning and seasonal tournament optimizations", included: true }
    ]
  }
];

export default function TcgOperationsPricingCards() {
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
          Transparent Operations <span className={styles.componentTitleHighlight}>Packages</span>
        </h3>
        <p className={styles.componentDesc} style={{ margin: "0 auto" }}>
          Turnkey engineering with zero monthly subscription taxes. You own your counter software, hardware integrations, and database forever.
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
