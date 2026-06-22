"use client";

import { useState, useCallback, useEffect } from "react";
import styles from "./page.module.css";
import { useTheme } from "../context/ThemeContext";
import ThemeToggle from "../components/ThemeToggle";
import Footer from "../components/Footer";

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
  

  const playClickSound = useCallback(() => {
    try {
      const audio = new Audio("/touchpad sd.mp3");
      audio.volume = 0.85;
      audio.play().catch(() => {});
    } catch (e) {
      /* ignore */
    }
  }, []);


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
          tag: "System",
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
          readTime: "7 min read",
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
      id: "side-by-side-row-2",
      type: "side-by-side",
      cards: [
        {
          id: "multi-agent-ecosystem",
          tag: "Research",
          tagType: "green",
          readTime: "18 min read",
          date: "April 2026",
          title: "Multi-Agent",
          subtitle: "Multi-Agent E-Commerce Ecosystem Architectures",
          description: "This study develops a decentralized system where specialized AI agents autonomously manage inventory, front-end adjustments, and TCG price volatility.",
          essayLink: "#",
          filters: ["Research"]
        }
      ]
    },
    {
      id: "side-by-side-row-3",
      type: "side-by-side",
      cards: [
        {
          id: "predictive-latency",
          tag: "Research",
          tagType: "green",
          readTime: "18 min read",
          date: "April 2026",
          title: "Predictive Latency",
          subtitle: "Predictive Latency in Scalable Systems",
          description: "This study develops a decentralized system where specialized AI agents autonomously manage inventory, front-end adjustments, and TCG price volatility.",
          essayLink: "#",
          filters: ["Research"]
        }
      ]
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

  const card1 = cardsData.find((c) => c.id === "side-by-side-row")?.cards.find((c) => c.id === "designing-uncertainty");
  const card2 = cardsData.find((c) => c.id === "side-by-side-row")?.cards.find((c) => c.id === "inside-tcg-pricing");
  const card3 = cardsData.find((c) => c.id === "side-by-side-row-2")?.cards.find((c) => c.id === "multi-agent-ecosystem");
  const card4 = cardsData.find((c) => c.id === "side-by-side-row-3")?.cards.find((c) => c.id === "predictive-latency");

  const isCard1Visible = card1 &&
    (activeFilter === "All" || card1.filters.includes(activeFilter)) &&
    matchesSearch(card1, searchQuery);

  const isCard2Visible = card2 &&
    (activeFilter === "All" || card2.filters.includes(activeFilter)) &&
    matchesSearch(card2, searchQuery);

  const isCard3Visible = card3 &&
    (activeFilter === "All" || card3.filters.includes(activeFilter)) &&
    matchesSearch(card3, searchQuery);

  const isCard4Visible = card4 &&
    (activeFilter === "All" || card4.filters.includes(activeFilter)) &&
    matchesSearch(card4, searchQuery);



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

        {/* ----- FIGMA ABSOLUTE CARDS SECTION ----- */}
        {(isCard1Visible || isCard2Visible) && (
          <div className={styles.row1Container}>
            {/* Top border Vector 33 */}
            <div className={styles.vector33} />

            {/* Vertical Divider Vector 34 */}
            {isCard1Visible && isCard2Visible && <div className={styles.vector34} />}

            {/* Card 1: Designing for Uncertainty */}
            {isCard1Visible && (
              <>
                {/* Frame 139 (Tags) */}
                <div className={`${styles.tagsFrame} ${styles.card1Tags}`}>
                  <div className={`${styles.tagMiniButton} ${styles.tagSystem}`}>System</div>
                  <div className={styles.tagMiniDate}>December 2025</div>
                </div>

                {/* Title */}
                <h2 className={`${styles.cardTitleAbsolute} ${styles.cardTitleUncertainty} ${styles.card1Title}`}>
                  Designing for Uncertainty:
                </h2>

                {/* Subtitle */}
                <h3 className={`${styles.cardSubtitleAbsolute} ${styles.card1Subtitle}`}>
                  A framework for <span className={styles.lessUnderstandingText}>adaptive business systems</span>
                </h3>

                {/* Description */}
                <p className={`${styles.cardDescAbsolute} ${styles.card1Desc}`}>
                  Stable systems are not systems that do not change. They are systems that know how to change — a breakdown of how to architect for environments where the rules keep shifting.
                </p>

                {/* Buttons */}
                <InlineSVG src="/research/10mnt.svg" className={styles.card1ReadTime} />
                <a href="#" className={styles.card1ReadEssay}>
                  <InlineSVG src="/research/Button mini.svg" />
                </a>
              </>
            )}

            {/* Card 2: Inside TCG pricing */}
            {isCard2Visible && (
              <>
                {/* Frame 138 (Tags) */}
                <div className={`${styles.tagsFrame} ${styles.card2Tags}`}>
                  <div className={`${styles.tagMiniButton} ${styles.tagCaseStudy}`}>Case Study</div>
                  <div className={styles.tagMiniDate}>February 2026</div>
                </div>

                {/* Title */}
                <h2 className={`${styles.cardTitleAbsolute} ${styles.card2Title}`}>
                  Inside TCG pricing:
                </h2>

                {/* Subtitle */}
                <h3 className={`${styles.cardSubtitleAbsolute} ${styles.card2Subtitle}`}>
                  How market <span className={styles.lessUnderstandingText}>fragmentation creates</span> operational chaos
                </h3>

                {/* Description */}
                <p className={`${styles.cardDescAbsolute} ${styles.card2Desc}`}>
                  Stable systems are not systems that do not change. They are systems that know how to change — a breakdown of how to architect for environments where the rules keep shifting.
                </p>

                {/* Buttons */}
                <InlineSVG src="/research/Button mini-8.svg" className={styles.card2ReadTime} />
                <a href="#" className={styles.card2ReadEssay}>
                  <InlineSVG src="/research/Button mini.svg" />
                </a>
              </>
            )}

            {/* Bottom border Vector 35 */}
            <div className={styles.vector35} />
          </div>
        )}

        {/* ----- FIGMA ABSOLUTE CARDS SECTION 2 ----- */}
        {isCard3Visible && (
          <div className={styles.row2Container}>
            {/* Card 3: Multi-Agent */}
            <>
              {/* Frame 141 (Tags) */}
              <div className={`${styles.tagsFrame} ${styles.card3Tags}`}>
                <div className={`${styles.tagMiniButton} ${styles.tagResearch}`}>Research</div>
                <div className={styles.tagMiniDate}>April 2026</div>
              </div>

              {/* Title */}
              <h2 className={`${styles.cardTitleAbsolute} ${styles.card3Title}`}>
                Multi-Agent
              </h2>

              {/* Subtitle */}
              <h3 className={`${styles.cardSubtitleAbsolute} ${styles.card3Subtitle}`}>
                Multi-Agent <span className={styles.lessUnderstandingText}>E-Commerce Ecosystem Architectures</span>
              </h3>

              {/* Description */}
              <p className={`${styles.cardDescAbsolute} ${styles.card3Desc}`}>
                This study develops a decentralized system where specialized AI agents autonomously manage inventory, front-end adjustments, and TCG price volatility.
              </p>

              {/* Buttons */}
              <InlineSVG src="/research/Button mini-1.svg" className={styles.card3ReadTime} />
              <a href="#" className={styles.card3ReadEssay}>
                <InlineSVG src="/research/Button mini.svg" />
              </a>
            </>

            {/* Right side: Circle diagram */}
            <div className={styles.circleDiagramContainer}>
              <InlineSVG src="/research/Circle.svg" />
              <div className={styles.agents1}>Agents 1</div>
              <div className={styles.agents2}>Agents 2</div>
              <div className={styles.agents3}>Agents 3</div>
              <div className={styles.agents4}>Agents 4</div>
            </div>

            {/* Bottom border Vector 36 */}
            <div className={styles.vector36} />
          </div>
        )}

        {/* ----- FIGMA ABSOLUTE CARDS SECTION 3 ----- */}
        {isCard4Visible && (
          <div className={styles.row3Container}>
            {/* Card 4: Predictive Latency */}
            <>
              {/* Frame 142 (Tags) */}
              <div className={`${styles.tagsFrame} ${styles.card4Tags}`}>
                <div className={`${styles.tagMiniButton} ${styles.tagResearch}`}>Research</div>
                <div className={styles.tagMiniDate}>April 2026</div>
              </div>

              {/* Title */}
              <h2 className={`${styles.cardTitleAbsolute} ${styles.card4Title}`}>
                Predictive Latency
              </h2>

              {/* Subtitle */}
              <h3 className={`${styles.cardSubtitleAbsolute} ${styles.card4Subtitle}`}>
                Predictive Latency in <span className={styles.lessUnderstandingText}>Scalable Systems</span>
              </h3>

              {/* Description */}
              <p className={`${styles.cardDescAbsolute} ${styles.card4Desc}`}>
                This study develops a decentralized system where specialized AI agents autonomously manage inventory, front-end adjustments, and TCG price volatility.
              </p>

              {/* Buttons */}
              <InlineSVG src="/research/Button mini-1.svg" className={styles.card4ReadTime} />
              <a href="#" className={styles.card4ReadEssay}>
                <InlineSVG src="/research/Button mini.svg" />
              </a>
            </>

            {/* Right side: Triangle diagram */}
            <div className={styles.recContainer}>
              <InlineSVG src="/research/rec.svg" />
              <div className={styles.triContainer}>
                <InlineSVG src="/research/tri.svg" />
              </div>
              <div className={styles.triLabel}>Predictive Latency</div>
            </div>

            {/* Bottom border Vector 37 */}
            <div className={styles.vector37} />
          </div>
        )}

      </main>

      {/* ----- FIGMA FOOTER SECTION ----- */}
      <Footer />
    </div>
  );
}
