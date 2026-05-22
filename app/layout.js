import { Inter, DM_Sans, Sora } from "next/font/google";
import "./globals.css";

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
  weight: ["300"],
});

export const metadata = {
  title: "Aeethod — Intelligent Systems for Complex Environments",
  description:
    "AI-first architectures, automation, and decision systems for businesses operating in uncertainty. We design intelligent digital systems — not apps, not websites — systems.",
  keywords: [
    "AI agency",
    "intelligent systems",
    "AI automation",
    "systems architecture",
    "applied research",
  ],
  openGraph: {
    title: "Aeethod — Intelligent Systems for Complex Environments",
    description:
      "AI-first architectures, automation, and decision systems for businesses operating in uncertainty.",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${dmSans.variable} ${sora.variable}`} suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
