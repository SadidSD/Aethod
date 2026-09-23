"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import styles from "./ServiceInsider.module.css";
import { useTheme } from "../context/ThemeContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { servicesData } from "./ServiceCard";

export default function ServiceInsiderPage({
  id,
  stage,
  titlePrefix,
  titleAccent,
  subtitle,
  heroDescription,
  hudMetrics = [],
  quickList = [],
  blueprint = [],
  financing = {},
  faqs = []
}) {
  const { isDark } = useTheme();

  // FAQ Accordion State
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  // Form State
  const [email, setEmail] = useState("");
  const [query, setQuery] = useState("");
  const [formSubmitted, setFormSubmitted] = useState(false);

  const playClickSound = useCallback(() => {
    try {
      const audio = new Audio("/touchpad sd.mp3");
      audio.volume = 0.85;
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

  const otherServices = servicesData.filter((item) => item.id !== id);

  return (
    <div
      className={styles.pageWrapper}
      data-theme={isDark ? "dark" : "light"}
      suppressHydrationWarning={true}
    >
      <Navbar activePage="services" />

      <main className={styles.mainContainer}>
        {/* Back to Services Button */}
        <div className={styles.backBtnWrapper}>
          <Link
            href="/services"
            className={styles.backBtn}
            onClick={playClickSound}
          >
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
            <span className={styles.stageEyebrow}>{stage}</span>
            <h1 className={styles.heroTitle}>
              {titlePrefix}
              <span className={styles.heroTitleHighlight}>{titleAccent}</span>
            </h1>
            <p className={styles.heroSubtitle}>{subtitle}</p>
            <p className={styles.heroDescription}>{heroDescription}</p>

            <div className={styles.heroCtaGroup}>
              <button
                className={styles.primaryBtn}
                onClick={() => {
                  playClickSound();
                  document
                    .getElementById("blueprint")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                <span>Explore Architecture</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M7 13l5 5 5-5M12 6v12" />
                </svg>
              </button>

              <Link
                href="/contracts"
                className={styles.secondaryBtn}
                onClick={playClickSound}
              >
                <span>Start a Conversation</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>

          {/* Right-Side Neomorphic Visual Card */}
          <div className={styles.heroRight}>
            <div className={styles.heroVisualCard}>
              <div className={styles.hudHeader}>
                <div className={styles.hudStatus}>
                  <span className={styles.statusDot} />
                  <span>SYSTEM OPERATIONAL</span>
                </div>
                <span className={styles.hudTag}>{id.toUpperCase()} · BLUEPRINT</span>
              </div>

              <div className={styles.hudMetricsList}>
                {hudMetrics.map((item, idx) => (
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

        {/* ===== QUICK LIST (PROBLEMS ELIMINATED) ===== */}
        <section className={styles.quickListSection} id="quick-list">
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
            {quickList.map((item, idx) => (
              <div key={idx} className={styles.quickCard}>
                <div className={styles.quickCardHeader}>
                  <div className={styles.quickCardIcon}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <h3 className={styles.quickCardTitle}>{item.title}</h3>
                </div>
                <p className={styles.quickCardDesc}>{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ===== ARCHITECTURE BLUEPRINT ===== */}
        <section className={styles.blueprintSection} id="blueprint">
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
            {blueprint.map((mod, idx) => (
              <div key={idx} className={styles.blueprintCard}>
                <div>
                  <div className={styles.moduleNum}>{mod.num || `MODULE ${idx + 1}`}</div>
                  <h3 className={styles.moduleTitle}>{mod.title}</h3>
                  <p className={styles.moduleDesc}>{mod.desc}</p>
                </div>
                {mod.tag && <span className={styles.moduleTag}>{mod.tag}</span>}
              </div>
            ))}
          </div>
        </section>

        {/* ===== PROJECT FINANCING ===== */}
        <section className={styles.financingSection}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionEyebrow}>INVESTMENT & TRANSPARENCY</span>
            <h2 className={styles.sectionTitle}>
              Project <span className={styles.accentText}>Financing</span>
            </h2>
            <p className={styles.sectionSubtitle}>
              Clear architectural parameters with zero recurring percentage fees or hidden maintenance traps.
            </p>
          </div>

          <div className={styles.financingGrid}>
            <div className={styles.financingCard}>
              <div>
                <h3 className={styles.priceTitle}>Average Investment Range</h3>
                <div className={styles.priceBarWrapper}>
                  <img
                    src="/services/tcg/pricebar/Praicing.svg"
                    alt="Price Bar Range"
                    className={styles.priceBarSvg}
                  />
                  <div className={styles.priceLabels}>
                    <span>{financing.minPrice || "$3,500"}</span>
                    <span>{financing.maxPrice || "$9,500"}</span>
                  </div>
                </div>
              </div>
              <p className={styles.priceNotice}>
                {financing.notice ||
                  "Precision engineering cannot be packaged. Every system is scoped individually based on catalog depth and systemic integration."}
              </p>
            </div>

            <div className={styles.financingCard}>
              <div>
                <h3 className={styles.priceTitle}>Scoping Criteria</h3>
                <p className={styles.scopingBody}>
                  {financing.body ||
                    "Our structural engagements scale upward depending entirely on the architectural depth your shop demands. The final investment is directly defined by your catalog SKU volume, custom checkout or buylist workflows, and marketplace API frequency."}
                </p>
              </div>

              {financing.scopeTags && (
                <div className={styles.scopePillRow}>
                  {financing.scopeTags.map((tag, tIdx) => (
                    <span key={tIdx} className={styles.scopePill}>
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ===== FAQ & DIRECT QUESTION SECTION ===== */}
        <section className={styles.faqSection}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionEyebrow}>FREQUENTLY ASKED QUESTIONS</span>
            <h2 className={styles.sectionTitle}>
              Common Questions & <span className={styles.accentText}>Direct Answers</span>
            </h2>
            <p className={styles.sectionSubtitle}>
              Everything you need to know about migrations, zero-downtime launches, and owning your code.
            </p>
          </div>

          <div className={styles.channelGrid}>
            <div className={styles.channelCard}>
              <h3 className={styles.channelTitle}>Ask Smith</h3>
              <p className={styles.channelDesc}>
                Our core intelligence agent is trained on our architectural logic and ready to answer your technical questions 24/7 with zero sales fluff.
              </p>
            </div>

            <div className={styles.channelCard}>
              <h3 className={styles.channelTitle}>Direct Lead Channel</h3>
              <p className={styles.channelDesc}>
                Need to discuss unique counter setups, custom warehouse bins, or high-volume buylists? Speak directly with our lead system architect.
              </p>
            </div>
          </div>

          {/* Interactive FAQ Accordion */}
          {faqs.length > 0 && (
            <div className={styles.faqList}>
              {faqs.map((faq, fIdx) => {
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
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </div>
                    {isOpen && <p className={styles.faqAnswer}>{faq.a}</p>}
                  </div>
                );
              })}
            </div>
          )}

          {/* Direct Inquiry Form */}
          <div className={styles.inquiryFormContainer}>
            <h3 className={styles.formTitle}>Ask a Question Directly</h3>
            <p className={styles.formSubtitle}>
              Have a specific question about your store&apos;s setup? Send it straight to our engineering team.
            </p>

            {formSubmitted ? (
              <div style={{ color: "#10B981", fontSize: "16px", fontWeight: "500", padding: "12px 0" }}>
                ✓ Inquiry received! An engineer will review your store details and reply shortly.
              </div>
            ) : (
              <form onSubmit={handleFormSubmit}>
                <div className={styles.formRow}>
                  <input
                    type="email"
                    placeholder="Your work or store email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={styles.formInput}
                    required
                  />
                  <button type="submit" className={styles.submitBtn}>
                    <span>Send Message</span>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="22" y1="2" x2="11" y2="13" />
                      <polygon points="22 2 15 22 11 13 2 9 22 2" />
                    </svg>
                  </button>
                </div>
                <textarea
                  placeholder="Describe your current software setup or what bottlenecks you are experiencing..."
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
              {otherServices.map((svc) => (
                <Link
                  key={svc.id}
                  href={svc.href}
                  className={styles.otherServicePill}
                  onClick={playClickSound}
                >
                  <span>{svc.titlePrefix} {svc.titleAccent}</span>
                  <span>→</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
