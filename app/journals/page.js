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

  // Email state for newsletter subscription
  const [newsletterEmail, setNewsletterEmail] = useState("");
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

  const handleSubscribe = (e, emailType) => {
    e.preventDefault();
    playClickSound();
    const email = emailType === "newsletter" ? newsletterEmail : footerEmail;
    if (email) {
      alert(`Thank you for subscribing with: ${email}`);
      if (emailType === "newsletter") setNewsletterEmail("");
      else setFooterEmail("");
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

  const handleSidebarClick = (categoryName) => {
    playClickSound();
    console.log(`Sidebar category selected: ${categoryName}`);
  };

  return (
    <div className={styles.pageWrapper} data-theme={isDark ? "dark" : "light"}>
      {/* ===== NAVIGATION ===== */}
      <div className={styles.navOuter}>
        <nav className={styles.navbar} id="navbar">
          <div className={styles.navContent}>
            <a href="/" className={styles.logo} aria-label="Aeethod Home">
              <InlineSVG src="/logo.svg" className={styles.logoImg} />
            </a>

            <div className={styles.navLinks}>
              <a href="/studio" className={styles.navLink}>
                Studio
              </a>
              <a href="/#system" className={styles.navLink}>
                System
              </a>
              <a href="/research" className={styles.navLink}>
                Research
              </a>
              <a href="/products" className={styles.navLink}>
                Products
              </a>
              <a href="/journals" className={`${styles.navLink} ${styles.activeNavLink}`}>
                Journals
              </a>
            </div>
          </div>
        </nav>
      </div>

      {/* ===== MAIN CONTENT ===== */}
      <main className={styles.mainContainer}>
        <div className={styles.contentAlignContainer}>
          {/* Main Journals Mockup SVG */}
          <InlineSVG src="/journals.svg" className={styles.journalsSvg} />

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

          {/* ===== INTERACTIVE SIDEBAR CATEGORY LIST OVERLAYS ===== */}
          <div className={styles.sidebarTriggers}>
            <div
              className={styles.sidebarTrigger}
              onClick={() => handleSidebarClick("System Breakdowns")}
              title="System Breakdowns"
            />
            <div
              className={styles.sidebarTrigger}
              onClick={() => handleSidebarClick("AI + Business Thinking")}
              title="AI + Business Thinking"
            />
            <div
              className={styles.sidebarTrigger}
              onClick={() => handleSidebarClick("Case Studies")}
              title="Case Studies"
            />
            <div
              className={styles.sidebarTrigger}
              onClick={() => handleSidebarClick("Thought Essays")}
              title="Thought Essays"
            />
          </div>

          {/* ===== INTERACTIVE FILTER PILLS FLEX OVERLAY ===== */}
          <div className={styles.filterBarOverlay}>
            <div className={styles.filterLabelPlaceholder} />
            <div className={styles.filterButtonsContainer}>
              <button
                className={styles.filterButton}
                onClick={() => handleFilterClick("All")}
                aria-label="Filter All"
              />
              <button
                className={styles.filterButton}
                onClick={() => handleFilterClick("System")}
                aria-label="Filter System"
              />
              <button
                className={styles.filterButton}
                onClick={() => handleFilterClick("AI + Business")}
                aria-label="Filter AI + Business"
              />
              <button
                className={styles.filterButton}
                onClick={() => handleFilterClick("Research")}
                aria-label="Filter Research"
              />
              <button
                className={styles.filterButton}
                onClick={() => handleFilterClick("Case Studies")}
                aria-label="Filter Case Studies"
              />
              <button
                className={styles.filterButton}
                onClick={() => handleFilterClick("Framework")}
                aria-label="Filter Framework"
              />
              <button
                className={styles.filterButton}
                onClick={() => handleFilterClick("Thought Essays")}
                aria-label="Filter Thought Essays"
              />
            </div>
            <div className={styles.filterSearchBox}>
              <input
                className={styles.filterSearchInput}
                type="text"
                placeholder="Search filters..."
                onChange={(e) => console.log("Searching filters:", e.target.value)}
              />
            </div>
          </div>

          {/* ===== INTERACTIVE READ ESSAY BUTTON OVERLAYS ===== */}
          {/* Card 1: The Clarity Gap */}
          <button
            className={`${styles.readEssayBtn} ${styles.btnEssay1}`}
            onClick={() => handleEssayClick("The Clarity Gap")}
            aria-label="Read The Clarity Gap"
          >
            <span className={styles.readEssayText}>Read essay</span>
          </button>

          {/* Card 2: Designing for Uncertainty */}
          <button
            className={`${styles.readEssayBtn} ${styles.btnEssay2}`}
            onClick={() => handleEssayClick("Designing for Uncertainty")}
            aria-label="Read Designing for Uncertainty"
          >
            <span className={styles.readEssayText}>Read essay</span>
          </button>

          {/* Card 3: Inside TCG pricing */}
          <button
            className={`${styles.readEssayBtn} ${styles.btnEssay3}`}
            onClick={() => handleEssayClick("Inside TCG pricing")}
            aria-label="Read Inside TCG pricing"
          >
            <span className={styles.readEssayText}>Read essay</span>
          </button>

          {/* Card 4: What AI cannot do */}
          <button
            className={`${styles.readEssayBtn} ${styles.btnEssay4}`}
            onClick={() => handleEssayClick("What AI cannot do")}
            aria-label="Read What AI cannot do"
          >
            <span className={styles.readEssayText}>Read essay</span>
          </button>

          {/* Card 5: Process orchestration vs. automation */}
          <button
            className={`${styles.readEssayBtn} ${styles.btnEssay5}`}
            onClick={() => handleEssayClick("Process orchestration vs. automation")}
            aria-label="Read Process orchestration vs. automation"
          >
            <span className={styles.readEssayText}>Read essay</span>
          </button>

          {/* Card 6: Decision support that actually works */}
          <button
            className={`${styles.readEssayBtn} ${styles.btnEssay6}`}
            onClick={() => handleEssayClick("Decision support that actually works")}
            aria-label="Read Decision support that actually works"
          >
            <span className={styles.readEssayText}>Read essay</span>
          </button>

          {/* ===== INTERACTIVE NEWSLETTER FORM OVERLAYS ===== */}
          <form
            onSubmit={(e) => handleSubscribe(e, "newsletter")}
            className={styles.newsletterForm}
          >
            <input
              className={styles.newsletterInput}
              type="email"
              placeholder="you@gmail.com"
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              required
              aria-label="Email address for newsletter"
            />
            <button
              className={styles.newsletterSubmit}
              type="submit"
              aria-label="Subscribe to newsletter"
            />
          </form>

          {/* ===== INTERACTIVE FOOTER SEARCH FORM OVERLAY ===== */}
          <form
            onSubmit={(e) => handleSubscribe(e, "footer")}
            className={styles.footerSearchForm}
          >
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
        </div>
      </main>
    </div>
  );
}
