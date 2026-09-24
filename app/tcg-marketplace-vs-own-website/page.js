import TcgTopicPage from "../components/seo/TcgTopicPage";

export default function TcgMarketplaceVsOwnWebsitePage() {
  return (
    <TcgTopicPage
      badge="STRATEGY COMPARISON · CHANNEL ARCHITECTURE"
      title="TCG Marketplace vs."
      highlightedTitle="Own Website"
      subtitle="The definitive operational guide comparing third-party marketplace reliance with an owned direct-to-consumer digital infrastructure."
      breadcrumbTitle="Marketplace vs Own Website"
      answerBlock={{
        heading: "Direct Summary: Which Path is Right?",
        directAnswer:
          "Selling on TCG marketplaces (TCGplayer, eBay, Cardmarket) provides instant buyer liquidity at the cost of high commission fees (12–15%) and zero customer data ownership. Building your own website yields 100% data ownership, standard 2.9% payment processing, and repeat collector loyalty, but requires active marketing or an existing community. The most profitable card stores run a connected hybrid model: maintaining marketplace presence while converting repeat collectors to their owned website.",
        keySignals: [
          "Marketplaces are best for finding new one-off buyers and liquidating excess stock",
          "An owned website is best for maximizing margins, building local player loyalty, and automated buylists",
          "The hybrid model bridges both channels with real-time sub-2s auto-delisting",
        ],
      }}
      evidence={{
        title: "Financial Impact Comparison",
        metrics: [
          {
            value: "12% - 15%",
            label: "Marketplace Commission",
            desc: "Surrendered on every sale across TCGplayer and eBay.",
          },
          {
            value: "2.9%",
            label: "Direct Website Processing",
            desc: "Standard Stripe/Shopify gateway fee on your owned platform.",
          },
          {
            value: "3x Higher",
            label: "Collector Lifetime Value",
            desc: "When collectors can be remarketed to directly via email and SMS.",
          },
          {
            value: "Zero",
            label: "Double-Sell Risk in Hybrid",
            desc: "When coordinated by Aeethod's real-time event pipeline.",
          },
        ],
        caseStudy: {
          client: "RNG Gamez",
          link: "/works/rng-gamez",
          summary:
            "Implemented the hybrid channel model: capturing high-margin direct sales on their custom site while maintaining active marketplace listings.",
        },
      }}
      deepDiveSections={[
        {
          heading: "1. The Economics: Why 10% Margin Difference Changes Everything",
          paragraphs: [
            "In trading card retail, net margins typically range between 15% and 25%. When a marketplace takes 12% to 15% off the top of gross sales, they are not just taking 15% of your revenue—they are often taking 50% or more of your net profit.",
            "On a $100 card sold on TCGplayer where your inventory cost was $70: you make ~$17 net after $13 in fees. On your owned website, you make $27 net. That is a 58% increase in net cash in your pocket on the exact same card.",
          ],
        },
        {
          heading: "2. The Connected Hybrid Architecture",
          paragraphs: [
            "You never have to choose strictly between an owned website or marketplaces. With Aeethod's multi-channel synchronization, your master inventory feeds both simultaneously.",
            "When someone buys a card in-store or on your website, it delists from TCGplayer and eBay in under 2 seconds. You get the best of both worlds: massive marketplace discovery plus maximum direct profit.",
          ],
        },
      ]}
      comparisonTable={{
        title: "Channel Comparison: Marketplace vs. Owned Website",
        headers: ["Strategic Metric", "Third-Party Marketplaces", "Owned Custom Storefront"],
        rows: [
          {
            feature: "Transaction Costs",
            col1: "12% – 15% of gross sales",
            col2: "2.9% payment processing only",
          },
          {
            feature: "Collector Retention",
            col1: "Zero (Cannot email or text buyers)",
            col2: "100% Owned customer profiles",
          },
          {
            feature: "Buylist Trade-In Integration",
            col1: "Platform-controlled fees",
            col2: "Direct counter & online buylist",
          },
          {
            feature: "Brand Perception",
            col1: "A replaceable seller on a list",
            col2: "Premium, trusted collector destination",
          },
        ],
      }}
      faqs={[
        {
          q: "How do we transition our marketplace buyers to our new website?",
          a: "The most effective method is packaging inserts: placing a high-quality branded card sleeve or coupon card in every TCGplayer and eBay order offering 5% off their first order at your direct website.",
        },
        {
          q: "Can we charge lower prices on our website than on TCGplayer?",
          a: "Yes. By pricing cards 3% to 5% lower on your website, collectors get a better deal while you still pocket 7% to 10% more profit than selling on marketplaces.",
        },
      ]}
      relatedPages={[
        {
          tag: "DECISION",
          title: "Has Your TCG Store Outgrown TCGplayer?",
          url: "/outgrown-tcgplayer",
          desc: "Calculate your transition ROI and evaluate when to launch your own store.",
        },
        {
          tag: "INTEGRATION",
          title: "TCG Marketplace Integration",
          url: "/tcg-marketplace-integration",
          desc: "Real-time bidirectional sync across TCGplayer, eBay, and POS.",
        },
      ]}
    />
  );
}
