import TcgTopicPage from "../components/seo/TcgTopicPage";

export default function WhenToLeaveTcgplayerPage() {
  return (
    <TcgTopicPage
      badge="STRATEGY GUIDE · MILESTONE CHECKLIST"
      title="When Should a TCG Store Build Its"
      highlightedTitle="Own Website?"
      subtitle="The exact operational benchmarks, inventory thresholds, and financial tipping points that tell card shop owners it's time to build independent digital infrastructure."
      breadcrumbTitle="When to Build Own Website"
      answerBlock={{
        heading: "The 4 Core Tipping Points",
        directAnswer:
          "A trading card game store should build its own website when: 1) Monthly marketplace fees exceed $2,500-$3,000; 2) Active inventory reaches 10,000+ single cards; 3) The shop has an active local or social community that wants to buy directly; and 4) You need an automated customer buylist to acquire high-margin singles without paying distributor markups.",
        keySignals: [
          "Milestone 1: $20,000+ in monthly sales volume",
          "Milestone 2: Catalog exceeds 10,000 singles and 500+ sealed items",
          "Milestone 3: Local players asking for in-store pickup on pre-orders",
          "Milestone 4: Staff spending more time dealing with marketplace disputes than packing orders",
        ],
      }}
      evidence={{
        title: "Typical Client Transition Timelines",
        metrics: [
          {
            value: "Month 1",
            label: "Schema & Catalog Extraction",
            desc: "Mapping singles, sealed products, and variants into master database.",
          },
          {
            value: "Month 2",
            label: "Shadow Testing & Webhooks",
            desc: "Testing real-time inventory delisting without affecting live buyers.",
          },
          {
            value: "Month 3",
            label: "Production Launch",
            desc: "Zero-downtime DNS cutover with customer buylist live.",
          },
          {
            value: "Month 6",
            label: "Full Fee Break-Even",
            desc: "Direct sales commissions saved surpass total platform build cost.",
          },
        ],
        caseStudy: {
          client: "RNG Gamez",
          link: "/works/rng-gamez",
          summary:
            "Transitioned from marketplace reliance to an owned direct-to-collector platform with high-speed search and integrated buylist trade-in capabilities.",
        },
      }}
      deepDiveSections={[
        {
          heading: "1. The 3 Phases of Card Shop Growth",
          paragraphs: [
            "Phase 1: Bootstrapping on Marketplaces ($0 - $15,000/mo). When starting out, TCGplayer and eBay provide essential buyer traffic. You lack brand recognition and your primary goal is generating cash flow. Building a custom website here is premature.",
            "Phase 2: The Friction Plateau ($15,000 - $40,000/mo). You now have steady customers and deep inventory. However, marketplace commission fees start eating 12% to 15% of your gross sales ($2,000 to $6,000/mo). Double-selling during tournaments becomes a frequent hazard. This is the exact moment to build your custom platform.",
            "Phase 3: The Omnichannel Powerhouse ($40,000+/mo). Your website is the primary destination where repeat collectors buy with loyalty rewards and in-store pickup. TCGplayer and eBay are used purely as secondary liquidity channels with higher prices to offset fees.",
          ],
        },
        {
          heading: "2. The Buylist Advantage of an Owned Store",
          paragraphs: [
            "One of the biggest reasons to launch your own website isn't just selling cards—it's buying them. Running an automated online buylist lets you acquire collections from players across the country, replenishing your inventory at 50% of market value.",
          ],
        },
      ]}
      comparisonTable={{
        title: "Phase 1 vs. Phase 2 vs. Phase 3 Infrastructure",
        headers: ["Metric", "Phase 1: Marketplace Only", "Phase 2: The Transition Moment", "Phase 3: Omnichannel Hub"],
        rows: [
          {
            feature: "Monthly Sales",
            col1: "< $15,000 / month",
            col2: "$15,000 - $40,000 / month",
            col3: "$40,000+ / month",
          },
          {
            feature: "Primary Bottleneck",
            col1: "Finding buyers",
            col2: "Marketplace commission fees",
            col3: "Staff fulfillment speed",
          },
          {
            feature: "Recommended Stack",
            col1: "TCGplayer / eBay direct",
            col2: "Custom Storefront + Auto Sync",
            col3: "Full Suite + Repricer + Buylist",
          },
        ],
      }}
      faqs={[
        {
          q: "What is the biggest mistake card stores make when building their first website?",
          a: "Choosing a generic Shopify theme that limits variants to 100 per product and lags when loading 20,000 singles. Trading cards require specialized high-density catalog architecture.",
        },
        {
          q: "How do we get collectors to visit our new website?",
          a: "Include branded promotional cards in every TCGplayer and eBay package with a 5% off first order code, offer free in-store pickup for local players, and provide better trade-in store credit rates on your site.",
        },
      ]}
      relatedPages={[
        {
          tag: "DECISION",
          title: "Has Your TCG Store Outgrown TCGplayer?",
          url: "/outgrown-tcgplayer",
          desc: "Calculate your annual fee savings and margin upside.",
        },
        {
          tag: "COMMERCE",
          title: "Custom TCG Website Development",
          url: "/custom-tcg-website",
          desc: "Explore the custom architecture and technical specs.",
        },
      ]}
    />
  );
}
