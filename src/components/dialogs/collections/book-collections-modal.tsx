import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowRightIcon, Loader, PlusIcon, TrashIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { CollectionMark } from "@/components/book/collection-mark";
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
import { Button } from "../../ui/button";
import { Checkbox } from "../../ui/checkbox";
import { DialogDescription, DialogHeader, DialogTitle } from "../../ui/dialog";
import { revalidate } from "@/lib/actions/revalidate";
import { CollectionEditPopover } from "./collection-appearance-editor";

export function BookCollectionsModal({
  open,
  setOpen,
  book,
}: {
  open: boolean;
  setOpen: (v: boolean) => void;
  book: Book;
}) {
  const [newCollectionTitle, setNewCollectionTitle] = useState("");
  const [selectedCollections, setSelectedCollections] = useState(
    book.collections.map((c) => c.id),
  );
  const queryClient = useQueryClient();

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
  const createMutation = useMutation({
    mutationFn: (name: string) => createCollection(name),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["collections"] });
      if (res.error) {
        toast.error("Произошла ошибка при создании коллекции", {
          description: res.error,
        });
        return;
      }
      toast.success(res.message);
      setNewCollectionTitle("");
    },
  });
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
      void revalidate("collections");
    },
  });
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteCollection(id),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["collections"] });
      if (res.error) {
        toast.error("Произошла ошибка при создании коллекции", {
          description: res.error,
        });
        return;
      }
      toast.success(res.message);
      setNewCollectionTitle("");
    },
  });

  return (
    <DrawerDialog open={open} onOpenChange={setOpen} className="min-w-[50vw]">
      <DialogHeader>
        <DialogTitle>Коллекции</DialogTitle>
        <DialogDescription>
          Выберите коллекции, в которых должна быть эта книга.
        </DialogDescription>
      </DialogHeader>
      <div className="mt-2 min-h-0 overflow-y-auto overscroll-contain p-1">
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
            {collectionsData?.length === 0 && (
              <p className="rounded-2xl border border-dashed p-4 text-center text-sm text-muted-foreground">
                У вас пока нет коллекций. Создайте первую ниже.
              </p>
            )}
            {collectionsData?.map((collection) => (
              <div key={collection.id} className="rounded-2xl border shadow-xs">
                <div className="flex items-center gap-2 p-3">
                  <Checkbox
                    id={collection.id}
                    aria-describedby={`${collection.id}-description`}
                    checked={selectedCollections.includes(collection.id)}
                    onCheckedChange={(checked) =>
                      setSelectedCollections((selected) =>
                        checked
                          ? [...selected, collection.id]
                          : selected.filter((id) => id !== collection.id),
                      )
                    }
                  />
                  <Label
                    htmlFor={collection.id}
                    className="min-w-0 grow cursor-pointer"
                  >
                    <CollectionMark
                      icon={collection.icon}
                      color={collection.color}
                      className="size-4 shrink-0"
                    />
                    <span className="min-w-0 wrap-anywhere">
                      {collection.name}
                      <span
                        id={`${collection.id}-description`}
                        className="block text-xs text-muted-foreground"
                      >
                        {collection.books.length}{" "}
                        {declOfNum(collection.books.length, [
                          "книга",
                          "книги",
                          "книг",
                        ])}
                      </span>
                    </span>
                  </Label>
                  <CollectionEditPopover collection={collection} />
                  <Button
                    type="button"
                    size="icon"
                    variant="outline"
                    aria-label={`Удалить коллекцию «${collection.name}»`}
                    disabled={deleteMutation.isPending}
                    onClick={() => deleteMutation.mutate(collection.id)}
                  >
                    {deleteMutation.isPending &&
                    deleteMutation.variables === collection.id ? (
                      <Spinner />
                    ) : (
                      <TrashIcon aria-hidden="true" />
                    )}
                  </Button>
                </div>
              </div>
            ))}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                createMutation.mutate(newCollectionTitle);
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
                    disabled={createMutation.isPending}
                  >
                    {createMutation.isPending ? (
                      <Spinner />
                    ) : (
                      <ArrowRightIcon />
                    )}
                  </InputGroupButton>
                </InputGroupAddon>
              </InputGroup>
            </form>
            <Button
              className="mt-2 gap-2"
              onClick={() => updateMutation.mutate()}
              disabled={
                createMutation.isPending ||
                updateMutation.isPending ||
                deleteMutation.isPending
              }
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
