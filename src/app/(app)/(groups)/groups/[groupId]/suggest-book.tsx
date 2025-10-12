"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UploadButton } from "@/components/uploadthing";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader, Plus, Trash } from "lucide-react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { DrawerDialog } from "@/components/ui/drawer-dialog";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import { useState } from "react";

const bookSchema = z.object({
  title: z.string().min(1),
  author: z.string().min(1),
  pages: z.number().min(1),
  description: z.string().optional(),
  coverUrl: z.string().optional(),
});

export function SuggestBook({ groupId }: { groupId: string }) {
  const [open, setOpen] = useState(false);
  const form = useForm<z.infer<typeof bookSchema>>({
    resolver: standardSchemaResolver(bookSchema),
  });
  const router = useRouter();

  const bookMutation = useMutation({
    mutationFn: (values: z.infer<typeof bookSchema>) =>
      fetch(`/api/groups/${groupId}/suggest`, {
        method: "POST",
        body: JSON.stringify(values),
      }),
    onSuccess: () => {
      form.reset({
        title: "",
        author: "",
        pages: NaN,
        coverUrl: "",
        description: "",
      });
      setOpen(false);
      router.refresh();
    },
  });

  function onSubmit(values: z.infer<typeof bookSchema>) {
    bookMutation.mutate(values);
  }

  return (
    <>
      <Button
        className="gap-1 max-sm:size-fit max-sm:p-2"
        onClick={() => setOpen(true)}
      >
        <Plus className="size-4" />
        <div className="max-sm:hidden">Предложить книгу</div>
      </Button>
      <DrawerDialog open={open} onOpenChange={setOpen} className="min-w-[50vw]">
        <DialogHeader>
          <DialogTitle>Предложить книгу</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
            <FormField
              control={form.control}
              name="coverUrl"
              render={({ field }) => (
                <FormItem>
                  {field.value ? (
                    <div className="relative w-fit">
                      <Image
                        src={field.value}
                        width={500}
                        height={500}
                        className="h-52 w-auto rounded-md"
                        alt="cover"
                      />
                      <div className="absolute right-0 top-2 flex translate-x-1/2 flex-col gap-2">
                        <Button
                          size="icon"
                          className="size-fit p-1"
                          variant="outline"
                          onClick={() => field.onChange("")}
                          type="button"
                        >
                          <Trash className="size-4" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <UploadButton
                        endpoint="bookCover"
                        content={{
                          button: "Обложка",
                          allowedContent: "Картинка (до 8МБ)",
                        }}
                        onClientUploadComplete={(res) => {
                          field.onChange(res[0].url);
                        }}
                        onUploadError={(error: Error) => {
                          alert(`ERROR! ${error.message}`);
                        }}
                        appearance={{
                          allowedContent: "text-black/70 dark:text-white/70",
                        }}
                      />
                    </div>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Название</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="author"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Автор</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="pages"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Кол-во страниц</FormLabel>
                  <FormControl>
                    <Input {...field} onChange={field.onChange} type="number" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Описание</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={bookMutation.isPending}>
              {bookMutation.isPending ? (
                <Loader className="animate-spin" />
              ) : (
                <Plus />
              )}
              Предложить
            </Button>
          </form>
        </Form>
      </DrawerDialog>
    </>
  );
}
