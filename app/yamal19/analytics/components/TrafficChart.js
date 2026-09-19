"use client";

import { useState, useRef } from "react";
import styles from "./TrafficChart.module.css";

export default function TrafficChart({ data = [], rangeLabel = "Last 7 Days" }) {
  const [hoverIndex, setHoverIndex] = useState(null);
  const containerRef = useRef(null);

  if (!data || data.length === 0) return null;

  // Chart dimensions
  const svgWidth = 800;
  const svgHeight = 260;
  const padding = { top: 20, right: 30, bottom: 40, left: 45 };
  const chartWidth = svgWidth - padding.left - padding.right;
  const chartHeight = svgHeight - padding.top - padding.bottom;

  // Find max values for scale
  const maxPageviews = Math.max(...data.map((d) => d.pageviews), 10);
  const yMax = Math.ceil(maxPageviews * 1.15);

  // Compute point coordinates
  const points = data.map((d, i) => {
    const x = padding.left + (i / (data.length - 1 || 1)) * chartWidth;
    const yVisitors = padding.top + chartHeight - (d.visitors / yMax) * chartHeight;
    const yPageviews = padding.top + chartHeight - (d.pageviews / yMax) * chartHeight;
    return { ...d, x, yVisitors, yPageviews, index: i };
  });

  // Generate smooth cubic Bézier curve paths
  function createSmoothPath(pointsArray, yKey) {
    if (pointsArray.length === 0) return "";
    let d = `M ${pointsArray[0].x} ${pointsArray[0][yKey]}`;
    for (let i = 0; i < pointsArray.length - 1; i++) {
      const p0 = pointsArray[i === 0 ? 0 : i - 1];
      const p1 = pointsArray[i];
      const p2 = pointsArray[i + 1];
      const p3 = pointsArray[i + 2] || p2;

      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1[yKey] + (p2[yKey] - p0[yKey]) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2[yKey] - (p3[yKey] - p1[yKey]) / 6;

      d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2[yKey]}`;
    }
    return d;
  }

  const visitorsPath = createSmoothPath(points, "yVisitors");
  const pageviewsPath = createSmoothPath(points, "yPageviews");

  // Area paths (close to bottom)
  const bottomY = padding.top + chartHeight;
  const visitorsArea = `${visitorsPath} L ${points[points.length - 1].x} ${bottomY} L ${points[0].x} ${bottomY} Z`;
  const pageviewsArea = `${pageviewsPath} L ${points[points.length - 1].x} ${bottomY} L ${points[0].x} ${bottomY} Z`;

  // Horizontal grid lines (4 lines)
  const yTicks = [0, 0.33, 0.66, 1].map((pct) => {
    const val = Math.round(yMax * pct);
    const y = padding.top + chartHeight - pct * chartHeight;
    return { val, y };
  });

  // Calculate totals
  const totalVisitors = data.reduce((acc, cur) => acc + cur.visitors, 0);
  const totalPageviews = data.reduce((acc, cur) => acc + cur.pageviews, 0);

  const activePoint = hoverIndex !== null ? points[hoverIndex] : null;

  return (
    <div className={styles.chartCard} ref={containerRef}>
      {/* Header with Title & Legend */}
      <div className={styles.chartHeader}>
        <div>
          <h2 className={styles.chartTitle}>Traffic &amp; Pageviews</h2>
          <p className={styles.chartSubtext}>
            Daily audience velocity and aggregate page impressions ({rangeLabel})
          </p>
        </div>

        <div className={styles.legendContainer}>
          <div className={styles.legendItem}>
            <span className={`${styles.legendDot} ${styles.visitorsDot}`} />
            <div className={styles.legendMeta}>
              <span className={styles.legendLabel}>Visitors</span>
              <span className={styles.legendValue}>{totalVisitors.toLocaleString()}</span>
            </div>
          </div>

          <div className={styles.legendItem}>
            <span className={`${styles.legendDot} ${styles.pageviewsDot}`} />
            <div className={styles.legendMeta}>
              <span className={styles.legendLabel}>Pageviews</span>
              <span className={styles.legendValue}>{totalPageviews.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* SVG Chart Surface */}
      <div className={styles.svgWrapper}>
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className={styles.svgChart}
          preserveAspectRatio="none"
          onMouseLeave={() => setHoverIndex(null)}
        >
          <defs>
            {/* Visitors Gradient */}
            <linearGradient id="visitorsAreaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#7C5CFC" stopOpacity="0.22" />
              <stop offset="100%" stopColor="#7C5CFC" stopOpacity="0.0" />
            </linearGradient>

            {/* Pageviews Gradient */}
            <linearGradient id="pageviewsAreaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#60A5FA" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#60A5FA" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid Lines & Y Axis Ticks */}
          {yTicks.map((tick, idx) => (
            <g key={idx}>
              <line
                x1={padding.left}
                y1={tick.y}
                x2={svgWidth - padding.right}
                y2={tick.y}
                stroke="currentColor"
                className={styles.gridLine}
              />
              <text
                x={padding.left - 10}
                y={tick.y + 4}
                textAnchor="end"
                className={styles.axisLabel}
              >
                {tick.val}
              </text>
            </g>
          ))}

          {/* Area Fills */}
          <path d={pageviewsArea} fill="url(#pageviewsAreaGrad)" />
          <path d={visitorsArea} fill="url(#visitorsAreaGrad)" />

          {/* Line Strokes */}
          <path
            d={pageviewsPath}
            fill="none"
            stroke="#60A5FA"
            strokeWidth="2.5"
            strokeLinecap="round"
            className={styles.seriesLine}
          />
          <path
            d={visitorsPath}
            fill="none"
            stroke="#7C5CFC"
            strokeWidth="2.5"
            strokeLinecap="round"
            className={styles.seriesLine}
          />

          {/* X Axis Labels */}
          {points.map((p, idx) => (
            <text
              key={idx}
              x={p.x}
              y={svgHeight - 12}
              textAnchor="middle"
              className={styles.axisLabel}
            >
              {p.label}
            </text>
          ))}

          {/* Interactive Crosshair & Cursor Circles */}
          {activePoint && (
            <g>
              {/* Vertical Crosshair */}
              <line
                x1={activePoint.x}
                y1={padding.top}
                x2={activePoint.x}
                y2={bottomY}
                stroke="#7C5CFC"
                strokeWidth="1.5"
                strokeDasharray="4 4"
                opacity="0.6"
              />

              {/* Pageviews Circle */}
              <circle
                cx={activePoint.x}
                cy={activePoint.yPageviews}
                r="5"
                fill="#60A5FA"
                stroke="#FFFFFF"
                strokeWidth="2"
              />

              {/* Visitors Circle */}
              <circle
                cx={activePoint.x}
                cy={activePoint.yVisitors}
                r="6"
                fill="#7C5CFC"
                stroke="#FFFFFF"
                strokeWidth="2.5"
              />
            </g>
          )}

          {/* Invisible Overlay Hit Boxes for precise hover */}
          {points.map((p, idx) => {
            const widthPerPoint = chartWidth / points.length;
            const xHit = p.x - widthPerPoint / 2;
            return (
              <rect
                key={idx}
                x={xHit}
                y={padding.top}
                width={widthPerPoint}
                height={chartHeight}
                fill="transparent"
                onMouseEnter={() => setHoverIndex(idx)}
                style={{ cursor: "pointer" }}
              />
            );
          })}
        </svg>

        {/* Floating Tooltip */}
        {activePoint && (
          <div
            className={styles.tooltip}
            style={{
              left: `${(activePoint.x / svgWidth) * 100}%`,
              top: `${Math.min(activePoint.yVisitors, activePoint.yPageviews) - 10}px`,
            }}
          >
            <div className={styles.tooltipDate}>{activePoint.label}</div>
            <div className={styles.tooltipRow}>
              <span className={styles.tooltipDotVisitors} />
              <span className={styles.tooltipLabel}>Visitors:</span>
              <span className={styles.tooltipVal}>{activePoint.visitors.toLocaleString()}</span>
            </div>
            <div className={styles.tooltipRow}>
              <span className={styles.tooltipDotPageviews} />
              <span className={styles.tooltipLabel}>Pageviews:</span>
              <span className={styles.tooltipVal}>{activePoint.pageviews.toLocaleString()}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
