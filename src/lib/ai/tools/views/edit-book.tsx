import {
  ArrowRightIcon,
  CircleAlertIcon,
  MinusIcon,
  PencilIcon,
  PlusIcon,
  TrashIcon,
} from "lucide-react";
import { RemoteBookView } from "@/components/agent/book-view";
import type { ToolOutputView, ToolView } from "@/lib/ai/tools/types";
import { Spinner } from "@/components/ui/spinner";
import { useQuery } from "@tanstack/react-query";
import { BackgroundColor, Book, BookStatus } from "@prisma/client";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { backgroundColors } from "@/lib/colors";

const FieldView = ({
  label,
  originalValue,
  changedValue,
}: {
  label: string;
  originalValue: string;
  changedValue?: string;
}) =>
  changedValue ? (
    <div className="flex items-center">
      <span className="font-semibold">{label}: </span>
      <span className="text-muted-foreground">
        {originalValue === "" ? "<ничего>" : originalValue}
      </span>
      <ArrowRightIcon className="size-4 shrink-0 mx-1 inline-block text-muted-foreground" />
      <span>{changedValue}</span>
    </div>
  ) : null;

const statuses: Record<BookStatus, string> = {
  NONE: "нет статуса",
  ARCHIVED: "архивирована",
  HIDDEN: "скрыта",
};

const EditBookView: ToolOutputView<"editBook"> = ({ input }) => {
  const bookQuery = useQuery<Book>({
    queryKey: ["book", input.id],
    queryFn: () =>
      fetch(`/api/books/${input.id}`).then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch book");
        }
        return res.json();
      }),
  });

  const book = bookQuery.data!;

  return bookQuery.isLoading ? (
    <div className="w-40 h-20 text-muted-foreground flex items-center justify-center rounded-md border">
      <Spinner />
    </div>
  ) : bookQuery.isError ? (
    <div className="w-40 h-20 text-muted-foreground flex items-center justify-center rounded-md border">
      <CircleAlertIcon />
    </div>
  ) : (
    <div className="flex flex-col gap-2">
      {input.values.coverUrl && (
        <Image
          width={160}
          height={80}
          src={input.values.coverUrl}
          alt="cover"
          className="w-40 h-20 object-contain rounded-md"
        />
      )}
      <RemoteBookView bookId={input.id} />
      <div className="flex flex-col gap-1">
        {book.background !== input.values.background && (
          <div className="flex gap-2 items-center">
            <div className="font-semibold text-sm">Цвет: </div>
            {book.background !== BackgroundColor.NONE && (
              <div
                className={cn(
                  "size-8 rounded-md flex items-center justify-center",
                  backgroundColors.find((c) => c.type === book.background)
                    ?.color,
                )}
              >
                <MinusIcon className="size-4 text-accent-foreground" />
              </div>
            )}
            {input.values.background !== BackgroundColor.NONE && (
              <div
                className={cn(
                  "size-8 rounded-md flex items-center justify-center",
                  backgroundColors.find(
                    (c) => c.type === input.values.background,
                  )?.color,
                )}
              >
                <PlusIcon className="size-4 text-accent-foreground" />
              </div>
            )}
          </div>
        )}
        <FieldView
          label="Название"
          originalValue={book.title}
          changedValue={input.values.title}
        />
        <FieldView
          label="Автор"
          originalValue={book.author}
          changedValue={input.values.author}
        />
        <FieldView
          label="Описание"
          originalValue={book.description}
          changedValue={input.values.description}
        />
        <FieldView
          label="Кол-во страниц"
          originalValue={book.pages.toString()}
          changedValue={input.values.pages?.toString()}
        />
        <FieldView
          label="Статус"
          originalValue={statuses[book.status]}
          changedValue={
            input.values.status ? statuses[input.values.status] : undefined
          }
        />

        {input.values.fields !== undefined && (
          <div className="flex flex-col gap-2">
            <div className="font-semibold">Поля:</div>
            <div className="flex gap-2 items-center flex-wrap">
              {book.fields.map((field) => {
                const fields = input.values.fields;
                if (fields === undefined) {
                  return;
                }

                const matchedField = fields.find(
                  (fld) => fld.title === field.title,
                );

                return (
                  <div
                    key={field.title + field.value}
                    className={cn(
                      "rounded-xl border px-2 py-1",
                      matchedField
                        ? matchedField.value !== field.value &&
                            "bg-yellow-300 dark:bg-yellow-700"
                        : "bg-red-300 dark:bg-red-700",
                    )}
                  >
                    {field.title}:{" "}
                    {matchedField && matchedField.value !== field.value
                      ? `${field.value} -> ${matchedField.value}`
                      : field.value}
                  </div>
                );
              })}
              {input.values.fields.map((field) => {
                const fields = book.fields;
                if (fields.find((fld) => fld.title === field.title)) return;

                return (
                  <div
                    key={field.title + field.value}
                    className="rounded-xl border px-2 py-1 bg-green-300 dark:bg-green-700"
                  >
                    {field.title}: {field.value}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export const editBookToolView: ToolView<"editBook"> = {
  title: "Изменить книгу",
  texts: {
    loadingText: "Изменяет книгу...",
    successText: "Изменил книгу",
    approvalText: "Хочет изменить книгу",
    acceptedText: "Изменение книги принято",
    deniedText: "Изменение книги отклонено",
  },
  icon: PencilIcon,
  outputView: EditBookView,
};
