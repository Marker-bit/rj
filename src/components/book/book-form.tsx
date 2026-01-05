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
import { Textarea } from "@/components/ui/textarea";
import { UploadButton } from "@/components/uploadthing";
import { createBook } from "@/lib/actions/books";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { DialogHeader, DialogTitle } from "../ui/dialog";
import { DrawerDialog } from "../ui/drawer-dialog";
import { Loader } from "../ui/loader";
import { ScanDialog } from "./scan-dialog";
import { bookSchema } from "@/lib/validation/schemas";
import { useQuery } from "@tanstack/react-query";
import posthog from "posthog-js";

export function BookForm({
  onSuccess,
}: {
  onSuccess?: (book: z.input<typeof bookSchema>) => void;
}) {
  const form = useForm<z.input<typeof bookSchema>>({
    resolver: zodResolver(bookSchema),
    defaultValues: {
      title: "",
      author: "",
      pages: 0,
      coverUrl: "",
      description: "",
      fields: [],
    },
  });
  const [fileUploading, setFileUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [scanDialogOpen, setScanDialogOpen] = useState(false);
  const router = useRouter();
  const { data: aiEnabled } = useQuery({
    queryKey: ["ai", "enabled"],
    queryFn: async () =>
      await fetch("/api/chat/allowed")
        .then((r) => r.json())
        .then((r) => r.aiEnabled as boolean),
  });

  const { fields, append, remove } = useFieldArray({
    name: "fields",
    control: form.control,
  });

  async function onSubmit(values: z.input<typeof bookSchema>) {
    setLoading(true);
    await createBook(values);
    setLoading(false);
    router.refresh();
    window.location.reload();
    form.reset({
      title: "",
      author: "",
      pages: 0,
      coverUrl: "",
      description: "",
      fields: [],
    });
    if (onSuccess) onSuccess(values);
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
          {aiEnabled && (
            <ScanDialog
              reset={form.reset}
              open={scanDialogOpen}
              setOpen={setScanDialogOpen}
            />
          )}
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
                        variant="outline"
                        onClick={() => field.onChange("")}
                        type="button"
                        className="dark:bg-background dark:hover:bg-accent"
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
                        button: ({ ready, isUploading }) =>
                          isUploading || fileUploading
                            ? "Загрузка..."
                            : ready
                            ? "Обложка"
                            : "Подождите...",
                        allowedContent: "Картинка (до 8МБ)",
                      }}
                      onClientUploadComplete={(res) => {
                        field.onChange(res[0].ufsUrl);
                        setFileUploading(false);
                      }}
                      onUploadError={(error: Error) => {
                        toast.error("Ошибка при загрузке обложки", {
                          description: error.message,
                        });
                      }}
                      onUploadBegin={(fileName) => {
                        setFileUploading(true);
                      }}
                      className="ut-button:bg-blue-500 ut-button:ut-readying:bg-blue-500/50 ut-button:px-4 ut-button:ut-uploading:bg-blue-500/50"
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
          <div className="flex flex-col gap-2">
            {fields.map((field, index) => (
              <FormItem key={field.id}>
                <FormLabel className={cn(index !== 0 ? "sr-only" : "mt-2")}>
                  Поля
                </FormLabel>
                <FormDescription className={cn(index !== 0 && "sr-only")}>
                  Добавьте дополнительные поля с информацией о книге.
                </FormDescription>
                <FormControl>
                  <div className="flex flex-col items-center gap-2 sm:flex-row">
                    <FormField
                      control={form.control}
                      name={`fields.${index}.title`}
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <Input {...field} placeholder="Название поля" />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`fields.${index}.value`}
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <Input {...field} placeholder="Значение поля" />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => remove(index)}
                    >
                      <X className="size-4" />
                    </Button>
                  </div>
                </FormControl>
              </FormItem>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-2 place-self-start"
              onClick={() => append({ title: "", value: "" })}
            >
              <Plus />
              Добавить поле
            </Button>
          </div>
          <Button type="submit" disabled={loading || fileUploading}>
            {loading ? <Loader invert className="mr-2 size-4" /> : <Plus />}
            Создать
          </Button>
        </form>
      </Form>
    </>
  );
}

export function AddBookDialog({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  return (
    <>
      <DrawerDialog open={open} onOpenChange={setOpen} className="min-w-[50vw]">
        <DialogHeader>
          <DialogTitle>Добавить книгу</DialogTitle>
        </DialogHeader>
        <div className="p-4">
          <BookForm
            onSuccess={(book) => {
              posthog.capture("book_created", {
                title: book.title,
                author: book.author,
                pages: book.pages,
              });
              setOpen(false);
            }}
          />
        </div>
      </DrawerDialog>
    </>
  );
}
