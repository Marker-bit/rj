"use client";

import { DateReadModal } from "@/components/dialogs/books/read/date-read-modal";
import { DateDoneModal } from "@/components/dialogs/books/read/date-done-modal";
import { useState } from "react";
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

  const genSetOpen = (dialog: null | "read" | "done") => (open: boolean) =>
    setActiveDialog(open ? dialog : null);

  const router = useRouter();
  const lastEvent = book.readEvents[0];

  const queryClient = useQueryClient();

  return (
    <>
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
          router.refresh();
        }}
        book={book}
        lastEvent={lastEvent}
      />
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
          router.refresh();
          router.push(`/books/history?bookReadId=${book.id}`);
        }}
      />
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
