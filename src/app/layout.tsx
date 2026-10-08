import type { Metadata } from "next";
import { Archivo, Geist_Mono } from "next/font/google";
import SmoothScroll from "@/components/SmoothScroll";
import "./globals.css";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  axes: ["wdth"],
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
      <body className={`${archivo.variable} ${geistMono.variable}`}>
        <SmoothScroll />
        {children}
      </body>
    </html>
  );
}
