"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
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
          <Link href="/works" className={getLinkClass("works")} onClick={() => setMenuOpen(false)}>
            Work
          </Link>
          <Link href="/services" className={getLinkClass("services")} onClick={() => setMenuOpen(false)}>
            Services
          </Link>
          <Link href="/products" className={getLinkClass("products")} onClick={() => setMenuOpen(false)}>
            Products
          </Link>
          <Link href="/research" className={getLinkClass("research")} onClick={() => setMenuOpen(false)}>
            Research
          </Link>
          <Link href="/studio" className={getLinkClass("studio")} onClick={() => setMenuOpen(false)}>
            About the Studio
          </Link>
          <Link href="/blog" className={getLinkClass("blog")} onClick={() => setMenuOpen(false)}>
            Blog
          </Link>
          <Link href="/contact" className={getLinkClass("contact")} onClick={() => setMenuOpen(false)}>
            Contact
          </Link>
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
            <Link
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
            </Link>
          </div>

          {/* Navigation Links (Desktop) */}
          <div className={styles.navLinks} suppressHydrationWarning={true}>
            <Link href="/works" className={getLinkClass("works")}>
              Work
            </Link>
            <Link href="/services" className={getLinkClass("services")}>
              Services
            </Link>
            <Link href="/products" className={getLinkClass("products")}>
              Products
            </Link>
            <Link href="/research" className={getLinkClass("research")}>
              Research
            </Link>
            <Link href="/studio" className={getLinkClass("studio")}>
              About the Studio
            </Link>
            <Link href="/blog" className={getLinkClass("blog")}>
              Blog
            </Link>
          </div>

          {/* Right Area: Contact Button & Hamburger Toggle */}
          <div className={styles.navRight} suppressHydrationWarning={true}>
            {/* Contact Circle Button (Route-Aware: Popped / Curved Downward) */}
            <Link
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
              <div className={styles.contactInner} suppressHydrationWarning={true}>
                <svg
                  width="18"
                  height="18"
                  viewBox="10 18 165 165"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                  className={styles.contactIcon}
                >
                  <path
                    d="M 103.235 22.036 C 100.159 23.273, 98.720 27.291, 100.195 30.528 C 101.443 33.267, 101.529 33.295, 114 34.881 C 131.068 37.053, 147.718 48.557, 154.895 63.135 C 158.459 70.374, 160.970 78.872, 160.988 83.750 C 161.011 90.100, 167.761 93.239, 172.088 88.912 C 173.933 87.067, 174.096 86.108, 173.486 80.662 C 170.988 58.340, 156.479 38.397, 135.500 28.450 C 124.141 23.064, 108.443 19.944, 103.235 22.036 M 36.247 30.495 C 26.436 32.274, 19.319 36.397, 15.512 42.509 C 10.150 51.115, 10.830 66.040, 17.518 86.569 C 28.474 120.198, 53.212 149.234, 85.128 165.924 C 103.852 175.715, 124.974 181.185, 135.567 178.986 C 146.791 176.656, 154.152 167.149, 157.585 150.550 C 160.173 138.036, 158.153 129.507, 151.379 124.340 C 147.742 121.566, 125.404 114.231, 117.757 113.300 C 112.114 112.614, 105.461 114.816, 101.976 118.525 C 100.698 119.886, 98.930 121, 98.049 121 C 95.073 121, 80.559 108.462, 74.750 100.874 C 71.588 96.742, 69 92.820, 69 92.157 C 69 91.494, 70.560 88.684, 72.467 85.912 C 77.619 78.421, 77.696 76.359, 73.447 59.384 C 69.153 42.226, 67.451 38.341, 62.408 34.185 C 56.199 29.067, 49.410 28.109, 36.247 30.495 M 41.992 42.056 C 30.007 43.424, 25.116 46.788, 24.276 54.240 C 23.206 63.740, 28.385 83.936, 35.578 98.314 C 50.933 129.002, 78.024 152.490, 110 162.836 C 129.130 169.025, 136.170 168.854, 140.723 162.088 C 143.412 158.092, 145.798 150.568, 146.636 143.440 C 147.545 135.702, 145.367 133.808, 130.588 129.485 C 114.978 124.918, 113.083 124.967, 106.643 130.099 C 102.090 133.728, 101.030 134.146, 97.401 133.739 C 86.023 132.464, 58.719 105.681, 56.446 93.565 C 55.614 89.129, 56.399 86.909, 60.560 81.928 C 62.561 79.533, 64 76.712, 64 75.185 C 64 70.637, 57.893 47.090, 56.159 44.949 C 54.020 42.308, 48.914 41.266, 41.992 42.056 M 102.120 50.702 C 99.408 52.897, 98.954 57.382, 101.214 59.642 C 102.019 60.448, 105.470 61.501, 108.882 61.983 C 121.645 63.787, 130.335 72.356, 132.467 85.238 C 133.107 89.105, 135.234 91, 138.934 91 C 141.775 91, 145 87.527, 145 84.468 C 145 80.481, 141.149 70.077, 137.954 65.434 C 132.340 57.273, 120.775 50.696, 109.763 49.402 C 105.445 48.895, 104.061 49.130, 102.120 50.702"
                    fillRule="evenodd"
                    clipRule="evenodd"
                  />
                </svg>
                <span className={styles.contactText}>Contact</span>
              </div>
            </Link>

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
