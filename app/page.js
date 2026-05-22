"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import styles from "./page.module.css";

export default function Home() {
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

  // Pre-load and decode audio files for zero-latency, high-quality audio processing
  useEffect(() => {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;

    const ctx = new AudioContext();
    audioContextRef.current = ctx;

    const loadSound = (url, bufferRef) => {
      fetch(url)
        .then(res => {
          if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
          return res.arrayBuffer();
        })
        .then(arrayBuffer => ctx.decodeAudioData(arrayBuffer))
        .then(buffer => {
          bufferRef.current = buffer;
        })
        .catch(err => console.warn(`Error preloading sound ${url}:`, err));
    };

    loadSound('/touchpad sd.mp3', clickBufferRef);
    loadSound('/immersive-click.mp3', slideClickBufferRef);
    loadSound('/finger-slide.mp3', slideFoleyBufferRef);

    return () => {
      if (ctx && ctx.state !== 'closed') {
        ctx.close().catch(() => {});
      }
    };
  }, []);

  // Scroll to the end of the hero page (services section)
  const handleScrollToServices = useCallback(() => {
    const servicesSection = document.getElementById("services");
    if (servicesSection) {
      servicesSection.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  // Scroll to the top of the page smoothly
  const handleScrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Slide sound - plays original slide audio assets with zero latency
  const playSlideSound = useCallback(() => {
    try {
      const ctx = audioContextRef.current;
      const clickBuffer = slideClickBufferRef.current;
      const foleyBuffer = slideFoleyBufferRef.current;

      if (ctx) {
        if (ctx.state === 'suspended') {
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
          const clickAudio = new Audio('/immersive-click.mp3');
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
          const slideAudio = new Audio('/finger-slide.mp3');
          slideAudio.volume = 0.6;
          slideAudio.play().catch(() => {});
        }
      } else {
        // Fallback
        const clickAudio = new Audio('/immersive-click.mp3');
        clickAudio.volume = 0.45;
        clickAudio.play().catch(() => {});

        const slideAudio = new Audio('/finger-slide.mp3');
        slideAudio.volume = 0.6;
        slideAudio.play().catch(() => {});
      }
    } catch (e) { /* ignore fallback errors */ }
  }, []);

  // Button click sound - plays original touchpad sd.mp3 with zero latency and louder volume
  const playClickSound = useCallback(() => {
    try {
      const ctx = audioContextRef.current;
      const buffer = clickBufferRef.current;

      if (ctx && buffer) {
        if (ctx.state === 'suspended') {
          ctx.resume();
        }

        const source = ctx.createBufferSource();
        source.buffer = buffer;

        // Gain node to control volume (louder but exact original sound)
        const gainNode = ctx.createGain();
        gainNode.gain.value = 1.8;

        source.connect(gainNode);
        gainNode.connect(ctx.destination);

        source.start(0);
      } else {
        // Fallback if not loaded
        const audio = new Audio('/touchpad sd.mp3');
        audio.volume = 1.0;
        audio.play().catch(() => {});
      }
    } catch (e) {
      try {
        const audio = new Audio('/touchpad sd.mp3');
        audio.volume = 1.0;
        audio.play().catch(() => {});
      } catch (err) {}
    }
  }, []);

  // Apply theme to <html>
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  // Calculate knob travel distance
  const getMaxTravel = useCallback(() => {
    if (!trackRef.current || !knobRef.current) return 30;
    return trackRef.current.offsetWidth - knobRef.current.offsetWidth;
  }, []);

  // Pointer down — start drag
  const handlePointerDown = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
    hasDraggedRef.current = false;
    startXRef.current = e.clientX;
    startDragXRef.current = isDark ? getMaxTravel() : 0;
    knobRef.current?.setPointerCapture(e.pointerId);
  }, [isDark, getMaxTravel]);

  // Pointer move — drag the knob
  const handlePointerMove = useCallback((e) => {
    if (!isDragging) return;
    const delta = e.clientX - startXRef.current;
    if (Math.abs(delta) > 3) hasDraggedRef.current = true;
    const maxTravel = getMaxTravel();
    const newX = Math.max(0, Math.min(maxTravel, startDragXRef.current + delta));
    setDragX(newX);
  }, [isDragging, getMaxTravel]);

  // Pointer up — finish drag, determine toggle
  const handlePointerUp = useCallback(() => {
    if (!isDragging) return;
    setIsDragging(false);
    const maxTravel = getMaxTravel();
    const threshold = maxTravel / 2;

    if (hasDraggedRef.current) {
      // Dragged — toggle based on position
      const shouldBeDark = dragX > threshold;
      if (shouldBeDark !== isDark) {
        playSlideSound();
        setIsDark(shouldBeDark);
      }
      setDragX(shouldBeDark ? maxTravel : 0);
    } else {
      // Tapped — toggle
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
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isDark, isDragging, getMaxTravel]);

  const knobStyle = isDragging
    ? { transform: `translateX(${dragX}px)`, transition: 'none' }
    : { transform: `translateX(${isDark ? getMaxTravel() : 0}px)`, transition: 'transform 0.4s cubic-bezier(0.85, 0.05, 0.18, 1.35)' };

  // Scroll Indicator Drag & Tracking
  const [scrollTopProgress, setScrollTopProgress] = useState(0);
  const [isDraggingScroll, setIsDraggingScroll] = useState(false);
  const [maxScrollTravel, setMaxScrollTravel] = useState(0);
  
  const isDraggingScrollRef = useRef(false);
  const startScrollButtonYRef = useRef(0);
  const startScrollTranslateYRef = useRef(0);
  const scrollButtonRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (isDraggingScrollRef.current) return;

      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight > 0) {
        setScrollTopProgress(window.scrollY / docHeight);
      } else {
        setScrollTopProgress(0);
      }
      
      const buttonHeight = 70;
      const padding = 24;
      setMaxScrollTravel(window.innerHeight - buttonHeight - padding * 2);
    };
    
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);
    handleScroll();
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  const handleScrollPointerDown = useCallback((e) => {
    e.preventDefault();
    
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const buttonHeight = 70;
    const padding = 24;
    const maxTravel = window.innerHeight - buttonHeight - padding * 2;
    
    if (docHeight <= 0 || maxTravel <= 0) return;

    // Temporarily set scroll-behavior to auto so dragging is instant
    document.documentElement.style.scrollBehavior = 'auto';
    isDraggingScrollRef.current = true;
    setIsDraggingScroll(true);
    
    startScrollButtonYRef.current = e.clientY;
    
    const currentProgress = window.scrollY / docHeight;
    startScrollTranslateYRef.current = currentProgress * maxTravel;
    
    scrollButtonRef.current?.setPointerCapture(e.pointerId);
  }, []);

  const handleScrollPointerMove = useCallback((e) => {
    if (!isDraggingScrollRef.current) return;
    
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const buttonHeight = 70;
    const padding = 24;
    const maxTravel = window.innerHeight - buttonHeight - padding * 2;
    
    if (docHeight <= 0 || maxTravel <= 0) return;

    const deltaY = e.clientY - startScrollButtonYRef.current;
    const newTranslateY = Math.max(0, Math.min(maxTravel, startScrollTranslateYRef.current + deltaY));
    
    // Direct DOM manipulation for buttery smooth transform updates
    if (scrollButtonRef.current) {
      scrollButtonRef.current.style.transform = `translateY(${newTranslateY}px)`;
    }
    
    // Scroll the page synchronously
    const scrollPercent = newTranslateY / maxTravel;
    const newScrollTop = scrollPercent * docHeight;
    window.scrollTo({ top: newScrollTop, behavior: 'auto' });
  }, []);

  const handleScrollPointerUp = useCallback((e) => {
    if (!isDraggingScrollRef.current) return;
    
    try {
      scrollButtonRef.current?.releasePointerCapture(e.pointerId);
    } catch (err) {}
    
    isDraggingScrollRef.current = false;
    setIsDraggingScroll(false);
    
    // Restore default CSS smooth scroll behavior
    document.documentElement.style.scrollBehavior = '';
    
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const buttonHeight = 70;
    const padding = 24;
    const maxTravel = window.innerHeight - buttonHeight - padding * 2;
    
    if (docHeight > 0 && maxTravel > 0) {
      const currentProgress = window.scrollY / docHeight;
      setScrollTopProgress(currentProgress);
    }
    
    // Smooth scroll to services if it was a quick click rather than a dragging gesture
    const deltaY = Math.abs(e.clientY - startScrollButtonYRef.current);
    if (deltaY < 5) {
      handleScrollToServices();
    }
  }, [handleScrollToServices]);

  return (
    <div className={styles.pageWrapper} data-theme={isDark ? 'dark' : 'light'}>
      {/* ===== NAVIGATION ===== */}
      <div className={styles.navOuter}>
        <nav className={styles.navbar} id="navbar">
          <div className={styles.navLeft}>
            {/* Circular Logo */}
            <a href="/" className={styles.logo} aria-label="Aeethod Home">
              <img
                className={styles.logoImg}
                src="/logo.svg"
                alt="Aeethod"
                width={44}
                height={44}
              />
            </a>

            {/* Thin Elegant Nav Links */}
            <div className={styles.navLinks}>
              <a href="#studio" className={styles.navLink}>Studio</a>
              <a href="#system" className={styles.navLink}>System</a>
              <a href="#research" className={styles.navLink}>Research</a>
              <a href="#products" className={styles.navLink}>Products</a>
              <a href="#journals" className={styles.navLink}>Journals</a>
            </div>
          </div>

          {/* Glassmorphic Search Bar */}
          <div className={styles.navCenter}>
            <div className={styles.searchBar}>
              <svg
                className={styles.searchIcon}
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="11" cy="11" r="7" stroke="#3B719F" strokeWidth="2" />
                <path d="M16.5 16.5L21 21" stroke="#3B719F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <input
                className={styles.searchInput}
                type="text"
                placeholder="Ask Smith about your query"
                id="search-input"
              />
            </div>
          </div>

          {/* Contact Button */}
          <div className={styles.navRight}>
            <a href="#contact" className={styles.contactBtn} aria-label="Contact" id="contact-btn">
              <img
                className={styles.contactBtnImg}
                src="/contract.svg"
                alt="Contact"
                width={44}
                height={44}
              />
            </a>
          </div>
        </nav>
      </div>

      {/* ===== HERO SECTION ===== */}
      <section className={styles.heroSection} id="hero">
        <div className={styles.alignContainer}>
          <div className={styles.heroContent}>
            {/* Left — Copy */}
            <div className={styles.heroText}>
              <h1 className={styles.heroHeading}>
                We design{" "}
                <span className={styles.heroHighlight}>intelligent{"\n"}systems</span>{" "}
                for complex environments.
              </h1>
              <p className={styles.heroSubtext}>
                AI-first architectures, automation, and decision
                systems for businesses operating in uncertainty.
              </p>
              <div className={styles.heroButtons}>
                <button
                  className={styles.btnExplore}
                  id="btn-explore"
                  onClick={playClickSound}
                >
                  <span className={styles.btnFace}>
                    <span className={styles.btnLabel}>Explore</span>
                    <span className={styles.btnArrowWrap}>
                      <svg className={styles.btnArrow} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M7 17L17 7M17 17V7H7" stroke="url(#arrowGrad)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <defs>
                          <radialGradient id="arrowGrad" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(12 12) rotate(90) scale(5)">
                            <stop stopColor="#5A69EA"/>
                            <stop offset="1" stopColor="#BF8BCA"/>
                          </radialGradient>
                        </defs>
                      </svg>
                    </span>
                  </span>
                </button>
                <button
                  className={styles.btnThinking}
                  id="btn-thinking"
                  onClick={playClickSound}
                >
                  <span className={styles.btnFace}>
                    <span className={styles.btnLabel}>Thinking</span>
                    <span className={styles.btnArrowWrap}>
                      <svg className={styles.btnArrow} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M7 17L17 7M17 17V7H7" stroke="url(#arrowGradThinking)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <defs>
                          <linearGradient id="arrowGradThinking" x1="7" y1="7" x2="17" y2="17" gradientUnits="userSpaceOnUse">
                            <stop offset="0%" stopColor="#5A69EA" />
                            <stop offset="100%" stopColor="#BF8BCA" />
                          </linearGradient>
                        </defs>
                      </svg>
                    </span>
                  </span>
                </button>
              </div>
            </div>

            {/* Right — Orb */}
            <div className={styles.heroVisual}>
              {/* Slide Toggle — Dark/Light Mode */}
              <div className={styles.slideButton} id="theme-toggle">
                {/* Down area / track */}
                <div className={styles.slideTrack} ref={trackRef}>
                  {/* Blue inner track */}
                  <div className={styles.slideTrackInner} />

                  {/* Draggable knob */}
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
                    {/* Inner recessed circle */}
                    <div className={styles.slideKnobInner} />
                  </div>
                </div>
              </div>

              {/* Orb */}
              <div className={styles.orbContainer}>
                <div className={styles.orbGlow} />
                <div className={styles.orbVideoMask}>
                  <video
                    className={styles.orbVideo}
                    src="/orb1.mp4"
                    autoPlay
                    loop
                    muted
                    playsInline
                  />
                </div>
                {/* Shadow underneath */}
                <div className={styles.orbShadow} />
              </div>
            </div>
          </div>

          {/* AI Assist Button (ChatGPT icon) */}
          <button className={styles.heroAiBtn} id="settings-btn" aria-label="AI Assist">
            <div className={styles.settingBtnBlueCircle}>
              <div className={styles.settingBtnMiddleCircle}>
                <img
                  src="/ai%20icon%202.svg"
                  alt="AI Assist"
                  className={styles.settingBtnImg}
                />
              </div>
            </div>
          </button>
        </div>
      </section>

      {/* ===== Decorative Path + Gear Orb ===== */}
      <div className={styles.heroPathSection}>
        <div className={styles.heroPathWrapper}>
          <svg
            className={styles.heroPathSvg}
            viewBox="0 0 320 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="pathGrad1" x1="0" y1="12" x2="320" y2="12" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="rgba(196,181,253,0)" />
                <stop offset="30%" stopColor="rgba(196,181,253,0.4)" />
                <stop offset="70%" stopColor="rgba(196,181,253,0.4)" />
                <stop offset="100%" stopColor="rgba(196,181,253,0)" />
              </linearGradient>
              <filter id="pathGlow1">
                <feGaussianBlur stdDeviation="2" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <path
              d="M0 12 Q80 4, 160 12 T320 12"
              stroke="url(#pathGrad1)"
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
              filter="url(#pathGlow1)"
            />
            {/* Small dots along path */}
            <circle cx="60" cy="9" r="2" fill="rgba(196,181,253,0.5)" />
            <circle cx="160" cy="12" r="2" fill="rgba(196,181,253,0.6)" />
            <circle cx="260" cy="9" r="2" fill="rgba(196,181,253,0.5)" />
          </svg>

          {/* Gear / Settings Orb */}
          <div className={styles.settingsOrb}>
            <div className={styles.settingsOrbInner}>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* ===== WHAT WE ACTUALLY DO ===== */}
      <section className={styles.servicesSection} id="services">
        <div className={styles.alignContainer}>
          <div className={styles.servicesContent}>
            <div className={styles.servicesHeader}>
              <h2 className={styles.servicesHeading}>
                What We <span className={styles.servicesHighlight}>Actually Do</span>
              </h2>
              <p className={styles.servicesSubtext}>
                Operations are overloaded with platforms.{"\n"}
                Signals are buried under systems.{" "}
                <a href="#" className={styles.aeethodLink}>Aeethod</a>{"\n"}
                converts complexity into coordinated action.
              </p>
            </div>

            {/* Journey Path with Services */}
            <div className={styles.servicesJourney}>
              {/* SVG Journey Path */}
              <img
                src="/curve.svg"
                className={styles.journeyPathSvg}
                alt="Services Journey Path"
              />

              {/* Service Card 1: Systems Architecture */}
              <div className={`${styles.serviceCard} ${styles.serviceCard1}`}>
                <div className={styles.serviceIcon}>
                  <div className={styles.serviceIconImg} role="img" aria-label="Systems Architecture Icon" style={{ WebkitMaskImage: "url('/temp_icon1.png')", maskImage: "url('/temp_icon1.png')" }} />
                </div>
                <h3 className={styles.serviceTitle}>
                  Systems <span className={styles.serviceTitleAccent}>Architecture</span>
                </h3>
                <p className={styles.serviceDesc}>
                  We design intelligent digital systems.<br />
                  Not apps, not websites — systems
                </p>
              </div>

              {/* Service Card 2: AI-Driven Automation */}
              <div className={`${styles.serviceCard} ${styles.serviceCard2}`}>
                <div className={styles.serviceIcon}>
                  <div className={styles.serviceIconImg} role="img" aria-label="AI-Driven Automation Icon" style={{ WebkitMaskImage: "url('/temp_icon2.png')", maskImage: "url('/temp_icon2.png')" }} />
                </div>
                <h3 className={styles.serviceTitle}>
                  AI-Driven <span className={styles.serviceTitleAccent}>Automation</span>
                </h3>
                <p className={styles.serviceDesc}>
                  Operational intelligence<br />
                  Decision support<br />
                  Process orchestration
                </p>
              </div>

              {/* Service Card 3: Applied Research */}
              <div className={`${styles.serviceCard} ${styles.serviceCard3}`}>
                <div className={styles.serviceIcon}>
                  <div className={styles.serviceIconImg} role="img" aria-label="Applied Research Icon" style={{ WebkitMaskImage: "url('/temp_icon3.png')", maskImage: "url('/temp_icon3.png')" }} />
                </div>
                <h3 className={styles.serviceTitle}>
                  Applied <span className={styles.serviceTitleAccent}>Research</span>
                </h3>
                <p className={styles.serviceDesc}>
                  We study emerging systems<br />
                  Then we turn insights into tools<br />
                  Each with short, thoughtful descriptions.
                </p>
              </div>
            </div>
          </div>

          {/* ===== Floating Scroll to Top Button ===== */}
          <button 
            className={styles.floatingScrollTopBtn} 
            onClick={handleScrollToTop} 
            aria-label="Scroll to Top"
          >
            <div className={styles.scrollTopBtnInner}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.scrollTopBtnArrow}>
                <path d="M12 19V5M12 5L5 12M12 5L19 12" stroke="url(#scrollTopArrowGrad)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                <defs>
                  <linearGradient id="scrollTopArrowGrad" x1="12" y1="19" x2="12" y2="5" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#5A69EA"/>
                    <stop offset="100%" stopColor="#BF8BCA"/>
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </button>
        </div>
      </section>

      {/* ===== Floating Scroll Button ===== */}
      <button 
        className={`${styles.floatingScrollBtn} ${isDraggingScroll ? styles.isDragging : ""}`}
        id="scroll-indicator" 
        aria-label="Scroll Down"
        ref={scrollButtonRef}
        onPointerDown={handleScrollPointerDown}
        onPointerMove={handleScrollPointerMove}
        onPointerUp={handleScrollPointerUp}
        onPointerCancel={handleScrollPointerUp}
        onLostPointerCapture={handleScrollPointerUp}
        style={{
          transform: `translateY(${scrollTopProgress * maxScrollTravel}px)`,
          transition: isDraggingScroll ? "none" : "transform 0.22s cubic-bezier(0.25, 1, 0.5, 1)"
        }}
      >
        <div className={styles.scrollKnob} />
      </button>
    </div>
  );
}
