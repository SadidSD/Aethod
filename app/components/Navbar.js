"use client";

import { useEffect, useState } from "react";
import { useChat } from "../context/ChatContext";
import styles from "./Navbar.module.css";
import ThemeToggle from "./ThemeToggle";

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

export default function Navbar({ activePage }) {
  const { chatQuery, setChatQuery, openChat, sendMessage } = useChat();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleFocus = () => {
    openChat();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && chatQuery.trim()) {
      sendMessage(chatQuery);
      openChat();
    }
  };

  const getLinkClass = (pageName) => {
    return activePage === pageName
      ? `${styles.navLink} ${styles.activeNavLink}`
      : styles.navLink;
  };

  return (
    <div className={styles.navOuter}>
      <nav className={`${styles.navbar} ${menuOpen ? styles.navbarOpen : ""}`} id="navbar">
        <div className={styles.navContent}>
          {/* Circular Logo */}
          <a href="/" className={styles.logo} aria-label="Aeethod Home">
            <InlineSVG src="/A.svg" className={styles.logoImg} />
          </a>

          {/* Navigation Links */}
          <div className={styles.navLinks}>
            <a href="/studio" className={getLinkClass("studio")}>
              Studio
            </a>
            <a href="/services" className={getLinkClass("services")}>
              Services
            </a>
            <a href="/research" className={getLinkClass("research")}>
              Research
            </a>
            <a href="/products" className={getLinkClass("products")}>
              Products
            </a>
            <a href="/works" className={getLinkClass("works")}>
              Works
            </a>
            <a href="/blog" className={getLinkClass("blog")}>
              Blog
            </a>
            <a href="/contact" className={getLinkClass("contact")}>
              Contact
            </a>
          </div>

          {/* Hamburger Menu Toggle (Mobile Only) */}
          <button 
            className={styles.hamburgerBtn} 
            onClick={() => setMenuOpen(!menuOpen)}
            aria-expanded={menuOpen}
            aria-label="Toggle Navigation Menu"
          >
            <div className={`${styles.hamburgerIcon} ${menuOpen ? styles.hamburgerIconOpen : ""}`}>
              <span />
              <span />
              <span />
            </div>
          </button>

          {/* Right Area: Phone button & Theme Toggle */}
          <div className={styles.navRight}>
          </div>
        </div>
      </nav>
      <div className={styles.themeToggleWrapper}>
        <ThemeToggle />
      </div>
    </div>
  );
}
