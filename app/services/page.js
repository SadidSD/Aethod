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

function AnimatedTcgIcon() {
  return (
    <svg width="74" height="74" viewBox="0 0 74 74" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.iconBg}>
      <rect x="6.898" y="6.898" width="57.49" height="57.49" rx="11.498" fill="#ECECEC" />
      <rect x="8.048" y="8.048" width="55.19" height="55.19" rx="10.348" stroke="url(#tcgBorderGrad)" strokeWidth="2.3" />
      <defs>
        <radialGradient id="tcgBorderGrad" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(35.6 35.6) rotate(90) scale(28.7)">
          <stop stopColor="#5A69EA"/>
          <stop offset="1" stopColor="#BF8BCA"/>
        </radialGradient>
      </defs>
      <g className={styles.tcgCards}>
        {/* Card 1 (Back) */}
        <rect x="22" y="25" width="20" height="28" rx="2" fill="#BF8BCA" stroke="#ffffff" strokeWidth="1" className={styles.tcgCardBack} />
        {/* Card 2 (Front) */}
        <rect x="32" y="21" width="20" height="28" rx="2" fill="#5A69EA" stroke="#ffffff" strokeWidth="1" className={styles.tcgCardFront} />
      </g>
    </svg>
  );
}

function AnimatedWebIcon() {
  return (
    <svg width="74" height="74" viewBox="0 0 74 74" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.iconBg}>
      <rect x="6.898" y="6.898" width="57.49" height="57.49" rx="11.498" fill="#ECECEC" />
      <rect x="8.048" y="8.048" width="55.19" height="55.19" rx="10.348" stroke="url(#webBorderGrad)" strokeWidth="2.3" />
      <defs>
        <radialGradient id="webBorderGrad" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(35.6 35.6) rotate(90) scale(28.7)">
          <stop stopColor="#5A69EA"/>
          <stop offset="1" stopColor="#B2CEFE"/>
        </radialGradient>
      </defs>
      {/* Browser Window */}
      <rect x="21" y="24" width="32" height="24" rx="2" fill="#ffffff" stroke="#717171" strokeWidth="1.5" />
      <line x1="21" y1="30" x2="53" y2="30" stroke="#717171" strokeWidth="1.5" />
      <circle cx="26" cy="27" r="1" fill="#717171" />
      <circle cx="30" cy="27" r="1" fill="#717171" />
      {/* Mouse cursor arrow */}
      <path d="M42 34 L48 42 L45 43 L42 38 Z" fill="#5A69EA" className={styles.webCursor} />
    </svg>
  );
}

function AnimatedToolsIcon() {
  return (
    <svg width="74" height="74" viewBox="0 0 74 74" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.iconBg}>
      <rect x="6.898" y="6.898" width="57.49" height="57.49" rx="11.498" fill="#ECECEC" />
      <rect x="8.048" y="8.048" width="55.19" height="55.19" rx="10.348" stroke="url(#toolsBorderGrad)" strokeWidth="2.3" />
      <defs>
        <radialGradient id="toolsBorderGrad" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(35.6 35.6) rotate(90) scale(28.7)">
          <stop stopColor="#5A69EA"/>
          <stop offset="1" stopColor="#BF8BCA"/>
        </radialGradient>
      </defs>
      {/* Magic Wand Stick */}
      <path d="M22 48 L42 28" stroke="#717171" strokeWidth="3" strokeLinecap="round" className={styles.toolsWand} />
      {/* Wand Tip */}
      <path d="M42 28 L44 26" stroke="#BF8BCA" strokeWidth="4" strokeLinecap="round" className={styles.toolsWand} />
      {/* Sparkles */}
      <path d="M47 19 L49 21 L47 23 L45 21 Z" fill="#5A69EA" className={styles.sparkle1} />
      <path d="M36 20 L37 21 L36 22 L35 21 Z" fill="#BF8BCA" className={styles.sparkle2} />
    </svg>
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
      <Navbar activePage="services" />

      {/* ===== MAIN CONTAINER FLOW ===== */}
      <main className={styles.mainContainer}>
        <div className={styles.contentAlignContainer}>
          {/* ----- SECTION 1: HERO ----- */}
          <InlineSVG src="/services/Group 76.svg" className={styles.heroTitle} />


          {/* Card 1: TCG Website Ecosystem */}
          <a href="/services/tcg" className={styles.card1} onClick={playClickSound}>
            <InlineSVG src="/services/TCG Web.svg" />
            <AnimatedTcgIcon />
          </a>

          {/* Card 2: E-commerce Website Development */}
          <a href="/services/ecommerce" className={styles.card2} onClick={playClickSound}>
            <InlineSVG src="/services/Webs.svg" />
            <AnimatedWebIcon />
          </a>

          {/* Card 3: Custom E-commerce Tools */}
          <a href="/services/tools" className={styles.card3} onClick={playClickSound}>
            <InlineSVG src="/services/Custom Tools.svg" />
            <AnimatedToolsIcon />
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
          {/* <ThemeToggle className={styles.slideButton} /> */}
        </div>
      </main>

      {/* ----- SECTION 4: FOOTER ----- */}
      <Footer />
    </div>
  );
}
