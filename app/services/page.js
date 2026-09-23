"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import styles from "./page.module.css";
import { useTheme } from "../context/ThemeContext";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";


function InlineSVG({ src, className }) {
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
      dangerouslySetInnerHTML={{ __html: svgContent }}
      suppressHydrationWarning={true}
    />
  );
}

function AnimatedCommerceIcon() {
  return (
    <svg width="74" height="74" viewBox="0 0 74 74" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.iconBg}>
      <defs>
        <filter id="commerceNeumorph" x="-0.00035" y="0" width="73.5874" height="73.5872" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feFlood floodOpacity="0" result="BackgroundImageFix"/>
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
          <feOffset dx="2.3" dy="2.3"/>
          <feGaussianBlur stdDeviation="3.45"/>
          <feColorMatrix type="matrix" values="0 0 0 0 0.83 0 0 0 0 0.83 0 0 0 0 0.83 0 0 0 0.9 0"/>
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow"/>
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
          <feOffset dx="-2.3" dy="-2.3"/>
          <feGaussianBlur stdDeviation="2.3"/>
          <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.9 0"/>
          <feBlend mode="normal" in2="effect1_dropShadow" result="effect2_dropShadow"/>
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
          <feOffset dx="2.3" dy="-2.3"/>
          <feGaussianBlur stdDeviation="2.3"/>
          <feColorMatrix type="matrix" values="0 0 0 0 0.83 0 0 0 0 0.83 0 0 0 0 0.83 0 0 0 0.2 0"/>
          <feBlend mode="normal" in2="effect2_dropShadow" result="effect3_dropShadow"/>
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
          <feOffset dx="-2.3" dy="2.3"/>
          <feGaussianBlur stdDeviation="2.3"/>
          <feColorMatrix type="matrix" values="0 0 0 0 0.83 0 0 0 0 0.83 0 0 0 0 0.83 0 0 0 0.2 0"/>
          <feBlend mode="normal" in2="effect3_dropShadow" result="effect4_dropShadow"/>
          <feBlend mode="normal" in="SourceGraphic" in2="effect4_dropShadow" result="shape"/>
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
          <feOffset dx="-2.3" dy="-2.3"/>
          <feGaussianBlur stdDeviation="2.3"/>
          <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
          <feColorMatrix type="matrix" values="0 0 0 0 0.83 0 0 0 0 0.83 0 0 0 0 0.83 0 0 0 0.5 0"/>
          <feBlend mode="normal" in2="shape" result="effect5_innerShadow"/>
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
          <feOffset dx="2.3" dy="2.3"/>
          <feGaussianBlur stdDeviation="2.3"/>
          <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
          <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.3 0"/>
          <feBlend mode="normal" in2="effect5_innerShadow" result="effect6_innerShadow"/>
        </filter>
        <radialGradient id="commerceBorderGrad" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(35.6 35.6) rotate(90) scale(28.7)">
          <stop stopColor="#5A69EA"/>
          <stop offset="1" stopColor="#BF8BCA"/>
        </radialGradient>
        <linearGradient id="foilGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0"/>
          <stop offset="45%" stopColor="#ffffff" stopOpacity="0.1"/>
          <stop offset="50%" stopColor="#ffffff" stopOpacity="0.7"/>
          <stop offset="55%" stopColor="#ffffff" stopOpacity="0.1"/>
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0"/>
        </linearGradient>
      </defs>
      {/* Neumorphic Squircle Base */}
      <g filter="url(#commerceNeumorph)">
        <rect x="6.898" y="6.898" width="57.49" height="57.49" rx="11.498" fill="#ECECEC" className={styles.squircleBg} />
        <rect x="8.048" y="8.048" width="55.19" height="55.19" rx="10.348" stroke="url(#commerceBorderGrad)" strokeWidth="2.3" />
      </g>
      {/* Dual Trading Cards */}
      <g className={styles.tcgCardsGroup}>
        {/* Back Card (Purple Foil) */}
        <g className={styles.cardBackGroup}>
          <rect x="22" y="24" width="20" height="28" rx="2.5" fill="#BF8BCA" stroke="#ffffff" strokeWidth="1" />
          <rect x="24" y="26" width="16" height="12" rx="1" fill="#9C6BB0" fillOpacity="0.6" />
          <line x1="24" y1="42" x2="38" y2="42" stroke="#ffffff" strokeWidth="1" strokeLinecap="round" strokeOpacity="0.8" />
          <line x1="24" y1="46" x2="34" y2="46" stroke="#ffffff" strokeWidth="1" strokeLinecap="round" strokeOpacity="0.6" />
          <circle cx="37" cy="46" r="1.5" fill="#FFD700" />
        </g>
        {/* Front Card (Indigo Holo) */}
        <g className={styles.cardFrontGroup}>
          <rect x="32" y="20" width="20" height="28" rx="2.5" fill="#5A69EA" stroke="#ffffff" strokeWidth="1.2" />
          <rect x="34" y="22" width="16" height="12" rx="1" fill="#3D4BB8" fillOpacity="0.7" />
          <line x1="34" y1="38" x2="48" y2="38" stroke="#ffffff" strokeWidth="1" strokeLinecap="round" strokeOpacity="0.9" />
          <line x1="34" y1="42" x2="44" y2="42" stroke="#ffffff" strokeWidth="1" strokeLinecap="round" strokeOpacity="0.7" />
          <circle cx="47" cy="42" r="1.5" fill="#FFD700" />
          {/* Shimmer sweep overlay */}
          <rect x="32" y="20" width="20" height="28" rx="2.5" fill="url(#foilGrad)" className={styles.foilSweep} pointerEvents="none" />
        </g>
      </g>
    </svg>
  );
}

