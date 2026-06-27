"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import styles from "./page.module.css";
import { useTheme } from "../context/ThemeContext";
import ThemeToggle from "../components/ThemeToggle";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

import HowWeDifferTable from "./HowWeDifferTable";

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

export default function StudioPage() {
  const { isDark } = useTheme();
  const [gridInView, setGridInView] = useState(false);
  const gridRef = useRef(null);

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
    <div className={styles.pageWrapper} data-theme={isDark ? "dark" : "light"}>
      {/* ===== NAVIGATION ===== */}
      <Navbar activePage="studio" />

      {/* ===== MAIN CONTENT ===== */}
      <main className={styles.mainContainer}>
        <div className={styles.contentAlignContainer}>
          {/* ----- SECTION 1: HERO ----- */}
          <InlineSVG src="/studio/Studio.svg" className={styles.studioTitle} />
          <InlineSVG src="/studio/intelligence_before_interface.svg" className={styles.studioSubtitle} />
          
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
          
          <InlineSVG src="/studio/image 78.svg" className={styles.heroImageRight} />
          <InlineSVG src="/studio/image 77.svg" className={styles.heroImageLowerLeft} />
          <InlineSVG src="/studio/Frame 142.svg" className={styles.frame142} />

          {/* ----- SECTION 2: WHAT IS SYSTEM STUDIO & HOW WE DIFFER ----- */}
          <InlineSVG src="/studio/what_is_system_studio.svg" className={styles.whatIsTitle} />
          <InlineSVG src="/studio/where_agencies_end.svg" className={styles.whatIsSubtitle} />
          <div className={styles.whatIsSystemStudioContainer}>
            <div className={styles.whatIsParagraphRow}>
              <InlineSVG src="/studio/round_arrow_card.svg" className={styles.roundArrowCard} />
              <div className={styles.whatIsParagraphText}>
                An agency executes. A SaaS company scales. A systems studio thinks.{" "}
                <span className={styles.whatIsParagraphHighlight}>
                  We spend time inside a problem before touching it — understanding the data, the decisions, the friction. Then we design the system that makes all three cleaner.
                </span>{" "}
                That is the difference.
              </div>
            </div>
            <div className={styles.whatIsParagraphRow}>
              <InlineSVG src="/studio/round_arrow_card.svg" className={styles.roundArrowCard} />
              <div className={styles.whatIsParagraphText}>
                The architect still matters. The machine is a tool.{" "}
                <span className={styles.whatIsParagraphHighlight}>
                  The person who designs the system, knows what the machine intelligence must do — and keeps both working in their correct order —
                </span>{" "}
                that is someone is a thinker. That is who we are.
              </div>
            </div>
          </div>
          <div className={styles.howWeDifferCardWrapper}>
            <InlineSVG src="/studio/how_we_differ.svg" className={styles.howWeDifferTitle} />
            <HowWeDifferTable />
          </div>

          {/* ----- SECTION 3: THE MANIFESTO ----- */}
          <InlineSVG src="/studio/Rectangle 88.svg" className={styles.manifestoBg} />
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

          {/* ----- SECTION 4: HOW WE WORK ----- */}
          <InlineSVG src="/studio/how_we_work.svg" className={styles.howWeWorkSection} />

          {/* ----- SECTION 5: CALL TO ACTION BANNER ----- */}
          <div className={styles.ctaContainer}>
            <InlineSVG src={`/studio/_The first conversation costs nothing. The systems brief tells us both whether this is the right fit._.svg`} className={styles.ctaText} />
            <InlineSVG src="/studio/curved_line.svg" className={styles.ctaLineBottom} />
          </div>

          {/* ----- SECTION 6: AI CAPABILITY AREAS ----- */}
          <InlineSVG src="/studio/Frame 78.svg" className={styles.capabilityHeader} />
          <InlineSVG src="/studio/Group 75.svg" className={styles.capabilityGrid} />

          {/* ===== 3D DRAGGABLE THEME SWITCH OVERLAY ===== */}
          <ThemeToggle className={styles.slideButton} />
        </div>
      </main>

      {/* ----- SECTION 7: FOOTER ----- */}
      <Footer />
    </div>
  );
}
