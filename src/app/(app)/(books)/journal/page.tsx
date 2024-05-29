"use client"

import { DrawerDialog } from "@/components/ui/drawer-dialog"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ReadEvent } from "@prisma/client"
import { useQuery } from "@tanstack/react-query"
import { addDays, format, isAfter, isBefore, isEqual } from "date-fns"
import { ru } from "date-fns/locale"
import { BookMinus, ChevronLeft } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { DateRange } from "react-day-picker"
import { EventView } from "./EventView"
import { Loader } from "@/components/ui/loader";
import { Book } from "@/lib/api-types";

export default function JournalPage() {
  const tomorrow = addDays(new Date(), 1)
  const [dates, setDates] = useState<DateRange | undefined>()
  const [filterOpen, setFilterOpen] = useState(false)
  const eventsQuery = useQuery({
    queryKey: ["events"],
    queryFn: () => fetch("/api/journal").then((res) => res.json()),
  })
  if (eventsQuery.isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader className="size-6" />
      </div>
    )
  }
  let events: (ReadEvent & {
    book: Book
  })[] = eventsQuery.data!
  function isAfterOrEqual(date: Date, dateToCompare: Date) {
    return isAfter(date, dateToCompare) || isEqual(date, dateToCompare)
  }
  function isBeforeOrEqual(date: Date, dateToCompare: Date) {
    return isBefore(date, dateToCompare) || isEqual(date, dateToCompare)
  }
  events = events.filter((event) => {
    if (dates?.from && dates?.to) {
      return (
        isAfterOrEqual(event.readAt, dates.from) &&
        isBeforeOrEqual(event.readAt, dates.to)
      )
    }
    if (dates?.from) {
      return isAfterOrEqual(event.readAt, dates.from)
    }
    if (dates?.to) {
      return isBeforeOrEqual(event.readAt, dates.to)
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
        <DrawerDialog open={filterOpen} onOpenChange={setFilterOpen}>
          <DialogHeader>
            <DialogTitle>Выбор дня</DialogTitle>
          </DialogHeader>
          <Calendar
            mode="range"
            selected={dates}
            onSelect={setDates}
            className="mx-auto mt-2 w-fit rounded-md border"
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
          <div className="flex items-center gap-2 rounded-xl border p-2">
            <BookMinus className="size-10" />
            Журнал пуст
          </div>
        ) : (
          events.length === 0 && (
            <div className="flex items-center gap-2 rounded-xl border p-2">
              <BookMinus className="size-10" />
              Фильтры ничего не выбрали
            </div>
          )
        )}
        {events.map(
          (event: {
            id: string
            bookId: string
            book: Book
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
