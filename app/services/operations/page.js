"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import styles from "./operations.module.css";
import { useTheme } from "../../context/ThemeContext";
import Footer from "../../components/Footer";
import Navbar from "../../components/Navbar";

// Operations Components
import TcgOperationsStageSwitcher from "./components/TcgOperationsStageSwitcher";
import TcgBuylistSimulator from "./components/TcgBuylistSimulator";
import TcgGradingMatrix from "./components/TcgGradingMatrix";
import TcgBuylistCalculator from "./components/TcgBuylistCalculator";
import TcgOperationsPricingCards from "./components/TcgOperationsPricingCards";

const HUD_STATS = [
  { label: "Buylist Trade-In Intake", val: "3x Faster", highlight: true },
  { label: "Condition Disputes Reduced", val: "85% Drop", highlight: true },
  { label: "High-Ticket Slab Vault", val: "100% Serial Logged", highlight: false },
  { label: "Nightly Register Closeout", val: "< 5 Min Reconcile", highlight: false }
];

const PROBLEMS = [
  {
    icon: "⏱",
    title: "45-Minute Binder Trade-In Lines",
    desc: "Customers drop 200-card binders at the counter during peak Saturday tournaments. Staff manually lookup prices card-by-card on phones while lines back up out the door."
  },
  {
    icon: "⚖",
    title: "Subjective Grading Disagreements",
    desc: "A collector claims their vintage Holo is Near Mint. One clerk calls it LP; another calls it MP. Inconsistent evaluations burn customer trust and leak shop margin."
  },
  {
    icon: "💳",
    title: "Chaotic Cash vs. Store Credit Spreads",
    desc: "Staff struggle with manual margin calculations (e.g. 60% cash vs 75% credit) across different game categories, leading to costly accounting mistakes at checkout."
  },
  {
    icon: "🔒",
    title: "Untracked Graded Slabs in Display Cases",
    desc: "High-value $500+ PSA and BGS slabs sit in glass cabinets without serialized tracking, creating inventory shrinkage and panic during shift handoffs."
  }
];

const BLUEPRINT = [
  {
    num: "MODULE 01",
    tag: "Customer Portal",
    title: "Online Customer Buylist Portal",
    desc: "Allow collectors to search cards, check live cash/credit offer rates, and submit trade-in manifests from home before visiting."
  },
  {
    num: "MODULE 02",
    tag: "Counter Terminal",
    title: "Rapid Counter Staff Intake Screen",
    desc: "High-speed intake interface with barcode scanning, batch acceptance, and 1-click condition adjustments."
  },
  {
    num: "MODULE 03",
    tag: "Margin Engine",
    title: "Algorithmic Valuation Spreads",
    desc: "Automate custom margin spreads (e.g. 60% cash / 75% credit) tied dynamically to live TCGplayer market averages."
  },
  {
    num: "MODULE 04",
    tag: "Quality Control",
    title: "Standardized Grading Matrix",
    desc: "Objective physical inspection rules and condition checklist enforcing consistent NM/LP/MP/HP standards across all clerks."
  },
  {
    num: "MODULE 05",
    tag: "Vault Security",
    title: "Graded Slab Serial Registry",
    desc: "Track high-ticket slabs ($500+) by unique certification numbers, safe deposit bin location, and insurance records."
  },
  {
    num: "MODULE 06",
    tag: "Unified Ledger",
    title: "Omnichannel Store Credit System",
    desc: "Centralized customer credit balance usable interchangeably at the physical counter and on your web storefront."
  },
  {
    num: "MODULE 07",
    tag: "Hardware Bridge",
    title: "Thermal Slip & Barcode Pipeline",
    desc: "Auto-print buylist intake claim tickets, customer trade agreement slips, and barcode stickers for binder sorting."
  },
  {
    num: "MODULE 08",
    tag: "Fraud Prevention",
    title: "Employee Audit & Drawer Logs",
    desc: "Granular audit trails of who accepted which trade, manager cash override logs, and balanced end-of-shift receipts."
  }
];

