"use client";

import {
  BookIcon,
  BookOpen,
  BookOpenCheck,
  CalendarDays,
  Check,
  ChevronLeft,
  Loader,
  Plus,
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

const bookSchema = z.object({
  title: z.string().min(1),
  author: z.string().min(1),
  pages: z.coerce.number().min(1),
});

function BookView({ book }: { book: Book }) {
  const [choosingPages, setChoosingPages] = useState(false);

  return (
    <div className="border border-zinc-200 p-2 rounded-md hover:shadow transition-shadow flex gap-2">
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
            <div className="bg-orange-100 flex gap-2 items-center text-orange-500 px-3 rounded-xl cursor-default">
              <CalendarDays className="w-4 h-4" /> Запланирована
            </div>
          ) : (
            <>
              <div className="bg-blue-100 flex gap-2 items-center text-blue-500 px-3 rounded-xl cursor-default">
                <BookIcon className="w-4 h-4" /> Читается
              </div>
              <div className="bg-green-100 flex gap-2 items-center text-green-500 px-3 rounded-xl cursor-default">
                <BookOpen className="w-4 h-4" /> 10 страниц
              </div>
            </>
          )}
          {/* <div className="bg-blue-100 flex gap-2 items-center text-blue-500 px-3 rounded-xl cursor-default">
            <BookIcon className="w-4 h-4" /> Читается
          </div>
          <div className="bg-green-100 flex gap-2 items-center text-green-500 px-3 rounded-xl cursor-default">
            <BookOpen className="w-4 h-4" /> 10 страниц
          </div> */}
        </div>
        <div className="flex gap-2 flex-wrap">
          {book.readEvents.length === 0 ? (
            <button
              className="flex gap-2 items-center w-fit bg-gray-100 rounded-xl py-1 px-3 active:opacity-50 transition-all select-none disabled:opacity-40 border border-zinc-200"
              onClick={() => {
                setChoosingPages(true);
              }}
            >
              <BookOpen className="w-4 h-4" />
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
                      fetch(`/api/books/${book.id}/read/`, {
                        method: "POST",
                        body: JSON.stringify({
                          pages: num
                        })
                      }).then(res => res.json()).then(console.log)
                    }
                  }}
                />
              ) : (
                <div>Отметить страницы</div>
              )}
            </button>
          ) : (
            <>
              <button className="flex gap-2 items-center w-fit bg-blue-500 rounded-xl text-white py-1 px-3 active:opacity-50 transition-all select-none disabled:opacity-40">
                <BookOpenCheck className="w-4 h-4" />
                Прочитана
              </button>
              <button
                className="flex gap-2 items-center w-fit bg-gray-100 rounded-xl py-1 px-3 active:opacity-50 transition-all select-none disabled:opacity-40 border border-zinc-200"
                onClick={() => {
                  setChoosingPages(true);
                }}
              >
                <BookOpen className="w-4 h-4" />
                {/* <img src="https://em-content.zobj.net/source/telegram/386/open-book_1f4d6.webp" className="w-6 h-6" /> */}
                {choosingPages ? (
                  <AutoResizeInput
                    autoFocus
                    className="outline-none border-b border-black w-6 bg-transparent"
                    onBlur={() => setChoosingPages(false)}
                    onKeyUp={(evt: any) => {
                      if (evt.key === "Enter") {
                        setChoosingPages(false);
                        const num = parseInt(evt.target.value);
                        console.log(num);
                        if (isNaN(num)) return;
                        fetch(`/api/books/${book.id}/read/`, {
                          method: "POST",
                          body: JSON.stringify({
                            pages: num
                          })
                        }).then(res => res.json()).then(console.log)
                      }
                    }}
                  />
                ) : (
                  <div>Отметить страницы</div>
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function BooksPage() {
  const [createLoading, setCreateLoading] = useState(false);
  const form = useForm<z.infer<typeof bookSchema>>({
    resolver: zodResolver(bookSchema),
  });
  const [books, setBooks] = useState<any[]>([]);

  function onSubmit(values: z.infer<typeof bookSchema>) {
    setCreateLoading(true);
    fetch("/api/books", {
      method: "POST",
      body: JSON.stringify(values),
    })
      .then((res) => res.json())
      .then((data) => {
        setCreateLoading(false);
        console.log(data);
        form.reset({
          title: "",
          author: "",
          pages: 0,
        });
      });
  }

  useEffect(() => {
    fetch("/api/books")
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setBooks(data);
      });
  }, []);

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
              // onClick={createBook}
              type="submit"
              disabled={createLoading}
            >
              {createLoading ? (
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
        {books.map((book: Book) => (
          <BookView book={book} key={book.id} />
        ))}
      </div>
    </div>
  );
}
