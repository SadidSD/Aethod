"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useTheme } from "../context/ThemeContext";
import styles from "./PremiumBackground.module.css";

const MODES = [
  { id: "flat", name: "Standard Flat" },
  { id: "vignette", name: "Studio Vignette" },
  { id: "material", name: "Organic Material" },
  { id: "ultimate", name: "Tactile Studio" }
];

export default function PremiumBackground() {
  const { isDark } = useTheme();
  const [activeModeIndex, setActiveModeIndex] = useState(3); // Default to Tactile Studio (Vignette + Material)
  const [toastMessage, setToastMessage] = useState("");
  const toastTimeoutRef = useRef(null);

  // Load saved background mode from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("premium_bg_mode");
    if (saved) {
      const index = MODES.findIndex(m => m.id === saved);
      if (index !== -1) setActiveModeIndex(index);
    }
  }, []);

  const playClickSound = useCallback(() => {
    try {
      const audio = new Audio("/touchpad sd.mp3");
      audio.volume = 0.85;
      audio.play().catch(() => {});
    } catch (e) {
      /* ignore */
    }
  }, []);

  const cycleMode = () => {
    playClickSound();
    const nextIndex = (activeModeIndex + 1) % MODES.length;
    setActiveModeIndex(nextIndex);
    const mode = MODES[nextIndex];
    localStorage.setItem("premium_bg_mode", mode.id);

    // Show temporary floating toast notification
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    setToastMessage(`Surface Mode: ${mode.name}`);
    toastTimeoutRef.current = setTimeout(() => {
      setToastMessage("");
    }, 2000);
  };

  const activeMode = MODES[activeModeIndex].id;

  return (
    <>
      {/* Dynamic Background Surface Layers */}
      <div 
        className={`${styles.bgContainer} ${styles[`mode_${activeMode}`]}`} 
        data-theme={isDark ? "dark" : "light"}
      >
        {/* Layer 1: Vignette / Falloff */}
        <div className={styles.vignetteLayer} />

        {/* Layer 2: Organic Tactile Fiber Noise */}
        <div className={styles.materialNoiseLayer} />
      </div>

      {/* Floating Neomorphic Controller Button */}
      <div className={styles.controlWrapper}>
        <button 
          onClick={cycleMode} 
          className={styles.cycleBtn}
          title="Adjust Surface Background Style"
          aria-label="Adjust Surface Background Style"
        >
          <svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m11.32 11.32l.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
          </svg>
        </button>
      </div>

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className={styles.toastContainer}>
          <div className={styles.toastCard}>
            <span>{toastMessage}</span>
          </div>
        </div>
      )}
    </>
  );
}
