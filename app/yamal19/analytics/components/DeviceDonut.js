"use client";

import { useState } from "react";
import styles from "./DeviceDonut.module.css";

export default function DeviceDonut({ devices = [] }) {
  const [hoveredIdx, setHoveredIdx] = useState(null);

  if (!devices || devices.length === 0) return null;

  const total = devices.reduce((sum, d) => sum + d.count, 0);

  // SVG Donut calculation
  const size = 180;
  const strokeWidth = 26;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;

  // Compute strokeDasharray offsets
  let accumulatedPercent = 0;
  const slices = devices.map((d, i) => {
    const strokeDasharray = `${(d.percentage / 100) * circumference} ${circumference}`;
    const strokeDashoffset = -((accumulatedPercent / 100) * circumference);
    accumulatedPercent += d.percentage;
    return { ...d, strokeDasharray, strokeDashoffset, index: i };
  });

  const activeDevice = hoveredIdx !== null ? devices[hoveredIdx] : devices[0];

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <div>
          <h2 className={styles.cardTitle}>Devices</h2>
          <p className={styles.cardSubtext}>Hardware distribution breakdown</p>
        </div>
        <span className={styles.totalBadge}>
          {total.toLocaleString()} total
        </span>
      </div>

      <div className={styles.donutContent}>
        {/* Donut SVG */}
        <div className={styles.donutWrapper}>
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className={styles.donutSvg}>
            {/* Background Track */}
            <circle
              cx={center}
              cy={center}
              r={radius}
              fill="none"
              stroke="currentColor"
              strokeWidth={strokeWidth}
              className={styles.trackCircle}
            />

            {/* Slices */}
            {slices.map((slice) => {
              const isHovered = hoveredIdx === slice.index;
              return (
                <circle
                  key={slice.type}
                  cx={center}
                  cy={center}
                  r={radius}
                  fill="none"
                  stroke={slice.color}
                  strokeWidth={isHovered ? strokeWidth + 4 : strokeWidth}
                  strokeDasharray={slice.strokeDasharray}
                  strokeDashoffset={slice.strokeDashoffset}
                  strokeLinecap="round"
                  className={styles.sliceCircle}
                  onMouseEnter={() => setHoveredIdx(slice.index)}
                  onMouseLeave={() => setHoveredIdx(null)}
                />
              );
            })}
          </svg>

          {/* Center Info */}
          <div className={styles.donutCenter}>
            <span className={styles.centerPercentage}>{activeDevice.percentage}%</span>
            <span className={styles.centerLabel}>{activeDevice.type}</span>
          </div>
        </div>

        {/* Legend List */}
        <div className={styles.legendList}>
          {devices.map((device, idx) => {
            const isSelected = hoveredIdx === idx;
            return (
              <div
                key={device.type}
                className={`${styles.legendRow} ${isSelected ? styles.legendRowHover : ""}`}
                onMouseEnter={() => setHoverIdx(idx)}
                onMouseLeave={() => setHoverIdx(null)}
              >
                <div className={styles.legendLeft}>
                  <span
                    className={styles.legendColorDot}
                    style={{ background: device.color }}
                  />
                  <span className={styles.legendTypeName}>{device.type}</span>
                </div>
                <div className={styles.legendRight}>
                  <span className={styles.legendCount}>{device.count.toLocaleString()}</span>
                  <span className={styles.legendPct}>{device.percentage}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
