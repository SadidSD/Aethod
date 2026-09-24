"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import styles from "./automation.module.css";
import { useTheme } from "../../context/ThemeContext";
import Footer from "../../components/Footer";
import Navbar from "../../components/Navbar";

// Automation Components
import TcgAutomationStageSwitcher from "./components/TcgAutomationStageSwitcher";
import TcgRepricerSimulator from "./components/TcgRepricerSimulator";
import TcgBatchFulfillmentMockup from "./components/TcgBatchFulfillmentMockup";
import TcgAutomationCalculator from "./components/TcgAutomationCalculator";
import TcgAutomationPricingCards from "./components/TcgAutomationPricingCards";

const HUD_STATS = [
  { label: "Dynamic Market Repricing", val: "< 60s Global", highlight: true },
  { label: "Packing Time Per Order", val: "70% Faster", highlight: true },
  { label: "Margin Protected / Month", val: "$1,400+ Saved", highlight: false },
  { label: "Ongoing Software SaaS", val: "$0 / Month", highlight: false }
];

const PROBLEMS = [
  {
    icon: "📉",
    title: "Tournament Spikes Sniping Your Stock",
    desc: "A card spikes 40% over the weekend after a championship win. You wake up on Monday morning to find your entire inventory cleared out at last month's obsolete prices."
  },
  {
    icon: "🖨",
    title: "Single-Order Copy-Paste Shipping",
    desc: "Staff spend 3 hours every afternoon printing shipping labels one by one, manually typing tracking numbers into TCGplayer, eBay, and your website."
  },
  {
    icon: "🔍",
    title: "Hunting Through Disorganized Binders",
    desc: "Fulfillers criss-cross the store searching through dozens of unsorted binders and display counters to track down a single $4 foil."
  },
  {
    icon: "📦",
    title: "Low Inventory Blind Spots",
    desc: "You run completely out of dragon shield sleeves, toploaders, or booster boxes before noticing, losing lucrative add-on sales at the register."
  }
];

const BLUEPRINT = [
  {
    num: "MODULE 01",
    tag: "Pricing Engine",
    title: "Dynamic Market Repricer",
    desc: "Algorithmic rules that monitor TCGplayer market trends and automatically adjust prices while strictly enforcing your minimum profit floors."
  },
  {
    num: "MODULE 02",
    tag: "Fulfillment",
    title: "1-Click Thermal Batching",
    desc: "Bulk generate packing slips and 4x6 shipping labels for Zebra and Rollo thermal printers without opening dozens of browser tabs."
  },
  {
    num: "MODULE 03",
    tag: "Warehouse Routing",
    title: "Single-Path Pick Lists",
    desc: "Orders automatically organized into optimal walking paths across your vault, display showcases, and binder shelves for 2x faster picking."
  },
  {
    num: "MODULE 04",
    tag: "Hardware Bridge",
    title: "High-Speed Scanner Ingestion",
    desc: "Connect optical card scanners to automatically identify set symbols, card numbers, and conditions at up to 60 cards per minute."
  },
  {
    num: "MODULE 05",
    tag: "Margin Security",
    title: "Marketplace Fee Padding",
    desc: "Automatically add marketplace commission buffers (+13.2% on eBay) so your net profit remains identical across all selling channels."
  },
  {
    num: "MODULE 06",
    tag: "Inventory Alerts",
    title: "Low-Stock Webhook Alerts",
    desc: "Real-time Discord, Slack, or SMS notifications when high-velocity sealed product or supply essentials drop below safety thresholds."
  },
  {
    num: "MODULE 07",
    tag: "Multi-Channel Broadcast",
    title: "Instant Multi-Channel Push",
    desc: "Broadcast newly updated prices and stock quantities across Storefront, TCGplayer Direct, and eBay in under 60 seconds."
  },
  {
    num: "MODULE 08",
    tag: "Auditing",
    title: "End-of-Day Velocity Digest",
    desc: "Automated daily summaries showing top-performing cards, repricing activity, and shipping velocity delivered to your phone."
  }
];

const ONBOARDING_STEPS = [
  {
    step: "STEP 01",
    title: "Pricing Rules & Margin Floor Audit",
    desc: "We analyze your catalog to establish minimum profit thresholds, game-specific repricing rules, and marketplace commission buffers."
  },
  {
    step: "STEP 02",
    title: "Repricing Simulation Mode",
    desc: "The repricer runs in dry-run shadow mode for 7 days, letting you review simulated price adjustments before any live marketplace listings change."
  },
  {
    step: "STEP 03",
    title: "Fulfillment & Printer Bridge Setup",
    desc: "We configure your thermal shipping label printers (Zebra, Rollo) and connect your USPS/UPS shipping accounts for 1-click batch generation."
  },
  {
    step: "STEP 04",
    title: "Live Autonomous Cutover",
    desc: "Autonomous repricing, batch fulfillment, and restock alerts go live. Staff hours are immediately reclaimed and margins are protected forever."
  }
];

