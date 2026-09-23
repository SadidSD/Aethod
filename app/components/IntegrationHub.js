'use client';

import { useState } from 'react';
import styles from './IntegrationHub.module.css';

/* ─── SVG Connection Paths ─────────────────────────────────────────────────
   ViewBox: 800 × 540. Central tile 160×160 at (400, 270).
   Connections run from tile edge → card edge.
   ─────────────────────────────────────────────────────────────────────── */
const CONNECTIONS = [
  { id: 'shopify',    d: 'M 380 250 C 340 180 300 135 265 115', begin: '0s'    },
  { id: 'ebay',       d: 'M 420 250 C 460 180 500 135 535 115', begin: '1.33s' },
  { id: 'tcgplayer',  d: 'M 370 270 C 310 270 240 270 180 270', begin: '2.67s' },
  { id: 'cardmarket', d: 'M 430 270 C 490 270 560 270 620 270', begin: '4s'    },
  { id: 'manapool',   d: 'M 380 290 C 340 360 300 405 265 425', begin: '5.33s' },
  { id: 'custom',     d: 'M 420 290 C 460 360 500 405 535 425', begin: '6.67s' },
];

/* ─── Platform data ────────────────────────────────────────────────────────
   CSS left/top are the card centre expressed as % of 800×540.
   ─────────────────────────────────────────────────────────────────────── */
const PLATFORMS = [
  { id: 'shopify',    name: 'Shopify',           style: { left: '26.875%', top: '18.52%' }, delay: '0s'   },
  { id: 'ebay',       name: 'eBay',              style: { left: '73.125%', top: '18.52%' }, delay: '0.9s' },
  { id: 'tcgplayer',  name: 'TCGplayer',         style: { left: '12.5%',   top: '50%'    }, delay: '1.8s' },
  { id: 'cardmarket', name: 'Cardmarket',        style: { left: '87.5%',   top: '50%'    }, delay: '2.7s' },
  { id: 'manapool',   name: 'ManaPool',          style: { left: '26.875%', top: '81.48%' }, delay: '3.6s' },
  { id: 'custom',     name: 'Custom Storefront', style: { left: '73.125%', top: '81.48%' }, delay: '4.5s' },
];

/* ─── Platform logo SVGs ───────────────────────────────────────────────── */

function ShopifyLogo() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-label="Shopify">
      <rect width="32" height="32" rx="7" fill="#F0FAF0"/>
      <path d="M20.6 7.4c-.1-.4-.4-.7-.8-.7l-.8-.1-.3-1c-.4-1.3-1.5-2.2-2.8-2.2-1.1 0-2.1.7-2.7 1.7l-.3.4-.4.1c-.5.1-.9.4-1 .9L10 25h12L20.6 7.4z" fill="#95BF47"/>
      <path d="M16 5.5c-.6 0-1.1.4-1.4 1h2.8c-.3-.6-.8-1-1.4-1z" fill="#5E8E3E"/>
      <text x="16" y="18.5" textAnchor="middle" fill="white" fontSize="7.5" fontWeight="700" fontFamily="system-ui, -apple-system, sans-serif">S</text>
    </svg>
  );
}

function EbayLogo() {
  return (
    <svg width="40" height="18" viewBox="0 0 80 32" fill="none" aria-label="eBay">
      <text fontFamily="Arial Black, Impact, sans-serif" fontWeight="900" fontSize="30" y="28">
        <tspan fill="#E53238">e</tspan>
        <tspan fill="#0064D2" dx="-1">b</tspan>
        <tspan fill="#F5AF02" dx="-1">a</tspan>
        <tspan fill="#86B817" dx="-1">y</tspan>
      </text>
    </svg>
  );
}

