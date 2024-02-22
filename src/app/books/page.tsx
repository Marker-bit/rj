"use client";

import { BookMinus, ChevronLeft, Loader, Plus, Trash } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { z } from "zod";
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
import { BookView } from "../BookView";
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
      if (onSuccess) onSuccess();
    },
  });

  function onSubmit(values: z.infer<typeof bookSchema>) {
    bookMutation.mutate(values);
  }
  return (
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
                    {/* <Button
                          size="icon"
                          className="w-fit h-fit p-1"
                          variant="outline"
                          type="button"
                          onClick={() => uploadImage(field)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button> */}
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
                      // Do something with the response
                      console.log("Files: ", res);
                      field.onChange(res[0].url);
                    }}
                    onUploadError={(error: Error) => {
                      // Do something with the error.
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
  const queryClient = useQueryClient();
  const [readBooks, setReadBooks] = useState(false);
  const [notStarted, setNotStarted] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
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

  const uploadImage = (field: any) => {
    const input = document.createElement("input");
    input.type = "file";
    input.click();
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) {
        return;
      }
      // if (!file?.name.endsWith('.jpg') || !file?.name.endsWith('.jpeg') || !file?.name.endsWith('.png')) {
      //   return;
      // }
      field.onChange("");
      const formData = new FormData();
      formData.append("file", file!);
      setImageLoading(true);
      const resp = await fetch("/api/upload", {
        method: "PUT",
        body: formData,
      });
      const text = await resp.text();
      if (text.includes("Request Entity Too Large")) {
        alert("Файл слишком большой");
        setImageLoading(false);
      }
      const data = JSON.parse(text);
      field.onChange(data.url);
      setImageLoading(false);
    };
  };

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
      {/* <div className="p-3 bg-zinc-100 border-b border-zinc-300">
        <BookForm />
      </div> */}
      <MobileForm />
      <div className="p-3 flex flex-col gap-2">
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
