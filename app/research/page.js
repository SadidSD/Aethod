"use client";

import { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import styles from "./page.module.css";
import { useTheme } from "../context/ThemeContext";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import initialEssays from "../../content/research.json";

function InlineSVG({ src, className, style, alt = "TCG Systems Diagram" }) {
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      style={style}
      loading="eager"
    />
  );
}

export default function ResearchPage() {
  const { isDark } = useTheme();
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [essays, setEssays] = useState(initialEssays);
  const [expandedEssays, setExpandedEssays] = useState({});

  const playClickSound = useCallback(() => {
    try {
      const audio = new Audio("/touchpad sd.mp3");
      audio.volume = 0.85;
      audio.play().catch(() => {});
    } catch (e) {
      /* ignore */
    }
  }, []);

  const toggleEssay = (id) => {
    playClickSound();
    setExpandedEssays((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleEssayClick = (e, essayTitle) => {
    e.preventDefault();
    playClickSound();
    alert(`Opening research paper: "${essayTitle}"`);
  };

  // Re-sync research essays if needed
  useEffect(() => {
    fetch("/api/content?type=research")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setEssays(data);
        }
      })
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

  // Separate special stacked essays (TCG Multi-Agent and TCG Omnichannel Lock Arbitration)
  const isSpecialEssay = (id) =>
    id === "tcg-multi-agent-automation" ||
    id === "tcg-omnichannel-race-conditions" ||
    id === "multi-agent-ecosystem" ||
    id === "predictive-latency";

  const standardFilteredEssays = filteredEssays.filter(
    (essay) => !isSpecialEssay(essay.id)
  );
  
  const specialEssays = filteredEssays.filter(
    (essay) => isSpecialEssay(essay.id)
  );

  // Split standard essays into Hero (first) and Grid (rest)
  const heroEssay = standardFilteredEssays[0];
  const gridEssays = standardFilteredEssays.slice(1);

  // Helper to highlight specific phrases in subtitles
  const renderSubtitle = (subtitle, highlightedSubtitle) => {
    if (!subtitle) return "";
    const highlights = [
      highlightedSubtitle,
      "owned headless stores",
      "catalog explosion",
      "buyout bots",
      "secondary sourcing margins",
      "Mass decklist paste parsing",
      "digital binder sync",
      "condition degradation curves",
      "multi-agent architecture",
      "Eliminating double-selling",
      "owned infrastructure",
      "variant explosion",
      "undercut defense",
      "gross margin velocity",
      "cart conversion telemetry",
      "retention economics",
      "adaptive systems architectures"
    ].filter(Boolean);

    const matchedHighlight = highlights.find((h) => subtitle.includes(h));
    if (matchedHighlight) {
      const parts = subtitle.split(matchedHighlight);
      return (
        <>
          {parts[0]}
          <span className={styles.highlightText}>{matchedHighlight}</span>
          {parts.slice(1).join(matchedHighlight)}
        </>
      );
    }
    return subtitle;
  };

  return (
    <div className={styles.pageWrapper} data-theme={isDark ? "dark" : "light"} suppressHydrationWarning={true}>
      {/* ===== NAVIGATION ===== */}
      <Navbar activePage="research" />

      {/* ===== MAIN CONTENT ===== */}
      <main className={styles.mainContainer}>
        
        {/* ----- TITLE HEADER & SEARCH BAR ----- */}
        <div className={styles.headerBlock} suppressHydrationWarning={true}>
          <div className={styles.headerBlockInner} suppressHydrationWarning={true}>
            {/* Page title "Research" */}
            <div className={styles.headerTitleContainer} suppressHydrationWarning={true}>
              <h1 className={styles.headerTitle}>Research</h1>
              <p className={styles.headerSubtitle}>insights and blueprints</p>
            </div>

            {/* Filter buttons & Search bar */}
            <div className={styles.filtersRow} suppressHydrationWarning={true}>
              <div className={styles.filterTabs} suppressHydrationWarning={true}>
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
              <div className={styles.searchContainer} suppressHydrationWarning={true}>
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
                <h3 className={styles.essaySubtitle}>{renderSubtitle(heroEssay.subtitle, heroEssay.highlightedSubtitle)}</h3>
                <div className={styles.essayDescContainer}>
                  <p className={`${styles.essayDesc} ${expandedEssays[heroEssay.id] ? styles.expanded : ""}`}>
                    {heroEssay.description}
                  </p>
                  <button 
                    className={styles.seeMoreBtn}
                    onClick={() => toggleEssay(heroEssay.id)}
                  >
                    {expandedEssays[heroEssay.id] ? "See Less" : "See More"}
                  </button>
                </div>
                
                <div className={styles.heroCardFooter}>
                  <span className={styles.readTime}>{heroEssay.readTime || "10 min read"}</span>
                  <Link href={`/research/${heroEssay.id}`} className={styles.readLink} onClick={playClickSound}>
                    Read essay
                    <svg className={styles.chevronIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </Link>
                </div>
              </div>

              {/* Illustration box on the right */}
              <div className={styles.heroCardRight}>
                <InlineSVG src="/research/tcg_fee_graph.svg" className={styles.miniGraphSvg} />
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
                    <h3 className={styles.essayGridSubtitle}>{renderSubtitle(essay.subtitle, essay.highlightedSubtitle)}</h3>
                    <div className={styles.essayDescContainer}>
                      <p className={`${styles.essayGridDesc} ${expandedEssays[essay.id] ? styles.expanded : ""}`}>
                        {essay.description}
                      </p>
                      <button 
                        className={styles.seeMoreBtn}
                        onClick={() => toggleEssay(essay.id)}
                      >
                        {expandedEssays[essay.id] ? "See Less" : "See More"}
                      </button>
                    </div>

                    <div className={styles.cardFooter}>
                      <span className={styles.readTime}>{essay.readTime || "10 min read"}</span>
                      <Link href={`/research/${essay.id}`} className={styles.readLink} onClick={playClickSound}>
                        Read essay
                        <svg className={styles.chevronIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="9 18 15 12 9 6" />
                        </svg>
                      </Link>
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
              const isMultiAgent =
                essay.id === "tcg-multi-agent-automation" ||
                essay.id === "multi-agent-ecosystem";
              
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
                      <h3 className={styles.essaySubtitle}>{renderSubtitle(essay.subtitle, essay.highlightedSubtitle)}</h3>
                      <div className={styles.essayDescContainer}>
                        <p className={`${styles.essayDesc} ${expandedEssays[essay.id] ? styles.expanded : ""}`}>
                          {essay.description}
                        </p>
                        <button 
                          className={styles.seeMoreBtn}
                          onClick={() => toggleEssay(essay.id)}
                        >
                          {expandedEssays[essay.id] ? "See Less" : "See More"}
                        </button>
                      </div>
                      
                      <div className={styles.heroCardFooter}>
                        <span className={styles.readTime}>{essay.readTime || "10 min read"}</span>
                        <Link href={`/research/${essay.id}`} className={styles.readLink} onClick={playClickSound}>
                          Read essay
                          <svg className={styles.chevronIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="9 18 15 12 9 6" />
                          </svg>
                        </Link>
                      </div>
                    </div>

                    <div className={styles.specialCardRight}>
                      {isMultiAgent ? (
                        <InlineSVG src="/research/tcg_multi_agent.svg" className={styles.miniGraphSvg} />
                      ) : (
                        <InlineSVG src="/research/tcg_omnichannel_sync.svg" className={styles.miniGraphSvg} />
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
