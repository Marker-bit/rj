"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
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
import { Input } from "@/components/ui/input";
import { Loader } from "@/components/ui/loader";
import { resetPassword } from "@/lib/actions/auth";

const formSchema = z.object({
  username: z
    .string({ error: "Поле обязательно для заполнения" })
    .min(1, "Поле обязательно для заполнения"),
  name: z
    .string({ error: "Поле обязательно для заполнения" })
    .min(1, "Поле обязательно для заполнения"),
  book1: z.object({
    title: z
      .string({ error: "Поле обязательно для заполнения" })
      .min(1, "Поле обязательно для заполнения"),
    author: z.string().optional(),
    pages: z.coerce
      .number<number>({
        error: "Поле обязательно для заполнения",
      })
      .min(1)
      .optional(),
  }),
  book2: z.object({
    title: z
      .string({ error: "Поле обязательно для заполнения" })
      .min(1, "Поле обязательно для заполнения"),
    author: z.string().optional(),
    pages: z.coerce
      .number<number>({
        error: "Поле обязательно для заполнения",
      })
      .min(1)
      .optional(),
  }),
  book3: z.object({
    title: z
      .string({ error: "Поле обязательно для заполнения" })
      .min(1, "Поле обязательно для заполнения"),
    author: z.string().optional(),
    pages: z.coerce
      .number<number>({
        error: "Поле обязательно для заполнения",
      })
      .min(1)
      .optional(),
  }),
  password: z
    .string({ error: "Поле обязательно для заполнения" })
    .min(1, "Поле обязательно для заполнения"),
});

export default function ResetPasswordForm() {
  const form = useForm<z.input<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      name: "",
      book1: {
        title: "",
        author: undefined,
        pages: undefined,
      },
      book2: {
        title: "",
        author: undefined,
        pages: undefined,
      },
      book3: {
        title: "",
        author: undefined,
        pages: undefined,
      },
    },
  });
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function onSubmit(values: z.input<typeof formSchema>) {
    setLoading(true);
    const res = await resetPassword(values);
    setLoading(false);
    if (res.error) {
      toast.error(res.message);
    } else {
      toast.success("Пароль успешно изменен!");
      router.push("/auth/login");
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Имя пользователя</FormLabel>
              <FormControl>
                <div className="flex flex-col gap-1">
                  <Input {...field} />
                </div>
              </FormControl>
              <FormDescription>
                Введите ваше имя пользователя, указанное на платформе, писать @
                не обязательно
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Имя</FormLabel>
              <FormControl>
                <div className="flex flex-col gap-1">
                  <Input {...field} />
                </div>
              </FormControl>
              <FormDescription>
                Введите имя, указанное при регистрации (вторая часть ФИО, не имя
                пользователя)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Новый пароль</FormLabel>
              <FormControl>
                <div className="flex flex-col gap-1">
                  <Input {...field} type="password" />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {[1, 2, 3].map((i) => (
          <>
            <p className="text-lg font-bold">Книга {i}</p>
            <FormField
              control={form.control}
              name={
                `book${i}.title` as
                  | "book1.title"
                  | "book2.title"
                  | "book3.title"
              }
              key={`title-${i}`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Название книги</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={
                `book${i}.author` as
                  | "book1.author"
                  | "book2.author"
                  | "book3.author"
              }
              key={`author-${i}`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Автор книги</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={
                `book${i}.pages` as
                  | "book1.pages"
                  | "book2.pages"
                  | "book3.pages"
              }
              key={`pages-${i}`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Количество страниц</FormLabel>
                  <FormControl>
                    <Input {...field} type="number" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        ))}
        <Button type="submit" disabled={loading}>
          {loading && <Loader invert className="mr-2 size-4" />}
          Сменить пароль
        </Button>
      </form>
    </Form>
  );
}
