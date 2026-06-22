"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import styles from "./page.module.css";
import { useTheme } from "../context/ThemeContext";
import ThemeToggle from "../components/ThemeToggle";
import Footer from "../components/Footer";


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

  const handleFilterClick = (filterName) => {
    playClickSound();
    console.log(`Active filter selected: ${filterName}`);
  };


  return (
    <div className={styles.pageWrapper} data-theme={isDark ? "dark" : "light"}>
      {/* ===== NAVIGATION ===== */}
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
              <a href="/journals" className={`${styles.navLink} ${styles.activeNavLink}`}>
                Works
              </a>
              <a href="/contact" className={styles.navLink}>
                Contact
              </a>
              <a href="/research" className={styles.navLink}>
                Research
              </a>
            </div>
          </div>
        </nav>
      </div>

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
          <InlineSVG src="/works/Frame 135.svg" className={styles.filterSubNav} />

          {/* Row 1 cards */}
          <InlineSVG src="/works/Frame 193.svg" className={styles.rowCards1} />

          {/* Row 2 cards */}
          <InlineSVG src="/works/Frame 192.svg" className={styles.rowCards2} />

          {/* Side Indicator */}
          <InlineSVG src="/works/Side Indicator.svg" className={styles.sideIndicator} />

          {/* ===== 3D DRAGGABLE THEME SWITCH OVERLAY ===== */}
          <ThemeToggle className={styles.slideButton} />

          {/* ===== INTERACTIVE FILTER PILLS FLEX OVERLAY ===== */}
          <div className={styles.filterBarOverlay}>
            <div className={styles.filterLabelPlaceholder} />
            <div className={styles.filterButtonsOverlay}>
              <button
                className={styles.filterButton}
                onClick={() => handleFilterClick("Websites")}
                aria-label="Filter Websites"
              />
              <button
                className={styles.filterButton}
                onClick={() => handleFilterClick("Ui & Ux")}
                aria-label="Filter Ui & Ux"
              />
              <button
                className={styles.filterButton}
                onClick={() => handleFilterClick("Case Studies")}
                aria-label="Filter Case Studies"
              />
              <button
                className={styles.filterButton}
                onClick={() => handleFilterClick("Ai")}
                aria-label="Filter Ai"
              />
              <button
                className={styles.filterButton}
                onClick={() => handleFilterClick("Others")}
                aria-label="Filter Others"
              />
            </div>
            <div className={styles.filterSearchBox}>
              <input
                className={styles.filterSearchInput}
                type="text"
                placeholder=" "
                onChange={(e) => console.log("Searching filters:", e.target.value)}
              />
            </div>
          </div>

          {/* ===== INTERACTIVE CHECK BUTTON OVERLAYS ===== */}
          {/* Row 1 check buttons */}
          <button
            className={`${styles.readEssayBtn} ${styles.btnEssay1}`}
            onClick={() => handleEssayClick("Hasib (UI)")}
            aria-label="Check Hasib UI"
          />
          <button
            className={`${styles.readEssayBtn} ${styles.btnEssay2}`}
            onClick={() => handleEssayClick("Sadid (AI)")}
            aria-label="Check Sadid AI"
          />
          <button
            className={`${styles.readEssayBtn} ${styles.btnEssay3}`}
            onClick={() => handleEssayClick("Maruf (Website)")}
            aria-label="Check Maruf Website"
          />
          <button
            className={`${styles.readEssayBtn} ${styles.btnEssay4}`}
            onClick={() => handleEssayClick("Modi (UX)")}
            aria-label="Check Modi UX"
          />

          {/* Row 2 check buttons */}
          <button
            className={`${styles.readEssayBtn} ${styles.btnEssay5}`}
            onClick={() => handleEssayClick("Sadid (AI) Row 2")}
            aria-label="Check Sadid AI Row 2"
          />
          <button
            className={`${styles.readEssayBtn} ${styles.btnEssay6}`}
            onClick={() => handleEssayClick("Modi (UX) Row 2")}
            aria-label="Check Modi UX Row 2"
          />
          <button
            className={`${styles.readEssayBtn} ${styles.btnEssay7}`}
            onClick={() => handleEssayClick("Hasib (UI) Row 2")}
            aria-label="Check Hasib UI Row 2"
          />
          <button
            className={`${styles.readEssayBtn} ${styles.btnEssay8}`}
            onClick={() => handleEssayClick("Maruf (Website) Row 2")}
            aria-label="Check Maruf Website Row 2"
          />

        </div>
      </main>

      {/* ===== SECTION 4: FOOTER ===== */}
      <Footer />
    </div>
  );
}
