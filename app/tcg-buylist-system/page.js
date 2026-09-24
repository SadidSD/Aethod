import TcgTopicPage from "../components/seo/TcgTopicPage";

export default function TcgBuylistSystemPage() {
  return (
    <TcgTopicPage
      badge="OPERATIONS · BUYLIST ENGINE"
      title="Custom TCG Buylist"
      highlightedTitle="System"
      subtitle="Transform your card shop website into an automated 24/7 card intake engine that fuels your inventory at 40% to 65% profit margins."
      breadcrumbTitle="TCG Buylist System"
      answerBlock={{
        heading: "What is an Automated TCG Buylist System?",
        directAnswer:
          "An automated TCG buylist system is a dedicated digital portal that allows collectors to search your buying prices, build trade-in submissions from home, and drop them off in-store or mail them in. It features customizable valuation multipliers, cash vs. store credit bonuses (e.g. +25% store credit), objective condition grading reconciliation, and thermal barcode intake slips that streamline counter staff review.",
        keySignals: [
          "Staff spending hours manually looking up TCGplayer market prices for trade-in binders",
          "Customers disputing condition grades at the physical counter",
          "Desire to increase high-margin singles inventory without relying on sealed distributor allocations",
          "Need for unified store credit balances spendable online and in-store",
        ],
      }}
      evidence={{
        title: "Trade-In & Buylist Metrics",
        metrics: [
          {
            value: "45% - 65%",
            label: "Net Resale Margin",
            desc: "On cards acquired via customer buylist trade-ins.",
          },
          {
            value: "3x Faster",
            label: "Counter Intake Speed",
            desc: "Pre-submitted digital binder lists eliminate manual price lookups.",
          },
          {
            value: "+25%",
            label: "Store Credit Incentive",
            desc: "Retains capital inside your store ecosystem for higher LTV.",
          },
          {
            value: "1-Click",
            label: "Thermal Intake Ticket",
            desc: "Prints batch customer intake tickets and shelf labels.",
          },
        ],
        caseStudy: {
          client: "RNG Gamez",
          link: "/works/rng-gamez",
          summary:
            "Launched the 'Sell Your Cards' buylist portal, allowing collectors to build instant trade-in orders online with live valuation calculations.",
        },
      }}
      deepDiveSections={[
        {
          heading: "1. The Economics of Card Shop Buylists",
          paragraphs: [
            "Sealed booster boxes from distributors yield razor-thin margins (often 12% to 18%) and require tying up thousands in upfront cash. In contrast, singles acquired through customer trade-ins are bought at 50% to 65% of market value, generating 45% to 65% profit margins upon resale.",
            "Card stores with an active, automated online buylist consistently dominate their local market by securing first access to high-value vintage cards, meta staples, and collector grails.",
          ],
        },
        {
          heading: "2. The Objective Grading Matrix & Intake Slips",
          paragraphs: [
            "Condition disagreements between staff and collectors are the number one source of friction during trade-ins. Our buylist embeds clear visual standards for Near Mint, Lightly Played, Moderately Played, Heavily Played, and Damaged cards.",
            "When staff inspect the physical cards, any condition adjustments immediately recalculate payout totals and print an itemized counter receipt or email confirmation.",
          ],
        },
      ]}
      comparisonTable={{
        title: "Manual Counter Lookups vs. Aeethod Buylist Portal",
        headers: ["Feature", "Manual Binder Appraisal", "Aeethod Buylist System"],
        rows: [
          {
            feature: "Appraisal Time",
            col1: "20 - 45 minutes per binder",
            col2: "< 5 minutes (Pre-submitted list)",
          },
          {
            feature: "Price Accuracy",
            col1: "Human calculation mistakes",
            col2: "Automated live market formulas",
          },
          {
            feature: "Store Credit Bonus",
            col1: "Manual calculator math",
            col2: "Instant toggle (+20% to +30%)",
          },
          {
            feature: "Submission Receipts",
            col1: "Handwritten paper slips",
            col2: "Thermal barcode ticket + Email confirmation",
          },
        ],
      }}
      faqs={[
        {
          q: "Can we pause buying specific cards or sets when our inventory is full?",
          a: "Yes. You can set maximum inventory buy limits (e.g. stop buying once you have 12 copies of a specific single) or pause buying entire sets with one click.",
        },
        {
          q: "How does the system calculate buylist offers?",
          a: "You define custom pricing rules per game, set, and rarity. For example, 65% cash for Pokémon meta staples, 50% for bulk foils, and +25% bonus for store credit.",
        },
      ]}
      relatedPages={[
        {
          tag: "SERVICE",
          title: "TCG Operations Systems",
          url: "/services/operations",
          desc: "Inspect live buylist terminal simulator and thermal receipt preview.",
        },
        {
          tag: "COMMERCE",
          title: "Custom TCG Website Development",
          url: "/custom-tcg-website",
          desc: "Embed your buylist portal directly into your custom storefront.",
        },
      ]}
    />
  );
}
