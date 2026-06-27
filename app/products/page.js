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

export default function ProductsPage() {
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
      {/* Hidden global definitions for SVG gradients */}
      <svg style={{ position: "absolute", width: 0, height: 0, overflow: "hidden" }} aria-hidden="true">
        <defs>
          <linearGradient id="paint0_linear_dark_890_256" x1="3.62305" y1="-12" x2="46.0064" y2="222.334" gradientUnits="userSpaceOnUse">
            <stop offset="1" stopColor="#30304a" />
            <stop stopColor="#1a1a2e" />
          </linearGradient>
        </defs>
      </svg>
      {/* ===== FLOATING STICKY NAVIGATION ===== */}
      <Navbar activePage="products" />

      {/* ===== MAIN CONTAINER FLOW ===== */}
      <main className={styles.mainContainer}>
        <div className={styles.contentAlignContainer}>

          {/* ===== THEME SWITCH (Slide Button Overlay) ===== */}
          {/* <ThemeToggle className={styles.slideButton} /> */}

          {/* ===== FRAME 91 (Header Title Group) ===== */}
          <InlineSVG src="/products/Frame 91.svg" className={styles.frame91} />

          {/* ===== GROUP 64 (Coming soon + Back and Home buttons) ===== */}
          <div className={styles.group64Container}>
            <InlineSVG src="/products/Group 64.svg" className={styles.group64Svg} />
            
            {/* Interactive button overlays */}
            <a 
              href="#" 
              onClick={(e) => {
                e.preventDefault();
                playClickSound();
                window.history.back();
              }} 
              className={styles.backButtonOverlay} 
              aria-label="Go Back" 
            />
            <a 
              href="/" 
              onClick={() => playClickSound()}
              className={styles.homeButtonOverlay} 
              aria-label="Go Home" 
            />
          </div>

          {/* ===== SIDE INDICATOR (Right Vertical Marker) ===== */}
          <InlineSVG src="/products/Side Indicator.svg" className={styles.rightMarker} />

        </div>
      </main>

      {/* ===== FOOTER SECTION ===== */}
      <Footer />
    </div>
  );
}
