'use client';

import React, { useState } from 'react';
import styles from './OmnichannelSyncSection.module.css';

export default function OmnichannelSyncSection() {
  const [activeChannel, setActiveChannel] = useState(null);
  const [isCoreHovered, setIsCoreHovered] = useState(false);

  return (
    <section className={styles.section} id="omnichannel-sync" aria-label="One Central System. Every Channel.">
      <div className={styles.container}>
        <div className={styles.grid}>

          {/* ============================================================
              LEFT: Two-Line Heading + Subline + Stat Row
              ============================================================ */}
          <div className={styles.narrativeCol}>
            <h2 className={styles.heading}>
              <span className={styles.lineOne}>One Central System.</span>
              <span className={styles.lineTwo}>
                <span className={styles.highlight}>Every</span>{' '}
                <span className={styles.highlight}>Channel.</span>
              </span>
            </h2>


          </div>

          {/* ============================================================
              RIGHT: Premium Neumorphic Sovereign Hub Diagram
              ============================================================ */}
          <div className={styles.visualizerCol}>
            <div className={styles.diagramStage}>

              {/* Ethereal Luminous Ambient Floor Glow */}
              <div className={styles.floorBackglow} />

              {/* ============================================================
                  SVG LAYER: Smooth Bézier Conduit Streams + Energy Packets
                  ============================================================ */}
              <svg
                className={styles.streamsSvg}
                viewBox="0 0 720 480"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  {/* Ambient base gradient for each conduit */}
                  <linearGradient id="sg_store" x1="360" y1="190" x2="360" y2="115" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#818CF8" stopOpacity="0.55" />
                    <stop offset="100%" stopColor="#C084FC" stopOpacity="0.15" />
                  </linearGradient>
                  <linearGradient id="sg_tcg" x1="315" y1="210" x2="195" y2="145" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#818CF8" stopOpacity="0.55" />
                    <stop offset="100%" stopColor="#60A5FA" stopOpacity="0.12" />
                  </linearGradient>
                  <linearGradient id="sg_shopify" x1="405" y1="210" x2="525" y2="145" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#818CF8" stopOpacity="0.55" />
                    <stop offset="100%" stopColor="#34D399" stopOpacity="0.12" />
                  </linearGradient>
                  <linearGradient id="sg_ebay" x1="295" y1="240" x2="185" y2="255" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#818CF8" stopOpacity="0.55" />
                    <stop offset="100%" stopColor="#A78BFA" stopOpacity="0.12" />
                  </linearGradient>
                  <linearGradient id="sg_cm" x1="425" y1="240" x2="535" y2="255" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#818CF8" stopOpacity="0.55" />
                    <stop offset="100%" stopColor="#FBBF24" stopOpacity="0.12" />
                  </linearGradient>
                  <linearGradient id="sg_mp" x1="315" y1="270" x2="205" y2="355" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#818CF8" stopOpacity="0.55" />
                    <stop offset="100%" stopColor="#38BDF8" stopOpacity="0.12" />
                  </linearGradient>
                  <linearGradient id="sg_pos" x1="405" y1="270" x2="515" y2="355" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#818CF8" stopOpacity="0.55" />
                    <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.12" />
                  </linearGradient>

                  <linearGradient id="activeBeam" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#6366F1" />
                    <stop offset="100%" stopColor="#A855F7" />
                  </linearGradient>

                  <filter id="beamGlow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="6" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>

                  <filter id="nodotGlow" x="-100%" y="-100%" width="300%" height="300%">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                {/* ── 1. Conduit → Your Store (top, vertical Bézier) ─── */}
                <path
                  d="M 360 190 C 380 165 380 138 360 115"
                  stroke="url(#sg_store)"
                  className={`${styles.streamBase} ${activeChannel === 'store' || isCoreHovered ? styles.streamBaseActive : ''}`}
                />
                <path
                  d="M 360 190 C 380 165 380 138 360 115"
                  className={`${styles.streamPacket} ${activeChannel === 'store' || isCoreHovered ? styles.streamPacketActive : ''}`}
                />

                {/* ── 2. Conduit → TCGplayer (top-left arc) ─────────── */}
                <path
                  d="M 315 210 C 280 182 218 162 195 145"
                  stroke="url(#sg_tcg)"
                  className={`${styles.streamBase} ${activeChannel === 'tcg' || isCoreHovered ? styles.streamBaseActive : ''}`}
                />
                <path
                  d="M 315 210 C 280 182 218 162 195 145"
                  className={`${styles.streamPacket} ${activeChannel === 'tcg' || isCoreHovered ? styles.streamPacketActive : ''}`}
                />

                {/* ── 3. Conduit → Shopify (top-right arc) ──────────── */}
                <path
                  d="M 405 210 C 440 182 502 162 525 145"
                  stroke="url(#sg_shopify)"
                  className={`${styles.streamBase} ${activeChannel === 'shopify' || isCoreHovered ? styles.streamBaseActive : ''}`}
                />
                <path
                  d="M 405 210 C 440 182 502 162 525 145"
                  className={`${styles.streamPacket} ${activeChannel === 'shopify' || isCoreHovered ? styles.streamPacketActive : ''}`}
                />

                {/* ── 4. Conduit → eBay (left horizontal arc) ───────── */}
                <path
                  d="M 295 240 C 252 240 212 250 185 255"
                  stroke="url(#sg_ebay)"
                  className={`${styles.streamBase} ${activeChannel === 'ebay' || isCoreHovered ? styles.streamBaseActive : ''}`}
                />
                <path
                  d="M 295 240 C 252 240 212 250 185 255"
                  className={`${styles.streamPacket} ${activeChannel === 'ebay' || isCoreHovered ? styles.streamPacketActive : ''}`}
                />

                {/* ── 5. Conduit → Cardmarket (right horizontal arc) ── */}
                <path
                  d="M 425 240 C 468 240 508 250 535 255"
                  stroke="url(#sg_cm)"
                  className={`${styles.streamBase} ${activeChannel === 'cardmarket' || isCoreHovered ? styles.streamBaseActive : ''}`}
                />
                <path
                  d="M 425 240 C 468 240 508 250 535 255"
                  className={`${styles.streamPacket} ${activeChannel === 'cardmarket' || isCoreHovered ? styles.streamPacketActive : ''}`}
                />

                {/* ── 6. Conduit → ManaPool (bottom-left arc) ───────── */}
                <path
                  d="M 315 270 C 280 308 222 336 205 355"
                  stroke="url(#sg_mp)"
                  className={`${styles.streamBase} ${activeChannel === 'manapool' || isCoreHovered ? styles.streamBaseActive : ''}`}
                />
                <path
                  d="M 315 270 C 280 308 222 336 205 355"
                  className={`${styles.streamPacket} ${activeChannel === 'manapool' || isCoreHovered ? styles.streamPacketActive : ''}`}
                />

                {/* ── 7. Conduit → POS (bottom-right arc) ───────────── */}
                <path
                  d="M 405 270 C 440 308 498 336 515 355"
                  stroke="url(#sg_pos)"
                  className={`${styles.streamBase} ${activeChannel === 'pos' || isCoreHovered ? styles.streamBaseActive : ''}`}
                />
                <path
                  d="M 405 270 C 440 308 498 336 515 355"
                  className={`${styles.streamPacket} ${activeChannel === 'pos' || isCoreHovered ? styles.streamPacketActive : ''}`}
                />

                {/* Connection node dots at card terminals */}
                {[
                  { cx: 360, cy: 115 }, { cx: 195, cy: 145 }, { cx: 525, cy: 145 },
                  { cx: 185, cy: 255 }, { cx: 535, cy: 255 }, { cx: 205, cy: 355 }, { cx: 515, cy: 355 },
                ].map((pt, i) => (
                  <circle
                    key={i}
                    cx={pt.cx}
                    cy={pt.cy}
                    r="4"
                    className={styles.terminalNode}
                    filter="url(#nodotGlow)"
                  />
                ))}
              </svg>

              {/* ============================================================
                  MINIATURE HOLOGRAPHIC TCG CARDS IN FLIGHT
                  ============================================================ */}
              {[
                { cls: styles.flyStore,      bg: 'linear-gradient(135deg, #FF6B4A 0%, #C2410C 100%)', symbol: '⚡' },
                { cls: styles.flyTcg,        bg: 'linear-gradient(135deg, #EA580C 0%, #991B1B 100%)', symbol: '🔥' },
                { cls: styles.flyShopify,    bg: 'linear-gradient(135deg, #0284C7 0%, #1E3A8A 100%)', symbol: '💧' },
                { cls: styles.flyEbay,       bg: 'linear-gradient(135deg, #8B5CF6 0%, #581C87 100%)', symbol: '👁️' },
                { cls: styles.flyCardmarket, bg: 'linear-gradient(135deg, #F59E0B 0%, #B45309 100%)', symbol: '⚡' },
                { cls: styles.flyManapool,   bg: 'linear-gradient(135deg, #06B6D4 0%, #0369A1 100%)', symbol: '🌊' },
                { cls: styles.flyPos,        bg: 'linear-gradient(135deg, #D97706 0%, #78350F 100%)', symbol: '🐾' },
              ].map((card, i) => (
                <div key={i} className={`${styles.flyingMiniCard} ${card.cls}`}>
                  <div className={styles.miniCardShell} style={{ background: card.bg }}>
                    <div className={styles.miniCardFoil} />
                    <span className={styles.miniCardSymbol}>{card.symbol}</span>
                  </div>
                </div>
              ))}

              {/* ============================================================
                  CENTRAL SOVEREIGN CORE — SVG Isometric 3D Hex Prism
                  ============================================================ */}
              <div
                className={`${styles.centralHexPodium} ${isCoreHovered ? styles.podiumHovered : ''}`}
                onMouseEnter={() => setIsCoreHovered(true)}
                onMouseLeave={() => setIsCoreHovered(false)}
                title="Aeethod Sovereign Core"
              >
                <div className={styles.hexUnderglow} />

                {/* SVG Isometric Hexagonal Prism
                    Pointy-top hex, center (65,36), radius 32px
                    Vertices: top(65,4) TR(93,20) BR(93,52) btm(65,68) BL(37,52) TL(37,20)
                    Depth = 20px (bottom section only, front-facing)
                    Left face:  BL(37,52) btm(65,68) btm_d(65,88) BL_d(37,72)
                    Right face: btm(65,68) BR(93,52) BR_d(93,72) btm_d(65,88)
                */}
                <svg
                  className={styles.hexPrismSvg}
                  viewBox="0 0 130 96"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <linearGradient id="hexTopGrad" x1="65" y1="4" x2="65" y2="68" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor="#FFFFFF" />
                      <stop offset="100%" stopColor="#E8EFFF" />
                    </linearGradient>
                    <linearGradient id="hexTopGradDark" x1="65" y1="4" x2="65" y2="68" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor="#2E2E4E" />
                      <stop offset="100%" stopColor="#1E1E34" />
                    </linearGradient>
                    <linearGradient id="monoGrad" x1="48" y1="16" x2="82" y2="56" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#818CF8" />
                      <stop offset="1" stopColor="#C084FC" />
                    </linearGradient>
                    <filter id="prismGlow" x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur stdDeviation="3" result="blur" />
                      <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </defs>

                  {/* Left face (medium shade) */}
                  <polygon
                    points="37,52 65,68 65,88 37,72"
                    className={styles.hexFaceLeft}
                  />
                  {/* Right face (darkest shade) */}
                  <polygon
                    points="65,68 93,52 93,72 65,88"
                    className={styles.hexFaceRight}
                  />
                  {/* Top face (lightest) */}
                  <polygon
                    points="65,4 93,20 93,52 65,68 37,52 37,20"
                    className={styles.hexFaceTop}
                  />

                  {/* Rim highlight — top-right edge catches ambient light */}
                  <polyline
                    points="37,20 65,4 93,20 93,52"
                    stroke="rgba(255,255,255,0.88)"
                    strokeWidth="1.5"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={styles.hexRimLight}
                  />
                  {/* Bottom edge seam light */}
                  <line
                    x1="37" y1="72" x2="93" y2="72"
                    stroke="rgba(255,255,255,0.18)"
                    strokeWidth="1"
                    className={styles.hexBottomSeam}
                  />

                  {/* Aeethod "A" Monogram — centered on top face at ~(65, 36) */}
                  <path
                    d="M65 16L76.5 46H71L68.5 39.5H61.5L59 46H53.5L65 16ZM63.5 35H66.5L65 30L63.5 35Z"
                    fill="url(#monoGrad)"
                    filter="url(#prismGlow)"
                  />
                </svg>

                {/* Telemetry Fascia — below the prism */}
                <div className={styles.hexFrontFascia}>
                  <div className={styles.fasciaInner}>
                    <span className={styles.fasciaTitle}>CENTRAL INVENTORY</span>
                    <div className={styles.fasciaMeta}>
                      <span className={styles.emeraldPulseDot} />
                      <span className={styles.fasciaLiveText}>Live · 12,482 items</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* ============================================================
                  THE 7 PREMIUM NEUMORPHIC CHANNEL CARDS
                  ============================================================ */}

              {/* ── CARD 1: Your Store — Top Center ───────────────────── */}
              <div
                className={`${styles.channelCard} ${styles.cardYourStore} ${activeChannel === 'store' ? styles.cardActive : ''}`}
                onMouseEnter={() => setActiveChannel('store')}
                onMouseLeave={() => setActiveChannel(null)}
              >
                <div className={styles.cardHeaderSmall}>
                  <div>
                    <div className={styles.cardTitleStrong}>Your Store</div>
                    <div className={styles.cardSubtitleMuted}>Custom Storefront</div>
                  </div>
                  <span className={styles.liveBadge}>Live</span>
                </div>
                <div className={styles.miniStorePreview}>
                  <div className={styles.miniStoreNav}>
                    <div className={styles.miniDots}>
                      <span /><span /><span />
                    </div>
                    <div className={styles.miniSearchBar}>
                      <div className={styles.miniSearchText} />
                    </div>
                  </div>
                  <div className={styles.miniStoreHero}>
                    <div className={styles.miniStoreCardThumb}>
                      <div className={styles.miniCardSheen} />
                    </div>
                    <div className={styles.miniStoreLines}>
                      <div className={styles.miniStoreLine1} />
                      <div className={styles.miniStoreLine2} />
                      <div className={styles.miniStoreBadges}>
                        <span className={styles.miniPill} />
                        <span className={styles.miniPill} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* ── CARD 2: TCGplayer — Top Left (Charizard ex) ───────── */}
              <div
                className={`${styles.channelCard} ${styles.cardTcg} ${activeChannel === 'tcg' ? styles.cardActive : ''}`}
                onMouseEnter={() => setActiveChannel('tcg')}
                onMouseLeave={() => setActiveChannel(null)}
              >
                <div className={styles.cardTopRow}>
                  <div className={styles.cardBrandRow}>
                    <div className={styles.logoTcg}>
                      <span style={{ background: '#005CB9' }} />
                      <span style={{ background: '#FF5A00' }} />
                      <span style={{ background: '#E51A24' }} />
                      <span style={{ background: '#009E49' }} />
                    </div>
                    <span className={styles.brandName}>TCGplayer</span>
                  </div>
                  <span className={styles.liveBadge}>Live</span>
                </div>
                <div className={styles.cardItemRow}>
                  <div className={`${styles.pokemonCardMini} ${styles.cardCharizard}`}>
                    <div className={styles.cardFoilOverlay} />
                    <div className={styles.cardFrame} />
                    <div className={styles.cardHeaderMicro}>
                      <span className={styles.cardMicroHp}>HP 330</span>
                      <span className={styles.cardTypeIcon}>🔥</span>
                    </div>
                    <svg className={styles.pokemonArtSvg} viewBox="0 0 32 32" fill="none">
                      <path d="M7 21C8 18 10 15 13 14C15 12 18 11 20 8C19 11 18 13 19 15C21 15 24 16 26 18C23.5 19 21 19.5 20 21C21.5 23 22 25 22 27C19.5 25.5 17.5 23.5 15.5 23C13.5 25 11 25.5 8 24.5C10 23.5 11 21.5 10.5 19.5C9 20 7.5 20 7 21Z" fill="#FFF" fillOpacity="0.88"/>
                      <circle cx="21" cy="9" r="1.5" fill="#FEF08A" />
                      <path d="M21 9L25 6" stroke="#FEF08A" strokeWidth="1.2" strokeLinecap="round" />
                    </svg>
                    <div className={styles.cardFooterMicro}>
                      <span className={styles.cardMicroName}>Charizard ex</span>
                    </div>
                  </div>
                  <div className={styles.itemMetaCol}>
                    <div className={styles.itemName}>Charizard ex</div>
                    <div className={styles.itemSet}>#223</div>
                    <div className={styles.itemBadgeRow}>
                      <span className={styles.condBadge}>NM</span>
                      <span className={styles.qtyBadge}>× 12</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* ── CARD 3: Shopify — Top Right (Blastoise ex) ────────── */}
              <div
                className={`${styles.channelCard} ${styles.cardShopify} ${activeChannel === 'shopify' ? styles.cardActive : ''}`}
                onMouseEnter={() => setActiveChannel('shopify')}
                onMouseLeave={() => setActiveChannel(null)}
              >
                <div className={styles.cardTopRow}>
                  <div className={styles.cardBrandRow}>
                    <svg className={styles.logoShopify} viewBox="0 0 24 24" fill="#95BF47">
                      <path d="M18.8 6.4c-.1-.3-.4-.5-.7-.4l-2 .4c-.4-1.2-1.1-2.2-2.1-2.9C13 2.8 11.7 2.6 10.6 3c-.9.3-1.6 1-2 1.8-.4.7-.5 1.6-.3 2.6L4.7 8.3c-.3.1-.5.3-.5.6l1.3 12.1c.1.5.5.9 1 .9h11c.5 0 .9-.4 1-.9L19.8 7c0-.2-.1-.5-.2-.6h-.8zM12 4.6c.7-.2 1.5 0 2.1.5.6.5 1.1 1.2 1.3 2.1l-4.7 1c-.1-.7 0-1.5.3-2.1.2-.6.6-1.1 1-1.5z" />
                    </svg>
                    <span className={styles.brandName}>Shopify</span>
                  </div>
                  <span className={styles.liveBadge}>Live</span>
                </div>
                <div className={styles.cardItemRow}>
                  <div className={`${styles.pokemonCardMini} ${styles.cardBlastoise}`}>
                    <div className={styles.cardFoilOverlay} />
                    <div className={styles.cardFrame} />
                    <div className={styles.cardHeaderMicro}>
                      <span className={styles.cardMicroHp}>HP 330</span>
                      <span className={styles.cardTypeIcon}>💧</span>
                    </div>
                    <svg className={styles.pokemonArtSvg} viewBox="0 0 32 32" fill="none">
                      <ellipse cx="16" cy="20" rx="8" ry="6" fill="#FFF" fillOpacity="0.85"/>
                      <circle cx="16" cy="13" r="4.5" fill="#FFF" fillOpacity="0.9"/>
                      <rect x="9" y="11" width="3" height="7" rx="1.5" transform="rotate(-25 9 11)" fill="#BAE6FD"/>
                      <rect x="23" y="10" width="3" height="7" rx="1.5" transform="rotate(25 23 10)" fill="#BAE6FD"/>
                    </svg>
                    <div className={styles.cardFooterMicro}>
                      <span className={styles.cardMicroName}>Blastoise ex</span>
                    </div>
                  </div>
                  <div className={styles.itemMetaCol}>
                    <div className={styles.itemName}>Blastoise ex</div>
                    <div className={styles.itemSet}>#184</div>
                    <div className={styles.itemBadgeRow}>
                      <span className={styles.condBadge}>NM</span>
                      <span className={styles.qtyBadge}>× 8</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* ── CARD 4: eBay — Left Center (Mewtwo V) ─────────────── */}
              <div
                className={`${styles.channelCard} ${styles.cardEbay} ${activeChannel === 'ebay' ? styles.cardActive : ''}`}
                onMouseEnter={() => setActiveChannel('ebay')}
                onMouseLeave={() => setActiveChannel(null)}
              >
                <div className={styles.cardTopRow}>
                  <div className={styles.cardBrandRow}>
                    <div className={styles.logoEbay}>
                      <span style={{ color: '#E53238' }}>e</span>
                      <span style={{ color: '#0064D2' }}>b</span>
                      <span style={{ color: '#F5AF02' }}>a</span>
                      <span style={{ color: '#86B817' }}>y</span>
                    </div>
                  </div>
                  <span className={styles.liveBadge}>Live</span>
                </div>
                <div className={styles.cardItemRow}>
                  <div className={`${styles.pokemonCardMini} ${styles.cardMewtwo}`}>
                    <div className={styles.cardFoilOverlay} />
                    <div className={styles.cardFrame} />
                    <div className={styles.cardHeaderMicro}>
                      <span className={styles.cardMicroHp}>HP 220</span>
                      <span className={styles.cardTypeIcon}>👁️</span>
                    </div>
                    <svg className={styles.pokemonArtSvg} viewBox="0 0 32 32" fill="none">
                      <circle cx="16" cy="11" r="3.5" fill="#FFF" fillOpacity="0.9"/>
                      <path d="M14 14C13 17 12 21 13 24C14 26 17 26 18 24C19 21 18 17 17 14Z" fill="#FFF" fillOpacity="0.85"/>
                      <path d="M12 16C9 18 8 22 9 24C10 26 12 24 13 22" stroke="#E9D5FF" strokeWidth="1.5" strokeLinecap="round"/>
                      <circle cx="21" cy="17" r="2.5" fill="#E9D5FF" fillOpacity="0.6"/>
                    </svg>
                    <div className={styles.cardFooterMicro}>
                      <span className={styles.cardMicroName}>Mewtwo V</span>
                    </div>
                  </div>
                  <div className={styles.itemMetaCol}>
                    <div className={styles.itemName}>Mewtwo V</div>
                    <div className={styles.itemSet}>#072</div>
                    <div className={styles.itemBadgeRow}>
                      <span className={styles.condBadge}>NM</span>
                      <span className={styles.qtyBadge}>× 5</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* ── CARD 5: Cardmarket — Right Center (Pikachu) ───────── */}
              <div
                className={`${styles.channelCard} ${styles.cardCardmarket} ${activeChannel === 'cardmarket' ? styles.cardActive : ''}`}
                onMouseEnter={() => setActiveChannel('cardmarket')}
                onMouseLeave={() => setActiveChannel(null)}
              >
                <div className={styles.cardTopRow}>
                  <div className={styles.cardBrandRow}>
                    <div className={styles.logoCardmarket}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="#02538F">
                        <path d="M12 2L2 7l10 5 10-5-10-5zm0 9l2.5-1.25L12 8.5l-2.5 1.25L12 11zm0 3.5l-5-2.5-5 2.5L12 22l10-7.5-5-2.5-5 2.5z" />
                      </svg>
                    </div>
                    <span className={styles.brandName}>cardmarket</span>
                  </div>
                  <span className={styles.liveBadge}>Live</span>
                </div>
                <div className={styles.cardItemRow}>
                  <div className={`${styles.pokemonCardMini} ${styles.cardPikachu}`}>
                    <div className={styles.cardFoilOverlay} />
                    <div className={styles.cardFrame} />
                    <div className={styles.cardHeaderMicro}>
                      <span className={styles.cardMicroHp}>HP 70</span>
                      <span className={styles.cardTypeIcon}>⚡</span>
                    </div>
                    <svg className={styles.pokemonArtSvg} viewBox="0 0 32 32" fill="none">
                      <ellipse cx="16" cy="19" rx="5" ry="4.5" fill="#FEF08A" />
                      <circle cx="16" cy="13" r="4" fill="#FEF08A" />
                      <path d="M13 10L10 5L12 11" fill="#FEF08A" stroke="#451A03" strokeWidth="0.8"/>
                      <path d="M19 10L22 5L20 11" fill="#FEF08A" stroke="#451A03" strokeWidth="0.8"/>
                      <path d="M21 19L24 16L23 20L27 18" stroke="#F59E0B" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <div className={styles.cardFooterMicro}>
                      <span className={styles.cardMicroName}>Pikachu</span>
                    </div>
                  </div>
                  <div className={styles.itemMetaCol}>
                    <div className={styles.itemName}>Pikachu</div>
                    <div className={styles.itemSet}>#205</div>
                    <div className={styles.itemBadgeRow}>
                      <span className={styles.condBadge}>NM</span>
                      <span className={styles.qtyBadge}>× 14</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* ── CARD 6: ManaPool — Bottom Left (Lugia V) ──────────── */}
              <div
                className={`${styles.channelCard} ${styles.cardManapool} ${activeChannel === 'manapool' ? styles.cardActive : ''}`}
                onMouseEnter={() => setActiveChannel('manapool')}
                onMouseLeave={() => setActiveChannel(null)}
              >
                <div className={styles.cardTopRow}>
                  <div className={styles.cardBrandRow}>
                    <span className={styles.logoManapoolStar}>✦</span>
                    <span className={styles.brandName}>ManaPool</span>
                  </div>
                  <span className={styles.liveBadge}>Live</span>
                </div>
                <div className={styles.cardItemRow}>
                  <div className={`${styles.pokemonCardMini} ${styles.cardLugia}`}>
                    <div className={styles.cardFoilOverlay} />
                    <div className={styles.cardFrame} />
                    <div className={styles.cardHeaderMicro}>
                      <span className={styles.cardMicroHp}>HP 220</span>
                      <span className={styles.cardTypeIcon}>🌊</span>
                    </div>
                    <svg className={styles.pokemonArtSvg} viewBox="0 0 32 32" fill="none">
                      <path d="M16 8C14 11 11 15 8 18C12 17 15 19 16 24C17 19 20 17 24 18C21 15 18 11 16 8Z" fill="#FFF" fillOpacity="0.9"/>
                      <path d="M9 16L6 13" stroke="#BAE6FD" strokeWidth="1.2" strokeLinecap="round"/>
                      <path d="M23 16L26 13" stroke="#BAE6FD" strokeWidth="1.2" strokeLinecap="round"/>
                    </svg>
                    <div className={styles.cardFooterMicro}>
                      <span className={styles.cardMicroName}>Lugia V</span>
                    </div>
                  </div>
                  <div className={styles.itemMetaCol}>
                    <div className={styles.itemName}>Lugia V</div>
                    <div className={styles.itemSet}>#186</div>
                    <div className={styles.itemBadgeRow}>
                      <span className={styles.condBadge}>NM</span>
                      <span className={styles.qtyBadge}>× 6</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* ── CARD 7: In-Store POS — Bottom Right (Eevee) ───────── */}
              <div
                className={`${styles.channelCard} ${styles.cardPos} ${activeChannel === 'pos' ? styles.cardActive : ''}`}
                onMouseEnter={() => setActiveChannel('pos')}
                onMouseLeave={() => setActiveChannel(null)}
              >
                <div className={styles.cardTopRow}>
                  <div className={styles.cardBrandRow}>
                    <div className={styles.logoPosSquare}>
                      <span className={styles.posInnerSquare} />
                    </div>
                    <span className={styles.brandName}>POS</span>
                  </div>
                  <span className={styles.liveBadge}>Live</span>
                </div>
                <div className={styles.cardItemRow}>
                  <div className={`${styles.pokemonCardMini} ${styles.cardEevee}`}>
                    <div className={styles.cardFoilOverlay} />
                    <div className={styles.cardFrame} />
                    <div className={styles.cardHeaderMicro}>
                      <span className={styles.cardMicroHp}>HP 70</span>
                      <span className={styles.cardTypeIcon}>🐾</span>
                    </div>
                    <svg className={styles.pokemonArtSvg} viewBox="0 0 32 32" fill="none">
                      <ellipse cx="16" cy="20" rx="5" ry="4" fill="#FEF3C7" />
                      <circle cx="16" cy="14" r="3.5" fill="#FEF3C7" />
                      <path d="M13 12L10 6L13 9" fill="#FEF3C7"/>
                      <path d="M19 12L22 6L19 9" fill="#FEF3C7"/>
                      <ellipse cx="16" cy="18" rx="3.5" ry="2" fill="#FFF" fillOpacity="0.8"/>
                    </svg>
                    <div className={styles.cardFooterMicro}>
                      <span className={styles.cardMicroName}>Eevee</span>
                    </div>
                  </div>
                  <div className={styles.itemMetaCol}>
                    <div className={styles.itemName}>Eevee</div>
                    <div className={styles.itemSet}>#125</div>
                    <div className={styles.itemBadgeRow}>
                      <span className={styles.condBadge}>LP</span>
                      <span className={styles.qtyBadge}>× 10</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* ── Sync Status Pill ─────────────────────────────────── */}
              <div className={styles.syncStatusPill}>
                <span className={styles.rotatingSyncIcon}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
                  </svg>
                </span>
                <span className={styles.syncStatusText}>Syncing across all channels...</span>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
