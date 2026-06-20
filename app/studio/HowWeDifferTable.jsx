"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import styles from "./page.module.css";

const rowsData = [
  { others: "Deliver features", aeethod: "Design systems", height: 93 },
  { others: "Chase trends", aeethod: "Study patterns", height: 85 },
  { others: "Sell automation", aeethod: "Build intelligence", height: 87 },
  { others: "Scale fast", aeethod: "Build to last", height: 62 },
  { others: "Many clients, thin work", aeethod: "Few clients, deep work", height: 85 },
  { others: "Start with solutions", aeethod: "Start with understanding", height: 152.5 }
];

export default function HowWeDifferTable() {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.15 });

  return (
    <div ref={containerRef} className={styles.differCard}>
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
        const rowDelay = idx * 1.0; // Stagger each row by 1.0s to match the crossing timeline

        return (
          <div key={idx} className={styles.row} style={{ height: row.height }}>
            {/* Left Column */}
            <div className={styles.colLeft}>
              <span className={styles.textLeft}>
                {row.others}
                {/* Strikethrough Solid Line (fades in to stay) */}
                <motion.div
                  className={styles.strikethroughSolid}
                  initial={{ opacity: 0 }}
                  animate={isInView ? { opacity: 0.5 } : {}}
                  transition={{
                    delay: rowDelay + 0.5, // Fades in as gradient line transitions out
                    duration: 0.5,
                    ease: "easeInOut"
                  }}
                />
                {/* Strikethrough Gradient Line (draws first, then fades out) */}
                <motion.div
                  className={styles.strikethroughGradient}
                  initial={{ scaleX: 0, opacity: 1 }}
                  animate={
                    isInView
                      ? {
                          scaleX: [0, 1, 1],
                          opacity: [1, 1, 0]
                        }
                      : {}
                  }
                  transition={{
                    delay: rowDelay,
                    times: [0, 0.5, 1], // Draws in 0.5s, stays, fades out in next 0.5s
                    duration: 1.0,
                    ease: "easeInOut"
                  }}
                  style={{ originX: 0 }}
                />
              </span>
            </div>

            {/* Right Column */}
            <div className={styles.colRight}>
              <span className={styles.textRight}>
                {/* Normal Text (fades out) */}
                <motion.span
                  className={styles.textRightNormal}
                  initial={{ opacity: 1 }}
                  animate={isInView ? { opacity: 0 } : { opacity: 1 }}
                  transition={{
                    delay: rowDelay + 0.5, // Starts fading right after horizontal line crosses
                    duration: 0.3,
                    ease: "easeInOut"
                  }}
                >
                  {row.aeethod}
                </motion.span>
                {/* Gradient Text Overlay (fades in and stays) */}
                <motion.span
                  className={styles.textRightGradient}
                  initial={{ opacity: 0 }}
                  animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                  transition={{
                    delay: rowDelay + 0.5, // starts as strikethrough finishes drawing
                    duration: 0.3,
                    ease: "easeInOut"
                  }}
                >
                  {row.aeethod}
                </motion.span>
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
