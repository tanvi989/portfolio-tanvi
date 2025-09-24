// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import Dock from "./components/Dock";
import Footer from "./components/Footer";
import FloatingActions from "./components/FloatingActions";
import ChatbotWidget from "./components/ChatbotWidget";
import Constellation from "./components/Constellation";
import DigitalCursor from "./components/DigitalCursor";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  // ← IMPORTANT: set your real production domain
  metadataBase: new URL("https://www.tanviparadkar.com"),
  title: {
    default: "Tanvi Paradkar — Full-Stack Software Engineer",
    template: "%s | Tanvi Paradkar",
  },
    keywords: [
    "full-stack software development",
    "custom web apps",
    "SaaS development",
    "Next.js",
    "React",
    "Node.js",
    "TypeScript",
    "API integrations",
    "AI integrations",
    "cloud solutions",
    "AWS",
    "Azure",
    "Vercel",
    "performance optimization",
    "UX/UI engineering",
    "global software services",
    "digital transformation",
  ],

  description:
    "Global software services: full-stack development, Next.js, Node, cloud, integrations, performance and SEO. Available worldwide.",
  // canonical can be overridden per page via generateMetadata
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "Tanvi Paradkar",
    url: "https://www.tanviparadkar.com",
    title: "Global Software Services",
    description:
      "Full-stack apps, APIs, cloud, and growth-ready websites for international clients.",
    images: ["/og-default.jpg"], // 1200x630
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    site: "@yourhandle", // set if you have one
    creator: "@yourhandle",
  },
  robots: {
    index: true,
    follow: true,
  
  },
  icons: [
    { rel: "icon", url: "/favicon.ico" },
    { rel: "apple-touch-icon", url: "/apple-touch-icon.png" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        />
        {/* Organization JSON-LD (global) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Tanvi Paradkar",
              url: "https://www.tanviparadkar.in",
              logo: "https://www.tanviparadkar.com/logo.png",
              sameAs: [
                "https://github.com/yourusername",
                "https://www.linkedin.com/in/yourusername"
              ],
              areaServed: "Worldwide",
              description:
                "Full-stack software engineering and global consulting services.",
            }),
          }}
        />
      </head>
      <body className={inter.className}>
  
        <Navbar />
        {children}
        <Dock />
        <FloatingActions />
        <ChatbotWidget />
        <Footer />
        <DigitalCursor />
      </body>
    </html>
  );
}
