"use client"

import { Button } from "@/components/ui/button"
import { DrawerDialog } from "@/components/ui/drawer-dialog"
import { FormControl } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn, declOfNum } from "@/lib/utils"
import { Book } from "@prisma/client"
import { BookPlusIcon, Check } from "lucide-react"
import { useState } from "react"
import { ControllerRenderProps } from "react-hook-form"

export default function BooksSelect({
  field,
  books,
}: {
  field: ControllerRenderProps<
    {
      dueDate: Date
      mode: "FULL_BOOKS" | "READ_PAGES" | "STREAK"
      pagesCount?: number | undefined
      streakPages?: number | undefined
      books?: string[] | undefined
    },
    "books"
  >
  books: Book[]
}) {
  const [searchText, setSearchText] = useState("")
  const [open, setOpen] = useState(false)

  return (
    <>
      <FormControl>
        <Button
          type="button"
          variant="outline"
          className={cn(
            "w-[240px] pl-3 text-left font-normal",
            !field.value && "text-muted-foreground"
          )}
          onClick={() => setOpen(true)}
        >
          {field.value ? (
            <span>
              {field.value.length}{" "}
              {declOfNum(field.value.length, ["книга", "книги", "книг"])}
            </span>
          ) : (
            <span>Выберите книги</span>
          )}
          <BookPlusIcon className="ml-auto size-4 opacity-50" />
        </Button>
      </FormControl>
      <DrawerDialog
        className="flex w-[50vw] flex-col"
        onClose={() => setSearchText("")}
        open={open}
        onOpenChange={setOpen}
      >
        <Input
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="mb-2"
        />
        {books.map((book) => (
          <button
            key={book.id}
            onClick={() =>
              field.value?.includes(book.id)
                ? field.onChange(field.value?.filter((id) => id !== book.id))
                : field.onChange([...(field.value || []), book.id])
            }
            className="flex w-full border-b border-zinc-200 p-2 dark:border-zinc-800"
          >
            <div className="flex flex-col items-start">
              {book.title && <span>{book.title}</span>}
              {book.author && (
                <span className="text-sm text-muted-foreground">
                  {book.author}
                </span>
              )}
            </div>
            {field.value?.includes(book.id) && <Check className="ml-auto" />}
          </button>
        ))}
      </DrawerDialog>
    </>
  )
}
