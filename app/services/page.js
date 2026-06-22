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

export default function ServicesPage() {
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

  return (
    <div className={styles.pageWrapper} data-theme={isDark ? "dark" : "light"}>
      {/* ===== FLOATING STICKY NAVIGATION ===== */}
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
              <a href="/services" className={`${styles.navLink} ${styles.activeNavLink}`}>
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
              <a href="/research" className={styles.navLink}>
                Research
              </a>
            </div>
          </div>
        </nav>
      </div>

      {/* ===== MAIN CONTAINER FLOW ===== */}
      <main className={styles.mainContainer}>
        <div className={styles.contentAlignContainer}>
          {/* ----- SECTION 1: HERO ----- */}
          <InlineSVG src="/services/Group 76.svg" className={styles.heroTitle} />


          {/* ----- SECTION 2: SERVICES CARDS GRID ----- */}
          {/* Card 1: TCG Website Ecosystem */}
          <a href="/services/tcg" className={styles.card1} onClick={playClickSound}>
            <InlineSVG src="/services/TCG Web.svg" />
          </a>

          {/* Card 2: E-commerce Website Development */}
          <a href="/services/ecommerce" className={styles.card2} onClick={playClickSound}>
            <InlineSVG src="/services/Webs.svg" />
          </a>

          {/* Card 3: Custom E-commerce Tools */}
          <a href="/services/tools" className={styles.card3} onClick={playClickSound}>
            <InlineSVG src="/services/Custom Tools.svg" />
          </a>

          {/* Card 4: Automation (Built from layers) */}
          <a href="/services/automation" className={styles.card4} onClick={playClickSound}>
            {/* Rectangle 128 Icon background */}
            <InlineSVG src="/services/Rectangle 128.svg" className={styles.iconBg} />
            {/* Gear Icon (Mask group.svg) */}
            <InlineSVG src="/services/Mask group.svg" className={styles.gearIcon} />
            {/* Automation text header */}
            <InlineSVG src="/services/Automation.svg" className={styles.card4Title} />
            {/* E-commerce Automation text header */}
            <InlineSVG src="/services/E-commerce Automation.svg" className={styles.card4Subtitle} />
            {/* Description text */}
            <InlineSVG 
              src="/services/Your business functions and scales silently around the clock, even when you are offline. Our AI-first pipelines take over complex data processing and repetitive decision paths, wiping out human error and keeping your operations moving forward with.svg" 
              className={styles.card4Desc} 
            />
          </a>

          {/* Side Indicator */}
          <InlineSVG src="/services/Side Indicator.svg" className={styles.sideIndicator} />

          {/* ----- SECTION 3: TERMS & RULES OF ENGAGEMENT ----- */}
          <InlineSVG src="/services/Terms & Rules of Engagement.svg" className={styles.termsTitle} />
          <InlineSVG src="/services/Defining mutual commitment across financing, centralized updates, and locked timelines..svg" className={styles.termsSubtitle} />

          {/* Neumorphic Terms Container Box */}
          <div className={styles.termsContainer}>
            <InlineSVG src="/services/Rectangle 137.svg" className={styles.termsBorder} />
            
            {/* Divider Line */}
            <InlineSVG src="/services/Line 50.svg" className={styles.termsDivider} />

            {/* Terms & Rules Content */}
            <InlineSVG src="/services/Frame 197.svg" className={styles.termsContent} />

            {/* Terms Button */}
            <InlineSVG src="/services/Frame 198.svg" className={styles.btnTerms} />
            
            {/* Rules Button */}
            <InlineSVG src="/services/Frame 199.svg" className={styles.btnRules} />
          </div>

          {/* ===== 3D DRAGGABLE THEME SWITCH OVERLAY ===== */}
          <ThemeToggle className={styles.slideButton} />
        </div>
      </main>

      {/* ----- SECTION 4: FOOTER ----- */}
      <Footer />
    </div>
  );
}
