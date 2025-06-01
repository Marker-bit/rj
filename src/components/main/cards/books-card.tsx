"use client";

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
import { fetchBooks } from "@/lib/books";
import { ArrowRightIcon, TriangleAlert } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function BooksCard({
  books,
}: {
  books: Awaited<ReturnType<typeof fetchBooks>>;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      {/* <div className="m-2 flex items-center">
        <Button onClick={() => setOpen(true)}>
          <Plus /> Добавить книгу
        </Button>
      </div> */}
      <Card>
        <CardHeader>
          <CardTitle>Книги</CardTitle>
          <CardDescription>
            3 книги с наибольшим прогрессом чтения
          </CardDescription>
          <CardAction className="flex gap-2">
            <Button variant="outline" asChild>
              <Link href="/books">Больше</Link>
            </Button>
            <Button onClick={() => setOpen(true)}>Добавить</Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          {books.map((book) => (
            <BookView book={book} key={book.id} />
          ))}
          {books.length === 0 && (
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
        </CardContent>
      </Card>
      <AddBookDialog open={open} setOpen={setOpen} />
    </>
  );
}
