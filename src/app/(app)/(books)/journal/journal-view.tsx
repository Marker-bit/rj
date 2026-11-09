"use client";

import type { Book as DbBook, ReadEvent } from "@prisma/client";
import {
  endOfDay,
  format,
  isAfter,
  isBefore,
  isWithinInterval,
  startOfDay,
} from "date-fns";
import { BookMinus, ChevronDownIcon, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import type { DateRange } from "react-day-picker";
import { DateCalendar } from "@/components/date-calendar";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { EventView } from "./EventView";

export default function JournalView({
  events,
}: {
  events: (ReadEvent & { book: DbBook })[];
}) {
  const today = new Date();
  const [dates, setDates] = useState<DateRange | undefined>();

  const filtered = events.filter((event) => {
    if (!dates) return true;
    if (dates.from && dates.to) {
      return isWithinInterval(event.readAt, {
        start: startOfDay(dates.from),
        end: endOfDay(dates.to),
      });
    }
    if (dates.from) {
      return !isBefore(event.readAt, dates.from);
    }
    if (dates.to) {
      return !isAfter(event.readAt, dates.to);
    }
    return true;
  });

  return (
    <div className="max-sm:mb-[15vh]">
      <div className="m-2 flex items-center gap-2 text-3xl font-bold">
        <Link href="/">
          <Button variant="ghost" size="icon">
            <ChevronLeft className="size-8" />
          </Button>
        </Link>
        Журнал
      </div>
      <div className="flex flex-col gap-2 p-3">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              id="dates"
              className="h-auto min-h-9 min-w-0 w-full md:w-fit md:min-w-80 justify-between whitespace-normal text-left font-normal"
            >
              <span>
                Фильтр по дням{" "}
                {dates?.from && `с ${format(dates.from, "dd.MM.yyyy")}`}{" "}
                {dates?.to && `до ${format(dates.to, "dd.MM.yyyy")}`}
                {!dates && "выключен"}
              </span>
              <ChevronDownIcon className="shrink-0" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto overflow-hidden p-0" align="start">
            <DateCalendar
              mode="range"
              selected={dates}
              onSelect={(range) => {
                setDates(range);
              }}
              disabled={{ after: today }}
            />
          </PopoverContent>
        </Popover>
        {filtered.length === 0 && events.length === 0 ? (
          <div className="flex items-center gap-2 rounded-xl border p-2">
            <BookMinus className="size-10" />
            Журнал пуст
          </div>
        ) : (
          filtered.length === 0 && (
            <div className="flex items-center gap-2 rounded-xl border p-2">
              <BookMinus className="size-10" />
              Фильтры ничего не выбрали
            </div>
          )
        )}
        {filtered.map(
          (event: {
            id: string;
            bookId: string;
            book: DbBook;
            pagesRead: number;
            readAt: string | Date;
          }) => (
            <EventView event={event} key={event.id} />
          ),
        )}
      </div>
    </div>
  );
}
