"use client";

import type { Book, Collection } from "@/generated/prisma/browser";
import { useMutation } from "@tanstack/react-query";
import { Loader, Minus } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { revalidate } from "@/lib/actions/revalidate";

export function RemoveBook({
  book,
  collection,
}: {
  book: Book;
  collection: Collection & {
    books: Book[];
  };
}) {
  const removeMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(
        `/api/collections/${collection.id}/remove-books`,
        {
          method: "POST",
          body: JSON.stringify([book.id]),
        },
      );
      if (!response.ok) throw new Error("Collection update failed");
    },
    onError: () => {
      toast.error("Не удалось убрать книгу из коллекции", {
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
        <div className="text-sm text-muted-foreground">{book.author}</div>
      </div>
      <Button
        aria-label={`Убрать «${book.title}» из коллекции`}
        variant="ghost"
        size="icon"
        className="ml-auto size-fit p-1 text-muted-foreground hover:text-black dark:hover:text-white"
        onClick={() => removeMutation.mutate()}
        disabled={removeMutation.isPending}
      >
        {removeMutation.isPending ? (
          <Loader className="size-6 animate-spin" />
        ) : (
          <Minus className="size-6" />
        )}
      </Button>
    </div>
  );
}
