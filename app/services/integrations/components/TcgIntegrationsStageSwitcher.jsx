"use client";

import { useEffect, useState, useCallback } from "react";
import styles from "./TcgIntegrations.module.css";

const STAGES = [
  { id: "stage-overview", num: "STAGE 01", label: "Overview & Sync Demos", desc: "Double-Selling Eliminated & Auto-Delister" },
  { id: "pricing-section", num: "STAGE 02", label: "Packages & Pricing", desc: "Dual vs Omnichannel vs Global · Middle", isMiddle: true },
  { id: "stage-blueprint", num: "STAGE 03", label: "Blueprint & Onboarding", desc: "Modules, Channel Protocol & FAQs" }
];

export default function TcgIntegrationsStageSwitcher() {
  const [activeStage, setActiveStage] = useState("stage-overview");

  const playClickSound = useCallback(() => {
    try {
      const audio = new Audio("/touchpad sd.mp3");
      audio.volume = 0.8;
      audio.play().catch(() => {});
    } catch (e) {
      /* ignore */
    }
  }, []);

  const scrollToStage = (id) => {
    playClickSound();
    setActiveStage(id);
    const elem = document.getElementById(id);
    if (elem) {
      const yOffset = -90; // offset for sticky navbar
      const y = elem.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + 200;
      const pricingElem = document.getElementById("pricing-section");
      const blueprintElem = document.getElementById("stage-blueprint");

      if (blueprintElem && scrollPos >= blueprintElem.offsetTop) {
        setActiveStage("stage-blueprint");
      } else if (pricingElem && scrollPos >= blueprintElem ? false : pricingElem && scrollPos >= pricingElem.offsetTop) {
        setActiveStage("pricing-section");
      } else {
        setActiveStage("stage-overview");
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className={styles.stageSwitcherContainer}>
      <div className={styles.stageSwitcherBar}>
        {STAGES.map((s) => {
          const isActive = activeStage === s.id;
          return (
            <button
              key={s.id}
              className={`${styles.stageBtn} ${isActive ? styles.stageBtnActive : ""} ${
                s.isMiddle ? styles.stageBtnMiddle : ""
              }`}
              onClick={() => scrollToStage(s.id)}
            >
              <div className={styles.stageBtnTop}>
                <span className={styles.stageNumber}>{s.num}</span>
                {s.isMiddle && <span className={styles.middleBadge}>PRICING</span>}
              </div>
              <span className={styles.stageLabel}>{s.label}</span>
              <span className={styles.stageDesc}>{s.desc}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
