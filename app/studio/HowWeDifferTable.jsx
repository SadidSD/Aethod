"use client";

import { useRef, useEffect, useState } from "react";
import styles from "./page.module.css";

const rowsData = [
  { others: ["Deliver websites"], aeethod: "Architect systems", height: 93 },
  { others: ["Chase trends"], aeethod: "Study patterns", height: 85 },
  { others: ["Fragmented tools"], aeethod: "Unified infrastructure", height: 87 },
  { others: ["Scale fast"], aeethod: "Build to last", height: 62 },
  { others: ["Many clients,", "thin work"], aeethod: "Few clients, deep work", height: 85 },
  { others: ["Start with", "solutions"], aeethod: "Start with understanding", height: 152.5 }
];

export default function HowWeDifferTable() {
  const containerRef = useRef(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className={`${styles.differCard} ${isInView ? styles.inView : ""}`}>
      {/* Header Area Spacer */}
      <div className={styles.headerArea} />

      {/* Title Row */}
      <div className={styles.titleRow}>
        <div className={styles.colLeft}>
          <span className={styles.headerText}>Others</span>
        </div>
        <div className={styles.colRight}>
          <span className={styles.headerText} style={{ color: "var(--text-primary)" }}>Aeethod</span>
        </div>
      </div>

      {/* Rows */}
      {rowsData.map((row, idx) => {
        const rowDelay = `${(idx * 1.0).toFixed(1)}s`;
        const fadeDelay = `${(idx * 1.0 + 0.5).toFixed(1)}s`;

        return (
          <div key={idx} className={styles.row} style={{ height: row.height }}>
            {/* Left Column */}
            <div className={styles.colLeft}>
              <div className={styles.textLeftContainer}>
                {row.others.map((part, pIdx) => (
                  <div key={pIdx} className={styles.textLeftPart}>
                    <span>{part}</span>
                    {/* Strikethrough Solid Line (fades in to stay) */}
                    <span
                      className={styles.strikethroughSolid}
                      style={isInView ? { animationDelay: fadeDelay } : undefined}
                    />
                    {/* Strikethrough Gradient Line (draws first, then fades out) */}
                    <span
                      className={styles.strikethroughGradient}
                      style={isInView ? { animationDelay: rowDelay } : undefined}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column */}
            <div className={styles.colRight}>
              <div className={styles.textRight}>
                {/* Normal Text (fades out) */}
                <span
                  className={styles.textRightNormal}
                  style={isInView ? { animationDelay: fadeDelay } : undefined}
                >
                  {row.aeethod}
                </span>
                {/* Gradient Text Overlay (fades in and stays) */}
                <span
                  className={styles.textRightGradient}
                  style={isInView ? { animationDelay: fadeDelay } : undefined}
                >
                  {row.aeethod}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