function AnimatedIntegrationsIcon() {
  return (
    <svg width="74" height="74" viewBox="0 0 74 74" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.iconBg}>
      <defs>
        <filter id="integrationsNeumorph" x="-0.00035" y="0" width="73.5874" height="73.5872" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feFlood floodOpacity="0" result="BackgroundImageFix"/>
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
          <feOffset dx="2.3" dy="2.3"/>
          <feGaussianBlur stdDeviation="3.45"/>
          <feColorMatrix type="matrix" values="0 0 0 0 0.83 0 0 0 0 0.83 0 0 0 0 0.83 0 0 0 0.9 0"/>
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow"/>
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
          <feOffset dx="-2.3" dy="-2.3"/>
          <feGaussianBlur stdDeviation="2.3"/>
          <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.9 0"/>
          <feBlend mode="normal" in2="effect1_dropShadow" result="effect2_dropShadow"/>
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
          <feOffset dx="2.3" dy="-2.3"/>
          <feGaussianBlur stdDeviation="2.3"/>
          <feColorMatrix type="matrix" values="0 0 0 0 0.83 0 0 0 0 0.83 0 0 0 0 0.83 0 0 0 0.2 0"/>
          <feBlend mode="normal" in2="effect2_dropShadow" result="effect3_dropShadow"/>
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
          <feOffset dx="-2.3" dy="2.3"/>
          <feGaussianBlur stdDeviation="2.3"/>
          <feColorMatrix type="matrix" values="0 0 0 0 0.83 0 0 0 0 0.83 0 0 0 0 0.83 0 0 0 0.2 0"/>
          <feBlend mode="normal" in2="effect3_dropShadow" result="effect4_dropShadow"/>
          <feBlend mode="normal" in="SourceGraphic" in2="effect4_dropShadow" result="shape"/>
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
          <feOffset dx="-2.3" dy="-2.3"/>
          <feGaussianBlur stdDeviation="2.3"/>
          <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
          <feColorMatrix type="matrix" values="0 0 0 0 0.83 0 0 0 0 0.83 0 0 0 0 0.83 0 0 0 0.5 0"/>
          <feBlend mode="normal" in2="shape" result="effect5_innerShadow"/>
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
          <feOffset dx="2.3" dy="2.3"/>
          <feGaussianBlur stdDeviation="2.3"/>
          <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
          <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.3 0"/>
          <feBlend mode="normal" in2="effect5_innerShadow" result="effect6_innerShadow"/>
        </filter>
        <radialGradient id="integrationsBorderGrad" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(35.6 35.6) rotate(90) scale(28.7)">
          <stop stopColor="#5A69EA"/>
          <stop offset="1" stopColor="#B2CEFE"/>
        </radialGradient>
      </defs>
      {/* Neumorphic Squircle Base */}
      <g filter="url(#integrationsNeumorph)">
        <rect x="6.898" y="6.898" width="57.49" height="57.49" rx="11.498" fill="#ECECEC" className={styles.squircleBg} />
        <rect x="8.048" y="8.048" width="55.19" height="55.19" rx="10.348" stroke="url(#integrationsBorderGrad)" strokeWidth="2.3" />
      </g>
      {/* Network Sync System */}
      <g className={styles.syncNetworkGroup}>
        {/* Orbit Ring */}
        <circle cx="36" cy="36" r="13" stroke="#5A69EA" strokeWidth="1.4" strokeDasharray="3 3" className={styles.syncRing} />
        {/* Sync Arrows */}
        <path d="M49 36 A13 13 0 0 1 27 44" fill="none" stroke="#5A69EA" strokeWidth="1.8" strokeLinecap="round" className={styles.syncArrow1} />
        <polygon points="27,44 29,48 24,46" fill="#5A69EA" />
        <path d="M23 36 A13 13 0 0 1 45 28" fill="none" stroke="#BF8BCA" strokeWidth="1.8" strokeLinecap="round" className={styles.syncArrow2} />
        <polygon points="45,28 43,24 48,26" fill="#BF8BCA" />
        {/* Central Core Inventory Node */}
        <circle cx="36" cy="36" r="5" fill="#5A69EA" className={styles.syncCenterNode} />
        <circle cx="36" cy="36" r="2" fill="#ffffff" />
        {/* Channel Nodes (TCGplayer, eBay, POS) */}
        <circle cx="36" cy="23" r="3.2" fill="#BF8BCA" className={styles.syncSatellite1} />
        <circle cx="25" cy="43" r="3.2" fill="#5A69EA" className={styles.syncSatellite2} />
        <circle cx="47" cy="43" r="3.2" fill="#BF8BCA" className={styles.syncSatellite3} />
      </g>
    </svg>
  );
}

