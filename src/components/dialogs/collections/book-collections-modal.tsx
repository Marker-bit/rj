import { DrawerDialog } from "@/components/ui/drawer-dialog";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import {
  createCollection,
  deleteCollection,
  getCollections,
} from "@/lib/actions/collections";
import type { Book } from "@/lib/api-types";
import { declOfNum } from "@/lib/utils";
import type { Book as PrismaBook } from "@prisma/client";
import { Collection } from "@prisma/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowRightIcon, Loader, PlusIcon, TrashIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "../../ui/button";
import { Checkbox } from "../../ui/checkbox";
import { DialogHeader, DialogTitle } from "../../ui/dialog";

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
  const {
    data: collectionsData,
    isLoading: collectionsLoading,
    isError: collectionsIsError,
  } = useQuery({
    queryKey: ["collections"],
    queryFn: async () => {
      const { collections, error } = await getCollections();
      if (error) {
        throw new Error(error);
      }
      if (!collections) {
        throw new Error("Коллекции не получены");
      }
      return collections;
    },
  });

  const [selectedCollections, setSelectedCollections] = useState(
    book.collections.map((c) => c.id),
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
    router.refresh();
    setDeleteInProgress(false);
  };

  const [deleteInProgress, setDeleteInProgress] = useState(false);

  return (
    <DrawerDialog open={open} onOpenChange={setOpen} className="min-w-[50vw]">
      <DialogHeader>
        <DialogTitle>Коллекции</DialogTitle>
      </DialogHeader>
      <div className="mt-2">
        {collectionsLoading ? (
          <div className="flex h-[20vh] items-center justify-center">
            <Spinner className="size-6" />
          </div>
        ) : collectionsIsError ? (
          <div className="flex h-[20vh] items-center justify-center">
            <p className="text-center text-sm text-gray-500">
              Произошла ошибка при загрузке коллекций
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {collectionsData &&
              collectionsData.map(
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
                          ? selectedCollections.filter(
                              (c) => c !== collection.id,
                            )
                          : [...selectedCollections, collection.id],
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
                                (c) => c !== collection.id,
                              )
                            : [...selectedCollections, collection.id],
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
                ),
              )}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                runAction();
              }}
            >
              <InputGroup>
                <InputGroupInput
                  placeholder="Новая коллекция"
                  value={newCollectionTitle}
                  onChange={(e) => setNewCollectionTitle(e.target.value)}
                />
                <InputGroupAddon>
                  <PlusIcon />
                </InputGroupAddon>
                <InputGroupAddon align="inline-end">
                  <InputGroupButton
                    aria-label="Создать"
                    title="Создать"
                    size="icon-xs"
                    type="submit"
                    disabled={newCollectionLoading}
                  >
                    {newCollectionLoading ? <Spinner /> : <ArrowRightIcon />}
                  </InputGroupButton>
                </InputGroupAddon>
              </InputGroup>
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
        )}
      </div>
    </DrawerDialog>
  );
}
