"use client";

import { useCallback } from "react";
import styles from "./TcgOperations.module.css";

export default function TcgOperationsStageSwitcher({ activeStage, onSelectStage }) {
  const playClickSound = useCallback(() => {
    try {
      const audio = new Audio("/touchpad sd.mp3");
      audio.volume = 0.8;
      audio.play().catch(() => {});
    } catch (e) {
      /* ignore */
    }
  }, []);

  const stages = [
    {
      id: "stage-01",
      number: "Stage 01",
      title: "Behind-The-Counter Demos",
      sub: "Buylist Terminal, Grading Matrix & ROI"
    },
    {
      id: "stage-02",
      number: "Stage 02 · Pricing",
      title: "Packages & Pricing",
      sub: "Portal vs Counter vs Multi-Store Fleet"
    },
    {
      id: "stage-03",
      number: "Stage 03",
      title: "Blueprint & Onboarding",
      sub: "Hardware, Vault Registry & FAQs"
    }
  ];

  return (
    <div className={styles.stageSwitcherWrapper}>
      <div className={styles.stageSwitcherInner}>
        {stages.map((st) => (
          <button
            key={st.id}
            className={`${styles.stageBtn} ${activeStage === st.id ? styles.stageBtnActive : ""}`}
            onClick={() => {
              playClickSound();
              onSelectStage(st.id);
            }}
          >
            <div className={styles.stageBtnNum}>{st.number}</div>
            <div className={styles.stageBtnTitle}>{st.title}</div>
            <div style={{ fontSize: "11px", color: "var(--text-secondary, #64748b)" }}>{st.sub}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
