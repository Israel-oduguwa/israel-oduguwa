import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/ui/ThemeProvider";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://israeloduguwa.com"),
  title: "Israel Oduguwa — Frontend-Heavy Full-Stack Engineer",
  description: "Frontend-heavy full-stack engineer building product interfaces, dashboards, onboarding flows, and full-stack web features with Next.js, React, and Node.js.",
  keywords: [
    "Israel Oduguwa",
    "full-stack engineer",
    "frontend engineer",
    "Next.js developer",
    "React developer",
    "product engineer",
    "web application developer",
  ],
  authors: [{ name: "Israel Oduguwa", url: "https://israeloduguwa.com" }],
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
    title: "Israel Oduguwa — Frontend-Heavy Full-Stack Engineer",
    description: "Frontend-heavy full-stack engineer building product interfaces, dashboards, onboarding flows, and full-stack web features with Next.js, React, and Node.js.",
    url: "https://israeloduguwa.com",
    siteName: "Israel Oduguwa Portfolio",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Israel Oduguwa — Frontend-Heavy Full-Stack Engineer",
    description: "Frontend-heavy full-stack engineer building clean product interfaces, dashboards, onboarding flows, and full-stack web features.",
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
    <html lang="en" suppressHydrationWarning className={`scroll-smooth ${inter.className}`} id="top">
      <body className="bg-background text-foreground antialiased min-h-screen flex flex-col overflow-x-hidden selection:bg-primary/30">
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
