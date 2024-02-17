"use client";

import { useQuery } from "@tanstack/react-query";
import {
  BookMinus,
  BookOpen,
  BookOpenCheck,
  Check,
  ChevronLeft,
  Loader,
} from "lucide-react";
import Link from "next/link";

export default function JournalPage() {
  const eventsQuery = useQuery({
    queryKey: ["events"],
    queryFn: () => fetch("/api/journal").then((res) => res.json()),
  });
  if (eventsQuery.isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader className="w-6 h-6 animate-spin" />
      </div>
    );
  }
  return (
    <div>
      <div className="flex p-1 items-center bg-zinc-100 border-b border-zinc-200 min-h-10">
        <Link href="/">
          <button className="p-1 hover:text-blue-600 rounded-md flex items-center gap-1 text-blue-500 active:scale-95 transition-all">
            <ChevronLeft className="w-6 h-6" />
            <div className="font-semibold">Главная</div>
          </button>
        </Link>
        <div className="font-semibold absolute left-[50%] translate-x-[-50%]">
          Журнал
        </div>
      </div>
      <div className="p-3 flex flex-col gap-2">
        {eventsQuery.data?.length === 0 && (
          <div className="rounded-xl border border-zinc-200 p-2 flex gap-2 items-center">
            <BookMinus className="w-10 h-10" />
            Журнал пуст
          </div>
        )}
        {eventsQuery.data.map(
          (event: {
            id: string;
            bookId: string;
            book: Book;
            pagesRead: number;
            readAt: string | Date;
          }) => (
            <div
              key={event.id}
              className="rounded-xl border border-zinc-200 p-2 cursor-default flex flex-wrap items-center gap-1"
            >
              {event.pagesRead === event.book.pages ? (
                <>
                  <BookOpenCheck className="w-4 h-4 text-green-500" />
                  <Link
                    href={`/books#book-${event.bookId}`}
                    className="font-semibold"
                  >
                    Книга &quot;{event.book.title}&quot; автора{" "}
                    {event.book.author}
                  </Link>
                  прочитана {new Date(event.readAt).toLocaleString()}
                </>
              ) : (
                <>
                  <BookOpen className="w-4 h-4 mr-1" />
                  {event.pagesRead} страниц прочитано{" "}
                  {new Date(event.readAt).toLocaleString()}
                  <Link
                    href={`/books#book-${event.bookId}`}
                    className="font-semibold"
                  >
                    в книге &quot;{event.book.title}&quot; автора{" "}
                    {event.book.author}
                  </Link>
                </>
              )}
            </div>
          )
        )}
      </div>
    </div>
  );
}
