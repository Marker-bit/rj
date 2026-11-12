"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";
import { identify } from "@/lib/posthog";
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
import { useUsernameAvailability } from "@/hooks/use-username-availability";
import { authPageHref } from "@/lib/auth-return-path";
import { validateRequest } from "@/lib/validate-request";
import { registerSchema } from "@/lib/validation/schemas";

export function RegisterForm({ returnTo }: { returnTo: string }) {
  const { found: usernameFound, check: fetchUsername } =
    useUsernameAvailability();
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
        router.replace(returnTo);
      }
    })();
  }, [router, returnTo]);

  const userMutation = useMutation({
    mutationFn: async (values: z.infer<typeof registerSchema>) => {
      const res = await fetch("/api/auth/register", {
        body: JSON.stringify(values),
        method: "POST",
      });
      if (res.ok) {
        try {
          const data = await res.json();
          await identify(data.id);
        } catch (error) {
          console.error("Failed to identify user with PostHog:", error);
        }
        router.replace(returnTo);
      } else {
        const data = await res.json();
        if (data.error) {
          toast.error("Возникла проблема при регистрации", {
            description: data.error,
          });
          return;
        }
        throw new Error("Authentication request failed");
      }
    },
    onError: () => {
      toast.error("Возникла проблема при регистрации", {
        description:
          "Не удалось связаться с сервером. Проверьте подключение и попробуйте ещё раз.",
      });
    },
  });

  function onSubmit(values: z.infer<typeof registerSchema>) {
    userMutation.mutate(values);
  }

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
              <div className="flex flex-col gap-1">
                <FormControl>
                  <Input
                    placeholder="ivan.ivanov"
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      fetchUsername(e.target.value);
                    }}
                  />
                </FormControl>

                {usernameFound === true && (
                  <div className="text-xs">
                    Пользователь с таким именем уже существует, выберите другое
                  </div>
                )}
              </div>
              <FormDescription>
                От 3 до 15 символов: латинские буквы, цифры, _, . и -.
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
              <FormDescription>Не менее 8 символов.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex flex-wrap items-center gap-2">
          <Button type="submit" disabled={userMutation.isPending}>
            {userMutation.isPending && <Loader invert className="size-4" />}
            Зарегистрироваться
          </Button>
          <Button variant="ghost" asChild>
            <Link href={authPageHref("login", returnTo)}>
              Есть аккаунт? Войти
            </Link>
          </Button>
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
