"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import styles from "./page.module.css";

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
  const [isDark, setIsDark] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragX, setDragX] = useState(0);
  const trackRef = useRef(null);
  const knobRef = useRef(null);
  const startXRef = useRef(0);
  const startDragXRef = useRef(0);
  const hasDraggedRef = useRef(false);

  // Audio Buffers
  const clickBufferRef = useRef(null);
  const slideClickBufferRef = useRef(null);
  const slideFoleyBufferRef = useRef(null);
  const audioContextRef = useRef(null);

  // Interactive Financing Slider State removed as price bar is now static

  // Form State
  const [email, setEmail] = useState("");
  const [query, setQuery] = useState("");

  // Pre-load and decode audio files for zero-latency
  useEffect(() => {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;

    const ctx = new AudioContext();
    audioContextRef.current = ctx;

    const loadSound = (url, bufferRef) => {
      fetch(url)
        .then((res) => {
          if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
          return res.arrayBuffer();
        })
        .then((arrayBuffer) => ctx.decodeAudioData(arrayBuffer))
        .then((buffer) => {
          bufferRef.current = buffer;
        })
        .catch((err) => console.warn(`Error preloading sound ${url}:`, err));
    };

    loadSound("/touchpad sd.mp3", clickBufferRef);
    loadSound("/immersive-click.mp3", slideClickBufferRef);
    loadSound("/finger-slide.mp3", slideFoleyBufferRef);

    return () => {
      if (ctx && ctx.state !== "closed") {
        ctx.close().catch(() => {});
      }
    };
  }, []);

  const playSlideSound = useCallback(() => {
    try {
      const ctx = audioContextRef.current;
      const clickBuffer = slideClickBufferRef.current;
      const foleyBuffer = slideFoleyBufferRef.current;

      if (ctx) {
        if (ctx.state === "suspended") {
          ctx.resume();
        }

        if (clickBuffer) {
          const clickSource = ctx.createBufferSource();
          clickSource.buffer = clickBuffer;
          const clickGain = ctx.createGain();
          clickGain.gain.value = 0.45;
          clickSource.connect(clickGain);
          clickGain.connect(ctx.destination);
          clickSource.start(0);
        }

        if (foleyBuffer) {
          const foleySource = ctx.createBufferSource();
          foleySource.buffer = foleyBuffer;
          const foleyGain = ctx.createGain();
          foleyGain.gain.value = 0.6;
          foleySource.connect(foleyGain);
          foleyGain.connect(ctx.destination);
          foleySource.start(0);
        }
      }
    } catch (e) {
      /* ignore */
    }
  }, []);

  const playClickSound = useCallback(() => {
    try {
      const ctx = audioContextRef.current;
      const buffer = clickBufferRef.current;

      if (ctx) {
        if (ctx.state === "suspended") {
          ctx.resume();
        }
        if (buffer) {
          const source = ctx.createBufferSource();
          source.buffer = buffer;
          const gainNode = ctx.createGain();
          gainNode.gain.value = 0.85;
          source.connect(gainNode);
          gainNode.connect(ctx.destination);
          source.start(0);
        }
      }
    } catch (e) {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", isDark ? "dark" : "light");
  }, [isDark]);

  const getMaxTravel = useCallback(() => {
    if (!trackRef.current || !knobRef.current) return 30;
    return trackRef.current.offsetWidth - knobRef.current.offsetWidth;
  }, []);

  const handlePointerDown = useCallback(
    (e) => {
      e.preventDefault();
      setIsDragging(true);
      hasDraggedRef.current = false;
      startXRef.current = e.clientX;
      startDragXRef.current = isDark ? getMaxTravel() : 0;
      knobRef.current?.setPointerCapture(e.pointerId);
    },
    [isDark, getMaxTravel]
  );

  const handlePointerMove = useCallback(
    (e) => {
      if (!isDragging) return;
      const delta = e.clientX - startXRef.current;
      if (Math.abs(delta) > 3) hasDraggedRef.current = true;
      const maxTravel = getMaxTravel();
      const newX = Math.max(0, Math.min(maxTravel, startDragXRef.current + delta));
      setDragX(newX);
    },
    [isDragging, getMaxTravel]
  );

  const handlePointerUp = useCallback(() => {
    if (!isDragging) return;
    setIsDragging(false);
    const maxTravel = getMaxTravel();
    const threshold = maxTravel / 2;

    if (hasDraggedRef.current) {
      const shouldBeDark = dragX > threshold;
      if (shouldBeDark !== isDark) {
        playSlideSound();
        setIsDark(shouldBeDark);
      }
      setDragX(shouldBeDark ? maxTravel : 0);
    } else {
      playSlideSound();
      const next = !isDark;
      setIsDark(next);
      setDragX(next ? maxTravel : 0);
    }
  }, [isDragging, dragX, isDark, getMaxTravel, playSlideSound]);

  useEffect(() => {
    if (!isDragging) {
      setDragX(isDark ? getMaxTravel() : 0);
    }
  }, [isDark, isDragging, getMaxTravel]);

  useEffect(() => {
    const handleResize = () => {
      if (!isDragging) setDragX(isDark ? getMaxTravel() : 0);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isDark, isDragging, getMaxTravel]);

  const knobStyle = isDragging
    ? { transform: `translateX(${dragX}px)`, transition: "none" }
    : {
        transform: `translateX(${isDark ? getMaxTravel() : 0}px)`,
        transition: "transform 0.4s cubic-bezier(0.85, 0.05, 0.18, 1.35)",
      };

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
              <InlineSVG src="/logo.svg" className={styles.logoImg} />
            </a>

            {/* Navigation Links */}
            <div className={styles.navLinks}>
              <a href="/studio" className={styles.navLink}>
                Studio
              </a>
              <a href="/services" className={`${styles.navLink} ${styles.activeNavLink}`}>
                Services
              </a>
              <a href="/research" className={styles.navLink}>
                Research
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
          <footer className={styles.footerSection}>
            <div className={styles.footerLeft}>
              <div className={styles.footerLogoWrap}>
                <div className={styles.footerLogoCircle}>
                  <img src="/logopng.png" alt="Aeethod Logo" className={styles.footerLogoImg} />
                </div>
                <span className={styles.footerBrand}>Aeethod</span>
              </div>
              <p className={styles.footerDesc}>
                We build the intelligence layer<br/>that makes human decisions<br/>matter more, not less.
              </p>
            </div>
            <div className={styles.footerRight}>
              <div className={styles.footerLinks}>
                <a href="/studio">Studio</a>
                <a href="/system">System</a>
                <a href="/research">Research</a>
                <a href="/products">Products</a>
                <a href="/journals">Journals</a>
                <a href="/contract">Contract</a>
              </div>
              <div className={styles.footerSocials}>
                <svg viewBox="0 0 24 24" className={styles.socialIconSvg}><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                <svg viewBox="0 0 24 24" className={styles.socialIconSvg}><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 1.77-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 1.77 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-1.771 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-1.771-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                <svg viewBox="0 0 24 24" className={styles.socialIconSvg}><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              </div>
              <div className={styles.footerCopyright}>
                @2026 Aeethod. All rights reserved.
              </div>
            </div>
          </footer>

          {/* Theme Switcher slider */}
          <div className={styles.slideButton} id="theme-toggle">
            <div className={styles.slideTrack} ref={trackRef}>
              <div className={styles.slideTrackInner} />
              <div
                className={styles.slideKnob}
                ref={knobRef}
                style={knobStyle}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerUp}
                role="switch"
                aria-checked={isDark}
                aria-label="Toggle dark mode"
                tabIndex={0}
              >
                <div className={styles.slideKnobInner} />
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
