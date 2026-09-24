import TcgTopicPage from "../components/seo/TcgTopicPage";

export default function TcgCommercePage() {
  return (
    <TcgTopicPage
      badge="PILLAR ARCHITECTURE · TCG COMMERCE"
      title="Custom TCG Commerce Platforms &"
      highlightedTitle="Digital Systems"
      subtitle="Engineering specialized storefronts, real-time inventory synchronization, and operational automation for card shops operating beyond marketplace limits."
      breadcrumbTitle="TCG Commerce"
      answerBlock={{
        heading: "What is TCG Commerce Architecture?",
        directAnswer:
          "TCG Commerce Architecture is custom-engineered e-commerce infrastructure built specifically for the operational realities of trading card game retail. Unlike generic online stores that crash under deep catalogs, a dedicated TCG platform unifies 100,000+ card variations, provides sub-35ms facet filtering, eliminates the 12–15% marketplace commission tax, and coordinates real-time inventory synchronization across TCGplayer, eBay, and in-store POS.",
        keySignals: [
          "Catalog size exceeding 10,000+ single cards",
          "Paying $3,000+ monthly in marketplace commission fees",
          "Experiencing double-sales due to 15-minute sync lag",
          "Hitting Shopify's 100-variant limit on singles with multiple conditions",
        ],
      }}
      evidence={{
        title: "Performance Benchmarks on Live Deployments",
        metrics: [
          {
            value: "100k+",
            label: "Active Singles SKU Capacity",
            desc: "Zero catalog slowdown or database table locking during set releases.",
          },
          {
            value: "< 35ms",
            label: "Edge Faceted Search Latency",
            desc: "Sub-second filtering by game, set, rarity, finish, and card number.",
          },
          {
            value: "12% - 15%",
            label: "Net Margin Reclaimed",
            desc: "Eliminates third-party marketplace listing and transaction taxes.",
          },
          {
            value: "< 2s",
            label: "Multi-Channel Auto-Delist",
            desc: "Instant race arbitration between physical counter and online buyers.",
          },
        ],
        caseStudy: {
          client: "RNG Gamez",
          link: "/works/rng-gamez",
          summary:
            "Migrated from fragmented marketplace sales to a custom high-performance TCG storefront with integrated card variant matrix and automated trade-in buylist.",
        },
      }}
      deepDiveSections={[
        {
          heading: "1. The Inherent Complexity of Trading Card Data",
          paragraphs: [
            "A standard apparel store manages products with two simple variations: Size and Color. In contrast, a single Pokémon card (e.g., Charizard ex) possesses multiple independent dimensions: Set, Collector Number, Foil Treatment (Holofoil, Reverse Holo, Pokeball Holo), Language (English, Japanese), Condition (NM, LP, MP, HP, DMG), and Graded Slab Certification (PSA, BGS, CGC 1-10).",
            "When forced into generic e-commerce engines like Shopify or WooCommerce, each variation consumes a database row. Shopify caps variants at 100 per product, forcing card stores to split a single card across multiple confusing product pages. Aeethod collapses 150+ variations into one canonical, high-converting product page.",
          ],
          bulletPoints: [
            "Canonical Single URL structure preserving Google search equity",
            "Dynamic stock and price updates at the edge without page reloads",
            "Automatic PSA/BGS slab certification lookups via barcode scanning",
          ],
        },
        {
          heading: "2. The Three Architectural Pillars of Modern Card Retail",
          paragraphs: [
            "To successfully scale past $500,000 in annual GMV, a card shop must unify three core operational loops: Front-End Velocity, Real-Time Concurrency, and Counter Intake.",
            "Without dedicated architecture, staff spend 20+ hours each week manually adjusting prices, packing orders from separate channel tabs, and canceling double-sold cards.",
          ],
          bulletPoints: [
            "Pillar I: Sub-second Custom Storefront (Direct-to-Collector channels)",
            "Pillar II: Real-Time Event Sync Engine (TCGplayer, eBay, Cardmarket)",
            "Pillar III: Backroom Buylist & Automated Valuations (Cash & Store Credit)",
          ],
        },
      ]}
      comparisonTable={{
        title: "Marketplace Only vs. Shopify vs. Aeethod TCG Platform",
        headers: ["Capability", "TCGplayer / Marketplaces", "Aeethod Custom Platform", "Generic Shopify"],
        rows: [
          {
            feature: "Sales Commission",
            col1: "12% – 15% on gross sales",
            col2: "0% (Standard 2.9% processor)",
            col3: "2.9% + App Subscription Fees",
          },
          {
            feature: "Customer Ownership",
            col1: "None (Anonymized emails)",
            col2: "100% Owned Collector Data",
            col3: "Owned Email List",
          },
          {
            feature: "Variant Limit",
            col1: "Pre-set marketplace rules",
            col2: "Unlimited variations per card",
            col3: "Hard cap at 100 variants",
          },
          {
            feature: "Real-Time Multi-Channel Sync",
            col1: "Manual CSV exports",
            col2: "Sub-2s Webhook Auto-Delist",
            col3: "Third-party apps (15m delay)",
          },
          {
            feature: "Buylist & Store Credit Integration",
            col1: "None / TCGplayer Buylist fees",
            col2: "Integrated Counter Intake",
            col3: "Fragmented external apps",
          },
        ],
      }}
      faqs={[
        {
          q: "When does it make sense to invest in a custom TCG platform?",
          a: "Most card shops reach the transition point when marketplace fees exceed $2,500/month, active inventory exceeds 10,000 singles, or inventory desync causes frequent buyer cancellations and seller metric penalties.",
        },
        {
          q: "Can we still sell on TCGplayer and eBay if we launch our own website?",
          a: "Yes, and you should. The goal is not to abandon marketplace liquidity, but to build an owned hub where repeat collectors buy directly, while maintaining active synced listings across TCGplayer and eBay without double-selling.",
        },
        {
          q: "How does Aeethod migrate our existing card catalog?",
          a: "We extract and normalize your existing catalog from BinderPOS, Shopify, CrystalCommerce, or CSV databases. We run shadow synchronization tests before the cutover to ensure zero lost cards or stock count errors.",
        },
      ]}
      relatedPages={[
        {
          tag: "MONEY PAGE",
          title: "Custom TCG Website Development",
          url: "/custom-tcg-website",
          desc: "High-converting direct storefronts built for trading card collectors.",
        },
        {
          tag: "INTEGRATION",
          title: "TCG Marketplace Integration",
          url: "/tcg-marketplace-integration",
          desc: "Real-time bidirectional sync across TCGplayer, eBay, and POS.",
        },
        {
          tag: "OPERATIONS",
          title: "TCG Inventory Management System",
          url: "/tcg-inventory-system",
          desc: "Master catalog architecture for 100,000+ single card SKUs.",
        },
      ]}
    />
  );
}
