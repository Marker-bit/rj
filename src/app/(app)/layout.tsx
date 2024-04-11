import "@/app/globals.css";
import { BottomBar } from "./BottomBar";
import React from "react";

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="grid w-full h-[100dvh] md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr] relative">
      <BottomBar />
      <div className="w-full overflow-auto">{children}</div>
    </div>
  );
}
