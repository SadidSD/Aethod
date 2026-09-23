"use client";

import { useState, useCallback } from "react";
import styles from "./TcgIntegrations.module.css";

const PLATFORM_VIEWS = {
  tcgplayer: {
    id: "tcgplayer",
    name: "TCGplayer Direct / Pro",
    tag: "REST API PAYLOAD",
    badgeColor: "#2563EB",
    codeSnippet: `{
  "productId": 42890,
  "skuId": 1892041,
  "productName": "Charizard",
  "setName": "Base Set",
  "cardNumber": "4/102",
  "condition": "Near Mint",
  "printing": "1st Edition Holofoil",
  "language": "English",
  "price": 420.00,
  "quantity": 1,
  "channelStatus": "ACTIVE_DIRECT"
}`
  },
  ebay: {
    id: "ebay",
    name: "eBay Item Specifics Feed",
    tag: "MERCHANT API XML / JSON",
    badgeColor: "#D97706",
    codeSnippet: `{
  "title": "1999 Pokemon Base Set Charizard 1st Edition Holo #4/102 WOTC NM",
  "categoryId": "183454",
  "aspects": {
    "Game": ["Pokémon TCG"],
    "Set": ["Base Set"],
    "Card Number": ["4/102"],
    "Rarity": ["Holo Rare"],
    "Graded": ["No"],
    "Condition": ["Near Mint or Better"]
  },
  "price": 420.00,
  "quantity": 1
}`
  },
  storefront: {
    id: "storefront",
    name: "Your Custom Storefront",
    tag: "NEXT.JS EDGE SCHEMA (JSON-LD)",
    badgeColor: "#7C3AED",
    codeSnippet: `{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Charizard - 1st Edition Holo (Base Set #4/102)",
  "sku": "PKM-BS-004-1ED-NM",
  "offers": {
    "@type": "Offer",
    "price": "420.00",
    "priceCurrency": "USD",
    "availability": "https://schema.org/InStock",
    "seller": { "@type": "Organization", "name": "Your Store" }
  },
  "subSecondSearchIndex": { "game": "pokemon", "set": "base", "rarity": "holo" }
}`
  },
  pos: {
    id: "pos",
    name: "Physical Counter POS & Bin",
    tag: "LOCAL REGISTER / BARCODE",
    badgeColor: "#059669",
    codeSnippet: `{
  "barcode": "PKM-004-NM-8924",
  "counterPrice": 420.00,
  "physicalLocation": {
    "vault": "Main Storefront Glass Case",
    "row": "Row 2 (Vintage Binder)",
    "slot": "Slot 14",
    "lockStatus": "Unlocked for Customer View"
  },
  "taxExemptCashCreditEligible": true
}`
  }
};

export default function TcgSkuNormalizerMockup() {
  const [activePlatform, setActivePlatform] = useState("tcgplayer");
  const currentView = PLATFORM_VIEWS[activePlatform];

  const playClickSound = useCallback(() => {
    try {
      const audio = new Audio("/touchpad sd.mp3");
      audio.volume = 0.8;
      audio.play().catch(() => {});
    } catch (e) {
      /* ignore */
    }
  }, []);

  return (
    <div className={styles.normalizerCard}>
      <div className={styles.simulatorHeader}>
        <div className={styles.simulatorBadge}>
          <span className={styles.pulseDot} />
          <span>DATA NORMALIZATION ENGINE</span>
        </div>
        <h3 className={styles.simulatorTitle}>
          Master SKU Canonicalization <span className={styles.accentText}>(Scan Once, List Everywhere)</span>
        </h3>
        <p className={styles.simulatorDesc}>
          Every marketplace uses different naming conventions, category codes, and variant structures.
          Aeethod translates your single raw card scan into platform-perfect formats for TCGplayer, eBay, your storefront, and your in-store barcode scanner simultaneously.
        </p>
      </div>

      {/* Central Operating Brain Card */}
      <div className={styles.masterSkuHeaderCard}>
        <div className={styles.masterSkuLeft}>
          <span className={styles.masterSkuBadge}>SINGLE SOURCE OF TRUTH</span>
          <h4 className={styles.masterSkuTitle}>Master Card Record: #PKM-BS-004-1ED-NM</h4>
          <span className={styles.masterSkuSub}>
            Canonically linked to Pokémon Official TCGdex ID · Scryfall / YGOPRODeck Unified Architecture
          </span>
        </div>
        <div className={styles.masterSkuRight}>
          <span className={styles.masterStatusDot} />
          <span>SYNCHRONIZED ACROSS 4 CHANNELS</span>
        </div>
      </div>

      {/* Platform Switcher Tabs */}
      <div className={styles.normalizerTabsRow}>
        <span className={styles.tabLabel}>Auto-Generated Platform Feeds:</span>
        <div className={styles.normalizerButtonGroup}>
          {Object.values(PLATFORM_VIEWS).map((p) => {
            const isActive = activePlatform === p.id;
            return (
              <button
                key={p.id}
                className={`${styles.normalizerTabBtn} ${
                  isActive ? styles.normalizerTabBtnActive : ""
                }`}
                onClick={() => {
                  playClickSound();
                  setActivePlatform(p.id);
                }}
              >
                <span>{p.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Code / Payload Display Box */}
      <div className={styles.payloadDisplayBox}>
        <div className={styles.payloadHeader}>
          <div className={styles.payloadHeaderLeft}>
            <span className={styles.platformBadgeTag} style={{ borderColor: currentView.badgeColor, color: currentView.badgeColor }}>
              {currentView.tag}
            </span>
            <span className={styles.platformNameHeader}>{currentView.name} Feed</span>
          </div>
          <span className={styles.autoFormattedBadge}>✓ Auto-Formatted in 0.04s</span>
        </div>

        <pre className={styles.payloadCodeBlock}>
          <code>{currentView.codeSnippet}</code>
        </pre>
      </div>

      {/* Explanatory Footer Callout */}
      <div className={styles.normalizerFooterCallout}>
        <div className={styles.footerCalloutIcon}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <p className={styles.footerCalloutText}>
          <strong>No more double-entry or manual typing:</strong> When new binders arrive from counter trade-ins, your staff scans the cards once. The Master SKU Engine automatically crafts optimized titles for eBay SEO, matches TCGplayer catalog IDs, populates your website search index, and assigns a physical bin barcode.
        </p>
      </div>
    </div>
  );
}
