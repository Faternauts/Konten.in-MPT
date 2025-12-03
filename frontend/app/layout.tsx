import type React from "react";
import type { Metadata } from "next";
import { Inter, Permanent_Marker } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import Script from "next/script";
import "./globals.css";
import { Navigation } from "@/components/navigation";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-inter",
});

const marker = Permanent_Marker({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-marker",
});

export const metadata: Metadata = {
  title: "Konten.in - Turn Customers Into Your Creative Team",
  description: "A social platform where users remix and recreate ads using AI",
  generator: "v0.app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <Script src="https://p.conversion.ai" strategy="afterInteractive" />
      </head>
      <body className={`font-sans antialiased`}>
        <Navigation />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
