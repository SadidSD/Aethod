"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import styles from "./page.module.css";
import { useTheme } from "../../context/ThemeContext";
import ThemeToggle from "../../components/ThemeToggle";


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

export default function TcgPage() {
  const { isDark } = useTheme();
              
  // Audio Buffers
        
  // Interactive Financing Slider State removed as price bar is now static

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
      <div className={styles.navOuter}>
        <nav className={styles.navbar} id="navbar">
          <div className={styles.navContent}>
            {/* Circular Logo */}
            <a href="/" className={styles.logo} aria-label="Aeethod Home">
              <InlineSVG src="/navbar logo.svg" className={styles.logoImg} />
            </a>

            {/* Navigation Links */}
            <div className={styles.navLinks}>
              <a href="/studio" className={styles.navLink}>
                Studio
              </a>
              <a href="/services" className={`${styles.navLink} ${styles.activeNavLink}`}>
                Services
              </a>
              <a href="/blog" className={styles.navLink}>
                Blog
              </a>
              <a href="/products" className={styles.navLink}>
                Products
              </a>
              <a href="/journals" className={styles.navLink}>
                Works
              </a>
              <a href="/contact" className={styles.navLink}>
                Contact
              </a>
              <a href="#" className={styles.navLink} onClick={() => alert("Vlog coming soon")}>
                Vlog
              </a>
            </div>
          </div>
        </nav>
      </div>

      {/* ===== MAIN CONTAINER FLOW ===== */}
      <main className={styles.mainContainer}>
        <div className={styles.contentAlignContainer}>
          
          {/* Title and Headers */}
          <InlineSVG src="/services/tcg/Group 76.svg" className={styles.heroTitle} />
          
          {/* Main Hero Copy right side */}
          <InlineSVG src="/services/tcg/We design intelligent architectures that solve for complex inventory and pricing uncertainty. We act as a translator between market complexity and decisive action..svg" className={styles.heroRightText} />

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
            <InlineSVG src="/services/tcg/Frame 209.svg" className={styles.buttonsSvg} />
          </div>

          {/* Main Hero Card Image */}
          <InlineSVG src="/services/tcg/1 1.svg" className={styles.heroImage} />

          {/* Floater Cubes (Mini graphics) */}
          <InlineSVG src="/services/tcg/mini 5.svg" className={styles.mini5} />
          <InlineSVG src="/services/tcg/mini 9.svg" className={styles.mini9} />
          <InlineSVG src="/services/tcg/mini 6.svg" className={styles.mini6} />
          <InlineSVG src="/services/tcg/mini 1.svg" className={styles.mini1} />
          <InlineSVG src="/services/tcg/mini 7.svg" className={styles.mini7} />
          <InlineSVG src="/services/tcg/mini 12.svg" className={styles.mini12} />
          <InlineSVG src="/services/tcg/mini 3.svg" className={styles.mini3} />

          {/* SECTION: Quick List */}
          <div className={styles.quickListHeader} id="quick-list">
            <h2 className={styles.quickListTitle}>
              Quick <span className={styles.quickListTitleHighlight}>List</span>
            </h2>
            <p className={styles.quickListSubtitle}>
              Problems that you won't <span className={styles.quickListSubtitleHighlight}>face again</span>
            </p>
          </div>

          <div className={styles.quickListGrid}>
            <div className={`${styles.quickCard} ${styles.quickCard1}`}>
              <h3 className={styles.cardTitle}>Dynamic Inventory Syncing</h3>
              <p className={styles.cardDesc}>
                Automated backend infrastructure that syncs marketplace stock, grading variations, and precise card conditions with zero operational delay
              </p>
            </div>
            <div className={`${styles.quickCard} ${styles.quickCard2}`}>
              <h3 className={styles.cardTitle}>Unified Marketplace Logic</h3>
              <p className={styles.cardDesc}>
                Centralized platform architecture that connects fragmented storefronts into a single, cohesive business environment.
              </p>
            </div>
            <div className={`${styles.quickCard} ${styles.quickCard3}`}>
              <h3 className={styles.cardTitle}>Algorithmic Pricing Engines</h3>
              <p className={styles.cardDesc}>
                Real-time data pipelines built to absorb market volatility and automatically adjust card values based on live ecosystem trends.
              </p>
            </div>
            <div className={`${styles.quickCard} ${styles.quickCard4}`}>
              <h3 className={styles.cardTitle}>High-Volume Data Processing</h3>
              <p className={styles.cardDesc}>
                Bespoke framework engineered to handle deep card catalogs and intensive transaction loads without system friction or lag.
              </p>
            </div>
          </div>

          {/* SECTION: Project Financing */}
          <div className={styles.projectFinancingSection}>
            <div className={styles.pfTitleContainer}>
              <h2 className={styles.pfTitle}>Project <span className={styles.pfTitleHighlight}>Financing</span></h2>
              <p className={styles.pfSubtitle}>Investment ranges for <span className={styles.pfSubtitleHighlight}>bespoke ecosystem engineering</span></p>
            </div>
            
            <div className={styles.pfGrid}>
              <div className={styles.pfLeftCol}>
                <div className={styles.pfCard}>
                  <p className={styles.pfPrecisionText}>
                    Precision engineering cannot be packaged. Every system we build is scoped individually based on <span className={styles.pfHighlightText}>operational complexity and data volume</span>.
                  </p>
                </div>
                <div className={styles.pfCard}>
                  <h3 className={styles.pfAverageTitle}>Average <span className={styles.pfTitleHighlight}>Range</span></h3>
                  <div className={styles.pfPriceBarContainer}>
                    <img src="/services/tcg/pricebar/Praicing.svg" alt="Price bar" className={styles.praicingSvg} />
                    <div className={styles.pfPriceLabels}>
                      <span className={styles.pfLabelMin}>3000$</span>
                      <span className={styles.pfLabelMid}>?</span>
                      <span className={styles.pfLabelMax}>12000$</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className={styles.pfRightCol}>
                <div className={`${styles.pfCard} ${styles.pfTallCard}`}>
                  <p className={styles.pfStructuralText}>
                    Our structural engagements for custom TCG ecosystems <span className={styles.pfHighlightText}>typically begin between $3,000 and $12,000</span>, scaling upward depending entirely on the architectural depth your organization demands. The final financial investment is directly defined by the complexity of your asset infrastructure, the volume of your data processing pipelines, and the level of custom automation required. <span className={styles.pfHighlightText}>We do not build generic templates. Instead,</span> we map your exact ecosystem requirements during our initial blueprinting <span className={styles.pfHighlightText}>phase to deliver a highly optimized system engineered specifically to your operational ceiling</span>—no matter how complex.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION: FAQ */}
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

          {/* Neumorphic Footer */}
          <div className={styles.footerWrapper}>
            <InlineSVG src="/services/Footer.svg" className={styles.footerSvg} />
          </div>

          {/* Theme Switcher slider */}
          <ThemeToggle className={styles.slideButton} />

        </div>
      </main>
    </div>
  );
}
