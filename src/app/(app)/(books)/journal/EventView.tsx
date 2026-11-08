"use client";

import type { Book } from "@prisma/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BookOpen, BookOpenCheck, Loader, Undo } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { SimpleTooltip } from "@/components/ui/simple-tooltip";
import { dateToString } from "@/lib/utils";
import { revalidate } from "@/lib/actions/revalidate";

export function EventView({
  event,
}: {
  event: {
    id: string;
    bookId: string;
    book: Book;
    pagesRead: number;
    readAt: string | Date;
  };
}) {
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
  return (
    <div className="flex cursor-default flex-wrap items-center gap-1 rounded-xl border p-2">
      {event.pagesRead === event.book.pages ? (
        <>
          <BookOpenCheck className="mr-1 size-4 text-green-500" />
          <Link href={`/books/${event.bookId}`} className="font-semibold">
            Книга &quot;{event.book.title}&quot; автора {event.book.author}
          </Link>
          прочитана {dateToString(new Date(event.readAt))}
        </>
      ) : (
        <>
          <BookOpen className="mr-1 size-4" />
          До {event.pagesRead} страницы прочитано{" "}
          {dateToString(new Date(event.readAt))}
          <Link href={`/books/${event.bookId}`} className="font-semibold">
            в книге &quot;{event.book.title}&quot; автора {event.book.author}
          </Link>
        </>
      )}
      <SimpleTooltip text="Отменить">
        <Button
          variant="outline"
          size="icon"
          className="ml-auto"
          disabled={undoMutation.isPending}
          onClick={() => undoMutation.mutate()}
        >
          {undoMutation.isPending ? (
            <Loader className="size-4 animate-spin" />
          ) : (
            <Undo className="size-4" />
          )}
        </Button>
      </SimpleTooltip>
    </div>
  );
}
