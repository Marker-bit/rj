"use client";

import { Button } from "@/components/ui/button";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DrawerDialog } from "@/components/ui/drawer-dialog";
import { IconBadge } from "@/components/ui/icon-badge";
import { SimpleTooltip } from "@/components/ui/simple-tooltip";
import type { Book } from "@/lib/api-types";
import { backgroundColors } from "@/lib/colors";
import { dateToString } from "@/lib/date";
import { getReadingState } from "@/lib/reading-events";
import { cn, declOfNum } from "@/lib/utils";
import { BackgroundColor, BookStatus } from "@/generated/prisma/enums";
import {
  BarChart,
  BookIcon,
  BookOpen,
  BookOpenCheck,
  BookOpenTextIcon,
  CalendarDays,
  Edit,
  Info,
  Layers2Icon,
  Link2,
  Share,
  Trash,
  Users,
} from "lucide-react";
import nextDynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { capture } from "@/lib/posthog";
import { useEffect, useState } from "react";
import { HelpButton } from "../ui/help-button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../ui/hover-card";
import { HideBookButton } from "./buttons/hide-book";
import { UndoEventButton } from "./buttons/undo-event-button";
import Palette from "./palette";
import { ArchiveBookButton } from "./buttons/archive-book";

// Dialogs and panels are only mounted after they are opened for the first time,
// so heavy dependencies (charts, rich text editor, upload widget) stay out of
// the initial bundle for the books list.
const BookInfoModal = nextDynamic(
  () =>
    import("@/components/dialogs/books/book-info-modal").then(
      (mod) => mod.BookInfoModal,
    ),
  { ssr: false },
);
const EditBookModal = nextDynamic(
  () =>
    import("@/components/dialogs/books/edit-book-modal").then(
      (mod) => mod.EditBookModal,
    ),
  { ssr: false },
);
const DateReadModal = nextDynamic(
  () =>
    import("@/components/dialogs/books/read/date-read-modal").then(
      (mod) => mod.DateReadModal,
    ),
  { ssr: false },
);
const DateDoneModal = nextDynamic(
  () =>
    import("@/components/dialogs/books/read/date-done-modal").then(
      (mod) => mod.DateDoneModal,
    ),
  { ssr: false },
);
const BookCollectionsModal = nextDynamic(
  () =>
    import("@/components/dialogs/collections/book-collections-modal").then(
      (mod) => mod.BookCollectionsModal,
    ),
  { ssr: false },
);
const DeleteBookModal = nextDynamic(
  () =>
    import("@/components/dialogs/books/delete-book-modal").then(
      (mod) => mod.DeleteBookModal,
    ),
  { ssr: false },
);
const ShareBookModal = nextDynamic(
  () =>
    import("@/components/dialogs/books/share-book-modal").then(
      (mod) => mod.ShareBookModal,
    ),
  { ssr: false },
);
const BookReadInfo = nextDynamic(() => import("./book-read-info"), {
  ssr: false,
});
import { revalidate } from "@/lib/actions/revalidate";

export const dynamic = "force-dynamic";

