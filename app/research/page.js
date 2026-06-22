"use client";

import { useState, useCallback, useEffect } from "react";
import styles from "./page.module.css";
import { useTheme } from "../context/ThemeContext";
import ThemeToggle from "../components/ThemeToggle";

function InlineSVG({ src, className, style }) {
  const [svgContent, setSvgContent] = useState("");

  useEffect(() => {
    fetch(src)
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to load SVG: ${src}`);
        return res.text();
      })
      .then((text) => {
        const cleanText = text.replace(/<\?xml[^>]*\?>/i, "");
        setSvgContent(cleanText);
      })
      .catch((err) => console.error(err));
  }, [src]);

  return (
    <div
      className={className}
      style={style}
      dangerouslySetInnerHTML={{ __html: svgContent }}
    />
  );
}

export default function ResearchPage() {
  const { isDark } = useTheme();
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filters = [
    "All",
    "Systems",
    "AI + Automation",
    "Research",
    "Case Studies",
    "Frame Work",
    "Thought l..."
  ];

  const cardsData = [
    {
      id: "clarity-gap",
      type: "full-width",
      tag: "Research",
      tagType: "green",
      readTime: "10 min read",
      date: "April 2026",
      title: "The Clarity Gap:",
      subtitle: "Why more data produces less understanding",
      description: "Organisations accumulate instruments that measure, track, and surface. The paradox is that each new signal tends to obscure rather than illuminate. This is not a data problem — it is a systems design problem with a very specific solution.",
      essayLink: "#",
      filters: ["Research"],
      illustrationType: "graph"
    },
    {
      id: "side-by-side-row",
      type: "side-by-side",
      cards: [
        {
          id: "designing-uncertainty",
          tag: "Systems",
          tagType: "blue",
          readTime: "10 min read",
          date: "December 2025",
          title: "Designing for Uncertainty:",
          subtitle: "A framework for adaptive business systems",
          description: "Stable systems are not systems that do not change. They are systems that know how to change — a breakdown of how to architect for environments where the rules keep shifting.",
          essayLink: "#",
          filters: ["Systems"]
        },
        {
          id: "inside-tcg-pricing",
          tag: "Case Study",
          tagType: "gray",
          readTime: "5 min read",
          date: "February 2026",
          title: "Inside TCG pricing:",
          subtitle: "How market fragmentation creates operational chaos",
          description: "Stable systems are not systems that do not change. They are systems that know how to change — a breakdown of how to architect for environments where the rules keep shifting.",
          essayLink: "#",
          filters: ["Case Studies"]
        }
      ]
    },
    {
      id: "multi-agent",
      type: "full-width",
      tag: "Research",
      tagType: "green",
      readTime: "12 min read",
      date: "April 2026",
      title: "Multi-Agent",
      subtitle: "Multi-Agent E-Commerce Ecosystem Architectures",
      description: "This study develops a decentralized system where specialized AI agents autonomously manage inventory, trust-level adjustments, and TCG price visibility.",
      essayLink: "#",
      filters: ["Research", "AI + Automation"],
      illustrationType: "circle"
    },
    {
      id: "predictive-latency",
      type: "full-width",
      tag: "Research",
      tagType: "green",
      readTime: "12 min read",
      date: "April 2026",
      title: "Predictive Latency",
      subtitle: "Predictive Latency in Scalable Systems",
      description: "This study develops a decentralized system where specialized AI agents autonomously manage inventory, trust-level adjustments, and TCG price visibility.",
      essayLink: "#",
      filters: ["Research"],
      illustrationType: "triangle"
    }
  ];

  // Search filter function
  const matchesSearch = (item, query) => {
    if (!query) return true;
    const lowerQuery = query.toLowerCase();
    return (
      item.title?.toLowerCase().includes(lowerQuery) ||
      item.subtitle?.toLowerCase().includes(lowerQuery) ||
      item.description?.toLowerCase().includes(lowerQuery)
    );
  };

  // Filter and search logic
  const filteredCards = cardsData.reduce((acc, row) => {
    if (row.type === "full-width") {
      const matchesFilter = activeFilter === "All" || row.filters.includes(activeFilter);
      const matchesSearchQuery = matchesSearch(row, searchQuery);
      if (matchesFilter && matchesSearchQuery) {
        acc.push(row);
      }
    } else if (row.type === "side-by-side") {
      const matchingSubcards = row.cards.filter((card) => {
        const matchesFilter = activeFilter === "All" || card.filters.includes(activeFilter);
        const matchesSearchQuery = matchesSearch(card, searchQuery);
        return matchesFilter && matchesSearchQuery;
      });

      if (matchingSubcards.length > 0) {
        acc.push({
          ...row,
          cards: matchingSubcards
        });
      }
    }
    return acc;
  }, []);

  const clarityGapCard = cardsData.find((c) => c.id === "clarity-gap");
  const isClarityGapVisible =
    matchesSearch(clarityGapCard, searchQuery) &&
    (activeFilter === "All" || clarityGapCard.filters.includes(activeFilter));

  const otherFilteredCards = filteredCards.filter((c) => c.id !== "clarity-gap");

  return (
    <div className={styles.pageWrapper} data-theme={isDark ? "dark" : "light"}>
      {/* ===== FLOATING NAVIGATION PILL ===== */}
      <div className={styles.navOuter}>
        <nav className={styles.navbar} id="navbar">
          <div className={styles.navContent}>
            {/* Circular Logo */}
            <a href="/" className={styles.logo} aria-label="Aeethod Home">
              <InlineSVG src="/navbar logo.svg" className={styles.logoImg} />
            </a>

            {/* Navigation Links */}
            <div className={styles.navLinks}>
              <a href="/studio" className={styles.navLink}>
                Studio
              </a>
              <a href="/services" className={styles.navLink}>
                Services
              </a>
              <a href="/blog" className={styles.navLink}>
                Blog
              </a>
              <a href="/products" className={styles.navLink}>
                Products
              </a>
              <a href="/journals" className={styles.navLink}>
                Works
              </a>
              <a href="/contact" className={styles.navLink}>
                Contact
              </a>
              <a href="/research" className={`${styles.navLink} ${styles.activeNavLink}`}>
                Research
              </a>
            </div>
          </div>
        </nav>
      </div>

      {/* ===== MAIN CONTENT WRAPPER ===== */}
      <main className={styles.mainContainer}>
        {/* ----- FIGMA HEADER & FILTERS WRAPPER ----- */}
        <div className={styles.figmaHeaderAndFiltersContainer}>
          {/* Header Title (Frame 91) */}
          <div className={styles.frame91}>
            <h1 className={styles.researchTitle}>
              Re<span className={styles.purpleText}>search</span>
            </h1>
            <div className={styles.weThink}>We think before we sell.</div>
          </div>

          {/* Theme Switch Toggle (Slide Button) */}
          <ThemeToggle className={styles.slideButtonWrapper} />

          {/* Filter and Search Bar (Frame 135) */}
          <div className={styles.frame135}>
            <div className={styles.frame135Inner}>
              <span className={styles.filterLabel}>Filter</span>
              <div className={styles.filterBarButtons}>
                {filters.map((f, idx) => {
                  const isSelected = activeFilter === f;
                  if (idx === 0) {
                    return (
                      <button
                        key={f}
                        onClick={() => setActiveFilter(f)}
                        className={`${styles.filterChipAll} ${
                          isSelected ? styles.filterChipAllActive : ""
                        }`}
                      >
                        <span className={isSelected ? styles.filterTextActive : styles.filterText}>
                          {f}
                        </span>
                      </button>
                    );
                  } else {
                    return (
                      <button
                        key={f}
                        onClick={() => setActiveFilter(f)}
                        className={`${styles.filterChipOther} ${
                          isSelected ? styles.filterChipOtherActive : ""
                        }`}
                      >
                        <span className={isSelected ? styles.filterTextActive : styles.filterText}>
                          {f}
                        </span>
                      </button>
                    );
                  }
                })}
              </div>

              {/* Round Slide Arrow */}
              <div className={styles.ellipse30}>
                <svg className={styles.arrowIconDown} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 5V19M12 19L19 12M12 19L5 12" stroke="#404040" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>

              {/* Search Mini Container */}
              <div className={styles.searchMini}>
                <div className={styles.rectangle73}>
                  <input
                    type="text"
                    placeholder="Search Filters"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={styles.searchFiltersInput}
                  />
                </div>
                <div className={styles.searchUp}>
                  <svg className={styles.searchIconSvg} viewBox="0 0 24 24" fill="none" stroke="#717171" strokeWidth="2" strokeLinecap="round">
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ----- FIRST CARD ("THE CLARITY GAP") ----- */}
        {isClarityGapVisible && (
          <div className={styles.clarityGapCardContainer}>
            {/* Side Indicator */}
            <InlineSVG src="/research/Side Indicator.svg" className={styles.sideIndicator} />

            {/* Frame 140 (Tags) */}
            <div className={styles.frame140}>
              <div className={styles.tagPillResearch}>Research</div>
              <div className={styles.tagPillDate}>April 2026</div>
            </div>

            {/* Title & Subtitle & Description */}
            <h2 className={styles.clarityTitle}>The Clarity Gap:</h2>
            <h3 className={styles.claritySubtitle}>
              Why more data produces <span className={styles.lessUnderstandingText}>less understanding</span>
            </h3>
            <p className={styles.clarityDescription}>
              Organisations accumulate instruments that measure, track, and surface. The paradox is that each new signal tends to obscure rather than illuminate. This is not a data problem — it is a systems design problem with a very specific solution.
            </p>

            {/* Buttons */}
            <div className={styles.btn18Min}>18 min read</div>
            <a href="#" className={styles.btnReadEssay}>
              <span>Read essay</span>
              <svg className={styles.arrowIconRight} viewBox="0 0 11 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 1L5.5 5L10 1" stroke="#717171" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>

            {/* Graph Card (Rectangle 79) */}
            <div className={styles.rectangle79}>
              {/* Lines & SVGs inside Graph */}
              <InlineSVG src="/research/Line 2.svg" className={styles.line2} />
              <InlineSVG src="/research/Line 3.svg" className={styles.line3} />
              <InlineSVG src="/research/Line 4.svg" className={styles.line4} />
              <InlineSVG src="/research/Line 5.svg" className={styles.line5} />
              
              <InlineSVG src="/research/Ellipse 32.svg" className={styles.ellipse32} />
              <InlineSVG src="/research/Vector 32.svg" className={styles.vector32} />
              
              {/* Graph Labels (HTML text styled in Sora font) */}
              <div className={styles.peakClarityLabelText}>Peak Clarity</div>
              <div className={styles.noiseFloorLabelText}>Noise Floor</div>
              <div className={styles.dataVolumeLabelText}>Data Volume</div>
            </div>
          </div>
        )}

        {/* ----- OTHER CARDS LIST ----- */}
        <div className={styles.cardsList} style={{ marginTop: isClarityGapVisible ? "0px" : "40px" }}>
          {otherFilteredCards.map((row, idx) => {
            if (row.type === "full-width") {
              return (
                <div key={row.id}>
                  {(!isClarityGapVisible || idx > 0) && <div className={styles.divider} />}
                  <div className={styles.cardRow}>
                    <div className={styles.cardLeft}>
                      <div className={styles.tagRow}>
                        <span
                          className={`${styles.tag} ${
                            row.tagType === "green" ? styles.tagGreen : styles.tagBlue
                          }`}
                        >
                          {row.tag}
                        </span>
                        <span className={`${styles.tag} ${styles.tagGray}`}>
                          {row.readTime}
                        </span>
                      </div>
                      <h2 className={styles.cardTitle}>{row.title}</h2>
                      <div className={styles.cardSubtitle}>{row.subtitle}</div>
                      <p className={styles.cardDesc}>{row.description}</p>
                      <div className={styles.btnRow}>
                        <button className={styles.btnPill}>{row.readTime}</button>
                        <a href={row.essayLink} className={styles.btnLink}>
                          Read essay &gt;
                        </a>
                      </div>
                    </div>
                    <div className={styles.illustrationContainer}>
                      {row.illustrationType === "circle" && (
                        <div
                          className={styles.illustrationWrapper}
                          style={{ width: "305px", height: "304px" }}
                        >
                          <InlineSVG src="/research/Circle.svg" className={styles.illustrationSvg} />
                          <div className={`${styles.agentLabel} ${styles.agentCenter}`}>
                            Mass
                          </div>
                          <div className={`${styles.agentLabel} ${styles.agentTop}`}>
                            Agent 2
                          </div>
                          <div className={`${styles.agentLabel} ${styles.agentBottom}`}>
                            Agent 4
                          </div>
                          <div className={`${styles.agentLabel} ${styles.agentLeft}`}>
                            Agent 1
                          </div>
                          <div className={`${styles.agentLabel} ${styles.agentRight}`}>
                            Agent 3
                          </div>
                        </div>
                      )}

                      {row.illustrationType === "triangle" && (
                        <div
                          className={styles.illustrationWrapper}
                          style={{ width: "387px", height: "240px" }}
                        >
                          <InlineSVG src="/research/Group 39.svg" className={styles.illustrationSvg} />
                          <div className={styles.triangleLabel}>Predictive Latency</div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            } else if (row.type === "side-by-side") {
              return (
                <div key={row.id}>
                  <div className={styles.divider} />
                  <div className={styles.sideBySideRow}>
                    {row.cards.map((card) => (
                      <div key={card.id} className={styles.sideCard}>
                        <div className={styles.tagRow}>
                          <span
                            className={`${styles.tag} ${
                              card.tagType === "blue"
                                ? styles.tagBlue
                                : card.tagType === "green"
                                ? styles.tagGreen
                                : styles.tagGray
                            }`}
                          >
                            {card.tag}
                          </span>
                          <span className={`${styles.tag} ${styles.tagGray}`}>
                            {card.readTime}
                          </span>
                        </div>
                        <h2 className={styles.cardTitle}>{card.title}</h2>
                        <div className={styles.cardSubtitle}>{card.subtitle}</div>
                        <p className={styles.cardDesc}>{card.description}</p>
                        <div className={styles.btnRow}>
                          <button className={styles.btnPill}>{card.readTime}</button>
                          <a href={card.essayLink} className={styles.btnLink}>
                            Read essay &gt;
                          </a>
                        </div>
                      </div>
                    ))}
                    {row.cards.length === 2 && <div className={styles.verticalDivider} />}
                  </div>
                </div>
              );
            }
            return null;
          })}
        </div>

        {/* ----- NEUMORPHIC FOOTER ----- */}
        <div className={styles.divider} />
        <footer className={styles.footerContainer}>
          <div className={styles.footerTop}>
            <div className={styles.footerLeft}>
              <div className={styles.footerLogoWrapper}>
                <svg
                  className={styles.footerLogoIcon}
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 2L2 22h20L12 2zm0 4.8L18.6 19H5.4L12 6.8z"
                    fill="var(--text-primary)"
                  />
                </svg>
                <span className={styles.footerLogo}>Aeethod</span>
              </div>
              <p className={styles.footerTagline}>
                We build the intelligence layer
                <br />
                that makes human decisions
                <br />
                faster, more, less.
              </p>
              <div className={styles.socialIcons}>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noreferrer"
                  className={styles.socialIcon}
                  aria-label="LinkedIn"
                >
                  <svg viewBox="0 0 24 24">
                    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
                  </svg>
                </a>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noreferrer"
                  className={styles.socialIcon}
                  aria-label="GitHub"
                >
                  <svg viewBox="0 0 24 24">
                    <path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.34 1.07 2.91.83.1-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z" />
                  </svg>
                </a>
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noreferrer"
                  className={styles.socialIcon}
                  aria-label="YouTube"
                >
                  <svg viewBox="0 0 24 24">
                    <path d="M23 12s0-3.85-.5-5.38a3 3 0 0 0-2.12-2.12C18.85 4 12 4 12 4s-6.85 0-8.38.5a3 3 0 0 0-2.12 2.12C1 8.15 1 12 1 12s0 3.85.5 5.38a3 3 0 0 0 2.12 2.12C5.15 20 12 20 12 20s6.85 0 8.38-.5a3 3 0 0 0 2.12-2.12c.5-1.53.5-5.38.5-5.38zM9.75 15.02V8.98L15 12l-5.25 3.02z" />
                  </svg>
                </a>
              </div>
            </div>
            <div className={styles.footerLinks}>
              <a href="/studio" className={styles.footerLink}>
                Studio
              </a>
              <a href="/services" className={styles.footerLink}>
                System
              </a>
              <a href="/research" className={styles.footerLink}>
                Research
              </a>
              <a href="/products" className={styles.footerLink}>
                Products
              </a>
              <a href="/journals" className={styles.footerLink}>
                Journals
              </a>
              <a href="/contact" className={styles.footerLink}>
                Contact
              </a>
            </div>
          </div>
          <div className={styles.footerBottom}>
            <div className={styles.copyright}>
              @2026 Aeethod. All rights reserved.
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
