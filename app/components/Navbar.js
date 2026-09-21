"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
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
  const pathname = usePathname();
  const isContactPage = pathname === "/contact" || activePage === "contact";
  const isHomePage = pathname === "/" || activePage === "home";
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
    const isMatch =
      activePage === pageName ||
      (pageName === "works" && (activePage === "work" || activePage === "works")) ||
      (pageName === "studio" && (activePage === "studio" || activePage === "about" || activePage === "about-the-studio"));
    return isMatch
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
          <a href="/works" className={getLinkClass("works")} onClick={() => setMenuOpen(false)}>
            Work
          </a>
          <a href="/services" className={getLinkClass("services")} onClick={() => setMenuOpen(false)}>
            Services
          </a>
          <a href="/products" className={getLinkClass("products")} onClick={() => setMenuOpen(false)}>
            Products
          </a>
          <a href="/research" className={getLinkClass("research")} onClick={() => setMenuOpen(false)}>
            Research
          </a>
          <a href="/studio" className={getLinkClass("studio")} onClick={() => setMenuOpen(false)}>
            About the Studio
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
          {/* Circular Logo (Route-Aware: Curved on Home, Popped on other pages) */}
          <div className={styles.logoWrapper} suppressHydrationWarning={true}>
            <a
              href="/"
              className={`${styles.logoBtn} ${isHomePage ? styles.logoBtnCurved : styles.logoBtnPopped}`}
              onClick={(e) => {
                if (isHomePage) {
                  e.preventDefault();
                }
              }}
              aria-label="Aeethod Home"
              aria-current={isHomePage ? "page" : undefined}
              suppressHydrationWarning={true}
            >
              <svg
                width="28"
                height="28"
                viewBox="0 0 268 268"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className={styles.logoMark}
              >
                <path
                  d="M39.4444 196.903L3 262C3 262 44.1852 230.036 52.7778 225.359C61.3704 220.681 68.4864 214.519 80.3333 210.936C94.8183 206.555 104.346 205.92 119.444 208.208C138.419 211.083 152.926 222.11 163 228.477C163 226.528 147 209.377 147 209.377C142.556 203.92 117.667 178.973 103.444 173.515C89.2222 168.058 78.1111 170.007 67.8888 172.346C59.711 174.217 45.5185 189.497 39.4444 196.903Z"
                  fill="currentColor"
                />
                <path
                  d="M132.607 3L68.678 132.197C68.678 132.197 47.8216 170.088 59.61 152.74C71.3984 135.392 97.0415 115.424 114.471 119.871C122.395 121.892 134.344 130.586 138.501 141.784C143.489 144.523 173.609 212.419 186.109 233.545C186.109 233.545 209.585 269.196 265 264.589L132.607 3Z"
                  fill="currentColor"
                />
              </svg>
            </a>
          </div>

          {/* Navigation Links (Desktop) */}
          <div className={styles.navLinks} suppressHydrationWarning={true}>
            <a href="/works" className={getLinkClass("works")}>
              Work
            </a>
            <a href="/services" className={getLinkClass("services")}>
              Services
            </a>
            <a href="/products" className={getLinkClass("products")}>
              Products
            </a>
            <a href="/research" className={getLinkClass("research")}>
              Research
            </a>
            <a href="/studio" className={getLinkClass("studio")}>
              About the Studio
            </a>
            <a href="/blog" className={getLinkClass("blog")}>
              Blog
            </a>
          </div>

          {/* Right Area: Contact Button & Hamburger Toggle */}
          <div className={styles.navRight} suppressHydrationWarning={true}>
            {/* Contact Circle Button (Route-Aware: Popped / Curved Downward) */}
            <a
              href="/contact"
              className={`${styles.contactBtn} ${isContactPage ? styles.contactBtnCurved : styles.contactBtnPopped}`}
              onClick={(e) => {
                if (isContactPage) {
                  e.preventDefault();
                }
              }}
              aria-label="Contact Us"
              aria-current={isContactPage ? "page" : undefined}
              suppressHydrationWarning={true}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className={styles.contactIcon}
              >
                <path
                  d="M15.05 5A5 5 0 0 1 19 8.95M15.05 1A9 9 0 0 1 23 8.94"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>

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
          </div>
        </div>
      </nav>
      <div className={styles.themeToggleWrapper} suppressHydrationWarning={true}>
        <ThemeToggle />
      </div>
    </div>
  );
}
