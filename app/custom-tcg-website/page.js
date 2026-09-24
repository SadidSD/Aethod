import TcgTopicPage from "../components/seo/TcgTopicPage";

export default function CustomTcgWebsitePage() {
  return (
    <TcgTopicPage
      badge="MONEY PAGE · DIRECT COMMERCE"
      title="Custom TCG Website"
      highlightedTitle="Development"
      subtitle="Purpose-built e-commerce storefronts designed for modern trading card collectors and high-volume retail stores."
      breadcrumbTitle="Custom TCG Website"
      answerBlock={{
        heading: "Why Build a Custom TCG Website?",
        directAnswer:
          "A custom TCG website replaces rigid generic e-commerce templates with specialized card retail infrastructure. It allows card shops to bypass Shopify's 100-variant limit, save 12% to 15% on marketplace transaction fees, offer sub-35ms faceted filtering across 50,000+ singles, and integrate automated in-store buylists directly into checkout.",
        keySignals: [
          "10,000+ active singles in inventory",
          "Paying more than $2,500/month in TCGplayer or eBay fees",
          "Need for unified customer trade credit online and at the physical counter",
          "Desire to build direct customer relationships and owned email lists",
        ],
      }}
      evidence={{
        title: "Storefront Performance Metrics",
        metrics: [
          {
            value: "< 35ms",
            label: "Catalog Filter Latency",
            desc: "Instant client-side filtering without full page reloads.",
          },
          {
            value: "100%",
            label: "Customer Data Ownership",
            desc: "Direct collector emails, SMS, and purchase histories retained.",
          },
          {
            value: "12% - 15%",
            label: "Margin Savings",
            desc: "Kept in your business rather than surrendered to marketplaces.",
          },
          {
            value: "300+",
            label: "Variants Per Card",
            desc: "Condition, language, foil, and slab grades on 1 URL.",
          },
        ],
        caseStudy: {
          client: "RNG Gamez",
          link: "/works/rng-gamez",
          summary:
            "Implemented an ultra-responsive direct storefront featuring interactive card variant selectors, high-speed set filtering, and a customer trade-in buylist.",
        },
      }}
      deepDiveSections={[
        {
          heading: "1. Solving the TCG Variant Problem",
          paragraphs: [
            "In card retail, treating each variation as a distinct product creates duplicate content issues that destroy SEO rankings and confuse collectors. If you have 5 conditions (Near Mint, Lightly Played, Moderately Played, Heavily Played, Damaged) across 4 printings (Normal, Foil, Reverse Holo, Master Ball Holo) plus graded slabs, Shopify requires up to 25 distinct variants per single.",
            "Aeethod builds custom edge matrices that resolve all conditions and finishes onto a single canonical URL. Search engines index one authoritative page, and buyers can toggle conditions with instant live pricing and photo previews.",
          ],
        },
        {
          heading: "2. Fast Search & Faceted Filtering",
          paragraphs: [
            "When a collector searches for 'Pikachu', they don't want to browse through 40 pages of unsorted results. They need instant filtering by Game (Pokémon, MTG, One Piece), Expansion Set, Card Number, Rarity (Secret Rare, Illustration Rare), and Price Range.",
            "Our custom search index runs on edge caching nodes, delivering sub-35ms results even on catalogs with 75,000+ individual singles.",
          ],
        },
      ]}
      comparisonTable={{
        title: "Standard E-Commerce Theme vs. Aeethod Custom TCG Website",
        headers: ["Feature", "Generic Shopify Theme", "Aeethod Custom Platform"],
        rows: [
          {
            feature: "Variant Limit",
            col1: "100 variants per product cap",
            col2: "Unlimited multi-dimensional variants",
          },
          {
            feature: "Search Latency",
            col1: "1.5s - 4.0s on deep catalogs",
            col2: "Sub-35ms edge index",
          },
          {
            feature: "Slab Certification Lookups",
            col1: "Manual product descriptions",
            col2: "Automated PSA / BGS API verification",
          },
          {
            feature: "In-Store Buylist Portal",
            col1: "Not available / Separate expensive app",
            col2: "Built-in trade-in intake system",
          },
          {
            feature: "Monthly Platform Cut",
            col1: "Apps + transaction fees",
            col2: "0% cut (Owned asset)",
          },
        ],
      }}
      faqs={[
        {
          q: "Can we still use Shopify as our backend if we want a custom frontend?",
          a: "Yes. We offer Headless Shopify setups where Shopify handles checkout and payment processing, while Aeethod powers the lightning-fast custom TCG storefront and variant matrix.",
        },
        {
          q: "How does the custom website handle out-of-stock singles?",
          a: "Collectors can subscribe to back-in-stock SMS/email alerts for specific card conditions. When you intake that card via buylist, the customer is notified automatically.",
        },
        {
          q: "Can customers choose between in-store counter pickup and shipping?",
          a: "Yes. Counter pickup options allow local players to buy singles online and pick them up at your shop counter within 15 minutes without shipping costs.",
        },
      ]}
      relatedPages={[
        {
          tag: "SERVICE",
          title: "Custom Commerce Platforms",
          url: "/services/commerce",
          desc: "Explore full feature set, interactive demos, and pricing tiers.",
        },
        {
          tag: "DECISION",
          title: "Has Your TCG Store Outgrown TCGplayer?",
          url: "/outgrown-tcgplayer",
          desc: "Calculate your transition ROI and evaluate when to launch your own store.",
        },
        {
          tag: "OPERATIONS",
          title: "Custom TCG Buylist System",
          url: "/tcg-buylist-system",
          desc: "Turn your website into a 24/7 card intake engine.",
        },
      ]}
    />
  );
}
