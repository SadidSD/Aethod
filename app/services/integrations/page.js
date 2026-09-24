"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import styles from "./integrations.module.css";
import { useTheme } from "../../context/ThemeContext";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

// TCG Interactive Visual Components
import TcgIntegrationsStageSwitcher from "./components/TcgIntegrationsStageSwitcher";
import TcgSyncSimulator from "./components/TcgSyncSimulator";
import TcgSkuNormalizerMockup from "./components/TcgSkuNormalizerMockup";
import TcgSyncCalculator from "./components/TcgSyncCalculator";
import TcgIntegrationsPricingCards from "./components/TcgIntegrationsPricingCards";

const HUD_METRICS = [
  { label: "Active Channels Connected", value: "TCGplayer / eBay / POS / Web", highlight: false },
  { label: "Multi-Channel Sync Speed", value: "< 2.0s Global", highlight: true },
  { label: "Double-Selling Incidents", value: "0 Tolerated", highlight: true },
  { label: "Weekly Staff Hours Saved", value: "14+ Hours / Staff", highlight: false }
];

const PROBLEMS_ELIMINATED = [
  {
    title: "Zero Double-Selling Overnight",
    desc: "When a high-value Charizard or One Piece manga rare sells on eBay at 2 AM, it automatically delists from TCGplayer and your storefront in under 2 seconds before another collector can click checkout."
  },
  {
    title: "No More Midnight Delisting Shifts",
    desc: "Staff no longer waste Monday mornings manually matching sales receipts and adjusting quantities across five separate tabs and spreadsheets. The system updates stock globally in real time."
  },
  {
    title: "Consolidated Fulfillment Queue",
    desc: "All incoming orders—whether from eBay, TCGplayer, your online storefront, or in-store reserve—flow into a single unified packing list sorted by physical bin location."
  },
  {
    title: "Physical Location & Counter Allocation",
    desc: "Accurately track whether an item is in the glass display case, the backroom vault, or a convention travel crate so counter staff find cards in seconds."
  }
];

const COMPARISON_ROWS = [
  {
    feature: "Inventory Sync Latency",
    generic: "15 to 45 minute polling delays (Frequent double-selling during drops)",
    aeethod: "Sub-2.0s Event Webhooks (Real-time zero-stock pushes across all channels)"
  },
  {
    feature: "Double-Selling Defect Protection",
    generic: "No protection; shop takes cancellation penalties and defect strikes",
    aeethod: "Concurrency Conflict Arbiter locks duplicate checkouts at the millisecond level"
  },
  {
    feature: "SKU & Catalog Normalization",
    generic: "Manual copy-pasting of titles, categories, and attributes per platform",
    aeethod: "Master SKU Engine auto-compiles eBay, TCGplayer, POS & web formats instantly"
  },
  {
    feature: "Physical Counter POS Integration",
    generic: "Disconnected or requires manual counter entry after every walk-in sale",
    aeethod: "Direct POS bridge (Square, Shopify POS) locks online inventory immediately"
  },
  {
    feature: "Monthly Software Costs",
    generic: "$300 to $1,200/month recurring SaaS subscription plus transaction cuts",
    aeethod: "0% Monthly SaaS Tax (Runs on your dedicated cloud pipeline that you own)"
  },
  {
    feature: "Fulfillment Workflow",
    generic: "Disjointed seller portals with staff searching through unorganized binders",
    aeethod: "Unified multi-channel packing queue sorted by warehouse / display bin"
  }
];

