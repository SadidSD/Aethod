"use client";

import { useParams } from "next/navigation";
import { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import styles from "./essay.module.css";
import { useTheme } from "../../context/ThemeContext";
import Footer from "../../components/Footer";
import Navbar from "../../components/Navbar";
import { researchPapers } from "../../../content/researchPapers";

function InlineSVG({ src, className, style, alt = "TCG Systems Diagram" }) {
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      style={style}
      loading="eager"
    />
  );
}

export default function EssayDetailPage() {
  const { id } = useParams();
  const { isDark } = useTheme();

  // Support alias from older URLs to pure TCG papers
  const aliasMap = {
    "clarity-gap": "tcg-marketplace-margin-decay",
    "designing-uncertainty": "tcg-grading-condition-variance",
    "multi-agent-ecosystem": "tcg-multi-agent-automation",
    "predictive-latency": "tcg-omnichannel-race-conditions"
  };
  const resolvedId = aliasMap[id] || id;
  const essay = researchPapers[resolvedId];

  const playClickSound = useCallback(() => {
    try {
      const audio = new Audio("/touchpad sd.mp3");
      audio.volume = 0.85;
      audio.play().catch(() => {});
    } catch (e) {
      /* ignore */
    }
  }, []);

  const renderSubtitle = (subtitle, highlightedSubtitle) => {
    if (!subtitle) return "";
    const highlights = [
      highlightedSubtitle,
      "owned headless stores",
      "catalog explosion",
      "buyout bots",
      "secondary sourcing margins",
      "Mass decklist paste parsing",
      "digital binder sync",
      "condition degradation curves",
      "multi-agent architecture",
      "Eliminating double-selling",
      "owned infrastructure",
      "variant explosion",
      "undercut defense",
      "gross margin velocity",
      "cart conversion telemetry",
      "retention economics",
      "adaptive systems architectures"
    ].filter(Boolean);

    const matchedHighlight = highlights.find((h) => subtitle.includes(h));
    if (matchedHighlight) {
      const parts = subtitle.split(matchedHighlight);
      return (
        <>
          {parts[0]}
          <span>{matchedHighlight}</span>
          {parts.slice(1).join(matchedHighlight)}
        </>
      );
    }
    return subtitle;
  };

  const renderIllustration = (essay) => {
    if (essay.illustrationType === "graph") {
      return (
        <div className={styles.essayIllustration} suppressHydrationWarning={true}>
          <InlineSVG src={essay.illustrationSrc || "/research/tcg_fee_graph.svg"} />
        </div>
      );
    }
    if (essay.illustrationType === "tcg-multi-agent" || essay.id === "tcg-multi-agent-automation") {
      return (
        <div className={styles.essayIllustration} suppressHydrationWarning={true}>
          <InlineSVG src="/research/tcg_multi_agent.svg" />
        </div>
      );
    }
    if (essay.illustrationType === "tcg-omnichannel-sync" || essay.id === "tcg-omnichannel-race-conditions") {
      return (
        <div className={styles.essayIllustration} suppressHydrationWarning={true}>
          <InlineSVG src="/research/tcg_omnichannel_sync.svg" />
        </div>
      );
    }
    if (essay.illustrationSrc) {
      return (
        <div className={styles.essayIllustration} suppressHydrationWarning={true}>
          <InlineSVG src={essay.illustrationSrc} />
        </div>
      );
    }
    return null;
  };

  if (!essay) {
    return (
      <div className={styles.notFoundContainer} data-theme={isDark ? "dark" : "light"} suppressHydrationWarning={true}>
        <h1 className={styles.notFoundTitle}>Research Paper Not Found</h1>
        <p className={styles.notFoundDesc}>The requested research blueprint could not be located.</p>
        <Link href="/research" className={styles.backBtnWrapper} onClick={playClickSound}>
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.backBtnArrow}>
            <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span>Back to Research</span>
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.pageWrapper} data-theme={isDark ? "dark" : "light"} suppressHydrationWarning={true}>
      <Navbar activePage="research" />
      
      <main className={styles.mainContainer}>
        <Link href="/research" className={styles.backBtnWrapper} onClick={playClickSound}>
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.backBtnArrow}>
            <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span>Back to Research</span>
        </Link>
        
        <article className={styles.essayHeader} suppressHydrationWarning={true}>
          <div className={styles.headerMeta} suppressHydrationWarning={true}>
            <span className={`${styles.tagPill} ${styles[`tagPill_${essay.tagType || "green"}`]}`}>
              {essay.tag}
            </span>
            <span className={styles.dateText}>{essay.date}</span>
            <span className={styles.readTime}>• {essay.readTime}</span>
          </div>
          
          <h1 className={styles.essayTitle}>{essay.title}</h1>
          <h2 className={styles.essaySubtitle}>{renderSubtitle(essay.subtitle, essay.highlightedSubtitle)}</h2>
        </article>
        
        <div className={styles.divider} />

        {/* Render Dynamic Essay Illustration */}
        {renderIllustration(essay)}
        
        <div 
          className={styles.essayBody}
          dangerouslySetInnerHTML={{ __html: essay.content }}
          suppressHydrationWarning={true}
        />
      </main>
      
      <Footer />
    </div>
  );
}
