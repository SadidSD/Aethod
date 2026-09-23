"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
      suppressHydrationWarning={true}
    />
  );
}

export default function Footer() {
  const router = useRouter();

  const handleFooterClick = (e) => {
    const link = e.target.closest("a");
    if (!link) return;
    const href = link.getAttribute("href");
    if (!href) return;

    // External link or mailto
    if (href.startsWith("http://") || href.startsWith("https://") || href.startsWith("mailto:")) {
      return;
    }

    // Internal client-side route
    if (href.startsWith("/")) {
      e.preventDefault();
      router.push(href);
    }
  };

  return (
    <footer 
      className={styles.footerSection} 
      id="footer-section" 
      onClick={handleFooterClick}
      suppressHydrationWarning={true}
    >
      <div className={styles.footerAlignContainer} suppressHydrationWarning={true}>
        {/* Desktop SVG Footer */}
        <InlineSVG src="/footer.svg" className={styles.footerSvg} />
        
        {/* Mobile HTML Footer */}
        <div className={styles.mobileFooterContent} suppressHydrationWarning={true}>
          <div className={styles.mobileFooterCard} suppressHydrationWarning={true}>
            <div className={styles.mobileFooterTop} suppressHydrationWarning={true}>
              <a href="/" className={styles.mobileLogoLink}>
                <InlineSVG src="/A.svg" className={styles.mobileLogoImg} />
                <span className={styles.mobileLogoText}>Aeethod</span>
              </a>
              <p className={styles.mobileSubtitle}>
                We build the intelligence layer that makes human decisions matter more, not less.
              </p>
            </div>

            
            <div className={styles.mobileFooterLinks} suppressHydrationWarning={true}>
              <a href="/studio" className={styles.mobileLink}>Studio</a>
              <a href="/services" className={styles.mobileLink}>System</a>
              <a href="/research" className={styles.mobileLink}>Research</a>
              <a href="/products" className={styles.mobileLink}>Products</a>
              <a href="/blog" className={styles.mobileLink}>Journals</a>
              <a href="/contact" className={styles.mobileLink}>Contact</a>
            </div>
            
            <div className={styles.mobileFooterSocials} suppressHydrationWarning={true}>
              <a href="https://www.facebook.com/profile.php?id=61594266838782" target="_blank" rel="noopener noreferrer" className={styles.mobileSocialTile} aria-label="Facebook">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className={styles.mobileSocialIcon}>
                  <path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.704 0-1.428.149-1.83.433-.494.349-.693.896-.693 1.895v1.652h4.526l-.602 3.667h-3.924v7.98H9.101z" />
                </svg>
              </a>
              <a href="https://www.instagram.com/sadidbinhasan?stkn=MWVsMWdnbnZkMGM0cw==" target="_blank" rel="noopener noreferrer" className={styles.mobileSocialTile} aria-label="Instagram">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className={styles.mobileSocialIcon}>
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              <a href="mailto:sadidbinhasan3@gmail.com" className={styles.mobileSocialTile} aria-label="Email">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className={styles.mobileSocialIcon}>
                  <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.272H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z" />
                </svg>
              </a>
            </div>

            <div className={styles.mobileCopyrightPill} suppressHydrationWarning={true}>
              @2026 Aeethod. All rights reserved.
            </div>
          </div>
        </div>

        <div className={styles.copyrightText} suppressHydrationWarning={true}>
          @2026 Aeethod. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