function AnimatedOperationsIcon() {
  return (
    <svg width="74" height="74" viewBox="0 0 74 74" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.iconBg}>
      <defs>
        <filter id="operationsNeumorph" x="-0.00035" y="0" width="73.5874" height="73.5872" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feFlood floodOpacity="0" result="BackgroundImageFix"/>
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
          <feOffset dx="2.3" dy="2.3"/>
          <feGaussianBlur stdDeviation="3.45"/>
          <feColorMatrix type="matrix" values="0 0 0 0 0.83 0 0 0 0 0.83 0 0 0 0 0.83 0 0 0 0.9 0"/>
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow"/>
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
          <feOffset dx="-2.3" dy="-2.3"/>
          <feGaussianBlur stdDeviation="2.3"/>
          <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.9 0"/>
          <feBlend mode="normal" in2="effect1_dropShadow" result="effect2_dropShadow"/>
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
          <feOffset dx="2.3" dy="-2.3"/>
          <feGaussianBlur stdDeviation="2.3"/>
          <feColorMatrix type="matrix" values="0 0 0 0 0.83 0 0 0 0 0.83 0 0 0 0 0.83 0 0 0 0.2 0"/>
          <feBlend mode="normal" in2="effect2_dropShadow" result="effect3_dropShadow"/>
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
          <feOffset dx="-2.3" dy="2.3"/>
          <feGaussianBlur stdDeviation="2.3"/>
          <feColorMatrix type="matrix" values="0 0 0 0 0.83 0 0 0 0 0.83 0 0 0 0 0.83 0 0 0 0.2 0"/>
          <feBlend mode="normal" in2="effect3_dropShadow" result="effect4_dropShadow"/>
          <feBlend mode="normal" in="SourceGraphic" in2="effect4_dropShadow" result="shape"/>
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
          <feOffset dx="-2.3" dy="-2.3"/>
          <feGaussianBlur stdDeviation="2.3"/>
          <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
          <feColorMatrix type="matrix" values="0 0 0 0 0.83 0 0 0 0 0.83 0 0 0 0 0.83 0 0 0 0.5 0"/>
          <feBlend mode="normal" in2="shape" result="effect5_innerShadow"/>
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
          <feOffset dx="2.3" dy="2.3"/>
          <feGaussianBlur stdDeviation="2.3"/>
          <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
          <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.3 0"/>
          <feBlend mode="normal" in2="effect5_innerShadow" result="effect6_innerShadow"/>
        </filter>
        <radialGradient id="opsBorderGrad" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(35.6 35.6) rotate(90) scale(28.7)">
          <stop stopColor="#5A69EA"/>
          <stop offset="1" stopColor="#BF8BCA"/>
        </radialGradient>
      </defs>
      {/* Neumorphic Squircle Base */}
      <g filter="url(#operationsNeumorph)">
        <rect x="6.898" y="6.898" width="57.49" height="57.49" rx="11.498" fill="#ECECEC" className={styles.squircleBg} />
        <rect x="8.048" y="8.048" width="55.19" height="55.19" rx="10.348" stroke="url(#opsBorderGrad)" strokeWidth="2.3" />
      </g>
      {/* Graded Slab & Buylist Intake Scanner */}
      <g className={styles.opsSlabGroup}>
        {/* Graded Slab Acrylic Body */}
        <rect x="25" y="19" width="24" height="34" rx="3" fill="#ffffff" fillOpacity="0.85" stroke="#717171" strokeWidth="1.2" className={styles.slabBody} />
        {/* Slab Header Label (Grade Tag) */}
        <rect x="27.5" y="21.5" width="19" height="6.5" rx="1" fill="#5A69EA" />
        <line x1="29.5" y1="24.8" x2="38" y2="24.8" stroke="#ffffff" strokeWidth="1" strokeLinecap="round" />
        <circle cx="43" cy="24.8" r="1.5" fill="#FFD700" />
        {/* Card Inside Slab */}
        <rect x="28" y="30.5" width="18" height="20" rx="1.5" fill="#BF8BCA" stroke="#ffffff" strokeWidth="0.8" />
        <circle cx="37" cy="38" r="3" fill="#9C6BB0" />
        {/* Laser Scanner Beam */}
        <line x1="22" y1="36" x2="52" y2="36" stroke="#5A69EA" strokeWidth="2" strokeLinecap="round" className={styles.scannerLaser} />
      </g>
    </svg>
  );
}

