import "@/app/globals.css"
import { BottomBar } from "../../components/navigation/bottom-bar"
import React from "react"

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="relative grid h-dvh w-full justify-stretch md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <BottomBar />
      <div className="w-full overflow-auto">{children}</div>
    </div>
  )
}
