"use client";

import { AddFromMyBooks } from "@/components/book/add-from-my-books";
import { GroupBookForm } from "@/components/book/group-book-form";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Book, BookCopy, BookDashed, Plus } from "lucide-react";
import { useState } from "react";

export function AddBookButton({ groupId }: { groupId: string }) {
  const [modeOpen, setModeOpen] = useState<"create" | "add-own">();

  return (
    <>
      <GroupBookForm
        open={modeOpen === "create"}
        setOpen={(b) => setModeOpen(b ? "create" : undefined)}
        groupId={groupId}
      />
      <AddFromMyBooks
        open={modeOpen === "add-own"}
        setOpen={(b) => setModeOpen(b ? "add-own" : undefined)}
        groupId={groupId}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="icon" variant="ghost" className="size-fit p-1">
            <Plus className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => setModeOpen("create")}>
            <Book />
            Добавить книгу
          </DropdownMenuItem>
          <DropdownMenuItem disabled>
            <BookCopy />
            Добавить из коллекции
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
