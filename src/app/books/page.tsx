"use client";

import {
  BookIcon,
  BookOpen,
  BookOpenCheck,
  BookOpenTextIcon,
  CalendarDays,
  Check,
  ChevronLeft,
  Edit,
  Loader,
  Plus,
  Trash,
  Undo,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import AutoResizeInput from "../AutoResize";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
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
  DialogTrigger,
} from "@/components/ui/dialog";

const bookSchema = z.object({
  title: z.string().min(1),
  author: z.string().min(1),
  pages: z.coerce.number().min(1),
});

export function BookView({ book }: { book: Book }) {
  const queryClient = useQueryClient();
  const [choosingPages, setChoosingPages] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
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
    },
  });

  const lastEvent = book.readEvents[book.readEvents.length - 1];

  async function onSubmit(values: z.infer<typeof bookSchema>) {
    await editMutation.mutateAsync(values);
    setEditOpen(false);
  }

  return (
    <div className="border border-zinc-200 p-2 rounded-md hover:shadow transition-shadow flex gap-2 group relative">
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
                // onClick={() => {
                //   setDoneLoading(true);
                //   fetch(`/api/books/${book.id}/read/`, {
                //     method: "POST",
                //     body: JSON.stringify({
                //       pages: book.pages,
                //     }),
                //   }).then(() => {
                //     setDoneLoading(false);
                //   });
                // }}
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
                onClick={() => alert("Будет добавлено")}
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

export default function BooksPage() {
  const queryClient = useQueryClient();
  const [readBooks, setReadBooks] = useState(false);
  const [notStarted, setNotStarted] = useState(false);
  const form = useForm<z.infer<typeof bookSchema>>({
    resolver: zodResolver(bookSchema),
  });

  const booksQuery = useQuery({
    queryKey: ["books"],
    queryFn: () => fetch("/api/books").then((res) => res.json()),
  });

  const bookMutation = useMutation({
    mutationFn: (values: z.infer<typeof bookSchema>) =>
      fetch("/api/books", {
        method: "POST",
        body: JSON.stringify(values),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["books"],
      });
      form.reset({
        title: "",
        author: "",
        pages: NaN,
      });
    },
  });

  function onSubmit(values: z.infer<typeof bookSchema>) {
    bookMutation.mutate(values);
  }

  let books = booksQuery.data || [];

  if (readBooks) {
    books = books.filter((book: Book) => {
      if (book.readEvents.length === 0) {
        return true;
      }
      return !(
        book.pages === book.readEvents[book.readEvents.length - 1].pagesRead
      );
    });
  }

  if (notStarted) {
    books = books.filter((book: Book) => {
      return book.readEvents.length !== 0;
    });
  }

  return (
    <div>
      <div className="flex p-1 items-center bg-zinc-100 border-b border-zinc-200 min-h-10">
        <Link href="/">
          <button className="p-1 hover:text-blue-600 rounded-md flex items-center gap-1 text-blue-500 active:scale-95 transition-all">
            <ChevronLeft className="w-6 h-6" />
            <div className="font-semibold">Главная</div>
          </button>
        </Link>
        <div className="font-semibold absolute left-[50%] translate-x-[-50%]">
          Книги
        </div>
      </div>
      <div className="p-3 bg-zinc-100 border-b border-zinc-300">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
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
              disabled={bookMutation.isPending}
            >
              {bookMutation.isPending ? (
                <Loader className="w-4 h-4 animate-spin" />
              ) : (
                <Plus className="w-4 h-4" />
              )}
              Создать
            </button>
          </form>
        </Form>
        {/* <Input className="mb-2" /> */}
      </div>
      <div className="p-3 flex flex-col">
        <div
          className="items-center flex space-x-2 cursor-pointer p-2 rounded-md border border-zinc-200 mb-2 hover:bg-zinc-100 transition-all select-none"
          onClick={() => setReadBooks(!readBooks)}
        >
          <Switch id="readBooks" checked={readBooks} />
          <div
            className="text-sm font-medium leading-none peer-disabled:opacity-70 cursor-pointer select-none"
            onClick={() => setReadBooks(!readBooks)}
          >
            Скрывать прочитанные книги
          </div>
        </div>
        <div
          className="items-center flex space-x-2 cursor-pointer p-2 rounded-md border border-zinc-200 mb-2 hover:bg-zinc-100 transition-all select-none"
          onClick={() => setNotStarted(!notStarted)}
        >
          <Switch id="readBooks" checked={notStarted} />
          <div
            className="text-sm font-medium leading-none peer-disabled:opacity-70 cursor-pointer select-none"
            onClick={() => setNotStarted(!notStarted)}
          >
            Скрывать не начатые книги
          </div>
        </div>
        {books.map((book: Book) => (
          <BookView book={book} key={book.id} />
        ))}
      </div>
    </div>
  );
}
