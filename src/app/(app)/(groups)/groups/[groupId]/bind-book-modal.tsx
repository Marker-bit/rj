"use client"

import { DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { DrawerDialog } from "@/components/ui/drawer-dialog"
import { getBooks } from "@/lib/actions/books"
import { Book, Group, GroupBook } from "@prisma/client"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "sonner"

export default function BindBookModal({
  open,
  setOpen,
  groupBook,
}: {
  open: boolean
  setOpen: (b: boolean) => void
  groupBook: GroupBook & { group: Group }
}) {
  const router = useRouter()
  const [loading, setLoading] = useState<string>()
  const [books, setBooks] = useState<Book[]>()

  useEffect(() => {
    const updateBooks = async () => {
      const books = await getBooks()
      setBooks(books)
    }

    updateBooks()
  }, [])

  const bindBook = async (bookId: string) => {
    setLoading(bookId)
    const resp = await fetch(
      `/api/groups/${groupBook.group.id}/books/${groupBook.id}/bind-book`,
      {
        method: "POST",
        body: JSON.stringify({ bookId }),
      }
    )
    const data = await resp.json()
    if (data.error) {
      toast.error(data.error)
    } else {
      toast.success("Книга связана")
    }
    setLoading(undefined)
    setOpen(false)
    router.refresh()
  }

  return (
    <DrawerDialog open={open} onOpenChange={setOpen} className="min-w-[50vw]">
      <DialogHeader>
        <DialogTitle>Связать с книгой</DialogTitle>
      </DialogHeader>
      {books === undefined ? (
        <div>Загрузка...</div>
      ) : (
        <div className="flex flex-col gap-4">
          {books.map((book) => (
            <button
              className="flex flex-col gap-1"
              onClick={() => bindBook(book.id)}
              key={book.id}
            >
              <div className="font-bold">{book.title}</div>
              <div className="text-xs">{book.author}</div>
              {loading === book.id && (
                <div className="text-xs">Подождите...</div>
              )}
            </button>
          ))}
        </div>
      )}
    </DrawerDialog>
  )
}
