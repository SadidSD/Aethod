"use client";

import { useState, useMemo, useCallback } from "react";
import styles from "./TcgComponents.module.css";

const CATALOG_ITEMS = [
  {
    id: 1,
    name: "Charizard",
    game: "Pokémon",
    set: "Base Set (1999)",
    number: "#4/102",
    rarity: "Holo Rare",
    condition: "NM",
    price: 420,
    marketAvg: 418,
    image: "https://images.pokemontcg.io/base1/4_hires.png",
    inStock: 2
  },
  {
    id: 2,
    name: "Umbreon VMAX (Alternate Art)",
    game: "Pokémon",
    set: "Evolving Skies",
    number: "#215/203",
    rarity: "Secret Rare",
    condition: "NM",
    price: 940,
    marketAvg: 935,
    image: "https://images.pokemontcg.io/swsh7/215_hires.png",
    inStock: 1
  },
  {
    id: 3,
    name: "Black Lotus",
    game: "Magic",
    set: "Beta Edition",
    number: "Artifact",
    rarity: "Mythic",
    condition: "LP",
    price: 9800,
    marketAvg: 9750,
    image: "https://cards.scryfall.io/large/front/b/d/bd8fa327-dd41-4737-8f19-2cf5eb1f7cdd.jpg",
    inStock: 1
  },
  {
    id: 4,
    name: "The One Ring (Foil Borderless)",
    game: "Magic",
    set: "Tales of Middle-earth",
    number: "#0451",
    rarity: "Mythic",
    condition: "NM",
    price: 180,
    marketAvg: 178,
    image: "https://cards.scryfall.io/large/front/9/3/93de71ff-309e-4ed2-a995-594c280f2730.jpg",
    inStock: 5
  },
  {
    id: 5,
    name: "Monkey D. Luffy (Manga Alt Art)",
    game: "One Piece",
    set: "Romance Dawn",
    number: "#OP01-024",
    rarity: "Manga Rare",
    condition: "NM",
    price: 1850,
    marketAvg: 1820,
    image: "https://en.onepiece-cardgame.com/images/cardlist/card/OP01-024_p1.png",
    inStock: 3
  },
  {
    id: 6,
    name: "Blue-Eyes White Dragon",
    game: "Yu-Gi-Oh!",
    set: "Legend of Blue Eyes (1st Ed)",
    number: "#LOB-001",
    rarity: "Ultra Rare",
    condition: "LP",
    price: 1200,
    marketAvg: 1190,
    image: "https://images.ygoprodeck.com/images/cards/89631139.jpg",
    inStock: 1
  }
];

