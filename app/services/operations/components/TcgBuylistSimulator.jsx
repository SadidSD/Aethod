"use client";

import { useState, useCallback } from "react";
import styles from "./TcgOperations.module.css";

const CARDS = [
  {
    id: "charizard",
    name: "Charizard VMAX (Shiny Vault)",
    set: "Shining Fates #SV107",
    marketPrice: 120.00,
    emoji: "🔥",
    game: "Pokémon TCG"
  },
  {
    id: "luffy",
    name: "Monkey D. Luffy (Manga Alt Art)",
    set: "Romance Dawn #OP01-024",
    marketPrice: 280.00,
    emoji: "🏴‍☠️",
    game: "One Piece Card Game"
  },
  {
    id: "mox",
    name: "Mox Diamond (Reserved List)",
    set: "Stronghold #Artifact",
    marketPrice: 650.00,
    emoji: "💎",
    game: "Magic: The Gathering"
  }
];

const CONDITIONS = [
  { code: "NM", name: "Near Mint", multiplier: 1.0 },
  { code: "LP", name: "Lightly Played", multiplier: 0.85 },
  { code: "MP", name: "Mod. Played", multiplier: 0.70 },
  { code: "HP", name: "Heavy Played", multiplier: 0.50 },
  { code: "DMG", name: "Damaged", multiplier: 0.30 }
];