const ONBOARDING_STEPS = [
  {
    step: "STEP 01",
    title: "Counter Hardware & POS Audit",
    desc: "We review your counter registers, thermal receipt printers, barcode scanners, and display case setup to map optimal hardware tie-ins."
  },
  {
    step: "STEP 02",
    title: "Buylist Margin & Grading Matrix Setup",
    desc: "We configure your exact cash/credit spreads by card game (Pokémon, MTG, One Piece) and calibrate your condition discount multipliers."
  },
  {
    step: "STEP 03",
    title: "Counter Staff Shadow Testing",
    desc: "We run mock binder trade-in trials with your clerks to verify sub-minute batch scans, thermal print speeds, and override permissions."
  },
  {
    step: "STEP 04",
    title: "Live Production Cutover",
    desc: "Your counter intake terminal and customer buylist portal go live with zero downtime. Backlog lines disappear and trade margins are locked."
  }
];

const FAQS = [
  {
    q: "Can we set different cash/credit buy rates for Pokémon, Magic, and One Piece?",
    a: "Yes. The valuation matrix allows you to set custom rules per game, set, rarity, or card price tier (e.g., 65% cash for Pokémon meta staples, 50% for bulk foils, 80% store credit on vintage)."
  },
  {
    q: "How does the buylist handle cards that don't match the customer's claimed condition?",
    a: "Staff can click to adjust condition during intake (e.g., NM down to MP). The system automatically re-calculates the payout and prints a revised counter slip or emails an approval request to the customer."
  },
  {
    q: "Does this connect to our existing thermal receipt printers and barcode scanners?",
    a: "Yes. We configure standard ESC/POS thermal receipt printers (Epson, Star Micronics) and 2D barcode scanners so intake tickets and inventory labels print with one click."
  },
  {
    q: "Can we restrict which employees are authorized to pay out cash trades over $200?",
    a: "Yes. The system includes role-based permissions, requiring a manager PIN or override for trade-ins exceeding your specified cash threshold."
  },
  {
    q: "How is Aeethod different from SaaS tools like BinderPOS or CardCastle?",
    a: "Those platforms charge $300 to $1,000+ every month and lock your data inside their walled garden. Aeethod builds a dedicated operational engine that you own 100% with zero recurring software taxes."
  }
];

