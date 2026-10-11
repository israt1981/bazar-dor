import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "বাজার দর - BazarDor",
  description: "Essential commodity market prices in Bangladesh",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bn">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 flex flex-col min-h-screen`}>
        <Suspense fallback={<div className="h-20 bg-white border-b border-gray-100" />}>
          <Navbar />
        </Suspense>
        
        <main className="grow">{children}</main>
        
        <Footer />
      </body>
    </html>
  );
}