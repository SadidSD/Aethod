"use client";

import { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";
import { useTheme } from "../context/ThemeContext";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import WorkProjectCard from "./WorkProjectCard";

function InlineSVG({ src, className }) {
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
      dangerouslySetInnerHTML={{ __html: svgContent }}
      suppressHydrationWarning={true}
    />
  );
}

export default function WorksPage() {
  const router = useRouter();
  const { isDark } = useTheme();
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [works, setWorks] = useState([]);

  const playClickSound = useCallback(() => {
    try {
      const audio = new Audio("/touchpad sd.mp3");
      audio.volume = 0.85;
      audio.play().catch(() => {});
    } catch (e) {
      /* ignore */
    }
  }, []);

  const handleCardClick = useCallback((e, workId) => {
    // If clicked on or inside the Check live site button, don't trigger case study navigation
    if (e.target.closest(`.${styles.workCardRightGroup}`)) {
      return;
    }
    playClickSound();
    router.push(`/works/${workId}`);
  }, [playClickSound, router]);

  // Fetch works from API on mount
  useEffect(() => {
    fetch("/api/content?type=works", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => setWorks(data))
      .catch((err) => console.error("Failed to load works:", err));
  }, []);

  const filters = [
    "All",
    ...Array.from(new Set(works.flatMap((w) => w.filters || []))).filter((f) => f !== "All"),
  ];


  const handleEssayClick = (essayTitle) => {
    playClickSound();
    alert(`Opening work project: "${essayTitle}"`);
  };

  const isCardMatching = useCallback((card) => {
    const cardFilters = card.filters || ["All"];
    if (activeFilter !== "All" && !cardFilters.includes(activeFilter)) {
      return false;
    }
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      return (
        card.name.toLowerCase().includes(query) ||
        (card.description && card.description.toLowerCase().includes(query))
      );
    }
    return true;
  }, [activeFilter, searchQuery]);

  const filteredWorks = works.filter(isCardMatching);

  return (
    <div className={styles.pageWrapper} data-theme={isDark ? "dark" : "light"} suppressHydrationWarning={true}>
      {/* ===== NAVIGATION ===== */}
      <Navbar activePage="works" />

      {/* ===== MAIN CONTENT ===== */}
      <main className={styles.mainContainer}>
        <div className={styles.contentAlignContainer}>
          
          {/* Header Title Section */}
          <header className={styles.worksHeader}>
            <h1 className={styles.worksTitle}>Works</h1>
            <p className={styles.worksSubtitle}>our systems in action</p>
          </header>

          {/* Explore filter bar */}
          <div className={styles.filterSubNav}>
            <div className={styles.filterSubNavInner}>
              <div className={styles.filterLabelSection}>
                <span className={styles.filterLabel}>Filter</span>
              </div>
              
              <div className={styles.filterSearchSection}>
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

              <div className={styles.filterBarButtons}>
                {filters.map((f) => {
                  const isSelected = activeFilter === f;
                  return (
                    <button
                      key={f}
                      onClick={() => {
                        playClickSound();
                        setActiveFilter(f);
                      }}
                      className={isSelected ? styles.filterChipAll : styles.filterChipOther}
                    >
                      <span>{f}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Dynamic Works Grid */}
          <section className={styles.worksGrid}>
            {filteredWorks.length > 0 ? (
              filteredWorks.map((work) => (
                <WorkProjectCard
                  key={work.id}
                  work={work}
                  playClickSound={playClickSound}
                />
              ))
            ) : (
              <div className={styles.noWorksCard}>
                <p>No projects found matching your filter selection.</p>
              </div>
            )}
          </section>

        </div>
      </main>

      {/* ===== FOOTER ===== */}
      <Footer />
    </div>
  );
}
