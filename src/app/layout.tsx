import type { Metadata } from "next";
import { Funnel_Display, Funnel_Sans, Geist_Mono } from "next/font/google";
import SmoothScroll from "@/components/SmoothScroll";
import "./globals.css";

const funnelDisplay = Funnel_Display({
  variable: "--font-funnel-display",
  subsets: ["latin"],
});

const funnelSans = Funnel_Sans({
  variable: "--font-funnel-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Jade AI — Ask for clean data",
  description:
    "An AI data analyst that cleans, analyzes, and charts messy CSV and Excel files through conversation. Winner of Best Use of Groq at Cal Hacks 12.0.",
  openGraph: {
    title: "Jade AI — Ask for clean data",
    description: "An AI data analyst that cleans, analyzes, and charts messy spreadsheets through conversation.",
    images: ["/demo/poster.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${funnelDisplay.variable} ${funnelSans.variable} ${geistMono.variable}`}>
        <SmoothScroll />
        {children}
      </body>
    </html>
  );
}
