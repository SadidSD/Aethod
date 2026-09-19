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
      suppressHydrationWarning={true}
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

// ========================================================
// CONTACT CHANNELS CONFIGURATION
// Easily update destinations, URLs, and labels here:
// ========================================================
const CONTACT_CHANNELS = [
  {
    id: "whatsapp",
    name: "Whatsapp",
    // Format: https://wa.me/<country-code><phone-number-without-leading-zero>
    url: "https://wa.me/8801319022151",
    ariaLabel: "Contact on WhatsApp (01319-022151)",
    isExternal: true,
    Icon: WhatsappIcon,
    cellClass: "whatsappCell",
  },
  {
    id: "discord",
    name: "Discord",
    // Set invite link here (e.g. "https://discord.gg/yourserver") when ready
    url: "#",
    ariaLabel: "Discord community (Coming soon)",
    isExternal: true,
    Icon: DiscordIcon,
    cellClass: "discordCell",
  },
  {
    id: "email",
    name: "Email",
    url: "mailto:sadidbinhasan3@gmail.com",
    ariaLabel: "Send email to sadidbinhasan3@gmail.com",
    isExternal: false,
    Icon: EmailIcon,
    cellClass: "emailCell",
  },
  {
    id: "messenger",
    name: "Messenger",
    url: "https://www.facebook.com/profile.php?id=61594266838782",
    ariaLabel: "Message us on Facebook",
    isExternal: true,
    Icon: MessengerIcon,
    cellClass: "messengerCell",
  },
];

