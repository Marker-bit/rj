"use client"

import { Button } from "@/components/ui/button"
import { Book, Group, GroupBook } from "@prisma/client"
import { BookOpen, Minus, Plus } from "lucide-react"
import { Loader } from "@/components/ui/loader"
import Image from "next/image"
import { MoreActions } from "./more-actions"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { declOfNum } from "@/lib/utils"
import Link from "next/link"
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip"
import RemoveBookDialog from "./remove-book-dialog"
import { toast } from "sonner"

export function GroupBookView({
  groupBook,
  userId,
}: {
  groupBook: GroupBook & {
    group: Group
    book: (Book & { readEvents: { pagesRead: number }[] })[]
  }
  userId: string
}) {
  const [loading, setLoading] = useState(false)
  const [removeDialogOpen, setRemoveDialogOpen] = useState(false)
  const router = useRouter()

  const book = groupBook.book.find((b) => b.userId === userId)

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
          <Tooltip>
            <TooltipTrigger asChild>
              <Link href={`/books?bookId=${book.id}`}>
                <Button size="icon" variant="ghost" className="size-fit p-1">
                  <BookOpen className="size-4" />
                </Button>
              </Link>
            </TooltipTrigger>
            <TooltipContent>Показать книгу</TooltipContent>
          </Tooltip>
        )}

        {!book ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                className="size-fit p-1"
                onClick={() => {
                  setLoading(true)
                  fetch(
                    `/api/groups/${groupBook.groupId}/books/${groupBook.id}/own`,
                    {
                      method: "POST",
                    }
                  )
                    .then((res) => res.json())
                    .then((res) => {
                      setLoading(false)
                      router.refresh()
                      toast("Книга добавлена", {
                        description: "Теперь вы можете читать ее",
                        action: {
                          onClick: () => {
                            router.push(`/books?bookId=${res.id}`)
                          },
                          label: "Перейти",
                        },
                      })
                    })
                }}
              >
                {loading ? (
                  <Loader className="size-4" />
                ) : (
                  <Plus className="size-4" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>Добавить себе книгу</TooltipContent>
          </Tooltip>
        ) : (
          <>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  variant="ghost"
                  className="size-fit p-1"
                  onClick={() => {
                    if (book.readEvents.length === 0) {
                      setLoading(true)
                      fetch(
                        `/api/groups/${groupBook.groupId}/books/${groupBook.id}/own`,
                        {
                          method: "DELETE",
                        }
                      ).then(() => {
                        setLoading(false)
                        router.refresh()
                      })
                    } else {
                      setRemoveDialogOpen(true)
                    }
                  }}
                >
                  {loading ? (
                    <Loader className="size-4" />
                  ) : (
                    <Minus className="size-4" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>Удалить у себя книгу</TooltipContent>
            </Tooltip>
            <RemoveBookDialog
              open={removeDialogOpen}
              setOpen={setRemoveDialogOpen}
              groupBook={groupBook}
              book={book}
            />
          </>
        )}
        <MoreActions book={groupBook} />
      </div>
    </div>
  )
}
