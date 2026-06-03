import type { Metadata } from "next";
import { Cormorant_Garamond, Outfit } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-cormorant",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "SkyBook | Flight Reservation",
  description: "Search flights, choose seats, and manage reservations with SkyBook.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`h-full antialiased ${cormorant.variable} ${outfit.variable}`}>
      <body className="min-h-full flex flex-col font-sans bg-background text-foreground relative">
        <div className="pointer-events-none fixed inset-0 z-50 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-[0.03] mix-blend-overlay"></div>
        <Header />
        <div className="flex-1">{children}</div>
      </body>
    </html>
  );
}
