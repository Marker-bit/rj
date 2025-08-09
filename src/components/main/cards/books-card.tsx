"use client"

import { AddBookDialog } from "@/components/book/book-form"
import { BookView } from "@/components/book/book-view"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { fetchBooks } from "@/lib/books"
import {
  ArrowRightIcon,
  ChevronRight,
  PlusIcon,
  TriangleAlert,
} from "lucide-react"
import Link from "next/link"
import { useEffect, useState, useTransition } from "react"
import { useLocalStorage } from "usehooks-ts"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { getBooks } from "@/lib/actions/books"
import { Skeleton } from "@/components/ui/skeleton"
import { useQuery, useQueryClient } from "@tanstack/react-query"

export default function BooksCard() {
  const [open, setOpen] = useState(false)
  const [orderBy, setOrderBy] = useLocalStorage<"percent" | "activity">(
    "orderBy",
    "percent"
  )
  const queryClient = useQueryClient()

  const percentBooks = useQuery({
    queryKey: ["books", "percent"],
    queryFn: () => getBooks("percent"),
    enabled: orderBy === "percent", // only fetch when percent is selected
  })

  const activityBooks = useQuery({
    queryKey: ["books", "activity"],
    queryFn: () => getBooks("activity"),
    enabled: orderBy === "activity", // only fetch when activity is selected
  })

  const booksQuery = orderBy === "percent" ? percentBooks : activityBooks

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Книги</CardTitle>
          <CardDescription className="flex gap-2 items-center">
            3 книги{" "}
            <Select
              value={orderBy}
              onValueChange={(a) => setOrderBy(a as "percent" | "activity")}
            >
              <SelectTrigger className="bg-transparent! border-0 p-0 focus-visible:ring-0 h-fit!">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="percent">
                  с наибольшим прогрессом чтения
                </SelectItem>
                <SelectItem value="activity">с недавней активностью</SelectItem>
              </SelectContent>
            </Select>
          </CardDescription>
          <CardAction className="flex gap-2">
            <Button variant="outline" asChild>
              <Link href="/books">
                <div className="max-sm:hidden">Больше</div>
                <ChevronRight />
              </Link>
            </Button>
            <Button onClick={() => setOpen(true)}>
              <div className="max-sm:hidden">Добавить</div>
              <PlusIcon />
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          {booksQuery.isLoading ? (
            <Skeleton className="h-36 w-full" />
          ) : booksQuery.isSuccess ? (
            <div className="flex flex-col gap-2">
              {booksQuery.data.map((book) => (
                <BookView
                  book={book}
                  key={book.id}
                  onUpdate={() => {
                    queryClient.invalidateQueries({ queryKey: ["books"] })
                  }}
                />
              ))}
              {booksQuery.data.length === 0 && (
                <div className="rounded-md border px-4 py-3">
                  <div className="flex gap-3">
                    <TriangleAlert
                      className="hrink-0 mt-0.5 text-amber-500"
                      size={16}
                      aria-hidden="true"
                    />
                    <div className="flex grow justify-between gap-3">
                      <p className="text-sm">Книг ещё нет</p>
                      <button
                        className="group text-sm font-medium whitespace-nowrap cursor-pointer"
                        onClick={() => setOpen(true)}
                      >
                        Добавить
                        <ArrowRightIcon
                          className="ms-1 -mt-0.5 inline-flex opacity-60 transition-transform group-hover:translate-x-0.5 size-4"
                          aria-hidden="true"
                        />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-red-300 dark:bg-red-700 p-2 rounded-md">
              <p>Произошла ошибка</p>
            </div>
          )}
        </CardContent>
      </Card>
      <AddBookDialog open={open} setOpen={setOpen} />
    </>
  )
}
