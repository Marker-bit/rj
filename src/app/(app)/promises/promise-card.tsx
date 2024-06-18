import { Skeleton } from "@/components/ui/skeleton"
import { Book, PromiseMode, ReadEvent, ReadPromise } from "@prisma/client"
import { Suspense } from "react"
import PromiseTag from "./promise-tag"
import { getPromiseProgress } from "@/lib/promises"
import {
  BookCheck,
  CalendarIcon,
  Check,
  Clock,
  Flame,
  Timer,
  X,
} from "lucide-react"
import { cn, dateToString, declOfNum } from "@/lib/utils"
import Image from "next/image"
import PromisedBooks from "./promised-books"
import { Progress } from "@/components/ui/progress"
import PromisedStreak from "./promised-streak"
import { differenceInDays, format, isAfter, isBefore } from "date-fns"
import PromisedRead from "./promised-read"

export default async function PromiseCard({
  promise,
}: {
  promise: ReadPromise & { books: (Book & { readEvents: ReadEvent[] })[] }
}) {
  const { progress, total, mode, breakDay } = await getPromiseProgress(promise)

  const pagesRead = promise.books
    .map((book) => book.readEvents[book.readEvents.length - 1]?.pagesRead || 0)
    .reduce((a, b) => a + b, 0)
  const fullPages = promise.books
    .map((book) => book.pages)
    .reduce((a, b) => a + b, 0)

  const time = differenceInDays(promise.dueDate, promise.startDate) + 1

  return (
    <div className="flex flex-col gap-2 rounded-xl border p-2">
      <div>
        {mode === PromiseMode.FULL_BOOKS ? (
          <PromisedBooks books={promise.books} />
        ) : mode === PromiseMode.STREAK ? (
          <PromisedStreak promise={promise} />
        ) : (
          mode === PromiseMode.READ_PAGES && <PromisedRead promise={promise} />
        )}
      </div>

      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          {progress === total ? (
            <>
              <Check className="size-4" strokeWidth={1.5} />
              Обещание выполнено
            </>
          ) : mode === PromiseMode.READ_PAGES ? (
            <>
              <Flame className="size-4" strokeWidth={1.5} />
              Прочитано {progress}{" "}
              {declOfNum(progress, ["страница", "страницы", "страниц"])} из{" "}
              {total}
            </>
          ) : mode === PromiseMode.STREAK ? (
            <>
              Вы читали {progress}{" "}
              {declOfNum(progress, ["день", "дня", "дней"])} из {total}, вы
              прервали чтение {dateToString(breakDay!)}
            </>
          ) : (
            <>
              Вы прочитали {progress}{" "}
              {declOfNum(progress, ["книгу", "книги", "книг"])} из {total}
            </>
          )}
        </div>
        {mode === PromiseMode.FULL_BOOKS && progress !== total && (
          <p className="text-muted-foreground">
            Вы прочитали {pagesRead}{" "}
            {declOfNum(pagesRead, ["страницу", "страницы", "страниц"])} из{" "}
            {fullPages},{" "}
            {declOfNum(fullPages - pagesRead, [
              "осталась",
              "осталось",
              "осталось",
            ])}{" "}
            {fullPages - pagesRead}{" "}
            {declOfNum(fullPages - pagesRead, [
              "страница",
              "страницы",
              "страниц",
            ])}
          </p>
        )}
        <div className="text-sm text-muted-foreground">
          С {format(promise.startDate, "dd.MM.yyyy")} по{" "}
          {format(promise.dueDate, "dd.MM.yyyy")} ({time}{" "}
          {declOfNum(time, ["день", "дня", "дней"])})
        </div>
        {isBefore(promise.dueDate, new Date()) ? (
          <div className="flex items-center gap-2 text-sm text-orange-500">
            <Timer className="size-4" strokeWidth={1.5} /> Прошло
          </div>
        ) : isAfter(promise.startDate, new Date()) ? (
          <div className="flex items-center gap-2 text-sm text-orange-500">
            <CalendarIcon className="size-4" strokeWidth={1.5} /> Создано
          </div>
        ) : (
          <div
            className={cn(
              "flex items-center gap-2 text-sm",
              progress === total ? "text-green-500" : "text-orange-500"
            )}
          >
            <Clock className="size-4" strokeWidth={1.5} />{" "}
            {declOfNum(differenceInDays(promise.dueDate, new Date()) + 1, [
              "Остался",
              "Осталось",
              "Осталось",
            ])}{" "}
            {differenceInDays(promise.dueDate, new Date()) + 1}{" "}
            {declOfNum(differenceInDays(promise.dueDate, new Date()) + 1, [
              "день",
              "дня",
              "дней",
            ])}
          </div>
        )}
      </div>
      {/* <div className="text-sm text-muted-foreground">
          = {promise.books.map}
        </div> */}
      {/* <div className="flex flex-wrap items-center gap-2">
        {mode === PromiseMode.FULL_BOOKS ? (
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
        ) : mode === PromiseMode.STREAK ? (
          <span className="flex items-center gap-2 rounded-full bg-green-200 px-2 py-1 text-xs dark:bg-green-800">
            <Flame className="size-4" strokeWidth={1.5} />
            Читать {promise.streakPages}{" "}
            {declOfNum(promise.streakPages!, [
              "страницу",
              "страницы",
              "страниц",
            ])}{" "}
            в день
          </span>
        ) : null}
      </div> */}
    </div>
  )
}
