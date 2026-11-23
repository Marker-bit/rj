"use client";

import { Trash } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { DrawerDialog } from "@/components/ui/drawer-dialog";
import { Loader } from "@/components/ui/loader";
import { deleteCollection } from "@/lib/actions/collections";
import { declOfNum } from "@/lib/utils";
import { Button } from "../../ui/button";
import { DialogDescription, DialogHeader, DialogTitle } from "../../ui/dialog";

export function DeleteCollectionModal({
  open,
  setOpen,
  collection,
  onDeleted,
}: {
  open: boolean;
  setOpen: (v: boolean) => void;
  collection: { id: string; name: string; bookCount: number };
  onDeleted: () => void;
}) {
  const [loading, setLoading] = useState(false);

  const runAction = async () => {
    setLoading(true);
    try {
      const res = await deleteCollection(collection.id);
      if (res.error) {
        toast.error(res.error);
        return;
      }
      toast.success(res.message);
      setOpen(false);
      onDeleted();
    } catch {
      toast.error("Не удалось удалить коллекцию");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DrawerDialog open={open} onOpenChange={setOpen}>
      <DialogHeader>
        <DialogTitle>Удалить коллекцию?</DialogTitle>
        <DialogDescription>
          Коллекция «{collection.name}» будет удалена. Её {collection.bookCount}{" "}
          {declOfNum(collection.bookCount, ["книга", "книги", "книг"])}{" "}
          останутся в библиотеке.
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
          {loading ? <Loader className="size-4" /> : <Trash />}
          Удалить
        </Button>
      </div>
    </DrawerDialog>
  );
}
