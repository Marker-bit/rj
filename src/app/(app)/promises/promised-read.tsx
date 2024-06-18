"use client"
import { declOfNum } from "@/lib/utils"
import { ReadPromise } from "@prisma/client"
import { BookOpen, Flame } from "lucide-react"

export default function PromisedRead({ promise }: { promise: ReadPromise }) {
  return (
    <>
      <div className="flex items-center gap-2 font-bold">
        <BookOpen className="size-4" />
        Прочитать {promise.pagesCount}{" "}
        {declOfNum(promise.pagesCount!, ["страницу", "страницы", "страниц"])}
      </div>
    </>
  )
}
