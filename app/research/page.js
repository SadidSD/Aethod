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

  // Separate special stacked essays (Multi-Agent and Predictive Latency)
  const standardFilteredEssays = filteredEssays.filter(
    (essay) => essay.id !== "multi-agent-ecosystem" && essay.id !== "predictive-latency"
  );
  
  const specialEssays = filteredEssays.filter(
    (essay) => essay.id === "multi-agent-ecosystem" || essay.id === "predictive-latency"
  );

  // Split standard essays into Hero (first) and Grid (rest)
  const heroEssay = standardFilteredEssays[0];
  const gridEssays = standardFilteredEssays.slice(1);

  // Helper to highlight specific phrases in subtitles
  const renderSubtitle = (subtitle) => {
    const highlights = [
      "less understanding",
      "adaptive business systems",
      "fragmentation creates operational chaos",
      "E-Commerce Ecosystem Architectures",
      "Scalable Systems"
    ];
    const matchedHighlight = highlights.find((h) => subtitle.includes(h));
    if (matchedHighlight) {
      const parts = subtitle.split(matchedHighlight);
      return (
        <>
          {parts[0]}
          <span className={styles.highlightText}>{matchedHighlight}</span>
          {parts[1]}
        </>
      );
    }
    return subtitle;
  };

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
            <div className={styles.heroCardBody}>
              <div className={styles.heroCardLeft}>
                <div className={styles.heroCardHeader}>
                  <span className={`${styles.tagPill} ${styles[`tagPill_${heroEssay.tagType || "green"}`]}`}>
                    {heroEssay.tag}
                  </span>
                  <span className={styles.dateText}>{heroEssay.date}</span>
                </div>
                <h2 className={styles.essayTitle}>{heroEssay.title}</h2>
                <h3 className={styles.essaySubtitle}>{renderSubtitle(heroEssay.subtitle)}</h3>
                <p className={styles.essayDesc}>{heroEssay.description}</p>
                
                <div className={styles.heroCardFooter}>
                  <span className={styles.readTime}>{heroEssay.readTime || "10 min read"}</span>
                  <a href="#" className={styles.readLink} onClick={playClickSound}>
                    Read essay
                    <svg className={styles.chevronIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </a>
                </div>
              </div>

              {/* Illustration box on the right */}
              <div className={styles.heroCardRight}>
                {heroEssay.illustrationType === "graph" ? (
                  <InlineSVG src="/research/mini_graph.svg" className={styles.miniGraphSvg} />
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
        {(gridEssays.length > 0 || (!heroEssay && specialEssays.length === 0)) && (
          <section className={styles.researchGrid}>
            {gridEssays.length > 0 ? (
              gridEssays.map((essay) => (
                <article key={essay.id} className={styles.essayCard}>
                  <div className={styles.essayCardInner}>
                    <div className={styles.cardHeader}>
                      <span className={`${styles.tagPill} ${styles[`tagPill_${essay.tagType || "green"}`]}`}>
                        {essay.tag}
                      </span>
                      <span className={styles.dateText}>{essay.date}</span>
                    </div>

                    <h2 className={styles.essayGridTitle}>{essay.title}</h2>
                    <h3 className={styles.essayGridSubtitle}>{renderSubtitle(essay.subtitle)}</h3>
                    <p className={styles.essayGridDesc}>{essay.description}</p>

                    <div className={styles.cardFooter}>
                      <span className={styles.readTime}>{essay.readTime || "10 min read"}</span>
                      <a href="#" className={styles.readLink} onClick={playClickSound}>
                        Read essay
                        <svg className={styles.chevronIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="9 18 15 12 9 6" />
                        </svg>
                      </a>
                    </div>
                  </div>
                </article>
              ))
            ) : (
              <div className={styles.noEssaysCard}>
                <p>No research blueprints found matching your search.</p>
              </div>
            )}
          </section>
        )}

        {/* ----- SPECIAL STACKED ESSAYS (MULTI-AGENT & PREDICTIVE LATENCY) ----- */}
        {specialEssays.length > 0 && (
          <div className={styles.specialCardsSection}>
            {specialEssays.map((essay) => {
              const isMultiAgent = essay.id === "multi-agent-ecosystem";
              
              return (
                <div key={essay.id} className={styles.specialEssayCard}>
                  <div className={styles.specialCardBody}>
                    <div className={styles.specialCardLeft}>
                      <div className={styles.heroCardHeader}>
                        <span className={`${styles.tagPill} ${styles[`tagPill_${essay.tagType || "green"}`]}`}>
                          {essay.tag}
                        </span>
                        <span className={styles.dateText}>{essay.date}</span>
                      </div>
                      <h2 className={styles.essayTitle}>{essay.title}</h2>
                      <h3 className={styles.essaySubtitle}>{renderSubtitle(essay.subtitle)}</h3>
                      <p className={styles.essayDesc}>{essay.description}</p>
                      
                      <div className={styles.heroCardFooter}>
                        <span className={styles.readTime}>{essay.readTime || "10 min read"}</span>
                        <a href="#" className={styles.readLink} onClick={playClickSound}>
                          Read essay
                          <svg className={styles.chevronIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="9 18 15 12 9 6" />
                          </svg>
                        </a>
                      </div>
                    </div>

                    <div className={styles.specialCardRight}>
                      {isMultiAgent ? (
                        <div className={styles.massContainer}>
                          <div className={styles.massGraphicWrapper}>
                            <InlineSVG src="/research/mass.svg" className={styles.massSvg} />
                            <div className={`${styles.agentLabel} ${styles.agentLabelLeft}`}>Agents 1</div>
                            <div className={`${styles.agentLabel} ${styles.agentLabelTop}`}>Agents 2</div>
                            <div className={`${styles.agentLabel} ${styles.agentLabelRight}`}>Agents 3</div>
                            <div className={`${styles.agentLabel} ${styles.agentLabelBottom}`}>Agents 4</div>
                          </div>
                        </div>
                      ) : (
                        <div className={styles.predictiveLatencyCardRight}>
                          <InlineSVG src="/research/rec.svg" className={styles.recSvg} />
                          <div className={styles.predictiveLatencyContent}>
                            <InlineSVG src="/research/tri.svg" className={styles.triSvg} />
                            <div className={styles.predictiveLatencyText}>Predictive Latency</div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}
