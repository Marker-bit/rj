"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { SharePeople } from "@/generated/prisma/enums";
import { useMutation } from "@tanstack/react-query";
import type { User as LuciaUser } from "lucia";
import { Check, LogOut, PlusIcon, X, XIcon } from "lucide-react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useLocalStorage } from "usehooks-ts";
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
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import ExportDataButton from "@/components/users/export-data-button";
import { useUsernameAvailability } from "@/hooks/use-username-availability";
import { DEFAULT_FIELDS_STORAGE_KEY } from "@/lib/default-fields";

const AvatarField = dynamic(
  () => import("./avatar-field").then((mod) => mod.AvatarField),
  {
    ssr: false,
    loading: () => <Skeleton className="size-20 rounded-full" />,
  },
);

const formSchema = z.object({
  username: z
    .string()
    .min(2, "Минимум 2 символа")
    .max(50, "Максимум 50 символов"),
  firstName: z.string().min(1, "Требуется имя").max(50),
  lastName: z.string().max(50, "Максимум 50 символов").optional(),
  avatarUrl: z.string().optional(),
  shareSubscriptions: z
    .enum(["ALL", "SUBS", "NONE"])
    .default("NONE")
    .optional(),
  shareFollowers: z.enum(["ALL", "SUBS", "NONE"]).default("NONE").optional(),
  shareStats: z.enum(["ALL", "SUBS", "NONE"]).default("NONE").optional(),
  hideActivity: z.boolean(),
});

