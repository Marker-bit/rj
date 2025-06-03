"use client";

import { DrawerDialog } from "@/components/ui/drawer-dialog";
import { deleteCollection } from "@/lib/actions/collections";
import { declOfNum } from "@/lib/utils";
import { Book, Collection } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "../../ui/button";
import { DialogDescription, DialogHeader, DialogTitle } from "../../ui/dialog";
import { Loader } from "@/components/ui/loader";
import { Trash } from "lucide-react";

export function DeleteCollectionModal({
  open,
  setOpen,
  collection,
}: {
  open: boolean;
  setOpen: (v: boolean) => void;
  collection: Collection & { books: Book[] };
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const runAction = async () => {
    setLoading(true);
    const res = await deleteCollection(collection.id);
    setLoading(false);
    if (res.error) {
      toast.error("Возникла проблема при удалении коллекции", {
        description: res.error,
      });
    }
    if (res.message) {
      toast.success(res.message);
      setOpen(false);
      router.refresh();
    }
  };

  return (
    <DrawerDialog open={open} onOpenChange={setOpen}>
      <DialogHeader>
        <DialogTitle>Удалить коллекцию?</DialogTitle>
        <DialogDescription>
          Вы уверены, что хотите удалить коллекцию &quot;{collection.name}
          &quot; (в ней {collection.books.length}{" "}
          {declOfNum(collection.books.length, ["книга", "книги", "книг"])})? Это
          действие невозможно отменить.
        </DialogDescription>
      </DialogHeader>
      <div className="flex gap-2 max-sm:flex-col md:ml-auto md:w-fit">
        <Button variant="outline" onClick={() => setOpen(false)}>
          Отмена
        </Button>
        <Button
          variant="destructive"
          className="gap-2"
          onClick={() => runAction()}
          disabled={loading}
        >
          {loading ? (
            <Loader className="size-4" />
          ) : (
            <Trash />
          )}
          Удалить
        </Button>
      </div>
    </DrawerDialog>
  );
}
