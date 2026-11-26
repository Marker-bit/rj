"use client";

import { Close as PopoverClose } from "@radix-ui/react-popover";
import { useInfiniteQuery } from "@tanstack/react-query";
import { format, isSameDay } from "date-fns";
import { ru } from "date-fns/locale";
import { BookMinus, CalendarDays, ChevronLeft, Loader } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { DateRange } from "react-day-picker";
import { DateCalendar } from "@/components/date-calendar";
import { Button } from "@/components/ui/button";
import { SimpleTooltip } from "@/components/ui/simple-tooltip";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import { journalDateBounds } from "@/lib/journal-date-range";
import type { JournalPage, JournalRow } from "@/lib/journal-page";
import { EventView } from "./EventView";

const initialCursor: JournalPage["nextCursor"] = null;

function dateFilterLabel(range: DateRange | undefined) {
  const from = range?.from && format(range.from, "dd.MM.yyyy");
  const to = range?.to && format(range.to, "dd.MM.yyyy");
  if (from && to) return from === to ? from : `${from} — ${to}`;
  if (from) return `С ${from}`;
  if (to) return `До ${to}`;
  return "Все даты";
}

export default function JournalView({ userId }: { userId: string }) {
  const today = new Date();
  const [dates, setDates] = useState<DateRange | undefined>();
  const endRef = useRef<HTMLDivElement>(null);
  const [manualPagination, setManualPagination] = useState(false);
  const { from, until } = journalDateBounds(dates);
  const query = useInfiniteQuery({
    queryKey: ["events", "journal", userId, from, until],
    initialPageParam: initialCursor,
    gcTime: 0,
    queryFn: async ({ pageParam, signal }): Promise<JournalPage> => {
      const params = new URLSearchParams();
      if (from) params.set("from", from);
      if (until) params.set("until", until);
      if (pageParam) {
        params.set("cursorReadAt", pageParam.readAt);
        params.set("cursorId", pageParam.id);
      }
      const response = await fetch(`/api/journal/page?${params}`, { signal });
      if (!response.ok) throw new Error("Could not load journal");
      return response.json();
    },
    getNextPageParam: (page): JournalPage["nextCursor"] => page.nextCursor,
  });
  const { fetchNextPage, hasNextPage, isFetching, isFetchNextPageError } =
    query;
  useEffect(() => {
    const end = endRef.current;
    if (!end || !hasNextPage || isFetching || isFetchNextPageError) return;
    if (typeof IntersectionObserver === "undefined") {
      setManualPagination(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        observer.disconnect();
        void fetchNextPage({ cancelRefetch: false });
      },
      { rootMargin: "0px 0px 320px" },
    );
    observer.observe(end);
    return () => observer.disconnect();
  }, [
    fetchNextPage,
    from,
    until,
    hasNextPage,
    isFetching,
    isFetchNextPageError,
  ]);

  const days: { key: string; date: Date; events: JournalRow[] }[] = [];
  for (const page of query.data?.pages ?? []) {
    for (const event of page.events) {
      const date = new Date(event.readAt);
      const day = days.at(-1);
      if (day && isSameDay(day.date, date)) day.events.push(event);
      else
        days.push({ key: format(date, "yyyy-MM-dd"), date, events: [event] });
    }
  }
  const hasEvents = query.data?.pages[0]?.hasEvents;

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-col gap-3 px-3 pt-2 pb-24 sm:px-6 sm:pt-5">
      <header className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-1">
          <SimpleTooltip text="Назад">
            <Button
              asChild
              variant="ghost"
              size="icon"
              className="size-11 touch-manipulation"
            >
              <Link href="/home" aria-label="Назад">
                <ChevronLeft className="size-5" />
              </Link>
            </Button>
          </SimpleTooltip>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Журнал
          </h1>
        </div>
        <div className="ml-auto flex min-w-0 max-w-full items-center gap-1">
          {dates && (
            <Button
              variant="ghost"
              aria-label="Сбросить фильтр"
              className="shrink-0 touch-manipulation"
              onClick={() => setDates(undefined)}
            >
              Сбросить
            </Button>
          )}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                id="dates"
                aria-label={`Фильтр по датам. ${dateFilterLabel(dates)}`}
                className="min-w-0 touch-manipulation"
              >
                <CalendarDays className="size-4 shrink-0 text-muted-foreground" />
                <span className="min-w-0 truncate">
                  {dateFilterLabel(dates)}
                </span>
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="max-h-(--radix-popover-content-available-height) w-auto max-w-[calc(100vw-1rem)] overflow-auto p-0"
              align="end"
              collisionPadding={8}
            >
              <DateCalendar
                mode="range"
                fixedWeeks
                selected={dates}
                onSelect={setDates}
                defaultMonth={dates?.from ?? dates?.to}
                disabled={{ after: today }}
              />
              <div className="flex justify-end border-t p-2">
                <PopoverClose asChild>
                  <Button
                    variant="ghost"
                    className="min-h-11 touch-manipulation"
                  >
                    Готово
                  </Button>
                </PopoverClose>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </header>
      <div className="flex flex-col gap-3">
        {query.isPending && (
          <div role="status" aria-label="Загрузка журнала">
            <Skeleton className="h-12 w-full rounded-xl" />
          </div>
        )}
        {query.isError && !query.data && (
          <Button variant="outline" onClick={() => void query.refetch()}>
            Повторить загрузку
          </Button>
        )}
        {hasEvents === false && (
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <BookMinus />
              </EmptyMedia>
              <EmptyTitle>Журнал пуст</EmptyTitle>
              <EmptyDescription>
                Отметьте прочтение книги, чтобы здесь появилась запись.
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Button asChild variant="outline">
                <Link href="/books">К книгам</Link>
              </Button>
            </EmptyContent>
          </Empty>
        )}
        {hasEvents && days.length === 0 && (
          <Empty className="rounded-xl border">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <CalendarDays />
              </EmptyMedia>
              <EmptyTitle>
                {dates?.from && dates.to && isSameDay(dates.from, dates.to)
                  ? "За этот день записей нет"
                  : "За эти даты записей нет"}
              </EmptyTitle>
            </EmptyHeader>
          </Empty>
        )}
        {days.map(({ key, date, events }) => (
          <section key={key} className="flex flex-col gap-1">
            <h2 className="px-1 text-sm font-medium text-muted-foreground">
              <time dateTime={key}>
                {format(date, "d MMMM yyyy", { locale: ru })}
              </time>
            </h2>
            <ul className="divide-y rounded-xl border bg-card">
              {events.map((event) => (
                <EventView event={event} key={event.id} />
              ))}
            </ul>
          </section>
        ))}
        {hasNextPage && (
          <div ref={endRef} className="flex min-h-11 justify-center">
            {isFetchNextPageError || manualPagination ? (
              <Button
                variant="outline"
                disabled={isFetching}
                onClick={() => void fetchNextPage({ cancelRefetch: false })}
              >
                {query.isFetchingNextPage
                  ? "Загрузка…"
                  : isFetchNextPageError
                    ? "Повторить загрузку"
                    : "Загрузить ещё"}
              </Button>
            ) : (
              <div
                role="status"
                className="flex items-center gap-2 text-sm text-muted-foreground"
              >
                {query.isFetchingNextPage && (
                  <>
                    <Loader
                      aria-hidden="true"
                      className="size-4 motion-safe:animate-spin"
                    />
                    Загрузка записей…
                  </>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
