"use client";

import { Button } from "@/components/ui/button";
import { Book, Group, GroupBook } from "@prisma/client";
import { BookOpen, Loader, Minus, Plus } from "lucide-react";
import Image from "next/image";
import { MoreActions } from "./more-actions";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { declOfNum } from "@/lib/utils";
import Link from "next/link";

export function GroupBookView({
  groupBook,
  ownedBooks,
  isMember,
  userId,
}: {
  groupBook: GroupBook & {
    group: Group;
    book: Book[];
  };
  ownedBooks: any[];
  isMember: boolean;
  userId: string;
}) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const book = groupBook.book.find((b) => b.userId === userId);

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
          <Link href={`/books?bookId=${book.id}`}>
            <Button size="icon" variant="ghost" className="size-fit p-1">
              <BookOpen className="size-4" />
            </Button>
          </Link>
        )}

        {ownedBooks.every((b) => b.groupBookId !== groupBook.id) ? (
          <Button
            size="icon"
            variant="ghost"
            className="size-fit p-1"
            onClick={() => {
              setLoading(true);
              fetch(
                `/api/groups/${groupBook.groupId}/books/${groupBook.id}/own`,
                {
                  method: "POST",
                }
              ).then(() => {
                setLoading(false);
                router.refresh();
              });
            }}
          >
            {loading ? (
              <Loader className="size-4 animate-spin" />
            ) : (
              <Plus className="size-4" />
            )}
          </Button>
        ) : (
          <Button
            size="icon"
            variant="ghost"
            className="size-fit p-1"
            onClick={() => {
              setLoading(true);
              fetch(
                `/api/groups/${groupBook.groupId}/books/${groupBook.id}/own`,
                {
                  method: "DELETE",
                }
              ).then(() => {
                setLoading(false);
                router.refresh();
              });
            }}
          >
            {loading ? (
              <Loader className="size-4 animate-spin" />
            ) : (
              <Minus className="size-4" />
            )}
          </Button>
        )}
        <MoreActions book={groupBook} />
      </div>
    </div>
  );
}
