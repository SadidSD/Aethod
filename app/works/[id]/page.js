"use client";

import { useParams } from "next/navigation";
import { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import styles from "./works-detail.module.css";
import { useTheme } from "../../context/ThemeContext";
import Footer from "../../components/Footer";
import Navbar from "../../components/Navbar";

export default function WorkDetailPage() {
  const { id } = useParams();
  const { isDark } = useTheme();
  const [work, setWork] = useState(null);
  const [loading, setLoading] = useState(true);

  const playClickSound = useCallback(() => {
    try {
      const audio = new Audio("/touchpad sd.mp3");
      audio.volume = 0.85;
      audio.play().catch(() => {});
    } catch (e) {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    if (!id) return;
    fetch("/api/content?type=works", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        // 1. Try exact string/number match
        let found = data.find((project) => String(project.id) === String(id));
        
        // 2. Fallback to index-based match if ID is a number (1-indexed for legacy compatibility)
        if (!found && !isNaN(id)) {
          const idx = parseInt(id) - 1;
          if (idx >= 0 && idx < data.length) {
            found = data[idx];
          }
        }
        
        setWork(found);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load works database:", err);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className={styles.notFoundContainer} data-theme={isDark ? "dark" : "light"} suppressHydrationWarning={true}>
        <h1 className={styles.notFoundTitle}>Loading...</h1>
      </div>
    );
  }

  if (!work) {
    return (
      <div className={styles.notFoundContainer} data-theme={isDark ? "dark" : "light"} suppressHydrationWarning={true}>
        <h1 className={styles.notFoundTitle}>Project Not Found</h1>
        <p className={styles.notFoundDesc}>The requested case study could not be located.</p>
        <Link href="/works" className={styles.backLink} onClick={playClickSound}>
          Back to Works
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.pageWrapper} data-theme={isDark ? "dark" : "light"} suppressHydrationWarning={true}>
      <Navbar activePage="works" />
      
      <main className={styles.mainContainer}>
        <Link href="/works" className={styles.backLink} onClick={playClickSound}>
          ← Back to Works
        </Link>
        
        <header className={styles.workHeader} suppressHydrationWarning={true}>
          <div className={styles.headerMeta} suppressHydrationWarning={true}>
            <span className={styles.tagPill}>{work.tag}</span>
            <span className={styles.metaLabel}>Client: <span className={styles.metaValue}>{work.client || "N/A"}</span></span>
            <span className={styles.metaLabel}>Date: <span className={styles.metaValue}>{work.date || "N/A"}</span></span>
            <span className={styles.metaLabel}>Role: <span className={styles.metaValue}>{work.role || "N/A"}</span></span>
          </div>
          
          <h1 className={styles.workTitle}>{work.title || work.name}</h1>
        </header>
        
        <div className={styles.divider} />

        {/* Render Mockup Preview Box */}
        {work.image && (
          <div className={styles.workIllustrationContainer} suppressHydrationWarning={true}>
            <img src={work.image} className={styles.illustrationImg} alt={`${work.title || work.name} mockup`} />
          </div>
        )}
        
        {/* Render Case Study Context */}
        <div 
          className={styles.workBody}
          dangerouslySetInnerHTML={{ __html: work.content || `<p>${work.description}</p>` }}
          suppressHydrationWarning={true}
        />
      </main>
      
      <Footer />
    </div>
  );
}
