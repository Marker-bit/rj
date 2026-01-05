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
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDebounceCallback } from "usehooks-ts";
import { z } from "zod";
import { Loader } from "@/components/ui/loader";
import { registerSchema } from "@/lib/validation/schemas";
import { validateRequest } from "@/lib/validate-request";
import posthog from "posthog-js";

export function RegisterForm() {
  const [usernameFound, setUsernameFound] = useState<boolean | null>(null);
  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      password: "",
      firstName: "",
      lastName: "",
    },
  });
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const { user } = await validateRequest();
      if (user) {
        router.replace("/home");
      }
    })();
  }, [router]);

  const userMutation = useMutation({
    mutationFn: async (values: z.infer<typeof registerSchema>) => {
      const res = await fetch("/api/auth/register", {
        body: JSON.stringify(values),
        method: "POST",
      });
      if (res.ok) {
        const data = await res.json();
        posthog.identify(data.id)
        router.push("/home");
      } else {
        const data = await res.json();
        if (data.error) {
          toast.error("Возникла проблема при регистрации", {
            description: data.error,
          });
          return;
        }
      }
    },
  });

  function onSubmit(values: z.infer<typeof registerSchema>) {
    userMutation.mutate(values);
  }

  const fetchUsername = useDebounceCallback(
    (username: string) =>
      fetch(`/api/auth/username?username=${username}`)
        .then((res) => res.json())
        .then((data) => {
          setUsernameFound(data.found);
        }),
    200,
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
        <div className="flex w-full gap-2">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Имя (псевдоним)</FormLabel>
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
                      Пользователь с таким именем уже существует, выберите
                      другое
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
        <div className="flex flex-wrap items-center gap-2">
          <Button type="submit" disabled={userMutation.isPending}>
            {userMutation.isPending && <Loader invert className="size-4" />}
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
