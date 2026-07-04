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
      suppressHydrationWarning={true}
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
    <div className={styles.navOuter} suppressHydrationWarning={true}>
      {/* Drawer Backdrop Overlay */}
      <div 
        className={`${styles.drawerBackdrop} ${menuOpen ? styles.drawerBackdropOpen : ""}`}
        onClick={() => setMenuOpen(false)}
        suppressHydrationWarning={true}
      />

      {/* Drawer Panel (Slides from left) */}
      <div className={`${styles.drawerPanel} ${menuOpen ? styles.drawerPanelOpen : ""}`} suppressHydrationWarning={true}>
        <div className={styles.drawerHeader} suppressHydrationWarning={true}>
          {/* Logo */}
          <a href="/" className={styles.drawerLogo} onClick={() => setMenuOpen(false)}>
            <InlineSVG src="/A.svg" className={styles.drawerLogoImg} />
          </a>
          
          {/* Close Button */}
          <button 
            className={styles.drawerCloseBtn} 
            onClick={() => setMenuOpen(false)}
            aria-label="Close Navigation Menu"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block', color: 'var(--text-secondary)' }}>
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* Navigation Links inside Drawer */}
        <div className={styles.drawerLinks} suppressHydrationWarning={true}>
          <a href="/studio" className={getLinkClass("studio")} onClick={() => setMenuOpen(false)}>
            Studio
          </a>
          <a href="/services" className={getLinkClass("services")} onClick={() => setMenuOpen(false)}>
            Services
          </a>
          <a href="/research" className={getLinkClass("research")} onClick={() => setMenuOpen(false)}>
            Research
          </a>
          <a href="/products" className={getLinkClass("products")} onClick={() => setMenuOpen(false)}>
            Products
          </a>
          <a href="/works" className={getLinkClass("works")} onClick={() => setMenuOpen(false)}>
            Works
          </a>
          <a href="/blog" className={getLinkClass("blog")} onClick={() => setMenuOpen(false)}>
            Blog
          </a>
          <a href="/contact" className={getLinkClass("contact")} onClick={() => setMenuOpen(false)}>
            Contact
          </a>
        </div>

        {/* Theme Toggle (Centered under the links) */}
        <div className={styles.drawerThemeToggle} suppressHydrationWarning={true}>
          <ThemeToggle />
        </div>
      </div>

      {/* Main Navbar Pill */}
      <nav className={`${styles.navbar} ${menuOpen ? styles.navbarOpen : ""}`} id="navbar" suppressHydrationWarning={true}>
        <div className={styles.navContent} suppressHydrationWarning={true}>
          {/* Circular Logo */}
          <a href="/" className={styles.logo} aria-label="Aeethod Home">
            <InlineSVG src="/A.svg" className={styles.logoImg} />
          </a>

          {/* Navigation Links (Desktop) */}
          <div className={styles.navLinks} suppressHydrationWarning={true}>
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
            <div className={`${styles.hamburgerIcon} ${menuOpen ? styles.hamburgerIconOpen : ""}`} suppressHydrationWarning={true}>
              <span />
              <span />
              <span />
            </div>
          </button>

          {/* Right Area (Desktop placeholder) */}
          <div className={styles.navRight} suppressHydrationWarning={true}>
          </div>
        </div>
      </nav>
      <div className={styles.themeToggleWrapper} suppressHydrationWarning={true}>
        <ThemeToggle />
      </div>
    </div>
  );
}
