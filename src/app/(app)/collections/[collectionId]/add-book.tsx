"use client";

import { Button } from "@/components/ui/button";
import { Book, Collection } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import { Loader, Plus } from "lucide-react";
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
    <div className="p-2 border border-slate-100 dark:border-slate-900 rounded-xl flex items-center">
      {book.coverUrl && (
        <Image
          src={book.coverUrl}
          alt="book"
          width={500}
          height={500}
          className="rounded-md h-40 w-auto"
        />
      )}
      <div className="flex flex-col ml-2 mb-auto">
        <div className="text-xl">{book.title}</div>
        <div className="text-muted-foreground/70 text-sm">{book.author}</div>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="w-fit h-fit p-1 ml-auto text-muted-foreground/50 hover:text-black dark:hover:text-white"
        onClick={() => addMutation.mutate()}
        disabled={addMutation.isPending}
      >
        {addMutation.isPending ? (
          <Loader className="w-6 h-6 animate-spin" />
        ) : (
          <Plus className="w-6 h-6" />
        )}
      </Button>
    </div>
  );
}
