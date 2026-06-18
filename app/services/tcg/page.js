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

  // Interactive Financing Slider State
  const [minPrice, setMinPrice] = useState(3000);
  const [maxPrice, setMaxPrice] = useState(12000);

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
            <button className={styles.btnExplore} onClick={playClickSound}>
              <span className={styles.btnText}>Explore</span>
              <InlineSVG src="/services/tcg/Frame 209.svg" className={styles.btnArrow} />
            </button>
            <button className={styles.btnThinking} onClick={playClickSound}>
              <span className={styles.btnText}>Thinking</span>
            </button>
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
          <InlineSVG src="/services/tcg/Frame 200.svg" className={styles.quickListHeader} />
          <InlineSVG src="/services/tcg/Quick List.svg" className={styles.quickListGrid} />

          {/* SECTION: Project Financing */}
          <InlineSVG src="/services/tcg/Frame 201.svg" className={styles.financingHeader} />

          <InlineSVG src="/services/tcg/Precision engineering cannot be packaged. Every system we build is scoped individually based on operational complexity and data volume..svg" className={styles.financingLeftText} />
          
          <InlineSVG src="/services/tcg/Our structural engagements for custom TCG ecosystems typically begin between $3,000 and $12,000, scaling upward depending entirely on the architectural depth your organization demands. The final financial investment is directly defined by the compl.svg" className={styles.financingRightText} />

          <div className={styles.rangeBoxBg} />
          <div className={styles.sliderLabel}>Average Range</div>

          {/* Interactive Custom Neumorphic Range Slider */}
          <div className={styles.sliderWrapper}>
            <div className={styles.sliderMinLabel}>$3,000</div>
            <div className={styles.sliderTrackContainer}>
              <input
                type="range"
                min="3000"
                max="12000"
                value={minPrice}
                onChange={(e) => setMinPrice(Math.min(Number(e.target.value), maxPrice - 500))}
                className={`${styles.rangeInput} ${styles.minRange}`}
              />
              <input
                type="range"
                min="3000"
                max="12000"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Math.max(Number(e.target.value), minPrice + 500))}
                className={`${styles.rangeInput} ${styles.maxRange}`}
              />
              <div className={styles.sliderTrack} />
              <div
                className={styles.sliderProgress}
                style={{
                  left: `${((minPrice - 3000) / 9000) * 100}%`,
                  right: `${100 - ((maxPrice - 3000) / 9000) * 100}%`,
                }}
              />
              <div
                className={`${styles.sliderThumb} ${styles.leftThumb}`}
                style={{ left: `${((minPrice - 3000) / 9000) * 100}%` }}
              />
              <div
                className={`${styles.sliderThumb} ${styles.rightThumb}`}
                style={{ left: `${((maxPrice - 3000) / 9000) * 100}%` }}
              />
            </div>
            <div className={styles.sliderMaxLabel}>$12,000</div>
            <div className={styles.dynamicPrice}>
              Selected Budget: <span>${minPrice.toLocaleString()} - ${maxPrice.toLocaleString()}</span>
            </div>
          </div>

          {/* SECTION: FAQ */}
          <InlineSVG src="/services/tcg/Frame 208.svg" className={styles.faqHeader} />
          
          <div className={styles.faqContainer}>
            <div className={styles.faqBox1}>
              <InlineSVG src="/services/tcg/Rectangle 147.svg" className={styles.boxBorder} />
              <div className={styles.faqBoxTitle}>Ask Smith</div>
              <InlineSVG src="/services/tcg/Our core intelligence engine is ready to analyze your queries in real time. Ask Smith anything regarding our architectural logic, system frameworks, or engineering capabilities. No forms, no onboarding friction—just immediate structural insights..svg" className={styles.faqBoxDesc} />
            </div>
            
            <div className={styles.faqBox2}>
              <InlineSVG src="/services/tcg/Rectangle 148.svg" className={styles.boxBorder} />
              <div className={styles.faqBoxTitle}>Contract Us</div>
              <InlineSVG src="/services/tcg/Connect directly with a human strategist. If your operational friction requires deep technical evaluation or a bespoke blueprint that goes beyond automated responses, open a direct line to our studio here. No sales pitches, just engineering..svg" className={styles.faqBoxDesc} />
            </div>
          </div>

          {/* Form: Ask Question Directly */}
          <div className={styles.formContainer}>
            <InlineSVG src="/services/tcg/ask ques.svg" className={styles.formBorder} />
            <div className={styles.formHeader}>Ask Question Directly</div>
            
            <form onSubmit={handleFormSubmit} className={styles.interactiveForm}>
              <div className={styles.inputWrapper}>
                <input
                  type="email"
                  placeholder="Your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={styles.formInput}
                  required
                />
              </div>

              <div className={styles.textareaWrapper}>
                <textarea
                  placeholder="Your query"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className={styles.formTextarea}
                  required
                />
              </div>

              <button type="submit" className={styles.btnSubmit} onClick={playClickSound}>
                <span>Explore</span>
                <InlineSVG src="/services/tcg/Frame 209.svg" className={styles.btnSubmitArrow} />
              </button>
            </form>
          </div>

          {/* Neumorphic Footer */}
          <div className={styles.footerWrapper}>
            <InlineSVG src="/services/Footer.svg" className={styles.footerSvg} />
            
            <div className={styles.copyrightBanner}>
              @2026 Aeethod. All rights reserved.
            </div>
          </div>

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
