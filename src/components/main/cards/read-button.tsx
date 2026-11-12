"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BookCheckIcon, BookOpenIcon, BookOpenTextIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { revalidate } from "@/lib/actions/revalidate";

const DateReadModal = dynamic(
  () =>
    import("@/components/dialogs/books/read/date-read-modal").then(
      (mod) => mod.DateReadModal,
    ),
  { ssr: false },
);
const DateDoneModal = dynamic(
  () =>
    import("@/components/dialogs/books/read/date-done-modal").then(
      (mod) => mod.DateDoneModal,
    ),
  { ssr: false },
);

export function ReadButton({
  book,
}: {
  book: {
    readEvents: {
      readAt: Date;
      pagesRead: number;
    }[];
    id: string;
    pages: number;
  };
}) {
  const [activeDialog, setActiveDialog] = useState<null | "read" | "done">(
    null,
  );
  const [mountedDialogs, setMountedDialogs] = useState<Set<"read" | "done">>(
    () => new Set(),
  );

  useEffect(() => {
    if (!activeDialog) {
      return;
    }

    setMountedDialogs((previous) => {
      if (previous.has(activeDialog)) {
        return previous;
      }

      const next = new Set(previous);
      next.add(activeDialog);
      return next;
    });
  }, [activeDialog]);

  const genSetOpen = (dialog: null | "read" | "done") => (open: boolean) =>
    setActiveDialog(open ? dialog : null);

  const router = useRouter();
  const lastEvent = book.readEvents[0];

  const queryClient = useQueryClient();

  return (
    <>
      {mountedDialogs.has("read") && (
        <DateReadModal
          isOpen={activeDialog === "read"}
          setIsOpen={genSetOpen("read")}
          onSuccess={() => {
            queryClient.invalidateQueries({
              queryKey: ["events"],
            });
            queryClient.invalidateQueries({
              queryKey: ["books"],
            });
            void revalidate("books");
          }}
          book={book}
          lastEvent={lastEvent}
        />
      )}
      {mountedDialogs.has("done") && (
        <DateDoneModal
          isOpen={activeDialog === "done"}
          setIsOpen={genSetOpen("done")}
          book={book}
          onDone={() => {
            queryClient.invalidateQueries({
              queryKey: ["events"],
            });
            queryClient.invalidateQueries({
              queryKey: ["books"],
            });
            void revalidate("books");
            router.push(`/books/history?bookReadId=${book.id}`);
          }}
        />
      )}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button>
            <div className="hidden sm:block">Отметить прочтение</div>
            <BookOpenIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-60">
          <DropdownMenuItem onClick={() => setActiveDialog("read")}>
            <BookOpenTextIcon />
            Прочитана частично
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setActiveDialog("done")}>
            <BookCheckIcon />
            Прочитана полностью
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
