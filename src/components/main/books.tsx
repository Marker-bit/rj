"use client";

import { BookView } from "@/app/BookView";
import { useQuery } from "@tanstack/react-query";
import { BookMinus, ChevronRight, Loader } from "lucide-react";
import Link from "next/link";

export function Books() {
  const booksQuery = useQuery({
    queryKey: ["books"],
    queryFn: () => fetch("/api/books").then((res) => res.json()),
  });
  return (
    <div className="flex flex-col gap-3 border-b border-zinc-300 p-3 cursor-default">
      <Link href="/books">
        <h2 className="text-5xl font-black uppercase flex gap-1 items-center cursor-pointer hover:text-black/70 active:scale-90 transition-transform w-fit flex-wrap">
          Книги
          <ChevronRight className="w-12 h-12" strokeWidth={3} />
        </h2>
      </Link>
      {booksQuery.isPending ? (
        <div className="flex h-[20vh] justify-center items-center">
          <Loader className="w-6 h-6 animate-spin" />
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {booksQuery?.data.slice(0, 3).map((book: Book) => (
            <BookView book={book} key={book.id} />
          ))}
        </div>
      )}
      {booksQuery?.data?.length === 0 && (
        <div className="p-2 flex gap-2 items-center rounded-xl border border-zinc-200 text-xl">
          <BookMinus className="w-10 h-10" />
          <div className="flex flex-col">
            <div>Нет книг</div>
            <div className="text-sm text-blue-500 underline underline-offset-4">
              <Link href="/books">Добавить книгу</Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
