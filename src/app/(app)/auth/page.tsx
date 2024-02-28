"use client";

import { Check, Loader, X } from "lucide-react";
import { useEffect, useState } from "react";
import type { User } from "lucia";
import { validateRequest } from "@/lib/validate-request";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import { useMutation } from "@tanstack/react-query";
import { redirect, useRouter } from "next/navigation";

const formSchema = z.object({
  username: z
    .string()
    .min(2)
    .max(50)
    .refine((val) => !val.includes("/"), "/ не разрешён в имени пользователя"),
  password: z.string().min(8),
});

export default function Page() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
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
              router.push("/auth/activate-account");
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

  useEffect(() => {
    validateRequest().then((res) => {
      setUser(res.user);
    });
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  if (user) {
    return redirect("/profile");
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      {loading ? (
        <Loader className="w-6 h-6 animate-spin" />
      ) : (
        <div className="rounded-xl p-3 border border-zinc-200 md:max-w-[50vw] m-1">
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
                          <X className="text-red-500" />
                        )}
                        {usernameFound === false && (
                          <Check className="text-green-500" />
                        )}
                      </div>
                    </FormControl>
                    <FormDescription>
                      По этому имени пользователя вас можно будет найти в
                      поиске.
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
            </form>
          </Form>
        </div>
        // <button onClick={signUp}>Login</button>
      )}
    </div>
  );
}
