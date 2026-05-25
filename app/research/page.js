"use client";

import { useState, useEffect } from "react";
import styles from "./page.module.css";

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

export default function ResearchPage() {
  const [isDark, setIsDark] = useState(false);

  // Apply theme to <html>
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  return (
    <div className={styles.pageWrapper} data-theme={isDark ? 'dark' : 'light'}>
      {/* ===== NAVIGATION ===== */}
      <div className={styles.navOuter}>
        <nav className={styles.navbar} id="navbar">
          <div className={styles.navLeft}>
            <a href="/" className={styles.logo} aria-label="Aeethod Home">
              <InlineSVG src="/logo.svg" className={styles.logoImg} />
            </a>

            <div className={styles.navLinks}>
              <a href="/#studio" className={styles.navLink}>Studio</a>
              <a href="/#system" className={styles.navLink}>System</a>
              <a href="/research" className={`${styles.navLink} ${styles.activeNavLink}`}>Research</a>
              <a href="/#products" className={styles.navLink}>Products</a>
              <a href="/#journals" className={styles.navLink}>Journals</a>
            </div>
          </div>

          <div className={styles.navCenter}>
            <div className={styles.searchBar}>
              <svg
                className={styles.searchIcon}
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="11" cy="11" r="7" stroke="#3B719F" strokeWidth="2" />
                <path d="M16.5 16.5L21 21" stroke="#3B719F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <input
                className={styles.searchInput}
                type="text"
                placeholder="Ask Smith about your query"
                id="search-input"
              />
            </div>
          </div>

          <div className={styles.navRight}>
            <a href="/#contact" className={styles.contactBtn} aria-label="Contact" id="contact-btn">
              <img
                className={styles.contactBtnImg}
                src="/contract.svg"
                alt="Contact"
                width={44}
                height={44}
              />
            </a>
          </div>
        </nav>
      </div>

      {/* ===== MAIN CONTENT ===== */}
      <main className={styles.mainContainer}>
        <div className={styles.contentAlignContainer}>
          {/* Header (Frame 111) */}
          <InlineSVG src="/research/Frame 111.svg" className={styles.researchHeader} />

          {/* Sidebar (Frame 110) */}
          <InlineSVG src="/research/Frame 110.svg" className={styles.researchSidebar} />

          {/* Content (Frame 109) */}
          <InlineSVG src="/research/Frame 109.svg" className={styles.researchContent} />

          {/* Footer */}
          <InlineSVG src="/research/Footer.svg" className={styles.researchFooter} />

          {/* Active area overlaying the static slide button in Frame 111 SVG */}
          <button 
            className={styles.themeToggleOverlay} 
            onClick={() => setIsDark(!isDark)}
            aria-label="Toggle Theme"
          />
        </div>
      </main>
    </div>
  );
}
