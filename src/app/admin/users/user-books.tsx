"use client";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { declOfNum } from "@/lib/utils";
import { Book } from "@prisma/client";
import { ChevronDown } from "lucide-react";
import AdminBookView from "./admin-book-view";

export default function UserBooks({ books }: { books: Book[] }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button size="sm">
          <ChevronDown />
          {books.length} {declOfNum(books.length, ["книга", "книги", "книг"])}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="max-h-[50vh] overflow-auto max-sm:w-full sm:max-w-[50vw] md:max-w-[40vw] lg:max-w-[30vw] xl:max-w-[20vw]">
        <div className="flex flex-col gap-2">
          {books.map((book) => (
            <AdminBookView book={book} key={book.id} />
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
