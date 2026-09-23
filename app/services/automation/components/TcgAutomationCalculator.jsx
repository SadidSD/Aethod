"use client";

import { useState } from "react";
import styles from "./TcgAutomation.module.css";

export default function TcgAutomationCalculator() {
  const [weeklyOrders, setWeeklyOrders] = useState(400);

  // Math Calculations:
  // Repricing time saved: ~8 hrs/week
  // Packing time saved: ~2 minutes per order = (weeklyOrders * 2) / 60 hours
  const packingHoursSaved = Math.round((weeklyOrders * 2) / 60);
  const totalHoursSavedWeekly = 8 + packingHoursSaved;
  const monthlyLaborCostSaved = Math.round(totalHoursSavedWeekly * 4.33 * 22); // $22/hr staff wage

  // Margin protected from underpriced cards: estimated ~$0.90 per card/order from stale tournament prices
  const monthlyProtectedMargin = Math.round(weeklyOrders * 4.33 * 0.90);

  // Third-party repricer/shipping SaaS tool subscriptions (ChannelEngine/ChannelBlade/etc) ~ $350/mo
  const monthlySaaSSaved = 350;

  // Monthly Total Disconnected Busywork Drain
  const monthlyTotalDrain = monthlyLaborCostSaved + monthlyProtectedMargin + monthlySaaSSaved;
  const annualTotalDrain = monthlyTotalDrain * 12;

  // Payback period on typical $6,800 full suite installation
  const paybackMonths = (6800 / monthlyTotalDrain).toFixed(1);

  return (
    <div className={styles.componentCard}>
      <div className={styles.sectionBadge}>
        <span className={styles.badgeDot} />
        Retail Automation ROI Audit
      </div>

      <h3 className={styles.componentTitle}>
        Staff Busywork Drain vs. <span className={styles.componentTitleHighlight}>Autonomous Shop ROI</span>
      </h3>
      <p className={styles.componentDesc}>
        Manually checking competitor prices, typing shipping slips one-by-one, and updating spreadsheet quantities consumes hundreds of staff hours. See how fast autonomous infrastructure pays for itself.
      </p>

      {/* Slider */}
      <div className={styles.sliderWrapper}>
        <div className={styles.sliderHeader}>
          <span className={styles.sliderLabel}>Weekly Multi-Channel Orders Handled:</span>
          <span className={styles.sliderValue}>{weeklyOrders.toLocaleString()} orders / week</span>
        </div>

        <input
          type="range"
          min="100"
          max="2000"
          step="50"
          value={weeklyOrders}
          onChange={(e) => setWeeklyOrders(Number(e.target.value))}
          className={styles.rangeSlider}
        />

        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "var(--text-secondary, #64748b)" }}>
          <span>100 orders/wk (Local Card Store)</span>
          <span>400 orders/wk (Active Omnichannel Store)</span>
          <span>2,000 orders/wk (Regional Powerhouse)</span>
        </div>
      </div>

      {/* Comparison Grid */}
      <div className={styles.calcComparisonGrid}>
        {/* Left: Manual Busywork Drain */}
        <div className={styles.calcCardOld}>
          <div className={styles.calcCardTitle}>Manual Staff Busywork</div>
          <div className={styles.calcCardBigNumRed}>-${monthlyTotalDrain.toLocaleString()} <span style={{ fontSize: "14px", fontWeight: "600" }}>/ month</span></div>
          <div className={styles.calcCardSub}>Wasting <strong>-${annualTotalDrain.toLocaleString()}</strong> every year on manual labor and stale price leakages</div>

          <ul className={styles.calcPointsList}>
            <li className={styles.calcPointRed}>
              <span>✕</span>
              <span><strong>{totalHoursSavedWeekly} staff hours/week drained</strong> by manual repricing, packing slips, and card typing</span>
            </li>
            <li className={styles.calcPointRed}>
              <span>✕</span>
              <span><strong>~${monthlyProtectedMargin.toLocaleString()}/mo surrendered</strong> to sniped cards selling below market after tournament spikes</span>
            </li>
            <li className={styles.calcPointRed}>
              <span>✕</span>
              <span><strong>${monthlySaaSSaved}/mo ($4,200/yr)</strong> paid to third-party shipping and repricing SaaS apps</span>
            </li>
            <li className={styles.calcPointRed}>
              <span>✕</span>
              <span>Packing bottlenecks with staff copying tracking numbers one by one</span>
            </li>
          </ul>
        </div>

        {/* Right: Aeethod Autonomous Systems */}
        <div className={styles.calcCardNew}>
          <span className={styles.calcCardBadge}>100% Autonomous Pipeline</span>
          <div className={styles.calcCardTitle}>Aeethod Business Automation Suite</div>
          <div className={styles.calcCardBigNumGreen}>+${annualTotalDrain.toLocaleString()} <span style={{ fontSize: "14px", fontWeight: "600" }}>/ year recovered</span></div>
          <div className={styles.calcCardSub}>Recovering <strong>+${monthlyTotalDrain.toLocaleString()} / month</strong> in reclaimed staff labor and protected profits</div>

          <ul className={styles.calcPointsList}>
            <li className={styles.calcPointGreen}>
              <span>✓</span>
              <span><strong>{totalHoursSavedWeekly} hours/week freed</strong> for community tournaments, high-value grading, and sales</span>
            </li>
            <li className={styles.calcPointGreen}>
              <span>✓</span>
              <span><strong>Dynamic Market Repricer:</strong> Auto-updates prices within 60s of market shifts while protecting profit floors</span>
            </li>
            <li className={styles.calcPointGreen}>
              <span>✓</span>
              <span><strong>1-Click Thermal Batching:</strong> Print 50+ shipping labels and bin pick lists simultaneously</span>
            </li>
            <li className={styles.calcPointGreen}>
              <span>✓</span>
              <span><strong>0% Monthly SaaS fees:</strong> Runs on your dedicated private pipeline with zero ongoing platform cuts</span>
            </li>
          </ul>

          <div className={styles.paybackBanner}>
            <span className={styles.paybackIcon}>⚡</span>
            <span>Your custom automation suite pays for itself in approximately <strong>{paybackMonths} months</strong> of reclaimed labor and margin.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
