"use client";

import { BookView } from "@/components/book/book-view";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Book } from "@/lib/api-types";
import { BackgroundColor } from "@prisma/client";
import Fuse from "fuse.js";
import {
  ArrowRightIcon,
  BookMinus,
  Calendar,
  Percent,
  Search,
  SearchIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function BookList({ books }: { books: Book[] }) {
  const [notStarted, _setNotStarted] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState<Book[]>();
  const [sort, _setSort] = useState<"percent" | "activity">();
  const router = useRouter();

  useEffect(() => {
    const localStorageNotStarted = localStorage.getItem("notStarted");
    const localStorageSort = localStorage.getItem("orderBy");
    if (localStorageNotStarted) {
      _setNotStarted(JSON.parse(localStorageNotStarted));
    }
    if (localStorageSort) {
      const actualSort = JSON.parse(localStorageSort);
      _setSort(actualSort);
      const searchParams = new URLSearchParams(window.location.search);
      searchParams.set("sort", actualSort);
      router.replace(`?${searchParams.toString()}`);
    } else {
      _setSort("percent");
      localStorage.setItem("orderBy", JSON.stringify("percent"));
      const searchParams = new URLSearchParams(window.location.search);
      searchParams.set("sort", "percent");
      router.replace(`?${searchParams.toString()}`);
    }
  }, [router]);

  function setNotStarted(value: boolean) {
    localStorage.setItem("notStarted", JSON.stringify(value));
    _setNotStarted(value);
  }
  function setSort(value: string) {
    localStorage.setItem("orderBy", JSON.stringify(value));
    _setSort(value as "percent" | "activity");
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.set("sort", value);
    router.replace(`?${searchParams.toString()}`);
  }

  let filteredBooks = books;

  if (notStarted) {
    filteredBooks = filteredBooks.filter((book: Book) => {
      return book.readEvents.length !== 0;
    });
  }

  const fuse = new Fuse(filteredBooks, {
    keys: ["title", "author"],
  });

  function search(evt?: any) {
    if (evt !== undefined) {
      evt.preventDefault();
    }
    if (searchText === "") {
      setSearchResults(undefined);
      return;
    }
    setSearchResults(fuse.search(searchText).map((result) => result.item));
  }

  useEffect(() => {
    search();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchText, books, notStarted]);

  const outlinedBooks = filteredBooks.filter(
    (book: Book) => book.background !== BackgroundColor.NONE,
  );

  const notOutlinedBooks = filteredBooks.filter(
    (book: Book) => book.background === BackgroundColor.NONE,
  );

  const booksForRender = searchResults
    ? searchResults
    : outlinedBooks.concat(notOutlinedBooks);

  if (sort === undefined) {
    return (
      <div className="p-2">
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col gap-2">
        <div className="grid md:grid-cols-2 gap-2">
          {/* <div className="border-input has-data-[state=checked]:border-primary/50 relative flex w-full items-start gap-2 rounded-md border p-4 shadow-xs outline-none">
            <Checkbox
              id="readBooks"
              aria-describedby="readBooks-description"
              checked={readBooks}
              onCheckedChange={setReadBooks}
            />
            <div className="grid grow gap-2">
              <Label htmlFor="readBooks">Скрывать прочитанные книги</Label>
              <p
                id="readBooks-description"
                className="text-muted-foreground text-xs"
              >
                Включите, чтобы прочитанные вами книги не отображались в списке.
              </p>
            </div>
          </div> */}
          <label
            htmlFor="notStarted"
            className="border-input has-data-[state=checked]:border-primary/50 relative flex w-full items-start gap-2 rounded-md border p-4 shadow-xs outline-none select-none"
          >
            <Checkbox
              id="notStarted"
              aria-describedby="notStarted-description"
              checked={notStarted}
              onCheckedChange={setNotStarted}
            />
            <div className="grid grow gap-2">
              <div className="text-sm font-medium leading-none">
                Скрывать неначатые книги
              </div>
              <p
                id="notStarted-description"
                className="text-muted-foreground text-xs"
              >
                Включите, чтобы книги без прочитанных страниц не отображались в
                списке.
              </p>
            </div>
          </label>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <form className="relative w-full" onSubmit={search}>
            <Input
              className="peer ps-9 pe-9"
              placeholder="Поиск..."
              type="search"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
            <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
              <SearchIcon size={16} />
            </div>
            <button
              className="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Искать"
              type="submit"
            >
              <ArrowRightIcon size={16} aria-hidden="true" />
            </button>
          </form>
          <div className="group relative w-full sm:w-[50%] md:w-[30%]">
            <label
              htmlFor="sort"
              className="bg-background text-foreground absolute start-1 top-0 z-10 block -translate-y-1/2 px-2 text-xs font-medium group-has-disabled:opacity-50"
            >
              Сортировка
            </label>
            <Select value={sort} onValueChange={setSort}>
              <SelectTrigger
                id="sort"
                className="[&>span_svg]:text-muted-foreground/80 [&>span]:flex [&>span]:items-center [&>span]:gap-2 [&>span_svg]:shrink-0 w-full"
              >
                <SelectValue placeholder="Select framework" />
              </SelectTrigger>
              <SelectContent className="[&_*[role=option]>span>svg]:text-muted-foreground/80 [&_*[role=option]>span]:flex [&_*[role=option]>span]:gap-2 [&_*[role=option]>span>svg]:shrink-0">
                <SelectItem value="percent">
                  <Percent size={16} aria-hidden="true" />
                  <span className="truncate">По прогрессу в книге</span>
                </SelectItem>
                <SelectItem value="activity">
                  <Calendar size={16} aria-hidden="true" />
                  <span className="truncate">По последней активности</span>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

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
        {books.length === 0 && (
          <div className="flex items-center gap-2 rounded-xl border p-2 text-xl">
            <BookMinus className="size-10" />
            <div className="flex flex-col">
              <div>Нет книг</div>
            </div>
          </div>
        )}
        {booksForRender.map((book: Book) => (
          <BookView book={book} key={book.id} />
        ))}
      </div>
    </div>
  );
}
