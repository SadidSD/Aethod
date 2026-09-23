"use client";

import { useState, useCallback } from "react";
import styles from "./TcgComponents.module.css";

export default function TcgCommissionCalculator() {
  const [monthlyVolume, setMonthlyVolume] = useState(35000);

  const playClickSound = useCallback(() => {
    try {
      const audio = new Audio("/touchpad sd.mp3");
      audio.volume = 0.8;
      audio.play().catch(() => {});
    } catch (e) {
      /* ignore */
    }
  }, []);

  // Marketplace fee rate: ~13.2% (TCGplayer direct / eBay seller fees + transaction fees)
  const marketFeeRate = 0.132;
  const marketFeeMonthly = Math.round(monthlyVolume * marketFeeRate);
  const marketNetMonthly = monthlyVolume - marketFeeMonthly;
  const marketFeeAnnual = marketFeeMonthly * 12;

  // Direct storefront payment processing: Stripe standard 2.9% + $0.30/tx (~3.2% effective)
  const directFeeRate = 0.032;
  const directFeeMonthly = Math.round(monthlyVolume * directFeeRate);
  const directNetMonthly = monthlyVolume - directFeeMonthly;
  const directFeeAnnual = directFeeMonthly * 12;

  // Extra net margin retained in shop owner's pocket
  const monthlySaved = marketFeeMonthly - directFeeMonthly;
  const annualSaved = monthlySaved * 12;

  // Estimated payback period on custom platform (~$8,500 turnkey investment)
  const paybackMonths = (8500 / monthlySaved).toFixed(1);

  const presets = [10000, 25000, 50000, 100000];

  return (
    <div className={styles.calculatorCard}>
      <div className={styles.calculatorHeader}>
        <div className={styles.simulatorBadge}>
          <span className={styles.pulseDot} />
          <span>PROFIT MARGIN AUDIT</span>
        </div>
        <h3 className={styles.simulatorTitle}>
          Marketplace Fee Bleed vs. <span className={styles.accentText}>Direct Profit Calculator</span>
        </h3>
        <p className={styles.simulatorDesc}>
          When you sell cards on TCGplayer or eBay, you surrender 12% to 15% of your gross revenue on every single order, and they retain all customer contact info.
          See how much net margin your card business recovers by routing sales through your own custom Aeethod storefront.
        </p>
      </div>

      {/* Interactive Controls */}
      <div className={styles.calcControlSection}>
        <div className={styles.volumeHeaderRow}>
          <span className={styles.calcLabel}>Estimated Monthly Online Card Sales:</span>
          <div className={styles.activeVolumeBadge}>
            ${monthlyVolume.toLocaleString()} <span className={styles.perMonthText}>/ month</span>
          </div>
        </div>

        {/* Range Slider */}
        <div className={styles.sliderWrapper}>
          <input
            type="range"
            min="10000"
            max="150000"
            step="5000"
            value={monthlyVolume}
            onChange={(e) => setMonthlyVolume(Number(e.target.value))}
            className={styles.volumeSlider}
          />
          <div className={styles.sliderScale}>
            <span>$10,000/mo</span>
            <span>$50,000/mo</span>
            <span>$100,000/mo</span>
            <span>$150,000/mo</span>
          </div>
        </div>

        {/* Quick Preset Buttons */}
        <div className={styles.presetRow}>
          <span className={styles.presetLabel}>Quick Scenarios:</span>
          {presets.map((val) => (
            <button
              key={val}
              className={`${styles.presetBtn} ${monthlyVolume === val ? styles.presetBtnActive : ""}`}
              onClick={() => {
                playClickSound();
                setMonthlyVolume(val);
              }}
            >
              ${(val / 1000).toFixed(0)}k / mo
            </button>
          ))}
        </div>
      </div>

      {/* Results Comparison Grid */}
      <div className={styles.calcResultsGrid}>
        {/* Card 1: Third-Party Marketplaces (TCGplayer / eBay) */}
        <div className={styles.calcCostCard}>
          <div className={styles.calcCostHeader}>
            <span className={styles.calcPlatformName}>TCGplayer & eBay Marketplaces</span>
            <span className={styles.commissionTaxTag}>~13.2% Fee Cut</span>
          </div>

          <div className={styles.calcTakeHomeLabel}>Net Monthly Payout to You:</div>
          <div className={styles.calcBigNumberLoss}>
            ${marketNetMonthly.toLocaleString()}
            <span className={styles.periodText}>/ month</span>
          </div>

          <div className={styles.calcAnnualSub}>
            Surrendering <strong style={{ color: "#DC2626" }}>-${marketFeeMonthly.toLocaleString()}/mo</strong> (-${marketFeeAnnual.toLocaleString()}/yr) in platform commissions
          </div>

          <ul className={styles.calcDisadvantagesList}>
            <li>✕ Marketplaces take ${marketFeeMonthly.toLocaleString()} from your ${monthlyVolume.toLocaleString()} sales</li>
            <li>✕ You cannot email or re-target your buyers</li>
            <li>✕ Competitor listings shown directly next to your cards</li>
            <li>✕ Subject to sudden fee increases & policy changes</li>
          </ul>
        </div>

        {/* Card 2: Your Own Aeethod Storefront (Green / Highlighted) */}
        <div className={styles.calcSavingsCard}>
          <div className={styles.calcSavingsHeader}>
            <span className={styles.calcPlatformName}>Your Own Aeethod Storefront</span>
            <span className={styles.zeroCommissionTag}>0% Marketplace Commission</span>
          </div>

          <div className={styles.calcTakeHomeLabel}>Net Monthly Payout to You:</div>
          <div className={styles.calcBigNumberGain}>
            ${directNetMonthly.toLocaleString()}
            <span className={styles.periodText}>/ month</span>
          </div>

          <div className={styles.calcMonthlySavingsSub}>
            Only standard Stripe ~3.2% processing (-${directFeeMonthly.toLocaleString()}/mo) · <strong>0% platform cut</strong>
          </div>

          <ul className={styles.calcAdvantagesList}>
            <li>✓ You keep an extra <strong style={{ color: "#059669" }}>+${monthlySaved.toLocaleString()} every single month</strong></li>
            <li>✓ Extra cash retained: <strong style={{ color: "#059669" }}>+${annualSaved.toLocaleString()} / year</strong> in pure profit</li>
            <li>✓ You own every customer email, phone number & purchase history</li>
            <li>✓ Full custom brand identity with zero competitor ads</li>
          </ul>

          <div className={styles.paybackBanner}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
            <span>
              Recovering <strong>+${monthlySaved.toLocaleString()}/mo</strong> pays for your custom storefront in approx <strong>{paybackMonths} months</strong>.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
