"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Check, LogOut, Plus, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { CropImage } from "@/components/crop-image";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUploadThing } from "@/components/uploadthing";
import { cn } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { useDropzone } from "@uploadthing/react";
import Image from "next/image";
import {
  generateClientDropzoneAccept,
  generatePermittedFileTypes,
} from "uploadthing/client";
import { toast } from "sonner";
import { User as LuciaUser } from "lucia";
import { SharePeople } from "@prisma/client";
import { Switch } from "@/components/ui/switch";
import ExportDataButton from "@/components/users/export-data-button";
import { useLocalStorage } from "usehooks-ts";

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
  const [usernameFound, setUsernameFound] = useState<boolean | null>();
  const [cropOpen, setCropOpen] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [disableRecs, setDisableRecs] = useLocalStorage("disableRecs", false);
  const [isClient, setIsClient] = useState(false);

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
    mutationFn: (values: z.infer<typeof formSchema>) => {
      return fetch("/api/auth", {
        method: "PATCH",
        body: JSON.stringify(values),
      })
        .then((res) => res.json())
        .then((res) => {
          if (res.error) {
            toast.error("Возникла проблема при обновлении профиля", {
              description: res.error,
            });
            throw new Error(res.error);
          }
        });
    },
    onSuccess: () => {
      toast.success("Профиль обновлен");
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    userMutation.mutate(values);
  }

  const [files, setFiles] = useState<File[]>([]);
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length === 1) {
      setFiles(acceptedFiles);
      setCropOpen(true);
    } else {
      toast.error("Принимается только 1 файл!");
    }
  }, []);

  const { startUpload, routeConfig } = useUploadThing("avatar", {
    onClientUploadComplete: (res) => {
      form.setValue("avatarUrl", res[0].ufsUrl);
      setUploadProgress(null);
    },
    onUploadError: (err) => {
      toast.error("Произошла ошибка при загрузке файла");
    },
    onUploadBegin: () => {
      // alert("upload has begun");
    },
    onUploadProgress: (p) => {
      // console.log(p);
      setUploadProgress(p);
    },
  });

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: generateClientDropzoneAccept(
      generatePermittedFileTypes(routeConfig).fileTypes
    ),
  });

  if (!isClient) {
    return null;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="m-3 rounded-md border p-4">
          <div className="space-y-2">
            <FormField
              control={form.control}
              name="avatarUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Аватар</FormLabel>
                  <FormControl>
                    <div className="flex flex-col gap-2">
                      {field.value ? (
                        <div
                          className="relative flex size-fit cursor-pointer"
                          {...getRootProps()}
                        >
                          <Image
                            src={field.value}
                            className="size-20 rounded-full"
                            width={80}
                            height={80}
                            alt="avatar"
                          />
                          <input
                            disabled={uploadProgress !== null}
                            {...getInputProps()}
                          />
                          <div
                            className={cn(
                              "absolute top-0 left-0 pointer-events-none w-full h-full bg-black/80 flex flex-col items-center justify-center opacity-0 text-white transition-opacity",
                              uploadProgress !== null && "opacity-100"
                            )}
                          >
                            <Loader className="size-4" />
                            {uploadProgress !== null && (
                              <div>{uploadProgress}%</div>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div
                          className="flex size-20 cursor-pointer items-center justify-center rounded-full border"
                          {...getRootProps()}
                        >
                          <Plus className="size-4 text-zinc-500" />
                          <input
                            disabled={uploadProgress !== null}
                            {...getInputProps()}
                          />
                        </div>
                      )}
                      {files.length > 0 && (
                        <CropImage
                          open={cropOpen}
                          setOpen={setCropOpen}
                          file={files[0]}
                          onSelect={(file) => {
                            startUpload([file]);
                          }}
                        />
                      )}
                    </div>
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
                  <FormControl>
                    <div className="flex items-center gap-2">
                      <Input
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          if (e.target.value === user.username) {
                            setUsernameFound(undefined);
                            return;
                          }
                          setUsernameFound(null);
                          fetch(`/api/auth/username?username=${e.target.value}`)
                            .then((res) => res.json())
                            .then((data) => {
                              setUsernameFound(
                                e.target.value === user.username
                                  ? false
                                  : data.found
                              );
                            });
                        }}
                      />
                      {usernameFound === true && (
                        <X className="size-8 text-red-500" />
                      )}
                      {usernameFound === false && (
                        <Check className="size-8 text-green-500" />
                      )}
                      {usernameFound === null && <Loader className="size-8" />}
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
                <FormLabel className="text-base">
                  Не показывать рекомендации
                </FormLabel>
                <FormDescription>
                  Включите, чтобы еженедельные баннеры рекомендаций больше не
                  появлялись
                </FormDescription>
              </div>
              <div>
                <Switch
                  checked={disableRecs}
                  onCheckedChange={setDisableRecs}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-center gap-2">
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
            variant="outline"
            onClick={() => {
              setLogOutLoading(true);
              fetch("/api/auth/", {
                method: "DELETE",
              }).then(() => {
                setLogOutLoading(false);
                window.location.href = "/";
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
