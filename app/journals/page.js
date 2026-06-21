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

export default function JournalsPage() {
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
    return trackRef.current.offsetWidth - knobRef.current.offsetWidth + 1;
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

  const handleEssayClick = (essayTitle) => {
    playClickSound();
    alert(`Opening essay: "${essayTitle}"`);
  };

  const handleFilterClick = (filterName) => {
    playClickSound();
    console.log(`Active filter selected: ${filterName}`);
  };

  const handleSocialClick = (socialName) => {
    playClickSound();
    alert(`Navigating to Aeethod ${socialName}...`);
  };

  return (
    <div className={styles.pageWrapper} data-theme={isDark ? "dark" : "light"}>
      {/* ===== NAVIGATION ===== */}
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
              <a href="/products" className={styles.navLink}>
                Products
              </a>
              <a href="/journals" className={`${styles.navLink} ${styles.activeNavLink}`}>
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

      {/* ===== MAIN CONTENT ===== */}
      <main className={styles.mainContainer}>
        <div className={styles.contentAlignContainer}>
          {/* Header section (Works) */}
          <InlineSVG src="/works/Frame 91.svg" className={styles.headerTitle} />

          {/* Vertical line dividers */}
          <InlineSVG src="/works/Line 39.svg" className={styles.line39} />
          <InlineSVG src="/works/Line 41.svg" className={styles.line41} />
          <InlineSVG src="/works/Line 40.svg" className={styles.line40} />

          {/* Explore filter bar */}
          <InlineSVG src="/works/Frame 135.svg" className={styles.filterSubNav} />

          {/* Row 1 cards */}
          <InlineSVG src="/works/Frame 193.svg" className={styles.rowCards1} />

          {/* Row 2 cards */}
          <InlineSVG src="/works/Frame 192.svg" className={styles.rowCards2} />

          {/* Side Indicator */}
          <InlineSVG src="/works/Side Indicator.svg" className={styles.sideIndicator} />

          {/* ===== 3D DRAGGABLE THEME SWITCH OVERLAY ===== */}
          <div className={styles.slideButton} id="theme-toggle">
            <div className={styles.slideTrack} ref={trackRef}>
              <InlineSVG src={isDark ? "/down_area_dark.svg" : "/down_area.svg"} className={styles.slideTrackSvg} />
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
                <InlineSVG src={isDark ? "/button_up_dark.svg" : "/button_up.svg"} className={styles.slideKnobSvg} />
              </div>
            </div>
          </div>

          {/* ===== INTERACTIVE FILTER PILLS FLEX OVERLAY ===== */}
          <div className={styles.filterBarOverlay}>
            <div className={styles.filterLabelPlaceholder} />
            <div className={styles.filterButtonsOverlay}>
              <button
                className={styles.filterButton}
                onClick={() => handleFilterClick("Websites")}
                aria-label="Filter Websites"
              />
              <button
                className={styles.filterButton}
                onClick={() => handleFilterClick("Ui & Ux")}
                aria-label="Filter Ui & Ux"
              />
              <button
                className={styles.filterButton}
                onClick={() => handleFilterClick("Case Studies")}
                aria-label="Filter Case Studies"
              />
              <button
                className={styles.filterButton}
                onClick={() => handleFilterClick("Ai")}
                aria-label="Filter Ai"
              />
              <button
                className={styles.filterButton}
                onClick={() => handleFilterClick("Others")}
                aria-label="Filter Others"
              />
            </div>
            <div className={styles.filterSearchBox}>
              <input
                className={styles.filterSearchInput}
                type="text"
                placeholder=" "
                onChange={(e) => console.log("Searching filters:", e.target.value)}
              />
            </div>
          </div>

          {/* ===== INTERACTIVE CHECK BUTTON OVERLAYS ===== */}
          {/* Row 1 check buttons */}
          <button
            className={`${styles.readEssayBtn} ${styles.btnEssay1}`}
            onClick={() => handleEssayClick("Hasib (UI)")}
            aria-label="Check Hasib UI"
          />
          <button
            className={`${styles.readEssayBtn} ${styles.btnEssay2}`}
            onClick={() => handleEssayClick("Sadid (AI)")}
            aria-label="Check Sadid AI"
          />
          <button
            className={`${styles.readEssayBtn} ${styles.btnEssay3}`}
            onClick={() => handleEssayClick("Maruf (Website)")}
            aria-label="Check Maruf Website"
          />
          <button
            className={`${styles.readEssayBtn} ${styles.btnEssay4}`}
            onClick={() => handleEssayClick("Modi (UX)")}
            aria-label="Check Modi UX"
          />

          {/* Row 2 check buttons */}
          <button
            className={`${styles.readEssayBtn} ${styles.btnEssay5}`}
            onClick={() => handleEssayClick("Sadid (AI) Row 2")}
            aria-label="Check Sadid AI Row 2"
          />
          <button
            className={`${styles.readEssayBtn} ${styles.btnEssay6}`}
            onClick={() => handleEssayClick("Modi (UX) Row 2")}
            aria-label="Check Modi UX Row 2"
          />
          <button
            className={`${styles.readEssayBtn} ${styles.btnEssay7}`}
            onClick={() => handleEssayClick("Hasib (UI) Row 2")}
            aria-label="Check Hasib UI Row 2"
          />
          <button
            className={`${styles.readEssayBtn} ${styles.btnEssay8}`}
            onClick={() => handleEssayClick("Maruf (Website) Row 2")}
            aria-label="Check Maruf Website Row 2"
          />

          {/* ===== SECTION 4: FOOTER ===== */}
          <div className={styles.footerWrapper}>
            <InlineSVG src="/works/Footer.svg" className={styles.footerSvg} />

            {/* Social media tiles (Frame 67) */}
            <div className={styles.socialsGroup}>
              <button 
                className={styles.socialTile} 
                onClick={() => handleSocialClick("LinkedIn")}
                aria-label="LinkedIn"
              />

              <button 
                className={styles.socialTile} 
                onClick={() => handleSocialClick("Instagram")}
                aria-label="Instagram"
              />

              <button 
                className={styles.socialTile} 
                onClick={() => handleSocialClick("YouTube")}
                aria-label="YouTube"
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
