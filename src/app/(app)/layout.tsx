import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/app/globals.css";
import { BottomBar } from "./BottomBar";
import Script from "next/script";
import { Suspense } from "react";
import YandexMetrika from "@/components/YandexMetrika";
import { QueryProvider } from "@/components/providers/query-client-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { BreakpointIndicator } from "@/components/breakpoint-indicator";
import { TooltipProvider } from "@/components/ui/tooltip";

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
  const production = process.env.NODE_ENV === "production";
  const yandexMetricaId = process.env.NEXT_PUBLIC_YAMETRICA_ID;
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icon.png"></link>
        <meta name="theme-color" content="#fff" />
      </head>
      <body className={font.className + "  overflow-x-hidden"}>
        <QueryProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <TooltipProvider>
              <div className="grid w-full h-[100dvh] md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr] relative">
                <BottomBar />
                <div className="w-full overflow-auto">{children}</div>
              </div>
            </TooltipProvider>
          </ThemeProvider>
          <Analytics />
          <SpeedInsights />
          {/* {!production && <BreakpointIndicator />} */}
          {/* {production && (
            <Script id="metrika-counter" strategy="afterInteractive">
              {`(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
    m[i].l=1*new Date();
    for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
    k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
    (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");
 
    ym(${yandexMetricaId}, "init", {
          defer: true,
          clickmap:true,
          trackLinks:true,
          accurateTrackBounce:true,
          webvisor:true
    });`}
            </Script>
          )}
          {production && (
            <Suspense fallback={<></>}>
              <YandexMetrika />
            </Suspense>
          )} */}
        </QueryProvider>
      </body>
    </html>
  );
}
