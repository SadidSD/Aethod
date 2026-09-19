"use client";

import styles from "./LoadingSkeleton.module.css";

export default function LoadingSkeleton() {
  return (
    <div className={styles.skeletonContainer}>
      <div className={styles.metricsRow}>
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div key={i} className={styles.metricSkeletonCard}>
            <div className={styles.shimmerLineSm} />
            <div className={styles.shimmerLineLg} />
            <div className={styles.shimmerLineXs} />
          </div>
        ))}
      </div>

      <div className={styles.chartSkeletonCard}>
        <div className={styles.shimmerLineMed} />
        <div className={styles.chartShimmerArea} />
      </div>

      <div className={styles.twoColRow}>
        <div className={styles.colSkeletonCard}>
          <div className={styles.shimmerLineMed} />
          <div className={styles.shimmerBlock} />
        </div>
        <div className={styles.colSkeletonCard}>
          <div className={styles.shimmerLineMed} />
          <div className={styles.shimmerBlock} />
        </div>
      </div>
    </div>
  );
}
