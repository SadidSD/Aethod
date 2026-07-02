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
              <a href="/services" className={styles.mobileLink}>Services</a>
              <a href="/research" className={styles.mobileLink}>Research</a>
              <a href="/products" className={styles.mobileLink}>Products</a>
              <a href="/works" className={styles.mobileLink}>Works</a>
              <a href="/blog" className={styles.mobileLink}>Blog</a>
              <a href="/contact" className={styles.mobileLink}>Contact</a>
            </div>
            
            <div className={styles.mobileFooterSocials}>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className={styles.mobileSocialTile} aria-label="LinkedIn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.mobileSocialIcon}><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
              </a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className={styles.mobileSocialTile} aria-label="GitHub">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.mobileSocialIcon}><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className={styles.mobileSocialTile} aria-label="YouTube">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.mobileSocialIcon}><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>
              </a>
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
