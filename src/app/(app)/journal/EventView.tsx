"use client";

import { Button } from "@/components/ui/button";
import { BookOpen, BookOpenCheck, Loader, Undo } from "lucide-react";
import Link from "next/link";
import { dateToString } from "@/lib/utils";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";

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
    mutationFn: async () =>
      await fetch(`/api/journal/events/${event.id}`, {
        method: "DELETE",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["events"],
      });
      queryClient.invalidateQueries({
        queryKey: ["books"],
      });
    },
  });
  return (
    <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 p-2 cursor-default flex flex-wrap items-center gap-1">
      {event.pagesRead === event.book.pages ? (
        <>
          <BookOpenCheck className="w-4 h-4 mr-1 text-green-500" />
          <Link href={`/books#book-${event.bookId}`} className="font-semibold">
            Книга &quot;{event.book.title}&quot; автора {event.book.author}
          </Link>
          прочитана {dateToString(new Date(event.readAt))}
        </>
      ) : (
        <>
          <BookOpen className="w-4 h-4 mr-1" />
          {event.pagesRead} страниц прочитано{" "}
          {dateToString(new Date(event.readAt))}
          <Link href={`/books#book-${event.bookId}`} className="font-semibold">
            в книге &quot;{event.book.title}&quot; автора {event.book.author}
          </Link>
        </>
      )}
      <Button
        variant="outline"
        size="icon"
        className="p-1 w-fit h-fit ml-auto"
        disabled={undoMutation.isPending}
        onClick={() => undoMutation.mutate()}
      >
        {undoMutation.isPending ? (
          <Loader className="w-4 h-4 animate-spin" />
        ) : (
          <Undo className="w-4 h-4" />
        )}
      </Button>
    </div>
  );
}
