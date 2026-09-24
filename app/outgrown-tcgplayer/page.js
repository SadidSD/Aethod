import TcgTopicPage from "../components/seo/TcgTopicPage";

export default function OutgrownTcgplayerPage() {
  return (
    <TcgTopicPage
      badge="DECISION FRAMEWORK · TRANSITION MOMENT"
      title="Has Your TCG Store Outgrown"
      highlightedTitle="TCGplayer?"
      subtitle="A candid, numbers-driven analysis of when marketplace dependency starts costing you more than it earns, and how established card shops build their own digital moat."
      breadcrumbTitle="Outgrown TCGplayer"
      answerBlock={{
        heading: "Direct Summary: The Transition Threshold",
        directAnswer:
          "A TCG store has outgrown TCGplayer when three operational tipping points occur: 1) Monthly marketplace commission fees exceed $2,500-$3,000 (enough to fund custom infrastructure); 2) High-margin repeat collectors are buying on TCGplayer rather than your direct channels; and 3) Anonymized customer policies prevent you from building an owned email list, VIP loyalty programs, or direct trade-in relationships.",
        keySignals: [
          "Gross monthly sales on TCGplayer exceeding $25,000",
          "Paying $35,000+ per year in marketplace commission taxes",
          "Zero access to customer email addresses or retargeting data",
          "Inventory lock-in making expansion to your own storefront feel overwhelming",
        ],
      }}
      evidence={{
        title: "The Financial Reality: Annual Commission Paid",
        metrics: [
          {
            value: "$38,250",
            label: "Annual Fees at $25k/mo",
            desc: "Calculated at standard 12.75% TCGplayer fees + processing.",
          },
          {
            value: "$76,500",
            label: "Annual Fees at $50k/mo",
            desc: "Money transferred out of your business every single year.",
          },
          {
            value: "2-4 Mos",
            label: "Payback Period",
            desc: "Time for a custom Aeethod storefront to pay for itself in saved fees.",
          },
          {
            value: "100%",
            label: "Data Ownership",
            desc: "Build direct collector relationships immune to platform algorithm changes.",
          },
        ],
        caseStudy: {
          client: "RNG Gamez",
          link: "/works/rng-gamez",
          summary:
            "Replaced pure marketplace dependence with a dedicated branded storefront, enabling direct sales and an automated online buylist.",
        },
      }}
      deepDiveSections={[
        {
          heading: "1. The Hidden Cost: The Anonymized Customer Barrier",
          paragraphs: [
            "TCGplayer provides immense top-of-funnel liquidity for new card shops. But as you scale, TCGplayer actively prevents you from building brand equity. Customer communications are strictly monitored, email addresses are obfuscated, and marketing direct to collectors is prohibited.",
            "Every card you sell on TCGplayer builds TCGplayer's brand, not yours. When you launch your own custom platform, you own every customer email, phone number, and purchase history—allowing you to run automated SMS drop alerts for new sets that convert at 15% without paying a dime in ad fees.",
          ],
        },
        {
          heading: "2. The 'Keep the Engine, Own the Hub' Strategy",
          paragraphs: [
            "Leaving TCGplayer does not mean closing your seller account overnight. That would be leaving free money on the table. The winning strategy used by the largest card retailers in the country is the Hybrid Funnel:",
            "1. Maintain synchronized listings on TCGplayer for slow-moving singles and general discovery.",
            "2. Offer slightly lower prices, free shipping perks, and in-store pickup on your owned custom website.",
            "3. Include a branded flyer or coupon in every marketplace package inviting buyers to your direct storefront.",
            "Over 12 months, this systematically converts 30% to 50% of your marketplace buyers into direct, high-margin customers.",
          ],
        },
      ]}
      comparisonTable={{
        title: "TCGplayer Direct vs. Owned Aeethod Storefront",
        headers: ["Operational Factor", "Selling on TCGplayer", "Selling on Owned Platform"],
        rows: [
          {
            feature: "Transaction Fee",
            col1: "12.75% + payment processing",
            col2: "2.9% standard credit card gateway",
          },
          {
            feature: "Collector Contact Info",
            col1: "Blocked / Anonymized",
            col2: "Full customer profiles & emails owned",
          },
          {
            feature: "Store Credit Integration",
            col1: "TCGplayer store credit only",
            col2: "Unified in-store counter & web credit",
          },
          {
            feature: "Catalog Branding",
            col1: "Generic row in a price list",
            col2: "Custom high-end branded experience",
          },
          {
            feature: "Account Suspension Risk",
            col1: "Subject to platform policy changes",
            col2: "100% owned, uncancelable asset",
          },
        ],
      }}
      faqs={[
        {
          q: "Will we lose all our traffic if we build our own site?",
          a: "No, because you do not shut down your marketplace store immediately. Our multi-channel sync keeps your TCGplayer listings active in real time while your new direct storefront ramps up organic, local, and repeat traffic.",
        },
        {
          q: "How hard is it to migrate our active TCGplayer inventory?",
          a: "We extract your inventory data and map it directly into your new master catalog with zero downtime, ensuring pricing and conditions match perfectly.",
        },
      ]}
      relatedPages={[
        {
          tag: "DECISION",
          title: "When Should a TCG Store Build Its Own Website?",
          url: "/when-to-leave-tcgplayer",
          desc: "Read the strategic timeline and milestone checklist.",
        },
        {
          tag: "COMPARISON",
          title: "TCGplayer vs Shopify vs Custom Platform",
          url: "/tcgplayer-vs-shopify",
          desc: "Comprehensive feature and cost breakdown across options.",
        },
        {
          tag: "COMMERCE",
          title: "Custom TCG Website Development",
          url: "/custom-tcg-website",
          desc: "Explore what a dedicated card storefront looks and feels like.",
        },
      ]}
    />
  );
}
