"use client"

import { Button } from "@/components/ui/button"
import { SimpleTooltip } from "@/components/ui/tooltip"
import { dateToString } from "@/lib/utils"
import { Book } from "@prisma/client"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { BookOpen, BookOpenCheck, Loader, Undo } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export function EventView({
  event,
}: {
  event: {
    id: string
    bookId: string
    book: Book
    pagesRead: number
    readAt: string | Date
  }
}) {
  const queryClient = useQueryClient()
  const router = useRouter()
  const undoMutation = useMutation({
    mutationFn: async () =>
      await fetch(`/api/journal/events/${event.id}`, {
        method: "DELETE",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["events"],
      })
      queryClient.invalidateQueries({
        queryKey: ["books"],
      })
      router.refresh()
    },
  })
  return (
    <div className="flex cursor-default flex-wrap items-center gap-1 rounded-xl border p-2">
      {event.pagesRead === event.book.pages ? (
        <>
          <BookOpenCheck className="mr-1 size-4 text-green-500" />
          <Link href={`/books#book-${event.bookId}`} className="font-semibold">
            Книга &quot;{event.book.title}&quot; автора {event.book.author}
          </Link>
          прочитана {dateToString(new Date(event.readAt))}
        </>
      ) : (
        <>
          <BookOpen className="mr-1 size-4" />
          До {event.pagesRead} страницы прочитано{" "}
          {dateToString(new Date(event.readAt))}
          <Link href={`/books#book-${event.bookId}`} className="font-semibold">
            в книге &quot;{event.book.title}&quot; автора {event.book.author}
          </Link>
        </>
      )}
      <SimpleTooltip text="Отменить">
        <Button
          variant="outline"
          size="icon"
          className="ml-auto"
          disabled={undoMutation.isPending}
          onClick={() => undoMutation.mutate()}
        >
          {undoMutation.isPending ? (
            <Loader className="size-4 animate-spin" />
          ) : (
            <Undo className="size-4" />
          )}
        </Button>
      </SimpleTooltip>
    </div>
  )
}
