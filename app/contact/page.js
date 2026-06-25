"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import styles from "./page.module.css";
import { useTheme } from "../context/ThemeContext";
import ThemeToggle from "../components/ThemeToggle";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";


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
  const { isDark } = useTheme();
              
  // Sound resources pre-loaded state
        
  // Form states
  const [searchQuery, setSearchQuery] = useState("");
  const [mailEmail, setMailEmail] = useState("");
  const [mailMessage, setMailMessage] = useState("");
  const [footerEmail, setFooterEmail] = useState("");

  
  
  // Click sound — button click foley
    const playClickSound = useCallback(() => {
    try {
      const audio = new Audio("/touchpad sd.mp3");
      audio.volume = 0.85;
      audio.play().catch(() => {});
    } catch (e) {
      /* ignore */
    }
  }, []);

  // Theme synchronization logic
  
  
  
  
  
  
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
      <Navbar activePage="contact" />

      {/* ===== PAGE CONTENT WRAPPER (SCALED FOR RESPONSIVENESS) ===== */}
      <div className={styles.pageContent}>
        <div className={styles.mainCard}>
          {/* ===== THEME SLIDE SWITCH ROW ===== */}
          <div className={styles.toggleRow}>
            <ThemeToggle className={styles.slideButton} />
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

      </div>

      {/* ===== FOOTER ===== */}
      <Footer />

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
