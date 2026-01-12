"use client";

import type { Group, GroupBook } from "@prisma/client";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { DrawerDialog } from "@/components/ui/drawer-dialog";
import { Button } from "../../ui/button";
import { DialogDescription, DialogHeader, DialogTitle } from "../../ui/dialog";

export function DeleteGroupBookModal({
  open,
  setOpen,
  book,
}: {
  open: boolean;
  setOpen: (v: boolean) => void;
  book: GroupBook & { group: Group };
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  function deleteBook() {
    setLoading(true);
    fetch(`/api/groups/${book.group.id}/books/${book.id}`, {
      method: "DELETE",
    }).then(() => {
      setOpen(false);
      router.refresh();
    });
  }

  return (
    <DrawerDialog open={open} onOpenChange={setOpen}>
      <DialogHeader>
        <DialogTitle>Удалить книгу?</DialogTitle>
        <DialogDescription>
          Вы уверены, что хотите удалить книгу &quot;{book.title}
          &quot; из группы &quot;{book.group.title}&quot;? Это действие
          невозможно отменить.
        </DialogDescription>
      </DialogHeader>
      <div className="mt-1 flex gap-2 max-sm:flex-col md:ml-auto md:w-fit">
        <Button variant="outline" onClick={() => setOpen(false)}>
          Отмена
        </Button>
        <Button
          variant="destructive"
          className="gap-2"
          onClick={deleteBook}
          disabled={loading}
        >
          {loading && <Loader className="size-4 animate-spin" />}
          Удалить
        </Button>
      </div>
    </DrawerDialog>
  );
}
