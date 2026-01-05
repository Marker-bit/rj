"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowDownNarrowWideIcon,
  ArrowRightIcon,
  CalendarIcon,
  CheckIcon,
  ChevronRight,
  PercentIcon,
  PlusIcon,
  TriangleAlert,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useLocalStorage } from "usehooks-ts";
import { AddBookDialog } from "@/components/book/book-form";
import { BookView } from "@/components/book/book-view";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { getBooks } from "@/lib/actions/books";

export default function BooksCard() {
  const [open, setOpen] = useState(false);
  const [orderBy, setOrderBy] = useLocalStorage<"percent" | "activity">(
    "orderBy",
    "percent",
  );
  const queryClient = useQueryClient();

  const percentBooks = useQuery({
    queryKey: ["books", "percent"],
    queryFn: () => getBooks("percent", true),
    enabled: orderBy === "percent", // only fetch when percent is selected
  });

  const activityBooks = useQuery({
    queryKey: ["books", "activity"],
    queryFn: () => getBooks("activity", true),
    enabled: orderBy === "activity", // only fetch when activity is selected
  });

  const booksQuery = orderBy === "percent" ? percentBooks : activityBooks;

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Книги</CardTitle>
          <CardDescription className="flex gap-2 items-center">
            Недавние книги
          </CardDescription>
          <CardAction className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <div className="max-sm:hidden">Сортировать</div>
                  <ArrowDownNarrowWideIcon />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setOrderBy("percent")}>
                  <PercentIcon />
                  По прогрессу чтения
                  {orderBy === "percent" && (
                    <CheckIcon className="ml-auto opacity-60" />
                  )}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setOrderBy("activity")}>
                  <CalendarIcon /> По дате последней активности
                  {orderBy === "activity" && (
                    <CheckIcon className="ml-auto opacity-60" />
                  )}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
                    queryClient.invalidateQueries({ queryKey: ["books"] });
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
            <div className="bg-red-500/40 text-red-500 p-4 rounded-md flex gap-2 items-start">
              <TriangleAlert className="size-4" aria-hidden="true" />
              <div className="flex flex-col leading-tight">
                <div className="font-bold">Произошла ошибка</div>
                <div className="text-sm">{booksQuery.error?.message}</div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      <AddBookDialog open={open} setOpen={setOpen} />
    </>
  );
}
