"use client"

import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { declOfNum } from "@/lib/utils"
import { Book } from "@prisma/client"
import { ChevronDown } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function UserBooks({ books }: { books: Book[] }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button size="sm">
          <ChevronDown className="mr-2 size-4 opacity-70" />
          {books.length} {declOfNum(books.length, ["книга", "книги", "книг"])}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="max-h-[50vh] overflow-auto max-sm:w-full sm:max-w-[50vw] md:max-w-[40vw] lg:max-w-[30vw] xl:max-w-[20vw]">
        <div className="flex flex-col gap-2">
          {books.map((book) => (
            <Link
              key={book.id}
              href={`/admin/books/${book.id}`}
              className="group flex flex-col gap-2 rounded-md border p-2 hover:bg-muted"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {book.coverUrl && (
                    <Image
                      src={book.coverUrl}
                      alt={book.title}
                      width={64}
                      height={64}
                      className="size-12 rounded-md"
                    />
                  )}
                  <div className="flex flex-col">
                    <h3 className="text-sm font-medium">{book.title}</h3>
                    <p className="text-xs text-muted-foreground">
                      {book.author}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  {book.pages} {declOfNum(book.pages, ["стр.", "стр.", "стр."])}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}