function AnimatedAutomationIcon() {
  return (
    <svg width="74" height="74" viewBox="0 0 74 74" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.iconBg}>
      <defs>
        <filter id="automationNeumorph" x="-0.00035" y="0" width="73.5874" height="73.5872" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feFlood floodOpacity="0" result="BackgroundImageFix"/>
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
          <feOffset dx="2.3" dy="2.3"/>
          <feGaussianBlur stdDeviation="3.45"/>
          <feColorMatrix type="matrix" values="0 0 0 0 0.83 0 0 0 0 0.83 0 0 0 0 0.83 0 0 0 0.9 0"/>
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow"/>
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
          <feOffset dx="-2.3" dy="-2.3"/>
          <feGaussianBlur stdDeviation="2.3"/>
          <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.9 0"/>
          <feBlend mode="normal" in2="effect1_dropShadow" result="effect2_dropShadow"/>
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
          <feOffset dx="2.3" dy="-2.3"/>
          <feGaussianBlur stdDeviation="2.3"/>
          <feColorMatrix type="matrix" values="0 0 0 0 0.83 0 0 0 0 0.83 0 0 0 0 0.83 0 0 0 0.2 0"/>
          <feBlend mode="normal" in2="effect2_dropShadow" result="effect3_dropShadow"/>
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
          <feOffset dx="-2.3" dy="2.3"/>
          <feGaussianBlur stdDeviation="2.3"/>
          <feColorMatrix type="matrix" values="0 0 0 0 0.83 0 0 0 0 0.83 0 0 0 0 0.83 0 0 0 0.2 0"/>
          <feBlend mode="normal" in2="effect3_dropShadow" result="effect4_dropShadow"/>
          <feBlend mode="normal" in="SourceGraphic" in2="effect4_dropShadow" result="shape"/>
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
          <feOffset dx="-2.3" dy="-2.3"/>
          <feGaussianBlur stdDeviation="2.3"/>
          <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
          <feColorMatrix type="matrix" values="0 0 0 0 0.83 0 0 0 0 0.83 0 0 0 0 0.83 0 0 0 0.5 0"/>
          <feBlend mode="normal" in2="shape" result="effect5_innerShadow"/>
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
          <feOffset dx="2.3" dy="2.3"/>
          <feGaussianBlur stdDeviation="2.3"/>
          <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
          <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.3 0"/>
          <feBlend mode="normal" in2="effect5_innerShadow" result="effect6_innerShadow"/>
        </filter>
        <radialGradient id="automationBorderGrad" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(35.6 35.6) rotate(90) scale(28.7)">
          <stop stopColor="#5A69EA"/>
          <stop offset="1" stopColor="#BF8BCA"/>
        </radialGradient>
      </defs>
      {/* Neumorphic Squircle Base */}
      <g filter="url(#automationNeumorph)">
        <rect x="6.898" y="6.898" width="57.49" height="57.49" rx="11.498" fill="#ECECEC" className={styles.squircleBg} />
        <rect x="8.048" y="8.048" width="55.19" height="55.19" rx="10.348" stroke="url(#automationBorderGrad)" strokeWidth="2.3" />
      </g>
      {/* Precision Gear and Automation Pulse */}
      <g className={styles.automationGearGroup}>
        <path d="M37,23 L39,23 L39.5,26 C40.8,26.4 42,27.1 43.1,28 L45.8,26.8 L47.4,28.4 L46.2,31.1 C47.1,32.2 47.8,33.4 48.2,34.7 L51.2,35.2 L51.2,37.2 L48.2,37.7 C47.8,39 47.1,40.2 46.2,41.3 L47.4,44 L45.8,45.6 L43.1,44.4 C42,45.3 40.8,46 39.5,46.4 L39,49.4 L37,49.4 L36.5,46.4 C35.2,46 34,45.3 32.9,44.4 L30.2,45.6 L28.6,44 L29.8,41.3 C28.9,40.2 28.2,39 27.8,37.7 L24.8,37.2 L24.8,35.2 L27.8,34.7 C28.2,33.4 28.9,32.2 29.8,31.1 L28.6,28.4 L30.2,26.8 L32.9,28 C34,27.1 35.2,26.4 36.5,26 L37,23 Z" fill="#5A69EA" className={styles.gearBody} />
        <circle cx="38" cy="36.2" r="5" fill="#ECECEC" className={styles.gearHole} />
        <circle cx="38" cy="36.2" r="2.5" fill="#BF8BCA" />
        <polygon points="39,27 34,35 38,35 36,44 42,34 38,34" fill="#FFD700" className={styles.automationBolt} />
      </g>
    </svg>
  );
}

