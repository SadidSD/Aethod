import JsonLd from "../components/JsonLd";

export const metadata = {
  title: "TCG Store Automation — Batch Shipping, Scanning & Orders",
  description:
    "Automate repetitive card shop busywork. 1-click thermal batch fulfillment, high-speed card scanner intake, and automated multi-channel order routing.",
  alternates: {
    canonical: "/tcg-store-automation",
  },
  openGraph: {
    title: "TCG Store Automation — Batch Shipping, Scanning & Orders | Aeethod",
    description:
      "Automate repetitive card shop busywork: 1-click thermal batch shipping, scanner intake, and automated order routing.",
    url: "https://aeethod.com/tcg-store-automation",
  },
};

const serviceJsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "TCG Store Automation Systems",
  serviceType: "Retail Automation Software Engineering",
  provider: {
    "@type": "Organization",
    name: "Aeethod",
    url: "https://aeethod.com",
  },
  description:
    "End-to-end retail automation for card shops: batch fulfillment queues, thermal label printing, high-speed optical scanning intake, and inventory synchronization.",
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How much staff time can card store automation save?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "High-volume card stores reclaim 20 to 30 hours of weekly staff busywork by automating shipping label printing, card intake data entry, and multi-channel order syncing.",
      },
    },
    {
      "@type": "Question",
      name: "Does this work with standard thermal shipping printers like Zebra or Rollo?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Our batch fulfillment dashboard outputs native ESC/POS and 4x6 label formats compatible with Zebra, Rollo, Brother, and Dymo thermal printers.",
      },
    },
  ],
};

export default function TcgStoreAutomationLayout({ children }) {
  return (
    <>
      <JsonLd data={serviceJsonLd} />
      <JsonLd data={faqJsonLd} />
      {children}
    </>
  );
}