export type BookDialog =
  | "info"
  | "description"
  | "edit"
  | "delete"
  | "read"
  | "done"
  | "collections"
  | "share"
  | "stats";

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
  const [activeDialog, setActiveDialog] = useState<BookDialog | null>(
    initialReadOpen ? "stats" : null,
  );
  const [mountedDialogs, setMountedDialogs] = useState<Set<BookDialog>>(
    () => new Set(initialReadOpen ? (["stats"] as const) : []),
  );
  const router = useRouter();

  useEffect(() => {
    if (!activeDialog) {
      return;
    }

    setMountedDialogs((previous) => {
      if (previous.has(activeDialog)) {
        return previous;
      }

      const next = new Set(previous);
      next.add(activeDialog);
      return next;
    });
  }, [activeDialog]);

  const reading = getReadingState(book.readEvents);
  const latestEvent = reading.latest;
  const progressPages = reading.progressPages;

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

  const genSetOpen = (dialog: BookDialog | null) => (open: boolean) =>
    setActiveDialog(open ? dialog : null);

  return (
    <>
      {mountedDialogs.has("delete") && (
        <DeleteBookModal
          book={book}
          open={activeDialog === "delete"}
          onOpenChange={genSetOpen("delete")}
          onSuccess={() => {
            setActiveDialog(null);
            onUpdate?.();
            void revalidate("books");
          }}
        />
      )}
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
            width: `${(progressPages / book.pages) * 100}%`,
          }}
        />

        <DrawerDialog
          open={activeDialog === "description"}
          onOpenChange={(dialog) =>
            setActiveDialog(dialog ? "description" : null)
          }
        >
          <DialogHeader>
            <DialogTitle>Описание</DialogTitle>
          </DialogHeader>
          <pre className="font-sans">{book.description}</pre>
        </DrawerDialog>
        {mountedDialogs.has("info") && (
          <BookInfoModal
            open={activeDialog === "info"}
            setOpen={genSetOpen("info")}
            book={book}
            setActiveDialog={setActiveDialog}
          />
        )}
        {mountedDialogs.has("collections") && (
          <BookCollectionsModal
            open={activeDialog === "collections"}
            setOpen={genSetOpen("collections")}
            book={book}
          />
        )}
        {mountedDialogs.has("share") && (
          <ShareBookModal
            open={activeDialog === "share"}
            setOpen={genSetOpen("share")}
            book={book}
          />
        )}
        {mountedDialogs.has("read") && (
          <DateReadModal
            isOpen={activeDialog === "read"}
            setIsOpen={genSetOpen("read")}
            onSuccess={() => {
              setActiveDialog(null);
              onUpdate?.();
              void revalidate("books");
            }}
            book={book}
            lastEvent={reading.latest ?? undefined}
          />
        )}
        {mountedDialogs.has("done") && (
          <DateDoneModal
            isOpen={activeDialog === "done"}
            setIsOpen={genSetOpen("done")}
            book={book}
            onDone={() => {
              setActiveDialog(null);
              onUpdate?.();
              void revalidate("books");
              router.push(`/books/history?bookReadId=${book.id}`);
            }}
          />
        )}
        {mountedDialogs.has("edit") && (
          <EditBookModal
            open={activeDialog === "edit"}
            setOpen={genSetOpen("edit")}
            book={book}
            onUpdate={(newBook) => {
              void capture("edited_book", {
                title: newBook.title,
                author: newBook.author,
                oldTitle: book.title,
                oldAuthor: book.author,
              });
              onUpdate?.();
            }}
          />
        )}
        {mountedDialogs.has("stats") && (
          <BookReadInfo
            open={activeDialog === "stats"}
            setOpen={genSetOpen("stats")}
            book={book}
          />
        )}
        <div className="flex items-start gap-2">
          {book.coverUrl && (
            <Image
              src={book.coverUrl}
              alt="book"
              width={192}
              height={320}
              unoptimized={book.coverUrl.includes("books.google.com")}
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
              ) : progressPages === book.pages ? (
                <>
                  <IconBadge icon={BookOpenCheck}>Прочитана</IconBadge>
                  <UndoEventButton
                    bookId={book.id}
                    eventId={latestEvent!.id}
                    eventDate={latestEvent!.readAt}
                    onDone={() => {
                      onUpdate?.();
                      void revalidate("books");
                    }}
                  />
                  <IconBadge variant="secondary" icon={BookOpen}>
                    {book.pages}{" "}
                    {declOfNum(book.pages, ["страница", "страницы", "страниц"])}{" "}
                    всего
                  </IconBadge>
                  <IconBadge variant="outline" icon={CalendarDays}>
                    {latestEvent
                      ? dateToString(new Date(latestEvent.readAt))
                      : ""}
                  </IconBadge>
                </>
              ) : (
                <>
                  <IconBadge icon={BookIcon}>Читается</IconBadge>
                  <IconBadge variant="secondary" icon={BookOpen}>
                    {progressPages}/{book.pages}{" "}
                    {declOfNum(book.pages, ["страницы", "страниц", "страниц"])}{" "}
                    ({((progressPages / book.pages) * 100).toFixed(1)}%)
                  </IconBadge>
                  <IconBadge variant="outline" icon={CalendarDays}>
                    {latestEvent
                      ? dateToString(new Date(latestEvent.readAt))
                      : ""}
                    <SimpleTooltip text="Отменить событие">
                      <UndoEventButton
                        bookId={book.id}
                        eventId={latestEvent!.id}
                        eventDate={latestEvent!.readAt}
                        onDone={() => {
                          onUpdate?.();
                          void revalidate("books");
                        }}
                      />
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
                  onClick={() => setActiveDialog("share")}
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
                <div
                  key={collection.id}
                  className="h-full rounded-4xl border px-4 py-2"
                >
                  {collection.name}
                </div>
              ))}
              <SimpleTooltip text="Добавить в коллекцию">
                <Button
                  variant="outline"
                  size="icon"
                  aria-label="Добавить в коллекцию"
                  onClick={() => setActiveDialog("collections")}
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
            aria-label="Информация о книге"
            onClick={() => setActiveDialog("info")}
            helpText="Больше информации об этой книге"
          >
            <Info className="size-4" />
          </HelpButton>
          {progressPages !== book.pages && (
            <>
              <HelpButton
                className="gap-2"
                variant="outline"
                aria-label="Прочитана"
                onClick={() => setActiveDialog("done")}
                helpText="Отметить книгу прочитанной в определённую дату"
              >
                <BookOpenCheck className="size-4" />
                <div className="max-sm:hidden">Прочитана</div>
              </HelpButton>
              <HelpButton
                className="gap-2"
                variant="outline"
                aria-label="Отметить прочтение"
                onClick={() => setActiveDialog("read")}
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
            aria-label="Поделиться"
            onClick={() => setActiveDialog("share")}
            helpText="Создайте ссылки на книгу, чтобы другие могли скопировать её себе"
          >
            <Share className="size-4" />
            <div className="max-sm:hidden">Поделиться</div>
          </HelpButton>
          {history && (
            <HelpButton
              className="gap-2"
              variant="outline"
              aria-label="Статистика"
              onClick={() => setActiveDialog("stats")}
              helpText="Посмотреть статистику прочтения книги"
            >
              <BarChart className="size-4" />
              <div className="max-sm:hidden">Статистика</div>
            </HelpButton>
          )}
          {!history && book.status !== BookStatus.ARCHIVED && (
            <HideBookButton
              bookId={book.id}
              isHidden={book.status === BookStatus.HIDDEN}
              onDone={() => {
                setActiveDialog(null);
                onUpdate?.();
                void revalidate("books");
              }}
            />
          )}
          {!history && book.status !== BookStatus.HIDDEN && (
            <ArchiveBookButton
              bookId={book.id}
              isArchived={book.status === BookStatus.ARCHIVED}
              onDone={() => {
                setActiveDialog(null);
                onUpdate?.();
                void revalidate("books");
              }}
            />
          )}
          <Palette background={book.background} bookId={book.id} />
          <div className="flex gap-2 sm:absolute sm:top-0 sm:right-0 sm:m-2 [@media(hover:hover)_and_(pointer:fine)]:scale-0 [@media(hover:hover)_and_(pointer:fine)]:opacity-0 transition-all group-hover:scale-100 group-hover:opacity-100 group-focus-within:scale-100 group-focus-within:opacity-100">
            <SimpleTooltip text="Отредактировать книгу">
              <Button
                size="icon"
                variant="outline"
                className="size-fit p-1"
                aria-label="Редактировать книгу"
                onClick={() => setActiveDialog("edit")}
              >
                <Edit className="size-4" />
              </Button>
            </SimpleTooltip>
            <SimpleTooltip text="Удалить книгу">
              <Button
                size="icon"
                variant="outline"
                className="size-fit p-1"
                aria-label="Удалить книгу"
                onClick={() => setActiveDialog("delete")}
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
