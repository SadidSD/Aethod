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
        <Link href="/works" className={styles.backBtnWrapper} onClick={playClickSound}>
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.backBtnArrow}>
            <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span>Back to Works</span>
        </Link>
      </div>
    );
  }

  const isStructured = Boolean(work && ((work.features && work.features.length > 0) || work.overview));

  const renderParagraphs = (textOrArray, customClass = styles.sectionParagraph) => {
    if (!textOrArray) return null;
    if (Array.isArray(textOrArray)) {
      return textOrArray.map((p, i) => (
        <p key={i} className={customClass}>{p}</p>
      ));
    }
    return textOrArray.split("\n\n").map((p, i) => (
      <p key={i} className={customClass}>{p}</p>
    ));
  };

  return (
    <div className={styles.pageWrapper} data-theme={isDark ? "dark" : "light"} suppressHydrationWarning={true}>
      <Navbar activePage="works" />
      
      <main className={styles.mainContainer}>
        <Link href="/works" className={styles.backBtnWrapper} onClick={playClickSound}>
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.backBtnArrow}>
            <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span>Back to Works</span>
        </Link>
        
        <header className={styles.workHeader} suppressHydrationWarning={true}>
          <div className={styles.headerMeta} suppressHydrationWarning={true}>
            {(work.tag || work.category) && (
              <span className={styles.tagPill}>{work.tag || work.category}</span>
            )}
            <span className={styles.metaLabel}>Client: <span className={styles.metaValue}>{work.client || "N/A"}</span></span>
            <span className={styles.metaLabel}>Date: <span className={styles.metaValue}>{work.date || "N/A"}</span></span>
            <span className={styles.metaLabel}>Role: <span className={styles.metaValue}>{work.role || "N/A"}</span></span>
            {work.link && work.link !== "#" && (
              <a 
                href={work.link} 
                target="_blank" 
                rel="noopener noreferrer" 
                className={styles.liveSiteBtn}
              >
                <span>Live Site</span>
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.externalArrow}>
                  <path d="M7 17L17 7M17 17V7H7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>
            )}
          </div>
          
          <h1 className={styles.workTitle}>{work.title || work.name}</h1>
          {work.subtitle && (
            <p className={styles.workSubtitle}>{work.subtitle}</p>
          )}
        </header>
        
        <div className={styles.divider} />

        {/* Render Mockup / Hero Preview Box */}
        {(work.heroImage || work.image) && (
          <div className={styles.workIllustrationContainer} suppressHydrationWarning={true}>
            <img 
              src={work.heroImage || work.image} 
              className={styles.illustrationImg} 
              alt={`${work.title || work.name} preview`} 
            />
          </div>
        )}
        
        {/* Render Case Study Context */}
        {isStructured ? (
          <>
            {work.overview && (
              <section className={styles.sectionBlock}>
                <h2 className={styles.sectionTitle}>Overview</h2>
                {renderParagraphs(work.overview)}
              </section>
            )}

            {work.features && work.features.length > 0 && (
              <section className={styles.sectionBlock}>
                <h2 className={styles.sectionTitle}>Key Features</h2>
                {work.featuresIntro && (
                  <p className={styles.featuresIntro}>{work.featuresIntro}</p>
                )}
                <div className={styles.featuresList}>
                  {work.features.map((feature, idx) => (
                    <div key={idx} className={styles.featureItem}>
                      <h3 className={styles.featureTitle}>{feature.title}</h3>
                      {renderParagraphs(feature.description, styles.featureDesc)}
                      {feature.image && (
                        <div className={styles.workIllustrationContainer}>
                          <img 
                            src={feature.image} 
                            className={styles.illustrationImg} 
                            alt={feature.title} 
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {work.results && (
              <section className={styles.sectionBlock}>
                <h2 className={styles.sectionTitle}>Results</h2>
                {renderParagraphs(work.results)}
              </section>
            )}
          </>
        ) : (
          <div 
            className={styles.workBody}
            dangerouslySetInnerHTML={{ __html: work.content || `<p>${work.description}</p>` }}
            suppressHydrationWarning={true}
          />
        )}
      </main>
      
      <Footer />
    </div>
  );
}

