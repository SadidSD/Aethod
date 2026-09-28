"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import styles from "./page.module.css";
import { useTheme } from "../context/ThemeContext";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

import HowWeDifferTable from "./HowWeDifferTable";
import CapabilityGrid from "./CapabilityGrid";

function InlineSVG({ src, className, isMobile, isTabletOrMobile, crop, style }) {
  const [svgContent, setSvgContent] = useState("");

  useEffect(() => {
    let isMounted = true;
    fetch(src)
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to load SVG: ${src}`);
        return res.text();
      })
      .then((text) => {
        if (isMounted) {
          const cleanText = text.replace(/<\?xml[^>]*\?>/i, "");
          setSvgContent(cleanText);
        }
      })
      .catch((err) => console.error(err));
    return () => {
      isMounted = false;
    };
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
      style={style}
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

          {/* ----- SECTION 2: THE BUILDERS & CREATIVE PARTNERS ----- */}
          <div className={styles.sectionTeam}>
            <div className={styles.teamHeader}>
              <div className={styles.teamBadge}>
                <span>Studio Leadership</span>
              </div>
              <h2 className={styles.teamTitle}>
                The <span className={styles.purpleHighlightText}>Builders</span>
              </h2>
              <p className={styles.teamSubtitle}>
                Aeethod is a vertical systems studio engineering sovereign commerce and real-time inventory systems for trading card retailers. We combine domain passion in the collectibles economy with deep systems engineering.
              </p>
            </div>

            <div className={styles.teamGrid}>
              {/* Member 1: Sadid Bin Hasan */}
              <div className={styles.memberCard}>
                <div className={styles.memberPhotoFrame}>
                  <img 
                    src="/team/sadid-color.jpg" 
                    alt="Sadid Bin Hasan — Co-Founder & Principal Systems Architect (Color)" 
                    className={styles.memberPhotoImgColor}
                  />
                  <img 
                    src="/team/sadid.jpg" 
                    alt="Sadid Bin Hasan — Co-Founder & Principal Systems Architect" 
                    className={styles.memberPhotoImgBw}
                  />
                  <div className={styles.memberPhotoFallback}>
                    <span className={styles.monogramLarge}>SB</span>
                    <span className={styles.monogramLabel}>SYSTEMS ARCHITECT</span>
                  </div>
                  <div className={styles.nodeStatusBadge}>
                    <span className={styles.statusDot} />
                    <span>SYS_NODE // 01 · CO-FOUNDER</span>
                  </div>
                </div>

                <div className={styles.memberMeta}>
                  <div className={styles.memberRoleRow}>
                    <span className={styles.memberRoleBadge}>Co-Founder & Principal Architect</span>
                    <span className={styles.memberNodeChip}>NODE_01</span>
                  </div>
                  <h3 className={styles.memberName}>Sadid Bin Hasan</h3>
                  <span className={styles.memberSpecialty}>Core Architecture & High-Concurrency Systems</span>
                </div>

                <div className={styles.memberDivider} />

                <p className={styles.memberBio}>
                  With Pokémon card collecting as a personal hobby and programming web architectures, agents, and automations from his teenage years, Sadid co-founded Aeethod to engineer sovereign digital platforms that card shops own permanently—eliminating marketplace fee drain and brittle legacy POS software.
                </p>

                <div className={styles.memberTags}>
                  <span className={styles.teamTag}>Core System Architecture</span>
                  <span className={styles.teamTag}>Omnichannel Sync</span>
                  <span className={styles.teamTag}>Sovereign Commerce</span>
                  <span className={styles.teamTag}>Repricing Automation</span>
                </div>

                <div className={styles.memberFooter}>
                  <span className={styles.partnerPill}>Co-Founder · Systems Architecture</span>
                </div>
              </div>

              {/* Member 2: Anika Zaman */}
              <div className={styles.memberCard}>
                <div className={styles.memberPhotoFrame}>
                  <img 
                    src="/team/anika-color.jpg" 
                    alt="Anika Zaman — Co-Founder & Lead Systems Developer (Color)" 
                    className={styles.memberPhotoImgColor}
                  />
                  <img 
                    src="/team/anika.jpg" 
                    alt="Anika Zaman — Co-Founder & Lead Systems Developer" 
                    className={styles.memberPhotoImgBw}
                  />
                  <div className={styles.memberPhotoFallback}>
                    <span className={styles.monogramLarge}>AZ</span>
                    <span className={styles.monogramLabel}>LEAD SYSTEMS DEV</span>
                  </div>
                  <div className={styles.nodeStatusBadge}>
                    <span className={styles.statusDot} />
                    <span>SYS_NODE // 02 · CO-FOUNDER</span>
                  </div>
                </div>

                <div className={styles.memberMeta}>
                  <div className={styles.memberRoleRow}>
                    <span className={styles.memberRoleBadge}>Co-Founder & Lead Systems Developer</span>
                    <span className={styles.memberNodeChip}>NODE_02</span>
                  </div>
                  <h3 className={styles.memberName}>Anika Zaman</h3>
                  <span className={styles.memberSpecialty}>High-Throughput Engineering & Integrations</span>
                </div>

                <div className={styles.memberDivider} />

                <p className={styles.memberBio}>
                  Bringing deep algorithmic precision and systems rigor to the studio, Anika co-founded Aeethod to engineer high-reliability backend pipelines, edge caching layers, and multi-channel webhook meshes that keep 100,000+ card SKUs synced with zero race conditions and zero overselling across in-store POS, TCGplayer, and web storefronts.
                </p>

                <div className={styles.memberTags}>
                  <span className={styles.teamTag}>Webhook Mesh</span>
                  <span className={styles.teamTag}>Sub-35ms Search</span>
                  <span className={styles.teamTag}>Multi-Channel Sync</span>
                  <span className={styles.teamTag}>Concurrency Control</span>
                </div>

                <div className={styles.memberFooter}>
                  <span className={styles.partnerPill}>Co-Founder · Systems Development</span>
                </div>
              </div>

              {/* Member 3: Nayem Hasan */}
              <div className={styles.memberCard}>
                <div className={styles.memberPhotoFrame}>
                  <img 
                    src="/team/nayem-color.jpg" 
                    alt="Nayem Hasan — Co-Founder & Head of Product Design (Color)" 
                    className={styles.memberPhotoImgColor}
                  />
                  <img 
                    src="/team/nayem.jpg" 
                    alt="Nayem Hasan — Co-Founder & Head of Product Design" 
                    className={styles.memberPhotoImgBw}
                  />
                  <div className={styles.memberPhotoFallback}>
                    <span className={styles.monogramLarge}>NH</span>
                    <span className={styles.monogramLabel}>HEAD OF PRODUCT DESIGN</span>
                  </div>
                  <div className={styles.nodeStatusBadge}>
                    <span className={styles.statusDot} />
                    <span>SYS_NODE // 03 · CO-FOUNDER</span>
                  </div>
                </div>

                <div className={styles.memberMeta}>
                  <div className={styles.memberRoleRow}>
                    <span className={styles.memberRoleBadge}>Co-Founder & Head of Product Design</span>
                    <span className={styles.memberNodeChip}>NODE_03</span>
                  </div>
                  <h3 className={styles.memberName}>Nayem Hasan</h3>
                  <span className={styles.memberSpecialty}>Collectibles UI/UX & Commerce Strategy</span>
                </div>

                <div className={styles.memberDivider} />

                <p className={styles.memberBio}>
                  Combining sharp visual intuition with a keen commercial mindset, Nayem co-founded Aeethod to redefine the digital experience of card collecting. He bridges collector psychology with high-converting ecommerce flows—replacing clunky legacy templates with fast, tactile interfaces that turn casual visitors into high-LTV repeat buyers.
                </p>

                <div className={styles.memberTags}>
                  <span className={styles.teamTag}>Collector CX</span>
                  <span className={styles.teamTag}>Deep-Variant Matrix</span>
                  <span className={styles.teamTag}>High-AOV Checkout</span>
                  <span className={styles.teamTag}>Design Systems</span>
                </div>

                <div className={styles.memberFooter}>
                  <span className={styles.partnerPill}>Co-Founder · Product Design</span>
                </div>
              </div>
            </div>
          </div>

          {/* ----- SECTION 3: WHAT IS SYSTEM STUDIO & HOW WE DIFFER ----- */}
          <div className={styles.section2WhatIs}>
            <h2 className={styles.whatIsTitle}>What is a vertical technology studio?</h2>
            <p className={styles.whatIsSubtitle}>Where platforms end.</p>
            <div className={styles.whatIsSystemStudioContainer}>
              <div className={styles.whatIsParagraphRow}>
                <InlineSVG src="/studio/round_arrow_card.svg" className={styles.roundArrowCard} />
                <div className={styles.whatIsParagraphTextContainer}>
                  <div className={`${styles.whatIsParagraphText} ${expandedParagraphs.p1 ? styles.expanded : ""}`}>
                    <span>An agency builds websites. An off-the-shelf platform locks you in. A vertical technology studio architects infrastructure. </span>
                    <span className={styles.whatIsParagraphHighlight}>
                      When your TCG business expands across marketplaces, physical storefronts, buylists, and inventory channels, fragmented tools break down. We spend time inside your operations to unify inventory, sync sales channels, and eliminate manual friction.
                    </span>
                    <span> That is the difference.</span>
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
                    <span>Platforms are built for starting. They are not the final form of a growing business. </span>
                    <span className={styles.whatIsParagraphHighlight}>
                      When off-the-shelf tools can no longer handle your catalogue velocity, multi-channel stock, and fulfillment complexity, you need custom digital infrastructure engineered specifically around how your TCG business operates.
                    </span>
                    <span> That is who we are.</span>
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
              <InlineSVG key="manifesto-grid-vert" src="/studio/Rectangle 90.svg" className={`${styles.manifestoGridLineVert} ${gridInView ? styles.animateVert : styles.hiddenVert}`} />
              <InlineSVG key="manifesto-grid-horiz" src="/studio/Rectangle 91.svg" className={`${styles.manifestoGridLineHoriz} ${gridInView ? styles.animateHoriz : styles.hiddenHoriz}`} />
              
              <InlineSVG key="manifesto-group-01" src="/studio/Group 50.svg" className={styles.manifestoGroup01} />
              <InlineSVG key="manifesto-group-02" src="/studio/Group 51.svg" className={styles.manifestoGroup02} />
              <InlineSVG 
                key="manifesto-group-03"
                src="/studio/Group 52.svg" 
                className={styles.manifestoGroup03} 
                style={isTabletOrMobile && !manifestoExpanded ? { display: 'none' } : undefined}
              />
              <InlineSVG 
                key="manifesto-group-04"
                src="/studio/Group 53.svg" 
                className={styles.manifestoGroup04} 
                style={isTabletOrMobile && !manifestoExpanded ? { display: 'none' } : undefined}
              />
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
              <br key="capability-br" className={styles.capabilityBr} />
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
