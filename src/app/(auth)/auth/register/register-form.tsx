"use client";

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
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useDebounceCallback } from "usehooks-ts";
import { z } from "zod";
import { Loader } from "@/components/ui/loader";

const formSchema = z.object({
  username: z
    .string()
    .regex(
      /^[a-zA-Z0-9_.-]{3,15}$/,
      "Имя пользователя должно быть буквенно-цифровой строкой, которая может включать в себя _, . и -, длиной от 3 до 16 символов."
    ),
  password: z
    .string()
    .regex(
      /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&.*-]).{8,}$/,
      "Пароль должен содержать минимум 8 символов, по крайней мере, одну заглавную английскую букву, одну строчную английскую букву, одну цифру и один специальный символ"
    ),
  firstName: z.string({
    required_error: "Имя обязательно",
  }).min(3, "Имя должно содержать минимум 3 символа"),
  lastName: z.string({
    required_error: "Фамилия обязательна",
  }).min(3, "Фамилия должна содержать минимум 3 символа"),
});

export function RegisterForm() {
  const [usernameFound, setUsernameFound] = useState<boolean | null>(null);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });
  const router = useRouter();

  const userMutation = useMutation({
    mutationFn: (values: z.infer<typeof formSchema>) => {
      return fetch("/api/auth/register", {
        body: JSON.stringify(values),
        method: "POST",
      }).then(async (res) => {
        if (res.ok) {
          router.push("/auth/login");
        } else {
          const data = await res.json();
          if (data.error) {
            toast.error("Возникла проблема при регистрации", {
              description: data.error,
            });
            return;
          }
        }
      });
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    userMutation.mutate(values);
  }

  const fetchUsername = useDebounceCallback(
    (username: string) =>
      fetch(`/api/auth/username?username=${username}`)
        .then((res) => res.json())
        .then((data) => {
          setUsernameFound(data.found);
        }),
    200
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
        <div className="flex gap-2 w-full">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Имя</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Фамилия</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Имя пользователя</FormLabel>
              <FormControl>
                <div className="flex flex-col gap-1">
                  <Input
                    placeholder="ivan.ivanov"
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      fetchUsername(e.target.value);
                    }}
                  />

                  {usernameFound === true && (
                    <div className="text-xs">
                      Пользователь с таким именем существует
                    </div>
                  )}
                  {usernameFound === false && (
                    <div className="text-xs">
                      Пользователя с таким именем не существует
                    </div>
                  )}
                </div>
              </FormControl>
              <FormDescription>
                По этому имени пользователя вас можно будет найти в поиске.
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
              <FormLabel>Пароль</FormLabel>
              <FormControl>
                <Input {...field} type="password" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex gap-2 items-center flex-wrap">
          <Button type="submit" disabled={userMutation.isPending}>
            {userMutation.isPending && (
              <Loader invert className="w-4 h-4 mr-2" />
            )}
            Зарегистрироваться
          </Button>
          <Link href="/auth/login">
            <Button variant="ghost">Есть аккаунт? Войти</Button>
          </Link>
        </div>
        <p className="text-xs">
          При регистрации, вы соглашаетесь с{" "}
          <Link
            href="/privacy-policy"
            className="text-blue-500 underline underline-offset-2"
          >
            политикой конфиденциальности
          </Link>{" "}
          и с{" "}
          <Link
            href="/terms-of-service"
            className="text-blue-500 underline underline-offset-2"
          >
            условиями использования
          </Link>
        </p>
      </form>
    </Form>
  );
}
