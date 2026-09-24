import JsonLd from "../components/JsonLd";

export const metadata = {
  title: "Contact Aeethod — TCG Commerce Systems Consultation",
  description:
    "Schedule a direct consultation with our systems engineers. We examine your store's inventory friction, marketplace limits, buylist workflows, and platform bottlenecks.",
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    title: "Contact Aeethod — TCG Commerce Systems Consultation",
    description:
      "Schedule a direct consultation with our systems engineers. We examine your store's inventory friction, marketplace limits, and platform bottlenecks.",
    url: "https://aeethod.com/contact",
  },
};

const contactJsonLd = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  name: "Contact Aeethod",
  url: "https://aeethod.com/contact",
  description:
    "Get in touch with Aeethod for custom TCG commerce, marketplace integration, and business automation inquiries.",
  mainEntity: {
    "@type": "Organization",
    name: "Aeethod",
    url: "https://aeethod.com",
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service & technical sales",
      email: "sadidbinhasan3@gmail.com",
      availableLanguage: ["English"],
    },
  },
};

export default function ContactLayout({ children }) {
  return (
    <>
      <JsonLd data={contactJsonLd} />
      {children}
    </>
  );
}
