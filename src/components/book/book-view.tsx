"use client";

import { BackgroundColor } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import { endOfDay, isToday } from "date-fns";
import {
  BarChart,
  BookIcon,
  BookOpen,
  BookOpenCheck,
  BookOpenTextIcon,
  CalendarDays,
  Edit,
  Eye,
  EyeOff,
  Info,
  Layers2Icon,
  Link2,
  Share,
  Trash,
  Undo,
  Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import posthog from "posthog-js";
import { useState } from "react";
import { toast } from "sonner";
import { BookInfoModal } from "@/components/dialogs/books/book-info-modal";
import { EditBookModal } from "@/components/dialogs/books/edit-book-modal";
import { DateReadModal } from "@/components/dialogs/books/read/date-read-modal";
import { BookCollectionsModal } from "@/components/dialogs/collections/book-collections-modal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DrawerDialog } from "@/components/ui/drawer-dialog";
import { IconBadge } from "@/components/ui/icon-badge";
import { SimpleTooltip } from "@/components/ui/simple-tooltip";
import type { Book } from "@/lib/api-types";
import { backgroundColors } from "@/lib/colors";
import { cn, dateToString, declOfNum } from "@/lib/utils";
import { DateDoneModal } from "../dialogs/books/read/date-done-modal";
import { ShareBookModal } from "../dialogs/books/share-book-modal";
import { HelpButton } from "../ui/help-button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../ui/hover-card";
import { Loader } from "../ui/loader";
import BookReadInfo from "./book-read-info";
import Palette from "./palette";

export const dynamic = "force-dynamic";

export function BookView({
  book,
  onUpdate,
  history = false,
  initialReadOpen = false,
}: {
  book: Book;
  onUpdate?: () => void;
  history?: boolean;
  initialReadOpen?: boolean;
}) {
  const [editOpen, setEditOpen] = useState(false);
  const [dateOpen, setDateOpen] = useState(false);
  const [doneOpen, setDoneOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [actionsDrawerOpen, setActionsDrawerOpen] = useState(false);
  const [descriptionDrawerOpen, setDescriptionDrawerOpen] = useState(false);
  const [collectionsOpen, setCollectionsOpen] = useState(false);
  const [shareBookOpen, setShareBookOpen] = useState(false);
  const [bookReadOpen, setBookReadOpen] = useState(initialReadOpen);
  const router = useRouter();

  const undoEventMutation = useMutation({
    mutationFn: () =>
      fetch(`/api/books/${book.id}/undo`, {
        method: "DELETE",
      }),
    onSuccess: () => {
      toast.success("Событие отменено");
      onUpdate?.();
      router.refresh();
      // router.push(`/books?bookId=${book.id}`)
      // router.refresh()
    },
  });

  const doneMutation = useMutation({
    mutationFn: async ({ readAt }: { readAt?: Date }) => {
      await fetch(`/api/books/${book.id}/read/`, {
        method: "POST",
        body: JSON.stringify({
          pages: book.pages,
          readAt: readAt
            ? isToday(readAt)
              ? new Date()
              : endOfDay(readAt)
            : new Date(),
        }),
      });
    },
    onSuccess: () => {
      toast.success("Книга отмечена как прочитанная");
      setDoneOpen(false);
      setActionsDrawerOpen(false);
      onUpdate?.();
      router.refresh();
      router.push(`/books/history?bookReadId=${book.id}`);
      // router.refresh()
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () =>
      fetch(`/api/books/${book.id}/`, {
        method: "DELETE",
      }),
    onSuccess: () => {
      setDeleteDialogOpen(false);
      setActionsDrawerOpen(false);
      toast.success("Книга удалена");
      onUpdate?.();
      router.refresh();
    },
  });

  const hideMutation = useMutation({
    mutationFn: () => fetch(`/api/books/${book.id}/hide`, { method: "POST" }),
    onSuccess: () => {
      setActionsDrawerOpen(false);
      toast.success("Книга скрыта");
      onUpdate?.();
      router.refresh();
    },
  });

  const lastEvent = book.readEvents[0];

  const color =
    book.background !== BackgroundColor.NONE
      ? backgroundColors.find((bg) => bg.type === book.background)
      : null;

  const fieldsData =
    typeof book.fields === "string"
      ? JSON.parse(book.fields)
      : Array.isArray(book.fields)
        ? book.fields
        : [];

  return (
    <>
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
      <div
        className={cn(
          "group relative flex flex-col gap-2 overflow-hidden rounded-md border p-2 transition-shadow hover:shadow-sm",
          book.background !== BackgroundColor.NONE &&
            "my-2 outline-8 outline-solid",
          color?.outline,
        )}
        id={`book-${book.id}`}
      >
        <div
          className={cn(
            "absolute top-0 left-0 -z-50 h-full",
            color
              ? color.background
              : "bg-neutral-100/50 dark:bg-neutral-900/50",
          )}
          style={{
            width: `${((lastEvent?.pagesRead || 0) / book.pages) * 100}%`,
          }}
        />
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
          <pre className="font-sans">{book.description}</pre>
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
          onSuccess={() => {
            setActionsDrawerOpen(false);
            onUpdate?.();
            router.refresh();
          }}
          book={book}
          lastEvent={lastEvent}
        />
        <DateDoneModal
          isOpen={doneOpen}
          setIsOpen={setDoneOpen}
          readDoneMutation={doneMutation}
          book={book}
        />
        <EditBookModal
          open={editOpen}
          setOpen={setEditOpen}
          book={book}
          onUpdate={(newBook) => {
            posthog.capture("edited_book", {
              title: newBook.title,
              author: newBook.author,
              oldTitle: book.title,
              oldAuthor: book.author,
            });
            onUpdate?.();
          }}
        />
        <BookReadInfo
          open={bookReadOpen}
          setOpen={setBookReadOpen}
          book={book}
        />
        <div className="flex items-start gap-2">
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
                  <IconBadge variant="secondary" icon={BookOpen}>
                    {book.pages} страниц всего
                  </IconBadge>
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
                    {book.pages}{" "}
                    {declOfNum(book.pages, ["страница", "страницы", "страниц"])}{" "}
                    всего
                  </IconBadge>
                  <IconBadge variant="outline" icon={CalendarDays}>
                    {dateToString(new Date(lastEvent.readAt))}
                  </IconBadge>
                </>
              ) : (
                <>
                  <IconBadge icon={BookIcon}>Читается</IconBadge>
                  <IconBadge variant="secondary" icon={BookOpen}>
                    {lastEvent.pagesRead}/{book.pages}{" "}
                    {declOfNum(book.pages, ["страницы", "страниц", "страниц"])}{" "}
                    ({((lastEvent.pagesRead / book.pages) * 100).toFixed(1)}%)
                  </IconBadge>
                  <IconBadge variant="outline" icon={CalendarDays}>
                    {dateToString(new Date(lastEvent.readAt))}
                    <SimpleTooltip text="Отменить событие">
                      <button
                        onClick={() => undoEventMutation.mutate()}
                        disabled={undoEventMutation.isPending}
                        className="ml-1"
                      >
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
                    <IconBadge variant="outline" icon={Users}>
                      {book.groupBook.group.title}
                    </IconBadge>
                  </Link>
                </SimpleTooltip>
              )}

              {book.links.length !== 0 && (
                <IconBadge
                  variant="outline"
                  onClick={() => setShareBookOpen(true)}
                  className="cursor-pointer"
                  icon={Link2}
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
                  <Layers2Icon className="size-4" />
                </Button>
              </SimpleTooltip>
            </div>
          </div>
        </div>
        <div className="mt-1 flex flex-wrap gap-2">
          <HelpButton
            className="gap-2"
            variant="outline"
            size="icon"
            onClick={() => setActionsDrawerOpen(true)}
            helpText="Больше информации об этой книге"
          >
            <Info className="size-4" />
          </HelpButton>
          {lastEvent?.pagesRead !== book.pages && (
            <>
              <HelpButton
                className="gap-2"
                variant="outline"
                onClick={() => setDoneOpen(true)}
                helpText="Отметить книгу прочитанной в определённую дату"
              >
                <BookOpenCheck className="size-4" />
                <div className="max-sm:hidden">Прочитана</div>
              </HelpButton>
              <HelpButton
                className="gap-2"
                variant="outline"
                onClick={() => setDateOpen(true)}
                helpText="Отметить прочтение определённого количества страниц книги в некоторую дату"
              >
                <BookOpenTextIcon className="size-4" />
                <div className="max-sm:hidden">Отметить прочтение</div>
              </HelpButton>
            </>
          )}
          <HelpButton
            className="gap-2"
            variant="outline"
            onClick={() => setShareBookOpen(true)}
            helpText="Создайте ссылки на книгу, чтобы другие могли скопировать её себе"
          >
            <Share className="size-4" />
            <div className="max-sm:hidden">Поделиться</div>
          </HelpButton>
          {history && (
            <HelpButton
              className="gap-2"
              variant="outline"
              onClick={() => setBookReadOpen(true)}
              helpText="Создайте ссылки на книгу, чтобы другие могли скопировать её себе"
            >
              <BarChart className="size-4" />
              <div className="max-sm:hidden">Статистика</div>
            </HelpButton>
          )}{" "}
          {!history &&
            (book.isHidden ? (
              <HelpButton
                className="gap-2"
                variant="outline"
                onClick={() => hideMutation.mutate()}
                disabled={hideMutation.isPending}
                helpText="Переместить эту книгу в обычный список книг"
              >
                {hideMutation.isPending ? (
                  <Loader className="size-4" />
                ) : (
                  <Eye className="size-4" />
                )}
                <div className="max-sm:hidden">Показать</div>
              </HelpButton>
            ) : (
              <HelpButton
                className="gap-2"
                variant="outline"
                onClick={() => hideMutation.mutate()}
                disabled={hideMutation.isPending}
                helpText="Переместить эту книгу в самый низ, например, чтобы отложить её чтение на будущее"
              >
                {hideMutation.isPending ? (
                  <Loader className="size-4" />
                ) : (
                  <EyeOff className="size-4" />
                )}
                <div className="max-sm:hidden">Скрыть</div>
              </HelpButton>
            ))}
          <Palette background={book.background} bookId={book.id} />
          <div className="absolute top-0 right-0 m-2 flex scale-0 gap-2 opacity-0 transition-all group-hover:scale-100 group-hover:opacity-100">
            <SimpleTooltip text="Отредактировать книгу">
              <Button
                size="icon"
                variant="outline"
                className="size-fit p-1"
                onClick={() => setEditOpen(true)}
              >
                <Edit className="size-4" />
              </Button>
            </SimpleTooltip>
            <SimpleTooltip text="Удалить книгу">
              <Button
                size="icon"
                variant="outline"
                className="size-fit p-1"
                onClick={() => setDeleteDialogOpen(true)}
              >
                <Trash className="size-4" />
              </Button>
            </SimpleTooltip>
          </div>
        </div>
        {book.description && (
          <pre className="text-muted-foreground relative line-clamp-2 font-sans text-wrap text-ellipsis">
            {book.description}
          </pre>
        )}
        {fieldsData && (
          <div className="grid grid-cols-3 gap-2 w-full md:w-1/2">
            {fieldsData.map((field: { title: string; value: string }) => (
              <HoverCard key={field.title + field.value}>
                <HoverCardTrigger>
                  <div className="flex flex-col gap-1 border rounded-md p-2">
                    <div className="text-muted-foreground text-sm truncate">
                      {field.title}
                    </div>
                    <div className="font-bold truncate">{field.value}</div>
                  </div>
                </HoverCardTrigger>
                <HoverCardContent className="max-w-160 w-fit min-w-80 max-h-[40vh] overflow-auto">
                  <div className="text-muted-foreground text-sm">
                    {field.title}
                  </div>
                  <div>{field.value}</div>
                </HoverCardContent>
              </HoverCard>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
