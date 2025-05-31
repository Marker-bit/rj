"use client"

import { BookCollectionsModal } from "@/components/dialogs/collections/book-collections-modal"
import { BookInfoModal } from "@/components/dialogs/books/book-info-modal"
import { DateReadModal } from "@/components/dialogs/books/date-read-modal"
import { EditBookModal } from "@/components/dialogs/books/edit-book-modal"
import { DrawerDialog } from "@/components/ui/drawer-dialog"
import { Badge, IconBadge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { cn, dateToString, declOfNum } from "@/lib/utils"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { isSameDay } from "date-fns"
import {
  BookIcon,
  BookOpen,
  BookOpenCheck,
  BookOpenTextIcon,
  CalendarDays,
  Edit,
  Eye,
  EyeOff,
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
import { ShareBookModal } from "../dialogs/books/share-book-modal"
import { SimpleTooltip, Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip"
import Link from "next/link"
import { toast } from "sonner"
import { Loader } from "../ui/loader"
import { DateDoneModal } from "../dialogs/books/date-done-modal"
import { Book } from "@/lib/api-types"
import Palette from "./palette"
import { backgroundColors } from "@/lib/colors"
import { BackgroundColor } from "@prisma/client"

export const dynamic = "force-dynamic"

export function BookView({ book }: { book: Book }) {
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
      toast.success("Событие отменено")
      router.refresh()
      // router.push(`/books?bookId=${book.id}`)
      // router.refresh()
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
      toast.success("Книга отмечена как прочитанная")
      setDoneOpen(false)
      setActionsDrawerOpen(false)
      router.refresh()
      // router.push(`/books?bookId=${book.id}`)
      // router.refresh()
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
      setDateOpen(false)
      toast.success("Событие сохранено")
      setActionsDrawerOpen(false)
      router.refresh()
      // router.push(`/books?bookId=${book.id}`)
      // router.refresh()
    },
  })

  const deleteMutation = useMutation({
    mutationFn: () =>
      fetch(`/api/books/${book.id}/`, {
        method: "DELETE",
      }),
    onSuccess: () => {
      setDeleteDialogOpen(false)
      setActionsDrawerOpen(false)
      toast.success("Книга удалена")
      router.refresh()
    },
  })

  const hideMutation = useMutation({
    mutationFn: () => fetch(`/api/books/${book.id}/hide`, { method: "POST" }),
    onSuccess: () => {
      setActionsDrawerOpen(false)
      toast.success("Книга скрыта")
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

  const color =
    book.background !== BackgroundColor.NONE &&
    backgroundColors.find((bg) => bg.type === book.background)

  const fieldsData =
    typeof book.fields === "string"
      ? JSON.parse(book.fields)
      : Array.isArray(book.fields)
        ? book.fields
        : []

  return (
    <div
      className={cn(
        "group relative flex gap-2 rounded-md border p-2 transition-shadow hover:shadow-sm overflow-hidden",
        book.background !== BackgroundColor.NONE && "outline-solid outline-8 my-2",
        color && color.outline
      )}
      id={`book-${book.id}`}
    >
      <div className={cn("absolute left-0 top-0 -z-50 h-full", color ? color.background : "bg-neutral-100/50 dark:bg-neutral-900/50")} style={{ width: `${(lastEvent?.pagesRead || 0) / book.pages * 100}%` }} />
      {/* {book.background !== BackgroundColor.NONE && (
        <div
          className={cn("absolute left-0 top-0 h-full w-[2%] -z-10", color)}
        />
      )} */}

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
        book={book}
        lastEvent={lastEvent}
      />
      <DateDoneModal
        isOpen={doneOpen}
        setIsOpen={setDoneOpen}
        readDoneMutation={doneMutation}
        book={book}
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
          width={192}
          height={320}
          className="h-40 w-auto rounded-md"
        />
      )}
      <div className="flex flex-col">
        <div className="text-xl font-bold">{book.title}</div>
        <div className="text-sm">{book.author}</div>
        <div className="my-2 flex flex-wrap items-center gap-2">
          {book.readEvents.length === 0 ? (
            <>
              <IconBadge icon={CalendarDays}>Запланирована</IconBadge>
              <IconBadge variant="secondary" icon={BookOpen}>{book.pages} страниц всего</IconBadge>
            </>
          ) : lastEvent.pagesRead === book.pages ? (
            <>
              <IconBadge icon={BookOpenCheck}>Прочитана</IconBadge>
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
              <IconBadge variant="secondary" icon={BookOpen}>
                {book.pages} {declOfNum(book.pages, ["страница", "страницы", "страниц"])} всего
              </IconBadge>
              <IconBadge variant="outline" icon={CalendarDays}>{dateToString(new Date(lastEvent.readAt))}</IconBadge>
            </>
          ) : (
            <>
              <IconBadge icon={BookIcon}>Читается</IconBadge>
              <IconBadge variant="secondary" icon={BookOpen}>
                {lastEvent.pagesRead}/{book.pages}{" "}
                {declOfNum(book.pages, ["страницы", "страниц", "страниц"])} ({((lastEvent.pagesRead / book.pages) * 100).toFixed(1)}%)
              </IconBadge>
              <IconBadge variant="outline" icon={CalendarDays}>
                {dateToString(new Date(lastEvent.readAt))}
                <SimpleTooltip text="Отменить событие">
                  <button
                    onClick={() => undoEventMutation.mutate()}
                    disabled={undoEventMutation.isPending}
                    className="ml-1">
                    {undoEventMutation.isPending ? (
                      <Loader className="size-3" />
                    ) : (
                      <Undo className="size-3" />
                    )}
                  </button>
                </SimpleTooltip>
              </IconBadge>
            </>
          )}
          {book.groupBook && (
            <SimpleTooltip text="Группа, в которой находится книга">
              <Link href={`/groups/${book.groupBook.group.id}`}>
                <IconBadge variant="outline" icon={Users}>{book.groupBook.group.title}</IconBadge>
              </Link>
            </SimpleTooltip>
          )}

          {book.links.length !== 0 && (
            <IconBadge
              variant="outline"
              onClick={() => setShareBookOpen(true)}
              className="cursor-pointer" icon={Link2}
            >
              {book.links.length}{" "}
              {declOfNum(book.links.length, ["ссылка", "ссылки", "ссылок"])}
            </IconBadge>
          )}
        </div>
        <div className="flex flex-wrap gap-1">
          {book.collections.map((collection) => (
            <Badge key={collection.id} variant="outline">
              {collection.name}
            </Badge>
          ))}
          <SimpleTooltip text="Добавить в коллекцию">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCollectionsOpen(true)}
            >
              <Plus className="size-4" />
            </Button>
          </SimpleTooltip>
        </div>
        <div className="mt-1 flex flex-wrap gap-2">
          <Button
            className="gap-2"
            variant="outline"
            size="icon"
            onClick={() => setActionsDrawerOpen(true)}
          >
            <Info className="size-4" />
          </Button>
          {lastEvent?.pagesRead !== book.pages && (
            <>
              <Button
                className="gap-2"
                variant="outline"
                onClick={() => setDoneOpen(true)}
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
          )}
          <Button
            className="gap-2"
            variant="outline"
            onClick={() => setShareBookOpen(true)}
          >
            <Share className="size-4" />
            <div className="max-sm:hidden">Поделиться</div>
          </Button>
          {book.isHidden ? (
            <Button
              className="gap-2"
              variant="outline"
              onClick={() => hideMutation.mutate()}
              disabled={hideMutation.isPending}
            >
              {hideMutation.isPending ? (
                <Loader className="size-4" />
              ) : (
                <Eye className="size-4" />
              )}
              <div className="max-sm:hidden">Показать</div>
            </Button>
          ) : (
            <Button
              className="gap-2"
              variant="outline"
              onClick={() => hideMutation.mutate()}
              disabled={hideMutation.isPending}
            >
              {hideMutation.isPending ? (
                <Loader className="size-4" />
              ) : (
                <EyeOff className="size-4" />
              )}
              <div className="max-sm:hidden">Скрыть</div>
            </Button>
          )}
          <Palette background={book.background} bookId={book.id} />
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
          <pre className="relative line-clamp-2 block overflow-hidden text-ellipsis text-wrap font-sans text-muted-foreground">
            {book.description}
          </pre>
        )}
        {fieldsData && (
          <div className="grid w-fit grid-cols-2 space-x-4">
            {fieldsData.map((field: { title: string; value: string }) => (
              <>
                <div className="text-end font-bold text-muted-foreground">
                  {field.title}:
                </div>
                <div>{field.value}</div>
              </>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
