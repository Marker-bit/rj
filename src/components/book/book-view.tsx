"use client";

import { BookCollectionsModal } from "@/components/dialogs/book-collections-modal";
import { BookInfoModal } from "@/components/dialogs/book-info-modal";
import { DateReadModal } from "@/components/dialogs/date-read-modal";
import { EditBookModal } from "@/components/dialogs/edit-book-modal";
import { DrawerDialog } from "@/components/drawer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { dateToString, declOfNum } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isSameDay } from "date-fns";
import {
  BookIcon,
  BookOpen,
  BookOpenCheck,
  BookOpenTextIcon,
  CalendarDays,
  Edit,
  Info,
  Plus,
  Share,
  Trash,
  Undo,
  Users,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useMediaQuery } from "usehooks-ts";
import { ShareBookModal } from "../dialogs/share-book-modal";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import Link from "next/link";
import { toast } from "sonner";
import { Loader } from "../ui/loader";

export function BookView({ book }: { book: any }) {
  const queryClient = useQueryClient();
  const [editOpen, setEditOpen] = useState(false);
  const [dateOpen, setDateOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [actionsDrawerOpen, setActionsDrawerOpen] = useState(false);
  const [descriptionDrawerOpen, setDescriptionDrawerOpen] = useState(false);
  const [collectionsOpen, setCollectionsOpen] = useState(false);
  const [shareBookOpen, setShareBookOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const router = useRouter();

  const undoEventMutation = useMutation({
    mutationFn: () =>
      fetch(`/api/books/${book.id}/undo`, {
        method: "DELETE",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["books"],
      });
      queryClient.invalidateQueries({
        queryKey: ["events"],
      });
      toast.success("Событие отменено");
      router.refresh();
    },
  });

  const doneMutation = useMutation({
    mutationFn: () => {
      return fetch(`/api/books/${book.id}/read/`, {
        method: "POST",
        body: JSON.stringify({
          pages: book.pages,
        }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["books"],
      });
      queryClient.invalidateQueries({
        queryKey: ["events"],
      });
      toast.success("Книга отмечена как прочитанная");
      setActionsDrawerOpen(false);
      router.refresh();
    },
  });

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
      });
      queryClient.invalidateQueries({
        queryKey: ["events"],
      });
      setDateOpen(false);
      toast.success("Событие сохранено");
      setActionsDrawerOpen(false);
      router.refresh();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () =>
      fetch(`/api/books/${book.id}/`, {
        method: "DELETE",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["books"],
      });
      queryClient.invalidateQueries({
        queryKey: ["events"],
      });
      setDeleteDialogOpen(false);
      setActionsDrawerOpen(false);
      toast.success("Книга удалена");
      router.refresh();
    },
  });

  const lastEvent = book.readEvents[0];

  if (book.groupBook) {
    book = {
      ...book,
      groupBook: book.groupBook,
      groupBookId: book.groupBookId,
      title: book.groupBook.title,
      author: book.groupBook.author,
      pages: book.groupBook.pages,
      coverUrl: book.groupBook.coverUrl,
    };
  }

  return (
    <div
      className="border p-2 rounded-md hover:shadow transition-shadow flex gap-2 group relative"
      id={`book-${book.id}`}
    >
      <DrawerDialog
        open={descriptionDrawerOpen}
        onOpenChange={setDescriptionDrawerOpen}
      >
        <DialogHeader>
          <DialogTitle>Описание</DialogTitle>
        </DialogHeader>
        <pre className="relative overflow-hidden font-sans block mt-2 cursor-pointer text-wrap">
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
        doneMutation={doneMutation}
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
      <DrawerDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogHeader>
          <DialogTitle>Вы уверены?</DialogTitle>
          <DialogDescription>
            Вы удалите книгу &quot;{book.title}&quot; без возможности возврата.
          </DialogDescription>
        </DialogHeader>
        <div className="gap-2 flex max-sm:flex-col md:ml-auto md:w-fit mt-2">
          <Button onClick={() => setDeleteDialogOpen(false)} variant="outline">
            Отмена
          </Button>

          <Button
            variant="destructive"
            onClick={() => deleteMutation.mutate()}
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending && (
              <Loader className="h-4 w-4 mr-2" />
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
          className="rounded-md h-40 w-auto"
        />
      )}
      <div className="flex flex-col">
        <div className="font-bold text-xl">{book.title}</div>
        <div className="text-sm">{book.author}</div>
        <div className="flex items-center gap-2 flex-wrap my-2">
          {book.readEvents.length === 0 ? (
            <>
              <Badge>
                <CalendarDays className="w-4 h-4 mr-2" /> Запланирована
              </Badge>
              <Badge variant="secondary">
                <BookOpen className="w-4 h-4 mr-2" /> {book.pages} страниц всего
              </Badge>
            </>
          ) : lastEvent.pagesRead === book.pages ? (
            <>
              <Badge>
                <BookOpenCheck className="w-4 h-4 mr-2" /> Прочитана
              </Badge>
              <Button
                variant="outline"
                size="icon"
                onClick={() => undoEventMutation.mutate()}
                disabled={undoEventMutation.isPending}
                className="w-fit h-fit p-1"
              >
                {undoEventMutation.isPending ? (
                  <Loader className="w-4 h-4" />
                ) : (
                  <Undo className="w-4 h-4" />
                )}
              </Button>
              <Badge variant="secondary">
                <BookOpen className="w-4 h-4 mr-2" /> {book.pages}{" "}
                {declOfNum(book.pages, ["страница", "страницы", "страниц"])}{" "}
                всего
              </Badge>
              <Badge variant="outline">
                <CalendarDays className="w-4 h-4 mr-2" />
                {dateToString(new Date(lastEvent.readAt))}
              </Badge>
            </>
          ) : (
            <>
              <Badge>
                <BookIcon className="w-4 h-4 mr-2" /> Читается
              </Badge>
              <Badge variant="secondary">
                <BookOpen className="w-4 h-4 mr-2" /> {lastEvent.pagesRead}{" "}
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
                <CalendarDays className="w-4 h-4 mr-2" />
                {dateToString(new Date(lastEvent.readAt))}
              </Badge>
              <Button
                variant="outline"
                size="icon"
                onClick={() => undoEventMutation.mutate()}
                disabled={undoEventMutation.isPending}
                className="w-fit h-fit p-1"
              >
                {undoEventMutation.isPending ? (
                  <Loader className="w-4 h-4" />
                ) : (
                  <Undo className="w-4 h-4" />
                )}
              </Button>
            </>
          )}
          {book.groupBookId && (
            <Tooltip>
              <TooltipTrigger>
                <Link href={`/groups/${book.groupBook.group.id}`}>
                  <Badge variant="outline">
                    <Users className="w-4 h-4 mr-2" />{" "}
                    {book.groupBook.group.title}
                  </Badge>
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p>Группа</p>
              </TooltipContent>
            </Tooltip>
          )}
        </div>
        <div className="flex gap-1 flex-wrap">
          {book.collections.map((collection: any) => (
            <Badge key={collection.id} variant="outline">
              {collection.name}
            </Badge>
          ))}
          <Button
            variant="outline"
            size="icon"
            className="w-fit h-fit p-1 rounded-full"
            onClick={() => setCollectionsOpen(true)}
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
        <div className="flex gap-2 flex-wrap mt-1">
          <Button
            className="gap-2"
            variant="outline"
            onClick={() => setActionsDrawerOpen(true)}
          >
            <Info className="w-4 h-4" />
          </Button>
          {!(lastEvent?.pagesRead === book.pages) && (
            <>
              <>
                <Button
                  className="gap-2"
                  variant="outline"
                  onClick={() => doneMutation.mutate()}
                  disabled={doneMutation.isPending}
                >
                  {doneMutation.isPending ? (
                    <Loader className="w-4 h-4" />
                  ) : (
                    <BookOpenCheck className="w-4 h-4" />
                  )}
                  <div className="max-sm:hidden">Прочитана</div>
                </Button>
                <Button
                  className="gap-2"
                  variant="outline"
                  onClick={() => setDateOpen(true)}
                >
                  <BookOpenTextIcon className="w-4 h-4" />
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
            <Share className="w-4 h-4" />
            <div className="max-sm:hidden">Поделиться</div>
          </Button>
          <div className="flex gap-2 m-2 group-hover:opacity-100 opacity-0 absolute top-0 right-0 transition-all scale-0 group-hover:scale-100">
            <Button
              size="icon"
              variant="outline"
              className="p-1 w-fit h-fit"
              onClick={() => setEditOpen(true)}
              disabled={book.groupBookId}
            >
              <Edit className="w-4 h-4" />
            </Button>
            <Button
              size="icon"
              variant="outline"
              className="p-1 w-fit h-fit"
              onClick={() => setDeleteDialogOpen(true)}
            >
              <Trash className="w-4 h-4" />
            </Button>
          </div>
        </div>
        {book.description && (
          <pre className="relative text-black/70 overflow-hidden font-sans block text-wrap">
            {isMobile
              ? book.description.split("\n").slice(0, 3).join("\n")
              : book.description}
            {book.description.split("\n").length > 3 && isMobile && "..."}
          </pre>
        )}
      </div>
    </div>
  );
}
