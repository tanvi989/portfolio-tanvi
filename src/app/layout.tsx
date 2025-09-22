import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import Dock from "./components/Dock";
import Footer from "./components/Footer";
import FloatingActions from "./components/FloatingActions";
import ChatbotWidget from "./components/ChatbotWidget";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "3D Portfolio - John Doe",
  description: "Full Stack Software Engineer portfolio",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Font Awesome for icons */}
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        />
      </head>
      <body className={inter.className}>
        <Navbar />
        {children}
        <Dock />
        <FloatingActions />
            <ChatbotWidget />
            <Footer />
      </body>
    </html>
  );
}
