"use client";

import { Button } from "@/components/ui/button";
import { Book, Collection } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import { Loader, Minus, Plus } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export function RemoveBook({
  book,
  collection,
}: {
  book: Book;
  collection: Collection & {
    books: Book[];
  };
}) {
  const router = useRouter();
  const removeMutation = useMutation({
    mutationFn: () => {
      return fetch(`/api/collections/${collection.id}/remove-books`, {
        method: "POST",
        body: JSON.stringify([book.id]),
      });
    },
    onSuccess: () => {
      router.refresh();
    }
  });
  return (
    <div className="p-2 border border-zinc-100 rounded-xl flex items-center">
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
        <div className="text-black/70 text-sm">{book.author}</div>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="w-fit h-fit p-1 ml-auto text-black/50 hover:text-black"
        onClick={() => removeMutation.mutate()}
        disabled={removeMutation.isPending}
      >
        {removeMutation.isPending ? (
          <Loader className="w-6 h-6 animate-spin" />
        ) : (
          <Minus className="w-6 h-6" />
        )}
      </Button>
    </div>
  );
}
