import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/app/globals.css";

const font = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://rj-ten.vercel.app/"),
  title: "Читательский дневник",
  description: "Читательский дневник",
  twitter: {
    card: "summary_large_image",
    title: "Reading Journal",
    description: "A service for reading fans",
    images: ["https://rj-ten.vercel.app/og.png"],
  },
  openGraph: {
    title: "Читательский дневник",
    description: "Читательский дневник",
    url: "https://rj-ten.vercel.app/",
    images: ["https://rj-ten.vercel.app/og.png"],
  },
  appLinks: {
    web: {
      url: "https://rj-ten.vercel.app/",
    },
  },
  creator: "Mark Pentus",
  keywords: ["rj", "reading journal", "reading", "journal"],
  other: {
    ["yandex-verification"]: process.env.YANDEX_VERIFICATION || "",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={font.className + "  overflow-x-hidden"}>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
