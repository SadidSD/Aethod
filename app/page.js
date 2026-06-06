"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import styles from "./page.module.css";

const CURVE_PATH = "M10.502 301.037C10.502 301.037 278.19 379.737 387.502 346.037C465.301 322.052 519.222 255.036 594.502 224.037C717.17 173.524 741.006 227.347 853.502 157.037C933.502 107.037 953.502 83.0367 953.502 83.0367C953.502 83.0367 999.582 34.0816 1081.5 16.9464C1123.96 8.06441 1155.5 10.9464 1155.5 10.9464";

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

export default function Home() {
  const [isDark, setIsDark] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragX, setDragX] = useState(0);
  const trackRef = useRef(null);
  const knobRef = useRef(null);
  const startXRef = useRef(0);
  const startDragXRef = useRef(0);
  const hasDraggedRef = useRef(false);

  // Journey flow animation refs and state
  const journeyRef = useRef(null);
  const bluePathRef = useRef(null);
  const glowPathRef = useRef(null);
  const journeyStartedRef = useRef(false);
  const [card1Visible, setCard1Visible] = useState(false);
  const [card2Visible, setCard2Visible] = useState(false);
  const [card3Visible, setCard3Visible] = useState(false);

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

  // Journey path flow animation — triggered when section enters viewport
  useEffect(() => {
    const el = journeyRef.current;
    const bluePath = bluePathRef.current;
    if (!el || !bluePath) return;

    const totalLength = bluePath.getTotalLength();
    const glow = glowPathRef.current;
    let animId;

    // Initialize: fully hidden
    bluePath.style.strokeDasharray = totalLength;
    bluePath.style.strokeDashoffset = totalLength;
    if (glow) {
      glow.style.strokeDasharray = totalLength;
      glow.style.strokeDashoffset = totalLength;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !journeyStartedRef.current) {
          journeyStartedRef.current = true;
          observer.disconnect();

          const duration = 6000;
          const startTime = performance.now();
          let c1 = false, c2 = false, c3 = false;

          const tick = (now) => {
            const elapsed = now - startTime;
            const t = Math.min(elapsed / duration, 1);
            // Ease-out cubic for smooth deceleration
            const eased = 1 - Math.pow(1 - t, 3);

            const offset = totalLength * (1 - eased);
            bluePath.style.strokeDashoffset = offset;
            if (glow) glow.style.strokeDashoffset = offset;

            // Reveal cards as the flow reaches their position on the curve
            if (eased >= 0.13 && !c1) { c1 = true; setCard1Visible(true); }
            if (eased >= 0.48 && !c2) { c2 = true; setCard2Visible(true); }
            if (eased >= 0.80 && !c3) { c3 = true; setCard3Visible(true); }

            if (t < 1) animId = requestAnimationFrame(tick);
          };

          animId = requestAnimationFrame(tick);
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      if (animId) cancelAnimationFrame(animId);
    };
  }, []);

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
          <div className={styles.navContent}>
            {/* Circular Logo */}
            <a href="/" className={styles.logo} aria-label="Aeethod Home">
              <InlineSVG
                src="/logo.svg"
                className={styles.logoImg}
              />
            </a>

            {/* Thin Elegant Nav Links */}
            <div className={styles.navLinks}>
              <a href="/studio" className={styles.navLink}>Studio</a>
              <a href="#system" className={styles.navLink}>System</a>
              <a href="/research" className={styles.navLink}>Research</a>
              <a href="/products" className={styles.navLink}>Products</a>
              <a href="/journals" className={styles.navLink}>Journals</a>
            </div>
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
            <div className={styles.servicesJourney} ref={journeyRef}>
              {/* Animated SVG Journey Path */}
              <div className={styles.journeyPathSvg}>
                <svg width="1166" height="365" viewBox="0 0 1166 365" fill="none" overflow="visible" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <filter id="jBorderF" x="-5%" y="-15%" width="110%" height="140%" filterUnits="objectBoundingBox" colorInterpolationFilters="sRGB">
                      <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                      <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                      <feOffset dx="-3" dy="3"/>
                      <feGaussianBlur stdDeviation="3"/>
                      <feColorMatrix type="matrix" values="0 0 0 0 0.76078 0 0 0 0 0.75686 0 0 0 0 0.74902 0 0 0 0.2 0"/>
                      <feBlend mode="normal" in2="BackgroundImageFix" result="e1"/>
                      <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                      <feOffset dx="3" dy="-3"/>
                      <feGaussianBlur stdDeviation="3"/>
                      <feColorMatrix type="matrix" values="0 0 0 0 0.76078 0 0 0 0 0.75686 0 0 0 0 0.74902 0 0 0 0.2 0"/>
                      <feBlend mode="normal" in2="e1" result="e2"/>
                      <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                      <feOffset dx="-3" dy="-3"/>
                      <feGaussianBlur stdDeviation="3"/>
                      <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.9 0"/>
                      <feBlend mode="normal" in2="e2" result="e3"/>
                      <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                      <feOffset dx="3" dy="3"/>
                      <feGaussianBlur stdDeviation="4"/>
                      <feColorMatrix type="matrix" values="0 0 0 0 0.76078 0 0 0 0 0.75686 0 0 0 0 0.74902 0 0 0 0.9 0"/>
                      <feBlend mode="normal" in2="e3" result="e4"/>
                      <feBlend mode="normal" in="SourceGraphic" in2="e4" result="shape"/>
                      <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                      <feOffset dx="1" dy="1"/>
                      <feGaussianBlur stdDeviation="1"/>
                      <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
                      <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.3 0"/>
                      <feBlend mode="normal" in2="shape" result="e5"/>
                      <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                      <feOffset dx="-1" dy="-1"/>
                      <feGaussianBlur stdDeviation="1"/>
                      <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
                      <feColorMatrix type="matrix" values="0 0 0 0 0.76078 0 0 0 0 0.75686 0 0 0 0 0.74902 0 0 0 0.5 0"/>
                      <feBlend mode="normal" in2="e5" result="e6"/>
                    </filter>
                    <filter id="jInnerF" x="-5%" y="-15%" width="110%" height="140%" filterUnits="objectBoundingBox" colorInterpolationFilters="sRGB">
                      <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                      <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
                      <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                      <feOffset dx="3" dy="3"/>
                      <feGaussianBlur stdDeviation="4"/>
                      <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
                      <feColorMatrix type="matrix" values="0 0 0 0 0.713726 0 0 0 0 0.709804 0 0 0 0 0.701961 0 0 0 0.9 0"/>
                      <feBlend mode="normal" in2="shape" result="e1"/>
                      <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                      <feOffset dx="-3" dy="-3"/>
                      <feGaussianBlur stdDeviation="3"/>
                      <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
                      <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.9 0"/>
                      <feBlend mode="normal" in2="e1" result="e2"/>
                    </filter>
                    <filter id="jGlowF" x="-10%" y="-50%" width="120%" height="200%">
                      <feGaussianBlur stdDeviation="8" result="blur"/>
                      <feMerge>
                        <feMergeNode in="blur"/>
                        <feMergeNode in="blur"/>
                        <feMergeNode in="SourceGraphic"/>
                      </feMerge>
                    </filter>
                  </defs>
                  {/* Outer border — static neumorphic track */}
                  <g filter="url(#jBorderF)">
                    <path d={CURVE_PATH} stroke="#E5E5E3" strokeWidth="30" strokeLinecap="round" fill="none"/>
                  </g>
                  {/* Inner blue path — animated flow fill */}
                  <g filter="url(#jInnerF)">
                    <path ref={bluePathRef} d={CURVE_PATH} stroke="#B2CEFE" strokeWidth="15" strokeLinecap="round" fill="none"/>
                  </g>
                  {/* Ambient glow — follows the flow for 3D depth */}
                  <path ref={glowPathRef} d={CURVE_PATH} stroke="#B2CEFE" strokeWidth="24" strokeLinecap="round" fill="none" opacity="0.3" filter="url(#jGlowF)"/>
                </svg>
              </div>

              {/* Service Card 1: Systems Architecture */}
              <div className={`${styles.serviceCard} ${styles.serviceCard1} ${card1Visible ? styles.serviceCardVisible : styles.serviceCardHidden}`} role="region" aria-label="Systems Architecture">
                <div className={styles.serviceIcon}>
                  <div className={styles.serviceIconImg} role="img" aria-label="Systems Architecture Icon" style={{ WebkitMaskImage: "url('/temp_icon1.png')", maskImage: "url('/temp_icon1.png')" }} />
                </div>
                <span style={{ position: 'absolute', width: '1px', height: '1px', padding: '0', margin: '-1px', overflow: 'hidden', clip: 'rect(0, 0, 0, 0)', whiteSpace: 'nowrap', border: '0' }}>
                  Systems Architecture: We design intelligent digital systems. Not apps, not websites — systems
                </span>
                <InlineSVG src="/system archi.svg" className={styles.serviceCardSvg} />
              </div>

              {/* Service Card 2: AI-Driven Automation */}
              <div className={`${styles.serviceCard} ${styles.serviceCard2} ${card2Visible ? styles.serviceCardVisible : styles.serviceCardHidden}`} role="region" aria-label="AI-Driven Automation">
                <div className={styles.serviceIcon}>
                  <div className={styles.serviceIconImg} role="img" aria-label="AI-Driven Automation Icon" style={{ WebkitMaskImage: "url('/temp_icon2.png')", maskImage: "url('/temp_icon2.png')" }} />
                </div>
                <span style={{ position: 'absolute', width: '1px', height: '1px', padding: '0', margin: '-1px', overflow: 'hidden', clip: 'rect(0, 0, 0, 0)', whiteSpace: 'nowrap', border: '0' }}>
                  AI-Driven Automation: Operational intelligence. Decision support. Process orchestration.
                </span>
                <InlineSVG src="/ai driven.svg" className={styles.serviceCardSvg} />
              </div>

              {/* Service Card 3: Applied Research */}
              <div className={`${styles.serviceCard} ${styles.serviceCard3} ${card3Visible ? styles.serviceCardVisible : styles.serviceCardHidden}`} role="region" aria-label="Applied Research">
                <div className={styles.serviceIcon}>
                  <div className={styles.serviceIconImg} role="img" aria-label="Applied Research Icon" style={{ WebkitMaskImage: "url('/temp_icon3.png')", maskImage: "url('/temp_icon3.png')" }} />
                </div>
                <span style={{ position: 'absolute', width: '1px', height: '1px', padding: '0', margin: '-1px', overflow: 'hidden', clip: 'rect(0, 0, 0, 0)', whiteSpace: 'nowrap', border: '0' }}>
                  Applied Research: We study emerging systems. Then we turn insights into tools. Each with short, thoughtful descriptions.
                </span>
                <InlineSVG src="/applied reserch.svg" className={styles.serviceCardSvg} />
              </div>
            </div>
          </div>

          {/* ===== Floating Scroll to Top Button ===== */}
          <button 
            className={styles.floatingScrollTopBtn} 
            onClick={handleScrollToTop} 
            aria-label="Scroll to Top"
          >
            <InlineSVG
              src="/arrow_up.svg"
              className={styles.scrollTopBtnArrow}
            />
          </button>
        </div>
      </section>

      {/* ===== TCG & TRADING CARD ECOSYSTEMS SECTION ===== */}
      <section className={styles.tcgSection} id="tcg-section">
        <div className={styles.tcgAlignContainer}>
          {/* Label: Current Focus */}
          <InlineSVG src="/label_current_focus.svg" className={styles.tcgCurrentFocus} />

          {/* Heading: TCG & Trading Card Ecosystems */}
          <InlineSVG src="/title_tcg_ecosystems.svg" className={styles.tcgTitle} />

          {/* Subtitle Description */}
          <InlineSVG src="/subtitle_tcg.svg" className={styles.tcgSubtitle} />

          {/* Background Dice 2 */}
          <InlineSVG src="/dice_mini_2.svg" className={`${styles.diceShape} ${styles.diceMini2}`} />

          {/* Background Dice 6 */}
          <InlineSVG src="/dice_mini_6.svg" className={`${styles.diceShape} ${styles.diceMini6}`} />

          {/* Background Dice 3 */}
          <InlineSVG src="/dice_mini_3.svg" className={`${styles.diceShape} ${styles.diceMini3}`} />

          {/* Trading Cards */}
          <InlineSVG src="/aeethod4.svg" className={styles.tcgCards} />

          {/* Glassmorphic Pill: We Understand What Matters */}
          <div className={styles.tcgGlassPill}>
            <span className={styles.tcgGlassPillText}>We Understand What Matters</span>
          </div>

          {/* Scroll Down Button */}
          <InlineSVG src="/btn_scroll_details.svg" className={styles.tcgScrollBtn} />

          {/* Bottom text block: Stop doing manual tasks... */}
          <InlineSVG src="/text_manual_tasks.svg" className={styles.tcgBottomText} />
        </div>
      </section>

      {/* ===== HOW OUR AI WILL HELP YOU & DEMO SECTION ===== */}
      <section className={styles.helpSection} id="help-section">
        <div className={styles.helpAlignContainer}>
          {/* Background Dice 1 */}
          <InlineSVG src="/dice_mini_1.svg" className={`${styles.diceShape} ${styles.diceMini1}`} />

          {/* Group 21: How our AI will help you list */}
          <InlineSVG src="/group_21.svg" className={styles.helpGroup21} />

          {/* Background Dice 12 */}
          <InlineSVG src="/dice_mini_12.svg" className={`${styles.diceShape} ${styles.diceMini12}`} />

          {/* Background Dice 7 */}
          <InlineSVG src="/dice_mini_7.svg" className={`${styles.diceShape} ${styles.diceMini7}`} />

          {/* Demo Title */}
          <InlineSVG src="/demo_title.svg" className={styles.helpDemoTitle} />

          {/* Demo Content (Mockup screenshot) */}
          <InlineSVG src="/demo_content.svg" className={styles.helpDemoContent} />

          {/* Background Dice 9 */}
          <InlineSVG src="/dice_mini_9.svg" className={`${styles.diceShape} ${styles.diceMini9}`} />

          {/* Background Dice 13 */}
          <InlineSVG src="/dice_mini_13.svg" className={`${styles.diceShape} ${styles.diceMini13}`} />
        </div>
      </section>

      {/* ===== FOOTER SECTION ===== */}
      <footer className={styles.footerSection} id="footer-section">
        <div className={styles.footerAlignContainer}>
          <InlineSVG src="/footer_custom.svg" className={styles.footerSvg} />
        </div>
      </footer>

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
