"use client";

import { useCallback } from "react";
import styles from "./TcgAutomation.module.css";

export default function TcgAutomationStageSwitcher({ activeStage, onSelectStage }) {
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
      title: "Repricing & Batch Demos",
      sub: "Dynamic Repricer, Pick Lists & ROI"
    },
    {
      id: "stage-02",
      number: "Stage 02 · Pricing",
      title: "Packages & Pricing",
      sub: "Starter vs Full Suite vs Enterprise"
    },
    {
      id: "stage-03",
      number: "Stage 03",
      title: "Blueprint & Onboarding",
      sub: "Thermal Pipelines, Webhooks & FAQs"
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
