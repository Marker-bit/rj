import { Analytics } from "@vercel/analytics/react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { BottomBar } from "./BottomBar";
import { Provider } from "./QueryClientProvider";
import Script from "next/script";
import { Suspense } from "react";
import YandexMetrika from "@/components/YandexMetrika";

const font = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Читательский дневник",
  description: "Читательский дневник",
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
      <body className={font.className + "  overflow-x-hidden"}>
        <Provider>
          <div className="min-h-screen">{children}</div>
          <BottomBar />
          <Analytics />
          {production && (
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
          )}
        </Provider>
      </body>
    </html>
  );
}