const BLUEPRINT_MODULES = [
  {
    num: "MODULE 01",
    title: "TCGplayer Direct Bi-Directional Conduit",
    desc: "Automated SKU syncing, quantity reconciliation, and order status updates using official TCGplayer APIs.",
    tag: "Marketplace"
  },
  {
    num: "MODULE 02",
    title: "eBay Multi-Variation Auto-Delister",
    desc: "Real-time webhook listener that catches eBay purchase events and pulls stock across all channels in < 2 seconds.",
    tag: "Marketplace"
  },
  {
    num: "MODULE 03",
    title: "Cardmarket Global Sync Engine",
    desc: "Currency-converted integration for stores selling cross-border across European collector markets with VAT rules.",
    tag: "Cross-Border"
  },
  {
    num: "MODULE 04",
    title: "Counter POS Hardware Bridge",
    desc: "Direct tie-in to your counter register (Square, Shopify POS, or custom) to register walk-in transactions.",
    tag: "POS Bridge"
  },
  {
    num: "MODULE 05",
    title: "Master SKU Canonicalization Engine",
    desc: "Normalize disparate card naming formats between eBay, TCGplayer, and your website into one unified ID.",
    tag: "Data Normalization"
  },
  {
    num: "MODULE 06",
    title: "Multi-Vault Location Router",
    desc: "Track physical card locations across front counters, back vaults, and convention floor travel crates.",
    tag: "Warehouse / Bins"
  },
  {
    num: "MODULE 07",
    title: "Conflict Resolution & Race Arbiter",
    desc: "Engineered logic to handle simultaneous checkouts on different platforms within milliseconds.",
    tag: "Concurrency"
  },
  {
    num: "MODULE 08",
    title: "Fulfillment Batching Dashboard",
    desc: "Unified shipping queue sorting orders by carrier, service level, and bin location for 2x faster packing.",
    tag: "Fulfillment"
  }
];

const ONBOARDING_STEPS = [
  {
    num: "STEP 01",
    title: "Channel API Audit",
    desc: "We inspect your active seller credentials across TCGplayer, eBay, and POS, verifying rate limits and API access keys."
  },
  {
    num: "STEP 02",
    title: "Historical Inventory Reconciliation",
    desc: "We match and canonicalize your existing active listings across platforms into a single clean master database."
  },
  {
    num: "STEP 03",
    title: "Shadow Webhook Testing",
    desc: "We run the auto-delister in shadow test mode to verify millisecond event latency without affecting live buyers."
  },
  {
    num: "STEP 04",
    title: "Live Production Cutover",
    desc: "The real-time synchronization pipeline goes live with zero downtime. Double-selling is eliminated permanently."
  }
];

const FAQS = [
  {
    q: "What happens if a customer buys a card in my physical store while someone is checking out on eBay?",
    a: "Our concurrency race arbiter immediately processes whichever transaction finalizes first and sends an instant zero-stock webhook to the other platform in under 2 seconds, locking out duplicate transactions."
  },
  {
    q: "Can we keep our existing physical POS register like Square or Shopify POS?",
    a: "Yes. We build custom API connectors for major POS systems, or bridge them with lightweight counter barcode scanners to register sales in real time."
  },
  {
    q: "Do we need to delete and re-list all our existing active cards on eBay or TCGplayer?",
    a: "No. Our Master SKU Canonicalization engine reads your existing active listings across platforms and matches them to your master inventory without needing to delete and recreate listings."
  },
  {
    q: "How is Aeethod different from third-party sync SaaS tools like BinderPOS or ChannelEngine?",
    a: "Third-party SaaS tools charge $300 to $1,200/month plus transaction percentages, yet frequently lag by 15 to 45 minutes, causing double-sales during high-demand releases. Aeethod builds a dedicated real-time event pipeline that you own permanently with zero monthly SaaS taxes."
  },
  {
    q: "How long does a full multi-channel integration deployment take?",
    a: "A turnkey Omnichannel Tri-Sync integration typically deploys within 4 to 5 weeks from initial API credentials audit to live shadow testing and staff hand-off."
  }
];

