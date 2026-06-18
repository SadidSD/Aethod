"use client";

import React from "react";

export default function LargeLogo({ className }) {
  return (
    <div className={className} style={{ display: "flex", justifyContent: "center", alignItems: "center", position: "relative" }}>
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 350 350"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ filter: "drop-shadow(0 20px 30px rgba(0, 0, 0, 0.08))" }}
      >
        <defs>
          {/* Main glassmorphic background gradient */}
          <linearGradient id="glassGrad" x1="50" y1="20" x2="300" y2="330" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#C4B5FD" stopOpacity="0.4" />
            <stop offset="30%" stopColor="#93C5FD" stopOpacity="0.65" />
            <stop offset="70%" stopColor="#60A5FA" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.4" />
          </linearGradient>

          {/* Border stroke gradient for highlight reflection */}
          <linearGradient id="borderGrad" x1="175" y1="0" x2="175" y2="350" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
            <stop offset="40%" stopColor="#FFFFFF" stopOpacity="0.3" />
            <stop offset="80%" stopColor="#93C5FD" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.6" />
          </linearGradient>

          {/* Soft back glow */}
          <radialGradient id="backGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#B2CEFE" stopOpacity="0.6" />
            <stop offset="60%" stopColor="#93C5FD" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#ECECEC" stopOpacity="0" />
          </radialGradient>

          {/* Outer shadow filter for 3D depth */}
          <filter id="shadowFilter" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="-10" dy="10" stdDeviation="15" floodColor="#9CA3AF" floodOpacity="0.4" />
            <feDropShadow dx="10" dy="-10" stdDeviation="15" floodColor="#FFFFFF" floodOpacity="0.9" />
          </filter>

          {/* Inner shadow filter for inset glass detail */}
          <filter id="innerGlow">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feComposite in2="SourceAlpha" operator="arithmetic" k2="-1" k3="1" result="shadowDiff" />
            <feFlood floodColor="#FFFFFF" floodOpacity="0.75" />
            <feComposite in2="shadowDiff" operator="in" />
            <feComposite in2="SourceGraphic" operator="over" />
          </filter>
        </defs>

        {/* Ambient Back Glow */}
        <circle cx="175" cy="175" r="140" fill="url(#backGlow)" />

        {/* Stylized 'A' Logo Shape Group */}
        <g filter="url(#shadowFilter)">
          {/* Main filled body */}
          <path
            d="M 175,40 
               C 160,110 110,180 60,260 
               C 100,230 145,190 175,190 
               C 205,190 250,230 290,260 
               C 240,180 190,110 175,40 Z
               M 175,100
               C 165,135 145,165 125,180
               C 145,175 160,172 175,172
               C 190,172 205,175 225,180
               C 205,165 185,135 175,100 Z"
            fill="url(#glassGrad)"
            filter="url(#innerGlow)"
          />

          {/* Highlight/Border Path */}
          <path
            d="M 175,40 
               C 160,110 110,180 60,260 
               C 100,230 145,190 175,190 
               C 205,190 250,230 290,260 
               C 240,180 190,110 175,40 Z
               M 175,100
               C 165,135 145,165 125,180
               C 145,175 160,172 175,172
               C 190,172 205,175 225,180
               C 205,165 185,135 175,100 Z"
            stroke="url(#borderGrad)"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Overlay curve details for premium organic reflection */}
          <path
            d="M 175,42 C 167,112 135,175 80,240"
            stroke="#FFFFFF"
            strokeWidth="2.5"
            strokeLinecap="round"
            opacity="0.5"
          />
          <path
            d="M 175,172 C 190,172 202,174 215,177"
            stroke="#FFFFFF"
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity="0.4"
          />
        </g>
      </svg>
    </div>
  );
}
