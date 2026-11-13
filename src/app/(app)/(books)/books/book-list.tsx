"use client";

import { BackgroundColor } from "@/generated/prisma/enums";
import {
  ArrowRightIcon,
  BookMinus,
  BookOpen,
  BookOpenCheck,
  Calendar,
  Percent,
  SearchIcon,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { BookView } from "@/components/book/book-view";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Book } from "@/lib/api-types";
import { getReadingState } from "@/lib/reading-events";

type StatusFilter = "all" | "planned" | "reading" | "finished";

function getBookStatus(book: Book): Exclude<StatusFilter, "all"> {
  const { latest, progressPages } = getReadingState(book.readEvents);
  if (!latest) return "planned";
  return progressPages >= book.pages ? "finished" : "reading";
}

export function BookList({ books }: { books: Book[] }) {
  const [notStarted, _setNotStarted] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [sort, _setSort] = useState<"percent" | "activity">("percent");
  const [statusFilter, _setStatusFilter] = useState<StatusFilter>("all");
  const [FuseClass, setFuseClass] = useState<
    typeof import("fuse.js").default | null
  >(null);

  useEffect(() => {
    const localStorageNotStarted = localStorage.getItem("notStarted");
    const localStorageSort = localStorage.getItem("orderBy");
    const localStorageStatusFilter = localStorage.getItem("bookStatusFilter");
    const storedSort = localStorageSort?.replace(/"/g, "");
    if (storedSort === "percent" || storedSort === "activity") {
      _setSort(storedSort);
    }
    if (localStorageNotStarted) {
      _setNotStarted(JSON.parse(localStorageNotStarted));
    }
    if (
      localStorageStatusFilter &&
      ["all", "planned", "reading", "finished"].includes(
        JSON.parse(localStorageStatusFilter),
      )
    ) {
      _setStatusFilter(JSON.parse(localStorageStatusFilter));
    }
  }, []);

  function setNotStarted(value: boolean) {
    localStorage.setItem("notStarted", JSON.stringify(value));
    _setNotStarted(value);
  }

  function setSort(value: string) {
    localStorage.setItem("orderBy", JSON.stringify(value));
    _setSort(value as "percent" | "activity");
  }

  function setStatusFilter(value: string) {
    const nextStatus = value as StatusFilter;
    localStorage.setItem("bookStatusFilter", JSON.stringify(nextStatus));
    _setStatusFilter(nextStatus);
  }

  const statusCounts = useMemo(
    () =>
      books.reduce(
        (counts, book) => {
          counts[getBookStatus(book)] += 1;
          return counts;
        },
        {
          all: books.length,
          planned: 0,
          reading: 0,
          finished: 0,
        },
      ),
    [books],
  );

  const filteredBooks = useMemo(() => {
    let nextBooks = books;

    if (notStarted) {
      nextBooks = nextBooks.filter((book: Book) => {
        return book.readEvents.length !== 0;
      });
    }

    if (statusFilter !== "all") {
      nextBooks = nextBooks.filter(
        (book: Book) => getBookStatus(book) === statusFilter,
      );
    }

    return nextBooks;
  }, [books, notStarted, statusFilter]);

  const sortedBooks = useMemo(() => {
    const percent = (book: Book) => {
      const latest = book.readEvents[0];
      return latest && book.pages > 0 ? latest.pagesRead / book.pages : 0;
    };
    const activity = (book: Book) =>
      (book.readEvents[0]?.readAt ?? book.createdAt).getTime();

    return [...filteredBooks].sort(
      sort === "percent"
        ? (a: Book, b: Book) => percent(b) - percent(a)
        : (a: Book, b: Book) => activity(b) - activity(a),
    );
  }, [filteredBooks, sort]);

  const fuse = useMemo(
    () =>
      FuseClass
        ? new FuseClass(sortedBooks, {
            keys: ["title", "author"],
          })
        : null,
    [FuseClass, sortedBooks],
  );

  useEffect(() => {
    if (searchText.trim() === "" || FuseClass) {
      return;
    }

    let cancelled = false;
    void import("fuse.js").then((mod) => {
      if (!cancelled) {
        setFuseClass(() => mod.default);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [searchText, FuseClass]);

  const booksForRender = useMemo(() => {
    const trimmedSearch = searchText.trim();
    const matched =
      trimmedSearch === ""
        ? sortedBooks
        : fuse
          ? fuse.search(trimmedSearch).map((result) => result.item)
          : sortedBooks.filter((book) => {
              const query = trimmedSearch.toLowerCase();
              return (
                book.title.toLowerCase().includes(query) ||
                book.author.toLowerCase().includes(query)
              );
            });

    return [
      ...matched.filter((book) => book.background !== BackgroundColor.NONE),
      ...matched.filter((book) => book.background === BackgroundColor.NONE),
    ];
  }, [fuse, searchText, sortedBooks]);
  const filtersActive = notStarted || statusFilter !== "all";

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
          <form
            className="relative w-full"
            onSubmit={(event) => event.preventDefault()}
          >
            <Input
              className="peer ps-9 pe-9"
              placeholder="Поиск по названию или автору..."
              type="search"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
            <div className="text-muted-foreground pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
              <SearchIcon size={16} />
            </div>
            <button
              className="text-muted-foreground hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Искать"
              type="submit"
            >
              <ArrowRightIcon size={16} aria-hidden="true" />
            </button>
          </form>
          <div className="group relative w-full sm:w-[50%] md:w-[30%]">
            <label
              htmlFor="status"
              className="bg-background text-foreground absolute start-1 top-0 z-10 block -translate-y-1/2 px-2 text-xs font-medium group-has-disabled:opacity-50"
            >
              Статус
            </label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger
                id="status"
                className="[&>span_svg]:text-muted-foreground [&>span]:flex [&>span]:items-center [&>span]:gap-2 [&>span_svg]:shrink-0 w-full"
              >
                <SelectValue placeholder="Статус" />
              </SelectTrigger>
              <SelectContent className="[&_*[role=option]>span>svg]:text-muted-foreground [&_*[role=option]>span]:flex [&_*[role=option]>span]:gap-2 [&_*[role=option]>span>svg]:shrink-0">
                <SelectItem value="all">
                  <BookMinus size={16} aria-hidden="true" />
                  <span className="truncate">Все книги</span>
                </SelectItem>
                <SelectItem value="planned">
                  <Calendar size={16} aria-hidden="true" />
                  <span className="truncate">Запланированные</span>
                </SelectItem>
                <SelectItem value="reading">
                  <BookOpen size={16} aria-hidden="true" />
                  <span className="truncate">Читаю</span>
                </SelectItem>
                <SelectItem value="finished">
                  <BookOpenCheck size={16} aria-hidden="true" />
                  <span className="truncate">Прочитанные</span>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
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
                className="[&>span_svg]:text-muted-foreground [&>span]:flex [&>span]:items-center [&>span]:gap-2 [&>span_svg]:shrink-0 w-full"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="[&_*[role=option]>span>svg]:text-muted-foreground [&_*[role=option]>span]:flex [&_*[role=option]>span]:gap-2 [&_*[role=option]>span>svg]:shrink-0">
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

        {(searchText.trim() !== "" || filtersActive) && (
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline">
              Показано {booksForRender.length} из {books.length}
            </Badge>
            {statusFilter !== "all" && (
              <Badge variant="secondary">
                {statusFilter === "planned" &&
                  `Запланированные: ${statusCounts.planned}`}
                {statusFilter === "reading" && `Читаю: ${statusCounts.reading}`}
                {statusFilter === "finished" &&
                  `Прочитанные: ${statusCounts.finished}`}
              </Badge>
            )}
            <Button
              variant="outline"
              onClick={() => {
                setSearchText("");
                setNotStarted(false);
                setStatusFilter("all");
              }}
              className="md:w-fit"
            >
              Сбросить фильтры
            </Button>
          </div>
        )}
        {books.length === 0 && (
          <div className="flex items-center gap-2 rounded-xl border p-2 text-xl">
            <BookMinus className="size-10" />
            <div className="flex flex-col">
              <div>Нет книг</div>
            </div>
          </div>
        )}
        {books.length > 0 && booksForRender.length === 0 && (
          <div className="flex items-center gap-3 rounded-xl border p-4">
            <BookMinus className="size-8 text-muted-foreground" />
            <div className="flex flex-col">
              <div className="font-medium">Ничего не найдено</div>
              <div className="text-sm text-muted-foreground">
                Попробуйте изменить поиск или сбросить фильтры.
              </div>
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
