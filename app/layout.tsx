import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SkyBook | Flight Reservation",
  description:
    "Search flights, choose seats, and manage reservations with SkyBook.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`h-full antialiased ${inter.className}`}>
      <body className="min-h-full flex flex-col bg-slate-950 text-slate-300">
        <Header />
        <div className="flex-1">{children}</div>
      </body>
    </html>
  );
}
