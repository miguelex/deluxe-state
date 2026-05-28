import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import { LocaleProvider } from "@/lib/LocaleContext";
import { getLocale } from "@/lib/getLocale";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Luxe Estate - Premium Real Estate",
  description: "Find your sanctuary with Luxe Estate.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();

  return (
    <html lang={locale}>
      <head>
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body
        className={`${inter.variable} antialiased bg-background-light text-nordic-dark font-display selection:bg-mosque selection:text-white`}
        suppressHydrationWarning
      >
        <LocaleProvider locale={locale}>
          <Navbar />
          {children}
        </LocaleProvider>
      </body>
    </html>
  );
}
