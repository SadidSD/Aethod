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

export default function ServicesPage() {
  const [isDark, setIsDark] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragX, setDragX] = useState(0);
  const trackRef = useRef(null);
  const knobRef = useRef(null);
  const startXRef = useRef(0);
  const startDragXRef = useRef(0);
  const hasDraggedRef = useRef(false);

  const clickBufferRef = useRef(null);
  const slideClickBufferRef = useRef(null);
  const slideFoleyBufferRef = useRef(null);
  const audioContextRef = useRef(null);

  // Email state for footer newsletter subscription
  const [footerEmail, setFooterEmail] = useState("");

  // Pre-load and decode audio files for zero-latency, high-quality audio processing
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

  // Slide sound - plays original slide audio assets with zero latency
  const playSlideSound = useCallback(() => {
    try {
      const ctx = audioContextRef.current;
      const clickBuffer = slideClickBufferRef.current;
      const foleyBuffer = slideFoleyBufferRef.current;

      if (ctx) {
        if (ctx.state === "suspended") {
          ctx.resume();
        }

        // Play the click portion
        if (clickBuffer) {
          const clickSource = ctx.createBufferSource();
          clickSource.buffer = clickBuffer;
          const clickGain = ctx.createGain();
          clickGain.gain.value = 0.45;
          clickSource.connect(clickGain);
          clickGain.connect(ctx.destination);
          clickSource.start(0);
        } else {
          const clickAudio = new Audio("/immersive-click.mp3");
          clickAudio.volume = 0.45;
          clickAudio.play().catch(() => {});
        }

        // Play the slide portion
        if (foleyBuffer) {
          const foleySource = ctx.createBufferSource();
          foleySource.buffer = foleyBuffer;

          const foleyGain = ctx.createGain();
          foleyGain.gain.value = 0.6;

          foleySource.connect(foleyGain);
          foleyGain.connect(ctx.destination);
          foleySource.start(0);
        } else {
          const slideAudio = new Audio("/finger-slide.mp3");
          slideAudio.volume = 0.6;
          slideAudio.play().catch(() => {});
        }
      } else {
        // Fallback
        const clickAudio = new Audio("/immersive-click.mp3");
        clickAudio.volume = 0.45;
        clickAudio.play().catch(() => {});

        const slideAudio = new Audio("/finger-slide.mp3");
        slideAudio.volume = 0.6;
        slideAudio.play().catch(() => {});
      }
    } catch (e) {
      /* ignore fallback errors */
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
        } else {
          const audio = new Audio("/touchpad sd.mp3");
          audio.volume = 0.85;
          audio.play().catch(() => {});
        }
      } else {
        const audio = new Audio("/touchpad sd.mp3");
        audio.volume = 0.85;
        audio.play().catch(() => {});
      }
    } catch (e) {
      /* ignore fallback errors */
    }
  }, []);

  // Apply theme to <html>
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", isDark ? "dark" : "light");
  }, [isDark]);

  // Calculate knob travel distance
  const getMaxTravel = useCallback(() => {
    if (!trackRef.current || !knobRef.current) return 30;
    return trackRef.current.offsetWidth - knobRef.current.offsetWidth;
  }, []);

  // Pointer down — start drag
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

  // Pointer move — drag the knob
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

  // Pointer up — finish drag, determine toggle
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

  // Keep dragX in sync when isDark changes externally
  useEffect(() => {
    if (!isDragging) {
      setDragX(isDark ? getMaxTravel() : 0);
    }
  }, [isDark, isDragging, getMaxTravel]);

  // Recalculate on resize
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

  const handleSubscribe = (e) => {
    e.preventDefault();
    playClickSound();
    if (footerEmail) {
      alert(`Thank you for subscribing with: ${footerEmail}`);
      setFooterEmail("");
    } else {
      alert("Please enter a valid email address.");
    }
  };

  const handleSocialClick = (socialName) => {
    playClickSound();
    alert(`Navigating to Aeethod ${socialName}...`);
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
          {/* ----- SECTION 1: HERO ----- */}
          <InlineSVG src="/services/Group 76.svg" className={styles.heroTitle} />


          {/* ----- SECTION 2: SERVICES CARDS GRID ----- */}
          {/* Card 1: TCG Website Ecosystem */}
          <a href="/services/tcg" className={styles.card1} onClick={playClickSound}>
            <InlineSVG src="/services/TCG Web.svg" />
          </a>

          {/* Card 2: E-commerce Website Development */}
          <a href="/services/ecommerce" className={styles.card2} onClick={playClickSound}>
            <InlineSVG src="/services/Webs.svg" />
          </a>

          {/* Card 3: Custom E-commerce Tools */}
          <a href="/services/tools" className={styles.card3} onClick={playClickSound}>
            <InlineSVG src="/services/Custom Tools.svg" />
          </a>

          {/* Card 4: Automation (Built from layers) */}
          <a href="/services/automation" className={styles.card4} onClick={playClickSound}>
            {/* Rectangle 128 Icon background */}
            <InlineSVG src="/services/Rectangle 128.svg" className={styles.iconBg} />
            {/* Gear Icon (Mask group.svg) */}
            <InlineSVG src="/services/Mask group.svg" className={styles.gearIcon} />
            {/* Automation text header */}
            <InlineSVG src="/services/Automation.svg" className={styles.card4Title} />
            {/* E-commerce Automation text header */}
            <InlineSVG src="/services/E-commerce Automation.svg" className={styles.card4Subtitle} />
            {/* Description text */}
            <InlineSVG 
              src="/services/Your business functions and scales silently around the clock, even when you are offline. Our AI-first pipelines take over complex data processing and repetitive decision paths, wiping out human error and keeping your operations moving forward with.svg" 
              className={styles.card4Desc} 
            />
          </a>

          {/* Side Indicator */}
          <InlineSVG src="/services/Side Indicator.svg" className={styles.sideIndicator} />

          {/* ----- SECTION 3: TERMS & RULES OF ENGAGEMENT ----- */}
          <InlineSVG src="/services/Terms & Rules of Engagement.svg" className={styles.termsTitle} />
          <InlineSVG src="/services/Defining mutual commitment across financing, centralized updates, and locked timelines..svg" className={styles.termsSubtitle} />

          {/* Neumorphic Terms Container Box */}
          <div className={styles.termsContainer}>
            <InlineSVG src="/services/Rectangle 137.svg" className={styles.termsBorder} />
            
            {/* Divider Line */}
            <InlineSVG src="/services/Line 50.svg" className={styles.termsDivider} />

            {/* Terms & Rules Content */}
            <InlineSVG src="/services/Frame 197.svg" className={styles.termsContent} />

            {/* Terms Button */}
            <InlineSVG src="/services/Frame 198.svg" className={styles.btnTerms} />
            
            {/* Rules Button */}
            <InlineSVG src="/services/Frame 199.svg" className={styles.btnRules} />
          </div>

          {/* ----- SECTION 4: FOOTER ----- */}
          <div className={styles.footerWrapper}>
            <InlineSVG src="/services/Footer.svg" className={styles.footerSvg} />

            {/* Social media tiles (Frame 67) */}
            <div className={styles.socialsGroup}>
              <button 
                className={styles.socialTile} 
                onClick={() => handleSocialClick("LinkedIn")}
                aria-label="LinkedIn"
              >
                <svg className={styles.socialIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                  <rect x="2" y="9" width="4" height="12" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </button>

              <button 
                className={styles.socialTile} 
                onClick={() => handleSocialClick("Instagram")}
                aria-label="Instagram"
              >
                <svg className={styles.socialIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </button>

              <button 
                className={styles.socialTile} 
                onClick={() => handleSocialClick("YouTube")}
                aria-label="YouTube"
              >
                <svg className={styles.socialIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
                  <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="currentColor" />
                </svg>
              </button>
            </div>

            {/* Interactive Email Subscription Overlay on the Footer's email box */}
            <form onSubmit={handleSubscribe} className={styles.footerSearchForm}>
              <input
                className={styles.footerSearchInput}
                type="email"
                placeholder="you@gmail.com"
                value={footerEmail}
                onChange={(e) => setFooterEmail(e.target.value)}
                required
                aria-label="Email address in footer"
              />
              <button
                className={styles.footerSearchSubmit}
                type="submit"
                aria-label="Submit email in footer"
              />
            </form>

            {/* Copyright Banner rendered outside the input to avoid overlapping text */}
            <div className={styles.copyrightBanner}>
              @2026 Aeethod. All rights reserved.
            </div>
          </div>

          {/* ===== 3D DRAGGABLE THEME SWITCH OVERLAY ===== */}
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