function TCGPlayerLogo() {
  return (
    <svg width="34" height="34" viewBox="0 0 34 34" fill="none" aria-label="TCGplayer">
      {/* Fan of 3 overlapping trading cards */}
      <g transform="rotate(-18 10 22)">
        <rect x="4" y="6" width="14" height="20" rx="2.5" fill="#4CAF50"/>
        <rect x="5" y="7" width="5" height="8" rx="1" fill="rgba(255,255,255,0.25)"/>
      </g>
      <g transform="rotate(-6 17 21)">
        <rect x="8" y="4" width="14" height="20" rx="2.5" fill="#2196F3"/>
        <rect x="9" y="5" width="5" height="8" rx="1" fill="rgba(255,255,255,0.25)"/>
      </g>
      <rect x="13" y="5" width="14" height="20" rx="2.5" fill="#FF5722"/>
      <rect x="14" y="6" width="5" height="9" rx="1" fill="rgba(255,255,255,0.3)"/>
    </svg>
  );
}

function CardmarketLogo() {
  return (
    <svg width="34" height="34" viewBox="0 0 34 34" fill="none" aria-label="Cardmarket">
      <rect width="34" height="34" rx="7" fill="#EEF3FC"/>
      {/* Playing card shape */}
      <rect x="7" y="6" width="13" height="19" rx="2" fill="#1A56C4"/>
      <text x="13.5" y="18.5" textAnchor="middle" fill="white" fontSize="7" fontWeight="800" fontFamily="system-ui, sans-serif">CM</text>
      {/* Arrow mark */}
      <path d="M22 15l5 3-5 3" stroke="#1A56C4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    </svg>
  );
}

function ManaPoolLogo() {
  return (
    <svg width="34" height="34" viewBox="0 0 34 34" fill="none" aria-label="ManaPool">
      {/* 4-pointed diamond gem — top quadrant */}
      <path d="M17 2L24 17L17 32L10 17Z" fill="#1565C0"/>
      {/* Inner diamond highlights for depth */}
      <path d="M17 2L24 17L17 17Z" fill="#1E88E5"/>
      <path d="M17 2L10 17L17 17Z" fill="#0D47A1"/>
      <path d="M17 32L24 17L17 17Z" fill="#0D47A1"/>
      <path d="M17 32L10 17L17 17Z" fill="#1565C0"/>
      <circle cx="17" cy="17" r="2.5" fill="rgba(255,255,255,0.7)"/>
    </svg>
  );
}

function StorefrontLogo() {
  return (
    <svg width="34" height="34" viewBox="0 0 34 34" fill="none" aria-label="Custom Storefront">
      {/* Open box / storefront */}
      <rect x="6" y="16" width="22" height="14" rx="2" stroke="#555E6B" strokeWidth="1.6" fill="none"/>
      {/* Lid open */}
      <path d="M6 16L10.5 9h13L28 16" stroke="#555E6B" strokeWidth="1.6" strokeLinejoin="round" fill="none"/>
      {/* Interior shelf line */}
      <line x1="10" y1="22" x2="24" y2="22" stroke="#99A0AB" strokeWidth="1.2"/>
      {/* Front panel */}
      <rect x="12" y="23" width="10" height="7" rx="1" fill="#E8EBF0" stroke="#C0C6D0" strokeWidth="1"/>
      <circle cx="17" cy="26.5" r="1" fill="#99A0AB"/>
    </svg>
  );
}

const LOGOS = { shopify: ShopifyLogo, ebay: EbayLogo, tcgplayer: TCGPlayerLogo, cardmarket: CardmarketLogo, manapool: ManaPoolLogo, custom: StorefrontLogo };

