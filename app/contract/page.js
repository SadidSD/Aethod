"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import LargeLogo from "./LargeLogo";
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

export default function ContractPage() {
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

  // Form state
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

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

  const handleSend = (e) => {
    e.preventDefault();
    playClickSound();
    if (email && message) {
      alert(`Message sent!\nEmail: ${email}\nMessage: ${message}`);
      setEmail("");
      setMessage("");
    } else {
      alert("Please fill in both email and message fields.");
    }
  };

  const handleContactClick = (name) => {
    playClickSound();
    alert(`Opening ${name}...`);
  };

  // Arrow up-right icon component
  const ArrowUpRight = () => (
    <div className={styles.contactArrow}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M7 17L17 7M17 17V7H7" stroke="#717171" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </div>
  );

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
              <a href="#" className={styles.navLink} onClick={() => alert("Vlog coming soon")}>
                Vlog
              </a>
              <a href="/contract" className={`${styles.navLink} ${styles.activeNavLink}`}>
                Contract
              </a>
            </div>
          </div>
        </nav>
      </div>

      {/* ===== MAIN CONTENT ===== */}
      <main className={styles.mainContainer}>
        <div className={styles.contentAlignContainer}>
          {/* Header: "Contract" title + subtitle */}
          <div className={styles.headerFrame}>
            <h1 className={styles.headerTitle}>Contract</h1>
            <p className={styles.headerSubtitle}>
              Use a <span className={styles.headerSubtitleHighlight}>platform that feels safe</span>
            </p>
          </div>

          {/* Decorative Logo */}
          <div className={styles.logoVector}>
            <LargeLogo />
          </div>

          {/* ===== Quick Mail Section (Union shape with form) ===== */}
          <div className={styles.quickMailSection}>
            {/* Background shape */}
            <InlineSVG src="/contract/Union.svg" className={styles.quickMailUnion} />

            {/* Tab label */}
            <div className={styles.quickMailTab}>
              <span className={styles.quickMailTabLabel}>Quick Mail</span>
            </div>

            {/* Email input + Send button row */}
            <div className={styles.quickMailInputRow}>
              <input
                type="email"
                className={styles.emailInput}
                placeholder="yourmail@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                id="contract-email-input"
              />
              <button
                className={styles.sendButton}
                onClick={handleSend}
                id="contract-send-btn"
              >
                Send
              </button>
            </div>

            {/* Message textarea */}
            <textarea
              className={styles.messageInput}
              placeholder="Hey.."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              id="contract-message-input"
            />
          </div>

          {/* ===== Contact Methods Box ===== */}
          <div className={styles.contactMethodsBox}>
            {/* Dividers */}
            <div className={styles.contactDividerV} />
            <div className={styles.contactDividerH} />

            {/* Whatsapp — top left */}
            <a
              href="#"
              className={`${styles.contactLink} ${styles.contactWhatsapp}`}
              onClick={(e) => { e.preventDefault(); handleContactClick("Whatsapp"); }}
              id="contact-whatsapp"
            >
              <svg className={styles.contactIcon} viewBox="0 0 24 24" fill="none" stroke="#25D366" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
              <div className={styles.contactLabelWrapper}>
                <span className={styles.contactLabel}>Whatsapp</span>
                <ArrowUpRight />
              </div>
            </a>

            {/* Discord — top right */}
            <a
              href="#"
              className={`${styles.contactLink} ${styles.contactDiscord}`}
              onClick={(e) => { e.preventDefault(); handleContactClick("Discord"); }}
              id="contact-discord"
            >
              <svg className={styles.contactIcon} viewBox="0 0 24 24" fill="none" stroke="#5865F2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12h.01M15 12h.01M10 16s1.5 1 4 0M20.2 7.8l-2.6 12.4c-.2.9-1.1 1.4-2 1.2l-4.6-1.4-2.4 2.1c-.7.6-1.7.1-1.7-.8v-2.7L3.6 17c-.9-.3-1.2-1.3-.7-2.1L6 10.3 4.8 5.7c-.3-.9.5-1.7 1.4-1.4l14 5.5z"/></svg>
              <div className={styles.contactLabelWrapper}>
                <span className={styles.contactLabel}>Discord</span>
                <ArrowUpRight />
              </div>
            </a>

            {/* Email — bottom left */}
            <a
              href="#"
              className={`${styles.contactLink} ${styles.contactEmail}`}
              onClick={(e) => { e.preventDefault(); handleContactClick("Email"); }}
              id="contact-email"
            >
              <svg className={styles.contactIcon} viewBox="0 0 24 24" fill="none" stroke="#EA4335" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
              <div className={styles.contactLabelWrapper}>
                <span className={styles.contactLabel}>Email</span>
                <ArrowUpRight />
              </div>
            </a>

            {/* Messenger — bottom right */}
            <a
              href="#"
              className={`${styles.contactLink} ${styles.contactMessenger}`}
              onClick={(e) => { e.preventDefault(); handleContactClick("Messenger"); }}
              id="contact-messenger"
            >
              <svg className={styles.contactIcon} viewBox="0 0 24 24" fill="none" stroke="#0084FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/><path d="M9.5 13.5L12 11l2.5 2.5"/></svg>
              <div className={styles.contactLabelWrapper}>
                <span className={styles.contactLabel}>Messenger</span>
                <ArrowUpRight />
              </div>
            </a>
          </div>

          {/* ===== 3D DRAGGABLE THEME SWITCH ===== */}
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
