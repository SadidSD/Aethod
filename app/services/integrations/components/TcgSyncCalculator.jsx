"use client";

import { useState, useCallback } from "react";
import styles from "./TcgIntegrations.module.css";

export default function TcgSyncCalculator() {
  const [weeklyOrders, setWeeklyOrders] = useState(500);
  const [staffHourlyRate, setStaffHourlyRate] = useState(18);

  const playClickSound = useCallback(() => {
    try {
      const audio = new Audio("/touchpad sd.mp3");
      audio.volume = 0.8;
      audio.play().catch(() => {});
    } catch (e) {
      /* ignore */
    }
  }, []);

  // Modeling staff labor spent manually managing multi-channel orders & delisting:
  // Roughly 3.5 minutes per order spent cross-checking stock, pulling listings, updating spreadsheets
  const weeklyHoursSpent = Math.round((weeklyOrders * 3.2) / 60);
  const annualLaborCost = Math.round(weeklyHoursSpent * staffHourlyRate * 52);

  // Third-party SaaS subscription cost (BinderPOS / ChannelEngine / Sellbrite avg $450/mo = $5,400/yr)
  const annualSaasCost = 5400;

  // Estimated cancellation & defect losses (1.2% double-sell rate without instant sync, avg $45 card = $270/mo = $3,240/yr)
  const annualDefectRisk = Math.round((weeklyOrders * 0.012) * 45 * 52);

  // Total annual drain
  const totalAnnualDrain = annualLaborCost + annualSaasCost + annualDefectRisk;
  const monthlyDrain = Math.round(totalAnnualDrain / 12);

  // Payback period on a $7,500 Omnichannel Tri-Sync integration
  const paybackMonths = (7500 / monthlyDrain).toFixed(1);

  const presets = [
    { label: "Small Boutique (150/wk)", orders: 150 },
    { label: "Active Card Shop (500/wk)", orders: 500 },
    { label: "High-Volume Powerhouse (1,200/wk)", orders: 1200 }
  ];

  return (
    <div className={styles.calculatorCard}>
      <div className={styles.calculatorHeader}>
        <div className={styles.simulatorBadge}>
          <span className={styles.pulseDot} />
          <span>MULTI-CHANNEL OPERATIONAL AUDIT</span>
        </div>
        <h3 className={styles.simulatorTitle}>
          Manual Delisting Drain vs. <span className={styles.accentText}>Automated Sync ROI</span>
        </h3>
        <p className={styles.simulatorDesc}>
          Managing TCGplayer, eBay, and your direct storefront manually wastes hundreds of staff hours and creates double-selling cancellations.
          Calculate how much time and money your shop recovers by switching to an automated, event-driven sync pipeline.
        </p>
      </div>

      {/* Interactive Controls */}
      <div className={styles.calcControlSection}>
        <div className={styles.volumeHeaderRow}>
          <span className={styles.calcLabel}>Weekly Orders Across All Channels:</span>
          <div className={styles.activeVolumeBadge}>
            {weeklyOrders.toLocaleString()} <span className={styles.perMonthText}>orders / week</span>
          </div>
        </div>

        {/* Range Slider */}
        <div className={styles.sliderWrapper}>
          <input
            type="range"
            min="100"
            max="2000"
            step="50"
            value={weeklyOrders}
            onChange={(e) => setWeeklyOrders(Number(e.target.value))}
            className={styles.volumeSlider}
          />
          <div className={styles.sliderScale}>
            <span>100 orders/wk</span>
            <span>500 orders/wk</span>
            <span>1,000 orders/wk</span>
            <span>2,000 orders/wk</span>
          </div>
        </div>

        {/* Preset Scenarios */}
        <div className={styles.presetRow}>
          <span className={styles.presetLabel}>Store Scale:</span>
          {presets.map((p, idx) => (
            <button
              key={idx}
              className={`${styles.presetBtn} ${weeklyOrders === p.orders ? styles.presetBtnActive : ""}`}
              onClick={() => {
                playClickSound();
                setWeeklyOrders(p.orders);
              }}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Results Comparison Grid */}
      <div className={styles.calcResultsGrid}>
        {/* Card 1: Disconnected Manual Operations */}
        <div className={styles.calcCostCard}>
          <div className={styles.calcCostHeader}>
            <span className={styles.calcPlatformName}>Disconnected Manual Operations</span>
            <span className={styles.commissionTaxTag}>Labor & Defect Drain</span>
          </div>

          <div className={styles.calcTakeHomeLabel}>Monthly Operating Overhead:</div>
          <div className={styles.calcBigNumberLoss}>
            -${monthlyDrain.toLocaleString()}
            <span className={styles.periodText}>/ month</span>
          </div>

          <div className={styles.calcAnnualSub}>
            Wasting <strong style={{ color: "#DC2626" }}>-${totalAnnualDrain.toLocaleString()}</strong> every single year in labor, SaaS fees, and cancellations
          </div>

          <ul className={styles.calcDisadvantagesList}>
            <li>✕ Staff spend <strong>{weeklyHoursSpent} hours/week</strong> manually updating listings & spreadsheets</li>
            <li>✕ Paying ~$450/mo ($5,400/yr) for third-party sync apps that lag 20+ minutes</li>
            <li>✕ Risk of out-of-stock cancellations (~${annualDefectRisk.toLocaleString()}/yr lost in refunds & penalties)</li>
            <li>✕ Disjointed packing queues with staff searching random binders</li>
          </ul>
        </div>

        {/* Card 2: Aeethod Real-Time Multi-Channel Pipeline */}
        <div className={styles.calcSavingsCard}>
          <div className={styles.calcSavingsHeader}>
            <span className={styles.calcPlatformName}>Aeethod Real-Time Sync Pipeline</span>
            <span className={styles.zeroCommissionTag}>100% Automated · You Own the Pipeline</span>
          </div>

          <div className={styles.calcTakeHomeLabel}>Net Operational Value Recovered:</div>
          <div className={styles.calcBigNumberGain}>
            +${totalAnnualDrain.toLocaleString()}
            <span className={styles.periodText}>/ year saved & recovered</span>
          </div>

          <div className={styles.calcMonthlySavingsSub}>
            Recovering <strong>+${monthlyDrain.toLocaleString()} / month</strong> in reclaimed labor and eliminated SaaS fees
          </div>

          <ul className={styles.calcAdvantagesList}>
            <li>✓ <strong>{weeklyHoursSpent} staff hours/week freed</strong> for grading, collection buying, and customer care</li>
            <li>✓ <strong>$0/month in third-party SaaS subscription taxes</strong> (You own the cloud pipeline)</li>
            <li>✓ <strong>Sub-3s auto-delisting</strong> wipes out double-selling and protects your seller ratings</li>
            <li>✓ Single unified packing queue sorted by physical bin location</li>
          </ul>

          <div className={styles.paybackBanner}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
            <span>
              Your custom integration pays for itself in approximately <strong>{paybackMonths} months</strong> of recovered staff efficiency.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
