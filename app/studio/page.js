"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import styles from "./page.module.css";
import { useTheme } from "../context/ThemeContext";
import ThemeToggle from "../components/ThemeToggle";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

import HowWeDifferTable from "./HowWeDifferTable";

function InlineSVG({ src, className, isMobile, crop }) {
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

  let processedContent = svgContent;
  if (svgContent) {
    if (isMobile && src === "/studio/Group 75.svg") {
      processedContent = svgContent
        .replace(/viewBox="0 0 1339 1102"/, 'viewBox="0 0 452 2550"')
        .replace(/width="1339" height="1102"/, 'width="452" height="2550"');
    } else if (src === "/studio/how_we_work.svg") {
      if (crop === "top") {
        processedContent = svgContent
          .replace(/<path[^>]*?d="M145\.568[^>]*?>/i, "")
          .replace(/<path[^>]*?d="M328\.76[^>]*?>/i, "")
          .replace(/<path[^>]*?d="M132\.696[^>]*?>/i, "")
          .replace(/viewBox="0 0 1440 2541"/, 'viewBox="0 0 1440 700"')
          .replace(/width="1440" height="2541"/, 'width="1440" height="700"');
      } else if (crop === "bottom") {
        processedContent = svgContent
          .replace(/viewBox="0 0 1440 2541"/, 'viewBox="0 1430 1440 1111"')
          .replace(/width="1440" height="2541"/, 'width="1440" height="1111"');
      } else if (crop === "title") {
        processedContent = svgContent
          .replace(/viewBox="0 0 1440 2541"/, 'viewBox="0 0 1440 120"')
          .replace(/width="1440" height="2541"/, 'width="1440" height="120"');
      } else if (crop === "text") {
        processedContent = svgContent
          .replace(/viewBox="0 0 1440 2541"/, 'viewBox="0 1000 1440 1541"')
          .replace(/width="1440" height="2541"/, 'width="1440" height="1541"');
      } else if (crop === "image") {
        processedContent = svgContent
          .replace(/viewBox="0 0 1440 2541"/, 'viewBox="0 120 1440 880"')
          .replace(/width="1440" height="2541"/, 'width="1440" height="880"');
      }
    }
  }

  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{ __html: processedContent }}
      suppressHydrationWarning={true}
    />
  );
}

export default function StudioPage() {
  const { isDark } = useTheme();
  const [gridInView, setGridInView] = useState(false);
  const gridRef = useRef(null);
  const containerRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);
  const [expandedParagraphs, setExpandedParagraphs] = useState({});

  const toggleParagraph = (id) => {
    setExpandedParagraphs((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        entry.target.style.setProperty('--content-height', `${entry.target.offsetHeight}px`);
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 767);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setGridInView(true);
        }
      },
      { threshold: 0.45 }
    );

    if (gridRef.current) {
      observer.observe(gridRef.current);
    }

    return () => {
      if (gridRef.current) {
        observer.unobserve(gridRef.current);
      }
    };
  }, []);

  return (
    <div className={styles.pageWrapper} data-theme={isDark ? "dark" : "light"} suppressHydrationWarning={true}>
      {/* ===== NAVIGATION ===== */}
      <Navbar activePage="studio" />

      {/* ===== MAIN CONTENT ===== */}
      <main className={styles.mainContainer}>
        <div ref={containerRef} className={styles.contentAlignContainer}>
          {/* ----- SECTION 1: HERO ----- */}
          <div className={styles.section1Hero}>
            <InlineSVG src="/studio/Studio.svg" className={styles.studioTitle} />
            <InlineSVG src="/studio/intelligence_before_interface.svg" className={styles.studioSubtitle} />
            
            <div className={styles.aboutCardWrapper}>
              <div className={styles.rectangle158} />
              <InlineSVG src="/studio/who_we_are.svg" className={styles.whoWeAre} />
              <div className={styles.weAreNotAnAgencyContainer}>
                <div className={styles.agencyFirstLine}>
                  <div className={styles.arrowBox}>
                    <InlineSVG src="/studio/Arrow down-right.svg" className={styles.arrowIcon} />
                  </div>
                  <span>We are not an agency.</span>
                </div>
                <div className={styles.agencyTextLine}>
                  We are not a SaaS company.
                </div>
                <div className={`${styles.agencyTextLine} ${styles.systemsStudioGradientText}`}>
                  We are a systems studio.
                </div>
              </div>
            </div>
            
            <div className={styles.heroImagesWrapper}>
              <InlineSVG src="/studio/image 78.svg" className={styles.heroImageRight} />
              <InlineSVG src="/studio/Frame 142.svg" className={styles.frame142} />
              <InlineSVG src="/studio/image 77.svg" className={styles.heroImageLowerLeft} />
            </div>
          </div>

          {/* ----- SECTION 2: WHAT IS SYSTEM STUDIO & HOW WE DIFFER ----- */}
          <div className={styles.section2WhatIs}>
            <InlineSVG src="/studio/what_is_system_studio.svg" className={styles.whatIsTitle} />
            <InlineSVG src="/studio/where_agencies_end.svg" className={styles.whatIsSubtitle} />
            <div className={styles.whatIsSystemStudioContainer}>
              <div className={styles.whatIsParagraphRow}>
                <InlineSVG src="/studio/round_arrow_card.svg" className={styles.roundArrowCard} />
                <div className={styles.whatIsParagraphTextContainer}>
                  <div className={`${styles.whatIsParagraphText} ${expandedParagraphs.p1 ? styles.expanded : ""}`}>
                    An agency executes. A SaaS company scales. A systems studio thinks.{" "}
                    <span className={styles.whatIsParagraphHighlight}>
                      We spend time inside a problem before touching it — understanding the data, the decisions, the friction. Then we design the system that makes all three cleaner.
                    </span>{" "}
                    That is the difference.
                  </div>
                  <button 
                    className={styles.seeMoreBtn}
                    onClick={() => toggleParagraph("p1")}
                    aria-expanded={expandedParagraphs.p1}
                  >
                    {expandedParagraphs.p1 ? "See Less" : "See More"}
                  </button>
                </div>
              </div>
              <div className={styles.whatIsParagraphRow}>
                <InlineSVG src="/studio/round_arrow_card.svg" className={styles.roundArrowCard} />
                <div className={styles.whatIsParagraphTextContainer}>
                  <div className={`${styles.whatIsParagraphText} ${expandedParagraphs.p2 ? styles.expanded : ""}`}>
                    The architect still matters. The machine is a tool.{" "}
                    <span className={styles.whatIsParagraphHighlight}>
                      The person who designs the system, knows what the machine intelligence must do — and keeps both working in their correct order —
                    </span>{" "}
                    that is someone is a thinker. That is who we are.
                  </div>
                  <button 
                    className={styles.seeMoreBtn}
                    onClick={() => toggleParagraph("p2")}
                    aria-expanded={expandedParagraphs.p2}
                  >
                    {expandedParagraphs.p2 ? "See Less" : "See More"}
                  </button>
                </div>
              </div>
            </div>
            <div className={styles.howWeDifferCardWrapper}>
              <InlineSVG src="/studio/how_we_differ.svg" className={styles.howWeDifferTitle} />
              <HowWeDifferTable />
            </div>
          </div>

          {/* ----- SECTION 3: THE MANIFESTO ----- */}
          <div className={styles.section3Manifesto}>
            <InlineSVG src="/studio/curved_line.svg" className={styles.manifestoLineTop} />
            <InlineSVG src="/studio/The Manifesto.svg" className={styles.manifestoTitle} />
            <InlineSVG src="/studio/Four things we believe.svg" className={styles.manifestoSubtitle} />
            
            <div className={styles.manifestoGridBox} ref={gridRef}>
              <InlineSVG src="/studio/Rectangle 90.svg" className={`${styles.manifestoGridLineVert} ${gridInView ? styles.animateVert : styles.hiddenVert}`} />
              <InlineSVG src="/studio/Rectangle 91.svg" className={`${styles.manifestoGridLineHoriz} ${gridInView ? styles.animateHoriz : styles.hiddenHoriz}`} />
              
              <InlineSVG src="/studio/Group 50.svg" className={styles.manifestoGroup01} />
              <InlineSVG src="/studio/Group 51.svg" className={styles.manifestoGroup02} />
              <InlineSVG src="/studio/Group 52.svg" className={styles.manifestoGroup03} />
              <InlineSVG src="/studio/Group 53.svg" className={styles.manifestoGroup04} />
            </div>
            
            <InlineSVG src="/studio/Humans architect. AI executes. Data makes it true. That is what we build..svg" className={styles.manifestoQuote} />
          </div>

          {/* ----- SECTION 4: HOW WE WORK ----- */}
          <div className={styles.section4HowWeWork}>
            <div className={styles.howWeWorkSection}>
              <div className={styles.howWeWorkTitleContainer}>
                <h2 className={styles.howWeWorkTitle}>
                  How we <span className={styles.purpleHighlightText}>work</span>
                </h2>
                <p className={styles.howWeWorkSubtitle}>
                  05 steps from first conversation to delivered system. Each step has a clear input, output, and principle behind it.
                </p>
              </div>
              <InlineSVG 
                src="/studio/how_we_work.svg" 
                className={styles.howWeWorkTop}
                isMobile={isMobile} 
                crop="top"
              />
              <InlineSVG 
                src="/studio/how_we_work.svg" 
                className={styles.howWeWorkBottom}
                isMobile={isMobile} 
                crop="bottom"
              />
            </div>
          </div>

          {/* ----- SECTION 5: CALL TO ACTION BANNER ----- */}
          <div className={styles.section5Cta}>
            <div className={styles.ctaContainer}>
              <InlineSVG src="/studio/curved_line.svg" className={styles.ctaLineTop} />
              <InlineSVG src={`/studio/_The first conversation costs nothing. The systems brief tells us both whether this is the right fit._.svg`} className={styles.ctaText} />
              <InlineSVG src="/studio/curved_line.svg" className={styles.ctaLineBottom} />
            </div>
          </div>

          {/* ----- SECTION 6: AI CAPABILITY AREAS ----- */}
          <div className={styles.section6Capabilities}>
            <InlineSVG src="/studio/Frame 78.svg" className={styles.capabilityHeader} />
            <div className={styles.capabilityGridWrapper}>
              <InlineSVG src="/studio/Group 75.svg" className={styles.capabilityGrid} isMobile={isMobile} />
            </div>
          </div>

          {/* ===== 3D DRAGGABLE THEME SWITCH OVERLAY ===== */}
          {/* <ThemeToggle className={styles.slideButton} /> */}
        </div>
      </main>

      {/* ----- SECTION 7: FOOTER ----- */}
      <Footer />
    </div>
  );
}
