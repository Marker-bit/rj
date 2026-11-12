import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/app/globals.css";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";
import { ourFileRouter } from "@/app/(app)/api/uploadthing/core";
import { Analytics } from "@/components/analytics";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { SITE_URL } from "@/lib/site";

const font = Inter({ variable: "--font-inter", subsets: ["latin"] });
const iconSizes = [72, 96, 128, 144, 152, 192, 384, 512] as const;
const icons = iconSizes.map((size) => ({
  url: `/images/icons/icon-${size}x${size}.png`,
  sizes: `${size}x${size}`,
  type: "image/png",
}));

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
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
    url: SITE_URL,
    images: ["/og.png"],
  },
  appLinks: {
    web: {
      url: SITE_URL,
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
    <html lang="ru" suppressHydrationWarning className={font.variable}>
      <body
        className={`${font.className} overflow-x-hidden`}
        vaul-drawer-wrapper=""
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} />
          {children}
          <Analytics isVercel={isVercel} />
        </ThemeProvider>
      </body>
    </html>
  );
}
