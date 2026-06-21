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

export default function ProductsPage() {
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
      {/* Hidden global definitions for SVG gradients */}
      <svg style={{ position: "absolute", width: 0, height: 0, overflow: "hidden" }} aria-hidden="true">
        <defs>
          <linearGradient id="paint0_linear_dark_890_256" x1="3.62305" y1="-12" x2="46.0064" y2="222.334" gradientUnits="userSpaceOnUse">
            <stop offset="1" stopColor="#30304a" />
            <stop stopColor="#1a1a2e" />
          </linearGradient>
        </defs>
      </svg>
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
              <a href="/services" className={styles.navLink}>
                Services
              </a>
              <a href="/research" className={styles.navLink}>
                Research
              </a>
              <a href="/products" className={`${styles.navLink} ${styles.activeNavLink}`}>
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

          {/* ===== THEME SWITCH (Slide Button Overlay) ===== */}
          <div className={styles.slideButton} id="theme-toggle">
            <div className={styles.slideTrack} ref={trackRef}>
              <InlineSVG src="/down_area.svg" className={styles.slideTrackSvg} />
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
                <InlineSVG src="/button_up.svg" className={styles.slideKnobSvg} />
              </div>
            </div>
          </div>

          {/* ===== FRAME 91 (Header Title Group) ===== */}
          <InlineSVG src="/products/Frame 91.svg" className={styles.frame91} />

          {/* ===== GROUP 64 (Coming soon + Back and Home buttons) ===== */}
          <div className={styles.group64Container}>
            <InlineSVG src="/products/Group 64.svg" className={styles.group64Svg} />
            
            {/* Interactive button overlays */}
            <a 
              href="#" 
              onClick={(e) => {
                e.preventDefault();
                playClickSound();
                window.history.back();
              }} 
              className={styles.backButtonOverlay} 
              aria-label="Go Back" 
            />
            <a 
              href="/" 
              onClick={() => playClickSound()}
              className={styles.homeButtonOverlay} 
              aria-label="Go Home" 
            />
          </div>

          {/* ===== SIDE INDICATOR (Right Vertical Marker) ===== */}
          <InlineSVG src="/products/Side Indicator.svg" className={styles.rightMarker} />

          {/* ===== FOOTER SECTION ===== */}
          <footer className={styles.footer}>
            {/* Rectangle 48 background card */}
            <div className={styles.footerBg} />
            
            <div className={styles.footerInner}>
              {/* Footer Left Area (Frame 64) */}
              <div className={styles.footerLeft}>
                {/* Brand Header (Frame 63) */}
                <div className={styles.footerBrand}>
                  <div className={styles.footerBrandLogo} />
                  <div className={styles.footerBrandName}>Aeethod</div>
                </div>
                <p className={styles.footerDescription}>
                  We build the intelligence layer that makes human decisions matter more, not less.
                </p>
              </div>

              {/* Footer Right Area */}
              <div className={styles.footerRight}>
                {/* Navigation Links Row */}
                <div className={styles.footerNav}>
                  <a href="/studio" className={styles.footerNavLink}>Studio</a>
                  <a href="/#system" className={styles.footerNavLink}>System</a>
                  <a href="/research" className={styles.footerNavLink}>Research</a>
                  <a href="/products" className={styles.footerNavLink}>Products</a>
                  <a href="/journals" className={styles.footerNavLink}>Journals</a>
                </div>

                {/* Social and Email Subscription Row */}
                <div className={styles.footerBottomRow}>
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

                  {/* Email subscription box (Rectangle 53) */}
                  <form onSubmit={handleSubscribe} className={styles.footerForm}>
                    <input
                      className={styles.footerInput}
                      type="email"
                      placeholder="you@gmail.com"
                      value={footerEmail}
                      onChange={(e) => setFooterEmail(e.target.value)}
                      required
                      aria-label="Email address in footer"
                    />
                    <button
                      className={styles.footerSubmit}
                      type="submit"
                      aria-label="Submit email in footer"
                    >
                      <svg className={styles.submitIcon} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                      </svg>
                    </button>
                  </form>

                  {/* Copyright Text */}
                  <div className={styles.copyrightBanner}>
                    @2026 Aeethod. All rights reserved.
                  </div>
                </div>
              </div>
            </div>
          </footer>

        </div>
      </main>
    </div>
  );
}
