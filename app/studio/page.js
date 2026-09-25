"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import styles from "./page.module.css";
import { useTheme } from "../context/ThemeContext";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

import HowWeDifferTable from "./HowWeDifferTable";
import CapabilityGrid from "./CapabilityGrid";

function InlineSVG({ src, className, isMobile, isTabletOrMobile, crop }) {
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
          .replace(
            /viewBox="0 0 1440 2541"/,
            isTabletOrMobile ? 'viewBox="0 -40 1440 740"' : 'viewBox="0 0 1440 700"'
          )
          .replace(
            /width="1440" height="2541"/,
            isTabletOrMobile ? 'width="1440" height="740"' : 'width="1440" height="700"'
          );
      } else if (crop === "bottom") {
        processedContent = svgContent
          .replace(
            /viewBox="0 0 1440 2541"/,
            isTabletOrMobile ? 'viewBox="0 1430 1440 1111"' : 'viewBox="0 1430 1440 1111"'
          )
          .replace(
            /width="1440" height="2541"/,
            isTabletOrMobile ? 'width="1440" height="1111"' : 'width="1440" height="1111"'
          );
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
  const [isTabletOrMobile, setIsTabletOrMobile] = useState(false);
  const [expandedParagraphs, setExpandedParagraphs] = useState({});
  const [manifestoExpanded, setManifestoExpanded] = useState(false);

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
      setIsTabletOrMobile(window.innerWidth < 1024);
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

    const currentGrid = gridRef.current;
    if (currentGrid) {
      observer.observe(currentGrid);
    }

    return () => {
      if (currentGrid) {
        observer.unobserve(currentGrid);
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
            <h1 className={styles.studioTitle}>Studio</h1>
            <p className={styles.studioSubtitle}>
              Infrastructure, <span className={styles.purpleTabletAccent}>beyond the platform.</span>
            </p>
            
            <div className={styles.aboutCardWrapper}>
              <div className={styles.rectangle158} />
              <h2 className={styles.whoWeAre}>Who we are?</h2>
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
                  We are a vertical technology studio.
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
            <h2 className={styles.whatIsTitle}>What is a vertical technology studio?</h2>
            <p className={styles.whatIsSubtitle}>Where platforms end.</p>
            <div className={styles.whatIsSystemStudioContainer}>
              <div className={styles.whatIsParagraphRow}>
                <InlineSVG src="/studio/round_arrow_card.svg" className={styles.roundArrowCard} />
                <div className={styles.whatIsParagraphTextContainer}>
                  <div className={`${styles.whatIsParagraphText} ${expandedParagraphs.p1 ? styles.expanded : ""}`}>
                    An agency builds websites. An off-the-shelf platform locks you in. A vertical technology studio architects infrastructure.{" "}
                    <span className={styles.whatIsParagraphHighlight}>
                      When your TCG business expands across marketplaces, physical storefronts, buylists, and inventory channels, fragmented tools break down. We spend time inside your operations to unify inventory, sync sales channels, and eliminate manual friction.
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
                    Platforms are built for starting. They are not the final form of a growing business.{" "}
                    <span className={styles.whatIsParagraphHighlight}>
                      When off-the-shelf tools can no longer handle your catalogue velocity, multi-channel stock, and fulfillment complexity, you need custom digital infrastructure engineered specifically around how your TCG business operates.
                    </span>{" "}
                    That is who we are.
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
              <h2 className={styles.howWeDifferTitle}>How we differ</h2>
              <HowWeDifferTable />
            </div>
          </div>

          {/* ----- SECTION 3: THE MANIFESTO ----- */}
          <div className={styles.section3Manifesto}>
            <InlineSVG src="/studio/curved_line.svg" className={styles.manifestoLineTop} />
            <h2 className={styles.manifestoTitle}>
              The <br className={styles.tabletOnlyBr} />
              <span className={styles.purpleTabletAccent}>Manifesto</span>
            </h2>
            <p className={styles.manifestoSubtitle}>
              Four things we believe <br className={styles.tabletOnlyBr} />
              <span className={styles.purpleTabletAccent}>most studios won't say.</span>
            </p>
            
            <div className={styles.manifestoGridBox} ref={gridRef}>
              <InlineSVG src="/studio/Rectangle 90.svg" className={`${styles.manifestoGridLineVert} ${gridInView ? styles.animateVert : styles.hiddenVert}`} />
              <InlineSVG src="/studio/Rectangle 91.svg" className={`${styles.manifestoGridLineHoriz} ${gridInView ? styles.animateHoriz : styles.hiddenHoriz}`} />
              
              <InlineSVG src="/studio/Group 50.svg" className={styles.manifestoGroup01} />
              <InlineSVG src="/studio/Group 51.svg" className={styles.manifestoGroup02} />
              {(!isTabletOrMobile || manifestoExpanded) && (
                <>
                  <InlineSVG src="/studio/Group 52.svg" className={styles.manifestoGroup03} />
                  <InlineSVG src="/studio/Group 53.svg" className={styles.manifestoGroup04} />
                </>
              )}
            </div>

            {isTabletOrMobile && (
              <button 
                className={styles.seeMoreBtn} 
                onClick={() => setManifestoExpanded(!manifestoExpanded)}
                style={{ display: 'block', margin: '24px auto 0 auto' }}
              >
                {manifestoExpanded ? "See Less" : "See More"}
              </button>
            )}
            
            <blockquote className={styles.manifestoQuote}>
              Platforms help you start. Custom infrastructure lets you scale.<br />
              When your TCG business outgrows its tools, we build what comes next.
            </blockquote>
          </div>

          {/* ----- SECTION 3.5: THE BUILDERS & CREATIVE PARTNERS ----- */}
          <div className={styles.sectionTeam}>
            <div className={styles.teamHeader}>
              <div className={styles.teamBadge}>
                <span>Studio Leadership</span>
              </div>
              <h2 className={styles.teamTitle}>
                The <span className={styles.purpleHighlightText}>Builders</span>
              </h2>
              <p className={styles.teamSubtitle}>
                Aeethod is a vertical systems studio led by collectors and engineers. We combine lifelong domain immersion in the trading card economy with deep systems engineering.
              </p>
            </div>

            <div className={styles.teamGrid}>
              {/* Member 1: Sadid Bin Hasan */}
              <div className={styles.teamCard}>
                <div className={styles.teamCardHeader}>
                  <div className={styles.teamAvatarWrapper}>
                    <img 
                      src="/team/sadid.jpg" 
                      alt="Sadid Bin Hasan" 
                      className={styles.teamAvatarImg}
                      onError={(e) => { e.currentTarget.style.display = 'none'; }}
                    />
                    <div className={styles.teamAvatarFallback}>
                      <span>SB</span>
                    </div>
                  </div>
                  <div className={styles.teamMeta}>
                    <span className={styles.teamRoleBadge}>Founder & Principal Architect</span>
                    <h3 className={styles.teamName}>Sadid Bin Hasan</h3>
                    <span className={styles.teamSpecialty}>Architecture & Systems Strategy</span>
                  </div>
                </div>
                <p className={styles.teamBio}>
                  A lifelong Pokémon collector turned systems engineer. Sadid began programming web architectures, autonomous agents, and business automations in his teens before recognizing the critical operational bottlenecks of the TCG retail economy. Seeing store owners squeezed by marketplace fees and crippled by fragile, legacy POS software, he founded Aeethod to engineer sovereign, high-throughput digital platforms that card shops own permanently.
                </p>
                <div className={styles.teamTags}>
                  <span className={styles.teamTag}>Core System Architecture</span>
                  <span className={styles.teamTag}>Omnichannel Sync Meshes</span>
                  <span className={styles.teamTag}>Sovereign E-Commerce</span>
                  <span className={styles.teamTag}>Algorithmic Repricing</span>
                </div>
                <div className={styles.teamSocials}>
                  <a href="https://www.linkedin.com/in/sadidbinhasan" target="_blank" rel="noopener noreferrer" className={styles.teamSocialLink} aria-label="Sadid Bin Hasan on LinkedIn">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.45a1.62 1.62 0 0 0-1.63 1.62c0 .9.73 1.62 1.63 1.62.9 0 1.63-.72 1.63-1.62 0-.9-.73-1.62-1.63-1.62z"/></svg>
                    <span>LinkedIn</span>
                  </a>
                  <a href="https://github.com/SadidSD" target="_blank" rel="noopener noreferrer" className={styles.teamSocialLink} aria-label="Sadid Bin Hasan on GitHub">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.1-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z"/></svg>
                    <span>GitHub</span>
                  </a>
                  <a href="mailto:sadidbinhasan3@gmail.com" className={styles.teamSocialLink} aria-label="Email Sadid">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                    <span>Email</span>
                  </a>
                </div>
              </div>

              {/* Member 2: Anika Zaman */}
              <div className={styles.teamCard}>
                <div className={styles.teamCardHeader}>
                  <div className={styles.teamAvatarWrapper}>
                    <img 
                      src="/team/anika.jpg" 
                      alt="Anika Zaman" 
                      className={styles.teamAvatarImg}
                      onError={(e) => { e.currentTarget.style.display = 'none'; }}
                    />
                    <div className={styles.teamAvatarFallback}>
                      <span>AZ</span>
                    </div>
                  </div>
                  <div className={styles.teamMeta}>
                    <span className={styles.teamRoleBadge}>Lead Systems Developer</span>
                    <h3 className={styles.teamName}>Anika Zaman</h3>
                    <span className={styles.teamSpecialty}>High-Throughput Engineering & Integrations</span>
                  </div>
                </div>
                <p className={styles.teamBio}>
                  Passionate about software engineering from childhood and coding since her teenage years, Anika was scouted by Sadid at university for her exceptional systems rigor and algorithmic precision. At Aeethod, she engineers the high-reliability backend pipelines, edge caching layers, and multi-channel webhook meshes that keep 100,000+ card SKUs synced with zero race conditions and zero overselling.
                </p>
                <div className={styles.teamTags}>
                  <span className={styles.teamTag}>Real-Time Webhook Mesh</span>
                  <span className={styles.teamTag}>Sub-35ms Search Pipelines</span>
                  <span className={styles.teamTag}>Multi-Channel Inventory</span>
                  <span className={styles.teamTag}>Database Concurrency</span>
                </div>
                <div className={styles.teamSocials}>
                  <span className={styles.teamPartnerBadge}>Creative Partner · Systems Development</span>
                </div>
              </div>

              {/* Member 3: Nayem Hasan */}
              <div className={styles.teamCard}>
                <div className={styles.teamCardHeader}>
                  <div className={styles.teamAvatarWrapper}>
                    <img 
                      src="/team/nayem.jpg" 
                      alt="Nayem Hasan" 
                      className={styles.teamAvatarImg}
                      onError={(e) => { e.currentTarget.style.display = 'none'; }}
                    />
                    <div className={styles.teamAvatarFallback}>
                      <span>NH</span>
                    </div>
                  </div>
                  <div className={styles.teamMeta}>
                    <span className={styles.teamRoleBadge}>Head of Product Design</span>
                    <h3 className={styles.teamName}>Nayem Hasan</h3>
                    <span className={styles.teamSpecialty}>Collectibles UI/UX & Commerce Strategy</span>
                  </div>
                </div>
                <p className={styles.teamBio}>
                  Combining sharp visual intuition with a keen commercial mindset, Nayem was scouted by Sadid at university to redefine the digital experience of card collecting. He bridges collector psychology with high-converting ecommerce flows—replacing clunky 2012-era templates with fast, tactile, mobile-first interfaces that turn casual collectors into high-LTV repeat buyers.
                </p>
                <div className={styles.teamTags}>
                  <span className={styles.teamTag}>Collector Experience (CX)</span>
                  <span className={styles.teamTag}>Deep-Variant Matrix UI</span>
                  <span className={styles.teamTag}>High-AOV Checkout</span>
                  <span className={styles.teamTag}>Design Systems</span>
                </div>
                <div className={styles.teamSocials}>
                  <span className={styles.teamPartnerBadge}>Creative Partner · Product Design</span>
                </div>
              </div>
            </div>
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
                isTabletOrMobile={isTabletOrMobile} 
                crop="top"
              />
              <InlineSVG 
                src="/studio/how_we_work.svg" 
                className={styles.howWeWorkBottom}
                isMobile={isMobile} 
                isTabletOrMobile={isTabletOrMobile} 
                crop="bottom"
              />
            </div>
          </div>

          {/* ----- SECTION 5: CALL TO ACTION BANNER ----- */}
          <div className={styles.section5Cta}>
            <div className={styles.ctaContainer}>
              <InlineSVG src="/studio/curved_line.svg" className={styles.ctaLineTop} />
              <blockquote className={styles.ctaText}>
                The first conversation costs nothing. We examine your operations, map the friction, and determine if custom infrastructure is what should come next.
              </blockquote>
              <InlineSVG src="/studio/curved_line.svg" className={styles.ctaLineBottom} />
            </div>
          </div>

          {/* ----- SECTION 6: SYSTEM CAPABILITY AREAS ----- */}
          <div className={styles.section6Capabilities}>
            <h2 className={styles.capabilityHeader}>
              {"System Capability ".split("").map((char, i) => (
                <span
                  key={i}
                  className={styles.waveChar}
                  style={{ animationDelay: `${i * 0.15}s` }}
                >
                  {char === " " ? "\u00A0" : char}
                </span>
              ))}
              <br className={styles.capabilityBr} />
              {"Areas".split("").map((char, i) => (
                <span
                  key={i + 18}
                  className={styles.waveChar}
                  style={{ animationDelay: `${(i + 18) * 0.15}s` }}
                >
                  {char}
                </span>
              ))}
            </h2>
            <div className={styles.capabilityGridWrapper}>
              <CapabilityGrid className={styles.capabilityGrid} />
            </div>
          </div>

          {/* ===== 3D DRAGGABLE THEME SWITCH OVERLAY ===== */}
        </div>
      </main>

      {/* ----- SECTION 7: FOOTER ----- */}
      <Footer />
    </div>
  );
}
