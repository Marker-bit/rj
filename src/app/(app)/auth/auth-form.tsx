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
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { X, Check, Loader } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  username: z
    .string()
    .min(2)
    .max(50)
    .refine((val) => !val.includes("/"), "/ не разрешён в имени пользователя"),
  password: z.string().min(8),
});

export function AuthForm() {
  const [usernameFound, setUsernameFound] = useState<boolean | null>(null);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const userMutation = useMutation({
    mutationFn: (values: z.infer<typeof formSchema>) => {
      return fetch("/api/auth", {
        body: JSON.stringify(values),
        method: "POST",
      })
        .then((res) => res.json())
        .then(
          (res: { status: "authorized" | "created" | "invalid-password" }) => {
            if (res.status === "authorized") {
              window.location.href = "/";
            } else if (res.status === "created") {
              // router.push("/auth/activate-account");
            } else if (res.status === "invalid-password") {
              alert("Неправильный пароль");
            }
          }
        );
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
                <div className="flex gap-1 items-center">
                  <Input
                    placeholder="ivan.ivanov"
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      fetch(`/api/auth/username?username=${e.target.value}`)
                        .then((res) => res.json())
                        .then((data) => {
                          setUsernameFound(data.found);
                        });
                    }}
                  />

                  {usernameFound === true && <X className="text-red-500" />}
                  {usernameFound === false && (
                    <Check className="text-green-500" />
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
        <Button type="submit" disabled={userMutation.isPending}>
          {userMutation.isPending && (
            <Loader className="w-4 h-4 animate-spin mr-2" />
          )}
          Авторизоваться
        </Button>
        <p className="text-xs">
          При авторизации, вы соглашаетесь с{" "}
          <Link href="/privacy-policy" className="text-blue-500 underline underline-offset-2">политикой конфиденциальности</Link> и с{" "}
          <Link href="/terms-of-service" className="text-blue-500 underline underline-offset-2">условиями использования</Link>
        </p>
      </form>
    </Form>
  );
}
