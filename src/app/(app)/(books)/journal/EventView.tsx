"use client";

import { reachedPageCount } from "@/lib/reading-events";
import type { JournalRow } from "@/lib/journal-page";
import { format } from "date-fns";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BookOpen, BookOpenCheck, Loader, Undo } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { SimpleTooltip } from "@/components/ui/simple-tooltip";
import { bookDetailHref } from "@/lib/book-back";
import { revalidate } from "@/lib/actions/revalidate";

export function EventView({ event }: { event: JournalRow }) {
  const queryClient = useQueryClient();
  const undoMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/journal/events/${event.id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Undo failed");
    },
    onError: () => {
      toast.error("Не удалось отменить запись", {
        description:
          "Проверьте соединение и попробуйте ещё раз. Запись сохранена.",
      });
    },
    meta: { errorHandled: true },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["events"],
      });
      queryClient.invalidateQueries({
        queryKey: ["books"],
      });
      void revalidate("books");
    },
  });
  const complete = reachedPageCount(event.pagesRead, event.book.pages);
  const EventIcon = complete ? BookOpenCheck : BookOpen;

  return (
    <li className="flex items-center gap-2 px-2 sm:px-3">
      <div
        className={`flex size-6 shrink-0 items-center justify-center ${complete ? "text-green-700 dark:text-green-400" : "text-muted-foreground"}`}
      >
        <EventIcon aria-hidden="true" className="size-4" />
      </div>
      <div className="min-w-0 flex-1 py-1.5">
        <Link
          href={bookDetailHref(event.bookId, "journal")}
          className="block w-fit max-w-full touch-manipulation rounded-sm text-sm/5 font-semibold wrap-anywhere hover:underline"
        >
          {event.book.title}
        </Link>
        <p className="flex flex-wrap items-baseline gap-x-2 text-xs/4 text-muted-foreground">
          {event.book.author && (
            <span className="max-w-full wrap-anywhere">
              {event.book.author}
            </span>
          )}
          <span>
            {complete ? "Книга прочитана" : `До ${event.pagesRead} страницы`}
          </span>
          <time dateTime={event.readAt} className="tabular-nums">
            {format(new Date(event.readAt), "HH:mm")}
          </time>
        </p>
      </div>
      <SimpleTooltip text="Отменить запись">
        <Button
          aria-label="Отменить запись"
          variant="ghost"
          size="icon"
          className="size-11 shrink-0 touch-manipulation text-muted-foreground"
          disabled={undoMutation.isPending}
          onClick={() => undoMutation.mutate()}
        >
          {undoMutation.isPending ? (
            <Loader className="size-4 motion-safe:animate-spin" />
          ) : (
            <Undo className="size-4" />
          )}
        </Button>
      </SimpleTooltip>
    </li>
  );
}