const terms = [
  {
    id: "t1",
    number: 1,
    title: "Scope and Architechure",
    desc: "We build enduring digital systems, not temporary digital features. All engagements are defined strictly by the logical blueprint agreed upon before engineering begins. Any adjustments to the underlying architecture or workflow pipelines outside the initial scope will require a comprehensive evaluation and a separate engineering phase."
  },
  {
    id: "t2",
    number: 2,
    title: "Delivery and Iterations",
    desc: "We work through structural, mutually validated iterations. Our focus is systems architecture and engineering design; revisions are strictly bound to the performance, clarity, and structural integrity of the asset—not subjective visual trends."
  },
  {
    id: "t3",
    number: 3,
    title: "System Integration & Liability",
    desc: "Our architectures are engineered to process data with absolute technical precision. Once deployed and verified, the continuous operational integrity of the system depends on data environments being maintained according to our operational blueprints. Aethood is not responsible for data friction caused by external, unverified tool updates or unauthorized backend modifications."
  }
];

const rules = [
  {
    id: "r1",
    number: 1,
    title: "Capital & Commitment",
    desc: "Every intelligent framework requires an analysis phase. To secure a place in our studio's pipeline and initiate the initial blueprinting, a 50% upfront commitment fee is required. Engineering and deployment commence immediately upon payment, with the remaining balance is structured around predefined based milestones, ensuring mutual transparency at every step."
  },
  {
    id: "r2",
    number: 2,
    title: "High-Signal Communication",
    desc: "We don't believe in endless meetings or unnecessary noise. To maintain deep focus on engineering, operational updates happen through a centralized dashboard. We provide clear, structured updates once a week. This ensures you are aligned with the project's velocity without unnecessary chat widgets or distracting calls."
  },
  {
    id: "r3",
    number: 3,
    title: "Absolute Timeline & Scope",
    desc: "Systems intelligence cannot be rushed. We commit to technical deadlines built on careful research and build. Once a timeline is locked during the blueprinting phase, we commit to it fully. However, because our systems are deeply interconnected, any late-stage adjustments to the core data logic or scope will automatically recalibrate the final deployment date. Precision always takes priority over speed."
  }
];

