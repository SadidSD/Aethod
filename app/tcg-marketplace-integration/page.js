import TcgTopicPage from "../components/seo/TcgTopicPage";

export default function TcgMarketplaceIntegrationPage() {
  return (
    <TcgTopicPage
      badge="INTEGRATION · MULTI-CHANNEL SYNC"
      title="TCG Marketplace"
      highlightedTitle="Integration"
      subtitle="Real-time multi-channel inventory synchronization connecting your custom storefront, TCGplayer Pro, eBay, Cardmarket, and in-store POS."
      breadcrumbTitle="Marketplace Integration"
      answerBlock={{
        heading: "How Does TCG Marketplace Integration Work?",
        directAnswer:
          "TCG Marketplace Integration connects your independent store catalog directly to major third-party platforms including TCGplayer, eBay, Cardmarket, and ManaPool via real-time webhooks. When an item sells on any channel—online or in-store—our event pipeline automatically decrements or delists the matching card across all other platforms in under 2 seconds, eliminating double-selling while maximizing exposure.",
        keySignals: [
          "Selling on both TCGplayer and an independent storefront",
          "Experiencing double-sales due to 15-to-45-minute sync delays",
          "Needing differential channel pricing (e.g. +12% markup on eBay to offset fees)",
          "Managing multiple fulfillment queues across fragmented seller tabs",
        ],
      }}
      evidence={{
        title: "Integration Performance Benchmarks",
        metrics: [
          {
            value: "< 2s",
            label: "Auto-Delist Latency",
            desc: "Rapid event webhook pushing zero-stock to other marketplaces.",
          },
          {
            value: "100%",
            label: "Double-Sell Elimination",
            desc: "Zero negative seller defect points from stockout cancellations.",
          },
          {
            value: "+12%",
            label: "Marketplace Offset Markup",
            desc: "Automated price differential rules protecting profit margins.",
          },
          {
            value: "5 Channels",
            label: "Unified Inventory Pool",
            desc: "Web, TCGplayer, eBay, Cardmarket, and In-Store Register.",
          },
        ],
        caseStudy: {
          client: "RNG Gamez",
          link: "/works/rng-gamez",
          summary:
            "Implemented an omnichannel synchronization engine that unifies online web sales with marketplace orders into one automated shipping queue.",
        },
      }}
      deepDiveSections={[
        {
          heading: "1. Overcoming the Limitations of Third-Party Sync Tools",
          paragraphs: [
            "Most card shops rely on third-party SaaS middleware to sync TCGplayer with Shopify. These apps typically poll marketplace APIs on batch intervals (every 15 to 45 minutes). During high-velocity events—such as new set releases or tournament coverage spikes—a popular card can be purchased simultaneously on multiple platforms before the sync tool even runs.",
            "Aeethod builds direct webhook pipelines that react instantaneously to checkout events, firing immediate delist orders to external marketplaces within milliseconds.",
          ],
        },
        {
          heading: "2. Strategic Differential Pricing",
          paragraphs: [
            "Why sell a card on your website for the exact same price as on TCGplayer when TCGplayer takes a 12.75% + processing fee cut? Our integration engine allows you to set automated channel pricing rules.",
            "List a card for $100 on your custom website (saving money for loyal collectors), while our integration automatically lists it at $114.99 on TCGplayer and eBay to preserve your net margin after fees.",
          ],
        },
      ]}
      comparisonTable={{
        title: "Third-Party Sync Middleware vs. Aeethod Direct Integration",
        headers: ["Feature", "Generic Sync SaaS (BinderPOS / Sellbrite)", "Aeethod Custom Integration"],
        rows: [
          {
            feature: "Sync Response Time",
            col1: "15 - 45 minutes polling interval",
            col2: "< 2 seconds instant event webhook",
          },
          {
            feature: "Double-Selling Risk",
            col1: "High during release events",
            col2: "Zero (Instant race arbiter)",
          },
          {
            feature: "Monthly SaaS Cost",
            col1: "$300 to $1,200 every month",
            col2: "$0 monthly recurring SaaS fee",
          },
          {
            feature: "Channel Price Multipliers",
            col1: "Limited / Static",
            col2: "Dynamic rules per game, set, and channel",
          },
        ],
      }}
      faqs={[
        {
          q: "Do we need to recreate our existing TCGplayer or eBay listings?",
          a: "No. Our Master SKU Canonicalization engine matches your existing active listings across channels without requiring you to take them down or relist.",
        },
        {
          q: "What platforms does Aeethod integrate with?",
          a: "We support TCGplayer Pro, eBay Store, Shopify, Cardmarket (Europe), ManaPool, Square POS, and custom ERP systems.",
        },
      ]}
      relatedPages={[
        {
          tag: "SERVICE",
          title: "Commerce & Marketplace Integration",
          url: "/services/integrations",
          desc: "Explore interactive webhook simulator and ROI calculator.",
        },
        {
          tag: "AUTOMATION",
          title: "TCG Pricing Automation",
          url: "/tcg-pricing-automation",
          desc: "Automate tournament spikes and undercut defense across all channels.",
        },
      ]}
    />
  );
}
