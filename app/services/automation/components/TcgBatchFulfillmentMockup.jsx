"use client";

import { useState, useCallback } from "react";
import styles from "./TcgAutomation.module.css";

const TABS = [
  { id: "batch-print", label: "1-Click Thermal Batch Fulfillment" },
  { id: "bin-sorting", label: "Bin-Sorted Single-Path Pick Lists" },
  { id: "scanner-intake", label: "High-Speed Bulk Scanner Intake" }
];

export default function TcgBatchFulfillmentMockup() {
  const [activeTab, setActiveTab] = useState("batch-print");

  const playClickSound = useCallback(() => {
    try {
      const audio = new Audio("/touchpad sd.mp3");
      audio.volume = 0.8;
      audio.play().catch(() => {});
    } catch (e) {
      /* ignore */
    }
  }, []);

  return (
    <div className={styles.componentCard}>
      <div className={styles.sectionBadge}>
        <span className={styles.badgeDot} />
        Fulfillment & Intake Pipelines
      </div>

      <h3 className={styles.componentTitle}>
        High-Velocity Card Logistics <span className={styles.componentTitleHighlight}>Engines</span>
      </h3>
      <p className={styles.componentDesc}>
        Transform your backroom fulfillment. Eliminate manual copy-pasting of tracking numbers, hunting through random binder shelves, and typing card listings manually.
      </p>

      {/* Tabs */}
      <div className={styles.workflowTabs}>
        {TABS.map((tab) => (
          <button
            key={tab.id}
            className={`${styles.tabBtn} ${activeTab === tab.id ? styles.tabBtnActive : ""}`}
            onClick={() => {
              playClickSound();
              setActiveTab(tab.id);
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className={styles.workflowContentBox}>
        {activeTab === "batch-print" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <div>
                <h4 style={{ margin: "0 0 4px 0", fontSize: "15px", fontWeight: 800, color: "var(--text-primary, #1e1e24)" }}>
                  Thermal Batch Print Queue (Zebra / Rollo ESC/POS)
                </h4>
                <p style={{ margin: 0, fontSize: "12px", color: "var(--text-secondary, #64748b)" }}>
                  4 multi-channel orders ready for packing • Auto-matched shipping presets
                </p>
              </div>
              <button
                className={styles.pipelineItemAction}
                onClick={playClickSound}
                style={{ cursor: "pointer", border: "none" }}
              >
                🖨 Batch Print 4 Labels (0.8s)
              </button>
            </div>

            <div className={styles.pipelineList}>
              <div className={styles.pipelineItem}>
                <div className={styles.pipelineItemMeta}>
                  <span className={styles.pipelineItemTitle}>Order #TCG-9941 • Charizard 1st Ed Base #4/102</span>
                  <span className={styles.pipelineItemSub}>Channel: TCGplayer Direct • Package: Rigid Magnetic Slab Box • USPS Priority</span>
                </div>
                <span className={styles.pipelineItemAction}>Label Ready</span>
              </div>

              <div className={styles.pipelineItem}>
                <div className={styles.pipelineItemMeta}>
                  <span className={styles.pipelineItemTitle}>Order #EB-5421 • One Piece Manga Shanks #OP01</span>
                  <span className={styles.pipelineItemSub}>Channel: eBay Card Store • Package: Toploader Bubble Mailer • Ground Adv.</span>
                </div>
                <span className={styles.pipelineItemAction}>Label Ready</span>
              </div>

              <div className={styles.pipelineItem}>
                <div className={styles.pipelineItemMeta}>
                  <span className={styles.pipelineItemTitle}>Order #WEB-209 • 4x Sheoldred, the Apocalypse</span>
                  <span className={styles.pipelineItemSub}>Channel: Custom Storefront • Package: Armored Sleeve Pouch • First Class</span>
                </div>
                <span className={styles.pipelineItemAction}>Label Ready</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === "bin-sorting" && (
          <div>
            <div style={{ marginBottom: "16px" }}>
              <h4 style={{ margin: "0 0 4px 0", fontSize: "15px", fontWeight: 800, color: "var(--text-primary, #1e1e24)" }}>
                Optimized Single-Path Warehouse Pick List
              </h4>
              <p style={{ margin: 0, fontSize: "12px", color: "var(--text-secondary, #64748b)" }}>
                Staff walk in one clean linear loop through your store display cases and vaults
              </p>
            </div>

            <div className={styles.pipelineList}>
              <div className={styles.pipelineItem}>
                <div className={styles.pipelineItemMeta}>
                  <span className={styles.pipelineItemTitle}>📍 STOP 01: VAULT-A1-BIN04</span>
                  <span className={styles.pipelineItemSub}>Item: PSA 9 Charizard 1st Edition • Order #TCG-9941</span>
                </div>
                <span className={styles.pipelineItemAction} style={{ background: "rgba(16, 185, 129, 0.12)", color: "#10b981" }}>
                  Verified Location
                </span>
              </div>

              <div className={styles.pipelineItem}>
                <div className={styles.pipelineItemMeta}>
                  <span className={styles.pipelineItemTitle}>📍 STOP 02: CASE-ONEPIECE-SLOT08</span>
                  <span className={styles.pipelineItemSub}>Item: Manga Shanks Alt Art • Order #EB-5421</span>
                </div>
                <span className={styles.pipelineItemAction} style={{ background: "rgba(16, 185, 129, 0.12)", color: "#10b981" }}>
                  Verified Location
                </span>
              </div>

              <div className={styles.pipelineItem}>
                <div className={styles.pipelineItemMeta}>
                  <span className={styles.pipelineItemTitle}>📍 STOP 03: BINDER-MTG-DOM-P12</span>
                  <span className={styles.pipelineItemSub}>Item: 4x Sheoldred Regular NM • Order #WEB-209</span>
                </div>
                <span className={styles.pipelineItemAction} style={{ background: "rgba(16, 185, 129, 0.12)", color: "#10b981" }}>
                  Verified Location
                </span>
              </div>
            </div>
          </div>
        )}

        {activeTab === "scanner-intake" && (
          <div>
            <div style={{ marginBottom: "16px" }}>
              <h4 style={{ margin: "0 0 4px 0", fontSize: "15px", fontWeight: 800, color: "var(--text-primary, #1e1e24)" }}>
                100-Card Bulk Optical Scanner Ingestion
              </h4>
              <p style={{ margin: 0, fontSize: "12px", color: "var(--text-secondary, #64748b)" }}>
                Feeds high-speed card scanners to catalog sets, variants, and numbers at 1 card per second
              </p>
            </div>

            <div className={styles.pipelineList}>
              <div className={styles.pipelineItem}>
                <div className={styles.pipelineItemMeta}>
                  <span className={styles.pipelineItemTitle}>Scan #01 • Mewtwo VSTAR #GG44 (Crown Zenith)</span>
                  <span className={styles.pipelineItemSub}>Auto-Matched: Pokémon TCGdex API • Condition: NM (Optical Grade Verified)</span>
                </div>
                <span className={styles.pipelineItemAction}>Feed Synced</span>
              </div>

              <div className={styles.pipelineItem}>
                <div className={styles.pipelineItemMeta}>
                  <span className={styles.pipelineItemTitle}>Scan #02 • Roronoa Zoro (Leader Alt) #OP01-001</span>
                  <span className={styles.pipelineItemSub}>Auto-Matched: One Piece Deck Engine • Condition: NM • Auto-Priced: $48.00</span>
                </div>
                <span className={styles.pipelineItemAction}>Feed Synced</span>
              </div>

              <div className={styles.pipelineItem}>
                <div className={styles.pipelineItemMeta}>
                  <span className={styles.pipelineItemTitle}>Scan #03 • The One Ring (Borderless) #LTR-451</span>
                  <span className={styles.pipelineItemSub}>Auto-Matched: MTG Scryfall Engine • Condition: NM Foil • Auto-Priced: $115.00</span>
                </div>
                <span className={styles.pipelineItemAction}>Feed Synced</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
