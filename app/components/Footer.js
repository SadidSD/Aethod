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
        <InlineSVG src="/footer_custom.svg" className={styles.footerSvg} />
      </div>
    </footer>
  );
}
