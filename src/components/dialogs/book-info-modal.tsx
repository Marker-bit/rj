import { DrawerDialog } from "@/components/drawer";
import {
  BookOpen,
  BookOpenCheck,
  BookOpenTextIcon,
  Edit,
  Loader,
  Pencil,
  Share,
  Trash,
} from "lucide-react";
import Image from "next/image";
import { Button } from "../ui/button";
import { dateToString, declOfNum } from "@/lib/utils";
import { Badge } from "../ui/badge";
import { Collection, ReadEvent } from "@prisma/client";

export function BookInfoModal({
  open,
  setOpen,
  book,
  setDescriptionDrawerOpen,
  setEditOpen,
  setDeleteDialogOpen,
  setDateOpen,
  setShareOpen,
  doneMutation,
  setCollectionsOpen,
}: {
  open: boolean;
  setOpen: (b: boolean) => void;
  book: any;
  setDescriptionDrawerOpen: (b: boolean) => void;
  setEditOpen: (b: boolean) => void;
  setDeleteDialogOpen: (b: boolean) => void;
  setDateOpen: (b: boolean) => void;
  setCollectionsOpen: (b: boolean) => void;
  doneMutation: {
    mutate: () => void;
    isPending: boolean;
  };
  setShareOpen: (b: boolean) => void;
}) {
  const lastEvent = book.readEvents[0];

  return (
    <DrawerDialog open={open} onOpenChange={setOpen} className="min-w-[50vw]">
      <div className="flex gap-2 flex-col mt-2">
        <div className="flex">
          {book.coverUrl && (
            <Image
              src={book.coverUrl}
              alt="book"
              width={500}
              height={500}
              className="rounded-md h-52 w-auto"
            />
          )}
          <div className="flex flex-col m-2 mt-0">
            <div className="font-bold text-xl">{book.title}</div>
            <div className="text-sm">{book.author}</div>
            <div className="text-sm">
              {book.pages}{" "}
              {declOfNum(book.pages, ["страница", "страницы", "страниц"])}
            </div>
            <div className="w-fit">
              {lastEvent?.pagesRead === book.pages && <Badge>Прочитана</Badge>}
              {!lastEvent && <Badge>Запланирована</Badge>}
              {lastEvent && lastEvent?.pagesRead !== book.pages && (
                <Badge>Читается</Badge>
              )}
            </div>
            {book.description && (
              <pre
                className="relative text-black/70 dark:text-white/70 overflow-hidden font-sans block mt-2 cursor-pointer text-wrap"
                onClick={() => setDescriptionDrawerOpen(true)}
              >
                {book.description.split("\n").slice(0, 5).join("\n")}
                {book.description.split("\n").length > 5 && "..."}
              </pre>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          {book.readEvents.map((event: ReadEvent) => (
            <div className="flex items-center gap-2" key={event.id}>
              {event.pagesRead === book.pages ? (
                <>
                  <BookOpenCheck className="text-green-500 w-4 h-4" />
                  <div className="flex flex-col">
                    <div>Книга прочитана!</div>
                    <div className="text-xs text-black/50 dark:text-white/50">
                      {dateToString(new Date(event.readAt))}
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <BookOpen className="w-4 h-4" />
                  <div className="flex flex-col">
                    <div>
                      {event.pagesRead}{" "}
                      {declOfNum(event.pagesRead, [
                        "страница",
                        "страницы",
                        "страниц",
                      ])}{" "}
                      прочитано
                    </div>
                    <div className="text-xs text-black/50 dark:text-white/50">
                      {dateToString(new Date(event.readAt))}
                    </div>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
        <h3 className="text-xl">Коллекции</h3>
        <div className="flex flex-col gap-2">
          {book.collections.map((collection: Collection) => (
            <div className="flex flex-col gap-2" key={collection.id}>
              <h4 className="text-lg">{collection.name}</h4>
            </div>
          ))}
          <Button variant="outline" onClick={() => setCollectionsOpen(true)}>
            <Pencil className="mr-2 w-4 h-4" /> Редактировать коллекции
          </Button>
        </div>
        <Button
          className="gap-2"
          variant="outline"
          onClick={() => setShareOpen(true)}
        >
          <Share className="w-4 h-4" />
          Поделиться
        </Button>
        <Button
          className="gap-2"
          variant="outline"
          onClick={() => setEditOpen(true)}
          disabled={book.groupBookId}
        >
          <Edit className="w-4 h-4" />
          Редактировать
        </Button>
        <Button
          className="gap-2 text-red-500 hover:text-red-700"
          variant="outline"
          onClick={() => setDeleteDialogOpen(true)}
        >
          <Trash className="w-4 h-4" />
          Удалить
        </Button>
        {lastEvent?.pagesRead !== book.pages && (
          <>
            <Button
              className="gap-2"
              variant="outline"
              disabled={doneMutation.isPending}
              onClick={() => doneMutation.mutate()}
            >
              {doneMutation.isPending ? (
                <Loader className="w-4 h-4 animate-spin" />
              ) : (
                <BookOpenCheck className="w-4 h-4" />
              )}
              Прочитана
            </Button>
            <Button
              className="gap-2"
              variant="outline"
              onClick={() => setDateOpen(true)}
            >
              <BookOpenTextIcon className="w-4 h-4" />
              Отметить прочтение
            </Button>
          </>
        )}
      </div>
    </DrawerDialog>
  );
}