export default function ContactPage() {
  const { isDark } = useTheme();
              
  // Sound resources pre-loaded state
        
  // Form states
  const [mailEmail, setMailEmail] = useState("");
  const [mailMessage, setMailMessage] = useState("");
  const [footerEmail, setFooterEmail] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [mailStatus, setMailStatus] = useState(null);

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

  // Quick Mail Form Submit Handler
  const handleMailSubmit = async (e) => {
    e.preventDefault();
    playClickSound();

    const emailClean = (mailEmail || "").trim();
    const messageClean = (mailMessage || "").trim();

    if (!emailClean || !messageClean) {
      setMailStatus({
        type: "error",
        message: "Please fill out both fields.",
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailClean)) {
      setMailStatus({
        type: "error",
        message: "Please enter a valid email address.",
      });
      return;
    }

    setIsSending(true);
    setMailStatus(null);

    try {
      // Step 1: Send via Next.js API route (/api/contact)
      let success = false;
      let statusMsg = "";

      try {
        const res = await fetch("/api/contact", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            email: emailClean,
            message: messageClean,
          }),
        });

        const data = await res.json().catch(() => ({}));
        if (res.ok && data.success) {
          success = true;
          statusMsg = data.message || "Message sent successfully!";
        }
      } catch (apiErr) {
        console.warn("API route failed, trying direct submission fallback:", apiErr);
      }

      // Step 2: Client-side fallback to FormSubmit
      if (!success) {
        const directRes = await fetch("https://formsubmit.co/ajax/sadidbinhasan3@gmail.com", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            email: emailClean,
            message: messageClean,
            _subject: `New Quick Mail from Aeethod (${emailClean})`,
            _replyto: emailClean,
            _template: "table",
            _captcha: "false",
          }),
        });

        const directData = await directRes.json().catch(() => ({}));
        if (
          directRes.ok &&
          (directData.success === "true" ||
            directData.success === true ||
            (directData.message && directData.message.toLowerCase().includes("activation")))
        ) {
          success = true;
          statusMsg = "Message sent successfully!";
        }
      }

      if (success) {
        setMailStatus({
          type: "success",
          message: statusMsg || "Message sent successfully!",
        });
        setMailEmail("");
        setMailMessage("");
        setTimeout(() => {
          setMailStatus(null);
        }, 7000);
      } else {
        throw new Error("Could not send mail");
      }
    } catch (error) {
      console.error("Submission error:", error);
      setMailStatus({
        type: "error",
        message: "Failed to send.",
        mailto: `mailto:sadidbinhasan3@gmail.com?subject=${encodeURIComponent(
          `Quick Mail from ${emailClean || "Aeethod Visitor"}`
        )}&body=${encodeURIComponent(messageClean)}`,
      });
    } finally {
      setIsSending(false);
    }
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
    <div className={styles.pageWrapper} data-theme={isDark ? "dark" : "light"} suppressHydrationWarning={true}>
      {/* ===== PILL NAVIGATION BAR ===== */}
      <Navbar activePage="contact" />

      {/* ===== PAGE CONTENT WRAPPER (SCALED FOR RESPONSIVENESS) ===== */}
      <div className={styles.pageContent}>
        <div className={styles.mainCard}>
          {/* ===== THEME SLIDE SWITCH ROW ===== */}
          {/* <div className={styles.toggleRow}>
            <ThemeToggle className={styles.slideButton} />
          </div> */}

          {/* ===== LEFT COLUMN: Title, Subtitle ===== */}
          <div className={styles.textGroup}>
            <h1 className={styles.heading}>Contact</h1>
            <p className={styles.subHeading}>
              Use a <span className={styles.highlightText}>platform that feels safe</span>
            </p>
          </div>

          {/* ===== LEFT COLUMN: Neomorphic + Blue Logo Stack ===== */}
          <div className={styles.heroLogoWrapper}>
            {/* Neomorphic base */}
            <svg className={styles.heroLogoNeo} width="268" height="268" viewBox="0 0 268 268" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M39.4444 196.903L3 262C3 262 44.1852 230.036 52.7778 225.359C61.3704 220.681 68.4864 214.519 80.3333 210.936C94.8183 206.555 104.346 205.92 119.444 208.208C138.419 211.083 152.926 222.11 163 228.477C163 226.528 147 209.377 147 209.377C142.556 203.92 117.667 178.973 103.444 173.515C89.2222 168.058 78.1111 170.007 67.8888 172.346C59.711 174.217 45.5185 189.497 39.4444 196.903Z" fill="var(--bg-primary, #ECECEC)"/>
              <path d="M132.607 3L68.678 132.197C68.678 132.197 47.8216 170.088 59.61 152.74C71.3984 135.392 97.0415 115.424 114.471 119.871C122.395 121.892 134.344 130.586 138.501 141.784C143.489 144.523 173.609 212.419 186.109 233.545C186.109 233.545 209.585 269.196 265 264.589L132.607 3Z" fill="var(--bg-primary, #ECECEC)"/>
            </svg>
            {/* Blue logo on top */}
            <InlineSVG src="/logo.svg" className={styles.heroLogoBlue} />
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
                disabled={isSending}
                required
                aria-label="Contact Email Address"
              />

              {mailStatus && (
                <div
                  className={`${styles.statusMessage} ${
                    mailStatus.type === "success"
                      ? styles.statusSuccess
                      : styles.statusError
                  }`}
                  role="status"
                >
                  <span>
                    {mailStatus.message}{" "}
                    {mailStatus.mailto && (
                      <a
                        href={mailStatus.mailto}
                        className={styles.statusMailtoLink}
                      >
                        Send via Email app
                      </a>
                    )}
                  </span>
                </div>
              )}

              <button
                type="submit"
                className={styles.sendButton}
                disabled={isSending}
              >
                {isSending
                  ? "Sending..."
                  : mailStatus?.type === "success"
                  ? "Sent! ✓"
                  : "Send"}
              </button>
              <textarea
                placeholder="Hey.."
                className={styles.textareaField}
                value={mailMessage}
                onChange={(e) => setMailMessage(e.target.value)}
                disabled={isSending}
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

              {CONTACT_CHANNELS.map((item) => {
                const IconComponent = item.Icon;
                const isPending = !item.url || item.url === "#";

                return (
                  <a
                    key={item.id}
                    href={item.url || "#"}
                    target={item.isExternal && !isPending ? "_blank" : undefined}
                    rel={item.isExternal && !isPending ? "noopener noreferrer" : undefined}
                    className={`${styles.socialGridCell} ${styles[item.cellClass]}`}
                    onClick={(e) => {
                      playClickSound();
                      if (isPending) {
                        e.preventDefault();
                      }
                    }}
                    aria-label={item.ariaLabel}
                    aria-disabled={isPending ? "true" : undefined}
                  >
                    <div className={styles.socialLeft}>
                      <div className={styles.socialIcon}>
                        <IconComponent />
                      </div>
                      <span className={styles.socialName}>{item.name}</span>
                    </div>
                    <svg
                      className={styles.socialArrow}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
                    </svg>
                  </a>
                );
              })}
            </div>
          </div>

        </div>

      </div>

      {/* ===== FOOTER ===== */}
      <Footer />
    </div>
  );
}
