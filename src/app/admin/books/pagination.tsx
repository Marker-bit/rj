"use client"

import { Button } from "@/components/ui/button"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

export default function BookPagination({
  currentPage,
  totalPages,
}: {
  currentPage: number
  totalPages: number
}) {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const { replace } = useRouter()

  const getPageUrl = (page: number) => {
    const params = new URLSearchParams(searchParams)
    params.set("page", page.toString())

    return `${pathname}?${params.toString()}`
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
      <Pagination>
        <PaginationContent>
          {currentPage > 1 && (
            <PaginationItem>
              <PaginationPrevious href={getPageUrl(currentPage - 1)} />
            </PaginationItem>
          )}
          <PaginationItem>
            <PaginationLink href={getPageUrl(1)}>1</PaginationLink>
          </PaginationItem>
          {currentPage > 2 && (
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          )}
          {currentPage !== 1 && currentPage !== totalPages && (
            <PaginationItem>
              <PaginationLink href={getPageUrl(currentPage)}>
                {currentPage}
              </PaginationLink>
            </PaginationItem>
          )}
          {currentPage < totalPages - 1 && (
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          )}
          {totalPages !== 1 && (
            <PaginationItem>
              <PaginationLink href={getPageUrl(totalPages)}>
                {totalPages}
              </PaginationLink>
            </PaginationItem>
          )}
          {currentPage < totalPages && (
            <PaginationItem>
              <PaginationNext href={getPageUrl(currentPage + 1)} />
            </PaginationItem>
          )}
        </PaginationContent>
      </Pagination>
    </div>
  )
}
