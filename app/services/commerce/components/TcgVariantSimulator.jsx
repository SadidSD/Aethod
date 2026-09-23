"use client";

import { useState, useCallback } from "react";
import styles from "./TcgComponents.module.css";

const CARD_DATA = {
  charizard: {
    id: "charizard",
    game: "Pokémon TCG",
    set: "Base Set (1999) · #4/102",
    name: "Charizard",
    rarity: "Holo Rare · Vintage",
    image: "https://images.pokemontcg.io/base1/4_hires.png",
    fallbackColor: "#E05A47",
    finishes: [
      { id: "1st-ed", name: "1st Edition Holo", multiplier: 3.2 },
      { id: "shadowless", name: "Shadowless Holo", multiplier: 1.8 },
      { id: "unlimited", name: "Unlimited Holo", multiplier: 1.0 }
    ],
    conditions: [
      { id: "NM", name: "Near Mint (NM)", basePrice: 280, stock: 2, note: "Pristine corners, sharp foil luster" },
      { id: "LP", name: "Lightly Played (LP)", basePrice: 210, stock: 4, note: "Minor edge silvering on reverse" },
      { id: "MP", name: "Moderately Played (MP)", basePrice: 155, stock: 1, note: "Noticeable surface scratches" },
      { id: "DMG", name: "Damaged (DMG)", basePrice: 90, stock: 3, note: "Light crease or heavy whitening" }
    ],
    slabs: [
      { id: "raw", name: "Raw Binder Single", priceOffset: 0, cert: null },
      { id: "psa9", name: "PSA 9 Mint (Graded Slab)", priceOffset: 950, cert: "PSA #68492019" },
      { id: "psa10", name: "PSA 10 Gem Mint (Graded Slab)", priceOffset: 2850, cert: "PSA #79201844" }
    ]
  },
  blacklotus: {
    id: "blacklotus",
    game: "Magic: The Gathering",
    set: "Beta Edition (1993) · Artifact",
    name: "Black Lotus",
    rarity: "Mythic Rare · Power Nine",
    image: "https://cards.scryfall.io/large/front/b/d/bd8fa327-dd41-4737-8f19-2cf5eb1f7cdd.jpg",
    fallbackColor: "#4B6584",
    finishes: [
      { id: "original", name: "Original Vintage", multiplier: 1.0 },
      { id: "artist-signed", name: "Christopher Rush Signed", multiplier: 1.5 }
    ],
    conditions: [
      { id: "NM", name: "Near Mint (NM)", basePrice: 12500, stock: 1, note: "Extremely crisp surface & centering" },
      { id: "LP", name: "Lightly Played (LP)", basePrice: 9800, stock: 1, note: "Micro-whitening on top black border" },
      { id: "MP", name: "Moderately Played (MP)", basePrice: 7200, stock: 0, note: "Out of stock · Join Buylist Alert" },
      { id: "DMG", name: "Damaged (DMG)", basePrice: 4900, stock: 1, note: "Heavy sleeve play wear" }
    ],
    slabs: [
      { id: "raw", name: "Raw Sleeve Single", priceOffset: 0, cert: null },
      { id: "bgs9", name: "BGS 9 Quad 9 (Graded Slab)", priceOffset: 6500, cert: "BGS #0012849" }
    ]
  },
  luffy: {
    id: "luffy",
    game: "One Piece Card Game",
    set: "Romance Dawn (OP-01) · #OP01-024",
    name: "Monkey D. Luffy (Manga Alt Art)",
    rarity: "Secret Manga Rare",
    image: "https://en.onepiece-cardgame.com/images/cardlist/card/OP01-024_p1.png",
    fallbackColor: "#D35400",
    finishes: [
      { id: "manga-foil", name: "Textured Comic Foil", multiplier: 1.0 }
    ],
    conditions: [
      { id: "NM", name: "Near Mint (NM)", basePrice: 1850, stock: 3, note: "Pack-fresh straight from sealed case" },
      { id: "LP", name: "Lightly Played (LP)", basePrice: 1450, stock: 1, note: "Tiny corner touch" }
    ],
    slabs: [
      { id: "raw", name: "Raw Magnetic One-Touch", priceOffset: 0, cert: null },
      { id: "psa10", name: "PSA 10 Gem Mint (Graded Slab)", priceOffset: 1200, cert: "PSA #82910471" },
      { id: "bgs10", name: "BGS 10 Black Label", priceOffset: 4500, cert: "BGS #0049281" }
    ]
  }
};

