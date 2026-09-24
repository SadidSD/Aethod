"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import styles from "./commerce.module.css";
import { useTheme } from "../../context/ThemeContext";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

// TCG Interactive Visual Components
import TcgStageSwitcher from "./components/TcgStageSwitcher";
import TcgVariantSimulator from "./components/TcgVariantSimulator";
import TcgFacetedSearchMockup from "./components/TcgFacetedSearchMockup";
import TcgCommissionCalculator from "./components/TcgCommissionCalculator";
import TcgPricingCards from "./components/TcgPricingCards";

const HUD_METRICS = [
  { label: "Active SKU Capacity", value: "100,000+ Singles", highlight: false },
  { label: "Search & Filter Latency", value: "< 35ms Sub-second", highlight: true },
  { label: "Marketplace Commission Saved", value: "12% – 15% Net", highlight: true },
  { label: "Customer Data Ownership", value: "100% Direct", highlight: false }
];

const PROBLEMS_ELIMINATED = [
  {
    title: "Zero 100-Variant Limit Nightmare",
    desc: "Shopify hard-caps products at 100 variants. A single Pokémon or MTG card with 5 conditions, 4 finishes, and PSA slabs breaks Shopify immediately. We collapse 150+ variations into 1 single high-converting canonical card page."
  },
  {
    title: "No More 12–15% Marketplace Tax",
    desc: "TCGplayer and eBay charge 12% to 15% on every card sold and withhold customer contact details. On your Aeethod storefront, you pay standard 2.9% payment processing, keep 100% of profits, and own every collector email."
  },
  {
    title: "Sub-40ms Search Across 50,000+ Singles",
    desc: "Generic e-commerce searches freeze or take 4 seconds to filter deep inventory. Our edge-indexed engine lets collectors filter by Set, Card Number, Rarity, Foil, and Condition in milliseconds with zero page reloads."
  },
  {
    title: "Direct In-Store Counter & Buylist Ready",
    desc: "Bridge physical and online retail. Customers can choose in-store counter pickup to save shipping, use in-store trade credit online, and submit cards through your automated buylist."
  }
];

const COMPARISON_ROWS = [
  {
    feature: "Product Variant Capacity",
    generic: "Hard capped at 100 variants (Forces split products or buggy apps)",
    aeethod: "Unlimited Variants (150+ conditions, finishes & slabs under 1 card)"
  },
  {
    feature: "Search & Filter Speed",
    generic: "Slow SQL queries (2–5 seconds on 20k+ cards, full page reload)",
    aeethod: "Sub-40ms Edge Search (Instant multi-facet filtering with zero refresh)"
  },
  {
    feature: "Marketplace Commissions",
    generic: "12.5% to 15% taken by TCGplayer / eBay on every order",
    aeethod: "0% Marketplace Tax (Direct checkout, only standard Stripe 2.9%)"
  },
  {
    feature: "High-Res Graded Slab Zoom",
    generic: "Generic square photos; collectors can't inspect corners or edges",
    aeethod: "4K Pan & Zoom inspection viewer with PSA/BGS/CGC cert validation"
  },
  {
    feature: "Trade-In Buylist Integration",
    generic: "None (Requires external Google forms or costly third-party apps)",
    aeethod: "Native Collector Buylist portal with cash vs. +20% store credit"
  },
  {
    feature: "Code & Customer Ownership",
    generic: "Rented platform theme; marketplaces hide customer contact info",
    aeethod: "100% Code & Customer Ownership (Direct emails, phone numbers & data)"
  }
];

