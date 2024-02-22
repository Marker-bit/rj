import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { BottomBar } from "./BottomBar";
import { Provider } from "./QueryClientProvider";

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
  return (
    <html lang="en">
      <body className={font.className + "  overflow-x-hidden"}>
        <Provider>
          <div className="min-h-screen">{children}</div>
          <BottomBar />
        </Provider>
      </body>
    </html>
  );
}
