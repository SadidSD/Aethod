"use client";

import ServiceInsiderPage from "../ServiceInsiderPage";

const intelligenceData = {
  id: "intelligence",
  stage: "Stage 05 · Scale Intelligently",
  titlePrefix: "Custom Intelligence & ",
  titleAccent: "SaaS",
  subtitle: "Scale your card shop with proprietary technology.",
  heroDescription:
    "Proprietary internal tools, competitive intelligence, tournament meta trackers, and specialized AI sorting agents built around how your store operates. Build bespoke software assets that your business owns outright and uses as a long-term competitive moat.",
  hudMetrics: [
    { label: "Meta Buyout Detection Speed", value: "< 90 Seconds", highlight: true },
    { label: "AI Sorting Classification Rate", value: "60 Cards / Min", highlight: true },
    { label: "Dead Capital Identified", value: "18% Stock Recovered", highlight: false },
    { label: "Proprietary Code Ownership", value: "100% Client IP", highlight: false }
  ],
  quickList: [
    {
      title: "Blind Market Buyouts",
      desc: "Get real-time alerts when regional tournament decklists or influencer mentions cause sudden card buyouts before your inventory gets wiped out below replacement value."
    },
    {
      title: "Unstructured Business Data",
      desc: "Clear analytical dashboards showing your highest-margin game categories, true aging inventory, and highest-LTV collectors instead of messy generic spreadsheets."
    },
    {
      title: "Card Sorting & Intake Bottlenecks",
      desc: "AI-assisted camera identification for high-speed bulk sorting, set classification, and cataloging—sorting 500-card lots in minutes."
    },
    {
      title: "Renting Other Companies' SaaS",
      desc: "Stop paying $500+/month for clunky third-party tools that don't fit your store's workflow. Build proprietary micro-SaaS tools that become your store's equity."
    }
  ],
  blueprint: [
    {
      num: "MODULE 01",
      title: "Tournament Meta & Buyout Telemetry",
      desc: "Automated scraper tracking decklist trends, regional tournament winners, and sudden market spikes.",
      tag: "Telemetry"
    },
    {
      num: "MODULE 02",
      title: "AI Visual Card Recognition Classifier",
      desc: "Computer-vision pipeline that identifies card art, expansion logo, language, and foil finish in real time.",
      tag: "AI / Vision"
    },
    {
      num: "MODULE 03",
      title: "Dead Stock Liquidation Intelligence",
      desc: "Identifies stagnant singles eating up showcase space and suggests optimal bundle or buylist markdown strategies.",
      tag: "Analytics"
    },
    {
      num: "MODULE 04",
      title: "VIP Collector Relationship Management",
      desc: "Tracks whale customer wishlists and alerts counter staff when coveted chase cards enter the store.",
      tag: "Collector CRM"
    },
    {
      num: "MODULE 05",
      title: "Executive Margin & Cashflow Dashboards",
      desc: "Real-time telemetry showing daily gross profit, inventory turn rate, and capital tied up in grading submissions.",
      tag: "Executive UI"
    },
    {
      num: "MODULE 06",
      title: "Custom Micro-SaaS Internal Portals",
      desc: "Bespoke tools built for unique operations: tournament scheduling, prize-wall management, or consigner portals.",
      tag: "Custom SaaS"
    },
    {
      num: "MODULE 07",
      title: "Consignment Tracking & Payout Ledger",
      desc: "Manage third-party seller consignment cards with automated sales splits, monthly reporting, and payouts.",
      tag: "Consignment"
    },
    {
      num: "MODULE 08",
      title: "Custom Partner API Gateway",
      desc: "Secure API endpoints allowing trusted partners, event organizers, or remote buyers to interact with your system.",
      tag: "API Infrastructure"
    }
  ],
  financing: {
    minPrice: "$5,000",
    maxPrice: "$12,000+",
    notice:
      "Scoped based on machine learning complexity, algorithm design, custom database architecture, and proprietary IP requirements.",
    body: "Custom Intelligence & SaaS engagements typically range from $5,000 to $12,000+. Every line of proprietary code, machine learning model, and architectural blueprint is 100% owned by your organization with no royalties or SaaS rent.",
    scopeTags: [
      "Full IP Ownership",
      "Custom AI Models",
      "Real-Time Telemetry",
      "Proprietary Architecture"
    ]
  },
  faqs: [
    {
      q: "Do we own the intellectual property (IP) of custom intelligence tools built by Aeethod?",
      a: "Yes, 100%. All custom algorithms, web portals, dashboards, and AI pipeline code are transferred directly to your organization upon delivery."
    },
    {
      q: "How does the AI card recognition work in a store environment?",
      a: "We deploy lightweight computer vision pipelines that can run via high-resolution webcams or mobile camera stations. The model identifies card name, collector number, set symbol, and foil surface in under a second."
    },
    {
      q: "Can we build a custom portal for consigners to track their graded slabs?",
      a: "Yes. We frequently build self-service portals where consigners can view live sales, track cards currently at PSA/BGS grading, and request direct payouts."
    },
    {
      q: "What if our business wants to commercialize a tool as our own external SaaS product?",
      a: "We engineer systems with modular, multi-tenant architectures from day one. You can use it internally today, and if you choose, commercialize it to other stores tomorrow."
    }
  ]
};

export default function IntelligencePage() {
  return <ServiceInsiderPage {...intelligenceData} />;
}
