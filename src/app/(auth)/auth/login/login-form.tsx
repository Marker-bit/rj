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
import { useToast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Loader } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

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
  const { toast } = useToast();

  const userMutation = useMutation({
    mutationFn: (values: z.infer<typeof formSchema>) => {
      return fetch("/api/auth/login", {
        body: JSON.stringify(values),
        method: "POST",
      }).then(async (res) => {
        if (res.ok) {
          router.refresh();
        } else {
          const data = await res.json();
          if (data.error) {
            toast({
              title: "Возникла проблема при входе",
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
        <Button type="submit" disabled={userMutation.isPending}>
          {userMutation.isPending && (
            <Loader className="w-4 h-4 animate-spin mr-2" />
          )}
          Авторизоваться
        </Button>
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
