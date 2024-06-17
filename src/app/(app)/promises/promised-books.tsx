"use client"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn, declOfNum } from "@/lib/utils"
import { Book } from "@prisma/client"
import { AnimatePresence, motion } from "framer-motion"
import { BookCheck, ChevronDown } from "lucide-react"
import Image from "next/image"
import { useState } from "react"

export default function PromisedBooks({ books }: { books: Book[] }) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <div className="flex items-center gap-2 font-bold">
        <BookCheck className="size-4" />
        Прочитать {books.length}{" "}
        {declOfNum(books.length, ["книгу", "книги", "книг"])}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="size-fit p-1">
              <ChevronDown className="size-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent
            align="start"
            className="flex w-[300px] flex-col gap-2 p-4"
          >
            {books.map((book) => (
              <div key={book.id} className="flex gap-2">
                {book.coverUrl && (
                  <Image
                    src={book.coverUrl}
                    alt="book"
                    width={40}
                    height={40}
                    className="h-10 w-auto rounded-md"
                  />
                )}
                <div className="flex flex-col">
                  <div className="font-bold">{book.title}</div>
                  <div className="text-sm text-zinc-500">{book.author}</div>
                </div>
              </div>
            ))}
          </PopoverContent>
        </Popover>
      </div>
    </>
  )
}
