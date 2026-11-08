"use client";

import type { Book, Collection } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/ui/loader";
import { revalidate } from "@/lib/actions/revalidate";

export function AddBook({
  book,
  collection,
}: {
  book: Book;
  collection: Collection & {
    books: Book[];
  };
}) {
  const addMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(
        `/api/collections/${collection.id}/add-books`,
        {
          method: "POST",
          body: JSON.stringify([book.id]),
        },
      );
      if (!response.ok) throw new Error("Collection update failed");
    },
    onError: () => {
      toast.error("Не удалось добавить книгу в коллекцию", {
        description: "Проверьте соединение и попробуйте ещё раз.",
      });
    },
    onSuccess: () => {
      void revalidate("collections");
    },
  });
  return (
    <div className="flex items-center rounded-xl border p-2">
      {book.coverUrl && (
        <Image
          src={book.coverUrl}
          alt="book"
          width={500}
          height={500}
          className="h-40 w-auto rounded-md"
        />
      )}
      <div className="mb-auto ml-2 flex flex-col">
        <div className="text-xl">{book.title}</div>
        <div className="text-sm text-muted-foreground/70">{book.author}</div>
      </div>
      <Button
        aria-label={`Добавить «${book.title}» в коллекцию`}
        variant="ghost"
        size="icon"
        className="ml-auto size-fit p-1 text-muted-foreground/50 hover:text-black dark:hover:text-white"
        onClick={() => addMutation.mutate()}
        disabled={addMutation.isPending}
      >
        {addMutation.isPending ? (
          <Loader className="size-6" />
        ) : (
          <Plus className="size-6" />
        )}
      </Button>
    </div>
  );
}