export default function TcgFacetedSearchMockup() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGame, setSelectedGame] = useState("All");
  const [selectedRarity, setSelectedRarity] = useState("All");
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  const playClickSound = useCallback(() => {
    try {
      const audio = new Audio("/touchpad sd.mp3");
      audio.volume = 0.8;
      audio.play().catch(() => {});
    } catch (e) {
      /* ignore */
    }
  }, []);

  const filteredItems = useMemo(() => {
    return CATALOG_ITEMS.filter((item) => {
      const matchesSearch =
        searchQuery === "" ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.set.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.number.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesGame = selectedGame === "All" || item.game === selectedGame;
      const matchesRarity = selectedRarity === "All" || item.rarity.includes(selectedRarity);
      const matchesStock = !onlyInStock || item.inStock > 0;

      return matchesSearch && matchesGame && matchesRarity && matchesStock;
    });
  }, [searchQuery, selectedGame, selectedRarity, onlyInStock]);

  const handleAdd = (name) => {
    playClickSound();
    setCartCount((c) => c + 1);
  };

  return (
    <div className={styles.searchMockupCard}>
      {/* Header */}
      <div className={styles.searchHeader}>
        <div className={styles.simulatorBadge}>
          <span className={styles.pulseDot} />
          <span>REAL-TIME ENGINE BENCHMARK</span>
        </div>
        <h3 className={styles.simulatorTitle}>
          Sub-Second Faceted Search <span className={styles.accentText}>(&lt; 40ms Latency)</span>
        </h3>
        <p className={styles.simulatorDesc}>
          Collectors search by card number, rarity, foil finish, and expansion set simultaneously.
          While standard Shopify themes reload pages or freeze under 30,000 singles, Aeethod&apos;s edge-indexed architecture delivers instant search results without refreshing.
        </p>
      </div>

      {/* Simulated Search & Filter Console */}
      <div className={styles.searchConsole}>
        {/* Search Input Bar */}
        <div className={styles.searchBarWrapper}>
          <svg className={styles.searchIconSvg} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Type card name, set, or card number (e.g., 'Charizard', '#4/102', 'Luffy')..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              className={styles.clearSearchBtn}
              onClick={() => {
                playClickSound();
                setSearchQuery("");
              }}
            >
              ✕
            </button>
          )}
          <div className={styles.searchLatencyBadge}>
            <span className={styles.latencyLight} />
            <span>⚡ 31ms Edge Response</span>
          </div>
        </div>

        {/* Filter Facets Row */}
        <div className={styles.facetBar}>
          {/* Game Selector */}
          <div className={styles.facetGroup}>
            <span className={styles.facetLabel}>Game:</span>
            <div className={styles.facetButtons}>
              {["All", "Pokémon", "Magic", "One Piece", "Yu-Gi-Oh!"].map((g) => (
                <button
                  key={g}
                  className={`${styles.facetChip} ${selectedGame === g ? styles.facetChipActive : ""}`}
                  onClick={() => {
                    playClickSound();
                    setSelectedGame(g);
                  }}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          {/* Rarity Selector */}
          <div className={styles.facetGroup}>
            <span className={styles.facetLabel}>Rarity:</span>
            <div className={styles.facetButtons}>
              {["All", "Holo", "Secret", "Mythic", "Manga", "Ultra"].map((r) => (
                <button
                  key={r}
                  className={`${styles.facetChip} ${selectedRarity === r ? styles.facetChipActive : ""}`}
                  onClick={() => {
                    playClickSound();
                    setSelectedRarity(r);
                  }}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* In-Stock Toggle */}
          <button
            className={`${styles.stockToggle} ${onlyInStock ? styles.stockToggleActive : ""}`}
            onClick={() => {
              playClickSound();
              setOnlyInStock(!onlyInStock);
            }}
          >
            <span>{onlyInStock ? "✓ In Stock Only" : "Show All Singles"}</span>
          </button>
        </div>

        {/* Live Results Count Bar */}
        <div className={styles.resultsInfoRow}>
          <span className={styles.resultCountText}>
            Showing <strong>{filteredItems.length} singles</strong> found across 48,200 indexed SKUs
          </span>
          {cartCount > 0 && (
            <span className={styles.mockCartBadge}>
              🛒 Simulated Cart ({cartCount}) · Zero Marketplace Tax
            </span>
          )}
        </div>

        {/* Filtered Cards Grid */}
        <div className={styles.catalogGrid}>
          {filteredItems.map((item) => (
            <div key={item.id} className={styles.catalogCard}>
              <div className={styles.catalogCardImageWrapper}>
                <img
                  src={item.image}
                  alt={item.name}
                  className={styles.catalogCardImg}
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
                <span className={styles.cardConditionBadge}>{item.condition}</span>
              </div>
              <div className={styles.catalogCardBody}>
                <div className={styles.catalogCardMeta}>
                  <span>{item.set}</span>
                  <span>{item.number}</span>
                </div>
                <h4 className={styles.catalogCardTitle}>{item.name}</h4>
                <div className={styles.catalogCardRarity}>{item.rarity}</div>
                <div className={styles.catalogCardBottom}>
                  <div className={styles.catalogCardPrice}>
                    <span className={styles.cardPriceDollars}>${item.price.toLocaleString()}</span>
                    <span className={styles.cardMarketNote}>Market: ${item.marketAvg}</span>
                  </div>
                  <button
                    className={styles.quickAddBtn}
                    onClick={() => handleAdd(item.name)}
                    title="Simulate Instant Direct Add"
                  >
                    + Add
                  </button>
                </div>
              </div>
            </div>
          ))}
          {filteredItems.length === 0 && (
            <div className={styles.emptyResultsBox}>
              <p>No card matches your exact filter query.</p>
              <button
                className={styles.resetFiltersBtn}
                onClick={() => {
                  playClickSound();
                  setSearchQuery("");
                  setSelectedGame("All");
                  setSelectedRarity("All");
                  setOnlyInStock(false);
                }}
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
