"use client";

import styles from "./HomeButton.module.css";

export default function HomeButton({ text, variant = "explore", onClick }) {
  const isThinking = variant === "thinking";
  const gradientId = isThinking ? "gradient-thinking" : "gradient-explore";
  
  const startColor = "#5A69EA";
  const endColor = isThinking ? "#B2CEFE" : "#BF8BCA";

  return (
    <div 
      className={styles.btnWrapper} 
      onClick={onClick} 
      role="button" 
      aria-label={text}
    >
      {/* Outer Border Frame (SVG) */}
      <svg
        width="222"
        height="71"
        viewBox="0 0 222 71"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={styles.buttonsSvgOutline}
      >
        <rect
          x="5.5"
          y="5.5"
          width="211"
          height="60"
          rx="12.5"
          stroke={`url(#${gradientId})`}
          strokeWidth="5"
          fill="none"
        />
        <defs>
          <radialGradient
            id={gradientId}
            cx="0"
            cy="0"
            r="1"
            gradientUnits="userSpaceOnUse"
            gradientTransform="translate(111 35.5) rotate(90) scale(27.5 103)"
          >
            <stop stopColor={startColor} />
            <stop offset="1" stopColor={endColor} />
          </radialGradient>
        </defs>
      </svg>

      {/* Inner Neumorphic Plate (HTML + CSS) */}
      <div className={styles.innerPlate}>
        <span className={styles.innerText}>{text}</span>
        {/* Arrow Icon SVG */}
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={styles.arrowIcon}
        >
          <path
            d="M7 17L17 7M17 7V17M17 7H7"
            stroke={`url(#${gradientId}-arrow)`}
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <defs>
            <radialGradient
              id={`${gradientId}-arrow`}
              cx="0"
              cy="0"
              r="1"
              gradientUnits="userSpaceOnUse"
              gradientTransform="translate(12 12) rotate(90) scale(12)"
            >
              <stop stopColor={startColor} />
              <stop offset="1" stopColor={endColor} />
            </radialGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
}
