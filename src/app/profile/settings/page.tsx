"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Check,
  ChevronLeft,
  Edit,
  Loader,
  LogOut,
  Save,
  X,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
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
import { validateRequest } from "@/lib/validate-request";
import { User } from "lucia";
import { useMutation } from "@tanstack/react-query";

const formSchema = z.object({
  username: z
    .string()
    .min(2)
    .max(50)
    .refine(async (val) => {
      const {user} = await validateRequest();
      if (val === user.username) return true;
      const res = await fetch(`/api/auth/username?username=${val}`)
      const data = await res.json();
      return !data.found;
    }, ""),
  firstName: z.string().min(1, "Требуется имя").max(50),
  lastName: z.string().min(1, "Требуется фамилия").max(50),
});

export default function SettingsPage() {
  const [logOutLoading, setLogOutLoading] = useState(false);
  const [usernameFound, setUsernameFound] = useState<boolean | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      firstName: "",
      lastName: "",
    },
  });

  const userMutation = useMutation({
    mutationFn: (values: z.infer<typeof formSchema>) => {
      return fetch("/api/auth", {
        method: "PATCH",
        body: JSON.stringify(values),
      });
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    userMutation.mutate(values);
  }

  useEffect(() => {
    validateRequest().then(({ user }: { user: User }) => {
      form.reset({
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
      });
    });
  }, [form]);

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex p-1 items-center bg-zinc-100 border-b border-zinc-200 min-h-10">
            <Link href="/profile">
              <button className="p-1 hover:text-blue-600 rounded-md flex items-center gap-1 text-blue-500 active:scale-95 transition-all">
                <ChevronLeft className="w-6 h-6" />
                <div className="font-semibold">Профиль</div>
              </button>
            </Link>
            <div className="font-semibold absolute left-[50%] translate-x-[-50%]">
              Настройки
            </div>
            <button className="p-1 hover:text-blue-600 rounded-md flex items-center gap-1 text-blue-500 active:scale-95 transition-all ml-auto">
              {userMutation.isPending ? (
                <Loader className="w-6 h-6 animate-spin" />
              ) : (
                <Check className="w-6 h-6" />
              )}
            </button>
          </div>
          <div className="m-3 p-4 rounded-md border border-zinc-200">
            <div className="space-y-2">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Имя пользователя</FormLabel>
                    <FormControl>
                      <div className="flex items-center gap-2">
                        <Input
                          {...field}
                          onChange={(e) => {
                            field.onChange(e);
                            fetch(
                              `/api/auth/username?username=${e.target.value}`
                            )
                              .then((res) => res.json())
                              .then((data) => {
                                setUsernameFound(data.found);
                              });
                          }}
                        />
                        {usernameFound === true && (
                          <X className="text-red-500 w-8 h-8" />
                        )}
                        {usernameFound === false && (
                          <Check className="text-green-500 w-8 h-8" />
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
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
                  <FormItem>
                    <FormLabel>Фамилия</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <button
            className="flex gap-2 items-center w-fit bg-gray-100 rounded-xl py-1 px-3 active:opacity-50 transition-all select-none disabled:opacity-40 border border-zinc-200 mx-auto"
            onClick={() => {
              setLogOutLoading(true);
              fetch("/api/auth/", {
                method: "DELETE",
              }).then(() => {
                setLogOutLoading(false);
                window.location.href = "/";
              });
            }}
          >
            {logOutLoading ? (
              <Loader className="w-6 h-6 animate-spin" />
            ) : (
              <LogOut className="w-6 h-6" />
            )}
            Выйти из аккаунта
          </button>
        </form>
      </Form>
    </div>
  );
}
