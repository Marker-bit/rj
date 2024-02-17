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
import { Label } from "@/components/ui/label";

const formSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
});

export default function Page() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
    },
  });
  const router = useRouter();

  const userMutation = useMutation({
    mutationFn: (values: z.infer<typeof formSchema>) => {
      return fetch("/api/auth", {
        body: JSON.stringify(values),
        method: "PATCH",
      }).then((res) => {
        if (res.status === 200) {
          router.push("/");
        }
      });
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    userMutation.mutate(values);
  }

  useEffect(() => {
    validateRequest().then((res) => {
      setUser(res.user);
    });
    setLoading(false);
  }, []);

  function signUp() {
    setLoading(true);
    fetch("/api/auth", {
      body: JSON.stringify({
        username: "mark",
        password: "hello-world",
      }),
      method: "POST",
    }).then(() => {
      validateRequest().then((res) => {
        setUser(res.user);
        setLoading(false);
      });
    });
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  // if (!user) return redirect("/auth");

  // if (user) {
  //   return (
  //     <div className="flex min-h-screen items-center justify-center">
  //       You are signed up as @{user.username}
  //       <button
  //         onClick={() => {
  //           setLoading(true);
  //           fetch("/api/auth/", {
  //             method: "DELETE",
  //           }).then(() => {
  //             validateRequest().then((res) => {
  //               setUser(res.user);
  //               setLoading(false);
  //             });
  //           });
  //         }}
  //       >
  //         Log out
  //       </button>
  //     </div>
  //   );
  // }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="rounded-xl p-3 border border-zinc-200 md:max-w-[50vw] m-1 max-sm:w-full">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
            <Label>Имя пользователя</Label>
            <Input value={user?.username} disabled />
            <div className="flex gap-2 w-full">
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

            <Button type="submit" disabled={userMutation.isPending}>
              {userMutation.isPending && (
                <Loader className="w-4 h-4 animate-spin" />
              )}
              Сохранить
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
