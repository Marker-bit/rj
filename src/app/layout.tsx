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
  metadataBase: new URL("https://rj-ten.vercel.app/"),
  title: "Читательский дневник",
  description: "Читательский дневник - социальная сеть для читателей",
  manifest: "https://rj-ten.vercel.app/manifest.json",
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
  icons: {
    apple: [
      {
        url: "https://rj-ten.vercel.app/images/icons/icon-72x72.png",
        sizes: "72x72",
        type: "image/png",
      },
      {
        url: "https://rj-ten.vercel.app/images/icons/icon-96x96.png",
        sizes: "96x96",
        type: "image/png",
      },
      {
        url: "https://rj-ten.vercel.app/images/icons/icon-128x128.png",
        sizes: "128x128",
        type: "image/png",
      },
      {
        url: "https://rj-ten.vercel.app/images/icons/icon-144x144.png",
        sizes: "144x144",
        type: "image/png",
      },
      {
        url: "https://rj-ten.vercel.app/images/icons/icon-152x152.png",
        sizes: "152x152",
        type: "image/png",
      },
      {
        url: "https://rj-ten.vercel.app/images/icons/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        url: "https://rj-ten.vercel.app/images/icons/icon-384x384.png",
        sizes: "384x384",
        type: "image/png",
      },
      {
        url: "https://rj-ten.vercel.app/images/icons/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
    other: [
      {
        url: "https://rj-ten.vercel.app/images/icons/icon-72x72.png",
        sizes: "72x72",
        type: "image/png",
      },
      {
        url: "https://rj-ten.vercel.app/images/icons/icon-96x96.png",
        sizes: "96x96",
        type: "image/png",
      },
      {
        url: "https://rj-ten.vercel.app/images/icons/icon-128x128.png",
        sizes: "128x128",
        type: "image/png",
      },
      {
        url: "https://rj-ten.vercel.app/images/icons/icon-144x144.png",
        sizes: "144x144",
        type: "image/png",
      },
      {
        url: "https://rj-ten.vercel.app/images/icons/icon-152x152.png",
        sizes: "152x152",
        type: "image/png",
      },
      {
        url: "https://rj-ten.vercel.app/images/icons/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        url: "https://rj-ten.vercel.app/images/icons/icon-384x384.png",
        sizes: "384x384",
        type: "image/png",
      },
      {
        url: "https://rj-ten.vercel.app/images/icons/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
    icon: [
      {
        url: "https://rj-ten.vercel.app/images/icons/icon-72x72.png",
        sizes: "72x72",
        type: "image/png",
      },
      {
        url: "https://rj-ten.vercel.app/images/icons/icon-96x96.png",
        sizes: "96x96",
        type: "image/png",
      },
      {
        url: "https://rj-ten.vercel.app/images/icons/icon-128x128.png",
        sizes: "128x128",
        type: "image/png",
      },
      {
        url: "https://rj-ten.vercel.app/images/icons/icon-144x144.png",
        sizes: "144x144",
        type: "image/png",
      },
      {
        url: "https://rj-ten.vercel.app/images/icons/icon-152x152.png",
        sizes: "152x152",
        type: "image/png",
      },
      {
        url: "https://rj-ten.vercel.app/images/icons/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        url: "https://rj-ten.vercel.app/images/icons/icon-384x384.png",
        sizes: "384x384",
        type: "image/png",
      },
      {
        url: "https://rj-ten.vercel.app/images/icons/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  },
  other: {
    ["yandex-verification"]: process.env.YANDEX_VERIFICATION || "",
  },
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={font.className + "  overflow-x-hidden"}
      >
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
              <div vaul-drawer-wrapper="" className="bg-background">{children}</div>
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
