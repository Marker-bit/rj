"use client";

import { Button } from "@/components/ui/button";
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
import { DrawerDialog } from "../Drawer";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import {
  addDays,
  format,
  isAfter,
  isBefore,
  isEqual,
  isSameDay,
} from "date-fns";
import { useState } from "react";
import { ru } from "date-fns/locale";
import { ReadEvent } from "@prisma/client";
import { DateRange } from "react-day-picker";
import { dateToString } from "@/lib/utils";

export default function JournalPage() {
  const tomorrow = addDays(new Date(), 1);
  const [dates, setDates] = useState<DateRange | undefined>();
  const [filterOpen, setFilterOpen] = useState(false);
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
  let events: (ReadEvent & {
    book: Book;
  })[] = eventsQuery.data!;
  function isAfterOrEqual(date: Date, dateToCompare: Date) {
    return isAfter(date, dateToCompare) || isEqual(date, dateToCompare);
  }
  function isBeforeOrEqual(date: Date, dateToCompare: Date) {
    return isBefore(date, dateToCompare) || isEqual(date, dateToCompare);
  }
  events = events.filter((event) => {
    if (dates?.from && dates?.to) {
      return (
        isAfterOrEqual(event.readAt, dates.from) &&
        isBeforeOrEqual(event.readAt, dates.to)
      );
    }
    if (dates?.from) {
      return isAfterOrEqual(event.readAt, dates.from);
    }
    if (dates?.to) {
      return isBeforeOrEqual(event.readAt, dates.to);
    }
    return true;
  });
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
        <DrawerDialog open={filterOpen} onOpenChange={setFilterOpen}>
          <DialogHeader>
            <DialogTitle>Выбор дня</DialogTitle>
          </DialogHeader>
          <Calendar
            mode="range"
            selected={dates}
            onSelect={setDates}
            className="rounded-md border w-fit mx-auto mt-2"
            disabled={[{ from: tomorrow, to: new Date(3000, 1) }]}
            weekStartsOn={1}
            showToday={false}
            locale={ru}
          />
        </DrawerDialog>
        <Button
          variant="outline"
          onClick={() => setFilterOpen(true)}
          className="md:w-fit"
        >
          Фильтр по дням{" "}
          {dates?.from && `с ${format(dates.from, "dd.MM.yyyy")}`}{" "}
          {dates?.to && `до ${format(dates.to, "dd.MM.yyyy")}`}
          {!dates && "выключен"}
        </Button>
        {eventsQuery.data?.length === 0 && events.length === 0 ? (
          <div className="rounded-xl border border-zinc-200 p-2 flex gap-2 items-center">
            <BookMinus className="w-10 h-10" />
            Журнал пуст
          </div>
        ) : (
          events.length === 0 && (
            <div className="rounded-xl border border-zinc-200 p-2 flex gap-2 items-center">
              <BookMinus className="w-10 h-10" />
              Фильтры ничего не выбрали
            </div>
          )
        )}
        {events.map(
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
                  прочитана {dateToString(new Date(event.readAt))}
                </>
              ) : (
                <>
                  <BookOpen className="w-4 h-4 mr-1" />
                  {event.pagesRead} страниц прочитано{" "}
                  {dateToString(new Date(event.readAt))}
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