export function SettingsForm({ user }: { user: LuciaUser }) {
  const [logOutLoading, setLogOutLoading] = useState(false);
  const { found: usernameFound, check: checkUsername } =
    useUsernameAvailability(user.username);
  const [disableRecs, setDisableRecs] = useLocalStorage("disableRecs", false);
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();
  const [fields, setFields] = useLocalStorage<string[]>(
    DEFAULT_FIELDS_STORAGE_KEY,
    [],
  );
  const defaultFields = fields.map((value, fieldIndex) => ({
    value,
    storageIndex: fieldIndex,
    key: fieldIndex,
  }));

  useEffect(() => {
    setIsClient(true);
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: user.username,
      firstName: user.firstName ?? "",
      lastName: user.lastName ?? "",
      avatarUrl: user.avatarUrl ?? "",
      shareFollowers:
        user.shareFollowers === SharePeople.ALL
          ? "ALL"
          : user.shareFollowers === SharePeople.SUBS
            ? "SUBS"
            : "NONE",
      shareSubscriptions:
        user.shareSubscriptions === SharePeople.ALL
          ? "ALL"
          : user.shareSubscriptions === SharePeople.SUBS
            ? "SUBS"
            : "NONE",
      shareStats:
        user.shareStats === SharePeople.ALL
          ? "ALL"
          : user.shareStats === SharePeople.SUBS
            ? "SUBS"
            : "NONE",
      hideActivity: user.hideActivity,
    },
  });

  const userMutation = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      const req = await fetch("/api/auth", {
        method: "PATCH",
        body: JSON.stringify(values),
      });
      const res = await req.json();
      if (res.error) {
        toast.error("Возникла проблема при обновлении профиля", {
          description: res.error,
        });
        throw new Error(res.error);
      }
    },
    onSuccess: () => {
      toast.success("Профиль обновлен");
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    userMutation.mutate(values);
  }

  if (!isClient) {
    return (
      <div className="m-3 flex flex-col gap-3 rounded-md border p-4">
        <Skeleton className="size-20 rounded-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="m-3 rounded-md border p-4">
          <div className="space-y-2">
            <h2 className="text-lg font-semibold">Профиль</h2>
            <FormField
              control={form.control}
              name="avatarUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Аватар</FormLabel>
                  <FormControl>
                    <AvatarField
                      value={field.value}
                      onChange={(url) => field.onChange(url)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Имя пользователя</FormLabel>
                  <div className="flex items-center gap-2">
                    <FormControl>
                      <Input
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          checkUsername(e.target.value);
                        }}
                      />
                    </FormControl>
                    {usernameFound === true && (
                      <X
                        className="size-8 text-red-500"
                        aria-label="Имя пользователя занято"
                        role="img"
                      />
                    )}
                    {usernameFound === false && (
                      <Check
                        className="size-8 text-green-500"
                        aria-label="Имя пользователя свободно"
                        role="img"
                      />
                    )}
                    {usernameFound === null && <Loader className="size-8" />}
                  </div>
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
            <h2 className="pt-2 text-lg font-semibold">Приватность</h2>
            <FormField
              control={form.control}
              name="shareFollowers"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Кто видит ваших подписчиков?</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="ALL">Все</SelectItem>
                      <SelectItem value="SUBS">Только мои подписки</SelectItem>
                      <SelectItem value="NONE">Только я</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="shareSubscriptions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Кто видит ваши подписки?</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="ALL">Все</SelectItem>
                      <SelectItem value="SUBS">Только мои подписки</SelectItem>
                      <SelectItem value="NONE">Только я</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="shareStats"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Кто видит вашу статистику?</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="ALL">Все</SelectItem>
                      <SelectItem value="SUBS">Только мои подписки</SelectItem>
                      <SelectItem value="NONE">Только я</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex flex-wrap gap-2 items-center justify-start">
              <div className="font-semibold mr-4">Поля по умолчанию</div>
              {defaultFields.map((defaultField) => (
                <div className="flex gap-2 w-40" key={defaultField.key}>
                  <Input
                    value={defaultField.value}
                    onChange={(evt) =>
                      setFields((currentFields) => {
                        const nextFields = [...currentFields];
                        nextFields[defaultField.storageIndex] =
                          evt.target.value;
                        return nextFields;
                      })
                    }
                    placeholder={`Поле ${defaultField.storageIndex + 1}`}
                  />
                  <Button
                    size="icon"
                    variant="outline"
                    type="button"
                    onClick={() =>
                      setFields((currentFields) => {
                        return currentFields.filter(
                          (_, fieldIndex) =>
                            fieldIndex !== defaultField.storageIndex,
                        );
                      })
                    }
                  >
                    <XIcon />
                  </Button>
                </div>
              ))}
              <Button
                size="icon"
                variant="outline"
                type="button"
                onClick={() =>
                  setFields((currentFields) => [...currentFields, ""])
                }
              >
                <PlusIcon />
              </Button>
            </div>
            <h2 className="pt-2 text-lg font-semibold">Чтение</h2>
            <FormField
              control={form.control}
              name="hideActivity"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      Скрывать активность
                    </FormLabel>
                    <FormDescription>
                      На вкладке &quot;Активность&quot; не будут отображаться
                      ваши события чтения.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <div className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <Label htmlFor="disable-recommendations" className="text-base">
                  Не показывать рекомендации
                </Label>
                <p
                  id="disable-recommendations-description"
                  className="text-sm text-muted-foreground"
                >
                  Включите, чтобы еженедельные баннеры рекомендаций больше не
                  появлялись
                </p>
              </div>
              <div>
                <Switch
                  id="disable-recommendations"
                  aria-describedby="disable-recommendations-description"
                  checked={disableRecs}
                  onCheckedChange={setDisableRecs}
                />
              </div>
            </div>
          </div>
        </div>
        <h2 className="mb-2 text-center text-lg font-semibold">Аккаунт</h2>
        <div className="mx-3 flex flex-wrap justify-center gap-2">
          <Button type="submit">
            {userMutation.isPending ? (
              <>
                <Loader invert className="mr-2 size-6" />
                Сохранение...
              </>
            ) : (
              <>
                <Check />
                Сохранить
              </>
            )}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setLogOutLoading(true);
              fetch("/api/auth/", {
                method: "DELETE",
              }).then(() => {
                setLogOutLoading(false);
                router.replace("/");
              });
            }}
            disabled={logOutLoading}
          >
            {logOutLoading ? <Loader className="mr-2 size-4" /> : <LogOut />}
            Выйти из аккаунта
          </Button>
          <ExportDataButton type="button" />
        </div>
      </form>
    </Form>
  );
}