export default function ServicesPage() {
  const { isDark } = useTheme();
  const [expandedItems, setExpandedItems] = useState({});

  const playClickSound = useCallback(() => {
    try {
      const audio = new Audio("/touchpad sd.mp3");
      audio.volume = 0.85;
      audio.play().catch(() => {});
    } catch (e) {
      /* ignore */
    }
  }, []);

  const toggleItem = (id) => {
    playClickSound();
    setExpandedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className={styles.pageWrapper} data-theme={isDark ? "dark" : "light"} suppressHydrationWarning={true}>
      {/* ===== FLOATING STICKY NAVIGATION ===== */}
      <Navbar activePage="services" />

      {/* ===== MAIN CONTAINER FLOW ===== */}
      <main className={styles.mainContainer}>
        <div className={styles.contentAlignContainer}>
          {/* ----- SECTION 1: HERO ----- */}
          <InlineSVG src="/services/Group 76.svg" className={styles.heroTitle} />


          {/* Card 1: Custom Commerce Platforms */}
          <a href="/services/commerce" className={styles.card1} onClick={playClickSound}>
            <AnimatedCommerceIcon />
            <h3 className={styles.cardTitle}>Custom Commerce Platforms</h3>
            <h4 className={styles.cardSubtitle}>Custom TCG Storefronts</h4>
            <p className={styles.cardDesc}>
              Your <span className={styles.gradientText}>storefront designed from scratch for high-velocity card catalogs</span>. Sub-second filtering, graded slabs, and direct checkout with <span className={styles.gradientText}>zero marketplace commissions</span>... <span className={styles.inlineLink}>Learn More →</span>
            </p>
          </a>

          {/* Card 2: Commerce & Marketplace Integration */}
          <a href="/services/integrations" className={styles.card2} onClick={playClickSound}>
            <AnimatedIntegrationsIcon />
            <h3 className={styles.cardTitle}>Marketplace Integration</h3>
            <h4 className={styles.cardSubtitle}>One Inventory. Every Channel.</h4>
            <p className={styles.cardDesc}>
              Connect TCGplayer, eBay, Cardmarket, Shopify, and counter POS into <span className={styles.gradientText}>one central inventory</span>. Automatic instant delisting when cards sell anywhere—<span className={styles.gradientText}>zero double-selling</span>... <span className={styles.inlineLink}>Learn More →</span>
            </p>
          </a>

          {/* Card 3: TCG Operations Systems */}
          <a href="/services/operations" className={styles.card3} onClick={playClickSound}>
            <AnimatedOperationsIcon />
            <h3 className={styles.cardTitle}>TCG Operations Systems</h3>
            <h4 className={styles.cardSubtitle}>Behind The Counter</h4>
            <p className={styles.cardDesc}>
              Streamline the hardest parts of card retail: <span className={styles.gradientText}>automated buylist trade-in valuation</span>, condition grading matrices, slab vault security, and <span className={styles.gradientText}>counter POS synchronization</span>... <span className={styles.inlineLink}>Learn More →</span>
            </p>
          </a>

          {/* Card 4: Business Automation */}
          <a href="/services/automation" className={styles.card4} onClick={playClickSound}>
            <AnimatedAutomationIcon />
            <h3 className={styles.cardTitle}>Business Automation</h3>
            <h4 className={styles.cardSubtitle}>Operational Infrastructure</h4>
            <p className={styles.cardDesc}>
              Remove daily retail busywork with <span className={styles.gradientText}>automated dynamic repricing rules</span>, 1-click batch thermal label printing, and <span className={styles.gradientText}>fast-track card scanner intake</span>... <span className={styles.inlineLink}>Learn More →</span>
            </p>
          </a>

          {/* Side Indicator */}
          <InlineSVG src="/services/Side Indicator.svg" className={styles.sideIndicator} />

          {/* ----- SECTION 3: TERMS & RULES OF ENGAGEMENT ----- */}
          <InlineSVG src="/services/Terms & Rules of Engagement.svg" className={styles.termsTitle} />
          <InlineSVG src="/services/Defining mutual commitment across financing, centralized updates, and locked timelines..svg" className={styles.termsSubtitle} />

          {/* Neumorphic Terms Container Box */}
          <div className={styles.termsContainer}>
            <div className={styles.termsBorder} />
            
            {/* Divider Line */}
            <div className={styles.termsDivider} />

            {/* Terms & Rules Content */}
            <div className={styles.termsHtmlContent}>
              {/* Left Column (Terms) */}
              <div className={styles.termsColumn}>
                <div className={styles.columnHeader}>
                  <InlineSVG src="/services/Frame 198.svg" className={styles.btnTermsInline} />
                </div>
                <div className={styles.termsList}>
                  {terms.map((item) => {
                    const isExpanded = !!expandedItems[item.id];
                    return (
                      <div key={item.id} className={styles.termsItem}>
                        <div className={styles.termsNumber}>{item.number}</div>
                        <div className={styles.termsText}>
                          <h4 className={styles.termsItemTitle}>{item.title}</h4>
                          <p className={`${styles.termsItemDesc} ${isExpanded ? styles.expanded : ""}`}>
                            {item.desc}
                          </p>
                          <button 
                            className={styles.seeMoreBtn}
                            onClick={() => toggleItem(item.id)}
                            aria-expanded={isExpanded}
                          >
                            {isExpanded ? "See Less" : "See More"}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right Column (Rules) */}
              <div className={styles.termsColumn}>
                <div className={styles.columnHeader}>
                  <InlineSVG src="/services/Frame 199.svg" className={styles.btnRulesInline} />
                </div>
                <div className={styles.termsList}>
                  {rules.map((item) => {
                    const isExpanded = !!expandedItems[item.id];
                    return (
                      <div key={item.id} className={styles.termsItem}>
                        <div className={styles.termsNumber}>{item.number}</div>
                        <div className={styles.termsText}>
                          <h4 className={styles.termsItemTitle}>{item.title}</h4>
                          <p className={`${styles.termsItemDesc} ${isExpanded ? styles.expanded : ""}`}>
                            {item.desc}
                          </p>
                          <button 
                            className={styles.seeMoreBtn}
                            onClick={() => toggleItem(item.id)}
                            aria-expanded={isExpanded}
                          >
                            {isExpanded ? "See Less" : "See More"}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* ===== 3D DRAGGABLE THEME SWITCH OVERLAY ===== */}
        </div>
      </main>

      {/* ----- SECTION 4: FOOTER ----- */}
      <Footer />
    </div>
  );
}
