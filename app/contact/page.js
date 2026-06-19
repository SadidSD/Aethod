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
  <svg viewBox="0 0 24 24" width="24" height="24" fill="#25D366" xmlns="http://www.w3.org/2000/svg">
    <path d="M12.012 2c-5.506 0-9.988 4.478-9.988 9.985 0 1.76.458 3.413 1.258 4.86L2 22l5.318-1.393c1.408.766 3.013 1.205 4.717 1.205 5.508 0 9.99-4.478 9.99-9.986C22.025 6.478 17.52 2 12.012 2zm5.783 14.545c-.246.694-.7 1.257-1.314 1.572-.614.314-1.42.46-2.434.46-1.508 0-3.155-.734-4.622-2.2-1.467-1.468-2.2-3.156-2.2-4.622 0-1.014.146-1.82.46-2.434.314-.614.877-1.177 1.572-1.472.694-.294 1.393-.414 1.936-.414.544 0 1.014.116 1.408.314.394.2.7.534.877.877.177.343.342.993.414 1.393.072.4.072.8 0 1.2-.072.4-.246.8-.414 1.14l-.534.534c-.246.246-.356.544-.246.8.116.257.342.544.534.728.192.184.458.342.728.458.27.116.544.177.8.116.256-.06.51-.27.728-.534.218-.264.458-.51.728-.728.27-.218.544-.356.8-.246.257.116.51.27.728.534.218.264.382.51.534.728.152.218.264.458.264.8z" />
  </svg>
);

const DiscordIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="#5865F2" xmlns="http://www.w3.org/2000/svg">
    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.873-.894.077.077 0 0 1-.008-.128c.126-.093.252-.19.372-.287a.075.075 0 0 1 .077-.011c3.92 1.793 8.18 1.793 12.061 0a.073.073 0 0 1 .078.009c.12.099.246.195.373.289a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.156-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.156 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.156-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.156 2.418z" />
  </svg>
);

const EmailIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="4" width="20" height="16" rx="4" fill="#EA4335" />
    <path d="M22 6l-10 7L2 6" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M2 18l7.5-6.5M22 18l-7.5-6.5" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M3 20h18" stroke="#4285F4" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const MessengerIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="messengerGrad" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#0099FF" />
        <stop offset="50%" stopColor="#AA00FF" />
        <stop offset="100%" stopColor="#FF3399" />
      </linearGradient>
    </defs>
    <path d="M12 2C6.477 2 2 6.145 2 11.258c0 2.914 1.458 5.518 3.717 7.205v3.93l3.655-2.007c.834.232 1.714.356 2.628.356 5.523 0 10-4.145 10-9.258S17.523 2 12 2zm1.258 11.976l-2.617-2.8-5.11 2.8 5.622-5.96 2.618 2.8 5.11-2.8-5.623 5.96z" fill="url(#messengerGrad)" />
  </svg>
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
      <div className={styles.mainCard}>
        {/* ===== PILL NAVIGATION BAR ===== */}
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

        {/* ===== THEME SLIDE SWITCH ROW ===== */}
        <div className={styles.toggleRow}>
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
