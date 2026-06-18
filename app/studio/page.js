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

export default function StudioPage() {
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

  // Email state for footer subscription
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

  return (
    <div className={styles.pageWrapper} data-theme={isDark ? "dark" : "light"}>
      {/* ===== NAVIGATION ===== */}
      <div className={styles.navOuter}>
        <nav className={styles.navbar} id="navbar">
          <div className={styles.navContent}>
            {/* Circular Logo */}
            <a href="/" className={styles.logo} aria-label="Aeethod Home">
              <InlineSVG src="/logo.svg" className={styles.logoImg} />
            </a>

            {/* Navigation Links */}
            <div className={styles.navLinks}>
              <a href="/studio" className={`${styles.navLink} ${styles.activeNavLink}`}>
                Studio
              </a>
              <a href="/services" className={styles.navLink}>
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
              <a href="#" className={styles.navLink} onClick={() => alert("Vlog coming soon")}>
                Vlog
              </a>
            </div>
          </div>
        </nav>
      </div>

      {/* ===== MAIN CONTENT ===== */}
      <main className={styles.mainContainer}>
        <div className={styles.contentAlignContainer}>
          {/* ----- SECTION 1: HERO ----- */}
          <InlineSVG src="/studio/Studio.svg" className={styles.studioTitle} />
          <InlineSVG src="/studio/intelligence_before_interface.svg" className={styles.studioSubtitle} />
          
          <div className={styles.rectangle158} />
          <InlineSVG src="/studio/who_we_are.svg" className={styles.whoWeAre} />
          <InlineSVG src="/studio/we_are_not_an_agency.svg" className={styles.weAreNotAnAgency} />
          
          <InlineSVG src="/studio/image 78.svg" className={styles.heroImageRight} />
          <InlineSVG src="/studio/image 77.svg" className={styles.heroImageLowerLeft} />
          <InlineSVG src="/studio/Frame 142.svg" className={styles.frame142} />

          {/* ----- SECTION 2: WHAT IS SYSTEM STUDIO & HOW WE DIFFER ----- */}
          <InlineSVG src="/studio/what_is_system_studio.svg" className={styles.whatIsTitle} />
          <InlineSVG src="/studio/where_agencies_end.svg" className={styles.whatIsSubtitle} />
          <InlineSVG src="/studio/Frame 144.svg" className={styles.manifestoColumnsCard} />
          <InlineSVG src="/studio/Frame 143.svg" className={styles.howWeDifferCard} />

          {/* ----- SECTION 3: THE MANIFESTO ----- */}
          <InlineSVG src="/studio/Rectangle 88.svg" className={styles.manifestoBg} />
          <InlineSVG src="/studio/The Manifesto.svg" className={styles.manifestoTitle} />
          <InlineSVG src="/studio/Four things we believe.svg" className={styles.manifestoSubtitle} />
          
          <div className={styles.manifestoGridBox}>
            <InlineSVG src="/studio/Rectangle 90.svg" className={styles.manifestoGridLineVert} />
            <InlineSVG src="/studio/Rectangle 91.svg" className={styles.manifestoGridLineHoriz} />
            
            <InlineSVG src="/studio/Group 50.svg" className={styles.manifestoGroup01} />
            <InlineSVG src="/studio/Group 51.svg" className={styles.manifestoGroup02} />
            <InlineSVG src="/studio/Group 52.svg" className={styles.manifestoGroup03} />
            <InlineSVG src="/studio/Group 53.svg" className={styles.manifestoGroup04} />
          </div>
          
          <InlineSVG src="/studio/Line 25.svg" className={styles.manifestoUnderline} />
          <InlineSVG src="/studio/Humans architect. AI executes. Data makes it true. That is what we build..svg" className={styles.manifestoQuote} />

          {/* ----- SECTION 4: HOW WE WORK ----- */}
          <InlineSVG src="/studio/how_we_work.svg" className={styles.howWeWorkSection} />

          {/* ----- SECTION 5: CALL TO ACTION BANNER ----- */}
          <div className={styles.ctaContainer}>
            <InlineSVG src={`/studio/_The first conversation costs nothing. The systems brief tells us both whether this is the right fit._.svg`} className={styles.ctaText} />
          </div>

          {/* ----- SECTION 6: AI CAPABILITY AREAS ----- */}
          <InlineSVG src="/studio/Frame 78.svg" className={styles.capabilityHeader} />
          <InlineSVG src="/studio/Group 75.svg" className={styles.capabilityGrid} />

          {/* ----- SECTION 7: FOOTER ----- */}
          <div className={styles.footerWrapper}>
            <InlineSVG src="/studio/Footer.svg" className={styles.footerSvg} />
            
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
