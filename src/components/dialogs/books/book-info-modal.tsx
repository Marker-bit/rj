import { DrawerDialog } from "@/components/ui/drawer-dialog";
import {
  BookOpen,
  BookOpenCheck,
  BookOpenTextIcon,
  ChevronDown,
  Edit,
  Loader,
  Pencil,
  Share,
  Trash,
} from "lucide-react";
import Image from "next/image";
import { Button } from "../../ui/button";
import { dateToString, declOfNum } from "@/lib/utils";
import { Badge } from "../../ui/badge";
import { Collection, ReadEvent } from "@prisma/client";
import { DialogTitle } from "@/components/ui/dialog";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

export function BookInfoModal({
  open,
  setOpen,
  book,
  setDescriptionDrawerOpen,
  setEditOpen,
  setDeleteDialogOpen,
  setDateOpen,
  setShareOpen,
  setDoneOpen,
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
  setDoneOpen: (b: boolean) => void;
  setShareOpen: (b: boolean) => void;
}) {
  const lastEvent = book.readEvents[0];

  return (
    <DrawerDialog open={open} onOpenChange={setOpen} className="min-w-[50vw]">
      <DialogTitle className="hidden">{book.title}</DialogTitle>
      <div className="mt-2 flex flex-col gap-2">
        <div className="flex">
          {book.coverUrl && (
            <Image
              src={book.coverUrl}
              alt="book"
              width={500}
              height={500}
              className="h-52 w-auto rounded-md"
            />
          )}
          <div className="m-2 mt-0 flex flex-col">
            <div className="text-xl font-bold">{book.title}</div>
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
                className="relative mt-2 cursor-pointer line-clamp-5 overflow-hidden text-wrap font-sans text-black/70 dark:text-white/70"
                onClick={() => setDescriptionDrawerOpen(true)}
              >
                {book.description}
              </pre>
            )}
          </div>
        </div>
        {book.readEvents.length > 0 && (
          <Collapsible>
            <div className="flex items-center justify-between gap-4">
              События
              <CollapsibleTrigger asChild className="group">
                <Button variant="ghost" size="icon">
                  <ChevronDown className="size-4 group-data-[state=open]:rotate-180 transition" />
                </Button>
              </CollapsibleTrigger>
            </div>
            <CollapsibleContent>
              <div className="flex flex-col gap-2">
                {book.readEvents.map((event: ReadEvent) => (
                  <div className="flex items-center gap-2" key={event.id}>
                    {event.pagesRead === book.pages ? (
                      <>
                        <BookOpenCheck className="size-4 text-green-500" />
                        <div className="flex flex-col">
                          <div>Книга прочитана!</div>
                          <div className="text-xs text-black/50 dark:text-white/50">
                            {dateToString(new Date(event.readAt))}
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <BookOpen className="size-4" />
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
            </CollapsibleContent>
          </Collapsible>
        )}

        <h3>Коллекции</h3>
        <div className="flex flex-col gap-2">
          {book.collections.map((collection: Collection) => (
            <div className="flex flex-col gap-2" key={collection.id}>
              <h4 className="text-lg">{collection.name}</h4>
            </div>
          ))}
          <Button variant="outline" onClick={() => setCollectionsOpen(true)}>
            <Pencil /> Редактировать коллекции
          </Button>
        </div>
        <div className="grid lg:grid-cols-2 gap-2">
          <Button
            className="gap-2"
            variant="outline"
            onClick={() => setShareOpen(true)}
          >
            <Share />
            Поделиться
          </Button>
          <Button
            className="gap-2"
            variant="outline"
            onClick={() => setEditOpen(true)}
            // disabled={book.groupBookId}
          >
            <Edit />
            Редактировать
          </Button>
          <Button
            variant="destructive"
            onClick={() => setDeleteDialogOpen(true)}
          >
            <Trash />
            Удалить
          </Button>
          {lastEvent?.pagesRead !== book.pages && (
            <>
              <Button
                className="gap-2"
                variant="outline"
                onClick={() => setDoneOpen(true)}
              >
                <BookOpenCheck />
                Прочитана
              </Button>
              <Button
                className="gap-2"
                variant="outline"
                onClick={() => setDateOpen(true)}
              >
                <BookOpenTextIcon />
                Отметить прочтение
              </Button>
            </>
          )}
        </div>
      </div>
    </DrawerDialog>
  );
}