const BLUEPRINT_MODULES = [
  {
    num: "MODULE 01",
    title: "Bespoke TCG Storefront UI/UX",
    desc: "Tailored brand interface optimized for desktop collectors, high-res binders, and convention-floor mobile shoppers.",
    tag: "Storefront"
  },
  {
    num: "MODULE 02",
    title: "Sub-40ms Faceted Search Engine",
    desc: "Instant filtering by game, set expansion, card number, rarity, foil finish, and condition grade.",
    tag: "Search Engine"
  },
  {
    num: "MODULE 03",
    title: "Deep-Variant Card Catalog Matrix",
    desc: "Single canonical card pages handling unlimited conditions (NM, LP, MP, HP), finishes, and slab certifications.",
    tag: "Catalog"
  },
  {
    num: "MODULE 04",
    title: "Direct Zero-Tax Checkout",
    desc: "Frictionless checkout supporting Apple Pay, Google Pay, credit cards, and store credit split tender.",
    tag: "Checkout"
  },
  {
    num: "MODULE 05",
    title: "In-Store Counter Pickup Sync",
    desc: "Local pickup scheduling that syncs directly with your staff prep desk and eliminates shipping fees.",
    tag: "Fulfillment"
  },
  {
    num: "MODULE 06",
    title: "High-Res Graded Slab Inspector",
    desc: "4K pinch-to-zoom magnification for corner centering and 1-click PSA/BGS/CGC cert registry lookup.",
    tag: "Graded Slabs"
  },
  {
    num: "MODULE 07",
    title: "GEO & AEO Organic Card Schema",
    desc: "Structured JSON-LD schema ensuring your singles rank high on Google and AI search engines.",
    tag: "SEO / Discovery"
  },
  {
    num: "MODULE 08",
    title: "High-Traffic Release Queue Defense",
    desc: "Fair-drop queuing and bot resistance for high-demand booster box releases and collector drops.",
    tag: "Performance"
  }
];

const MIGRATION_STEPS = [
  {
    num: "STEP 01",
    title: "Catalog Schema Mapping",
    desc: "We extract and normalize your singles, sealed boxes, conditions, and customer data from Shopify, BinderPOS, or CSV."
  },
  {
    num: "STEP 02",
    title: "Parallel Shadow Testing",
    desc: "Your new custom platform runs in parallel with your live store, testing inventory numbers to ensure zero desync."
  },
  {
    num: "STEP 03",
    title: "Zero-Downtime Cutover",
    desc: "We switch DNS records during off-peak hours with zero catalog downtime. Not a single card or customer order is lost."
  },
  {
    num: "STEP 04",
    title: "Staff Hand-off & Training",
    desc: "We train your store staff on card ingestion, order fulfillment, and counter pickup workflow management."
  }
];

const FAQS = [
  {
    q: "Can you migrate our existing Shopify or BinderPOS inventory without losing card stock?",
    a: "Yes. We perform automated schema migrations for your singles, sealed inventory, product variants, and customer accounts. We run side-by-side reconciliation tests before flipping the switch so not a single card is double-sold or lost during the transition."
  },
  {
    q: "How does your system solve Shopify's 100-variant limit?",
    a: "Standard Shopify treats each variation as a separate variant in a rigid database row capped at 100. Our custom architecture indexes condition, finish, language, and slab certification in a high-speed matrix at the edge. A single card page can represent 300+ variations with instant price and stock switching."
  },
  {
    q: "Do we pay Aeethod any monthly percentage of our card sales?",
    a: "No. Unlike third-party SaaS platforms or marketplaces that demand 12% to 15% revenue cuts, Aeethod charges zero recurring sales percentage. You pay standard payment gateway fees (e.g., Stripe 2.9% + 30¢), and the platform is your owned business asset."
  },
  {
    q: "Can customers use store credit earned from in-store buylist trade-ins online?",
    a: "Yes. Store credit balances can be unified so a customer trading in a binder at your counter can immediately use that balance online or vice versa."
  },
  {
    q: "How long does a custom commerce platform deployment take?",
    a: "A turnkey Custom Commerce Platform typically launches within 4 to 6 weeks from initial architecture mapping to final launch, including catalog migration, payment gateway setup, and staff onboarding."
  }
];

