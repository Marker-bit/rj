"use client"

import { Button } from "@/components/ui/button"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

export default function Pagination({
  currentPage,
  totalPages,
}: {
  currentPage: number
  totalPages: number
}) {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const { replace } = useRouter()

  const changePage = (page: number) => {
    const params = new URLSearchParams(searchParams)
    params.set("page", page.toString())

    replace(`${pathname}?${params.toString()}`)
  }

  return (
    <div className="flex items-center justify-between">
      {/* {[...Array(totalPages)].map((_, i) => (
        <button
          key={i}
          className={`${
            currentPage === i + 1 ? "bg-zinc-900 text-white" : "bg-zinc-100"
          } rounded-lg p-2`}
          onClick={() => changePage(i + 1)}
        >
          {i + 1}
        </button>
      ))} */}
      <Button
        onClick={() => changePage(currentPage - 1)}
        className="flex items-center gap-2"
        disabled={currentPage === 1}
      >
        <ArrowLeft className="size-4" />
        <div className="max-sm:hidden">Назад</div>
      </Button>
      {currentPage}/{totalPages}
      <Button
        onClick={() => changePage(currentPage + 1)}
        className="flex items-center gap-2"
        disabled={currentPage === totalPages}
      >
        <div className="max-sm:hidden">Вперёд</div>
        <ArrowRight className="size-4" />
      </Button>
    </div>
  )
}
