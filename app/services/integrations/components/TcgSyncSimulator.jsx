"use client";

import { useState, useCallback, useEffect } from "react";
import styles from "./TcgIntegrations.module.css";

const CHANNELS = [
  { id: "storefront", name: "Your Online Storefront", type: "Direct Web", icon: "🌐" },
  { id: "tcgplayer", name: "TCGplayer Direct / Pro", type: "Marketplace", icon: "🃏" },
  { id: "ebay", name: "eBay Card Store", type: "Marketplace", icon: "🏷️" },
  { id: "pos", name: "Physical Counter POS", type: "In-Store Register", icon: "🏪" }
];

export default function TcgSyncSimulator() {
  const [stock, setStock] = useState(1);
  const [soldChannel, setSoldChannel] = useState(null);
  const [syncStatus, setSyncStatus] = useState("idle"); // "idle" | "syncing" | "delisted"
  const [syncLogs, setSyncLogs] = useState([]);
  const [elapsedMs, setElapsedMs] = useState(0);

  const playClickSound = useCallback(() => {
    try {
      const audio = new Audio("/touchpad sd.mp3");
      audio.volume = 0.8;
      audio.play().catch(() => {});
    } catch (e) {
      /* ignore */
    }
  }, []);

  const simulateSale = (originChannelId) => {
    playClickSound();
    setSoldChannel(originChannelId);
    setSyncStatus("syncing");
    setStock(0);
    setElapsedMs(0);

    const originName = CHANNELS.find((c) => c.id === originChannelId)?.name;
    const now = new Date();
    const timeStr = now.toLocaleTimeString();

    const initialLogs = [
      { time: timeStr, ms: "0.0s", text: `Checkout finalized on ${originName} (Qty: 1 → 0)` },
      { time: timeStr, ms: "0.2s", text: "Master Concurrency Arbiter locks master SKU record" }
    ];
    setSyncLogs(initialLogs);

    // Simulate rapid event propagation across all other channels
    setTimeout(() => {
      const otherChannels = CHANNELS.filter((c) => c.id !== originChannelId);
      const updatedLogs = [
        ...initialLogs,
        { time: timeStr, ms: "0.6s", text: `Webhook received by ${otherChannels[0].name}: delisted` },
        { time: timeStr, ms: "1.1s", text: `Webhook received by ${otherChannels[1].name}: delisted` },
        { time: timeStr, ms: "1.6s", text: `Webhook received by ${otherChannels[2].name}: register locked` },
        { time: timeStr, ms: "1.8s", text: "⚡ Global inventory reconciled. Zero double-selling risk." }
      ];
      setSyncLogs(updatedLogs);
      setSyncStatus("delisted");
      setElapsedMs(1.8);
    }, 600);
  };

  const handleReset = () => {
    playClickSound();
    setStock(1);
    setSoldChannel(null);
    setSyncStatus("idle");
    setSyncLogs([]);
    setElapsedMs(0);
  };

  return (
    <div className={styles.simulatorCard}>
      {/* Top Banner explaining the problem solved */}
      <div className={styles.simulatorHeader}>
        <div className={styles.simulatorBadge}>
          <span className={styles.pulseDot} />
          <span>REAL-TIME MULTI-CHANNEL ENGINE</span>
        </div>
        <h3 className={styles.simulatorTitle}>
          Instant Auto-Delisting Simulator <span className={styles.accentText}>(&lt; 2.0s Global Sync)</span>
        </h3>
        <p className={styles.simulatorDesc}>
          When a rare single sells on eBay at 2 AM or over your physical counter, standard third-party sync apps take 15 to 45 minutes to update.
          <strong> Aeethod&apos;s event-driven webhook pipeline drops quantities to 0 across all other platforms in under 2 seconds.</strong>
        </p>
      </div>

      {/* Item in Showcase */}
      <div className={styles.activeItemBar}>
        <div className={styles.itemArtworkWrapper}>
          <img
            src="https://images.pokemontcg.io/base1/4_hires.png"
            alt="Charizard Base Set Holo"
            className={styles.itemThumb}
          />
        </div>
        <div className={styles.itemInfo}>
          <div className={styles.itemMetaRow}>
            <span className={styles.itemSkuTag}>SKU: PKM-BS-004-PSA9</span>
            <span className={styles.itemGradeTag}>PSA 9 Mint · Cert #68492019</span>
          </div>
          <h4 className={styles.itemTitle}>Charizard — 1st Edition Base Set Holo #4/102</h4>
          <div className={styles.itemPriceRow}>
            <span className={styles.itemPrice}>$950.00 USD</span>
            <span className={`${styles.itemStockPill} ${stock === 0 ? styles.stockPillOut : styles.stockPillIn}`}>
              {stock === 1 ? "● 1 IN STOCK (Available Across 4 Channels)" : "✕ 0 IN STOCK (Globally Delisted)"}
            </span>
          </div>
        </div>

        {stock === 0 && (
          <button className={styles.resetBtn} onClick={handleReset}>
            ↺ Restock & Reset Demo
          </button>
        )}
      </div>

      {/* 4 Connected Channels Grid */}
      <div className={styles.channelsGrid}>
        {CHANNELS.map((ch) => {
          const isOrigin = soldChannel === ch.id;
          const isDelisted = soldChannel && !isOrigin;

          return (
            <div
              key={ch.id}
              className={`${styles.channelCard} ${
                isOrigin
                  ? styles.channelOriginSold
                  : isDelisted
                  ? styles.channelAutoDelisted
                  : styles.channelActive
              }`}
            >
              <div className={styles.channelTop}>
                <span className={styles.channelIcon}>{ch.icon}</span>
                <span className={styles.channelTypeBadge}>{ch.type}</span>
              </div>

              <h4 className={styles.channelName}>{ch.name}</h4>

              {/* Status State */}
              <div className={styles.channelStatusBox}>
                {syncStatus === "idle" && (
                  <div className={styles.statusIdle}>
                    <span className={styles.greenLight} />
                    <span>Active Listing · Qty: 1</span>
                  </div>
                )}
                {isOrigin && (
                  <div className={styles.statusOrigin}>
                    <span className={styles.originPulse} />
                    <span>✓ PURCHASE DETECTED (Qty: 0)</span>
                  </div>
                )}
                {isDelisted && (
                  <div className={styles.statusDelisted}>
                    <span className={styles.delistPulse} />
                    <span>AUTO-DELISTED (Qty: 0)</span>
                  </div>
                )}
              </div>

              {/* Channel Trigger Button */}
              {syncStatus === "idle" ? (
                <button
                  className={styles.simulateSaleBtn}
                  onClick={() => simulateSale(ch.id)}
                >
                  <span>Simulate Sale Here</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </button>
              ) : (
                <div className={styles.syncSpeedTag}>
                  {isOrigin ? "Origin Trigger" : "Delisted in < 1.8s"}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Live Event Propagation Timeline */}
      {syncLogs.length > 0 && (
        <div className={styles.eventLogConsole}>
          <div className={styles.consoleHeader}>
            <div className={styles.consoleTitle}>
              <span className={styles.terminalIcon}>⚡</span>
              <span>LIVE WEBHOOK PROPAGATION AUDIT ({elapsedMs}s Total Propagation)</span>
            </div>
            <span className={styles.zeroDefectTag}>0 Defect Strikes · Concurrency Locked</span>
          </div>

          <div className={styles.logList}>
            {syncLogs.map((log, idx) => (
              <div key={idx} className={styles.logItem}>
                <span className={styles.logMs}>+{log.ms}</span>
                <span className={styles.logTime}>[{log.time}]</span>
                <span className={styles.logText}>{log.text}</span>
              </div>
            ))}
          </div>

          <div className={styles.protectionCallout}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            <span>
              If a buyer on another channel attempted to click &quot;Buy Now&quot; at the exact same moment, the Concurrency Arbiter locks them out and preserves your seller defect rating.
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
