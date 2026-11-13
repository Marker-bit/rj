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
import { resetPasswordSchema } from "@/lib/validation/schemas";

export default function ResetPasswordForm() {
  const form = useForm<z.input<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: "",
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
  const [failedBooks, setFailedBooks] = useState<number[]>([]);

  async function onSubmit(values: z.input<typeof resetPasswordSchema>) {
    setLoading(true);
    setFailedBooks([]);
    form.clearErrors([
      "confirmPassword",
      "book1.title",
      "book2.title",
      "book3.title",
    ]);
    try {
      const res = await resetPassword(values);
      if (res.error) {
        if ("failedBooks" in res && res.failedBooks) {
          setFailedBooks(res.failedBooks);
          for (const index of res.failedBooks) {
            form.setError(
              `book${index}.title` as
                | "book1.title"
                | "book2.title"
                | "book3.title",
              {
                message: "Не удалось подтвердить эту книгу",
              },
            );
          }
        }
        toast.error(res.message);
        return;
      }
      toast.success("Пароль изменён. Войдите заново на всех устройствах.");
      router.push("/auth/login");
    } catch {
      toast.error("Не удалось выполнить действие", {
        description: "Проверьте соединение и попробуйте ещё раз.",
      });
    } finally {
      setLoading(false);
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
                <Input {...field} />
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
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Новый пароль</FormLabel>
              <FormControl>
                <Input {...field} type="password" autoComplete="new-password" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Повторите пароль</FormLabel>
              <FormControl>
                <Input {...field} type="password" autoComplete="new-password" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {[1, 2, 3].map((i) => (
          <div
            key={`book-${i}`}
            className={
              failedBooks.includes(i)
                ? "space-y-2 rounded-md border border-red-500/60 p-2"
                : "space-y-2"
            }
          >
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
          </div>
        ))}
        <Button type="submit" disabled={loading}>
          {loading && <Loader invert className="mr-2 size-4" />}
          Сменить пароль
        </Button>
      </form>
    </Form>
  );
}
