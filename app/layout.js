import { Inter, DM_Sans, Sora } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./context/ThemeContext";
import { ChatProvider } from "./context/ChatContext";
import Chatbox from "./components/Chatbox";

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
  weight: ["300", "400", "500", "600", "700", "800"],
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
      <head suppressHydrationWarning>
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


