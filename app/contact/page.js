"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import styles from "./page.module.css";

// Helper component to load SVGs inline
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

// Inline Social Icon Components
const WhatsappIcon = () => (
  <InlineSVG src="/whatsapp.svg" />
);

const DiscordIcon = () => (
  <InlineSVG src="/discord.svg" />
);

const EmailIcon = () => (
  <InlineSVG src="/gmail.svg" />
);

const MessengerIcon = () => (
  <InlineSVG src="/messenger.svg" />
);

export default function ContactPage() {
  const [isDark, setIsDark] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragX, setDragX] = useState(0);
  const trackRef = useRef(null);
  const knobRef = useRef(null);
  const startXRef = useRef(0);
  const startDragXRef = useRef(0);
  const hasDraggedRef = useRef(false);

  // Sound resources pre-loaded state
  const clickBufferRef = useRef(null);
  const slideClickBufferRef = useRef(null);
  const slideFoleyBufferRef = useRef(null);
  const audioContextRef = useRef(null);

  // Form states
  const [searchQuery, setSearchQuery] = useState("");
  const [mailEmail, setMailEmail] = useState("");
  const [mailMessage, setMailMessage] = useState("");
  const [footerEmail, setFooterEmail] = useState("");

  // Pre-load and decode audio assets for low latency
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

  // Slide sound — theme switch slider sound foley
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
        const clickAudio = new Audio("/immersive-click.mp3");
        clickAudio.volume = 0.45;
        clickAudio.play().catch(() => {});

        const slideAudio = new Audio("/finger-slide.mp3");
        slideAudio.volume = 0.6;
        slideAudio.play().catch(() => {});
      }
    } catch (e) { /* ignore fallback errors */ }
  }, []);

  // Click sound — button click foley
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
    } catch (e) { /* ignore fallback errors */ }
  }, []);

  // Theme synchronization logic
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", isDark ? "dark" : "light");
  }, [isDark]);

  const getMaxTravel = useCallback(() => {
    if (!trackRef.current || !knobRef.current) return 30;
    return trackRef.current.offsetWidth - knobRef.current.offsetWidth + 1;
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

  // Scroll Indicators Drag & Tracking
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
      const progress = docHeight > 0 ? window.scrollY / docHeight : 0;
      setScrollTopProgress(progress);

      const buttonHeight = 70;
      const padding = 24;
      const maxTravel = window.innerHeight - buttonHeight - padding * 2;
      setMaxScrollTravel(maxTravel);

      if (scrollButtonRef.current) {
        scrollButtonRef.current.style.transform = `translateY(${progress * maxTravel}px)`;
      }
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

    document.documentElement.style.scrollBehavior = "auto";
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

    if (scrollButtonRef.current) {
      scrollButtonRef.current.style.transform = `translateY(${newTranslateY}px)`;
    }

    const scrollPercent = newTranslateY / maxTravel;
    const newScrollTop = scrollPercent * docHeight;
    window.scrollTo({ top: newScrollTop, behavior: "auto" });
  }, []);

  const handleScrollPointerUp = useCallback(
    (e) => {
      if (!isDraggingScrollRef.current) return;

      try {
        scrollButtonRef.current?.releasePointerCapture(e.pointerId);
      } catch (err) {}

      isDraggingScrollRef.current = false;
      setIsDraggingScroll(false);

      document.documentElement.style.scrollBehavior = "";

      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const buttonHeight = 70;
      const padding = 24;
      const maxTravel = window.innerHeight - buttonHeight - padding * 2;

      if (docHeight > 0 && maxTravel > 0) {
        const currentProgress = window.scrollY / docHeight;
        setScrollTopProgress(currentProgress);
      }

      // Check if it was a quick click to scroll home smoothly
      const deltaY = Math.abs(e.clientY - startScrollButtonYRef.current);
      if (deltaY < 5) {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    },
    []
  );

  // Search Submit Handler
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    playClickSound();
    if (searchQuery.trim()) {
      alert(`Searching for: "${searchQuery}"`);
      setSearchQuery("");
    }
  };

  // Quick Mail Form Submit Handler
  const handleMailSubmit = (e) => {
    e.preventDefault();
    playClickSound();
    if (!mailEmail || !mailMessage) {
      alert("Please fill out both the email and message fields.");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(mailEmail)) {
      alert("Please enter a valid email address.");
      return;
    }

    alert(`Message successfully sent!\nEmail: ${mailEmail}\nMessage: ${mailMessage}`);
    setMailEmail("");
    setMailMessage("");
  };

  // Footer Subscription Form Submit Handler
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
      {/* ===== PILL NAVIGATION BAR ===== */}
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
              <a href="/journals" className={styles.navLink}>
                Works
              </a>
              <a href="/contact" className={`${styles.navLink} ${styles.activeNavLink}`}>
                Contact
              </a>
              <a href="#" className={styles.navLink} onClick={() => alert("Vlog coming soon")}>
                Vlog
              </a>
            </div>
          </div>
        </nav>
      </div>

      {/* ===== PAGE CONTENT WRAPPER (SCALED FOR RESPONSIVENESS) ===== */}
      <div className={styles.pageContent}>
        <div className={styles.mainCard}>
          {/* ===== THEME SLIDE SWITCH ROW ===== */}
          <div className={styles.toggleRow}>
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
          </div>

          {/* ===== LEFT COLUMN: Title, Subtitle ===== */}
          <div className={styles.textGroup}>
            <h1 className={styles.heading}>Contact</h1>
            <p className={styles.subHeading}>
              Use a <span className={styles.highlightText}>platform that feels safe</span>
            </p>
          </div>

          {/* ===== LEFT COLUMN: Large Brand Logo ===== */}
          <div className={styles.heroLogoWrapper}>
            <div className={styles.heroLogoShadow}>
              <InlineSVG src="/hero-logo-contract.svg" className={styles.heroLogo} />
            </div>
          </div>

          {/* ===== RIGHT COLUMN: Quick Mail Container ===== */}
          <div className={styles.quickMailContainer}>
            <InlineSVG src="/union.svg" className={styles.quickMailFrame} />
            <div className={styles.tabHeader}>Quick Mail</div>
            <form onSubmit={handleMailSubmit} className={styles.formCard}>
              <input
                type="email"
                placeholder="yourmail@gmail.com"
                className={styles.inputField}
                value={mailEmail}
                onChange={(e) => setMailEmail(e.target.value)}
                required
                aria-label="Contact Email Address"
              />
              <button type="submit" className={styles.sendButton}>
                Send
              </button>
              <textarea
                placeholder="Hey.."
                className={styles.textareaField}
                value={mailMessage}
                onChange={(e) => setMailMessage(e.target.value)}
                required
                aria-label="Message Body"
              />
            </form>
          </div>

          {/* ===== RIGHT COLUMN: Neumorphic 2x2 Social Grid ===== */}
          <div className={styles.socialGridCard}>
            <div className={styles.socialGrid}>
              {/* Divider Lines */}
              <div className={styles.vLine} />
              <div className={styles.hLine} />

              {/* Whatsapp */}
              <a
                href="https://wa.me/"
                target="_blank"
                rel="noopener noreferrer"
                className={`${styles.socialGridCell} ${styles.whatsappCell}`}
                onClick={playClickSound}
              >
                <div className={styles.socialLeft}>
                  <div className={styles.socialIcon}>
                    <WhatsappIcon />
                  </div>
                  <span className={styles.socialName}>Whatsapp</span>
                </div>
                <svg
                  className={styles.socialArrow}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
                </svg>
              </a>

              {/* Discord */}
              <a
                href="https://discord.gg/"
                target="_blank"
                rel="noopener noreferrer"
                className={`${styles.socialGridCell} ${styles.discordCell}`}
                onClick={playClickSound}
              >
                <div className={styles.socialLeft}>
                  <div className={styles.socialIcon}>
                    <DiscordIcon />
                  </div>
                  <span className={styles.socialName}>Discord</span>
                </div>
                <svg
                  className={styles.socialArrow}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
                </svg>
              </a>

              {/* Email */}
              <a
                href="mailto:hello@aeethod.com"
                className={`${styles.socialGridCell} ${styles.emailCell}`}
                onClick={playClickSound}
              >
                <div className={styles.socialLeft}>
                  <div className={styles.socialIcon}>
                    <EmailIcon />
                  </div>
                  <span className={styles.socialName}>Email</span>
                </div>
                <svg
                  className={styles.socialArrow}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
                </svg>
              </a>

              {/* Messenger */}
              <a
                href="https://m.me/"
                target="_blank"
                rel="noopener noreferrer"
                className={`${styles.socialGridCell} ${styles.messengerCell}`}
                onClick={playClickSound}
              >
                <div className={styles.socialLeft}>
                  <div className={styles.socialIcon}>
                    <MessengerIcon />
                  </div>
                  <span className={styles.socialName}>Messenger</span>
                </div>
                <svg
                  className={styles.socialArrow}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
                </svg>
              </a>
            </div>
          </div>

          {/* ===== SIDE INDICATOR ===== */}
          <div className={styles.sideIndicator} />
        </div>

        {/* ===== FOOTER ===== */}
        <div className={styles.footerWrapper}>
          <InlineSVG src="/contact/Footer.svg" className={styles.footerSvg} />
        </div>
      </div>

      {/* ===== FLOATING SCROLL DEPTH BAR INDICATOR ===== */}
      <div
        className={styles.scrollButton}
        ref={scrollButtonRef}
        onPointerDown={handleScrollPointerDown}
        onPointerMove={handleScrollPointerMove}
        onPointerUp={handleScrollPointerUp}
        onPointerCancel={handleScrollPointerUp}
        role="slider"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(scrollTopProgress * 100)}
        aria-label="Scroll position slider"
      >
        <div className={styles.scrollButtonInner} />
      </div>
    </div>
  );
}
