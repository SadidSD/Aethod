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
        let cleanText = text.replace(/<\?xml[^>]*\?>/i, "");
        
        // Filter out copyright vector paths from the fill="#404040" path
        cleanText = cleanText.replace(/<path\s+([^>]*fill="#404040"[^>]*d="([^"]+)"[^>]*|[^>]*d="([^"]+)"[^>]*fill="#404040"[^>]*|[^>]*fill="#404040"[^>]*d="([^"]+)"[^>]*)/gi, (match) => {
          const dMatch = match.match(/d="([^"]+)"/i);
          if (!dMatch) return match;
          const dVal = dMatch[1];
          
          // Split subpaths by M/m commands
          const subpaths = dVal.split(/(?=[Mm])/);
          const filteredSubpaths = subpaths.filter(sub => {
            const coords = sub.match(/[-+]?[0-9]*\.?[0-9]+/g);
            if (!coords) return true;
            for (let i = 0; i < coords.length; i += 2) {
              const xVal = parseFloat(coords[i]);
              if (xVal > 900) return false;
            }
            return true;
          });
          
          const newD = filteredSubpaths.join("");
          return match.replace(/d="([^"]+)"/i, `d="${newD}"`);
        });

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
        <div className={styles.copyrightText}>
          @2026 Aeethod. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
