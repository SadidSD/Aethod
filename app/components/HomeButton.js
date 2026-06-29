"use client";

import styles from "./HomeButton.module.css";

export default function HomeButton({ variant = "purple", text, onClick, ...props }) {
  const isPurple = variant === "purple";
  const bgColor = isPurple ? "#BF8BCA" : "#B2CEFE";
  const accentColor = isPurple ? "#BF8BCA" : "#B2CEFE";
  const showArrow = text.toLowerCase() !== "thinking";

  return (
    <button
      className={styles.btnWrapper}
      onClick={onClick}
      {...props}
    >
      {/* Background Layer with neomorphic shadows */}
      <div
        className={styles.bgLayer}
        style={{ backgroundColor: bgColor }}
      />

      {/* White Inner Box Layer - Moves on click */}
      <div className={styles.innerLayer}>
        <div className={styles.contentRow} style={{ justifyContent: showArrow ? "space-between" : "center" }}>
          <span className={styles.btnText}>{text}</span>
          {/* Arrow Icon with dynamic accent color */}
          {showArrow && (
            <div 
              className={styles.arrowContainer}
              style={{ color: accentColor }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          )}
        </div>
      </div>
    </button>
  );
}
