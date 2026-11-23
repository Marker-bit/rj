"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { SharePeople } from "@/generated/prisma/enums";
import { useMutation } from "@tanstack/react-query";
import type { User as LuciaUser } from "lucia";
import {
  BookOpen,
  Check,
  Download,
  LogOut,
  PlusIcon,
  Shield,
  UserRound,
  X,
  Trash2,
  KeyRound,
} from "lucide-react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useLocalStorage } from "usehooks-ts";
import { z } from "zod";
import { DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { SimpleTooltip } from "@/components/ui/simple-tooltip";
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
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
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
import { USERNAME_REGEX } from "@/lib/api-validate";
import { DEFAULT_FIELDS_STORAGE_KEY } from "@/lib/default-fields";
import { settingsSchema } from "@/lib/validation/schemas";

const AvatarField = dynamic(
  () => import("./avatar-field").then((mod) => mod.AvatarField),
  {
    ssr: false,
    loading: () => <Skeleton className="size-20 rounded-full" />,
  },
);

const categories = [
  { value: "profile", label: "Профиль", icon: UserRound },
  { value: "privacy", label: "Приватность", icon: Shield },
  { value: "reading", label: "Чтение", icon: BookOpen },
  { value: "account", label: "Аккаунт", icon: KeyRound },
];

export function SettingsForm({ user }: { user: LuciaUser }) {
  const [logOutLoading, setLogOutLoading] = useState(false);
  const [usernameBaseline, setUsernameBaseline] = useState(user.username);
  const { found: usernameFound, check: checkUsername } =
    useUsernameAvailability(usernameBaseline);
  const [disableRecs, setDisableRecs] = useLocalStorage("disableRecs", false);
  const [category, setCategory] = useState("profile");
  const router = useRouter();
  const [fields, setFields] = useLocalStorage<string[]>(
    DEFAULT_FIELDS_STORAGE_KEY,
    [],
  );
  const fieldToFocus = useRef<number | null>(null);
  const defaultFields = fields.map((value, index) => ({ value, index }));

  const form = useForm<z.infer<typeof settingsSchema>>({
    resolver: zodResolver(settingsSchema),
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

  const usernameValue = form.watch("username");

  const userMutation = useMutation({
    mutationFn: async (values: z.infer<typeof settingsSchema>) => {
      const req = await fetch("/api/auth", {
        method: "PATCH",
        body: JSON.stringify(values),
      });
      const res = await req.json().catch(() => null);
      if (!req.ok || res?.error) {
        throw new Error(
          typeof res?.error === "string"
            ? res.error
            : "Не удалось сохранить профиль",
        );
      }
    },
    onError: (error) => {
      toast.error("Возникла проблема при обновлении профиля", {
        description: error.message,
      });
    },
    onSuccess: (_data, variables) => {
      toast.success("Профиль обновлен");
      setUsernameBaseline(variables.username);
      router.refresh();
    },
    meta: { errorHandled: true },
  });

  function onSubmit(values: z.infer<typeof settingsSchema>) {
    userMutation.mutate(values);
  }

  return (
    <Form {...form}>
      <form
        className="min-h-0"
        onSubmit={form.handleSubmit(onSubmit, () => setCategory("profile"))}
      >
        <Tabs
          value={category}
          onValueChange={setCategory}
          orientation="vertical"
          className="grid h-full min-h-0 grid-rows-[auto_minmax(0,1fr)] gap-0 md:grid-cols-[13rem_minmax(0,1fr)] md:grid-rows-1"
        >
          <div className="border-b bg-muted/50 px-5 py-4 md:border-r md:border-b-0 md:p-4 md:pt-8">
            <DialogTitle className="mb-3 md:mb-5 md:px-2 md:text-xl md:leading-7">
              Настройки
            </DialogTitle>
            <div className="md:hidden">
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger
                  className="w-full"
                  aria-label="Категория настроек"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent position="popper">
                  {categories.map(({ value, label, icon: Icon }) => (
                    <SelectItem key={value} value={value}>
                      <Icon aria-hidden="true" />
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <TabsList
              aria-label="Категории настроек"
              className="hidden h-auto w-full flex-col items-stretch gap-1 bg-transparent p-0 md:flex"
            >
              {categories.map(({ value, label, icon: Icon }) => (
                <TabsTrigger
                  key={value}
                  value={value}
                  className="flex-none justify-start py-1.5"
                >
                  <Icon className="hidden md:block" aria-hidden="true" />
                  {label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
          <div className="flex min-h-0 min-w-0 flex-col">
            <TabsContent
              value="profile"
              className="min-h-0 space-y-4 overflow-y-auto p-5 md:p-8"
            >
              <h2 className="pr-6 text-xl font-semibold">Профиль</h2>
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
                      {usernameFound === false &&
                        USERNAME_REGEX.test(usernameValue) && (
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
            </TabsContent>
            <TabsContent
              value="privacy"
              className="min-h-0 space-y-4 overflow-y-auto p-5 md:p-8"
            >
              <h2 className="pr-6 text-xl font-semibold">Приватность</h2>
              <FormField
                control={form.control}
                name="shareFollowers"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Кто видит ваших подписчиков?</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="ALL">Все</SelectItem>
                        <SelectItem value="SUBS">
                          Только мои подписки
                        </SelectItem>
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
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="ALL">Все</SelectItem>
                        <SelectItem value="SUBS">
                          Только мои подписки
                        </SelectItem>
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
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="ALL">Все</SelectItem>
                        <SelectItem value="SUBS">
                          Только мои подписки
                        </SelectItem>
                        <SelectItem value="NONE">Только я</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </TabsContent>
            <TabsContent
              value="reading"
              className="min-h-0 space-y-4 overflow-y-auto p-5 md:p-8"
            >
              <h2 className="pr-6 text-xl font-semibold">Чтение</h2>
              <FormField
                control={form.control}
                name="hideActivity"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between gap-3 rounded-lg border p-4">
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
              <div className="flex flex-row items-center justify-between gap-3 rounded-lg border p-4">
                <div className="space-y-0.5">
                  <Label
                    htmlFor="disable-recommendations"
                    className="text-base"
                  >
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
              <section
                className="space-y-3 rounded-lg border p-4"
                aria-labelledby="default-book-fields"
              >
                <div className="space-y-0.5">
                  <h3 id="default-book-fields" className="font-medium">
                    Поля по умолчанию
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Эти поля добавляются к новым книгам. Изменения сохраняются
                    автоматически в этом браузере.
                  </p>
                </div>
                {defaultFields.map(({ value, index }) => (
                  <div className="flex items-center gap-2" key={index}>
                    <Input
                      ref={(input) => {
                        if (input && fieldToFocus.current === index) {
                          fieldToFocus.current = null;
                          input.focus();
                        }
                      }}
                      aria-label={`Название поля ${index + 1}`}
                      value={value}
                      onChange={(event) => {
                        const title = event.target.value;
                        setFields((currentFields) =>
                          currentFields.map((field, fieldIndex) =>
                            fieldIndex === index ? title : field,
                          ),
                        );
                      }}
                      onKeyDown={(event) => {
                        if (
                          event.key === "Enter" &&
                          !event.nativeEvent.isComposing
                        ) {
                          event.preventDefault();
                        }
                      }}
                      placeholder="Название поля"
                    />
                    <SimpleTooltip text="Удалить поле">
                      <Button
                        size="icon"
                        variant="ghost"
                        type="button"
                        className="shrink-0"
                        aria-label={`Удалить поле ${index + 1}`}
                        onClick={() =>
                          setFields((currentFields) =>
                            currentFields.filter(
                              (_, fieldIndex) => fieldIndex !== index,
                            ),
                          )
                        }
                      >
                        <Trash2 />
                      </Button>
                    </SimpleTooltip>
                  </div>
                ))}
                <Button
                  size="sm"
                  variant="outline"
                  type="button"
                  onClick={() => {
                    fieldToFocus.current = fields.length;
                    setFields((currentFields) => [...currentFields, ""]);
                  }}
                >
                  <PlusIcon data-icon="inline-start" />
                  Добавить поле
                </Button>
              </section>
            </TabsContent>
            <TabsContent
              value="account"
              className="min-h-0 space-y-4 overflow-y-auto p-5 md:p-8"
            >
              <h2 className="pr-6 text-xl font-semibold">Аккаунт</h2>
              <Item variant="outline">
                <ItemMedia variant="icon">
                  <Download aria-hidden="true" />
                </ItemMedia>
                <ItemContent className="min-w-0 basis-40">
                  <ItemTitle>Экспорт данных</ItemTitle>
                  <ItemDescription>
                    Скачайте копию книг, журнала и групп в JSON или YAML.
                  </ItemDescription>
                </ItemContent>
                <ItemActions className="ml-auto">
                  <ExportDataButton type="button" />
                </ItemActions>
              </Item>
              <Item variant="outline">
                <ItemMedia variant="icon">
                  <LogOut aria-hidden="true" />
                </ItemMedia>
                <ItemContent className="min-w-0 basis-40">
                  <ItemTitle>Текущий сеанс</ItemTitle>
                  <ItemDescription>
                    Завершите сеанс в этом браузере.
                  </ItemDescription>
                </ItemContent>
                <ItemActions className="ml-auto">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={async () => {
                      setLogOutLoading(true);
                      try {
                        const response = await fetch("/api/auth/", {
                          method: "DELETE",
                        });
                        if (!response.ok)
                          throw new Error("Не удалось выйти из аккаунта");
                        router.replace("/");
                      } catch {
                        toast.error("Не удалось выйти из аккаунта");
                      } finally {
                        setLogOutLoading(false);
                      }
                    }}
                    disabled={logOutLoading}
                  >
                    {logOutLoading && <Loader className="size-4" />}
                    Выйти
                  </Button>
                </ItemActions>
              </Item>
            </TabsContent>
            {category !== "account" && (
              <div className="flex justify-end border-t px-5 py-3 md:px-8">
                <Button type="submit" disabled={userMutation.isPending}>
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
              </div>
            )}
          </div>
        </Tabs>
      </form>
    </Form>
  );
}
