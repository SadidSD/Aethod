"use client";

import { useEffect, useState } from "react";
import { useChat } from "../context/ChatContext";
import styles from "./Navbar.module.css";

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
      <nav className={styles.navbar} id="navbar">
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
            <a href="/journals" className={getLinkClass("works")}>
              Works
            </a>
            <a href="/blog" className={getLinkClass("blog")}>
              Blog
            </a>
            <a href="/contact" className={getLinkClass("contact")}>
              Contact
            </a>
          </div>

          {/* Right Area: Phone button */}
          <div className={styles.navRight}>

            {/* Telephone Call Circle Button */}
            {/* <a
              href="/contact"
              className={styles.callButton}
              aria-label="Call Support"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className={styles.callIcon}
              >
                <path
                  d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"
                  stroke="#404040"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a> */}
          </div>
        </div>
      </nav>
    </div>
  );
}
