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
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader, Plus, Trash } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { DialogHeader, DialogTitle } from "../ui/dialog";
import { DrawerDialog } from "../ui/drawer-dialog";

const bookSchema = z.object({
  title: z.string().min(1),
  author: z.string().min(1),
  pages: z.coerce.number<number>().min(1),
  description: z.string().optional(),
  coverUrl: z.string().optional(),
});

export function GroupBookForm({
  onSuccess,
  groupId,
  open,
  setOpen,
}: {
  onSuccess?: () => void;
  groupId: string;
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  const queryClient = useQueryClient();
  const form = useForm<z.input<typeof bookSchema>>({
    resolver: zodResolver(bookSchema),
  });
  const router = useRouter();

  const bookMutation = useMutation({
    mutationFn: (values: z.input<typeof bookSchema>) =>
      fetch(`/api/groups/${groupId}/books`, {
        method: "POST",
        body: JSON.stringify(values),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["books"],
      });
      form.reset({
        title: "",
        author: "",
        pages: NaN,
        coverUrl: "",
        description: "",
      });
      if (onSuccess) onSuccess();
      setOpen(false);
      router.refresh();
    },
  });

  function onSubmit(values: z.input<typeof bookSchema>) {
    bookMutation.mutate(values);
  }

  return (
    <DrawerDialog open={open} onOpenChange={setOpen} className="min-w-[50vw]">
      <DialogHeader>
        <DialogTitle>Добавить книгу</DialogTitle>
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
                        field.onChange(res[0].ufsUrl);
                      }}
                      onUploadError={(error: Error) => {
                        console.error(error);
                      }}
                      className="ut-button:bg-blue-500 ut-button:px-4"
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
                  <Input {...field} type="number" />
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
            Создать
          </Button>
        </form>
      </Form>
    </DrawerDialog>
  );
}
