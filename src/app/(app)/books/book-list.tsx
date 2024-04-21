"use client";

import { MobileForm } from "@/components/book/book-form";
import { BookView } from "@/components/book/book-view";
import { Switch } from "@/components/ui/switch";
import { BookMinus } from "lucide-react";
import { useEffect, useState } from "react";

export function BookList({ books }: { books: any[] }) {
  const [readBooks, setReadBooks] = useState(false);
  const [notStarted, setNotStarted] = useState(false);

  useEffect(() => {
    const localStorageReadBooks = localStorage.getItem("readBooks");
    const localStorageNotStarted = localStorage.getItem("notStarted");
    if (localStorageReadBooks) {
      setReadBooks(JSON.parse(localStorageReadBooks));
    }
    if (localStorageNotStarted) {
      setNotStarted(JSON.parse(localStorageNotStarted));
    }
  }, []);

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

  return (
    <div>
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
        {books.length === 0 && (
          <div className="p-2 flex gap-2 items-center rounded-xl border border-slate-200 dark:border-slate-800 text-xl">
            <BookMinus className="w-10 h-10" />
            <div className="flex flex-col">
              <div>Нет книг</div>
            </div>
          </div>
        )}
        {books.map((book: Book) => (
          <BookView book={book} key={book.id} />
        ))}
      </div>
    </div>
  );
}