export default function TcgBuylistSimulator() {
  const [selectedCard, setSelectedCard] = useState(CARDS[0]);
  const [condition, setCondition] = useState(CONDITIONS[0]);
  const [payoutMode, setPayoutMode] = useState("credit"); // 'cash' | 'credit'

  const playClickSound = useCallback(() => {
    try {
      const audio = new Audio("/touchpad sd.mp3");
      audio.volume = 0.8;
      audio.play().catch(() => {});
    } catch (e) {
      /* ignore */
    }
  }, []);

  // Calculation Logic
  // Base condition-adjusted market price
  const adjustedMarket = selectedCard.marketPrice * condition.multiplier;
  
  // Cash Rate = 60%, Store Credit Rate = 75% (15% Trade Boost)
  const cashOffer = adjustedMarket * 0.60;
  const creditOffer = adjustedMarket * 0.75;
  const currentOffer = payoutMode === "cash" ? cashOffer : creditOffer;
  
  // Store Margin Locked
  const storeProfitMargin = adjustedMarket - currentOffer;

  return (
    <div className={styles.componentCard}>
      <div className={styles.sectionBadge}>
        <span className={styles.badgeDot} />
        Live Counter Intake Terminal
      </div>

      <h3 className={styles.componentTitle}>
        Instant Buylist & <span className={styles.componentTitleHighlight}>Trade-In Valuation</span>
      </h3>
      <p className={styles.componentDesc}>
        Watch how Aeethod’s counter terminal replaces 45-minute manual price checks with instant market valuations, standardized condition discounts, and locked cash/credit margin spreads.
      </p>

      {/* Card Selector Bar */}
      <div className={styles.cardPickerBar}>
        {CARDS.map((card) => (
          <button
            key={card.id}
            className={`${styles.cardPickerBtn} ${selectedCard.id === card.id ? styles.cardPickerBtnActive : ""}`}
            onClick={() => {
              playClickSound();
              setSelectedCard(card);
            }}
          >
            <span>{card.emoji}</span>
            <span>{card.name}</span>
          </button>
        ))}
      </div>

      {/* Simulator Workspace */}
      <div className={styles.simulatorGrid}>
        {/* Left: Staff Intake Controls */}
        <div className={styles.intakePanel}>
          <div className={styles.cardDetailHeader}>
            <div className={styles.cardThumbnail}>{selectedCard.emoji}</div>
            <div>
              <h4 className={styles.cardMetaName}>{selectedCard.name}</h4>
              <div className={styles.cardMetaSub}>
                <span>{selectedCard.set}</span>
                <span>•</span>
                <span className={styles.marketTag}>TCG Market: ${selectedCard.marketPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Condition Grading Control */}
          <div className={styles.controlGroup}>
            <label className={styles.controlLabel}>1. Select Graded Condition (Standardized Matrix)</label>
            <div className={styles.conditionGrid}>
              {CONDITIONS.map((c) => (
                <button
                  key={c.code}
                  className={`${styles.conditionBtn} ${condition.code === c.code ? styles.conditionBtnActive : ""}`}
                  onClick={() => {
                    playClickSound();
                    setCondition(c);
                  }}
                >
                  <span className={styles.conditionCode}>{c.code}</span>
                  <span className={styles.conditionRate}>{Math.round(c.multiplier * 100)}% Val</span>
                </button>
              ))}
            </div>
          </div>

          {/* Payout Mode Control */}
          <div className={styles.controlGroup}>
            <label className={styles.controlLabel}>2. Choose Payout Method</label>
            <div className={styles.payoutModeGroup}>
              <button
                className={`${styles.payoutModeBtn} ${payoutMode === "cash" ? styles.payoutModeBtnActive : ""}`}
                onClick={() => {
                  playClickSound();
                  setPayoutMode("cash");
                }}
              >
                <span className={styles.payoutTitle}>Cash Payout</span>
                <span className={styles.payoutSub}>60% Market Offer</span>
              </button>

              <button
                className={`${styles.payoutModeBtn} ${payoutMode === "credit" ? styles.payoutModeBtnActive : ""}`}
                onClick={() => {
                  playClickSound();
                  setPayoutMode("credit");
                }}
              >
                <span className={styles.payoutBadge}>+15% Boost</span>
                <span className={styles.payoutTitle}>Store Credit</span>
                <span className={styles.payoutSub}>75% Market Offer</span>
              </button>
            </div>
          </div>

          {/* Margin Protection Pill */}
          <div className={styles.marginCallout}>
            <span>🔒 Locked Counter Margin:</span>
            <span className={styles.marginCalloutVal}>
              +${storeProfitMargin.toFixed(2)} ({payoutMode === "cash" ? "40% Spread" : "25% Reinvested Credit"})
            </span>
          </div>
        </div>

        {/* Right: Real-Time Thermal Counter Slip Preview */}
        <div className={styles.receiptPanel}>
          <div>
            <div className={styles.receiptHeader}>
              <div className={styles.receiptShopName}>AEETHOD CARD SHOP POS</div>
              <p className={styles.receiptMeta}>COUNTER INTAKE SLIP #TR-8821</p>
              <p className={styles.receiptMeta}>{new Date().toLocaleDateString()} • REGISTER 01</p>
            </div>

            <div className={styles.receiptRows}>
              <div className={styles.receiptRow}>
                <span className={styles.receiptLabel}>Item:</span>
                <span className={styles.receiptValue}>{selectedCard.name.slice(0, 20)}...</span>
              </div>
              <div className={styles.receiptRow}>
                <span className={styles.receiptLabel}>Game/Set:</span>
                <span className={styles.receiptValue}>{selectedCard.game}</span>
              </div>
              <div className={styles.receiptRow}>
                <span className={styles.receiptLabel}>Condition:</span>
                <span className={styles.receiptValue}>{condition.code} ({condition.name})</span>
              </div>
              <div className={styles.receiptRow}>
                <span className={styles.receiptLabel}>Market Base:</span>
                <span className={styles.receiptValue}>${selectedCard.marketPrice.toFixed(2)}</span>
              </div>
              <div className={styles.receiptRow}>
                <span className={styles.receiptLabel}>Condition Adjusted:</span>
                <span className={styles.receiptValue}>${adjustedMarket.toFixed(2)}</span>
              </div>

              <div className={styles.receiptDivider} />

              <div className={styles.receiptRow}>
                <span className={styles.receiptLabel}>Payout Method:</span>
                <span className={styles.receiptValue}>
                  {payoutMode === "cash" ? "Direct Cash" : "Store Credit Voucher"}
                </span>
              </div>
              {payoutMode === "credit" && (
                <div className={styles.receiptRow}>
                  <span className={styles.receiptLabel}>Trade Boost Perk:</span>
                  <span className={styles.receiptValue} style={{ color: "#10b981" }}>+15% Included</span>
                </div>
              )}

              <div className={styles.payoutHighlightRow}>
                <span className={styles.payoutTotalLabel}>Customer Payout:</span>
                <span className={styles.payoutTotalAmount}>${currentOffer.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className={styles.receiptBarcode}>
            <div className={styles.barcodeLines}>||| | |||| | ||| |||| |</div>
            <div className={styles.barcodeNum}>TR8821-POS-AETH</div>
          </div>
        </div>
      </div>
    </div>
  );
}
