import { getPromiseProgress } from "@/lib/promises"
import { declOfNum } from "@/lib/utils"
import { Book, PromiseMode, ReadPromise } from "@prisma/client"
import { BookCheck, Check, Flame, X } from "lucide-react"

export default async function PromiseTag({
  promise,
}: {
  promise: ReadPromise & { books: Book[] }
}) {
  const { progress, total, mode, breakDay } = await getPromiseProgress(promise)
  return (
    <div className="flex flex-wrap items-center gap-2">
      {promise.mode === PromiseMode.FULL_BOOKS ? (
        <>
          <span className="flex items-center gap-2 rounded-full bg-blue-200 px-2 py-1 text-xs dark:bg-blue-800">
            <BookCheck className="size-4" strokeWidth={1.5} />
            Прочитать {promise.books.length}{" "}
            {declOfNum(promise.books.length, ["книгу", "книги", "книг"])}
          </span>
          {progress === total ? (
            <span className="flex items-center gap-2 rounded-full bg-green-200 px-2 py-1 text-xs dark:bg-green-800">
              <Check className="size-4" strokeWidth={1.5} /> Прочитано
            </span>
          ) : (
            <span className="flex items-center gap-2 rounded-full bg-red-200 px-2 py-1 text-xs dark:bg-red-800">
              <X className="size-4" strokeWidth={1.5} />
              {declOfNum(progress, [
                "Прочитана",
                "Прочитаны",
                "Прочитано",
              ])}{" "}
              {progress} {declOfNum(progress, ["книга", "книги", "книг"])} из{" "}
              {total}
            </span>
          )}
        </>
      ) : promise.mode === PromiseMode.STREAK ? (
        <span className="flex items-center gap-2 rounded-full bg-green-200 px-2 py-1 text-xs dark:bg-green-800">
          <Flame className="size-4" strokeWidth={1.5} />
          Читать {promise.streakPages}{" "}
          {declOfNum(promise.streakPages!, ["страницу", "страницы", "страниц"])}{" "}
          в день
        </span>
      ) : null}
    </div>
  )
}
