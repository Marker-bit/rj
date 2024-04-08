"use client";

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
  const [open, setOpen] = useState(false);

  return (
    <>
      <GroupBookForm open={open} setOpen={setOpen} groupId={groupId} />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            size="icon"
            variant="ghost"
            className="ml-auto p-1 h-fit w-fit"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => setOpen(true)}>
            <Book className="w-4 h-4 mr-2" />
            Добавить книгу
          </DropdownMenuItem>
          <DropdownMenuItem disabled>
            <BookCopy className="w-4 h-4 mr-2" />
            Добавить из коллекции
          </DropdownMenuItem>
          <DropdownMenuItem disabled>
            <BookDashed className="w-4 h-4 mr-2" />
            Добавить из моих книг
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
