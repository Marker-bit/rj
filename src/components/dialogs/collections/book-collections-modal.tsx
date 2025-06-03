"use client";

import { DrawerDialog } from "@/components/ui/drawer-dialog";
import { Label } from "@/components/ui/label";
import type { Book } from "@/lib/api-types";
import { declOfNum } from "@/lib/utils";
import type { Book as PrismaBook } from "@prisma/client";
import { Collection } from "@prisma/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "../../ui/button";
import { Checkbox } from "../../ui/checkbox";
import { DialogHeader, DialogTitle } from "../../ui/dialog";
import { getCollections } from "@/lib/actions/collections";
import { toast } from "sonner";

export function BookCollectionsModal({
  open,
  setOpen,
  book,
}: {
  open: boolean;
  setOpen: (v: boolean) => void;
  book: Book;
}) {
  const router = useRouter();
  const [collections, setCollections] =
    useState<(Collection & { books: PrismaBook[] })[]>();
  
  useEffect(() => {
    (async () => {
      const res = await getCollections();
      if (res.error) {
        toast.error("Произошла ошибка при получении коллекций", {
          description: res.error,
        });
        return;
      }
      setCollections(res.collections);
    })();
  }, []);
  
  const [selectedCollections, setSelectedCollections] = useState(
    book.collections.map((c) => c.id)
  );
  const queryClient = useQueryClient();
  const updateMutation = useMutation({
    mutationFn: () =>
      fetch(`/api/books/${book.id}/collections`, {
        method: "PATCH",
        body: JSON.stringify(selectedCollections),
      }),
    onSuccess: () => {
      setOpen(false);
      queryClient.invalidateQueries({
        queryKey: ["books"],
      });
      queryClient.invalidateQueries({
        queryKey: ["collections"],
      });
      router.refresh();
    },
  });
  return (
    <DrawerDialog open={open} onOpenChange={setOpen} className="min-w-[50vw]">
      <DialogHeader>
        <DialogTitle>Коллекции</DialogTitle>
      </DialogHeader>
      <div className="mt-2">
        {collections === undefined && (
          <div className="flex h-[20vh] items-center justify-center">
            <Loader className="size-6 animate-spin" />
          </div>
        )}
        <div className="flex flex-col gap-2">
          {collections &&
            collections.map(
              (collection: {
                id: string;
                name: string;
                books: PrismaBook[];
              }) => (
                <div
                  className="border-input has-data-[state=checked]:border-primary/50 relative flex w-full items-start gap-2 rounded-md border p-4 shadow-xs outline-none"
                  key={collection.id}
                  onClick={() =>
                    setSelectedCollections(
                      selectedCollections.includes(collection.id)
                        ? selectedCollections.filter((c) => c !== collection.id)
                        : [...selectedCollections, collection.id]
                    )
                  }
                >
                  <Checkbox
                    id={collection.id}
                    aria-describedby={`${collection.id}-description`}
                    checked={selectedCollections.includes(collection.id)}
                    onCheckedChange={() =>
                      setSelectedCollections(
                        selectedCollections.includes(collection.id)
                          ? selectedCollections.filter(
                              (c) => c !== collection.id
                            )
                          : [...selectedCollections, collection.id]
                      )
                    }
                  />
                  <div className="grid grow gap-2">
                    <Label>{collection.name}</Label>
                    <p
                      id={`${collection.id}-description`}
                      className="text-muted-foreground text-xs"
                    >
                      {collection.books.length}{" "}
                      {declOfNum(collection.books.length, [
                        "книга",
                        "книги",
                        "книг",
                      ])}
                    </p>
                  </div>
                </div>
              )
            )}
          <Button
            className="mt-2 gap-2"
            onClick={() => updateMutation.mutate()}
            disabled={updateMutation.isPending}
          >
            {updateMutation.isPending && (
              <Loader className="size-4 animate-spin" />
            )}
            Сохранить
          </Button>
        </div>
      </div>
    </DrawerDialog>
  );
}