export default function TcgVariantSimulator() {
  const [selectedCardId, setSelectedCardId] = useState("charizard");
  const card = CARD_DATA[selectedCardId];

  const [selectedFinish, setSelectedFinish] = useState(card.finishes[0].id);
  const [selectedCondition, setSelectedCondition] = useState("NM");
  const [selectedSlab, setSelectedSlab] = useState("raw");
  const [addedToCart, setAddedToCart] = useState(false);

  const playClickSound = useCallback(() => {
    try {
      const audio = new Audio("/touchpad sd.mp3");
      audio.volume = 0.8;
      audio.play().catch(() => {});
    } catch (e) {
      /* ignore */
    }
  }, []);

  const handleCardSwitch = (id) => {
    playClickSound();
    setSelectedCardId(id);
    const newCard = CARD_DATA[id];
    setSelectedFinish(newCard.finishes[0].id);
    setSelectedCondition(newCard.conditions[0].id);
    setSelectedSlab("raw");
    setAddedToCart(false);
  };

  // Calculate dynamic price
  const finishObj = card.finishes.find((f) => f.id === selectedFinish) || card.finishes[0];
  const conditionObj = card.conditions.find((c) => c.id === selectedCondition) || card.conditions[0];
  const slabObj = card.slabs.find((s) => s.id === selectedSlab) || card.slabs[0];

  const calculatedPrice = Math.round(
    conditionObj.basePrice * finishObj.multiplier + slabObj.priceOffset
  );

  const marketFeeLost = Math.round(calculatedPrice * 0.135);
  const marketNetPayout = calculatedPrice - marketFeeLost;
  const directStoreFee = Math.round(calculatedPrice * 0.029 + 0.3);
  const directStoreProfit = calculatedPrice - directStoreFee;
  const singleCardSavings = directStoreProfit - marketNetPayout;

  const isOutOfStock = conditionObj.stock === 0;

  const handleAddToCart = () => {
    playClickSound();
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2500);
  };

  return (
    <div className={styles.simulatorCard}>
      {/* Top Banner explaining the problem solved */}
      <div className={styles.simulatorHeader}>
        <div className={styles.simulatorBadge}>
          <span className={styles.pulseDot} />
          <span>INTERACTIVE STORE ENGINE DEMO</span>
        </div>
        <h3 className={styles.simulatorTitle}>
          Deep Card Variant Matrix <span className={styles.accentText}>(Zero 100-Variant Limit)</span>
        </h3>
        <p className={styles.simulatorDesc}>
          Standard Shopify crashes when a card has conditions (NM, LP, MP, HP), finishes (Foil, Reverse, 1st Ed), languages, and PSA slab grades because Shopify caps products at 100 variants.
          {" "}<strong>Aeethod&apos;s Native Variant Engine collapses 150+ variations into 1 single lightning-fast product page.</strong>
        </p>
      </div>

      {/* Card Selector Tabs */}
      <div className={styles.cardTabsRow}>
        <span className={styles.tabLabel}>Sample Catalog SKU:</span>
        <div className={styles.tabButtonGroup}>
          {Object.values(CARD_DATA).map((c) => (
            <button
              key={c.id}
              className={`${styles.tabBtn} ${selectedCardId === c.id ? styles.tabBtnActive : ""}`}
              onClick={() => handleCardSwitch(c.id)}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      {/* The Visual Storefront Mockup */}
      <div className={styles.storefrontMockup}>
        {/* Left: Card Artwork & Slab Preview */}
        <div className={styles.mockupImageCol}>
          <div className={styles.cardFrameWrapper}>
            {slabObj.cert && (
              <div className={styles.psaBadgeTop}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
                <span>{slabObj.cert} · VERIFIED</span>
              </div>
            )}
            <img
              src={card.image}
              alt={card.name}
              className={`${styles.cardArtwork} ${slabObj.cert ? styles.cardSlabBorder : ""}`}
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
            <div className={styles.cardZoomNotice}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
                <line x1="11" y1="8" x2="11" y2="14" />
                <line x1="8" y1="11" x2="14" y2="11" />
              </svg>
              <span>4K High-Res Corner Inspection Ready</span>
            </div>
          </div>
        </div>

        {/* Right: Interactive Attributes & Instant Price Updates */}
        <div className={styles.mockupControlsCol}>
          <div className={styles.cardMetaHeader}>
            <span className={styles.gamePill}>{card.game}</span>
            <span className={styles.setPill}>{card.set}</span>
            <span className={styles.rarityPill}>{card.rarity}</span>
          </div>

          <h2 className={styles.cardDisplayName}>{card.name}</h2>

          {/* Dynamic Price Display */}
          <div className={styles.priceRow}>
            <div className={styles.priceDisplay}>
              <span className={styles.priceSymbol}>$</span>
              <span className={styles.priceValue}>{calculatedPrice.toLocaleString()}</span>
              <span className={styles.priceCurrency}>USD</span>
            </div>
            <div className={styles.stockBadge}>
              {isOutOfStock ? (
                <span className={styles.stockOut}>Out of Stock · Buylist Active</span>
              ) : (
                <span className={styles.stockIn}>
                  ✓ {conditionObj.stock} in stock · Ships in Penny Sleeve + Toploader
                </span>
              )}
            </div>
          </div>

          {/* Condition Selector */}
          <div className={styles.controlGroup}>
            <div className={styles.controlHeader}>
              <span className={styles.controlLabel}>Select Condition:</span>
              <span className={styles.controlValueNote}>{conditionObj.note}</span>
            </div>
            <div className={styles.pillGrid}>
              {card.conditions.map((cond) => {
                const isSelected = selectedCondition === cond.id;
                const condPrice = Math.round(cond.basePrice * finishObj.multiplier);
                return (
                  <button
                    key={cond.id}
                    className={`${styles.conditionPill} ${isSelected ? styles.pillSelected : ""}`}
                    onClick={() => {
                      playClickSound();
                      setSelectedCondition(cond.id);
                    }}
                  >
                    <span className={styles.pillName}>{cond.name}</span>
                    <span className={styles.pillSubPrice}>${condPrice.toLocaleString()}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Finish Selector */}
          {card.finishes.length > 1 && (
            <div className={styles.controlGroup}>
              <span className={styles.controlLabel}>Select Finish / Printing:</span>
              <div className={styles.pillGrid}>
                {card.finishes.map((fin) => {
                  const isSelected = selectedFinish === fin.id;
                  return (
                    <button
                      key={fin.id}
                      className={`${styles.finishPill} ${isSelected ? styles.pillSelected : ""}`}
                      onClick={() => {
                        playClickSound();
                        setSelectedFinish(fin.id);
                      }}
                    >
                      {fin.name}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Graded Slab vs Raw Option */}
          <div className={styles.controlGroup}>
            <span className={styles.controlLabel}>Format / Encapsulation:</span>
            <div className={styles.pillGrid}>
              {card.slabs.map((slab) => {
                const isSelected = selectedSlab === slab.id;
                return (
                  <button
                    key={slab.id}
                    className={`${styles.slabPill} ${isSelected ? styles.pillSelected : ""}`}
                    onClick={() => {
                      playClickSound();
                      setSelectedSlab(slab.id);
                    }}
                  >
                    {slab.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Checkout Action Button */}
          <div className={styles.actionRow}>
            <button
              className={`${styles.addToCartBtn} ${isOutOfStock ? styles.btnDisabled : ""}`}
              onClick={handleAddToCart}
              disabled={isOutOfStock}
            >
              {addedToCart ? (
                <span>✓ Added to Collector Cart</span>
              ) : isOutOfStock ? (
                <span>Out of Stock — Submit to Buylist</span>
              ) : (
                <>
                  <span>Direct Zero-Fee Checkout</span>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </>
              )}
            </button>
          </div>

          {/* Real-time Profit Savings Callout for the Shop Owner */}
          <div className={styles.marginComparisonBar}>
            <div className={styles.comparisonItem}>
              <span className={styles.comparisonLabel}>TCGplayer/eBay Net Payout (~13.5% fee):</span>
              <span className={styles.feeLost}>${marketNetPayout.toLocaleString()} <span style={{ fontSize: "11px", fontWeight: "400", opacity: 0.85 }}>(Fee: -${marketFeeLost.toLocaleString()})</span></span>
            </div>
            <div className={styles.comparisonDivider} />
            <div className={styles.comparisonItem}>
              <span className={styles.comparisonLabel}>Aeethod Storefront Payout (Stripe 2.9%):</span>
              <span className={styles.profitKept}>${directStoreProfit.toLocaleString()} <span style={{ fontSize: "11px", fontWeight: "600" }}>(+${singleCardSavings.toLocaleString()} extra profit)</span></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
