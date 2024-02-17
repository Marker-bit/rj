"use client";

import { useQuery } from "@tanstack/react-query";
import { BookDashed, BookMinus, ChevronRight, Loader } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { BookView } from "./books/page";

export default function Home() {
  const booksQuery = useQuery({
    queryKey: ["books"],
    queryFn: () => fetch("/api/books").then((res) => res.json()),
  });

  let booksData;
  // if (booksQuery?.data) {
  //   const compareBooks = (a: Book, b: Book) => {
  //     const aPages = a.readEvents[a.readEvents.length - 1]?.pagesRead;
  //     const bPages = b.readEvents[b.readEvents.length - 1]?.pagesRead;
  //     if (!aPages && !bPages) return 0;
  //     if (!aPages) return -1;
  //     if (!bPages) return 1;
  //     if (aPages > bPages) return 1;
  //     if (aPages == bPages) return 0;
  //     if (aPages < bPages) return -1;
  //   }
  //   booksData = booksQuery.data.sort(compareBooks);
  // }
  return (
    <div>
      <div className="flex p-1 min-h-10 items-center bg-zinc-100 border-b border-zinc-200 relative">
        <div className="font-semibold mx-auto">Главная</div>
      </div>
      <div className="flex flex-col">
        <div className="flex flex-col gap-3 border-b border-zinc-300 p-3 cursor-default">
          <Link href="/books">
            <h2 className="text-5xl font-black uppercase flex gap-1 items-center cursor-pointer hover:text-black/70 active:scale-90 transition-transform w-fit">
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
        <div className="flex flex-col gap-3 border-b border-zinc-300 p-3 cursor-default">
          <Link href="/profile">
            <h2 className="text-5xl font-black uppercase flex gap-1 items-center cursor-pointer hover:text-black/70 active:scale-90 transition-transform w-fit">
              Профиль
              <ChevronRight className="w-12 h-12" strokeWidth={3} />
            </h2>
          </Link>
          <div className="p-2 rounded-md border border-zinc-200 flex gap-2 items-center">
            <Image
              src="/no-avatar.png"
              alt="avatar"
              width={100}
              height={100}
              className="rounded-full w-20 h-20"
            />
            <div className="flex flex-col">
              <div className="text-3xl font-semibold">Mark Pentus</div>
              <div className="text-sm text-black/70">@mark.pentus</div>
              {/* <div className="bg-blue-500 p-2 rounded-md shadow-md shadow-blue-300 cursor-pointer flex items-center justify-center text-white text-sm mt-2">
            <UserPlus className="w-4 h-4 mr-2" />
            Добавить в друзья
          </div> */}
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-3 border-b border-zinc-300 p-3 cursor-default">
          <Link href="/profile#stats">
            <h2 className="text-5xl font-black uppercase flex gap-1 items-center cursor-pointer hover:text-black/70 active:scale-90 transition-transform w-fit">
              Статистика
              <ChevronRight className="w-12 h-12" strokeWidth={3} />
            </h2>
          </Link>
          <div>???</div>
        </div>
      </div>
    </div>
  );
}
