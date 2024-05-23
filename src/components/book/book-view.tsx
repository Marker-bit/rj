"use client"

import { BookCollectionsModal } from "@/components/dialogs/book-collections-modal"
import { BookInfoModal } from "@/components/dialogs/book-info-modal"
import { DateReadModal } from "@/components/dialogs/date-read-modal"
import { EditBookModal } from "@/components/dialogs/edit-book-modal"
import { DrawerDialog } from "@/components/drawer"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { dateToString, declOfNum } from "@/lib/utils"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { isSameDay } from "date-fns"
import {
  BookIcon,
  BookOpen,
  BookOpenCheck,
  BookOpenTextIcon,
  CalendarDays,
  Edit,
  Info,
  Link2,
  Plus,
  Share,
  Trash,
  Undo,
  Users,
} from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useMediaQuery } from "usehooks-ts"
import { ShareBookModal } from "../dialogs/share-book-modal"
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip"
import Link from "next/link"
import { toast } from "sonner"
import { Loader } from "../ui/loader"
import { DateDoneModal } from "../dialogs/date-done-modal"
import { Book } from "@/lib/api-types"

export const dynamic = "force-dynamic"

export function BookView({ book }: { book: Book }) {
  const queryClient = useQueryClient()
  const [editOpen, setEditOpen] = useState(false)
  const [dateOpen, setDateOpen] = useState(false)
  const [doneOpen, setDoneOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [actionsDrawerOpen, setActionsDrawerOpen] = useState(false)
  const [descriptionDrawerOpen, setDescriptionDrawerOpen] = useState(false)
  const [collectionsOpen, setCollectionsOpen] = useState(false)
  const [shareBookOpen, setShareBookOpen] = useState(false)
  const isMobile = useMediaQuery("(max-width: 768px)")
  const router = useRouter()

  const undoEventMutation = useMutation({
    mutationFn: () =>
      fetch(`/api/books/${book.id}/undo`, {
        method: "DELETE",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["books"],
      })
      queryClient.invalidateQueries({
        queryKey: ["events"],
      })
      toast.success("Событие отменено")
      router.refresh()
      router.push(`/books?bookId=${book.id}`)
      router.refresh()
    },
  })

  const doneMutation = useMutation({
    mutationFn: async ({ readAt }: { readAt?: Date }) => {
      await fetch(`/api/books/${book.id}/read/`, {
        method: "POST",
        body: JSON.stringify({
          pages: book.pages,
          readAt: readAt || new Date(),
        }),
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["books"],
      })
      queryClient.invalidateQueries({
        queryKey: ["events"],
      })
      toast.success("Книга отмечена как прочитанная")
      setDoneOpen(false)
      setActionsDrawerOpen(false)
      router.refresh()
      router.push(`/books?bookId=${book.id}`)
      router.refresh()
    },
  })

  const readDateMutation = useMutation({
    mutationFn: ({ date, pages }: { date: Date; pages: number }) =>
      fetch(`/api/books/${book.id}/read/`, {
        method: "POST",
        body: JSON.stringify({
          pages: pages,
          readAt: isSameDay(date, new Date()) ? new Date() : date,
        }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["books"],
      })
      queryClient.invalidateQueries({
        queryKey: ["events"],
      })
      setDateOpen(false)
      toast.success("Событие сохранено")
      setActionsDrawerOpen(false)
      router.refresh()
      router.push(`/books?bookId=${book.id}`)
      router.refresh()
    },
  })

  const deleteMutation = useMutation({
    mutationFn: () =>
      fetch(`/api/books/${book.id}/`, {
        method: "DELETE",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["books"],
      })
      queryClient.invalidateQueries({
        queryKey: ["events"],
      })
      setDeleteDialogOpen(false)
      setActionsDrawerOpen(false)
      toast.success("Книга удалена")
      router.refresh()
    },
  })

  const lastEvent = book.readEvents[0]

  // if (book.groupBook) {
  //   book = {
  //     ...book,
  //     groupBook: book.groupBook,
  //     groupBookId: book.groupBookId,
  //     title: book.groupBook.title,
  //     author: book.groupBook.author,
  //     pages: book.groupBook.pages,
  //     coverUrl: book.groupBook.coverUrl,
  //   }
  // }

  return (
    <div
      className="group relative flex gap-2 rounded-md border p-2 transition-shadow hover:shadow"
      id={`book-${book.id}`}
    >
      <DrawerDialog
        open={descriptionDrawerOpen}
        onOpenChange={setDescriptionDrawerOpen}
      >
        <DialogHeader>
          <DialogTitle>Описание</DialogTitle>
        </DialogHeader>
        <pre className="relative mt-2 block cursor-pointer overflow-hidden text-wrap font-sans">
          {book.description}
        </pre>
      </DrawerDialog>
      <BookInfoModal
        open={actionsDrawerOpen}
        setOpen={setActionsDrawerOpen}
        book={book}
        setDescriptionDrawerOpen={setDescriptionDrawerOpen}
        setEditOpen={setEditOpen}
        setDeleteDialogOpen={setDeleteDialogOpen}
        setDateOpen={setDateOpen}
        setCollectionsOpen={setCollectionsOpen}
        setDoneOpen={setDoneOpen}
        setShareOpen={setShareBookOpen}
      />
      <BookCollectionsModal
        open={collectionsOpen}
        setOpen={setCollectionsOpen}
        book={book}
      />
      <ShareBookModal
        open={shareBookOpen}
        setOpen={setShareBookOpen}
        book={book}
      />
      <DateReadModal
        isOpen={dateOpen}
        setIsOpen={setDateOpen}
        readDateMutation={readDateMutation}
      />
      <DateDoneModal
        isOpen={doneOpen}
        setIsOpen={setDoneOpen}
        readDoneMutation={doneMutation}
      />
      <DrawerDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogHeader>
          <DialogTitle>Вы уверены?</DialogTitle>
          <DialogDescription>
            Вы удалите книгу &quot;{book.title}&quot; без возможности возврата.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-2 flex gap-2 max-sm:flex-col md:ml-auto md:w-fit">
          <Button onClick={() => setDeleteDialogOpen(false)} variant="outline">
            Отмена
          </Button>

          <Button
            variant="destructive"
            onClick={() => deleteMutation.mutate()}
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending && (
              <Loader white className="mr-2 size-4" />
            )}
            Удалить
          </Button>
        </div>
      </DrawerDialog>
      <EditBookModal open={editOpen} setOpen={setEditOpen} book={book} />
      {book.coverUrl && (
        <Image
          src={book.coverUrl}
          alt="book"
          width={500}
          height={500}
          className="h-40 w-auto rounded-md"
        />
      )}
      <div className="flex flex-col">
        <div className="text-xl font-bold">{book.title}</div>
        <div className="text-sm">{book.author}</div>
        <div className="my-2 flex flex-wrap items-center gap-2">
          {book.readEvents.length === 0 ? (
            <>
              <Badge>
                <CalendarDays className="mr-2 size-4" /> Запланирована
              </Badge>
              <Badge variant="secondary">
                <BookOpen className="mr-2 size-4" /> {book.pages} страниц всего
              </Badge>
            </>
          ) : lastEvent.pagesRead === book.pages ? (
            <>
              <Badge>
                <BookOpenCheck className="mr-2 size-4" /> Прочитана
              </Badge>
              <Button
                variant="outline"
                size="icon"
                onClick={() => undoEventMutation.mutate()}
                disabled={undoEventMutation.isPending}
                className="size-fit p-1"
              >
                {undoEventMutation.isPending ? (
                  <Loader className="size-4" />
                ) : (
                  <Undo className="size-4" />
                )}
              </Button>
              <Badge variant="secondary">
                <BookOpen className="mr-2 size-4" /> {book.pages}{" "}
                {declOfNum(book.pages, ["страница", "страницы", "страниц"])}{" "}
                всего
              </Badge>
              <Badge variant="outline">
                <CalendarDays className="mr-2 size-4" />
                {dateToString(new Date(lastEvent.readAt))}
              </Badge>
            </>
          ) : (
            <>
              <Badge>
                <BookIcon className="mr-2 size-4" /> Читается
              </Badge>
              <Badge variant="secondary">
                <BookOpen className="mr-2 size-4" /> {lastEvent.pagesRead}{" "}
                {declOfNum(lastEvent.pagesRead, [
                  "страница",
                  "страницы",
                  "страниц",
                ])}{" "}
                из {book.pages}{" "}
                {declOfNum(book.pages, ["страницы", "страниц", "страниц"])} (
                {((lastEvent.pagesRead / book.pages) * 100).toFixed(1)}%)
              </Badge>
              <Badge variant="outline">
                <CalendarDays className="mr-2 size-4" />
                {dateToString(new Date(lastEvent.readAt))}
              </Badge>
              <Button
                variant="outline"
                size="icon"
                onClick={() => undoEventMutation.mutate()}
                disabled={undoEventMutation.isPending}
                className="size-fit p-1"
              >
                {undoEventMutation.isPending ? (
                  <Loader className="size-4" />
                ) : (
                  <Undo className="size-4" />
                )}
              </Button>
            </>
          )}
          {book.groupBook && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Link href={`/groups/${book.groupBook.group.id}`}>
                  <Badge variant="outline">
                    <Users className="mr-2 size-4" />{" "}
                    {book.groupBook.group.title}
                  </Badge>
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p>Группа</p>
              </TooltipContent>
            </Tooltip>
          )}

          {book.links.length !== 0 && (
            <Badge
              variant="outline"
              onClick={() => setShareBookOpen(true)}
              className="cursor-pointer"
            >
              <Link2 className="mr-2 size-4" /> {book.links.length}{" "}
              {declOfNum(book.links.length, ["ссылка", "ссылки", "ссылок"])}
            </Badge>
          )}
        </div>
        <div className="flex flex-wrap gap-1">
          {book.collections.map((collection: any) => (
            <Badge key={collection.id} variant="outline">
              {collection.name}
            </Badge>
          ))}
          <Button
            variant="outline"
            size="icon"
            className="size-fit rounded-full p-1"
            onClick={() => setCollectionsOpen(true)}
          >
            <Plus className="size-4" />
          </Button>
        </div>
        <div className="mt-1 flex flex-wrap gap-2">
          <Button
            className="gap-2"
            variant="outline"
            onClick={() => setActionsDrawerOpen(true)}
          >
            <Info className="size-4" />
          </Button>
          {!(lastEvent?.pagesRead === book.pages) && (
            <>
              <>
                <Button
                  className="gap-2"
                  variant="outline"
                  onClick={() => setDoneOpen(true)}
                  // disabled={doneMutation.isPending}
                >
                  <BookOpenCheck className="size-4" />
                  <div className="max-sm:hidden">Прочитана</div>
                </Button>
                <Button
                  className="gap-2"
                  variant="outline"
                  onClick={() => setDateOpen(true)}
                >
                  <BookOpenTextIcon className="size-4" />
                  <div className="max-sm:hidden">Отметить прочтение</div>
                </Button>
              </>
            </>
          )}
          <Button
            className="gap-2"
            variant="outline"
            onClick={() => setShareBookOpen(true)}
          >
            <Share className="size-4" />
            <div className="max-sm:hidden">Поделиться</div>
          </Button>
          <div className="absolute right-0 top-0 m-2 flex scale-0 gap-2 opacity-0 transition-all group-hover:scale-100 group-hover:opacity-100">
            <Button
              size="icon"
              variant="outline"
              className="size-fit p-1"
              onClick={() => setEditOpen(true)}
              // disabled={book.groupBookId !== null}
            >
              <Edit className="size-4" />
            </Button>
            <Button
              size="icon"
              variant="outline"
              className="size-fit p-1"
              onClick={() => setDeleteDialogOpen(true)}
            >
              <Trash className="size-4" />
            </Button>
          </div>
        </div>
        {book.description && (
          <pre className="relative block overflow-hidden text-wrap font-sans text-black/70">
            {isMobile
              ? book.description.split("\n").slice(0, 3).join("\n")
              : book.description}
            {book.description.split("\n").length > 3 && isMobile && "..."}
          </pre>
        )}
      </div>
    </div>
  )
}
