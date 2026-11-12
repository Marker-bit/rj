"use client";

import { Book, BookDashed, Plus } from "lucide-react";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { AddFromMyBooks } from "@/components/book/add-from-my-books";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const GroupBookForm = dynamic(
  () =>
    import("@/components/book/group-book-form").then(
      (mod) => mod.GroupBookForm,
    ),
  { ssr: false },
);

export function AddBookButton({ groupId }: { groupId: string }) {
  const [modeOpen, setModeOpen] = useState<"create" | "add-own">();
  const [createMounted, setCreateMounted] = useState(false);

  useEffect(() => {
    if (modeOpen === "create") {
      setCreateMounted(true);
    }
  }, [modeOpen]);

  return (
    <>
      {createMounted && (
        <GroupBookForm
          open={modeOpen === "create"}
          setOpen={(b) => setModeOpen(b ? "create" : undefined)}
          groupId={groupId}
        />
      )}
      <AddFromMyBooks
        open={modeOpen === "add-own"}
        setOpen={(b) => setModeOpen(b ? "add-own" : undefined)}
        groupId={groupId}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            aria-label="Добавить книгу в группу"
            size="icon"
            variant="ghost"
            className="size-fit p-1"
          >
            <Plus className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => setModeOpen("create")}>
            <Book />
            Добавить книгу
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setModeOpen("add-own")}>
            <BookDashed />
            Добавить из моих книг
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
