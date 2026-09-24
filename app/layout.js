import { Inter, DM_Sans, Sora } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./context/ThemeContext";
import { ChatProvider } from "./context/ChatContext";
import Chatbox from "./components/Chatbox";
import ResponsiveScaler from "./components/ResponsiveScaler";
import AnalyticsTracker from "./components/AnalyticsTracker";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800"],
});

import JsonLd from "./components/JsonLd";

export const viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#efeff4" },
    { media: "(prefers-color-scheme: dark)", color: "#070709" },
  ],
  width: "device-width",
  initialScale: 1,
};

export const metadata = {
  metadataBase: new URL("https://www.aeethod.com"),
  title: {
    default: "Aeethod — TCG Commerce Technology Studio",
    template: "%s | Aeethod",
  },
  description:
    "Aeethod engineers custom TCG commerce platforms, automated buylists, and real-time inventory sync across TCGplayer and eBay with 0% ongoing software fees.",
  keywords: [
    "TCG commerce technology studio",
    "custom TCG website",
    "TCG ecommerce platform",
    "trading card ecommerce website",
    "custom card shop website",
    "TCG inventory management",
    "TCG inventory software",
    "TCGplayer alternatives",
    "when to leave TCGplayer",
    "TCGplayer vs Shopify",
    "Shopify vs custom TCG website",
    "TCGplayer Shopify integration",
    "TCGplayer inventory sync",
    "eBay TCG inventory sync",
    "TCG marketplace integration",
    "multi-channel TCG inventory",
    "TCG buylist software",
    "TCG pricing automation",
    "TCG store automation",
    "TCG online store software",
  ],
  authors: [{ name: "Aeethod Studio", url: "https://www.aeethod.com" }],
  creator: "Aeethod",
  publisher: "Aeethod",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "/",
  },
  verification: {
    google: "IEDbWCCkC3ajWPt5l2QjB3l_eIprb9v6oesxBsOhuc0",
  },
  icons: {
    icon: [
      { url: "/icon-16.png?v=3", sizes: "16x16", type: "image/png" },
      { url: "/icon-32.png?v=3", sizes: "32x32", type: "image/png" },
      { url: "/icon-48.png?v=3", sizes: "48x48", type: "image/png" },
    ],
    shortcut: "/favicon.ico?v=3",
    apple: "/apple-touch-icon.png?v=3",
  },
  manifest: "/site.webmanifest?v=3",
  openGraph: {
    title: "Aeethod — TCG Commerce Technology Studio",
    description:
      "Custom commerce platforms, marketplace integrations, operations systems, and business automation for TCG stores outgrowing their marketplaces.",
    url: "https://www.aeethod.com",
    siteName: "Aeethod",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Aeethod — TCG Commerce Technology Studio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Aeethod — TCG Commerce Technology Studio",
    description:
      "Custom commerce platforms, inventory synchronization, and business automation for TCG stores outgrowing generic platforms.",
    images: ["/og-image.png"],
    creator: "@aeethod",
  },
};

const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "https://www.aeethod.com/#organization",
  name: "Aeethod",
  alternateName: ["Aeethod Studio", "Aeethod TCG Technology Studio"],
  url: "https://www.aeethod.com",
  logo: "https://www.aeethod.com/android-chrome-512x512.png",
  description:
    "Aeethod is a vertical technology studio engineering custom commerce platforms, marketplace inventory synchronization, buylist systems, and automation infrastructure for Trading Card Game (TCG) retailers.",
  knowsAbout: [
    "TCG Commerce Architecture",
    "Multi-Channel Inventory Synchronization",
    "TCGplayer API Integration",
    "eBay TCG Inventory Sync",
    "TCG Buylist Portals",
    "Algorithmic Card Repricing",
    "Condition Grading Matrices",
  ],
  sameAs: [
    "https://github.com/SadidSD/Aethod",
    "https://www.linkedin.com/company/aeethod",
  ],
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "sales and technical consultation",
    url: "https://www.aeethod.com/contact",
    availableLanguage: ["English"],
  },
};

const webSiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": "https://www.aeethod.com/#website",
  name: "Aeethod",
  url: "https://www.aeethod.com",
  description:
    "Aeethod — Custom TCG commerce platforms, inventory synchronization, and business automation.",
  publisher: {
    "@id": "https://www.aeethod.com/#organization",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${dmSans.variable} ${sora.variable}`} suppressHydrationWarning>
      <head suppressHydrationWarning>
        <JsonLd data={orgJsonLd} />
        <JsonLd data={webSiteJsonLd} />
        <script
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var saved = localStorage.getItem('theme');
                  if (saved === 'dark') {
                    document.documentElement.setAttribute('data-theme', 'dark');
                  } else {
                    document.documentElement.setAttribute('data-theme', 'light');
                  }
                } catch (e) {}
              })();
            `
          }}
        />
      </head>
      <body suppressHydrationWarning>
        <ResponsiveScaler />
        <AnalyticsTracker />
        <ThemeProvider>
          <ChatProvider>
            {children}
            <Chatbox />
          </ChatProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}


