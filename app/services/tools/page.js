"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import styles from "./page.module.css";
import { useTheme } from "../../context/ThemeContext";
import ThemeToggle from "../../components/ThemeToggle";
import Navbar from "../../components/Navbar";


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

export default function ToolsPage() {
  const { isDark } = useTheme();
  
  // Form State
  const [email, setEmail] = useState("");
  const [query, setQuery] = useState("");

  const playClickSound = useCallback(() => {
    try {
      const audio = new Audio("/touchpad sd.mp3");
      audio.volume = 0.85;
      audio.play().catch(() => {});
    } catch (e) {
      /* ignore */
    }
  }, []);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    playClickSound();
    if (email && query) {
      alert(`Query submitted successfully!\nEmail: ${email}\nQuery: ${query}`);
      setEmail("");
      setQuery("");
    } else {
      alert("Please fill in both fields.");
    }
  };

  return (
    <div className={styles.pageWrapper} data-theme={isDark ? "dark" : "light"}>
      {/* ===== FLOATING STICKY NAVIGATION ===== */}
      <Navbar activePage="services" />

      {/* ===== MAIN CONTAINER FLOW ===== */}
      <main className={styles.mainContainer}>
        <div className={styles.contentAlignContainer}>
          
          {/* ===== SECTION 1: HERO ===== */}
          <div className={styles.heroTitle}>
            <h1 className={styles.heroTitleText}>
              Proprietary <span className={styles.heroTitleHighlight}>Tools</span>
            </h1>
            <p className={styles.heroSubtitle}>
              Software <span className={styles.heroSubtitleHighlight}>Modules &amp; Integrations</span>
            </p>
          </div>

          <div className={styles.heroRightText}>
            <p className={styles.heroDescription}>
              We engineer standalone software assets and custom technical tools designed to bridge infrastructure gaps. We act as a translator between complex data streams and decisive, automated corporate action.
            </p>
          </div>

          {/* Action Button Bar */}
          <div className={styles.btnBar}>
            <button
              className={styles.invisibleBtnScroll}
              onClick={() => {
                playClickSound();
                document.getElementById("quick-list")?.scrollIntoView({ behavior: "smooth" });
              }}
              aria-label="Scroll Down"
            />
            <button
              className={styles.invisibleBtnWorks}
              onClick={() => {
                playClickSound();
                window.location.href = "/journals";
              }}
              aria-label="Visit Our Works"
            />
            <InlineSVG src="/services/tools/Frame 209.svg" className={styles.buttonsSvg} />
          </div>

          {/* Main Hero Image */}
          <InlineSVG src="/services/tools/Image.svg" className={styles.heroImage} />

          {/* ===== SECTION 2: QUICK LIST ===== */}
          <div className={styles.quickListHeader} id="quick-list">
            <h2 className={styles.quickListTitle}>
              Quick <span className={styles.quickListTitleHighlight}>List</span>
            </h2>
            <p className={styles.quickListSubtitle}>
              Operational friction that <span className={styles.quickListSubtitleHighlight}>you won&apos;t face again.</span>
            </p>
          </div>

          <div className={styles.quickListGrid}>
            <div className={`${styles.quickCard} ${styles.quickCard1}`}>
              <h3 className={styles.cardTitle}>Custom API Bridges</h3>
              <p className={styles.cardDesc}>
                Purpose-built integration modules connecting previously siloed systems, ensuring your tool ecosystem communicates with zero friction and full data accuracy.
              </p>
            </div>
            <div className={`${styles.quickCard} ${styles.quickCard2}`}>
              <h3 className={styles.cardTitle}>Automated Logic Routers</h3>
              <p className={styles.cardDesc}>
                Self-directing decision trees that evaluate live conditions, route workflows, and redirect operations before human attention is even needed.
              </p>
            </div>
            <div className={`${styles.quickCard} ${styles.quickCard3}`}>
              <h3 className={styles.cardTitle}>Real-Time Sync Nodes</h3>
              <p className={styles.cardDesc}>
                Always-on synchronization checkpoints that maintain perfect data coherence across all active tools and eliminate lag-induced inconsistency.
              </p>
            </div>
            <div className={`${styles.quickCard} ${styles.quickCard4}`}>
              <h3 className={styles.cardTitle}>Minimal Analytical Exports</h3>
              <p className={styles.cardDesc}>
                Stripped-down reporting utilities engineered to surface only critical insights, removing dashboard bloat and operational noise.
              </p>
            </div>
          </div>

          {/* ===== SECTION 3: PROJECT FINANCING ===== */}
          <div className={styles.projectFinancingSection}>
            <div className={styles.pfTitleContainer}>
              <h2 className={styles.pfTitle}>Project <span className={styles.pfTitleHighlight}>Financing</span></h2>
              <p className={styles.pfSubtitle}>
                Financial parameters built around <br />
                <span className={styles.pfSubtitleHighlight}>systemic complexity.</span>
              </p>
            </div>
            
            <div className={styles.pfGrid}>
              <div className={styles.pfCard}>
                <h3 className={styles.pfCardTitle}>Premade <span className={styles.pfCardTitleHighlight}>Tools</span></h3>
                <p className={styles.pfCardSubtitle}>average range</p>
                <p className={styles.pfCardPrice}>3000$ to <span className={styles.pfCardPriceHighlight}>6000$</span></p>
              </div>
              <div className={styles.pfCard}>
                <h3 className={styles.pfCardTitle}>Custom <span className={styles.pfCardTitleHighlight}>Tools</span></h3>
                <p className={styles.pfCardSubtitle}>average range</p>
                <p className={styles.pfCardPrice}>6000$ to <span className={styles.pfCardPriceHighlight}>12000$</span></p>
              </div>
            </div>

            <p className={styles.pfBottomText}>
              Precision engineering cannot be packaged. Every system we build is scoped <br />
              individually based on <span className={styles.pfBottomTextHighlight}>operational complexity and data volume.</span>
            </p>
          </div>

          {/* ===== SECTION 4: FAQ ===== */}
          <div className={styles.faqSection}>
             <div className={styles.faqHeaderContainer}>
                <h2 className={styles.faqTitle}>FAQ</h2>
                <p className={styles.faqSubtitle}>Feel free to <span className={styles.faqSubtitleHighlight}>ask questions.</span></p>
             </div>
             
             <div className={styles.faqGrid}>
                <div className={styles.faqCard}>
                   <img src="/services/tcg/frame_new.svg" className={styles.faqCardFrame} alt="frame" />
                   <h3 className={styles.faqCardTitle}>Ask <span className={styles.faqCardTitleHighlight}>Smith</span></h3>
                   <p className={styles.faqCardText}>
                      Our core intelligence engine is ready to <span className={styles.faqHighlightText}>analyze your queries in real time.</span> Ask Smith anything regarding our architectural logic, system frameworks, or engineering capabilities. No forms, no onboarding friction—just immediate structural insights.
                   </p>
                </div>
                <div className={styles.faqCard}>
                   <img src="/services/tcg/frame_new.svg" className={styles.faqCardFrame} alt="frame" />
                   <h3 className={styles.faqCardTitle}>Contract <span className={styles.faqCardTitleHighlight}>Us</span></h3>
                   <p className={styles.faqCardText}>
                      Connect directly with a human strategist. If your operational friction requires deep technical evaluation or a bespoke blueprint that goes beyond automated responses, open a direct line to our studio here. <span className={styles.faqHighlightText}>No sales pitches, just engineering.</span>
                   </p>
                </div>
             </div>
             
             <div className={styles.faqFormContainer}>
                <img src="/services/tcg/frame_new.svg" className={styles.faqFormFrame} alt="frame" />
                <h3 className={styles.faqFormTitle}>Ask Question <span className={styles.faqFormTitleHighlight}>Directly</span></h3>
                <form onSubmit={handleFormSubmit} className={styles.faqForm}>
                   <div className={styles.faqFormRow}>
                      <input 
                         type="email" 
                         placeholder="Your email" 
                         value={email}
                         onChange={(e) => setEmail(e.target.value)}
                         className={styles.faqInput}
                         required
                      />
                      <div className={styles.faqSendBtnWrapper}>
                         <button type="submit" className={styles.faqSendBtn} onClick={playClickSound} aria-label="Send"></button>
                         <img src="/services/tcg/send_frame.svg" className={styles.faqSendBtnFrame} alt="button background" />
                         <span className={styles.faqSendBtnText}>
                           Send
                           <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.sendArrowSvg}>
                             <path d="M7 17L17 7M17 17V7H7" stroke="#717171" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                           </svg>
                         </span>
                      </div>
                   </div>
                   <textarea
                      placeholder="Your query"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      className={styles.faqTextarea}
                      required
                   />
                </form>
             </div>
          </div>

          {/* ===== SECTION 5: FOOTER SVG ===== */}
          <div className={styles.footerWrapper}>
            <InlineSVG src="/services/tools/Footer.svg" className={styles.footerSvg} />
          </div>

          {/* Theme Switcher slider */}
          <ThemeToggle className={styles.slideButton} />

        </div>
      </main>

    </div>
  );
}
