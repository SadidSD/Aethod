"use client";

import { useState, useEffect } from "react";
import styles from "./Footer.module.css";

function InlineSVG({ src, className, style }) {
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
      style={style}
      dangerouslySetInnerHTML={{ __html: svgContent }}
    />
  );
}

export default function Footer() {
  return (
    <footer className={styles.footerSection} id="footer-section">
      <div className={styles.footerAlignContainer}>
        {/* Desktop SVG Footer */}
        <InlineSVG src="/footer.svg" className={styles.footerSvg} />
        
        {/* Mobile HTML Footer */}
        <div className={styles.mobileFooterContent}>
          <div className={styles.mobileFooterCard}>
            <div className={styles.mobileFooterTop}>
              <a href="/" className={styles.mobileLogoLink}>
                <InlineSVG src="/A.svg" className={styles.mobileLogoImg} />
                <span className={styles.mobileLogoText}>Aeethod</span>
              </a>
              <p className={styles.mobileSubtitle}>
                We build the intelligence layer that makes human decisions matter more, not less.
              </p>
            </div>

            
            <div className={styles.mobileFooterLinks}>
              <a href="/studio" className={styles.mobileLink}>Studio</a>
              <a href="/services" className={styles.mobileLink}>System</a>
              <a href="/research" className={styles.mobileLink}>Research</a>
              <a href="/products" className={styles.mobileLink}>Products</a>
              <a href="/blog" className={styles.mobileLink}>Journals</a>
              <a href="/contact" className={styles.mobileLink}>Contract</a>
            </div>
            
            <div className={styles.mobileFooterSocials}>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className={styles.mobileSocialTile} aria-label="LinkedIn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.mobileSocialIcon}><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className={styles.mobileSocialTile} aria-label="Instagram">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.mobileSocialIcon}>
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className={styles.mobileSocialTile} aria-label="GitHub">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.mobileSocialIcon}><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
              </a>
            </div>

            <div className={styles.mobileCopyrightPill}>
              @2026 Aeethod. All rights reserved.
            </div>
          </div>
        </div>

        <div className={styles.copyrightText}>
          @2026 Aeethod. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
