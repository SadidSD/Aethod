"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import styles from "./page.module.css";
import { useTheme } from "../context/ThemeContext";
import ThemeToggle from "../components/ThemeToggle";


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

export default function BlogPage() {
  const { isDark } = useTheme();
              
        
  
  
  
  
  
  
  
  
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
              <a href="/blog" className={`${styles.navLink} ${styles.activeNavLink}`}>
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
              <a href="/research" className={styles.navLink}>
                Research
              </a>
            </div>
          </div>
        </nav>
      </div>
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

          {/* Draggable Slide Toggle — Dark/Light Mode (Exactly like the Hero page) */}
          <ThemeToggle className={styles.slideButton} />
        </div>
      </main>
    </div>
  );
}