export default function OperationsPage() {
  const { isDark } = useTheme();
  const [activeStage, setActiveStage] = useState("stage-01");
  const [openFaq, setOpenFaq] = useState(0);

  const playClickSound = useCallback(() => {
    try {
      const audio = new Audio("/touchpad sd.mp3");
      audio.volume = 0.8;
      audio.play().catch(() => {});
    } catch (e) {
      /* ignore */
    }
  }, []);

  const handleStageSelect = (stageId) => {
    setActiveStage(stageId);
    const element = document.getElementById(stageId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className={styles.pageWrapper} data-theme={isDark ? "dark" : "light"} suppressHydrationWarning={true}>
      <Navbar activePage="services" />

      <main className={styles.mainContainer}>
        {/* Back Button */}
        <div className={styles.backBtnWrapper}>
          <a href="/services" className={styles.backBtn} onClick={playClickSound}>
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.backArrow}>
              <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>Back to Services Hub</span>
          </a>
        </div>

        {/* HERO SECTION */}
        <section className={styles.heroSection}>
          <div className={styles.heroLeft}>
            <span className={styles.stageEyebrow}>Stage 03 · Behind The Counter</span>
            <h1 className={styles.heroTitle}>
              TCG Operations <span className={styles.heroGradient}>Systems</span>
            </h1>
            <p className={styles.heroSubtitle}>
              Build the high-velocity engine behind your shop counter.
            </p>
            <p className={styles.heroDesc}>
              Streamline the hardest, most error-prone parts of card retail: high-volume buylist trade-ins, condition grading disputes, cash vs. store credit issuance, and in-store counter checkout. Turn counter bottlenecks into high-velocity profit centers.
            </p>
            <div className={styles.heroCtaRow}>
              <a
                href="#stage-02"
                className={styles.heroBtnPrimary}
                onClick={(e) => {
                  e.preventDefault();
                  handleStageSelect("stage-02");
                }}
              >
                <span>View Packages & Pricing</span>
                <span>↓</span>
              </a>
              <a
                href="#stage-01"
                className={styles.heroBtnSecondary}
                onClick={(e) => {
                  e.preventDefault();
                  handleStageSelect("stage-01");
                }}
              >
                <span>Explore Counter Demos</span>
                <span>→</span>
              </a>
            </div>
          </div>

          <div className={styles.heroRightCard}>
            <div className={styles.hudHeader}>
              <span className={styles.hudStatusPill}>
                <span className={styles.hudDot} />
                Counter Engine Active
              </span>
              <span className={styles.hudType}>Intake & Vault System</span>
            </div>
            <div className={styles.hudGrid}>
              {HUD_STATS.map((stat, i) => (
                <div key={i} className={styles.hudStatBox}>
                  <span className={styles.hudStatLabel}>{stat.label}</span>
                  <span className={`${styles.hudStatVal} ${stat.highlight ? styles.hudStatValHighlight : ""}`}>
                    {stat.val}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* STICKY 3-STAGE SWITCHER */}
        <TcgOperationsStageSwitcher activeStage={activeStage} onSelectStage={handleStageSelect} />

        {/* ===== STAGE 01: OVERVIEW & COUNTER DEMOS ===== */}
        <div id="stage-01">
          {/* Friction Removed Section */}
          <section className={styles.problemsSection}>
            <div className={styles.sectionEyebrowCenter}>Counter Friction Removed</div>
            <h2 className={styles.sectionTitleCenter}>
              Headaches You Won’t <span className={styles.heroGradient}>Face Again</span>
            </h2>
            <p className={styles.sectionSubtitleCenter}>
              Say goodbye to messy binder piles, awkward grading arguments, and disconnected cash drawers.
            </p>

            <div className={styles.problemsGrid}>
              {PROBLEMS.map((prob, i) => (
                <div key={i} className={styles.problemCard}>
                  <div className={styles.problemIconWrapper}>
                    <span style={{ fontSize: "20px" }}>{prob.icon}</span>
                  </div>
                  <div>
                    <h3 className={styles.problemTitle}>{prob.title}</h3>
                    <p className={styles.problemDesc}>{prob.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Live Buylist & Condition Grading Terminal */}
          <TcgBuylistSimulator />

          {/* Standardized Grading Matrix Visualizer */}
          <TcgGradingMatrix />

          {/* Manual Trade-In Drain vs Automated ROI Calculator */}
          <TcgBuylistCalculator />
        </div>

        {/* ===== STAGE 02: PRICING (MIDDLE) ===== */}
        <div id="stage-02" style={{ paddingTop: "40px" }}>
          <TcgOperationsPricingCards />
        </div>

        {/* ===== STAGE 03: BLUEPRINT & ONBOARDING ===== */}
        <div id="stage-03" style={{ paddingTop: "40px" }}>
          {/* Architecture Blueprint */}
          <section style={{ marginBottom: "70px" }}>
            <div className={styles.sectionEyebrowCenter}>What’s Included</div>
            <h2 className={styles.sectionTitleCenter}>
              The Architecture <span className={styles.heroGradient}>Blueprint</span>
            </h2>
            <p className={styles.sectionSubtitleCenter}>
              Modular counter operational infrastructure engineered directly into your physical and digital store.
            </p>

            <div className={styles.blueprintGrid}>
              {BLUEPRINT.map((b) => (
                <div key={b.num} className={styles.blueprintCard}>
                  <div className={styles.blueprintHeader}>
                    <span className={styles.blueprintNumber}>{b.num}</span>
                    <span className={styles.blueprintTag}>{b.tag}</span>
                  </div>
                  <h3 className={styles.blueprintTitle}>{b.title}</h3>
                  <p className={styles.blueprintDesc}>{b.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Zero-Downtime Deployment */}
          <section className={styles.stepsSection}>
            <div className={styles.sectionEyebrowCenter}>Zero-Friction Deployment</div>
            <h2 className={styles.sectionTitleCenter}>
              How We Upgrade <span className={styles.heroGradient}>Your Counter</span>
            </h2>
            <p className={styles.sectionSubtitleCenter}>
              A 4-step deployment protocol designed to upgrade your counter workflow without interrupting retail trading.
            </p>

            <div className={styles.stepsGrid}>
              {ONBOARDING_STEPS.map((s) => (
                <div key={s.step} className={styles.stepCard}>
                  <div className={styles.stepNumber}>{s.step}</div>
                  <h3 className={styles.stepTitle}>{s.title}</h3>
                  <p className={styles.stepDesc}>{s.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* FAQs Accordion */}
          <section className={styles.faqsSection}>
            <div className={styles.sectionEyebrowCenter}>Frequently Asked Questions</div>
            <h2 className={styles.sectionTitleCenter}>
              Common Questions & <span className={styles.heroGradient}>Direct Answers</span>
            </h2>
            <p className={styles.sectionSubtitleCenter}>
              Everything you need to know about thermal hardware bridges, grading rules, and data ownership.
            </p>

            <div className={styles.faqAccordion}>
              {FAQS.map((faq, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div key={idx} className={styles.faqItem}>
                    <button
                      className={styles.faqHeader}
                      onClick={() => {
                        playClickSound();
                        setOpenFaq(isOpen ? -1 : idx);
                      }}
                    >
                      <h4 className={styles.faqQuestion}>{faq.q}</h4>
                      <span
                        className={styles.faqToggleIcon}
                        style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0)" }}
                      >
                        ▼
                      </span>
                    </button>
                    {isOpen && <div className={styles.faqAnswer}>{faq.a}</div>}
                  </div>
                );
              })}
            </div>
          </section>
        </div>

        {/* BOTTOM CTA FORM */}
        <section id="contact" className={styles.ctaSection}>
          <div className={styles.ctaCard}>
            <h2 className={styles.ctaTitle}>Upgrade Your Shop Counter Operations</h2>
            <p className={styles.ctaDesc}>
              Have questions about your current POS setup, barcode printers, or buylist trade rules? Let’s talk with our systems architect.
            </p>
            <form
              className={styles.ctaForm}
              onSubmit={(e) => {
                e.preventDefault();
                playClickSound();
                alert("Thank you! Our operations systems architect will reach out shortly.");
              }}
            >
              <input
                type="email"
                placeholder="Enter your store or work email"
                className={styles.ctaInput}
                required
              />
              <button type="submit" className={styles.ctaSubmitBtn}>
                <span>Send Message</span>
                <span>✈</span>
              </button>
            </form>
          </div>

          <div style={{ marginTop: "48px", display: "flex", gap: "16px", flexWrap: "wrap", justifyContent: "center" }}>
            <Link href="/tcg-buylist-system" style={{ padding: "12px 24px", borderRadius: "9999px", background: "rgba(79, 70, 229, 0.08)", color: "#4F46E5", fontWeight: 600, fontSize: "14px", textDecoration: "none" }}>
              Architecture · Turnkey TCG Buylist Portals →
            </Link>
            <Link href="/tcg-inventory-system" style={{ padding: "12px 24px", borderRadius: "9999px", background: "rgba(79, 70, 229, 0.08)", color: "#4F46E5", fontWeight: 600, fontSize: "14px", textDecoration: "none" }}>
              Architecture · Master TCG Inventory Systems →
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
