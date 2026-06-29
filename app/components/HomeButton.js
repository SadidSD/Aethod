"use client";

import styles from "./HomeButton.module.css";

export default function HomeButton({ text, variant = "explore", onClick }) {
  const isThinking = variant === "thinking";
  const filterId = isThinking ? "filter-thinking" : "filter-explore";
  const gradientId = isThinking ? "gradient-thinking" : "gradient-explore";
  
  const startColor = "#5A69EA";
  const endColor = isThinking ? "#B2CEFE" : "#BF8BCA";

  return (
    <div className={styles.btnWrapper}>
      <svg
        width="222"
        height="71"
        viewBox="0 0 222 71"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={styles.buttonsSvgSingle}
        onClick={onClick}
        style={{ cursor: "pointer" }}
        role="button"
        aria-label={text}
      >
        <g className={styles.buttonGroup}>
          {/* Outer Border Rect */}
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
          {/* Inner Content Plate */}
          <g className={styles.buttonInner}>
            <rect
              className={styles.buttonBg}
              filter={`url(#${filterId})`}
              x="8"
              y="8"
              width="106"
              height="55"
              rx="10"
              fill="var(--bg-primary)"
            />
            <text
              x={isThinking ? "15" : "20"}
              y="42"
              fontFamily="'Sora', sans-serif"
              fontWeight="300"
              fontSize="20"
              fill="#404040"
            >
              {text}
            </text>
            <g transform={isThinking ? "translate(94, 23)" : "translate(84, 23)"}>
              <path
                d="M7 17L17 7M17 17V7H7"
                stroke={`url(#${gradientId})`}
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>
          </g>
        </g>
        <defs>
          <filter
            id={filterId}
            x="-20%"
            y="-20%"
            width="140%"
            height="140%"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            />
            <feOffset dx="-1" dy="-1" />
            <feGaussianBlur stdDeviation="1" />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0.568627 0 0 0 0 0.568627 0 0 0 0 0.560784 0 0 0 0.5 0"
              result="hardAlpha"
            />
            <feBlend
              mode="normal"
              in2="BackgroundImageFix"
              result="effect1_dropShadow_1097_2805"
            />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            />
            <feOffset dx="1" dy="1" />
            <feGaussianBlur stdDeviation="1" />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.3 0"
              result="hardAlpha"
            />
            <feBlend
              mode="normal"
              in2="effect1_dropShadow_1097_2805"
              result="effect2_dropShadow_1097_2805"
            />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="effect2_dropShadow_1097_2805"
              result="shape"
            />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            />
            <feOffset dx="2" dy="2" />
            <feGaussianBlur stdDeviation="2.5" />
            <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0.568627 0 0 0 0 0.568627 0 0 0 0 0.560784 0 0 0 0.9 0"
              result="hardAlpha"
            />
            <feBlend
              mode="normal"
              in2="shape"
              result="effect3_innerShadow_1097_2805"
            />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            />
            <feOffset dx="-2" dy="-2" />
            <feGaussianBlur stdDeviation="2" />
            <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.9 0"
              result="hardAlpha"
            />
            <feBlend
              mode="normal"
              in2="effect3_innerShadow_1097_2805"
              result="effect4_innerShadow_1097_2805"
            />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            />
            <feOffset dx="2" dy="-2" />
            <feGaussianBlur stdDeviation="2" />
            <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0.568627 0 0 0 0 0.568627 0 0 0 0 0.560784 0 0 0 0.2 0"
              result="hardAlpha"
            />
            <feBlend
              mode="normal"
              in2="effect4_innerShadow_1097_2805"
              result="effect5_innerShadow_1097_2805"
            />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            />
            <feOffset dx="-2" dy="2" />
            <feGaussianBlur stdDeviation="2" />
            <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0.568627 0 0 0 0 0.568627 0 0 0 0 0.560784 0 0 0 0.2 0"
              result="hardAlpha"
            />
            <feBlend
              mode="normal"
              in2="effect5_innerShadow_1097_2805"
              result="effect6_innerShadow_1097_2805"
            />
          </filter>
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
    </div>
  );
}
