"use client";

import {
  BookIcon,
  BookOpen,
  BookOpenCheck,
  BookOpenTextIcon,
  CalendarDays,
  ChevronDown,
  Edit,
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
import { DrawerAlertDialog, DrawerDialog } from "./Drawer";
import { Toaster, toast } from "react-hot-toast";
import { useMediaQuery } from "usehooks-ts";
import { Drawer } from "@/components/ui/drawer";

const bookSchema = z.object({
  title: z.string().min(1),
  author: z.string().min(1),
  pages: z.coerce.number().min(1),
  description: z.string().optional(),
});

export function BookView({ book }: { book: Book }) {
  const queryClient = useQueryClient();
  const [choosingPages, setChoosingPages] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [dateOpen, setDateOpen] = useState(false);
  const yesterday = moment().subtract(1, "day").toDate();
  const [date, setDate] = useState<Date | undefined>(yesterday);
  const [changePages, setChangePages] = useState<number | string>("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [actionsDrawerOpen, setActionsDrawerOpen] = useState(false);
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
      setChoosingPages(false);
      setActionsDrawerOpen(false);
    },
  });

  const readDateMutation = useMutation({
    mutationFn: () =>
      fetch(`/api/books/${book.id}/read/`, {
        method: "POST",
        body: JSON.stringify({
          pages: parseInt(changePages.toString()),
          readAt: date!,
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
        open={actionsDrawerOpen}
        onOpenChange={setActionsDrawerOpen}
      >
        <DialogHeader>
          <DialogTitle>Действия</DialogTitle>
        </DialogHeader>
        <div className="flex gap-2 flex-col mt-2">
          <Button
            className="gap-2"
            variant="outline"
            onClick={() => setEditOpen(true)}
          >
            <Edit className="w-4 h-4" />
            Редактировать
          </Button>
          <Button
            className="gap-2 text-red-500"
            variant="outline"
            onClick={() => setDeleteDialogOpen(true)}
          >
            <Trash className="w-4 h-4" />
            Удалить
          </Button>
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
            onClick={() => {
              setChoosingPages(true);
            }}
          >
            <BookOpen className="w-4 h-4" />
            Отметить страницы
          </Button>
          <Button
            className="gap-2"
            variant="outline"
            onClick={() => setDateOpen(true)}
          >
            <BookOpenTextIcon className="w-4 h-4" />
            Отметить прочтение в прошлом
          </Button>
        </div>
      </DrawerDialog>
      <DrawerDialog open={dateOpen} onOpenChange={setDateOpen}>
        <DialogHeader>
          <DialogTitle>Отметить прочтение в прошлом</DialogTitle>
        </DialogHeader>
        <div className="flex gap-2 flex-col">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md border w-fit max-sm:w-full"
            disabled={[{ from: new Date(), to: new Date(3000, 1) }]}
            weekStartsOn={1}
            locale={ru}
          />
          <form
            onSubmit={(evt) => {
              evt.preventDefault();
              readDateMutation.mutate();
            }}
          >
            <div className="flex gap-2">
              <Input
                type="number"
                min={1}
                value={changePages}
                onChange={(evt) => setChangePages(evt.target.value)}
                autoFocus
              />
              <Button type="submit" className="w-full">
                {readDateMutation.isPending ? (
                  <Loader className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
              </Button>
            </div>
          </form>
        </div>
      </DrawerDialog>
      <DrawerDialog open={choosingPages} onOpenChange={setChoosingPages}>
        <DialogHeader>
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
      </DrawerDialog>
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
        <div className="flex gap-2 flex-wrap my-2">
          {book.readEvents.length === 0 ? (
            <>
              <div className="bg-orange-100 flex gap-2 items-center text-orange-500 px-3 rounded-xl cursor-default">
                <CalendarDays className="w-4 h-4" /> Запланирована
              </div>
              <div className="bg-green-100 flex gap-2 items-center text-green-500 px-3 rounded-xl cursor-default">
                <BookOpen className="w-4 h-4" /> {book.pages} страниц всего
              </div>
            </>
          ) : lastEvent.pagesRead === book.pages ? (
            <>
              <div className="bg-green-100 flex gap-2 items-center text-green-500 px-3 rounded-xl cursor-default">
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
              </div>
            </>
          ) : (
            <>
              <div className="bg-blue-100 flex gap-2 items-center text-blue-500 px-3 rounded-xl cursor-default">
                <BookIcon className="w-4 h-4" /> Читается
              </div>
              <div className="bg-green-100 flex gap-2 items-center text-green-500 px-3 rounded-xl cursor-default">
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
              </div>
            </>
          )}
        </div>
        <div className="flex gap-2 flex-wrap">
          {!(lastEvent?.pagesRead === book.pages) && (
            <>
              {/* <button
                className="flex gap-2 items-center w-fit bg-blue-500 rounded-xl text-white py-1 px-3 active:opacity-50 transition-all select-none disabled:opacity-40"
                onClick={() => doneMutation.mutate()}
                disabled={doneMutation.isPending}
              >
                {doneMutation.isPending ? (
                  <Loader className="w-4 h-4 animate-spin" />
                ) : (
                  <BookOpenCheck className="w-4 h-4" />
                )}
                Прочитана
              </button> */}
              {isMobile ? (
                <Button
                  className="gap-2"
                  variant="outline"
                  onClick={() => setActionsDrawerOpen(true)}
                >
                  Действия
                </Button>
              ) : (
                <>
                  <Button className="gap-2" variant="outline">
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
                    onClick={() => {
                      setChoosingPages(true);
                    }}
                  >
                    <BookOpen className="w-4 h-4" />
                    Отметить страницы
                  </Button>
                  <Button
                    className="gap-2"
                    variant="outline"
                    onClick={() => setDateOpen(true)}
                  >
                    <BookOpenTextIcon className="w-4 h-4" />
                    Отметить прочтение в прошлом
                  </Button>
                </>
              )}
            </>
          )}
          <div className="flex gap-2 m-2 group-hover:opacity-100 opacity-0 absolute top-0 right-0 transition-all scale-0 group-hover:scale-100">
            <DrawerDialog open={editOpen} onOpenChange={setEditOpen}>
              <DialogHeader>
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
                  <button
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
                  </button>
                </form>
              </Form>
            </DrawerDialog>
            <button
              className="bg-gray-100 rounded-md p-1 active:opacity-50 transition-all select-none disabled:opacity-40 border border-zinc-200 h-fit w-fit"
              onClick={() => setEditOpen(true)}
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              className="bg-gray-100 rounded-md p-1 active:opacity-50 transition-all select-none disabled:opacity-40 border border-zinc-200 h-fit w-fit"
              onClick={() => setDeleteDialogOpen(true)}
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
          <div className="relative text-black/70 whitespace-pre-wrap">
            {book.description}
          </div>
        )}
      </div>
      <Toaster />
    </div>
  );
}
