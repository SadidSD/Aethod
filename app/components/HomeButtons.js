"use client";

import styles from "./HomeButtons.module.css";

export default function HomeButtons({ onExploreClick, onThinkingClick }) {
  return (
    <div className={styles.btnBar}>
      <svg
        width="452"
        height="71"
        viewBox="0 0 452 71"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={styles.buttonsSvg}
      >
        {/* Explore Button Group */}
        <g
          filter="url(#filter0_ddiiii_1097_2805)"
          onClick={onExploreClick}
          className={styles.btnGroup}
          role="button"
          aria-label="Explore"
        >
          <rect x="8" y="8" width="206" height="55" rx="10" fill="#ECECEC" />
          <rect
            x="5.5"
            y="5.5"
            width="211"
            height="60"
            rx="12.5"
            stroke="url(#paint0_radial_1097_2805)"
            strokeWidth="5"
            fill="none"
          />
          <text
            x="60"
            y="42"
            fontFamily="'Sora', sans-serif"
            fontWeight="300"
            fontSize="20"
            fill="#404040"
            className={styles.btnText}
          >
            Explore
          </text>
          <g transform="translate(142, 23)">
            <path
              d="M7 17L17 7M17 17V7H7"
              stroke="url(#paint0_radial_1097_2805)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
        </g>

        {/* Thinking Button Group */}
        <g
          filter="url(#filter1_ddiiii_1097_2805)"
          onClick={onThinkingClick}
          className={styles.btnGroup}
          role="button"
          aria-label="Thinking"
        >
          <rect x="239" y="8" width="205" height="55" rx="10" fill="#ECECEC" />
          <rect
            x="236.5"
            y="5.5"
            width="210"
            height="60"
            rx="12.5"
            stroke="url(#paint1_radial_thinking_arrow)"
            strokeWidth="5"
            fill="none"
          />
          <text
            x="291"
            y="42"
            fontFamily="'Sora', sans-serif"
            fontWeight="300"
            fontSize="20"
            fill="#404040"
            className={styles.btnText}
          >
            Thinking
          </text>
          <g transform="translate(381, 23)">
            <path
              d="M7 17L17 7M17 17V7H7"
              stroke="url(#paint1_radial_thinking_arrow)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
        </g>

        <defs>
          {/* Filter for Explore */}
          <filter
            id="filter0_ddiiii_1097_2805"
            x="0"
            y="0"
            width="222"
            height="71"
            filterUnits="userSpaceOnUse"
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
            />
            <feBlend
              mode="normal"
              in2="effect5_innerShadow_1097_2805"
              result="effect6_innerShadow_1097_2805"
            />
          </filter>

          {/* Filter for Thinking */}
          <filter
            id="filter1_ddiiii_1097_2805"
            x="231"
            y="0"
            width="221"
            height="71"
            filterUnits="userSpaceOnUse"
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
            />
            <feBlend
              mode="normal"
              in2="effect5_innerShadow_1097_2805"
              result="effect6_innerShadow_1097_2805"
            />
          </filter>

          <radialGradient
            id="paint0_radial_1097_2805"
            cx="0"
            cy="0"
            r="1"
            gradientUnits="userSpaceOnUse"
            gradientTransform="translate(111 35.5) rotate(90) scale(27.5 103)"
          >
            <stop stopColor="#5A69EA" />
            <stop offset="1" stopColor="#BF8BCA" />
          </radialGradient>
          <radialGradient
            id="paint1_radial_thinking_arrow"
            cx="0"
            cy="0"
            r="1"
            gradientUnits="userSpaceOnUse"
            gradientTransform="translate(341.5 35.5) rotate(90) scale(27.5 102.5)"
          >
            <stop stopColor="#5A69EA" />
            <stop offset="1" stopColor="#B2CEFE" />
          </radialGradient>
        </defs>
      </svg>
    </div>
  );
}
