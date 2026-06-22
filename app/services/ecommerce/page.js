"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import styles from "./page.module.css";
import { useTheme } from "../../context/ThemeContext";
import ThemeToggle from "../../components/ThemeToggle";
import Footer from "../../components/Footer";


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

export default function EcommercePage() {
  const { isDark } = useTheme();
              
  // Audio Buffers
        


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
              <a href="/research" className={styles.navLink}>
                Research
              </a>
            </div>
          </div>
        </nav>
      </div>

      {/* ===== MAIN CONTAINER FLOW ===== */}
      <main className={styles.mainContainer}>
        <div className={styles.contentAlignContainer}>
          
          {/* Title and Headers */}
          <InlineSVG src="/services/ecommerce/Group 76.svg" className={styles.heroTitle} />
          
          {/* Main Hero Copy right side */}
          <InlineSVG src="/services/ecommerce/We design intelligent digital infrastructures that solve for fragmented workflows and data scaling uncertainty. We act as a translator between operational complexity and decisive, automated corporate action..svg" className={styles.heroLeftText} />

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
            <InlineSVG src="/services/ecommerce/Frame 209.svg" className={styles.buttonsSvg} />
          </div>

          {/* Main Hero Image */}
          <InlineSVG src="/services/ecommerce/Image.svg" className={styles.heroImage} />

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
            <div className={styles.quickCard}>
              <img src="/services/tcg/frame_new.svg" className={styles.cardFrame} alt="frame" />
              <h3 className={styles.cardTitle}>Unified Data Architecture</h3>
              <p className={styles.cardDesc}>
                Centralized platform design that connects disconnected frontends and siloed software into a single, cohesive corporate environment.
              </p>
            </div>
            <div className={styles.quickCard}>
              <img src="/services/tcg/frame_new.svg" className={styles.cardFrame} alt="frame" />
              <h3 className={styles.cardTitle}>High-Performance Engineering</h3>
              <p className={styles.cardDesc}>
                Bespoke framework engineered to handle heavy operational loads, thousands of database queries, and intensive user traffic without lag.
              </p>
            </div>
            <div className={styles.quickCard}>
              <img src="/services/tcg/frame_new.svg" className={styles.cardFrame} alt="frame" />
              <h3 className={styles.cardTitle}>Automated Workflow Engines</h3>
              <p className={styles.cardDesc}>
                Silent background infrastructure that handles routine data tracking, reporting, and team handoffs with zero operational delay.
              </p>
            </div>
            <div className={styles.quickCard}>
              <img src="/services/tcg/frame_new.svg" className={styles.cardFrame} alt="frame" />
              <h3 className={styles.cardTitle}>Custom Decision Dashboards</h3>
              <p className={styles.cardDesc}>
                Clean, low-noise analytical interfaces that compress messy operational data into clear, actionable revenue and management insights.
              </p>
            </div>
          </div>

          {/* SECTION: Project Financing */}
          <div className={styles.projectFinancingSection}>
            <div className={styles.pfTitleContainer}>
              <h2 className={styles.pfTitle}>
                Project <span className={styles.pfTitleHighlight}>Financing</span>
              </h2>
              <p className={styles.pfSubtitle}>
                Investment ranges for <span className={styles.pfSubtitleHighlight}>bespoke ecosystem engineering</span>
              </p>
            </div>

            <div className={styles.pfGrid}>
              <div className={styles.pfCard}>
                <img src="/services/tcg/frame_new.svg" className={styles.cardFrame} alt="frame" />
                <h3 className={styles.pfCardTitle}>Shopify <span className={styles.pfCardTitleHighlight}>Website</span></h3>
                <p className={styles.pfCardSubtitle}>Estimated Costing:</p>
                <p className={styles.pfCardPrice}>
                  <span className={styles.pfCardPriceHighlight}>3000$</span> to <span className={styles.pfCardPriceHighlight}>5000$</span>
                </p>
              </div>

              <div className={styles.pfCard}>
                <img src="/services/tcg/frame_new.svg" className={styles.cardFrame} alt="frame" />
                <h3 className={styles.pfCardTitle}>Custom E-commerce <br/> <span className={styles.pfCardTitleHighlight}>Website</span></h3>
                <p className={styles.pfCardSubtitle}>Estimated Costing:</p>
                <p className={styles.pfCardPrice}>
                  <span className={styles.pfCardPriceHighlight}>6000$</span> to <span className={styles.pfCardPriceHighlight}>12000$</span>
                </p>
              </div>
            </div>

            <div className={styles.pfBottomText}>
              Precision engineering cannot be packaged. Every system we build is scoped<br />
              individually based on <span className={styles.pfBottomTextHighlight}>operational complexity and data volume</span>.
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

          {/* Theme Switcher slider */}
          <ThemeToggle className={styles.slideButton} />

        </div>
      </main>

      {/* Neumorphic Footer */}
      <Footer />
    </div>
  );
}
