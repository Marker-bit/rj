"use client";

import { z } from "zod";
import { apiFetch } from "@/lib/api-fetch";
import type { Book, Group, GroupBook } from "@/generated/prisma/browser";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DrawerDialog } from "@/components/ui/drawer-dialog";
import { Loader } from "@/components/ui/loader";
import { getBooks } from "@/lib/actions/books";
import { revalidate } from "@/lib/actions/revalidate";

export default function BindBookModal({
  open,
  setOpen,
  groupBook,
}: {
  open: boolean;
  setOpen: (b: boolean) => void;
  groupBook: GroupBook & { group: Group };
}) {
  const [loading, setLoading] = useState<string>();
  const [books, setBooks] = useState<Book[]>();

  useEffect(() => {
    const updateBooks = async () => {
      const availableBooks = await getBooks();
      setBooks(availableBooks);
    };

    updateBooks();
  }, []);

  const bindBook = async (bookId: string) => {
    if (loading) return;
    setLoading(bookId);
    try {
      const result = await apiFetch<unknown>(
        `/api/groups/${groupBook.group.id}/books/${groupBook.id}/bind-book`,
        {
          method: "POST",
          body: JSON.stringify({ bookId }),
          type: "json",
        },
      );
      z.object({ success: z.literal(true) }).parse(result);
      toast.success("Книга связана");
      setOpen(false);
      void revalidate("groups");
    } catch {
      toast.error("Не удалось связать книгу");
    } finally {
      setLoading(undefined);
    }
  };

  return (
    <DrawerDialog open={open} onOpenChange={setOpen} className="min-w-[50vw]">
      <DialogHeader>
        <DialogTitle>Связать с книгой</DialogTitle>
      </DialogHeader>
      {books === undefined ? (
        <div>Загрузка...</div>
      ) : (
        <div className="flex flex-col gap-4">
          {books.map((book) => (
            <button
              type="button"
              disabled={!!loading}
              className="flex flex-col gap-1"
              onClick={() => bindBook(book.id)}
              key={book.id}
            >
              <div className="font-bold">{book.title}</div>
              <div className="text-xs">{book.author}</div>
              {loading === book.id && (
                <div className="flex items-center gap-2 text-xs">
                  <Loader className="size-4" />
                  Подождите...
                </div>
              )}
            </button>
          ))}
        </div>
      )}
    </DrawerDialog>
  );
}
