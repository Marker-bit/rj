"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Check,
  ChevronLeft,
  LogOut,
  Plus,
  X
} from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { CropImage } from "@/components/crop-image";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
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
import { validateRequest } from "@/lib/validate-request";
import { useMutation } from "@tanstack/react-query";
import { useDropzone } from "@uploadthing/react";
import { User } from "lucia";
import Image from "next/image";
import { generateClientDropzoneAccept } from "uploadthing/client";

const formSchema = z.object({
  username: z
    .string()
    .min(2)
    .max(50)
    .refine(async (val) => {
      const { user } = await validateRequest();
      if (val === user.username) return true;
      const res = await fetch(`/api/auth/username?username=${val}`);
      const data = await res.json();
      return !data.found;
    }, ""),
  firstName: z.string().min(1, "Требуется имя").max(50),
  lastName: z.string().min(1, "Требуется фамилия").max(50),
  avatarUrl: z.string().optional(),
  shareSubscriptions: z
    .enum(["ALL", "SUBS", "NONE"])
    .default("NONE")
    .optional(),
  shareFollowers: z.enum(["ALL", "SUBS", "NONE"]).default("NONE").optional(),
  shareStats: z.enum(["ALL", "SUBS", "NONE"]).default("NONE").optional(),
});

export default function SettingsPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [logOutLoading, setLogOutLoading] = useState(false);
  const [usernameFound, setUsernameFound] = useState<boolean | null>(null);
  const [cropOpen, setCropOpen] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      firstName: "",
      lastName: "",
      avatarUrl: "",
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

  useEffect(() => {
    setIsMounted(true);
  }, []);

  function onSubmit(values: z.infer<typeof formSchema>) {
    userMutation.mutate(values);
  }

  const [files, setFiles] = useState<File[]>([]);
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length === 1) {
      setFiles(acceptedFiles);
      setCropOpen(true);
    } else {
      alert("Принимается только 1 файл!");
    }
  }, []);

  const { startUpload, permittedFileInfo } = useUploadThing("avatar", {
    onClientUploadComplete: (res) => {
      // alert("uploaded successfully!");
      form.setValue("avatarUrl", res[0].url);
      setUploadProgress(null);
    },
    onUploadError: () => {
      // alert("error occurred while uploading");
    },
    onUploadBegin: () => {
      // alert("upload has begun");
    },
    onUploadProgress: (p) => {
      // console.log(p);
      setUploadProgress(p);
    },
  });

  const fileTypes = permittedFileInfo?.config
    ? Object.keys(permittedFileInfo?.config)
    : [];

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: fileTypes ? generateClientDropzoneAccept(fileTypes) : undefined,
  });

  useEffect(() => {
    validateRequest().then(({ user }: { user: User }) => {
      form.reset({
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        avatarUrl: user.avatarUrl ?? "",
        shareFollowers: user.shareFollowers,
        shareSubscriptions: user.shareSubscriptions,
        shareStats: user.shareStats,
      });
    });
  }, [form]);

  if (!isMounted) return null;

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="text-5xl font-black m-2 flex gap-2 items-center">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/profile">
                <ChevronLeft className="w-8 h-8" />
              </Link>
            </Button>
            Настройки
            <div className="ml-auto">
              <Button variant="ghost" size="icon" type="submit">
                {userMutation.isPending ? (
                  <Loader className="w-6 h-6" />
                ) : (
                  <Check className="w-6 h-6" />
                )}
              </Button>
            </div>
          </div>
          <div className="m-3 p-4 rounded-md border border-zinc-200">
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
                            className="flex cursor-pointer relative w-fit h-fit"
                            {...getRootProps()}
                          >
                            <Image
                              src={field.value}
                              className="w-20 h-20 rounded-full"
                              width={80}
                              height={80}
                              alt="avatar"
                            />
                            <input {...getInputProps()} />
                            <div
                              className={cn(
                                "absolute top-0 left-0 pointer-events-none w-full h-full bg-white/80 flex items-center justify-center opacity-0 transition-opacity",
                                uploadProgress !== null && "opacity-100"
                              )}
                            >
                              <Loader className="w-4 h-4" />
                            </div>
                          </div>
                        ) : (
                          <div
                            className="w-20 h-20 border border-zinc-200 rounded-full flex items-center justify-center cursor-pointer"
                            {...getRootProps()}
                          >
                            <Plus className="w-4 h-4 text-zinc-500" />
                            <input {...getInputProps()} />
                          </div>
                        )}
                        {uploadProgress !== null && (
                          <div>{uploadProgress}%</div>
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
            </div>
          </div>
          <div className="flex justify-center">
            <Button
              className="items-center gap-2"
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
              {logOutLoading ? (
                <Loader className="w-4 h-4" />
              ) : (
                <LogOut className="size-4" />
              )}
              Выйти из аккаунта
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
