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

export default function AutomationPage() {
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
          
          {/* ===== HERO SECTION ===== */}
          <div className={styles.heroSection}>
            <h1 className={styles.heroTitle}>
              Operational <span className={styles.heroTitleHighlight}>Automation</span>
            </h1>
            <p className={styles.heroSubtitle}>
              Autonomous infrastructure for <span className={styles.heroSubtitleHighlight}>modern enterprises</span>
            </p>
            <p className={styles.heroDescription}>
              We design custom automation engines at an{"\n"}
              enterprise scale — our focus is not on replacing{"\n"}
              your team but amplifying their output. The systems{"\n"}
              we build are not off-the-shelf; they are complete, build-from-scratch{"\n"}
              operational architectures, customized to your data{"\n"}
              pipeline and your business logic, so you stop losing{"\n"}
              anything.
            </p>

            {/* Action Button Bar */}
            <div className={styles.btnBar}>
              <button
                className={styles.btnLearnMore}
                onClick={() => {
                  playClickSound();
                  document.getElementById("quick-list")?.scrollIntoView({ behavior: "smooth" });
                }}
                aria-label="Learn More"
              >
                Learn More
              </button>
              <button
                className={styles.btnCaseWorks}
                onClick={() => {
                  playClickSound();
                  window.location.href = "/journals";
                }}
                aria-label="Our Case Works"
              >
                Our Case Works
              </button>
            </div>
          </div>

          {/* ===== HERO IMAGE ===== */}
          <div className={styles.heroImageWrapper}>
            <InlineSVG src="/services/Frame 197.svg" className={styles.heroImage} />
          </div>

          {/* Horizontal Line Separator */}
          <div className={styles.sectionDivider}></div>

          {/* ===== QUICK LIST SECTION ===== */}
          <div className={styles.quickListHeader} id="quick-list">
            <h2 className={styles.quickListTitle}>
              Quick <span className={styles.quickListTitleHighlight}>List</span>
            </h2>
            <p className={styles.quickListSubtitle}>
              Systems that handle the decisions <span className={styles.quickListSubtitleHighlight}>you shouldn&apos;t have to.</span>
            </p>
          </div>

          <div className={styles.quickListGrid}>
            <div className={styles.quickCard}>
              <img src="/services/tcg/frame_new.svg" className={styles.cardFrame} alt="frame" />
              <h3 className={styles.cardTitle}>Automated Infrastructure Management</h3>
              <p className={styles.cardDesc}>
                Self-healing server architectures that auto-scale based on real-time demand signals, eliminating manual provisioning and reducing downtime to near-zero across all environments.
              </p>
            </div>
            <div className={styles.quickCard}>
              <img src="/services/tcg/frame_new.svg" className={styles.cardFrame} alt="frame" />
              <h3 className={styles.cardTitle}>Centralized Billing Infrastructure</h3>
              <p className={styles.cardDesc}>
                Unified financial pipelines that consolidate invoicing, subscription tracking, and payment reconciliation into a single automated command center with full audit trails.
              </p>
            </div>
            <div className={styles.quickCard}>
              <img src="/services/tcg/frame_new.svg" className={styles.cardFrame} alt="frame" />
              <h3 className={styles.cardTitle}>Dynamic Resource Deployment</h3>
              <p className={styles.cardDesc}>
                Intelligent allocation engines that distribute computing, storage, and workforce resources dynamically based on operational priority and real-time workload analysis.
              </p>
            </div>
            <div className={styles.quickCard}>
              <img src="/services/tcg/frame_new.svg" className={styles.cardFrame} alt="frame" />
              <h3 className={styles.cardTitle}>User Review Management Dashboards</h3>
              <p className={styles.cardDesc}>
                Automated sentiment analysis and review aggregation systems that surface actionable feedback patterns and flag critical issues before they escalate.
              </p>
            </div>
          </div>

          {/* ===== PROJECT FINANCING SECTION ===== */}
          <div className={styles.projectFinancingSection}>
            <div className={styles.pfTitleContainer}>
              <h2 className={styles.pfTitle}>
                Project <span className={styles.pfTitleHighlight}>Financing</span>
              </h2>
              <p className={styles.pfSubtitle}>
                Typical cost structures for <span className={styles.pfSubtitleHighlight}>bespoke automation builds</span>
              </p>
            </div>

            <div className={styles.pfGrid}>
              <div className={styles.pfCard}>
                <img src="/services/tcg/frame_new.svg" className={styles.cardFrame} alt="frame" />
                <h3 className={styles.pfCardTitle}>E-commerce<br/> <span className={styles.pfCardTitleHighlight}>Automation</span></h3>
                <p className={styles.pfCardSubtitle}>Estimated Costing:</p>
                <p className={styles.pfCardPrice}>
                  <span className={styles.pfCardPriceHighlight}>10000$</span> to <span className={styles.pfCardPriceHighlight}>50005</span>
                </p>
              </div>

              <div className={styles.pfCard}>
                <img src="/services/tcg/frame_new.svg" className={styles.cardFrame} alt="frame" />
                <h3 className={styles.pfCardTitle}>Industrial<br/> <span className={styles.pfCardTitleHighlight}>Automation</span></h3>
                <p className={styles.pfCardSubtitle}>Estimated Costing:</p>
                <p className={styles.pfCardPrice}>
                  <span className={styles.pfCardPriceHighlight}>60000</span> to <span className={styles.pfCardPriceHighlight}>100000</span>
                </p>
              </div>
            </div>

            <div className={styles.pfBottomText}>
              Precision engineering cannot be packaged. Every system we build is scoped<br />
              individually based on <span className={styles.pfBottomTextHighlight}>operational complexity and data volume</span>.
            </div>
          </div>

          {/* ===== FAQ SECTION ===== */}
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
