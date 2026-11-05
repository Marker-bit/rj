import {
  ArrowRightIcon,
  CircleAlertIcon,
  MinusIcon,
  PencilIcon,
  PlusIcon,
} from "lucide-react";
import { RemoteBookView } from "@/components/agent/book-view";
import type { ToolOutputView, ToolView } from "@/lib/ai/tools/types";
import { BackgroundColor, BookStatus } from "@prisma/client";
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
  changedValue !== undefined ? (
    <div className="flex min-w-0 flex-wrap items-center gap-x-1 break-words">
      <span className="me-1 font-semibold">{label}: </span>
      <span className="min-w-0 break-words text-muted-foreground">
        {originalValue === "" ? "<ничего>" : originalValue}
      </span>
      <ArrowRightIcon className="size-4 shrink-0 mx-1 inline-block text-muted-foreground" />
      <span className="min-w-0 break-words">
        {changedValue === "" ? "<пусто>" : changedValue}
      </span>
    </div>
  ) : null;

const statuses: Record<BookStatus, string> = {
  NONE: "нет статуса",
  ARCHIVED: "архивирована",
  HIDDEN: "скрыта",
};

const EditBookView: ToolOutputView<"editBook"> = ({ input, output }) => {
  const book = output?.book;

  if (!book) {
    return (
      <div className="w-40 h-20 text-muted-foreground flex items-center justify-center rounded-md border">
        <CircleAlertIcon />
      </div>
    );
  }

  const coverUrl = output?.coverUrl ?? input.values.coverUrl;

  return (
    <div className="flex min-w-0 flex-col gap-2">
      {coverUrl && (
        <Image
          width={64}
          height={96}
          src={coverUrl}
          alt="cover"
          unoptimized={coverUrl.includes("books.google.com")}
          className="h-24 w-16 shrink-0 rounded-md object-cover"
        />
      )}
      <RemoteBookView bookId={input.id} />
      <div className="flex flex-col gap-1">
        {input.values.background !== undefined &&
          book.background !== input.values.background && (
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
            <div className="flex min-w-0 flex-wrap items-center gap-2">
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
                      "max-w-full rounded-xl border px-2 py-1 break-words",
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
                    className="max-w-full rounded-xl border px-2 py-1 break-words bg-green-300 dark:bg-green-700"
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