/* ─── Aeethod central "A" mark (authentic brand vector) ───────────────── */
function AeethodMark() {
  return (
    <svg
      width="64"
      height="64"
      viewBox="0 0 268 268"
      fill="none"
      aria-label="Aeethod"
      role="img"
      className={styles.aeethodLogoSvg}
    >
      <path
        d="M39.4444 196.903L3 262C3 262 44.1852 230.036 52.7778 225.359C61.3704 220.681 68.4864 214.519 80.3333 210.936C94.8183 206.555 104.346 205.92 119.444 208.208C138.419 211.083 152.926 222.11 163 228.477C163 226.528 147 209.377 147 209.377C142.556 203.92 117.667 178.973 103.444 173.515C89.2222 168.058 78.1111 170.007 67.8888 172.346C59.711 174.217 45.5185 189.497 39.4444 196.903Z"
        fill="#111111"
      />
      <path
        d="M132.607 3L68.678 132.197C68.678 132.197 47.8216 170.088 59.61 152.74C71.3984 135.392 97.0415 115.424 114.471 119.871C122.395 121.892 134.344 130.586 138.501 141.784C143.489 144.523 173.609 212.419 186.109 233.545C186.109 233.545 209.585 269.196 265 264.589L132.607 3Z"
        fill="#111111"
      />
    </svg>
  );
}

