import TcgTopicPage from "../components/seo/TcgTopicPage";

export default function CustomTcgSoftwarePage() {
  return (
    <TcgTopicPage
      badge="CUSTOM ENGINEERING · ENTERPRISE SYSTEMS"
      title="Custom TCG Software"
      highlightedTitle="Engineering"
      subtitle="Bespoke software architecture engineered for large-scale trading card retailers, distributors, and platform operators whose needs exceed off-the-shelf tools."
      breadcrumbTitle="Custom TCG Software"
      answerBlock={{
        heading: "When Does a Card Business Need Custom Software?",
        directAnswer:
          "Card businesses require custom software engineering when generic apps, fragmented SaaS subscriptions, or marketplace limitations cap business growth. Whether you need a custom POS bridge connecting legacy store hardware, a private warehouse inventory routing engine across multiple branch locations, or a proprietary auction platform, Aeethod engineers owned digital assets built to your exact specifications.",
        keySignals: [
          "Operating multiple physical store locations or a dedicated warehouse",
          "Paying $2,000+ monthly across 8+ disconnected SaaS subscriptions",
          "Unique business models (e.g. box breaks, card grading middleman, consignment vaults)",
          "Need for full intellectual property ownership and custom database architecture",
        ],
      }}
      evidence={{
        title: "Engineering Standards & Delivery",
        metrics: [
          {
            value: "100%",
            label: "Code Ownership",
            desc: "Full source code, repositories, and architecture transferred upon launch.",
          },
          {
            value: "Zero",
            label: "Vendor Lock-In",
            desc: "Built on open standards and modern serverless infrastructure.",
          },
          {
            value: "Enterprise",
            label: "Database Integrity",
            desc: "PostgreSQL databases built for ACID compliance and high concurrency.",
          },
          {
            value: "Dedicated",
            label: "Architect Support",
            desc: "Direct communication with senior systems engineers.",
          },
        ],
        caseStudy: {
          client: "RNG Gamez",
          link: "/works/rng-gamez",
          summary:
            "Architected bespoke TCG commerce systems addressing catalog scale, condition variations, and trade-in workflows.",
        },
      }}
      deepDiveSections={[
        {
          heading: "1. The Total Cost of Off-the-Shelf SaaS Fragmentations",
          paragraphs: [
            "Growing card stores typically patch together Shopify ($399/mo), an inventory sync app ($500/mo), a buylist app ($299/mo), a repricer ($400/mo), and fulfillment software ($250/mo). That is over $22,000 every year paid to third parties—and when any single app updates its API or crashes, the entire store breaks.",
            "Custom software replaces fragile multi-app subscriptions with a unified, owned platform that eliminates ongoing software taxes and delivers 10x higher operational reliability.",
          ],
        },
        {
          heading: "2. Engineered for Multi-Location Card Shops",
          paragraphs: [
            "Managing card inventory across 2 or 3 brick-and-mortar storefronts plus an e-commerce warehouse is nearly impossible with standard tools. Our custom software tracks precise bin and shelf locations per store branch, enabling cross-store transfers and distributed counter pick-up.",
          ],
        },
      ]}
      faqs={[
        {
          q: "Do we own the software code after Aeethod builds it?",
          a: "Yes. 100% of the repository, database schemas, and codebase are transferred to your organization. There are zero licensing royalties or vendor lock-in.",
        },
        {
          q: "How does Aeethod support the software after launch?",
          a: "We provide comprehensive documentation, staff training, and optional ongoing infrastructure maintenance and feature expansion retainers.",
        },
      ]}
      relatedPages={[
        {
          tag: "PILLAR",
          title: "TCG Commerce Systems",
          url: "/tcg-commerce",
          desc: "Explore full digital infrastructure for trading card retailers.",
        },
        {
          tag: "COMMERCE",
          title: "Custom TCG Website Development",
          url: "/custom-tcg-website",
          desc: "High-converting direct storefronts built for card stores.",
        },
      ]}
    />
  );
}
