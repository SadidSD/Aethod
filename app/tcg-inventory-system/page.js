import TcgTopicPage from "../components/seo/TcgTopicPage";

export default function TcgInventorySystemPage() {
  return (
    <TcgTopicPage
      badge="OPERATIONS · INVENTORY SOFTWARE"
      title="TCG Inventory Management"
      highlightedTitle="System"
      subtitle="The centralized source of truth for trading card stores managing 100,000+ singles across physical shop counters, TCGplayer, eBay, and your custom storefront."
      breadcrumbTitle="TCG Inventory System"
      answerBlock={{
        heading: "What is a Dedicated TCG Inventory System?",
        directAnswer:
          "A TCG inventory management system is a specialized multi-channel catalog architecture engineered specifically for the deep, multi-condition SKU structures of card shops. It coordinates physical store binders, counter registers, online storefronts, and third-party marketplaces (TCGplayer, eBay, Cardmarket) into a single unified inventory pool with sub-2-second auto-delisting, eliminating overselling and manual spreadsheet updates.",
        keySignals: [
          "Catalog exceeding 10,000+ single cards",
          "Selling simultaneously on TCGplayer, eBay, and in-store register",
          "Experiencing double-selling during busy weekend tournaments",
          "Staff spending 10+ hours weekly manually syncing card quantities",
        ],
      }}
      evidence={{
        title: "Inventory Accuracy Benchmarks",
        metrics: [
          {
            value: "100%",
            label: "Oversell Elimination",
            desc: "Sub-2-second webhook auto-delisting locks out duplicate orders.",
          },
          {
            value: "100,000+",
            label: "Live SKU Capacity",
            desc: "Zero database lag across sets, collector numbers, and conditions.",
          },
          {
            value: "15+ hrs",
            label: "Staff Time Saved Weekly",
            desc: "Automated listing adjustments replace manual CSV uploads.",
          },
          {
            value: "5 Conditions",
            label: "Objective Grading Matrix",
            desc: "Standardized NM, LP, MP, HP, and DMG condition tracking.",
          },
        ],
        caseStudy: {
          client: "RNG Gamez",
          link: "/works/rng-gamez",
          summary:
            "Unified online singles inventory with in-store counter operations, enabling live stock synchronization and rapid buylist intake.",
        },
      }}
      deepDiveSections={[
        {
          heading: "1. The Anatomy of a Trading Card SKU",
          paragraphs: [
            "In conventional retail, an item has one SKU and one barcode. In TCG retail, a single card name represents a matrix of attributes:",
            "• Game (e.g. Pokémon TCG)\n• Set (e.g. 151 / SV3pt5)\n• Collector Number (e.g. #199/165)\n• Finish (e.g. Special Illustration Rare, Holofoil, Reverse)\n• Language (English, Japanese, German)\n• Condition (NM, LP, MP, HP, DMG)\n• Slab Certification Number (PSA, BGS, CGC 1-10)",
            "Without an engine designed to canonicalize these attributes, card shops suffer from catalog fragmentation where identical cards are listed under mismatched titles, confusing search engines and collectors.",
          ],
        },
        {
          heading: "2. Real-Time Concurrency & The 2-Second Delist Rule",
          paragraphs: [
            "The biggest operational hazard for multi-channel card sellers is the 'race condition': a customer purchases your only Near Mint Umbreon VMAX Alt Art at your physical shop counter, while another customer adds it to their cart on eBay.",
            "Traditional sync software checks platforms on a 15-to-45-minute cron schedule. During those 15 minutes, the card gets double-sold, resulting in a forced cancellation, negative seller feedback, and marketplace penalties. Aeethod uses an event-driven webhook pipeline that delists cards in under 2 seconds across all platforms.",
          ],
        },
      ]}
      comparisonTable={{
        title: "Manual Spreadsheets vs. Generic SaaS vs. Aeethod Inventory System",
        headers: ["Capability", "Manual / CSVs", "Third-Party SaaS (BinderPOS)", "Aeethod Custom Engine"],
        rows: [
          {
            feature: "Sync Speed",
            col1: "Manual (Hours/Days)",
            col2: "15 to 45 minutes lag",
            col3: "< 2 seconds instant webhook",
          },
          {
            feature: "Oversell Protection",
            col1: "Frequent double-sales",
            col2: "Occasional during drops",
            col3: "Automated race arbiter",
          },
          {
            feature: "Monthly Software Fees",
            col1: "$0 (Heavy labor cost)",
            col2: "$300 to $1,200 / month",
            col3: "$0 monthly recurring SaaS tax",
          },
          {
            feature: "Slab Certification Tracking",
            col1: "Manual text notes",
            col2: "Generic SKU tagging",
            col3: "Automated API slab verification",
          },
        ],
      }}
      faqs={[
        {
          q: "Can the inventory system integrate with physical barcode scanners?",
          a: "Yes. Staff can scan card sleeves or intake labels with standard 2D barcode scanners to immediately update stock or pull up card listings during counter checkout.",
        },
        {
          q: "How does the system handle bulk intake?",
          a: "The inventory system includes rapid-intake batching tools allowing staff to add hundreds of commons, uncommons, and bulk holos with bulk multiplier rules.",
        },
      ]}
      relatedPages={[
        {
          tag: "INTEGRATION",
          title: "TCG Marketplace Integration",
          url: "/tcg-marketplace-integration",
          desc: "Connect your inventory directly to TCGplayer and eBay.",
        },
        {
          tag: "OPERATIONS",
          title: "TCG Operations Systems",
          url: "/services/operations",
          desc: "Explore automated buylist, condition grading, and thermal receipts.",
        },
      ]}
    />
  );
}
