"use client";

import type { GroupBook } from "@/generated/prisma/browser";
import { z } from "zod";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api-fetch";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DrawerDialog } from "@/components/ui/drawer-dialog";
import { Loader } from "@/components/ui/loader";
import { declOfNum } from "@/lib/utils";
import { revalidate } from "@/lib/actions/revalidate";

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
          disabled={loading}
          onClick={async () => {
            if (loading) return;
            setLoading(true);
            try {
              const result = await apiFetch<unknown>(
                `/api/groups/${groupBook.groupId}/books/${groupBook.id}/own`,
                { method: "DELETE", type: "json" },
              );
              z.object({ success: z.literal(true) }).parse(result);
              setOpen(false);
              void revalidate("groups");
            } catch {
              toast.error("Не удалось удалить книгу");
            } finally {
              setLoading(false);
            }
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
