import {
  ArrowRightIcon,
  CircleAlertIcon,
  MinusIcon,
  PencilIcon,
  PlusIcon,
} from "lucide-react";
import { RemoteBookView } from "@/components/agent/book-view";
import type { ToolOutputView, ToolView } from "@/lib/ai/tools/types";
import { BackgroundColor, BookStatus } from "@/generated/prisma/enums";
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
      <span className="me-1 font-semibold text-foreground">{label}: </span>
      <span className="min-w-0 break-words text-muted-foreground">
        {originalValue === "" ? "<ничего>" : originalValue}
      </span>
      <ArrowRightIcon className="size-4 shrink-0 mx-1 inline-block text-muted-foreground" />
      <span className="min-w-0 break-words text-foreground">
        {changedValue === "" ? "<пусто>" : changedValue}
      </span>
    </div>
  ) : null;

const statuses: Record<BookStatus, string> = {
  NONE: "нет статуса",
  ARCHIVED: "архивирована",
  HIDDEN: "скрыта",
};

export type FieldChange =
  | {
      kind: "changed";
      field: { title: string; value: string };
      next: { title: string; value: string };
    }
  | { kind: "removed"; field: { title: string; value: string } }
  | { kind: "added"; field: { title: string; value: string } };

export function EditBookFields({ changes }: { changes: FieldChange[] }) {
  if (changes.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="text-sm font-semibold text-foreground">Поля:</div>
      <div className="flex min-w-0 flex-wrap items-center gap-2">
        {changes.map((change) => (
          <div
            key={`${change.kind}-${change.field.title}-${change.field.value}`}
            className="flex max-w-full items-start gap-2 rounded-xl border px-2 py-1"
          >
            <span className="flex h-5 w-3.5 shrink-0 items-center justify-center">
              {change.kind === "changed" ? (
                <PencilIcon className="size-3.5 text-amber-500" />
              ) : change.kind === "removed" ? (
                <MinusIcon className="size-3.5 text-destructive" />
              ) : (
                <PlusIcon className="size-3.5 text-emerald-600" />
              )}
            </span>
            <span className="min-w-0 text-sm leading-5 break-words text-foreground">
              <span className="font-semibold">{change.field.title}:</span>{" "}
              {change.kind === "changed" ? (
                <>
                  {change.field.value}{" "}
                  <ArrowRightIcon className="inline size-3.5 shrink-0 align-middle text-muted-foreground" />{" "}
                  {change.next.value}
                </>
              ) : (
                change.field.value
              )}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export type EditBookSnapshot = {
  title: string;
  author: string;
  description: string;
  pages: number;
  status: BookStatus;
  background: BackgroundColor;
  fields: { title: string; value: string }[];
};

export type EditBookValues = {
  title?: string;
  author?: string;
  description?: string;
  pages?: number;
  status?: BookStatus;
  background?: BackgroundColor;
  fields?: { title: string; value: string }[];
};

export function EditBookChanges({
  book,
  values,
}: {
  book: EditBookSnapshot;
  values: EditBookValues;
}) {
  const nextFields = values.fields;
  const fieldChanges: FieldChange[] = nextFields
    ? [
        ...book.fields.flatMap((field): FieldChange[] => {
          const next = nextFields.find((fld) => fld.title === field.title);

          if (!next) {
            return [{ kind: "removed", field }];
          }

          if (next.value !== field.value) {
            return [{ kind: "changed", field, next }];
          }

          return [];
        }),
        ...nextFields.flatMap((field): FieldChange[] =>
          book.fields.some((fld) => fld.title === field.title)
            ? []
            : [{ kind: "added", field }],
        ),
      ]
    : [];

  return (
    <div className="flex flex-col gap-1">
      {values.background !== undefined &&
        book.background !== values.background && (
          <div className="flex gap-2 items-center">
            <div className="font-semibold text-sm text-foreground">Цвет: </div>
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
            {values.background !== BackgroundColor.NONE && (
              <div
                className={cn(
                  "size-8 rounded-md flex items-center justify-center",
                  backgroundColors.find((c) => c.type === values.background)
                    ?.color,
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
        changedValue={values.title}
      />
      <FieldView
        label="Автор"
        originalValue={book.author}
        changedValue={values.author}
      />
      <FieldView
        label="Описание"
        originalValue={book.description}
        changedValue={values.description}
      />
      <FieldView
        label="Кол-во страниц"
        originalValue={book.pages.toString()}
        changedValue={values.pages?.toString()}
      />
      <FieldView
        label="Статус"
        originalValue={statuses[book.status]}
        changedValue={values.status ? statuses[values.status] : undefined}
      />

      <EditBookFields changes={fieldChanges} />
    </div>
  );
}

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
      <EditBookChanges book={book} values={input.values} />
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
