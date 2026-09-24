"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./TcgTopicPage.module.css";
import { useTheme } from "../../context/ThemeContext";
import Navbar from "../Navbar";
import Footer from "../Footer";

export default function TcgTopicPage({
  badge,
  title,
  highlightedTitle,
  subtitle,
  breadcrumbTitle,
  answerBlock,
  evidence,
  deepDiveSections = [],
  comparisonTable,
  faqs = [],
  relatedPages = [],
  ctaTitle = "Has Your TCG Business Outgrown Marketplace Limits?",
  ctaDesc = "The first conversation costs nothing. We examine your active SKU catalog, marketplace fees, and operational bottlenecks to determine if custom infrastructure makes commercial sense.",
}) {
  const { isDark } = useTheme();
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  return (
    <div
      className={styles.pageWrapper}
      data-theme={isDark ? "dark" : "light"}
      suppressHydrationWarning
    >
      <Navbar activePage="services" />

      <main className={styles.mainContainer}>
        {/* Breadcrumb Navigation */}
        <nav className={styles.breadcrumbNav} aria-label="Breadcrumb">
          <Link href="/" className={styles.breadcrumbLink}>
            Home
          </Link>
          <span className={styles.breadcrumbSeparator}>/</span>
          <Link href="/services" className={styles.breadcrumbLink}>
            Services
          </Link>
          <span className={styles.breadcrumbSeparator}>/</span>
          <span className={styles.breadcrumbCurrent}>
            {breadcrumbTitle || title}
          </span>
        </nav>

        {/* Hero Header */}
        <header className={styles.heroHeader}>
          {badge && <div className={styles.topicBadge}>{badge}</div>}
          <h1 className={styles.heroTitle}>
            {title}{" "}
            {highlightedTitle && (
              <span className={styles.accentGradient}>{highlightedTitle}</span>
            )}
          </h1>
          {subtitle && <p className={styles.heroSubtitle}>{subtitle}</p>}
        </header>

        {/* GEO Answer Block (First 150 words directly answering the core problem/query) */}
        {answerBlock && (
          <section className={styles.answerBlockCard} aria-label="Direct Summary">
            <div className={styles.answerBlockHeader}>
              <svg
                className={styles.answerIcon}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
              </svg>
              <h2 className={styles.answerBlockHeading}>
                {answerBlock.heading || "Direct Answer & Architectural Summary"}
              </h2>
            </div>
            <p className={styles.directAnswerText}>
              {answerBlock.directAnswer}
            </p>
            {answerBlock.keySignals && answerBlock.keySignals.length > 0 && (
              <div>
                <h3 className={styles.keySignalsTitle}>Key Decision Signals:</h3>
                <ul className={styles.keySignalsList}>
                  {answerBlock.keySignals.map((signal, idx) => (
                    <li key={idx} className={styles.keySignalTag}>
                      ✓ {signal}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>
        )}

        {/* Evidence & Case Study Corroboration */}
        {evidence && (
          <section className={styles.evidenceSection}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionEyebrow}>VERIFIABLE BENCHMARKS</span>
              <h2 className={styles.sectionTitle}>
                {evidence.title || "Real-World Engineering Metrics"}
              </h2>
            </div>

            {evidence.metrics && evidence.metrics.length > 0 && (
              <div className={styles.metricsGrid}>
                {evidence.metrics.map((m, idx) => (
                  <div key={idx} className={styles.metricCard}>
                    <div className={styles.metricValue}>{m.value}</div>
                    <div className={styles.metricLabel}>{m.label}</div>
                    <p className={styles.metricDesc}>{m.desc}</p>
                  </div>
                ))}
              </div>
            )}

            {evidence.caseStudy && (
              <div className={styles.caseStudyBanner}>
                <div className={styles.caseStudyContent}>
                  <span className={styles.caseStudyTag}>PROVEN IMPLEMENTATION</span>
                  <p className={styles.caseStudyText}>
                    <strong>{evidence.caseStudy.client}:</strong>{" "}
                    {evidence.caseStudy.summary}
                  </p>
                </div>
                <Link
                  href={evidence.caseStudy.link || "/works/rng-gamez"}
                  className={styles.caseStudyBtn}
                >
                  <span>Read Case Study</span>
                  <span>→</span>
                </Link>
              </div>
            )}
          </section>
        )}

        {/* Deep Dive Architecture Articles */}
        {deepDiveSections.length > 0 && (
          <section className={styles.deepDiveSection}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionEyebrow}>SYSTEM BLUEPRINT</span>
              <h2 className={styles.sectionTitle}>Technical Architecture Breakdown</h2>
            </div>

            {deepDiveSections.map((sec, idx) => (
              <article key={idx} className={styles.articleCard}>
                <h3 className={styles.articleHeading}>{sec.heading}</h3>
                {sec.paragraphs &&
                  sec.paragraphs.map((p, pIdx) => (
                    <p key={pIdx} className={styles.articleParagraph}>
                      {p}
                    </p>
                  ))}
                {sec.bulletPoints && (
                  <ul className={styles.articleBulletList}>
                    {sec.bulletPoints.map((b, bIdx) => (
                      <li key={bIdx} className={styles.articleBulletItem}>
                        {b}
                      </li>
                    ))}
                  </ul>
                )}
              </article>
            ))}
          </section>
        )}

        {/* Side-by-Side Comparison Table */}
        {comparisonTable && (
          <section className={styles.comparisonSection}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionEyebrow}>OBJECTIVE COMPARISON</span>
              <h2 className={styles.sectionTitle}>{comparisonTable.title}</h2>
            </div>

            <div className={styles.tableWrapper}>
              <table className={styles.comparisonTable}>
                <thead>
                  <tr>
                    {comparisonTable.headers.map((h, hIdx) => (
                      <th
                        key={hIdx}
                        className={hIdx === 2 ? styles.aeethodColumn : undefined}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {comparisonTable.rows.map((row, rIdx) => (
                    <tr key={rIdx}>
                      <td className={styles.featureName}>{row.feature}</td>
                      <td>{row.col1}</td>
                      <td className={styles.aeethodColumn}>{row.col2}</td>
                      {row.col3 && <td>{row.col3}</td>}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* Long-Tail FAQ Section */}
        {faqs.length > 0 && (
          <section className={styles.faqSection}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionEyebrow}>FREQUENTLY ASKED QUESTIONS</span>
              <h2 className={styles.sectionTitle}>Direct Answers to Commercial Questions</h2>
            </div>

            <div>
              {faqs.map((faq, fIdx) => {
                const isOpen = openFaqIndex === fIdx;
                return (
                  <div
                    key={fIdx}
                    className={`${styles.faqItem} ${isOpen ? styles.faqOpen : ""}`}
                  >
                    <div
                      className={styles.faqQuestionRow}
                      onClick={() => setOpenFaqIndex(isOpen ? -1 : fIdx)}
                    >
                      <h3 className={styles.faqQuestion}>{faq.q}</h3>
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
          </section>
        )}

        {/* Related Pages Internal Linking Graph */}
        {relatedPages.length > 0 && (
          <section className={styles.relatedSection}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionEyebrow}>CONNECTED INFRASTRUCTURE</span>
              <h2 className={styles.sectionTitle}>Related Modules & Guides</h2>
            </div>

            <div className={styles.relatedGrid}>
              {relatedPages.map((rel, idx) => (
                <Link key={idx} href={rel.url} className={styles.relatedCard}>
                  <span className={styles.relatedTag}>{rel.tag}</span>
                  <h3 className={styles.relatedTitle}>{rel.title}</h3>
                  <p className={styles.relatedDesc}>{rel.desc}</p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Bottom Consultative CTA Banner */}
        <section className={styles.ctaBanner}>
          <h2 className={styles.ctaTitle}>{ctaTitle}</h2>
          <p className={styles.ctaDesc}>{ctaDesc}</p>
          <div className={styles.ctaActions}>
            <Link href="/contact" className={styles.ctaPrimaryBtn}>
              <span>Start Technical Consultation</span>
              <span>→</span>
            </Link>
            <Link href="/services" className={styles.ctaSecondaryBtn}>
              <span>Explore All 4 Service Stages</span>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
