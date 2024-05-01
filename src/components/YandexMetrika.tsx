"use client"

import { useEffect } from "react"
import { usePathname, useSearchParams } from "next/navigation"

export default function YandexMetrika() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    const url = `${pathname}?${searchParams}`
    ym(process.env.NEXT_PUBLIC_YAMETRICA_ID, "hit", url)
  }, [pathname, searchParams])

  return null
}
