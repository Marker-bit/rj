"use client";

import {
  BookIcon,
  BookMinus,
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
import { BookView } from "../BookView";
import { Textarea } from "@/components/ui/textarea";

const bookSchema = z.object({
  title: z.string().min(1),
  author: z.string().min(1),
  pages: z.coerce.number().min(1),
  description: z.string().optional(),
});

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
        {booksQuery?.data?.length === 0 && (
          <div className="p-2 flex gap-2 items-center rounded-xl border border-zinc-200 text-xl">
            <BookMinus className="w-10 h-10" />
            <div className="flex flex-col">
              <div>Нет книг</div>
            </div>
          </div>
        )}
        {booksQuery.isPending && (
          <div className="p-2 flex gap-2 items-center justify-center rounded-xl bg-zinc-100 py-5">
            <Loader className="w-6 h-6 animate-spin" />
          </div>
        )}
        {books.map((book: Book) => (
          <BookView book={book} key={book.id} />
        ))}
      </div>
    </div>
  );
}
