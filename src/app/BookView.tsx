"use client";

import {
  BookIcon,
  BookOpen,
  BookOpenCheck,
  BookOpenTextIcon,
  CalendarDays,
  ChevronDown,
  Edit,
  Info,
  Loader,
  Save,
  Trash,
  Undo,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import AutoResizeInput from "./AutoResize";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import moment from "moment";
import { Button } from "@/components/ui/button";
import { ru } from "date-fns/locale";
import { Textarea } from "@/components/ui/textarea";
import { DrawerDialog } from "./Drawer";
import { Toaster, toast } from "react-hot-toast";
import { useMediaQuery } from "usehooks-ts";
import { Badge } from "@/components/ui/badge";
import { DateReadModal } from "@/components/dialogs/date-read-modal";
import { dateToString } from "@/lib/utils";

const bookSchema = z.object({
  title: z.string().min(1),
  author: z.string().min(1),
  pages: z.coerce.number().min(1),
  description: z.string().optional(),
});

export function BookView({ book }: { book: Book }) {
  moment.updateLocale("ru", {
    week: {
      dow: 1,
    },
  });
  const queryClient = useQueryClient();
  const [editOpen, setEditOpen] = useState(false);
  const [dateOpen, setDateOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [actionsDrawerOpen, setActionsDrawerOpen] = useState(false);
  const [descriptionDrawerOpen, setDescriptionDrawerOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");

  const form = useForm<z.infer<typeof bookSchema>>({
    resolver: zodResolver(bookSchema),
    defaultValues: {
      title: book.title,
      author: book.author,
      pages: book.pages,
      description: book.description ?? "",
    },
  });

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
      toast.success("Сохранено!");
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
      toast.success("Сохранено!");
      setActionsDrawerOpen(false);
    },
  });

  const readMutation = useMutation({
    mutationFn: ({ pages }: { pages: number }) =>
      fetch(`/api/books/${book.id}/read/`, {
        method: "POST",
        body: JSON.stringify({
          pages: pages,
        }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["books"],
      });
      queryClient.invalidateQueries({
        queryKey: ["events"],
      });
      toast.success("Сохранено!");
      setActionsDrawerOpen(false);
    },
  });

  const readDateMutation = useMutation({
    mutationFn: ({ date, pages }: { date: Date; pages: number }) =>
      fetch(`/api/books/${book.id}/read/`, {
        method: "POST",
        body: JSON.stringify({
          pages: pages,
          readAt: date,
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
      toast.success("Сохранено!");
      setActionsDrawerOpen(false);
    },
  });

  const editMutation = useMutation({
    mutationFn: (values: z.infer<typeof bookSchema>) =>
      fetch(`/api/books/${book.id}/`, {
        method: "PATCH",
        body: JSON.stringify(values),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["books"],
      });
      queryClient.invalidateQueries({
        queryKey: ["events"],
      });
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
      toast.success("Сохранено!");
    },
  });

  const lastEvent = book.readEvents[book.readEvents.length - 1];

  async function onSubmit(values: z.infer<typeof bookSchema>) {
    await editMutation.mutateAsync(values);
    setEditOpen(false);
  }

  return (
    <div
      className="border border-zinc-200 p-2 rounded-md hover:shadow transition-shadow flex gap-2 group relative"
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
      <DrawerDialog
        open={actionsDrawerOpen}
        onOpenChange={setActionsDrawerOpen}
      >
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
              <div className="text-sm">{book.pages} страниц</div>
              <div className="w-fit">
                {lastEvent?.pagesRead === book.pages && (
                  <Badge>Прочитана</Badge>
                )}
                {!lastEvent && <Badge>Запланирована</Badge>}
                {lastEvent?.pagesRead !== book.pages && <Badge>Читается</Badge>}
              </div>
              {book.description && (
                <pre
                  className="relative text-black/70 overflow-hidden font-sans block mt-2 cursor-pointer text-wrap"
                  onClick={() => setDescriptionDrawerOpen(true)}
                >
                  {book.description.split("\n").slice(0, 5).join("\n")}
                  {book.description.split("\n").length > 5 && "..."}
                </pre>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            {book.readEvents.map((event) => (
              <div className="flex items-center gap-2" key={event.id}>
                {event.pagesRead === book.pages ? (
                  <>
                    <BookOpenCheck className="text-green-500 w-4 h-4" />
                    <div className="flex flex-col">
                      <div>Прочитана</div>
                      <div className="text-xs text-black/50">
                        {dateToString(new Date(event.readAt))}
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <BookOpen className="w-4 h-4" />
                    <div className="flex flex-col">
                      <div>{event.pagesRead} страниц прочитано</div>
                      <div className="text-xs text-black/50">
                        {dateToString(new Date(event.readAt))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
          <Button
            className="gap-2"
            variant="outline"
            onClick={() => setEditOpen(true)}
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
      <DateReadModal
        isOpen={dateOpen}
        setIsOpen={setDateOpen}
        readDateMutation={readDateMutation}
      />
      {/* <DrawerDialog open={choosingPages} onOpenChange={setChoosingPages}>
        <DialogHeader className="mb-2">
          <DialogTitle>Отметить прочтение</DialogTitle>
        </DialogHeader>
        <div className="flex gap-2 flex-col">
          <form
            onSubmit={(evt) => {
              evt.preventDefault();
              readMutation.mutate({ pages: parseInt(changePages.toString()) });
            }}
          >
            <div className="flex gap-2 flex-col mt-2">
              <Input
                type="number"
                min={1}
                value={changePages}
                onChange={(evt) => setChangePages(evt.target.value)}
                autoFocus
              />
              <Button type="submit" className="w-full md:w-fit md:ml-auto">
                {readMutation.isPending ? (
                  <Loader className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
              </Button>
            </div>
          </form>
        </div>
      </DrawerDialog> */}
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
              <Badge variant="outline">
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
                  <Loader className="w-4 h-4 animate-spin" />
                ) : (
                  <Undo className="w-4 h-4" />
                )}
              </Button>
              <Badge variant="outline">
                <BookOpen className="w-4 h-4 mr-2" /> {book.pages} страниц всего
              </Badge>
              {/* <div className="bg-green-100 flex gap-2 items-center text-green-500 px-3 rounded-xl cursor-default">
                <BookOpenCheck className="w-4 h-4" /> Прочитана
                <button
                  className="p-1 hover:bg-green-500/10 transition-all cursor-pointer rounded-md my-1"
                  onClick={() => undoEventMutation.mutate()}
                >
                  {undoEventMutation.isPending ? (
                    <Loader className="w-4 h-4 animate-spin" />
                  ) : (
                    <Undo className="w-4 h-4" />
                  )}
                </button>
              </div>
              <div className="bg-green-100 flex gap-2 items-center text-green-500 px-3 rounded-xl cursor-default">
                <BookOpen className="w-4 h-4" /> {book.pages} страниц всего
              </div> */}
            </>
          ) : (
            <>
              <Badge>
                <BookIcon className="w-4 h-4 mr-2" /> Читается
              </Badge>
              <Badge variant="outline">
                <BookOpen className="w-4 h-4 mr-2" /> {lastEvent.pagesRead}{" "}
                страниц из {book.pages}
              </Badge>
              <Button
                variant="outline"
                size="icon"
                onClick={() => undoEventMutation.mutate()}
                disabled={undoEventMutation.isPending}
                className="w-fit h-fit p-1"
              >
                {undoEventMutation.isPending ? (
                  <Loader className="w-4 h-4 animate-spin" />
                ) : (
                  <Undo className="w-4 h-4" />
                )}
              </Button>
              {/* <div className="bg-green-100 flex gap-2 items-center text-green-500 px-3 rounded-xl cursor-default">
                <BookOpen className="w-4 h-4" /> {lastEvent.pagesRead} страниц
                из {book.pages}
                <button
                  className="p-1 hover:bg-green-500/10 transition-all cursor-pointer rounded-md my-1"
                  onClick={() => undoEventMutation.mutate()}
                >
                  {undoEventMutation.isPending ? (
                    <Loader className="w-4 h-4 animate-spin" />
                  ) : (
                    <Undo className="w-4 h-4" />
                  )}
                </button>
              </div> */}
            </>
          )}
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button
            className="gap-2"
            variant="outline"
            onClick={() => setActionsDrawerOpen(true)}
          >
            <Info className="w-4 h-4" />
          </Button>
          {!(lastEvent?.pagesRead === book.pages) && (
            <>
              {!isMobile && (
                <>
                  <Button
                    className="gap-2"
                    variant="outline"
                    onClick={() => doneMutation.mutate()}
                    disabled={doneMutation.isPending}
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
            </>
          )}
          <div className="flex gap-2 m-2 group-hover:opacity-100 opacity-0 absolute top-0 right-0 transition-all scale-0 group-hover:scale-100">
            <DrawerDialog open={editOpen} onOpenChange={setEditOpen}>
              <DialogHeader className="mb-2">
                <DialogTitle className="flex gap-1 items-center">
                  <Edit className="w-4 h-4" /> Редактировать книгу
                </DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-2"
                >
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Название</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="author"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Автор</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="pages"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Кол-во страниц</FormLabel>
                        <FormControl>
                          <Input {...field} type="number" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Описание</FormLabel>
                        <FormControl>
                          <Textarea {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="submit"
                    disabled={editMutation.isPending}
                    className="gap-2"
                  >
                    {editMutation.isPending ? (
                      <Loader className="w-4 h-4 animate-spin" />
                    ) : (
                      <Edit className="w-4 h-4" />
                    )}
                    Редактировать
                  </Button>
                  {/* <button
                    className="flex gap-2 items-center w-fit bg-blue-500 rounded-xl text-white py-1 px-3 active:opacity-50 transition-all select-none disabled:opacity-40"
                    type="submit"
                    disabled={editMutation.isPending}
                  >
                    {editMutation.isPending ? (
                      <Loader className="w-4 h-4 animate-spin" />
                    ) : (
                      <Edit className="w-4 h-4" />
                    )}
                    Редактировать
                  </button> */}
                </form>
              </Form>
            </DrawerDialog>
            <button
              className="bg-gray-100 rounded-md p-1 active:opacity-50 transition-all select-none disabled:opacity-40 border border-zinc-200 h-fit w-fit"
              onClick={(evt) => {
                evt.stopPropagation();
                setEditOpen(true);
              }}
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              className="bg-gray-100 rounded-md p-1 active:opacity-50 transition-all select-none disabled:opacity-40 border border-zinc-200 h-fit w-fit"
              onClick={(evt) => {
                evt.stopPropagation();
                setDeleteDialogOpen(true);
              }}
            >
              {deleteMutation.isPending ? (
                <Loader className="w-4 h-4 animate-spin" />
              ) : (
                <Trash className="w-4 h-4" />
              )}
            </button>
            <DrawerDialog
              open={deleteDialogOpen}
              onOpenChange={setDeleteDialogOpen}
            >
              <DialogHeader>
                <DialogTitle>Вы уверены?</DialogTitle>
                <DialogDescription>
                  Вы удалите книгу &quot;{book.title}&quot; без возможности
                  возврата.
                </DialogDescription>
              </DialogHeader>
              <div className="gap-2 flex max-sm:flex-col md:ml-auto md:w-fit mt-2">
                <Button
                  onClick={() => setDeleteDialogOpen(false)}
                  variant="outline"
                >
                  Отмена
                </Button>

                <Button
                  variant="destructive"
                  onClick={() => deleteMutation.mutate()}
                  disabled={deleteMutation.isPending}
                >
                  {deleteMutation.isPending && (
                    <Loader className="h-4 w-4 mr-2 animate-spin" />
                  )}
                  Удалить
                </Button>
              </div>
            </DrawerDialog>
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
      <Toaster />
    </div>
  );
}
