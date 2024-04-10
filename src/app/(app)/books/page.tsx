"use client";

import { MobileForm } from "@/components/book/book-form";
import { BookView } from "@/components/book/book-view";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useQuery } from "@tanstack/react-query";
import { BookMinus, ChevronLeft, Loader } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function BooksPage() {
  const [readBooks, setReadBooks] = useState(false);
  const [notStarted, setNotStarted] = useState(false);
  const [bookId, setBookId] = useState<string>();

  useEffect(() => {
    setBookId(window.location.hash.slice(6));
    const localStorageReadBooks = localStorage.getItem("readBooks");
    const localStorageNotStarted = localStorage.getItem("notStarted");
    if (localStorageReadBooks) {
      setReadBooks(JSON.parse(localStorageReadBooks));
    }
    if (localStorageNotStarted) {
      setNotStarted(JSON.parse(localStorageNotStarted));
    }
  }, []);

  const booksQuery = useQuery({
    queryKey: ["books"],
    queryFn: () => fetch("/api/books").then((res) => res.json()),
  });

  function changeReadBooks() {
    setReadBooks((readBooks) => {
      localStorage.setItem("readBooks", JSON.stringify(!readBooks));
      return !readBooks;
    });
  }
  function changeNotStarted() {
    setNotStarted((notStarted) => {
      localStorage.setItem("notStarted", JSON.stringify(!notStarted));
      return !notStarted;
    });
  }

  let books = booksQuery.data || [];

  if (readBooks) {
    books = books.filter((book: Book) => {
      if (book.readEvents.length === 0) {
        return true;
      }
      return !(book.pages === book.readEvents[0].pagesRead);
    });
  }

  if (notStarted) {
    books = books.filter((book: Book) => {
      return book.readEvents.length !== 0;
    });
  }

  function showAll() {
    setBookId("");
    window.location.hash = "";
  }

  return (
    <div>
      <div className="text-5xl font-black m-2 flex gap-2 items-center">
        <Link href="/">
          <Button variant="ghost" size="icon">
            <ChevronLeft className="w-8 h-8" />
          </Button>
        </Link>
        Книги
      </div>
      <MobileForm />
      <div className="p-3 flex flex-col gap-2">
        <div
          className="items-center flex space-x-2 cursor-pointer p-2 rounded-md border border-slate-200 dark:border-slate-800 mb-2 hover:bg-slate-100 dark:hover:bg-slate-900 transition-all select-none"
          onClick={changeReadBooks}
        >
          <Switch id="readBooks" checked={readBooks} />
          <div
            className="text-sm font-medium leading-none peer-disabled:opacity-70 cursor-pointer select-none"
            onClick={changeReadBooks}
          >
            Скрывать прочитанные книги
          </div>
        </div>
        <div
          className="items-center flex space-x-2 cursor-pointer p-2 rounded-md border border-slate-200 dark:border-slate-800 mb-2 hover:bg-slate-100 dark:hover:bg-slate-900 transition-all select-none"
          onClick={changeNotStarted}
        >
          <Switch id="notStarted" checked={notStarted} />
          <div
            className="text-sm font-medium leading-none peer-disabled:opacity-70 cursor-pointer select-none"
            onClick={changeNotStarted}
          >
            Скрывать не начатые книги
          </div>
        </div>
        {booksQuery?.data?.length === 0 && (
          <div className="p-2 flex gap-2 items-center rounded-xl border border-slate-200 dark:border-slate-800 text-xl">
            <BookMinus className="w-10 h-10" />
            <div className="flex flex-col">
              <div>Нет книг</div>
            </div>
          </div>
        )}
        {booksQuery.isPending && (
          <div className="p-2 flex gap-2 items-center justify-center rounded-xl bg-zinc-100 dark:bg-slate-900 py-5">
            <Loader className="w-6 h-6 animate-spin" />
          </div>
        )}
        {bookId && (
          <Button variant="outline" className="items-center gap-2" onClick={showAll}>
            <ChevronLeft className="w-4 h-4" />
            Показать все
          </Button>
        )}
        {books.map(
          (book: Book) =>
            (!bookId || bookId === book.id) && (
              <BookView book={book} key={book.id} />
            )
        )}
      </div>
    </div>
  );
}