export default function CommercePage() {
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
            <span className={styles.stageEyebrow}>Stage 01 · Own the Storefront</span>
            <h1 className={styles.heroTitle}>
              Custom Commerce <span className={styles.heroTitleHighlight}>Platforms</span>
            </h1>
            <p className={styles.heroSubtitle}>
              The high-velocity storefront your card business actually owns.
            </p>
            <p className={styles.heroDescription}>
              Bespoke digital storefronts engineered from scratch specifically for high-velocity TCG catalogs. We eliminate 12–15% marketplace commissions, slow search latency, and rigid Shopify theme limitations with high-conversion infrastructure you own permanently.
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
                <span>Explore Store Engine</span>
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
                <span className={styles.hudTag}>TCG COMMERCE · BLUEPRINT</span>
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
        <TcgStageSwitcher />

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
              Daily card shop headaches permanently eliminated the moment your dedicated system goes live.
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

          {/* Visual Demo 1: Interactive Card Variant Simulator */}
          <TcgVariantSimulator />

          {/* Visual Demo 2: Sub-Second Faceted Search Engine */}
          <TcgFacetedSearchMockup />

          {/* Visual Demo 3: Marketplace Commission Savings Calculator */}
          <TcgCommissionCalculator />

          {/* Side-by-Side Comparison Matrix */}
          <div className={styles.comparisonMatrixSection}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionEyebrow}>DIRECT ARCHITECTURE AUDIT</span>
              <h2 className={styles.sectionTitle}>
                Generic Shopify Store vs. <span className={styles.accentText}>Aeethod TCG Platform</span>
              </h2>
              <p className={styles.sectionSubtitle}>
                See how a custom-built infrastructure outclasses standard e-commerce themes across every critical card retail metric.
              </p>
            </div>

            <div className={styles.comparisonTableWrapper}>
              <table className={styles.comparisonTable}>
                <thead>
                  <tr>
                    <th>Capability</th>
                    <th className={styles.tableThGeneric}>Generic Shopify / Theme</th>
                    <th className={styles.tableThAeethod}>Aeethod Custom Platform</th>
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
          <TcgPricingCards />
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
              Modular infrastructure components engineered directly into your store&apos;s custom deployment.
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

          {/* Zero-Downtime Migration Timeline */}
          <div className={styles.migrationSection} style={{ marginTop: "70px" }}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionEyebrow}>ZERO-DOWNTIME ONBOARDING</span>
              <h2 className={styles.sectionTitle}>
                How We Migrate <span className={styles.accentText}>Your Card Catalog</span>
              </h2>
              <p className={styles.sectionSubtitle}>
                A four-step deployment protocol ensuring not a single SKU is double-sold or lost during launch.
              </p>
            </div>

            <div className={styles.migrationStepsGrid}>
              {MIGRATION_STEPS.map((step, sIdx) => (
                <div key={sIdx} className={styles.migrationStepCard}>
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
                Everything you need to know about catalog migrations, zero-downtime launches, and owning your code.
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
              <h3 className={styles.formTitle}>Discuss Your Store&apos;s Setup</h3>
              <p className={styles.formSubtitle}>
                Have a specific question about your catalog size, POS sync, or buylist requirements? Speak directly with our lead architect.
              </p>

              {formSubmitted ? (
                <div style={{ color: "#10B981", fontSize: "16px", fontWeight: "600", padding: "16px 0" }}>
                  ✓ Inquiry received! A systems engineer will review your store details and reply shortly.
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
                    placeholder="Describe your current store setup, SKU count, or what bottlenecks you are experiencing..."
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
                  href="/services/integrations"
                  className={styles.otherServicePill}
                  onClick={playClickSound}
                >
                  <span>Stage 02 · Commerce & Marketplace Integration</span>
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
                  href="/outgrown-tcgplayer"
                  className={styles.otherServicePill}
                  onClick={playClickSound}
                >
                  <span>Guide · Has Your Store Outgrown TCGplayer?</span>
                  <span>→</span>
                </Link>
                <Link
                  href="/tcgplayer-vs-shopify"
                  className={styles.otherServicePill}
                  onClick={playClickSound}
                >
                  <span>Comparison · TCGplayer vs Shopify vs Custom</span>
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
