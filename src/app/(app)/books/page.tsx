"use client";

import {
  BookMinus,
  ChevronLeft,
  Loader,
  Plus,
  Search,
  Trash,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { string, z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Switch } from "@/components/ui/switch";
import { BookView } from "@/components/book-view";
import { Textarea } from "@/components/ui/textarea";
import { UploadButton } from "@/components/uploadthing";
import { useMediaQuery } from "usehooks-ts";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";

const bookSchema = z.object({
  title: z.string().min(1),
  author: z.string().min(1),
  pages: z.coerce.number().min(1),
  description: z.string().optional(),
  coverUrl: z.string().optional(),
});

function BookForm({ onSuccess }: { onSuccess?: () => void }) {
  const queryClient = useQueryClient();
  const form = useForm<z.infer<typeof bookSchema>>({
    resolver: zodResolver(bookSchema),
  });
  const [search, setSearch] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<
    | {
        title: string;
        authors: string;
        imageUrl: string | null;
      }[]
  >();

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
        coverUrl: "",
        description: "",
      });
      if (onSuccess) onSuccess();
    },
  });

  function onSubmit(values: z.infer<typeof bookSchema>) {
    bookMutation.mutate(values);
  }

  function searchClick() {
    setSearchLoading(true);
    fetch(`/api/labirintSearch?q=${encodeURIComponent(search)}`)
      .then((res) => res.json())
      .then((res) => {
        setSearchLoading(false);
        setSearchResults(res);
      });
  }

  return (
    <>
      <div className="flex flex-col gap-2 mb-2">
        {/* <form
          onSubmit={(evt) => {
            evt.preventDefault();
            searchClick();
          }}
        >
          <div className="flex gap-2">
            <Input
              className="w-full"
              value={search}
              onChange={(evt) => setSearch(evt.target.value)}
              placeholder="Поиск"
            />
            <Button size="icon" disabled={search.length === 0} type="submit">
              {searchLoading ? (
                <Loader className="w-4 h-4 animate-spin" />
              ) : (
                <Search className="w-4 h-4" />
              )}
            </Button>
          </div>
        </form> */}
        <div className="flex md:grid md:grid-cols-2 lg:grid-cols-4 gap-2">
          {searchResults &&
            searchResults.slice(0, 5).map((book) => (
              <button
                key={book.title}
                className="rounded-xl p-3 border border-black/10 flex gap-2"
                onClick={() => {
                  form.reset({
                    title: book.title,
                    author: book.authors,
                    coverUrl: book.imageUrl ?? undefined,
                  });
                  setSearchResults(undefined);
                }}
              >
                {book.imageUrl && (
                  <Image
                    src={book.imageUrl}
                    width={500}
                    height={500}
                    className="w-[20vw] md:w-[15vw] lg:w-[10vw] h-auto rounded-md"
                    alt="cover"
                  />
                )}
                <div className="flex flex-col">
                  <div className="text-xl">{book.title}</div>
                  <div className="text-xs text-black/70 w-fit">
                    {book.authors}
                  </div>
                </div>
              </button>
            ))}
        </div>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
          <FormField
            control={form.control}
            name="coverUrl"
            render={({ field }) => (
              <FormItem>
                {field.value ? (
                  <div className="relative w-fit">
                    <Image
                      src={field.value}
                      width={500}
                      height={500}
                      className="h-52 w-auto rounded-md"
                      alt="cover"
                    />
                    <div className="flex flex-col gap-2 absolute top-2 right-0 translate-x-[50%]">
                      <Button
                        size="icon"
                        className="w-fit h-fit p-1"
                        variant="outline"
                        onClick={() => field.onChange("")}
                        type="button"
                      >
                        <Trash className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <UploadButton
                      endpoint="bookCover"
                      content={{
                        button: "Обложка",
                        allowedContent: "Картинка (до 8МБ)",
                      }}
                      onClientUploadComplete={(res) => {
                        field.onChange(res[0].url);
                      }}
                      onUploadError={(error: Error) => {
                        alert(`ERROR! ${error.message}`);
                      }}
                    />
                  </div>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
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
          <Button type="submit" disabled={bookMutation.isPending}>
            {bookMutation.isPending ? (
              <Loader className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <Plus className="w-4 h-4 mr-2" />
            )}
            Создать
          </Button>
        </form>
      </Form>
    </>
  );
}

function MobileForm() {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [open, setOpen] = useState(false);

  if (isMobile) {
    return (
      <>
        <div className="flex items-center justify-center m-2">
          <Button onClick={() => setOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Добавить книгу
          </Button>
        </div>
        <Drawer open={open} onOpenChange={setOpen}>
          <DrawerContent className="bg-white flex flex-col fixed bottom-0 left-0 right-0 max-h-[96%] rounded-t-[10px]">
            <DrawerHeader>
              <DrawerTitle>Добавить книгу</DrawerTitle>
            </DrawerHeader>
            <div className="p-4">
              <BookForm onSuccess={() => setOpen(false)} />
            </div>
          </DrawerContent>
        </Drawer>
      </>
    );
  }

  return (
    <div className="p-3 bg-zinc-100 border-b border-zinc-300">
      <BookForm />
    </div>
  );
}

export default function BooksPage() {
  const [readBooks, setReadBooks] = useState(false);
  const [notStarted, setNotStarted] = useState(false);

  useEffect(() => {
    const localStorageReadBooks = localStorage.getItem("readBooks");
    const localStorageNotStarted = localStorage.getItem("notStarted");
    if (localStorageReadBooks) {
      setReadBooks(JSON.parse(localStorageReadBooks));
    }
    if (localStorageNotStarted) {
      setNotStarted(JSON.parse(localStorageNotStarted));
    }
  }, []);

  const booksQuery = useQuery({
    queryKey: ["books"],
    queryFn: () => fetch("/api/books").then((res) => res.json()),
  });

  function changeReadBooks() {
    setReadBooks((readBooks) => {
      localStorage.setItem("readBooks", JSON.stringify(!readBooks));
      return !readBooks;
    });
  }
  function changeNotStarted() {
    setNotStarted((notStarted) => {
      localStorage.setItem("notStarted", JSON.stringify(!notStarted));
      return !notStarted;
    });
  }

  let books = booksQuery.data || [];

  if (readBooks) {
    books = books.filter((book: Book) => {
      if (book.readEvents.length === 0) {
        return true;
      }
      return !(book.pages === book.readEvents[0].pagesRead);
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
        <Link href="/home">
          <button className="p-1 hover:text-blue-600 rounded-md flex items-center gap-1 text-blue-500 active:scale-95 transition-all">
            <ChevronLeft className="w-6 h-6" />
            <div className="font-semibold">Главная</div>
          </button>
        </Link>
        <div className="font-semibold absolute left-[50%] translate-x-[-50%]">
          Книги
        </div>
      </div>
      <MobileForm />
      <div className="p-3 flex flex-col gap-2">
        <div
          className="items-center flex space-x-2 cursor-pointer p-2 rounded-md border border-zinc-200 mb-2 hover:bg-zinc-100 transition-all select-none"
          onClick={changeReadBooks}
        >
          <Switch id="readBooks" checked={readBooks} />
          <div
            className="text-sm font-medium leading-none peer-disabled:opacity-70 cursor-pointer select-none"
            onClick={changeReadBooks}
          >
            Скрывать прочитанные книги
          </div>
        </div>
        <div
          className="items-center flex space-x-2 cursor-pointer p-2 rounded-md border border-zinc-200 mb-2 hover:bg-zinc-100 transition-all select-none"
          onClick={changeNotStarted}
        >
          <Switch id="notStarted" checked={notStarted} />
          <div
            className="text-sm font-medium leading-none peer-disabled:opacity-70 cursor-pointer select-none"
            onClick={changeNotStarted}
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
