"use client";

import { DrawerDialog } from "@/components/drawer";
import { DialogHeader, DialogTitle } from "../ui/dialog";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader } from "lucide-react";
import { Checkbox } from "../ui/checkbox";
import { useState } from "react";
import { Button } from "../ui/button";
import { cn, declOfNum } from "@/lib/utils";
import { useRouter } from "next/navigation";

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
  const collectionsQuery = useQuery({
    queryKey: ["collections"],
    queryFn: () => fetch(`/api/collections`).then((res) => res.json()),
  });
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
        {collectionsQuery.isPending && (
          <div className="h-[20vh] flex items-center justify-center">
            <Loader className="w-6 h-6 animate-spin" />
          </div>
        )}
        <div className="flex flex-col gap-2">
          {collectionsQuery.data &&
            collectionsQuery.data.map(
              (collection: { id: string; name: string; books: Book[] }) => (
                <div
                  className={cn(
                    "flex gap-2 rounded-xl p-2 hover:bg-slate-100 dark:hover:bg-slate-900 cursor-pointer items-center transition-colors",
                    selectedCollections.includes(collection.id) &&
                      "bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700"
                  )}
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
                  <div className="flex flex-col">
                    <h1 className="text-xl font-bold">{collection.name}</h1>
                    <div className="text-xs text-muted-foreground/70">
                      {collection.books.length}{" "}
                      {declOfNum(collection.books.length, [
                        "книга",
                        "книги",
                        "книг",
                      ])}
                    </div>
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
              <Loader className="w-4 h-4 animate-spin" />
            )}
            Сохранить
          </Button>
        </div>
      </div>
    </DrawerDialog>
  );
}