/* ─── Main Component ───────────────────────────────────────────────────── */
export default function IntegrationHub() {
  const [hovered, setHovered] = useState(null);
  const activeConn = hovered ? CONNECTIONS.find(c => c.id === hovered) : null;

  return (
    <section className={styles.section} id="integration-hub" aria-label="Aeethod Integration Ecosystem">
      <div className={styles.container}>

        {/* Left: Heading */}
        <div className={styles.headingCol}>
          <h2 className={styles.heading}>
            <span className={styles.headingLine1}>One Central System.</span>
            <span className={styles.headingLine2}>
              <span className={styles.highlight}>Every</span>{' '}
              <span className={styles.highlight}>Channel.</span>
            </span>
          </h2>
        </div>

        {/* Right: Diagram */}
        <div className={styles.visualCol}>
          <div
            className={styles.stage}
            role="img"
            aria-label="Integration diagram: Aeethod connected to Shopify, eBay, TCGplayer, Cardmarket, ManaPool, and Custom Storefront"
          >

            {/* ── SVG: Connections + Particles ──────────────────────── */}
            <svg
              className={styles.svgLayer}
              viewBox="0 0 800 540"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <defs>
                {/* Particle glow */}
                <filter id="ih-pglow" x="-150%" y="-150%" width="400%" height="400%">
                  <feGaussianBlur stdDeviation="3" result="blur"/>
                  <feMerge>
                    <feMergeNode in="blur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
                {/* Center ambient glow */}
                <radialGradient id="ih-cglow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%"   stopColor="#818CF8" stopOpacity="0.18"/>
                  <stop offset="100%" stopColor="#818CF8" stopOpacity="0"/>
                </radialGradient>
                {/* Particle gradient with luminous white core */}
                <radialGradient id="ih-pdot" cx="50%" cy="50%" r="50%">
                  <stop offset="0%"   stopColor="#ffffff"/>
                  <stop offset="40%"  stopColor="#c7d2fe"/>
                  <stop offset="100%" stopColor="#6366F1" stopOpacity="0.3"/>
                </radialGradient>
              </defs>

              {/* Center ambient bloom */}
              <ellipse cx="400" cy="270" rx="110" ry="90" fill="url(#ih-cglow)" className={styles.centerBloom}/>

              {/* Hidden path definitions for mpath */}
              {CONNECTIONS.map(c => (
                <path key={`def-${c.id}`} id={`ihp-${c.id}`} d={c.d}/>
              ))}

              {/* Visible connection lines (Dual-Layer: Ambient Glow + Crisp Minimal Core) */}
              {CONNECTIONS.map(c => (
                <g key={`conduit-${c.id}`}>
                  {/* Soft ambient glow aura */}
                  <path
                    d={c.d}
                    className={`${styles.conduitGlow} ${hovered === c.id ? styles.conduitGlowActive : ''}`}
                  />
                  {/* Crisp precision fiber core line */}
                  <path
                    d={c.d}
                    className={`${styles.conduitCore} ${hovered === c.id ? styles.conduitCoreActive : ''}`}
                  />
                </g>
              ))}

              {/* Staggered travelling particles (CSS-declarative SMIL) */}
              {CONNECTIONS.map(c => (
                <circle key={`pt-${c.id}`} r="4" fill="url(#ih-pdot)" filter="url(#ih-pglow)">
                  {/* Move: travels 0→100% of path in first 22% of 8 s cycle, then holds */}
                  <animateMotion
                    dur="8s"
                    begin={c.begin}
                    repeatCount="indefinite"
                    calcMode="spline"
                    keyTimes="0;0.22;1"
                    keyPoints="0;1;1"
                    keySplines="0.42 0 0.58 1;0 0 1 1"
                  >
                    <mpath href={`#ihp-${c.id}`}/>
                  </animateMotion>
                  {/* Opacity: fade in → visible → fade out → invisible */}
                  <animate
                    attributeName="opacity"
                    values="0;0.95;0.95;0;0"
                    keyTimes="0;0.04;0.19;0.25;1"
                    dur="8s"
                    begin={c.begin}
                    repeatCount="indefinite"
                  />
                </circle>
              ))}

              {/* Hover-active continuous particle on highlighted line */}
              {activeConn && (
                <circle r="4.5" fill="url(#ih-pdot)" filter="url(#ih-pglow)">
                  <animateMotion dur="2s" repeatCount="indefinite" calcMode="spline" keyTimes="0;1" keySplines="0.42 0 0.58 1">
                    <mpath href={`#ihp-${activeConn.id}`}/>
                  </animateMotion>
                </circle>
              )}
            </svg>

            {/* ── Central Inventory Nexus & Tiered Vault Pedestal ───────────── */}
            <div className={styles.centralNexus}>
              {/* Stacked Vault Tier 2 (Base Foundation) */}
              <div className={styles.vaultTier2} aria-hidden="true" />

              {/* Stacked Vault Tier 1 (Mid Bevel Deck) */}
              <div className={styles.vaultTier1} aria-hidden="true" />

              {/* Main Central Core Device */}
              <div
                className={`${styles.coreTile} ${hovered ? styles.coreTileActive : ''}`}
                aria-label="Aeethod — Central Inventory Master System"
              >
                {/* Upper Brand Section */}
                <div className={styles.coreLogoWell}>
                  <AeethodMark />
                </div>

                {/* Laser-Etched Hardware Seam */}
                <div className={styles.consoleDivider} aria-hidden="true" />

                {/* Integrated Hardware Telemetry Console */}
                <div className={styles.telemetryConsole}>
                  <div className={styles.consoleHeader}>
                    <span className={styles.consoleDot} aria-hidden="true" />
                    <span className={styles.consoleTitle}>CENTRAL INVENTORY</span>
                  </div>
                  <div className={styles.consoleSubline}>
                    REAL-TIME MASTER · 100% SYNC
                  </div>
                </div>
              </div>
            </div>

            {/* ── Platform Cards ────────────────────────────────────── */}
            {PLATFORMS.map(p => {
              const Logo = LOGOS[p.id];
              return (
                <div
                  key={p.id}
                  className={styles.cardAnchor}
                  style={p.style}
                >
                  <div
                    className={`${styles.card} ${hovered === p.id ? styles.cardHovered : ''}`}
                    style={{ '--float-delay': p.delay }}
                    onMouseEnter={() => setHovered(p.id)}
                    onMouseLeave={() => setHovered(null)}
                    onFocus={() => setHovered(p.id)}
                    onBlur={() => setHovered(null)}
                    role="button"
                    tabIndex={0}
                    aria-label={`${p.name} — Synced`}
                  >
                    <div className={styles.cardLogo}>
                      <Logo/>
                    </div>
                    <div className={styles.cardInfo}>
                      <span className={styles.cardName}>{p.name}</span>
                      <div className={styles.cardStatus}>
                        <span className={styles.dot} aria-hidden="true"/>
                        <span className={styles.syncedLabel}>Synced</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

          </div>
        </div>
      </div>
    </section>
  );
}
