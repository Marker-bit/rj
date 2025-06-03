import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "@/app/globals.css"
import { QueryProvider } from "@/components/providers/query-client-provider"
import { ThemeProvider } from "@/components/providers/theme-provider"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Toaster } from "@/components/ui/toaster"
import { Toaster as Sonner } from "@/components/ui/sonner"
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin"
import { extractRouterConfig } from "uploadthing/server"

import { ourFileRouter } from "@/app/(app)/api/uploadthing/core"

const font = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  metadataBase: new URL("https://rjrj.ru/"),
  title: "Читательский дневник",
  description: "Читательский дневник - социальная сеть для читателей",
  manifest: "https://rjrj.ru/manifest.json",
  twitter: {
    card: "summary_large_image",
    title: "Reading Journal",
    description: "A service for reading fans",
    images: ["https://rjrj.ru/og.png"],
  },
  openGraph: {
    title: "Читательский дневник",
    description: "Читательский дневник",
    url: "https://rjrj.ru/",
    images: ["https://rjrj.ru/og.png"],
  },
  appLinks: {
    web: {
      url: "https://rjrj.ru/",
    },
  },
  creator: "Mark Pentus",
  keywords: ["rj", "reading journal", "reading", "journal"],
  icons: {
    apple: [
      {
        url: "https://rjrj.ru/images/icons/icon-72x72.png",
        sizes: "72x72",
        type: "image/png",
      },
      {
        url: "https://rjrj.ru/images/icons/icon-96x96.png",
        sizes: "96x96",
        type: "image/png",
      },
      {
        url: "https://rjrj.ru/images/icons/icon-128x128.png",
        sizes: "128x128",
        type: "image/png",
      },
      {
        url: "https://rjrj.ru/images/icons/icon-144x144.png",
        sizes: "144x144",
        type: "image/png",
      },
      {
        url: "https://rjrj.ru/images/icons/icon-152x152.png",
        sizes: "152x152",
        type: "image/png",
      },
      {
        url: "https://rjrj.ru/images/icons/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        url: "https://rjrj.ru/images/icons/icon-384x384.png",
        sizes: "384x384",
        type: "image/png",
      },
      {
        url: "https://rjrj.ru/images/icons/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
    other: [
      {
        url: "https://rjrj.ru/images/icons/icon-72x72.png",
        sizes: "72x72",
        type: "image/png",
      },
      {
        url: "https://rjrj.ru/images/icons/icon-96x96.png",
        sizes: "96x96",
        type: "image/png",
      },
      {
        url: "https://rjrj.ru/images/icons/icon-128x128.png",
        sizes: "128x128",
        type: "image/png",
      },
      {
        url: "https://rjrj.ru/images/icons/icon-144x144.png",
        sizes: "144x144",
        type: "image/png",
      },
      {
        url: "https://rjrj.ru/images/icons/icon-152x152.png",
        sizes: "152x152",
        type: "image/png",
      },
      {
        url: "https://rjrj.ru/images/icons/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        url: "https://rjrj.ru/images/icons/icon-384x384.png",
        sizes: "384x384",
        type: "image/png",
      },
      {
        url: "https://rjrj.ru/images/icons/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
    icon: [
      {
        url: "https://rjrj.ru/images/icons/icon-72x72.png",
        sizes: "72x72",
        type: "image/png",
      },
      {
        url: "https://rjrj.ru/images/icons/icon-96x96.png",
        sizes: "96x96",
        type: "image/png",
      },
      {
        url: "https://rjrj.ru/images/icons/icon-128x128.png",
        sizes: "128x128",
        type: "image/png",
      },
      {
        url: "https://rjrj.ru/images/icons/icon-144x144.png",
        sizes: "144x144",
        type: "image/png",
      },
      {
        url: "https://rjrj.ru/images/icons/icon-152x152.png",
        sizes: "152x152",
        type: "image/png",
      },
      {
        url: "https://rjrj.ru/images/icons/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        url: "https://rjrj.ru/images/icons/icon-384x384.png",
        sizes: "384x384",
        type: "image/png",
      },
      {
        url: "https://rjrj.ru/images/icons/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  },
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={font.className + "  overflow-x-hidden"}>
        <QueryProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <TooltipProvider>
              <NextSSRPlugin
                routerConfig={extractRouterConfig(ourFileRouter)}
              />
              {children}
              <Analytics />
              <SpeedInsights />
              <Toaster />
              <Sonner />
            </TooltipProvider>
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  )
}
