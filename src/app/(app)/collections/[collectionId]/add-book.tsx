"use client";

import { Button } from "@/components/ui/button";
import { Loader } from "@/components/ui/loader";
import { Book, Collection } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export function AddBook({
  book,
  collection,
}: {
  book: Book;
  collection: Collection & {
    books: Book[];
  };
}) {
  const router = useRouter();
  const addMutation = useMutation({
    mutationFn: () => {
      return fetch(`/api/collections/${collection.id}/add-books`, {
        method: "POST",
        body: JSON.stringify([book.id]),
      });
    },
    onSuccess: () => {
      router.refresh();
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