export default function IntegrationsPage() {
  const { isDark } = useTheme();
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  // Form State
  const [email, setEmail] = useState("");
  const [query, setQuery] = useState("");
  const [formSubmitted, setFormSubmitted] = useState(false);

  const playClickSound = useCallback(() => {
    try {
      const audio = new Audio("/touchpad sd.mp3");
      audio.volume = 0.8;
      audio.play().catch(() => {});
    } catch (e) {
      /* ignore */
    }
  }, []);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    playClickSound();
    if (email && query) {
      setFormSubmitted(true);
      setTimeout(() => {
        setFormSubmitted(false);
        setEmail("");
        setQuery("");
      }, 4000);
    }
  };

  return (
    <div
      className={styles.pageWrapper}
      data-theme={isDark ? "dark" : "light"}
      suppressHydrationWarning={true}
    >
      <Navbar activePage="services" />

      <main className={styles.mainContainer}>
        {/* Back to Services Hub */}
        <div className={styles.backBtnWrapper}>
          <Link href="/services" className={styles.backBtn} onClick={playClickSound}>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={styles.backArrow}
            >
              <path d="M19 12H5M5 12L12 19M5 12L12 5" />
            </svg>
            <span>Back to Services Hub</span>
          </Link>
        </div>

        {/* ===== HERO SECTION ===== */}
        <section className={styles.heroSection}>
          <div className={styles.heroLeft}>
            <span className={styles.stageEyebrow}>Stage 02 · Unify Channels</span>
            <h1 className={styles.heroTitle}>
              Commerce & Marketplace <span className={styles.heroTitleHighlight}>Integration</span>
            </h1>
            <p className={styles.heroSubtitle}>
              One central inventory. Every channel in sync.
            </p>
            <p className={styles.heroDescription}>
              Connect TCGplayer, eBay, Cardmarket, your custom storefront, and in-store counter POS into one synchronized engine. When a card sells anywhere, it immediately delists everywhere—eliminating double-selling forever and freeing your staff from manual inventory adjustments.
            </p>

            <div className={styles.heroCtaGroup}>
              <button
                className={styles.primaryBtn}
                onClick={() => {
                  playClickSound();
                  const elem = document.getElementById("pricing-section");
                  if (elem) {
                    const yOffset = -90;
                    const y = elem.getBoundingClientRect().top + window.pageYOffset + yOffset;
                    window.scrollTo({ top: y, behavior: "smooth" });
                  }
                }}
              >
                <span>View Packages & Pricing</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M7 13l5 5 5-5M12 6v12" />
                </svg>
              </button>

              <button
                className={styles.secondaryBtn}
                onClick={() => {
                  playClickSound();
                  const elem = document.getElementById("stage-overview");
                  if (elem) {
                    const yOffset = -90;
                    const y = elem.getBoundingClientRect().top + window.pageYOffset + yOffset;
                    window.scrollTo({ top: y, behavior: "smooth" });
                  }
                }}
              >
                <span>Explore Sync Engine</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </button>
            </div>
          </div>

          {/* Right-Side HUD Metrics Card */}
          <div className={styles.heroRight}>
            <div className={styles.heroVisualCard}>
              <div className={styles.hudHeader}>
                <div className={styles.hudStatus}>
                  <span className={styles.statusDot} />
                  <span>SYSTEM OPERATIONAL</span>
                </div>
                <span className={styles.hudTag}>MULTI-CHANNEL · PIPELINE</span>
              </div>

              <div className={styles.hudMetricsList}>
                {HUD_METRICS.map((item, idx) => (
                  <div key={idx} className={styles.hudMetricItem}>
                    <span className={styles.metricLabel}>{item.label}</span>
                    <span
                      className={`${styles.metricValue} ${
                        item.highlight ? styles.metricHighlight : ""
                      }`}
                    >
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ===== STICKY 3-STAGE SWITCHER ===== */}
        <TcgIntegrationsStageSwitcher />

        {/* ========================================================
            STAGE 01: SYSTEM OVERVIEW & INTERACTIVE VISUAL DEMOS
            ======================================================== */}
        <section className={styles.quickListSection} id="stage-overview">
          <div className={styles.sectionHeader}>
            <span className={styles.sectionEyebrow}>SYSTEM FRICTION REMOVED</span>
            <h2 className={styles.sectionTitle}>
              Problems You Won&apos;t <span className={styles.accentText}>Face Again</span>
            </h2>
            <p className={styles.sectionSubtitle}>
              Daily multi-channel card shop headaches permanently eliminated the moment your synchronization engine goes live.
            </p>
          </div>

          <div className={styles.quickGrid}>
            {PROBLEMS_ELIMINATED.map((item, idx) => (
              <div key={idx} className={styles.quickCard}>
                <div className={styles.quickCardHeader}>
                  <div className={styles.quickCardIcon}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <h3 className={styles.quickCardTitle}>{item.title}</h3>
                </div>
                <p className={styles.quickCardDesc}>{item.desc}</p>
              </div>
            ))}
          </div>

          {/* Visual Demo 1: Interactive Real-Time Auto-Delisting Simulator */}
          <TcgSyncSimulator />

          {/* Visual Demo 2: Master SKU Canonicalization Inspector */}
          <TcgSkuNormalizerMockup />

          {/* Visual Demo 3: Staff Labor & Defect Risk Calculator */}
          <TcgSyncCalculator />

          {/* Side-by-Side Comparison Matrix */}
          <div className={styles.comparisonMatrixSection}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionEyebrow}>DIRECT ARCHITECTURE AUDIT</span>
              <h2 className={styles.sectionTitle}>
                Third-Party Sync SaaS vs. <span className={styles.accentText}>Aeethod Real-Time Pipeline</span>
              </h2>
              <p className={styles.sectionSubtitle}>
                See how a bespoke event-driven pipeline outclasses lagging third-party inventory tools across latency, defect rates, and operational cost.
              </p>
            </div>

            <div className={styles.comparisonTableWrapper}>
              <table className={styles.comparisonTable}>
                <thead>
                  <tr>
                    <th>Capability</th>
                    <th className={styles.tableThGeneric}>Third-Party Sync SaaS</th>
                    <th className={styles.tableThAeethod}>Aeethod Real-Time Pipeline</th>
                  </tr>
                </thead>
                <tbody>
                  {COMPARISON_ROWS.map((row, rIdx) => (
                    <tr key={rIdx}>
                      <td className={styles.tableTdFeature}>{row.feature}</td>
                      <td className={styles.tableTdGeneric}>
                        <span className={styles.crossSymbol}>✕</span>
                        {row.generic}
                      </td>
                      <td className={styles.tableTdAeethod}>
                        <span className={styles.checkSymbol}>✓</span>
                        {row.aeethod}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* ========================================================
            STAGE 02: PACKAGES & PRICING (STAYS AT THE MIDDLE)
            ======================================================== */}
        <section id="pricing-section">
          <TcgIntegrationsPricingCards />
        </section>

        {/* ========================================================
            STAGE 03: ARCHITECTURE BLUEPRINT & ONBOARDING
            ======================================================== */}
        <section className={styles.blueprintSection} id="stage-blueprint">
          <div className={styles.sectionHeader}>
            <span className={styles.sectionEyebrow}>WHAT&apos;S INCLUDED</span>
            <h2 className={styles.sectionTitle}>
              The Architecture <span className={styles.accentText}>Blueprint</span>
            </h2>
            <p className={styles.sectionSubtitle}>
              Modular multi-channel infrastructure components engineered directly into your store&apos;s custom synchronization engine.
            </p>
          </div>

          <div className={styles.blueprintGrid}>
            {BLUEPRINT_MODULES.map((mod, idx) => (
              <div key={idx} className={styles.blueprintCard}>
                <div>
                  <div className={styles.moduleNum}>{mod.num}</div>
                  <h3 className={styles.moduleTitle}>{mod.title}</h3>
                  <p className={styles.moduleDesc}>{mod.desc}</p>
                </div>
                {mod.tag && <span className={styles.moduleTag}>{mod.tag}</span>}
              </div>
            ))}
          </div>

          {/* Zero-Downtime Channel Onboarding Protocol */}
          <div className={styles.protocolSection} style={{ marginTop: "70px" }}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionEyebrow}>ZERO-DOWNTIME ONBOARDING</span>
              <h2 className={styles.sectionTitle}>
                How We Connect <span className={styles.accentText}>Your Channels</span>
              </h2>
              <p className={styles.sectionSubtitle}>
                A four-step deployment protocol ensuring existing live listings are preserved and synchronized with zero customer downtime.
              </p>
            </div>

            <div className={styles.protocolStepsGrid}>
              {ONBOARDING_STEPS.map((step, sIdx) => (
                <div key={sIdx} className={styles.protocolStepCard}>
                  <span className={styles.stepNumber}>{step.num}</span>
                  <h3 className={styles.stepTitle}>{step.title}</h3>
                  <p className={styles.stepDesc}>{step.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* FAQ Section */}
          <div className={styles.faqSection} style={{ marginTop: "70px" }}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionEyebrow}>FREQUENTLY ASKED QUESTIONS</span>
              <h2 className={styles.sectionTitle}>
                Common Questions & <span className={styles.accentText}>Direct Answers</span>
              </h2>
              <p className={styles.sectionSubtitle}>
                Everything you need to know about multi-channel webhooks, preventing double-selling, and POS hardware compatibility.
              </p>
            </div>

            <div className={styles.faqList}>
              {FAQS.map((faq, fIdx) => {
                const isOpen = openFaqIndex === fIdx;
                return (
                  <div
                    key={fIdx}
                    className={`${styles.faqItem} ${isOpen ? styles.faqOpen : ""}`}
                    onClick={() => {
                      playClickSound();
                      setOpenFaqIndex(isOpen ? -1 : fIdx);
                    }}
                  >
                    <div className={styles.faqQuestionRow}>
                      <h4 className={styles.faqQuestion}>{faq.q}</h4>
                      <svg
                        className={styles.faqChevron}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                      >
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </div>
                    {isOpen && <p className={styles.faqAnswer}>{faq.a}</p>}
                  </div>
                );
              })}
            </div>

            {/* Direct Inquiry Form */}
            <div className={styles.inquiryFormContainer}>
              <h3 className={styles.formTitle}>Discuss Your Multi-Channel Setup</h3>
              <p className={styles.formSubtitle}>
                Have a specific question about your active marketplaces, POS register, or inventory size? Speak directly with our lead architect.
              </p>

              {formSubmitted ? (
                <div style={{ color: "#10B981", fontSize: "16px", fontWeight: "600", padding: "16px 0" }}>
                  ✓ Inquiry received! A systems engineer will review your channels and reply shortly.
                </div>
              ) : (
                <form onSubmit={handleFormSubmit}>
                  <div className={styles.formRow}>
                    <input
                      type="email"
                      placeholder="Your store or work email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={styles.formInput}
                      required
                    />
                    <button type="submit" className={styles.submitBtn}>
                      <span>Send Message</span>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <line x1="22" y1="2" x2="11" y2="13" />
                        <polygon points="22 2 15 22 11 13 2 9 22 2" />
                      </svg>
                    </button>
                  </div>
                  <textarea
                    placeholder="Tell us what channels you sell on (e.g., TCGplayer, eBay, Shopify, Square POS) and what sync issues you are experiencing..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className={styles.formTextarea}
                    required
                  />
                </form>
              )}
            </div>

            {/* Explore Other Services Navigation */}
            <div className={styles.otherServicesSection}>
              <h3 className={styles.otherServicesTitle}>Explore the Full TCG Growth Journey</h3>
              <div className={styles.otherServicesGrid}>
                <Link
                  href="/services/commerce"
                  className={styles.otherServicePill}
                  onClick={playClickSound}
                >
                  <span>Stage 01 · Custom Commerce Platforms</span>
                  <span>→</span>
                </Link>
                <Link
                  href="/services/operations"
                  className={styles.otherServicePill}
                  onClick={playClickSound}
                >
                  <span>Stage 03 · TCG Operations Systems</span>
                  <span>→</span>
                </Link>
                <Link
                  href="/services/automation"
                  className={styles.otherServicePill}
                  onClick={playClickSound}
                >
                  <span>Stage 04 · E-Commerce Automation Engines</span>
                  <span>→</span>
                </Link>
                <Link
                  href="/tcg-marketplace-integration"
                  className={styles.otherServicePill}
                  onClick={playClickSound}
                >
                  <span>Architecture · Multi-Channel Sync Engine</span>
                  <span>→</span>
                </Link>
                <Link
                  href="/tcg-inventory-system"
                  className={styles.otherServicePill}
                  onClick={playClickSound}
                >
                  <span>Architecture · Master Inventory Systems</span>
                  <span>→</span>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
