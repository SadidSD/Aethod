"use client";

import { useState, useCallback } from "react";
import styles from "./TcgAutomation.module.css";

const BASE_CARD = {
  name: "Pikachu with Grey Felt Hat",
  number: "Promo #085",
  game: "Pokémon TCG (Van Gogh Collab)",
  basePrice: 95.00,
  minFloorPrice: 65.00,
  maxCeilingPrice: 180.00,
  costBasis: 42.00
};

const EVENTS = [
  {
    id: "spike",
    title: "Tournament Spike (+25%)",
    sub: "Japanese Championship Meta Win",
    deltaPercent: 0.25,
    reason: "Sudden demand surge across collectors & players"
  },
  {
    id: "dip",
    title: "Market Correction (-12%)",
    sub: "Reprint / Market Saturation",
    deltaPercent: -0.12,
    reason: "Gradual market cool-off, auto-pegged to lowest NM"
  },
  {
    id: "undercut",
    title: "Lowest Verified Seller Match",
    sub: "Undercut Competitor by -$0.50",
    deltaPercent: -0.06,
    reason: "Ensure fast conversion while protecting floor"
  }
];

export default function TcgRepricerSimulator() {
  const [activeEvent, setActiveEvent] = useState(EVENTS[0]);
  const [isUpdating, setIsUpdating] = useState(false);
  const [lastUpdatedTime, setLastUpdatedTime] = useState("Just now");

  const playClickSound = useCallback(() => {
    try {
      const audio = new Audio("/touchpad sd.mp3");
      audio.volume = 0.8;
      audio.play().catch(() => {});
    } catch (e) {
      /* ignore */
    }
  }, []);

  const triggerEvent = (evt) => {
    playClickSound();
    setIsUpdating(true);
    setActiveEvent(evt);

    setTimeout(() => {
      setIsUpdating(false);
      setLastUpdatedTime(new Date().toLocaleTimeString());
    }, 400);
  };

  // Price Calculation with Guardrails
  const rawPrice = BASE_CARD.basePrice * (1 + activeEvent.deltaPercent);
  const protectedPrice = Math.min(
    Math.max(rawPrice, BASE_CARD.minFloorPrice),
    BASE_CARD.maxCeilingPrice
  );
  const priceDiff = protectedPrice - BASE_CARD.basePrice;

  return (
    <div className={styles.componentCard}>
      <div className={styles.sectionBadge}>
        <span className={styles.badgeDot} />
        Autonomous Repricing Engine
      </div>

      <h3 className={styles.componentTitle}>
        Dynamic Market Repricing <span className={styles.componentTitleHighlight}>Simulator</span>
      </h3>
      <p className={styles.componentDesc}>
        Watch how Aeethod protects your shop margins. When market prices spike or fall on tournament weekends, our event-driven repricer recalculates prices and pushes updates across all channels in under 60 seconds.
      </p>

      <div className={styles.repricerGrid}>
        {/* Left: Card & Event Triggers */}
        <div className={styles.repricerCardOverview}>
          <div className={styles.cardHeaderInfo}>
            <div className={styles.cardThumb}>⚡</div>
            <div>
              <h4 className={styles.cardTitleText}>{BASE_CARD.name}</h4>
              <div className={styles.cardSetTag}>
                <span>{BASE_CARD.number}</span>
                <span>•</span>
                <span className={styles.priceTagCurrent}>Current Base: ${BASE_CARD.basePrice.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <label className={styles.triggerGroupLabel}>1. Simulate Market Volatility Event:</label>
          <div className={styles.eventTriggerButtons}>
            {EVENTS.map((evt) => (
              <button
                key={evt.id}
                className={`${styles.eventBtn} ${activeEvent.id === evt.id ? styles.eventBtnActive : ""}`}
                onClick={() => triggerEvent(evt)}
              >
                <div>
                  <div style={{ fontWeight: 800 }}>{evt.title}</div>
                  <div style={{ fontSize: "11px", color: "var(--text-secondary, #64748b)" }}>{evt.sub}</div>
                </div>
                <span>{activeEvent.id === evt.id ? "● Active" : "→"}</span>
              </button>
            ))}
          </div>

          <div className={styles.rulesGuardrails}>
            <div style={{ fontWeight: 800, color: "var(--text-primary, #1e1e24)" }}>Algorithmic Margin Guardrails:</div>
            <div className={styles.guardrailItem}>
              <span>Strict Profit Floor (Never sell below):</span>
              <span className={styles.guardrailVal}>${BASE_CARD.minFloorPrice.toFixed(2)} (Locked)</span>
            </div>
            <div className={styles.guardrailItem}>
              <span>Ceiling Circuit-Breaker:</span>
              <span className={styles.guardrailVal}>${BASE_CARD.maxCeilingPrice.toFixed(2)}</span>
            </div>
            <div className={styles.guardrailItem}>
              <span>Marketplace Fee Buffer:</span>
              <span className={styles.guardrailVal}>+13.2% Auto-Padded on eBay</span>
            </div>
          </div>
        </div>

        {/* Right: Live Monitor & Multi-Channel Broadcast */}
        <div className={styles.monitorPanel}>
          <div>
            <div className={styles.monitorHeader}>
              <div className={styles.monitorLiveBadge}>
                <span className={styles.liveDot} />
                Global Price Arbiter
              </div>
              <div style={{ fontSize: "11px", color: "#64748b" }}>Updated: {lastUpdatedTime}</div>
            </div>

            <div className={styles.priceDisplayBox}>
              <div className={styles.priceChangeLabel}>Automated Optimized Price</div>
              <div className={styles.priceNewNumber}>
                ${isUpdating ? "..." : protectedPrice.toFixed(2)}
              </div>
              <div
                className={`${styles.priceDeltaTag} ${
                  priceDiff > 0 ? styles.deltaUp : priceDiff < 0 ? styles.deltaDown : styles.deltaNeutral
                }`}
              >
                {priceDiff > 0 ? `+${priceDiff.toFixed(2)} (+${(activeEvent.deltaPercent * 100).toFixed(0)}%)` : `${priceDiff.toFixed(2)} (${(activeEvent.deltaPercent * 100).toFixed(0)}%)`}
              </div>
            </div>

            <div className={styles.syncChannelLogs}>
              <div style={{ fontSize: "11px", fontWeight: 800, textTransform: "uppercase", color: "#64748b", marginBottom: "4px" }}>
                Multi-Channel Push Status (&lt; 45s)
              </div>

              <div className={styles.syncChannelRow}>
                <span className={styles.channelName}>Your Custom Storefront</span>
                <span className={styles.channelStatus}>✓ Updated: ${protectedPrice.toFixed(2)} (+0.4s)</span>
              </div>
              <div className={styles.syncChannelRow}>
                <span className={styles.channelName}>TCGplayer Direct / Pro</span>
                <span className={styles.channelStatus}>✓ Feed Synced: ${protectedPrice.toFixed(2)} (+1.2s)</span>
              </div>
              <div className={styles.syncChannelRow}>
                <span className={styles.channelName}>eBay Card Store</span>
                <span className={styles.channelStatus}>✓ Fee-Padded: ${(protectedPrice * 1.132).toFixed(2)} (+2.1s)</span>
              </div>
              <div className={styles.syncChannelRow}>
                <span className={styles.channelName}>Counter POS Scanner</span>
                <span className={styles.channelStatus}>✓ Barcode Locked (+0.2s)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
