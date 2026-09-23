"use client";

import { useState } from "react";
import styles from "./TcgOperations.module.css";

export default function TcgBuylistCalculator() {
  const [cardsPerWeek, setCardsPerWeek] = useState(500);

  // Calculations:
  // Manual lookup: ~3.5 minutes per card (search, condition check, manual math, writing notes)
  // With Aeethod intake: ~0.5 minutes per card
  // Time saved: 3.0 min per card = 0.05 hrs per card
  const hoursSavedPerWeek = Math.round(cardsPerWeek * 0.05);
  const monthlyLaborCostSaved = Math.round(hoursSavedPerWeek * 4.33 * 22); // $22/hr staff wage

  // Margin leak prevented: without automated matrices, shops overpay an average of $0.85 per card on subjective grading or outdated prices
  const monthlyOverpayPrevented = Math.round(cardsPerWeek * 4.33 * 0.85);

  // Third-party buylist tool subscription (BinderPOS/CardCastle/etc) ~ $250 - $450/mo
  const monthlySaaSSaved = 350;

  // Monthly Total Disconnected Overhead Drain
  const monthlyTotalDrain = monthlyLaborCostSaved + monthlyOverpayPrevented + monthlySaaSSaved;
  const annualTotalDrain = monthlyTotalDrain * 12;

  // Payback period for typical $6,900 installation
  const paybackMonths = (6900 / monthlyTotalDrain).toFixed(1);

  return (
    <div className={styles.componentCard}>
      <div className={styles.sectionBadge}>
        <span className={styles.badgeDot} />
        Trade-In Operations Audit
      </div>

      <h3 className={styles.componentTitle}>
        Manual Counter Drain vs. <span className={styles.componentTitleHighlight}>Standardized Trade-In ROI</span>
      </h3>
      <p className={styles.componentDesc}>
        Manually looking up cards across TCGplayer and spreadsheets wastes dozens of staff hours every week while leaking trade margin. See how fast an automated counter intake pipeline pays for itself.
      </p>

      {/* Interactive Volume Slider */}
      <div className={styles.sliderWrapper}>
        <div className={styles.sliderHeader}>
          <span className={styles.sliderLabel}>Trade-In Cards Processed at Counter:</span>
          <span className={styles.sliderValue}>{cardsPerWeek.toLocaleString()} cards / week</span>
        </div>

        <input
          type="range"
          min="100"
          max="2000"
          step="50"
          value={cardsPerWeek}
          onChange={(e) => setCardsPerWeek(Number(e.target.value))}
          className={styles.rangeSlider}
        />

        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "var(--text-secondary, #64748b)" }}>
          <span>100 cards/wk (Casual Local Shop)</span>
          <span>500 cards/wk (Active Tournament Hub)</span>
          <span>2,000 cards/wk (High-Volume Powerhouse)</span>
        </div>
      </div>

      {/* Symmetric Comparison Grid */}
      <div className={styles.calcComparisonGrid}>
        {/* Left: Manual Counter Drain */}
        <div className={styles.calcCardOld}>
          <div className={styles.calcCardTitle}>Manual Counter Operations</div>
          <div className={styles.calcCardBigNumRed}>-${monthlyTotalDrain.toLocaleString()} <span style={{ fontSize: "14px", fontWeight: "600" }}>/ month</span></div>
          <div className={styles.calcCardSub}>Wasting <strong>-${annualTotalDrain.toLocaleString()}</strong> every year in staff bottlenecks and margin bleed</div>

          <ul className={styles.calcPointsList}>
            <li className={styles.calcPointRed}>
              <span>✕</span>
              <span><strong>{hoursSavedPerWeek} staff hours/week wasted</strong> manually checking phone apps and typing card prices</span>
            </li>
            <li className={styles.calcPointRed}>
              <span>✕</span>
              <span><strong>~${monthlyOverpayPrevented.toLocaleString()}/mo lost</strong> to subjective grading inconsistencies and outdated market price data</span>
            </li>
            <li className={styles.calcPointRed}>
              <span>✕</span>
              <span><strong>${monthlySaaSSaved}/mo ($4,200/yr)</strong> drained by third-party buylist SaaS tools with rigid counter locks</span>
            </li>
            <li className={styles.calcPointRed}>
              <span>✕</span>
              <span>Frustrated counter lines on tournament nights as trades pile up</span>
            </li>
          </ul>
        </div>

        {/* Right: Aeethod Automated Intake Engine */}
        <div className={styles.calcCardNew}>
          <span className={styles.calcCardBadge}>100% Automated Counter Pipeline</span>
          <div className={styles.calcCardTitle}>Aeethod Counter Operations System</div>
          <div className={styles.calcCardBigNumGreen}>+${annualTotalDrain.toLocaleString()} <span style={{ fontSize: "14px", fontWeight: "600" }}>/ year recovered</span></div>
          <div className={styles.calcCardSub}>Recovering <strong>+${monthlyTotalDrain.toLocaleString()} / month</strong> in reclaimed labor and locked trade margin</div>

          <ul className={styles.calcPointsList}>
            <li className={styles.calcPointGreen}>
              <span>✓</span>
              <span><strong>{hoursSavedPerWeek} hours/week freed</strong> for customer service, tournament hosting, and slab grading</span>
            </li>
            <li className={styles.calcPointGreen}>
              <span>✓</span>
              <span><strong>Zero grading disputes:</strong> Objective criteria enforce exact NM/LP/MP discount spreads</span>
            </li>
            <li className={styles.calcPointGreen}>
              <span>✓</span>
              <span><strong>1-Click Thermal Print:</strong> Instant customer trade agreements and barcode label stickers</span>
            </li>
            <li className={styles.calcPointGreen}>
              <span>✓</span>
              <span><strong>0% Monthly SaaS fees:</strong> Runs on your dedicated infrastructure that you own forever</span>
            </li>
          </ul>

          <div className={styles.paybackBanner}>
            <span className={styles.paybackIcon}>⚡</span>
            <span>Your custom counter engine pays for itself in approximately <strong>{paybackMonths} months</strong> of recovered staff efficiency.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
