import TcgTopicPage from "../components/seo/TcgTopicPage";

export default function TcgplayerVsShopifyPage() {
  return (
    <TcgTopicPage
      badge="COMPARISON GUIDE · ARCHITECTURE MATRIX"
      title="TCGplayer vs. Shopify vs."
      highlightedTitle="Custom Platform"
      subtitle="An objective operational audit comparing marketplace selling, standard Shopify setups, and custom TCG infrastructure across fees, variant limits, and inventory control."
      breadcrumbTitle="TCGplayer vs Shopify"
      answerBlock={{
        heading: "Which Platform Makes Sense for Your Store?",
        directAnswer:
          "TCGplayer is best for startup sellers who need instant marketplace traffic and don't mind paying 12–15% commission fees. Shopify works well for small card shops focusing primarily on sealed product and merchandise, but fails when managing 10,000+ single cards due to its 100-variant limit and slow search. A custom TCG platform is ideal for established stores generating $20,000+/month who need sub-second search across 50,000+ singles, zero sales commissions, and an automated buylist.",
        keySignals: [
          "TCGplayer: Best for GMV < $15k/mo needing instant discovery",
          "Shopify: Best for sealed-only stores and apparel with simple variant options",
          "Custom Platform: Best for stores with 10k+ singles seeking margin protection and full data ownership",
        ],
      }}
      evidence={{
        title: "Platform Comparison Key Metrics",
        metrics: [
          {
            value: "12% - 15%",
            label: "TCGplayer Commission",
            desc: "Paid on every order, including shipping and taxes.",
          },
          {
            value: "100",
            label: "Shopify Variant Limit",
            desc: "Capped per product row, breaking multi-condition singles.",
          },
          {
            value: "< 35ms",
            label: "Aeethod Search Latency",
            desc: "Edge-indexed search filtering 100k singles instantly.",
          },
          {
            value: "100%",
            label: "Owned Infrastructure",
            desc: "Zero platform fees, zero subscription lock-in.",
          },
        ],
        caseStudy: {
          client: "RNG Gamez",
          link: "/works/rng-gamez",
          summary:
            "Replaced a hybrid of Shopify and TCGplayer with an integrated custom platform that delivers sub-35ms card searches and an automated trade-in buylist.",
        },
      }}
      deepDiveSections={[
        {
          heading: "1. The 100-Variant Barrier on Shopify",
          paragraphs: [
            "Shopify was designed for apparel and standard retail where a shirt comes in Small, Medium, Large, and Red, Blue, Green. In trading cards, a single Pokémon card (e.g. Charizard) has 5 conditions (NM, LP, MP, HP, DMG) across 3 finishes (Regular, Foil, Reverse) plus slab certifications. That quickly exceeds 15 to 20 variants per card.",
            "If you offer multiple languages (English and Japanese), you instantly blow past Shopify's hard-coded 100-variant limit. Card shops are forced to create separate product pages for each condition or finish, which fractures search rankings and frustrates buyers.",
            "Aeethod's custom architecture decouples variations into a specialized high-density matrix at the edge, allowing hundreds of condition and language permutations on one clean product page.",
          ],
        },
        {
          heading: "2. The Search Latency Difference",
          paragraphs: [
            "When a collector searches your store for a tournament card, search speed is directly correlated with checkout conversion. On a generic Shopify store with 30,000 products, search apps take 2 to 4 seconds to return query results.",
            "Aeethod uses an edge-distributed inverted index that delivers filtered results in under 35 milliseconds—faster than the human eye can register a blink.",
          ],
        },
      ]}
      comparisonTable={{
        title: "Comprehensive Capability Matrix",
        headers: ["Operational Capability", "TCGplayer Marketplace", "Aeethod Custom Platform", "Generic Shopify Theme"],
        rows: [
          {
            feature: "Sales Commission Fee",
            col1: "12.75% + payment processing",
            col2: "0% (Standard 2.9% processor)",
            col3: "2.9% + app subscription costs",
          },
          {
            feature: "Variant Limit Per Product",
            col1: "Pre-set marketplace rules",
            col2: "Unlimited variations per card",
            col3: "Hard cap of 100 variants",
          },
          {
            feature: "Faceted Search Speed",
            col1: "Fast (Marketplace server)",
            col2: "Sub-35ms edge index",
            col3: "1.5s to 4.0s (Slow on deep catalogs)",
          },
          {
            feature: "Customer Data Access",
            col1: "None (Anonymized emails)",
            col2: "100% Owned collector profiles",
            col3: "Owned customer email list",
          },
          {
            feature: "Integrated Buylist Portal",
            col1: "TCGplayer Buylist (10% fee)",
            col2: "Built-in automated intake portal",
            col3: "Requires expensive 3rd-party apps",
          },
          {
            feature: "Multi-Channel Synchronization",
            col1: "Manual CSV or third-party tools",
            col2: "Sub-2s automated webhooks",
            col3: "Requires third-party sync apps",
          },
        ],
      }}
      faqs={[
        {
          q: "Can Aeethod build a custom frontend on top of Shopify?",
          a: "Yes. Headless Shopify allows you to keep Shopify's familiar backend and payment gateway while replacing the slow Shopify theme with our lightning-fast custom TCG storefront.",
        },
        {
          q: "What is the financial break-even point for a custom TCG platform?",
          a: "For a store generating $30,000/month on marketplaces, the 10% commission savings equal $3,000/month. A custom Aeethod platform costing $6,000 to $9,000 pays for itself in just 2 to 3 months.",
        },
      ]}
      relatedPages={[
        {
          tag: "DECISION",
          title: "Has Your TCG Store Outgrown TCGplayer?",
          url: "/outgrown-tcgplayer",
          desc: "Analyze the financial math of transitioning beyond marketplaces.",
        },
        {
          tag: "COMMERCE",
          title: "Custom TCG Website Development",
          url: "/custom-tcg-website",
          desc: "Explore custom storefront features and technical specifications.",
        },
      ]}
    />
  );
}
