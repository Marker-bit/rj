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
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Loader } from "@/components/ui/loader";
import { useEffect } from "react";
import { validateRequest } from "@/lib/validate-request";
import posthog from "posthog-js";

const formSchema = z.object({
  username: z.string(),
  password: z.string(),
});

export function LoginForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
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
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      const res = await fetch("/api/auth/login", {
        body: JSON.stringify(values),
        method: "POST",
      });
      if (res.ok) {
        const data = await res.json();
        posthog.identify(data.id)
        router.replace("/home");
        toast.success("Вы успешно авторизовались");
      } else {
        const data = await res.json();
        if (data.error) {
          toast.error("Возникла проблема при входе", {
            description: data.error,
          });
          return;
        }
      }
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    userMutation.mutate(values);
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
                  <Input placeholder="ivan.ivanov" {...field} />
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
            Авторизоваться
          </Button>
          <Link href="/auth/register">
            <Button variant="ghost">Нет аккаунта? Зарегистрироваться</Button>
          </Link>
          <Link href="/auth/reset-password">
            <Button variant="outline">Забыл пароль</Button>
          </Link>
        </div>
        <p className="text-xs">
          При авторизации, вы соглашаетесь с{" "}
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
