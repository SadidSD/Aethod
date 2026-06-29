"use client";

import styles from "./HomeButtons.module.css";

export default function HomeButtons({ onExploreClick, onThinkingClick }) {
  return (
    <div className={styles.container}>
      {/* Explore Button */}
      <div 
        className={`${styles.outerLayer} ${styles.exploreBg} ${styles.exploreOuter}`} 
        onClick={onExploreClick}
        role="button"
        aria-label="Explore"
      >
        <div className={`${styles.innerLayer} ${styles.exploreInner}`}>
          <span className={styles.btnText}>Explore</span>
          <svg 
            width="12" 
            height="12" 
            viewBox="0 0 24 24" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            className={styles.arrowIcon}
          >
            <path 
              d="M7 17L17 7M17 17V7H7" 
              stroke="url(#paint0_radial_1097_2805)" 
              strokeWidth="3.5" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
            />
          </svg>
        </div>
      </div>

      {/* Thinking Button */}
      <div 
        className={`${styles.outerLayer} ${styles.thinkingBg} ${styles.thinkingOuter}`} 
        onClick={onThinkingClick}
        role="button"
        aria-label="Thinking"
      >
        <div className={`${styles.innerLayer} ${styles.thinkingInner}`}>
          <span className={styles.btnText}>Thinking</span>
          <svg 
            width="12" 
            height="12" 
            viewBox="0 0 24 24" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            className={styles.arrowIcon}
          >
            <path 
              d="M7 17L17 7M17 17V7H7" 
              stroke="url(#paint1_radial_thinking_arrow)" 
              strokeWidth="3.5" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
            />
          </svg>
        </div>
      </div>

      {/* Embedded SVG Defs for radial gradient arrow strokes */}
      <svg style={{ position: "absolute", width: 0, height: 0 }}>
        <defs>
          <radialGradient
            id="paint0_radial_1097_2805"
            cx="50%"
            cy="50%"
            r="50%"
            gradientUnits="userSpaceOnUse"
            gradientTransform="translate(12 12) rotate(90) scale(12)"
          >
            <stop stopColor="#5A69EA" />
            <stop offset="1" stopColor="#BF8BCA" />
          </radialGradient>
          <radialGradient
            id="paint1_radial_thinking_arrow"
            cx="50%"
            cy="50%"
            r="50%"
            gradientUnits="userSpaceOnUse"
            gradientTransform="translate(12 12) rotate(90) scale(12)"
          >
            <stop stopColor="#5A69EA" />
            <stop offset="1" stopColor="#B2CEFE" />
          </radialGradient>
        </defs>
      </svg>
    </div>
  );
}
