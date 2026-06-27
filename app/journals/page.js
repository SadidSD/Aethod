"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import styles from "./page.module.css";
import { useTheme } from "../context/ThemeContext";
import ThemeToggle from "../components/ThemeToggle";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";


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
    />
  );
}

export default function JournalsPage() {
  const { isDark } = useTheme();
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filters = [
    "All",
    "Recently Uploaded",
    "History",
    "By Sadid Bin Hasan",
    "E-Commerce Related",
    "F-Commerce Related"
  ];

  const cardsData = [
    { id: 1, name: "Hasib (UI)", filters: ["All", "Recently Uploaded", "History"] },
    { id: 2, name: "Sadid (AI)", filters: ["All", "Recently Uploaded", "By Sadid Bin Hasan", "E-Commerce Related"] },
    { id: 3, name: "Maruf (Website)", filters: ["All", "Recently Uploaded", "History"] },
    { id: 4, name: "Modi (UX)", filters: ["All", "History"] },
    { id: 5, name: "Sadid (AI) Row 2", filters: ["All", "By Sadid Bin Hasan", "F-Commerce Related"] },
    { id: 6, name: "Modi (UX) Row 2", filters: ["All"] },
    { id: 7, name: "Hasib (UI) Row 2", filters: ["All"] },
    { id: 8, name: "Maruf (Website) Row 2", filters: ["All"] }
  ];
              
        
  const playClickSound = useCallback(() => {
    try {
      const audio = new Audio("/touchpad sd.mp3");
      audio.volume = 0.85;
      audio.play().catch(() => {});
    } catch (e) {
      /* ignore */
    }
  }, []);

  const handleEssayClick = (essayTitle) => {
    playClickSound();
    alert(`Opening essay: "${essayTitle}"`);
  };

  const isCardMatching = useCallback((card) => {
    if (activeFilter !== "All" && !card.filters.includes(activeFilter)) {
      return false;
    }
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      return card.name.toLowerCase().includes(query);
    }
    return true;
  }, [activeFilter, searchQuery]);


  return (
    <div className={styles.pageWrapper} data-theme={isDark ? "dark" : "light"}>
      {/* ===== NAVIGATION ===== */}
      <Navbar activePage="works" />

      {/* ===== MAIN CONTENT ===== */}
      <main className={styles.mainContainer}>
        <div className={styles.contentAlignContainer}>
          {/* Header section (Works) */}
          <InlineSVG src="/works/Frame 91.svg" className={styles.headerTitle} />

          {/* Vertical line dividers */}
          <InlineSVG src="/works/Line 39.svg" className={styles.line39} />
          <InlineSVG src="/works/Line 41.svg" className={styles.line41} />
          <InlineSVG src="/works/Line 40.svg" className={styles.line40} />

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

              <div className={styles.filterArrowSection}>
                <div className={styles.ellipse30}>
                  <svg className={styles.arrowIconDown} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 5V19M12 19L19 12M12 19L5 12" stroke="#404040" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>

              <div className={styles.filterBarButtons}>
                {filters.map((f, idx) => {
                  const isSelected = activeFilter === f;
                  if (idx === 0) {
                    return (
                      <button
                        key={f}
                        onClick={() => {
                          console.log("Clicked All button");
                          // playClickSound();
                          setActiveFilter(f);
                        }}
                        className={isSelected ? styles.filterChipAll : styles.filterChipOther}
                      >
                        <span>{f}</span>
                      </button>
                    );
                  } else {
                    return (
                      <button
                        key={f}
                        onClick={() => {
                          console.log("Clicked filter button:", f);
                          // playClickSound();
                          setActiveFilter(f);
                        }}
                        className={`${styles.filterChipOther} ${
                          isSelected ? styles.filterChipOtherActive : ""
                        }`}
                      >
                        <span>{f}</span>
                      </button>
                    );
                  }
                })}
              </div>
            </div>
          </div>

          {/* Row 1 cards */}
          <InlineSVG src="/works/Frame 193.svg" className={styles.rowCards1} />

          {/* Row 2 cards */}
          <InlineSVG src="/works/Frame 192.svg" className={styles.rowCards2} />

          {/* Card overlays to dim filtered out cards */}
          {cardsData.map((card) => {
            const visible = isCardMatching(card);
            const cardStyleClass = styles[`cardOverlay${card.id}`];
            return (
              <div
                key={card.id}
                className={`${styles.cardOverlay} ${cardStyleClass} ${
                  !visible ? styles.cardOverlayDimmed : ""
                }`}
              />
            );
          })}

          {/* Side Indicator */}
          <InlineSVG src="/works/Side Indicator.svg" className={styles.sideIndicator} />

          {/* ===== 3D DRAGGABLE THEME SWITCH OVERLAY ===== */}
          {/* <ThemeToggle className={styles.slideButton} /> */}

          {/* ===== INTERACTIVE CHECK BUTTON OVERLAYS ===== */}
          {/* Row 1 check buttons */}
          <button
            className={`${styles.readEssayBtn} ${styles.btnEssay1}`}
            onClick={() => handleEssayClick("Hasib (UI)")}
            aria-label="Check Hasib UI"
            disabled={!isCardMatching(cardsData[0])}
          />
          <button
            className={`${styles.readEssayBtn} ${styles.btnEssay2}`}
            onClick={() => handleEssayClick("Sadid (AI)")}
            aria-label="Check Sadid AI"
            disabled={!isCardMatching(cardsData[1])}
          />
          <button
            className={`${styles.readEssayBtn} ${styles.btnEssay3}`}
            onClick={() => handleEssayClick("Maruf (Website)")}
            aria-label="Check Maruf Website"
            disabled={!isCardMatching(cardsData[2])}
          />
          <button
            className={`${styles.readEssayBtn} ${styles.btnEssay4}`}
            onClick={() => handleEssayClick("Modi (UX)")}
            aria-label="Check Modi UX"
            disabled={!isCardMatching(cardsData[3])}
          />

          {/* Row 2 check buttons */}
          <button
            className={`${styles.readEssayBtn} ${styles.btnEssay5}`}
            onClick={() => handleEssayClick("Sadid (AI) Row 2")}
            aria-label="Check Sadid AI Row 2"
            disabled={!isCardMatching(cardsData[4])}
          />
          <button
            className={`${styles.readEssayBtn} ${styles.btnEssay6}`}
            onClick={() => handleEssayClick("Modi (UX) Row 2")}
            aria-label="Check Modi UX Row 2"
            disabled={!isCardMatching(cardsData[5])}
          />
          <button
            className={`${styles.readEssayBtn} ${styles.btnEssay7}`}
            onClick={() => handleEssayClick("Hasib (UI) Row 2")}
            aria-label="Check Hasib UI Row 2"
            disabled={!isCardMatching(cardsData[6])}
          />
          <button
            className={`${styles.readEssayBtn} ${styles.btnEssay8}`}
            onClick={() => handleEssayClick("Maruf (Website) Row 2")}
            aria-label="Check Maruf Website Row 2"
            disabled={!isCardMatching(cardsData[7])}
          />

        </div>
      </main>

      {/* ===== SECTION 4: FOOTER ===== */}
      <Footer />
    </div>
  );
}
