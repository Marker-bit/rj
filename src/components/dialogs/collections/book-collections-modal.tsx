"use client";

import { DrawerDialog } from "@/components/ui/drawer-dialog";
import { Label } from "@/components/ui/label";
import type { Book } from "@/lib/api-types";
import { declOfNum } from "@/lib/utils";
import type { Book as PrismaBook } from "@prisma/client";
import { Collection } from "@prisma/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowRight, Loader, PlusIcon, TrashIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "../../ui/button";
import { Checkbox } from "../../ui/checkbox";
import { DialogHeader, DialogTitle } from "../../ui/dialog";
import { createCollection, deleteCollection, getCollections } from "@/lib/actions/collections";
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

  const [newCollectionTitle, setNewCollectionTitle] = useState("");
  const [newCollectionLoading, setNewCollectionLoading] = useState(false);

  const runAction = async () => {
    setNewCollectionLoading(true);
    const res = await createCollection(newCollectionTitle);
    if (res.error) {
      toast.error("Произошла ошибка при создании коллекции", {
        description: res.error,
      });
      return;
    }
    toast.success(res.message);
    const res2 = await getCollections();
    if (res2.error) {
      toast.error("Произошла ошибка при получении коллекций", {
        description: res2.error,
      });
      return;
    }
    setCollections(res2.collections);
    setNewCollectionTitle("");
    setNewCollectionLoading(false);
  };

  const runDeleteCollection = async (id: string) => {
    setDeleteInProgress(true);
    const res = await deleteCollection(id);
    if (res.error) {
      toast.error("Произошла ошибка при удалении коллекции", {
        description: res.error,
      });
      return;
    }
    toast.success(res.message);
    const res2 = await getCollections();
    if (res2.error) {
      toast.error("Произошла ошибка при получении коллекций", {
        description: res2.error,
      });
      return;
    }
    setCollections(res2.collections);
    router.refresh()
    setDeleteInProgress(false);
  }

  const [deleteInProgress, setDeleteInProgress] = useState(false);

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
                  <Button
                    size="icon"
                    variant="outline"
                    className="top-2 right-2"
                    disabled={deleteInProgress}
                    onClick={(e) => {
                      e.stopPropagation();
                      runDeleteCollection(collection.id);
                    }}
                  >
                    <TrashIcon />
                  </Button>
                </div>
              )
            )}
          <form
            className="border-input has-data-[state=checked]:border-primary/50 relative flex w-full items-center gap-2 rounded-md border p-4 shadow-xs outline-none"
            onSubmit={(e) => {
              e.preventDefault();
              runAction();
            }}
          >
            <PlusIcon className="text-muted-foreground size-4" />
            <input
              type="text"
              placeholder="Новая коллекция"
              className="w-full outline-none"
              value={newCollectionTitle}
              onChange={(e) => setNewCollectionTitle(e.target.value)}
            />
            <button
              className="group"
              disabled={
                newCollectionTitle.length < 1 || newCollectionTitle.length > 70
              }
            >
              {newCollectionLoading ? (
                <Loader className="size-4 animate-spin" />
              ) : (
                <ArrowRight className="text-muted-foreground size-4 group-hover:text-primary group-disabled:opacity-50 group-disabled:text-muted-foreground" />
              )}
            </button>
          </form>
          <Button
            className="mt-2 gap-2"
            onClick={() => updateMutation.mutate()}
            disabled={updateMutation.isPending || deleteInProgress}
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
