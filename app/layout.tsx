import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { ThemeProvider } from "@/components/ui/ThemeProvider";
import "./globals.css";
import "./portfolio-details.css";
import "./motion.css";

const displayFont = localFont({
  src: "./fonts/bricolage-grotesque.woff2",
  variable: "--font-display",
  weight: "400 800",
  display: "swap",
});
const bodyFont = localFont({
  src: "./fonts/dm-sans.woff2",
  variable: "--font-body",
  weight: "400 700",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://israel-oduguwa.vercel.app"),
  title: "Israel Oduguwa — Senior Full Stack Software Engineer",
  description:
    "Senior full-stack software engineer building reliable products, payment systems and applied AI. Case studies from KinsCare, Excel Health Careers and SafeStripe.",
  keywords: [
    "Israel Oduguwa",
    "full-stack engineer",
    "frontend engineer",
    "Next.js developer",
    "React developer",
    "product engineer",
    "web application developer",
  ],
  authors: [
    { name: "Israel Oduguwa", url: "https://israel-oduguwa.vercel.app" },
  ],
  creator: "Israel Oduguwa",
  publisher: "Israel Oduguwa",
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    title: "Israel Oduguwa — Senior Full Stack Software Engineer",
    description:
      "Senior full-stack software engineer building reliable products, payment systems and applied AI. Case studies from KinsCare, Excel Health Careers and SafeStripe.",
    url: "https://israel-oduguwa.vercel.app",
    siteName: "Israel Oduguwa Portfolio",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Israel Oduguwa — Senior Full Stack Software Engineer",
    description:
      "Product engineering, reliable backend workflows and applied AI. Explore the work of Israel Oduguwa.",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8fafc" },
    { media: "(prefers-color-scheme: dark)", color: "#060608" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="scroll-smooth" id="top">
      <body
        className={[
          displayFont.variable,
          bodyFont.variable,
          "bg-background text-foreground antialiased min-h-screen flex flex-col overflow-x-hidden selection:bg-primary/30",
        ].join(" ")}
      >
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          storageKey="portfolio-web-theme"
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
