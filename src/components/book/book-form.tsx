import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import {
  Archive,
  BookOpen,
  EyeOff,
  Library,
  Plus,
  Trash,
  TriangleAlert,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { capture } from "@/lib/posthog";
import { useEffect, useRef, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";
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
import { Textarea } from "@/components/ui/textarea";
import { UploadButton } from "@/components/uploadthing";
import { createBook } from "@/lib/actions/books";
import { revalidate } from "@/lib/actions/revalidate";
import { bookDetailHref } from "@/lib/book-back";
import { DEFAULT_FIELDS_STORAGE_KEY } from "@/lib/default-fields";
import { bookSchema } from "@/lib/validation/schemas";
import { DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";
import { DrawerDialog } from "../ui/drawer-dialog";
import { Loader } from "../ui/loader";
import { ScanDialog } from "./scan-dialog";
import { useWarnAboutDuplicates } from "@/hooks/use-journal-preferences";
import { useReadLocalStorage } from "usehooks-ts";

type BookValues = z.input<typeof bookSchema>;
type DuplicateWarning = Extract<
  Awaited<ReturnType<typeof createBook>>,
  { kind: "duplicate" }
> & { values: BookValues };

const matchStatuses = {
  NONE: { Icon: Library, label: "В библиотеке" },
  ARCHIVED: { Icon: Archive, label: "В архиве" },
  HIDDEN: { Icon: EyeOff, label: "Скрыта" },
};

export function BookForm({
  onSuccess,
  isEdit = false,
}: {
  onSuccess?: (book: z.input<typeof bookSchema>) => void;
  isEdit?: boolean;
}) {
  const [warnAboutDuplicates] = useWarnAboutDuplicates();
  const defaultFields = useReadLocalStorage<string[]>(
    DEFAULT_FIELDS_STORAGE_KEY,
  );
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
  const [pending, setPending] = useState<"check" | "save" | null>(null);
  const loading = pending !== null;
  const saving = useRef(false);
  const [warning, setWarning] = useState<DuplicateWarning>();
  const [lookupFailed, setLookupFailed] = useState(false);
  const warningHeading = useRef<HTMLHeadingElement>(null);
  const [scanDialogOpen, setScanDialogOpen] = useState(false);
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

  const pages = form.watch("pages");

  useEffect(() => {
    if (Array.isArray(defaultFields)) {
      form.setValue(
        "fields",
        defaultFields.map((d) => ({ title: d, value: "" })),
      );
    }
  }, [defaultFields, form]);

  useEffect(() => {
    if (warning) warningHeading.current?.focus();
  }, [warning]);

  async function save(values: BookValues, mode?: "add-anyway") {
    if (saving.current || fileUploading) return;
    saving.current = true;
    const createMode = warnAboutDuplicates ? mode : "add-anyway";
    setPending(createMode === "add-anyway" ? "save" : "check");
    try {
      const result = await createBook(values, createMode);
      setLookupFailed(result.kind === "lookup-failed");
      if (result.kind === "lookup-failed") return;
      if (result.kind === "duplicate") {
        setWarning({ ...result, values });
        return;
      }
      await revalidate("books").catch(() => {
        toast.warning("Книга создана, но список не обновился", {
          description: "Обновите страницу, чтобы увидеть книгу.",
        });
      });
      if (!isEdit) {
        toast.success("Книга добавлена");
      }
    } catch {
      toast.error("Не удалось создать книгу", {
        description:
          "Данные сохранены в форме. Проверьте соединение и попробуйте ещё раз.",
      });
      return;
    } finally {
      saving.current = false;
      setPending(null);
    }
    setWarning(undefined);
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
      {warning && (
        <section className="space-y-4" aria-busy={loading}>
          <div className="space-y-1">
            <h2
              ref={warningHeading}
              tabIndex={-1}
              className="flex items-center gap-2 font-semibold focus:outline-none"
            >
              <TriangleAlert
                aria-hidden="true"
                className="size-5 shrink-0 text-amber-600 dark:text-amber-400"
              />
              Возможный дубликат
            </h2>
            <p className="text-sm text-muted-foreground">
              В вашем дневнике уже есть{" "}
              {warning.matches.length === 1 ? "книга" : "книги"} с таким
              названием и автором. Если у вас другое издание, его можно добавить
              отдельно.
            </p>
          </div>
          <ul className="max-h-[min(40dvh,20rem)] space-y-2 overflow-y-auto">
            {warning.matches.map((book) => {
              const { Icon, label } = matchStatuses[book.status];
              return (
                <li
                  key={book.id}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-md border p-3"
                >
                  <div className="min-w-0 flex-1 break-words text-sm">
                    <p className="font-medium">{book.title}</p>
                    <p className="text-muted-foreground">
                      {book.author} · {book.pages} стр.
                    </p>
                    <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                      <Icon aria-hidden="true" className="size-3 shrink-0" />
                      {label}
                    </p>
                  </div>
                  <Button asChild variant="outline" size="sm">
                    <Link
                      href={bookDetailHref(book.id, "books")}
                      aria-label={`Открыть «${book.title}», ${book.pages} стр.`}
                    >
                      <BookOpen aria-hidden="true" />
                      Открыть
                    </Link>
                  </Button>
                </li>
              );
            })}
          </ul>
          <div className="flex flex-wrap justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              disabled={loading}
              onClick={() => {
                setWarning(undefined);
                requestAnimationFrame(() => form.setFocus("title"));
              }}
            >
              Назад к форме
            </Button>
            <Button
              type="button"
              disabled={loading}
              onClick={() => void save(warning.values, "add-anyway")}
            >
              {loading && <Loader invert className="size-4" />}
              Всё равно добавить
            </Button>
          </div>
        </section>
      )}
      <Form {...form}>
        <form
          hidden={!!warning}
          onSubmit={form.handleSubmit((values) => save(values))}
          className="space-y-2"
          aria-busy={loading}
        >
          <fieldset disabled={loading} className="min-w-0 space-y-2">
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
                        alt="Обложка книги"
                      />
                      <div className="absolute right-0 top-2 flex translate-x-1/2 flex-col gap-2">
                        <SimpleTooltip text="Удалить обложку">
                          <Button
                            size="icon"
                            variant="outline"
                            aria-label="Удалить обложку"
                            onClick={() => field.onChange("")}
                            type="button"
                            className="dark:bg-background dark:hover:bg-accent"
                          >
                            <Trash className="size-4" />
                          </Button>
                        </SimpleTooltip>
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
                          setFileUploading(false);
                          toast.error("Ошибка при загрузке обложки", {
                            description: `${error.message}. Попробуйте загрузить обложку ещё раз.`,
                          });
                        }}
                        onUploadBegin={(_fileName) => {
                          setFileUploading(true);
                        }}
                        className="ut-button:bg-primary ut-button:ut-readying:bg-primary/50 ut-button:px-4 ut-button:ut-uploading:bg-primary/50 ut-button:dark:text-black"
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
              <div className="flex justify-between items-center">
                <div className="flex flex-col gap-1">
                  <FormLabel className="mt-2">Поля</FormLabel>
                  <FormDescription>
                    Добавьте дополнительные поля с информацией о книге.
                  </FormDescription>
                </div>
                {/*<Button type="button" size="icon" variant="ghost">
              <SettingsIcon />
            </Button>*/}
              </div>
              {fields.map((formField, index) => (
                <FormItem key={formField.id}>
                  <FormControl>
                    <div className="flex flex-col items-center gap-2 sm:flex-row">
                      <FormField
                        control={form.control}
                        name={`fields.${index}.title`}
                        render={({ field: titleField }) => (
                          <FormItem className="w-full">
                            <Input
                              {...titleField}
                              placeholder="Название поля"
                            />
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`fields.${index}.value`}
                        render={({ field: valueField }) => (
                          <FormItem className="w-full">
                            <Input
                              {...valueField}
                              placeholder="Значение поля"
                            />
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <SimpleTooltip text="Удалить поле">
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          aria-label="Удалить поле"
                          onClick={() => remove(index)}
                        >
                          <X className="size-4" />
                        </Button>
                      </SimpleTooltip>
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
            {lookupFailed && (
              <p
                role="alert"
                className="rounded-md border border-destructive/30 p-3 text-sm text-destructive"
              >
                Не удалось проверить книгу на дубликаты. Данные сохранены в
                форме.
              </p>
            )}
            <div className="flex flex-wrap gap-2">
              <Button type="submit" disabled={loading || fileUploading}>
                {pending === "check" ? (
                  <Loader invert className="size-4" />
                ) : (
                  <Plus />
                )}
                {pending === "check"
                  ? "Проверяем…"
                  : lookupFailed
                    ? "Повторить проверку"
                    : "Создать"}
              </Button>
              {lookupFailed && (
                <Button
                  type="button"
                  variant="outline"
                  disabled={loading || fileUploading}
                  onClick={form.handleSubmit((values) =>
                    save(values, "add-anyway"),
                  )}
                >
                  {pending === "save" && <Loader className="size-4" />}
                  {pending === "save" ? "Добавляем…" : "Добавить без проверки"}
                </Button>
              )}
            </div>
          </fieldset>
        </form>
      </Form>
    </>
  );
}

export function AddBookDialog({
  open,
  setOpen,
  onCreated,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  onCreated?: () => void;
}) {
  return (
    <DrawerDialog open={open} onOpenChange={setOpen} className="min-w-[50vw]">
      <DialogHeader>
        <DialogTitle>Добавить книгу</DialogTitle>
        <DialogDescription>
          Заполните информацию о книге, чтобы добавить её в дневник.
        </DialogDescription>
      </DialogHeader>
      <div className="p-4 pt-0 mt-4 overflow-auto">
        <BookForm
          onSuccess={(book) => {
            void capture("book_created", {
              title: book.title,
              author: book.author,
              pages: book.pages,
            });
            onCreated?.();
            setOpen(false);
          }}
        />
      </div>
    </DrawerDialog>
  );
}
