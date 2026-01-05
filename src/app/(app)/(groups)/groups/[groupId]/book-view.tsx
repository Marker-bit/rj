"use client";

import type { Book, Group, GroupBook } from "@prisma/client";
import { BookOpen, Minus, Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/ui/loader";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { declOfNum } from "@/lib/utils";
import { MoreActions } from "./more-actions";
import RemoveBookDialog from "./remove-book-dialog";

export function GroupBookView({
  groupBook,
  userId,
}: {
  groupBook: GroupBook & {
    group: Group;
    book: (Book & { readEvents: { pagesRead: number }[] })[];
  };
  userId: string;
}) {
  const [loading, setLoading] = useState(false);
  const [removeDialogOpen, setRemoveDialogOpen] = useState(false);
  const router = useRouter();

  const book = groupBook.book.find((b) => b.userId === userId);

  const addBook = async () => {
    setLoading(true);
    const res = await fetch(
      `/api/groups/${groupBook.groupId}/books/${groupBook.id}/own`,
      {
        method: "POST",
      },
    );
    const data = await res.json();
    setLoading(false);
    router.refresh();
    toast("Книга добавлена", {
      description: "Теперь вы можете читать ее",
      action: {
        onClick: () => {
          router.push(`/books/${data.id}`);
          router.refresh();
        },
        label: "Перейти",
      },
    });
  };

  const deleteBook = async () => {
    if (!book) {
      return;
    }
    if (book.readEvents.length === 0) {
      setLoading(true);
      await fetch(
        `/api/groups/${groupBook.groupId}/books/${groupBook.id}/own`,
        {
          method: "DELETE",
        },
      );
      setLoading(false);
      router.refresh();
    } else {
      setRemoveDialogOpen(true);
    }
  };

  return (
    <div
      key={groupBook.id}
      className="flex items-center gap-2 rounded-xl p-2 transition-all hover:bg-muted/10"
    >
      {groupBook.coverUrl && (
        <Image
          src={groupBook.coverUrl}
          alt="book"
          width={500}
          height={500}
          className="h-32 w-auto rounded-md"
        />
      )}
      <div className="flex flex-col gap-1">
        <div className="text-xl font-bold">{groupBook.title}</div>
        <div className="-mt-1 text-sm text-zinc-500">{groupBook.author}</div>
        <div className="-mt-1 text-sm text-zinc-500">
          {groupBook.pages} стр.
        </div>
        <div className="-mt-1 text-sm text-zinc-500">
          {groupBook.book.length === 0 ? "Нет" : groupBook.book.length}{" "}
          {declOfNum(groupBook.book.length, [
            "читатель",
            "читателя",
            "читателей",
          ])}
        </div>
        <div className="-mt-1 text-sm text-zinc-500">
          {groupBook.description}
        </div>
      </div>
      <div className="ml-auto flex gap-1">
        {book && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                className="size-fit p-1 max-sm:hidden"
                asChild
              >
                <Link href={`/books/${book.id}`}>
                  <BookOpen className="size-4" />
                </Link>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Показать книгу</TooltipContent>
          </Tooltip>
        )}

        {!book ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                className="size-fit p-1 max-sm:hidden"
                onClick={async () => {
                  await addBook();
                }}
              >
                {loading ? (
                  <Loader className="size-4" />
                ) : (
                  <Plus className="size-4" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>Добавить себе книгу</TooltipContent>
          </Tooltip>
        ) : (
          <>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  variant="ghost"
                  className="size-fit p-1 max-sm:hidden"
                  onClick={async () => {
                    await deleteBook();
                  }}
                >
                  {loading ? (
                    <Loader className="size-4" />
                  ) : (
                    <Minus className="size-4" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>Удалить у себя книгу</TooltipContent>
            </Tooltip>
            <RemoveBookDialog
              open={removeDialogOpen}
              setOpen={setRemoveDialogOpen}
              groupBook={groupBook}
              book={book}
            />
          </>
        )}
        <MoreActions
          book={groupBook}
          addedBook={book}
          addBook={addBook}
          deleteBook={deleteBook}
        />
      </div>
    </div>
  );
}
