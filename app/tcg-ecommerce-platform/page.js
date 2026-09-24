import TcgTopicPage from "../components/seo/TcgTopicPage";

export default function TcgEcommercePlatformPage() {
  return (
    <TcgTopicPage
      badge="PLATFORM SOFTWARE · ARCHITECTURE"
      title="TCG E-Commerce Platform"
      highlightedTitle="Software"
      subtitle="Dedicated software architecture designed for high-scale trading card retailers managing deep singles catalogs, real-time sync, and counter intake."
      breadcrumbTitle="TCG E-Commerce Platform"
      answerBlock={{
        heading: "What is an Enterprise TCG E-Commerce Platform?",
        directAnswer:
          "An enterprise TCG e-commerce platform is an end-to-end software stack purpose-built for the operational complexity of trading card retail. It combines an ultra-fast headless storefront, a high-throughput inventory index handling 100,000+ card variations, sub-2-second marketplace synchronization, an integrated customer buylist, and an algorithmic repricer into a unified, owned business asset.",
        keySignals: [
          "Annual gross merchandise volume (GMV) exceeding $300,000",
          "Catalog spanning Pokémon, Magic: The Gathering, Yu-Gi-Oh!, and One Piece",
          "Multiple sales channels (Shopify/Storefront, TCGplayer Pro, eBay Store, POS)",
          "Need for automated cash and store credit payouts on customer collections",
        ],
      }}
      evidence={{
        title: "Platform Architecture Benchmarks",
        metrics: [
          {
            value: "99.99%",
            label: "Uptime During Set Drops",
            desc: "Edge-distributed serverless architecture preventing traffic crashes.",
          },
          {
            value: "0%",
            label: "Recurring Sales Tax",
            desc: "No platform percentage cuts taken from your card margins.",
          },
          {
            value: "1-Click",
            label: "Thermal Order Batching",
            desc: "Unified fulfillment queue printing 4x6 labels and packing slips.",
          },
          {
            value: "< 2s",
            label: "Inventory Concurrency",
            desc: "Auto-delisting race arbiter protecting against duplicate sales.",
          },
        ],
        caseStudy: {
          client: "RNG Gamez",
          link: "/works/rng-gamez",
          summary:
            "Replaced fragmented tools with a unified custom TCG platform, accelerating card search speed and launching a customer-facing buylist portal.",
        },
      }}
      deepDiveSections={[
        {
          heading: "1. Headless Architecture for Card Commerce",
          paragraphs: [
            "Monolithic e-commerce platforms couple the customer-facing frontend to the database. When a new Pokémon set drops and thousands of collectors refresh the site simultaneously, the database locks, leading to 504 Gateway Timeouts.",
            "Aeethod decouples the storefront from the core database using a headless edge architecture. Card data and facet search indices are pre-rendered at the edge, delivering instant responses regardless of traffic spikes.",
          ],
        },
        {
          heading: "2. The Unified Inventory Engine",
          paragraphs: [
            "Traditional card stores run separate inventories across BinderPOS, eBay listings, and TCGplayer seller portals. This causes human errors, forgotten listings, and double sales during major tournament weekends.",
            "Our platform serves as the single source of truth. Any card sold at your shop counter, on your website, or on eBay immediately syncs across all other channels within 2 seconds.",
          ],
        },
      ]}
      faqs={[
        {
          q: "How does the platform handle grading condition standards?",
          a: "The platform embeds an objective 5-tier grading matrix (Near Mint, Lightly Played, Moderately Played, Heavily Played, Damaged) across both product pages and buylist submissions, setting clear customer expectations.",
        },
        {
          q: "Can we customize the look and branding of the platform?",
          a: "Yes. Every Aeethod implementation is 100% custom-tailored to your store's brand, colors, and layout preferences with no generic templates.",
        },
      ]}
      relatedPages={[
        {
          tag: "COMMERCE",
          title: "Custom TCG Website Development",
          url: "/custom-tcg-website",
          desc: "High-converting direct storefronts built for card stores.",
        },
        {
          tag: "OPERATIONS",
          title: "TCG Inventory Management System",
          url: "/tcg-inventory-system",
          desc: "Centralized inventory architecture for multi-channel card sellers.",
        },
      ]}
    />
  );
}
