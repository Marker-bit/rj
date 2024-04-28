"use client";

import { MobileForm } from "@/components/book/book-form";
import { BookView } from "@/components/book/book-view";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Book } from "@/lib/api-types";
import { BookMinus, Search } from "lucide-react";
import { useEffect, useState } from "react";
import Fuse from "fuse.js";

export function BookList({ books }: { books: Book[] }) {
  const [readBooks, setReadBooks] = useState(false);
  const [notStarted, setNotStarted] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState<Book[]>();

  const fuse = new Fuse(books, {
    keys: ["title", "author"],
  });

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

  function search() {
    setSearchResults(fuse.search(searchText).map((result) => result.item));
  }

  return (
    <div>
      <MobileForm />
      <div className="p-3 flex flex-col gap-2">
        <div
          className="items-center flex space-x-2 cursor-pointer p-2 rounded-md border mb-2 hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-all select-none"
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
          className="items-center flex space-x-2 cursor-pointer p-2 rounded-md border mb-2 hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-all select-none"
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
          <div className="p-2 flex gap-2 items-center rounded-xl border text-xl">
            <BookMinus className="w-10 h-10" />
            <div className="flex flex-col">
              <div>Нет книг</div>
            </div>
          </div>
        )}
        <form className="flex gap-2" onSubmit={search}>
          <Input
            placeholder="Поиск"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <Button size="icon" type="submit">
            <Search className="w-4 h-4" />
          </Button>
        </form>
        {searchResults && (
          <Button
            variant="outline"
            onClick={() => {
              setSearchResults(undefined);
              setSearchText("");
            }}
            className="md:w-fit"
          >
            Сбросить поиск
          </Button>
        )}
        {(searchResults || books).map((book: Book) => (
          <BookView book={book} key={book.id} />
        ))}
      </div>
    </div>
  );
}