const FAQS = [
  {
    q: "Will the repricer ever accidentally sell our cards below what we paid?",
    a: "Never. Every card in your catalog is locked with a hard profit floor. Even if a competitor creates a fraudulent low-ball listing, the algorithm will never drop below your specified minimum margin."
  },
  {
    q: "How does 1-click thermal batch fulfillment work?",
    a: "Instead of generating shipping labels individually across TCGplayer, eBay, and your website, Aeethod pools all pending orders into a unified queue. One click prints all 4x6 labels and packing slips directly to your thermal printer while automatically pushing tracking numbers back to all marketplaces."
  },
  {
    q: "Can we exclude vintage or high-value cards from automatic repricing?",
    a: "Yes. You can easily mark specific cards, graded slabs, or entire sets as 'Manual Price Only' so automated rules will never touch them."
  },
  {
    q: "Do we have to pay monthly subscription fees for repricing or shipping?",
    a: "No. Third-party tools charge $300 to $800+ every month. Aeethod builds dedicated cloud pipelines running on serverless infrastructure that you own forever with zero recurring software taxes."
  },
  {
    q: "Does this integrate with optical card scanners for fast intake?",
    a: "Yes. We integrate high-speed card scanner feeds into our master catalog pipeline, allowing your staff to scan up to 60 singles per minute directly into inventory."
  }
];

export default function AutomationPage() {
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
            <span className={styles.stageEyebrow}>Stage 04 · Operational Infrastructure</span>
            <h1 className={styles.heroTitle}>
              Business <span className={styles.heroGradient}>Automation</span>
            </h1>
            <p className={styles.heroSubtitle}>
              Automate the repetitive grind. Reclaim 20+ hours of weekly staff time.
            </p>
            <p className={styles.heroDesc}>
              Remove daily retail busywork with automated dynamic repricing rules, 1-click batch thermal label printing, high-speed scanner intake, and low-inventory safety alerts. Turn your backroom into an autonomous distribution machine.
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
                <span>Explore Automation Demos</span>
                <span>→</span>
              </a>
            </div>
          </div>

          <div className={styles.heroRightCard}>
            <div className={styles.hudHeader}>
              <span className={styles.hudStatusPill}>
                <span className={styles.hudDot} />
                Autonomous Engine Active
              </span>
              <span className={styles.hudType}>Repricing & Logistics</span>
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
        <TcgAutomationStageSwitcher activeStage={activeStage} onSelectStage={handleStageSelect} />

        {/* ===== STAGE 01: OVERVIEW & AUTOMATION DEMOS ===== */}
        <div id="stage-01">
          {/* Friction Removed Section */}
          <section className={styles.problemsSection}>
            <div className={styles.sectionEyebrowCenter}>Retail Friction Removed</div>
            <h2 className={styles.sectionTitleCenter}>
              Headaches You Won’t <span className={styles.heroGradient}>Face Again</span>
            </h2>
            <p className={styles.sectionSubtitleCenter}>
              Say goodbye to sniped underpriced cards, copy-pasting tracking numbers, and wandering through disorganized binders.
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

          {/* Dynamic Market Repricer Simulator */}
          <TcgRepricerSimulator />

          {/* Batch Fulfillment & Scanner Pipeline Mockup */}
          <TcgBatchFulfillmentMockup />

          {/* Busywork Drain vs Automation ROI Calculator */}
          <TcgAutomationCalculator />
        </div>

        {/* ===== STAGE 02: PRICING (MIDDLE) ===== */}
        <div id="stage-02" style={{ paddingTop: "40px" }}>
          <TcgAutomationPricingCards />
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
              Modular autonomous automation pipelines engineered directly into your store's inventory and shipping workflow.
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
              How We Automate <span className={styles.heroGradient}>Your Operations</span>
            </h2>
            <p className={styles.sectionSubtitleCenter}>
              A 4-step deployment protocol designed to activate autonomous repricing and fulfillment with zero risk to current sales.
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
              Everything you need to know about profit floors, thermal hardware compatibility, and zero-subscription pipelines.
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
            <h2 className={styles.ctaTitle}>Automate Your Card Shop Operations</h2>
            <p className={styles.ctaDesc}>
              Ready to eliminate 20+ hours of weekly busywork? Speak directly with our systems automation architect.
            </p>
            <form
              className={styles.ctaForm}
              onSubmit={(e) => {
                e.preventDefault();
                playClickSound();
                alert("Thank you! Our automation systems architect will reach out shortly.");
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
            <Link href="/tcg-pricing-automation" style={{ padding: "12px 24px", borderRadius: "9999px", background: "rgba(79, 70, 229, 0.08)", color: "#4F46E5", fontWeight: 600, fontSize: "14px", textDecoration: "none" }}>
              Architecture · Algorithmic Repricing Engine →
            </Link>
            <Link href="/tcg-store-automation" style={{ padding: "12px 24px", borderRadius: "9999px", background: "rgba(79, 70, 229, 0.08)", color: "#4F46E5", fontWeight: 600, fontSize: "14px", textDecoration: "none" }}>
              Architecture · Batch Fulfillment & Intake →
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
