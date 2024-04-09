"use client";

import { Button } from "@/components/ui/button";
import { Group, GroupBook } from "@prisma/client";
import { Loader, Minus, Plus } from "lucide-react";
import Image from "next/image";
import { MoreActions } from "./more-actions";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function GroupBookView({
  groupBook,
  ownedBooks,
  isMember,
}: {
  groupBook: GroupBook & {
    group: Group
  };
  ownedBooks: any[];
  isMember: boolean;
}) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  return (
    <div
      key={groupBook.id}
      className="flex gap-2 items-center p-2 rounded-xl hover:bg-muted/10 transition-all"
    >
      {groupBook.coverUrl && (
        <Image
          src={groupBook.coverUrl}
          alt="book"
          width={500}
          height={500}
          className="rounded-md h-40 w-auto"
        />
      )}
      <div className="flex flex-col gap-1">
        <div className="text-xl font-bold">{groupBook.title}</div>
        <div className="text-zinc-500 -mt-1 text-sm">{groupBook.author}</div>
        <div className="text-zinc-500 -mt-1 text-sm">
          {groupBook.pages} стр.
        </div>
        <div className="text-zinc-500 -mt-1 text-sm">
          {groupBook.description}
        </div>
      </div>
      <div className="ml-auto flex gap-1">
        {ownedBooks.every((b) => b.groupBookId !== groupBook.id) ? (
          <Button
            size="icon"
            variant="ghost"
            className="p-1 h-fit w-fit"
            onClick={() => {
              setLoading(true);
              fetch(`/api/groups/${groupBook.groupId}/books/${groupBook.id}/own`, {
                method: "POST",
              }).then(() => {
                setLoading(false);
                router.refresh();
              });
            }}
          >
            {loading ? (
              <Loader className="w-4 h-4 animate-spin" />
            ) : (
              <Plus className="w-4 h-4" />
            )}
          </Button>
        ) : (
          <Button
            size="icon"
            variant="ghost"
            className="p-1 h-fit w-fit"
            onClick={() => {
              setLoading(true);
              fetch(`/api/groups/${groupBook.groupId}/books/${groupBook.id}/own`, {
                method: "DELETE",
              }).then(() => {
                setLoading(false);
                router.refresh();
              });
            }}
          >
            {loading ? (
              <Loader className="w-4 h-4 animate-spin" />
            ) : (
              <Minus className="w-4 h-4" />
            )}
          </Button>
        )}
        <MoreActions book={groupBook} />
      </div>
    </div>
  );
}
