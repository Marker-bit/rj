"use client";

import { Button } from "@/components/ui/button";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DrawerDialog } from "@/components/ui/drawer-dialog";
import { Loader } from "@/components/ui/loader";
import { declOfNum } from "@/lib/utils";
import { GroupBook } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RemoveBookDialog({
  open,
  setOpen,
  groupBook,
  book,
}: {
  open: boolean;
  setOpen: (b: boolean) => void;
  groupBook: GroupBook;
  book: {
    readEvents: {
      pagesRead: number;
    }[];
    title: string;
  };
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  return (
    <DrawerDialog open={open} onOpenChange={setOpen} className="min-w-[50vw]">
      <DialogHeader className="mb-2">
        <DialogTitle>Удалить книгу</DialogTitle>
      </DialogHeader>
      <p>
        Вы уверены, что хотите удалить книгу {groupBook.title} (вы прочитали{" "}
        {book.readEvents.length === 0 ? 0 : book.readEvents[0].pagesRead}{" "}
        {declOfNum(
          book.readEvents.length === 0 ? 0 : book.readEvents[0].pagesRead,
          ["страницу", "страницы", "страниц"],
        )}
        )? Это действие невозможно отменить. Книга будет удалена из ваших книг,
        не из группы.
      </p>
      <div className="mt-2 flex gap-2 max-sm:flex-col md:justify-end">
        <Button
          variant="destructive"
          onClick={async () => {
            setLoading(true);
            await fetch(
              `/api/groups/${groupBook.groupId}/books/${groupBook.id}/own`,
              {
                method: "DELETE",
              },
            );
            setLoading(false);
            setOpen(false);
            router.refresh();
          }}
        >
          {loading ? <Loader white className="size-4" /> : "Удалить"}
        </Button>
        <Button variant="ghost" onClick={() => setOpen(false)}>
          Отмена
        </Button>
      </div>
    </DrawerDialog>
  );
}
