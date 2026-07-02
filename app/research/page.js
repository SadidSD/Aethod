"use client";

import { useState, useCallback, useEffect } from "react";
import styles from "./page.module.css";
import { useTheme } from "../context/ThemeContext";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

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
  const [essays, setEssays] = useState([]);

  const playClickSound = useCallback(() => {
    try {
      const audio = new Audio("/touchpad sd.mp3");
      audio.volume = 0.85;
      audio.play().catch(() => {});
    } catch (e) {
      /* ignore */
    }
  }, []);

  // Fetch research essays on mount
  useEffect(() => {
    fetch("/api/content?type=research")
      .then((res) => res.json())
      .then((data) => setEssays(data))
      .catch((err) => console.error("Failed to load research essays:", err));
  }, []);

  const filters = [
    "All",
    "Systems",
    "AI + Automation",
    "Research",
    "Case Studies"
  ];

  // Filter logic
  const filteredEssays = essays.filter((essay) => {
    const matchesFilter = activeFilter === "All" || (essay.filters && essay.filters.includes(activeFilter));
    const matchesSearch =
      searchQuery.trim() === "" ||
      essay.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      essay.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      essay.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Split into Hero (first) and Grid (rest)
  const heroEssay = filteredEssays[0];
  const gridEssays = filteredEssays.slice(1);

  return (
    <div className={styles.pageWrapper} data-theme={isDark ? "dark" : "light"}>
      {/* ===== NAVIGATION ===== */}
      <Navbar activePage="research" />

      {/* ===== MAIN CONTENT ===== */}
      <main className={styles.mainContainer}>
        
        {/* ----- TITLE HEADER & SEARCH BAR ----- */}
        <div className={styles.headerBlock}>
          <div className={styles.headerBlockInner}>
            {/* Page title "Research" */}
            <div className={styles.headerTitleContainer}>
              <h1 className={styles.headerTitle}>Research</h1>
              <p className={styles.headerSubtitle}>insights and blueprints</p>
            </div>

            {/* Filter buttons & Search bar */}
            <div className={styles.filtersRow}>
              <div className={styles.filterTabs}>
                {filters.map((f) => (
                  <button
                    key={f}
                    onClick={() => {
                      playClickSound();
                      setActiveFilter(f);
                    }}
                    className={`${styles.filterBtn} ${activeFilter === f ? styles.filterBtnActive : ""}`}
                  >
                    {f}
                  </button>
                ))}
              </div>

              {/* Search Container */}
              <div className={styles.searchContainer}>
                <input
                  type="text"
                  placeholder="Search papers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={styles.searchInput}
                />
                <svg className={styles.searchIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* ----- HERO ESSAY CARD (THE CLARITY GAP) ----- */}
        {heroEssay && (
          <div className={styles.heroEssayCard}>
            <div className={styles.heroCardHeader}>
              <span className={`${styles.tagPill} ${styles[`tagPill_${heroEssay.tagType || "green"}`]}`}>
                {heroEssay.tag}
              </span>
              <span className={styles.dateText}>{heroEssay.date}</span>
            </div>

            <div className={styles.heroCardBody}>
              <div className={styles.heroCardLeft}>
                <h2 className={styles.essayTitle}>{heroEssay.title}</h2>
                <h3 className={styles.essaySubtitle}>{heroEssay.subtitle}</h3>
                <p className={styles.essayDesc}>{heroEssay.description}</p>
                
                <div className={styles.heroCardFooter}>
                  <span className={styles.readTime}>{heroEssay.readTime || "10 min read"}</span>
                  <a href="#" className={styles.readLink} onClick={playClickSound}>
                    Read Essay
                    <svg className={styles.arrowIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </a>
                </div>
              </div>

              {/* Illustration box on the right */}
              <div className={styles.heroCardRight}>
                {heroEssay.illustrationType === "graph" ? (
                  <div className={styles.graphContainer}>
                    <InlineSVG src="/research/Line 2.svg" className={styles.line2} />
                    <InlineSVG src="/research/Line 3.svg" className={styles.line3} />
                    <InlineSVG src="/research/Line 4.svg" className={styles.line4} />
                    <InlineSVG src="/research/Line 5.svg" className={styles.line5} />
                    <InlineSVG src="/research/Ellipse 32.svg" className={styles.ellipse32} />
                    <InlineSVG src="/research/Vector 32.svg" className={styles.vector32} />
                    
                    <div className={styles.peakClarityLabelText}>Peak Clarity</div>
                    <div className={styles.noiseFloorLabelText}>Noise Floor</div>
                    <div className={styles.dataVolumeLabelText}>Data Volume</div>
                  </div>
                ) : (
                  <div className={styles.placeholderVisual}>
                    <InlineSVG src="/works/Line 39.svg" className={styles.visualLines} />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ----- RESEARCH GRID SECTION ----- */}
        <section className={styles.researchGrid}>
          {gridEssays.length > 0 ? (
            gridEssays.map((essay) => (
              <article key={essay.id} className={styles.essayCard}>
                <div className={styles.cardHeader}>
                  <span className={`${styles.tagPill} ${styles[`tagPill_${essay.tagType || "green"}`]}`}>
                    {essay.tag}
                  </span>
                  <span className={styles.dateText}>{essay.date}</span>
                </div>

                <h2 className={styles.essayGridTitle}>{essay.title}</h2>
                <h3 className={styles.essayGridSubtitle}>{essay.subtitle}</h3>
                <p className={styles.essayGridDesc}>{essay.description}</p>

                <div className={styles.cardFooter}>
                  <span className={styles.readTime}>{essay.readTime || "10 min read"}</span>
                  <a href="#" className={styles.readLink} onClick={playClickSound}>
                    Read Essay
                    <svg className={styles.arrowIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </a>
                </div>
              </article>
            ))
          ) : (
            !heroEssay && (
              <div className={styles.noEssaysCard}>
                <p>No research blueprints found matching your search.</p>
              </div>
            )
          )}
        </section>

      </main>

      <Footer />
    </div>
  );
}
