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

export default function ServicesPage() {
  const { isDark } = useTheme();
              
        
  // Email state for footer newsletter subscription
  const [footerEmail, setFooterEmail] = useState("");

  
  
    const playClickSound = useCallback(() => {
    try {
      const audio = new Audio("/touchpad sd.mp3");
      audio.volume = 0.85;
      audio.play().catch(() => {});
    } catch (e) {
      /* ignore */
    }
  }, []);

  
  
  
  
  
  
  const handleSubscribe = (e) => {
    e.preventDefault();
    playClickSound();
    if (footerEmail) {
      alert(`Thank you for subscribing with: ${footerEmail}`);
      setFooterEmail("");
    } else {
      alert("Please enter a valid email address.");
    }
  };

  const handleSocialClick = (socialName) => {
    playClickSound();
    alert(`Navigating to Aeethod ${socialName}...`);
  };

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
              <a href="#" className={styles.navLink} onClick={() => alert("Vlog coming soon")}>
                Vlog
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

          {/* ----- SECTION 4: FOOTER ----- */}
          <div className={styles.footerWrapper}>
            <InlineSVG src="/services/Footer.svg" className={styles.footerSvg} />

            {/* Social media tiles (Frame 67) */}
            <div className={styles.socialsGroup}>
              <button 
                className={styles.socialTile} 
                onClick={() => handleSocialClick("LinkedIn")}
                aria-label="LinkedIn"
              >
                <svg className={styles.socialIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                  <rect x="2" y="9" width="4" height="12" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </button>

              <button 
                className={styles.socialTile} 
                onClick={() => handleSocialClick("Instagram")}
                aria-label="Instagram"
              >
                <svg className={styles.socialIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </button>

              <button 
                className={styles.socialTile} 
                onClick={() => handleSocialClick("YouTube")}
                aria-label="YouTube"
              >
                <svg className={styles.socialIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
                  <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="currentColor" />
                </svg>
              </button>
            </div>

            {/* Interactive Email Subscription Overlay on the Footer's email box */}
            <form onSubmit={handleSubscribe} className={styles.footerSearchForm}>
              <input
                className={styles.footerSearchInput}
                type="email"
                placeholder="you@gmail.com"
                value={footerEmail}
                onChange={(e) => setFooterEmail(e.target.value)}
                required
                aria-label="Email address in footer"
              />
              <button
                className={styles.footerSearchSubmit}
                type="submit"
                aria-label="Submit email in footer"
              />
            </form>

            {/* Copyright Banner rendered outside the input to avoid overlapping text */}
            <div className={styles.copyrightBanner}>
              @2026 Aeethod. All rights reserved.
            </div>
          </div>

          {/* ===== 3D DRAGGABLE THEME SWITCH OVERLAY ===== */}
          <ThemeToggle className={styles.slideButton} />
        </div>
      </main>
    </div>
  );
}
