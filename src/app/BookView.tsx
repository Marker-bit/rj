"use client";

import {
  BookIcon,
  BookOpen,
  BookOpenCheck,
  BookOpenTextIcon,
  CalendarDays,
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
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import moment from "moment";
import { Button } from "@/components/ui/button";
import { ru } from "date-fns/locale";

const bookSchema = z.object({
  title: z.string().min(1),
  author: z.string().min(1),
  pages: z.coerce.number().min(1),
});

export function BookView({ book }: { book: Book }) {
  const queryClient = useQueryClient();
  const [choosingPages, setChoosingPages] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [dateOpen, setDateOpen] = useState(false);
  const yesterday = moment().subtract(1, "day").toDate();
  const [date, setDate] = useState<Date | undefined>(yesterday);
  const [changePages, setChangePages] = useState<number | string>("");

  const form = useForm({
    resolver: zodResolver(bookSchema),
    defaultValues: {
      title: book.title,
      author: book.author,
      pages: book.pages,
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
    },
  });

  const doneMutation = useMutation({
    mutationFn: () =>
      fetch(`/api/books/${book.id}/read/`, {
        method: "POST",
        body: JSON.stringify({
          pages: book.pages,
        }),
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
      <Dialog open={dateOpen} onOpenChange={setDateOpen}>
        <DialogContent>
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
            <form onSubmit={(evt) => evt.preventDefault()}>
              <div className="flex gap-2">
                <Input
                  type="number"
                  min={1}
                  value={changePages}
                  onChange={(evt) => setChangePages(evt.target.value)}
                  autoFocus
                />
                <Button onClick={() => readDateMutation.mutate()}>
                  {readDateMutation.isPending ? (
                    <Loader className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </form>
          </div>
        </DialogContent>
      </Dialog>
      <Image
        src="/book.png"
        alt="book"
        width={100}
        height={100}
        className="rounded-md h-40 w-auto"
      />
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
              <button
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
              </button>
              <button
                className="flex gap-2 items-center w-fit bg-gray-100 rounded-xl py-1 px-3 active:opacity-50 transition-all select-none disabled:opacity-40 border border-zinc-200"
                onClick={() => {
                  setChoosingPages(true);
                }}
              >
                {readMutation.isPending ? (
                  <Loader className="w-4 h-4 animate-spin" />
                ) : (
                  <BookOpen className="w-4 h-4" />
                )}
                {/* <img src="https://em-content.zobj.net/source/telegram/386/open-book_1f4d6.webp" className="w-6 h-6" /> */}
                {choosingPages ? (
                  <AutoResizeInput
                    autoFocus
                    className="outline-none border-b border-black w-6 bg-transparent"
                    onBlur={() => setChoosingPages(false)}
                    onKeyUp={(evt: any) => {
                      if (evt.key === "Enter") {
                        const num = parseInt(evt.target.value);
                        console.log(num);
                        if (num >= book.pages || num < 1) return;
                        setChoosingPages(false);
                        if (isNaN(num)) return;
                        readMutation.mutate({
                          pages: num,
                        });
                      }
                    }}
                  />
                ) : (
                  <div>Отметить страницы</div>
                )}
              </button>
              <button
                className="flex gap-2 items-center w-fit bg-gray-100 rounded-xl py-1 px-3 active:opacity-50 transition-all select-none disabled:opacity-40 border border-zinc-200"
                onClick={() => setDateOpen(true)}
              >
                <BookOpenTextIcon className="w-4 h-4" />
                Отметить прочтение в прошлом
              </button>
            </>
          )}
          <div className="flex gap-2 m-2 group-hover:opacity-100 opacity-0 absolute top-0 right-0 transition-all scale-0 group-hover:scale-100">
            <Dialog open={editOpen} onOpenChange={setEditOpen}>
              <DialogContent>
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
              </DialogContent>
            </Dialog>
            <button
              className="bg-gray-100 rounded-md p-1 active:opacity-50 transition-all select-none disabled:opacity-40 border border-zinc-200 h-fit w-fit"
              onClick={() => setEditOpen(true)}
            >
              <Edit className="w-4 h-4" />
            </button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <button className="bg-gray-100 rounded-md p-1 active:opacity-50 transition-all select-none disabled:opacity-40 border border-zinc-200 h-fit w-fit">
                  {deleteMutation.isPending ? (
                    <Loader className="w-4 h-4 animate-spin" />
                  ) : (
                    <Trash className="w-4 h-4" />
                  )}
                </button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Вы уверены?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Вы удалите книгу &quot;{book.title}&quot; без возможности
                    возврата.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Отмена</AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-red-500 hover:bg-red-600"
                    onClick={() => deleteMutation.mutate()}
                  >
                    Удалить
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>
    </div>
  );
}
