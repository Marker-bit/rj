import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import { Inter, Nunito_Sans } from "next/font/google";
import "@/app/globals.css";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";
import { ourFileRouter } from "@/app/(app)/api/uploadthing/core";
import { QueryProvider } from "@/components/providers/query-client-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import ClientUmamiAnalytics from "@/components/umami-analytics";

const nunitoSans = Nunito_Sans({ variable: "--font-sans" });

const font = Inter({ subsets: ["latin"] });
const siteUrl = "https://rj.markerbit.dev";
const iconSizes = [72, 96, 128, 144, 152, 192, 384, 512] as const;
const icons = iconSizes.map((size) => ({
  url: `/images/icons/icon-${size}x${size}.png`,
  sizes: `${size}x${size}`,
  type: "image/png",
}));

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Читательский дневник",
  description: "Читательский дневник - социальная сеть для читателей",
  manifest: "/manifest.webmanifest",
  twitter: {
    card: "summary_large_image",
    title: "Читательский дневник",
    description: "Социальная сеть для читателей",
    images: ["/og.png"],
  },
  openGraph: {
    title: "Читательский дневник",
    description: "Социальная сеть для читателей",
    url: siteUrl,
    images: ["/og.png"],
  },
  appLinks: {
    web: {
      url: siteUrl,
    },
  },
  creator: "Mark Pentus",
  keywords: ["rj", "reading journal", "reading", "journal"],
  icons: {
    apple: icons,
    icon: icons,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isVercel = process.env.VERCEL === "1";

  return (
    <html lang="ru" suppressHydrationWarning className={nunitoSans.variable}>
      <body
        className={`${font.className} overflow-x-hidden`}
        vaul-drawer-wrapper=""
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
              {children}
              {isVercel ? (
                <>
                  <Analytics />
                  <SpeedInsights />
                </>
              ) : (
                <ClientUmamiAnalytics
                  dryRun={process.env.NODE_ENV === "development"}
                  debug={process.env.NODE_ENV === "development"}
                  websiteId={process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID}
                  src={process.env.NEXT_PUBLIC_UMAMI_SCRIPT_URL}
                />
              )}
              <Toaster />
            </TooltipProvider>
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
