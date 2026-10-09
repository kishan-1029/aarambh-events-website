import type { Metadata, Viewport } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AnalyticsTracker from "@/components/AnalyticsTracker";

export const metadata: Metadata = {
  title: "Aarambh Events | Ahmedabad's Trusted Event Passes",
  description: "Ahmedabad's Trusted Destination for Genuine Event Passes. Discover event passes at competitive prices.",
  icons: {
    icon: [
      { url: '/icon.png', type: 'image/png' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    apple: [
      { url: '/apple-icon.png', type: 'image/png' },
    ],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <AnalyticsTracker />
        <Navbar />
        <main style={{ flex: 1, width: '100%', minWidth: 0 }}>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
