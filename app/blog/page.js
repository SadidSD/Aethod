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

export default function BlogPage() {
  const { isDark } = useTheme();
              
        
  
  
  
  
  
  
  
  
  return (
    <div className={styles.pageWrapper} data-theme={isDark ? "dark" : "light"}>
      {/* ===== NAVIGATION ===== */}
      <Navbar activePage="blog" />
      <main className={styles.mainContainer}>
        <div className={styles.contentAlignContainer}>
          {/* Header (Frame 111) */}
          <InlineSVG src="/research/Frame 111.svg" className={styles.researchHeader} />

          {/* Sidebar (Frame 110) */}
          <InlineSVG src="/research/Frame 110.svg" className={styles.researchSidebar} />

          {/* Content (Frame 109) */}
          <InlineSVG src="/research/Frame 109.svg" className={styles.researchContent} />

          {/* Draggable Slide Toggle — Dark/Light Mode (Exactly like the Hero page) */}
          <ThemeToggle className={styles.slideButton} />
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
