"use client";

import styles from "./TcgOperations.module.css";

const MATRIX_TIERS = [
  {
    grade: "NM",
    title: "Near Mint",
    payout: "100% Base Valuation",
    criteria: [
      "Zero surface scratching or print lines",
      "Sharp corners with flawless borders",
      "Minor centering imperfection allowed (up to 70/30)",
      "Clean foil reflection with zero clouding"
    ]
  },
  {
    grade: "LP",
    title: "Lightly Played",
    payout: "85% Base Valuation",
    criteria: [
      "Micro-whitening on 1–2 corner edges",
      "Faint surface scuff visible only under direct light",
      "No structural creasing or indentations",
      "Minor edge wear from binder shuffling"
    ]
  },
  {
    grade: "MP",
    title: "Moderately Played",
    payout: "70% Base Valuation",
    criteria: [
      "Moderate border edge wear across multiple sides",
      "Visible binder ding or micro-crease outside art frame",
      "Light foiling cloudiness or minor surface friction",
      "Acceptable for tournament play in opaque sleeves"
    ]
  },
  {
    grade: "HP",
    title: "Heavily Played",
    payout: "50% Base Valuation",
    criteria: [
      "Significant border whitening and corner rounding",
      "Creasing that does not pierce cardstock core",
      "Heavy surface scratching or minor liquid spot",
      "Definite sleeve-playable condition required"
    ]
  },
  {
    grade: "DMG",
    title: "Damaged",
    payout: "30% Base Valuation",
    criteria: [
      "Structural tear, puncture, or complete fold crease",
      "Severe liquid exposure or ink discoloration",
      "Missing card material or delaminating layers",
      "Purchased strictly for collection binder filling"
    ]
  }
];

export default function TcgGradingMatrix() {
  return (
    <div className={styles.componentCard}>
      <div className={styles.sectionBadge}>
        <span className={styles.badgeDot} />
        Zero-Subjectivity Quality Matrix
      </div>

      <h3 className={styles.componentTitle}>
        Standardized <span className={styles.componentTitleHighlight}>Condition Grading Matrix</span>
      </h3>
      <p className={styles.componentDesc}>
        Eliminate heated counter disputes and staff inconsistency. Aeethod encodes clear objective criteria directly into your POS, so every trade-in is evaluated against the exact same mathematical rules.
      </p>

      <div className={styles.gradingGrid}>
        {MATRIX_TIERS.map((tier) => (
          <div key={tier.grade} className={styles.gradeCard}>
            <div className={styles.gradeTag}>{tier.grade}</div>
            <div className={styles.gradeName}>{tier.title}</div>
            <div className={styles.gradePayout}>{tier.payout}</div>

            <ul className={styles.criteriaList}>
              {tier.criteria.map((item, idx) => (
                <li key={idx} className={styles.criteriaItem}>
                  <span className={styles.criteriaBullet}>•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
