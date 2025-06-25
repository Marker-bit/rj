"use client"

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Book as DbBook, ReadEvent } from "@prisma/client";
import {
  endOfDay,
  format,
  isAfter,
  isBefore,
  isWithinInterval,
  startOfDay,
} from "date-fns";
import { ru } from "date-fns/locale";
import { BookMinus, ChevronDownIcon, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { DateRange } from "react-day-picker";
import { EventView } from "./EventView";

export default function JournalView({
  events,
}: {
  events: (ReadEvent & { book: DbBook })[]
}) {
  const today = new Date()
  const [dates, setDates] = useState<DateRange | undefined>()

  const filtered = events.filter((event) => {
    if (!dates) return true
    if (dates.from && dates.to) {
      return isWithinInterval(event.readAt, {
        start: startOfDay(dates.from),
        end: endOfDay(dates.to),
      })
    }
    if (dates.from) {
      return !isBefore(event.readAt, dates.from)
    }
    if (dates.to) {
      return !isAfter(event.readAt, dates.to)
    }
    return true
  })

  return (
    <div className="max-sm:mb-[15vh]">
      <div className="m-2 flex items-center gap-2 text-5xl font-black">
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
              className="min-w-80 w-full md:w-fit justify-between font-normal"
            >
              Фильтр по дням{" "}
              {dates?.from && `с ${format(dates.from, "dd.MM.yyyy")}`}{" "}
              {dates?.to && `до ${format(dates.to, "dd.MM.yyyy")}`}
              {!dates && "выключен"}
              <ChevronDownIcon />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto overflow-hidden p-0" align="start">
            <Calendar
              mode="range"
              selected={dates}
              captionLayout="dropdown"
              onSelect={(range) => {
                setDates(range)
              }}
              weekStartsOn={1}
              locale={ru}
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
            id: string
            bookId: string
            book: DbBook
            pagesRead: number
            readAt: string | Date
          }) => (
            <EventView event={event} key={event.id} />
          )
        )}
      </div>
    </div>
  )
}
