"use client";

import { DrawerDialog } from "@/app/Drawer";
import { Book, Collection } from "@prisma/client";
import { DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader, Router } from "lucide-react";
import { declOfNum } from "@/lib/utils";
import { useRouter } from "next/navigation";

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
  const queryClient = useQueryClient();
  const deleteMutation = useMutation({
    mutationFn: () =>
      fetch(`/api/collections/${collection.id}`, { method: "DELETE" }),
    onSuccess: () => {
      setOpen(false);
      router.refresh();
      queryClient.invalidateQueries({
        queryKey: ["collections"],
      });
      queryClient.invalidateQueries({
        queryKey: ["books"],
      });
    },
  });
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
      <div className="flex max-sm:flex-col gap-2 md:ml-auto w-fit">
        <Button variant="outline" onClick={() => setOpen(false)}>
          Отмена
        </Button>
        <Button
          variant="destructive"
          className="gap-2"
          onClick={() => deleteMutation.mutate()}
          disabled={deleteMutation.isPending}
        >
          {deleteMutation.isPending && (
            <Loader className="h-4 w-4 animate-spin" />
          )}
          Удалить
        </Button>
      </div>
    </DrawerDialog>
  );
}
