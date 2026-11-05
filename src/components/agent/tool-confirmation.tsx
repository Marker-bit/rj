import type { ChatAddToolApproveResponseFunction, UIToolInvocation } from "ai";
import { CheckIcon, ChevronRightIcon, XIcon } from "lucide-react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { BookStatus, BackgroundColor } from "@prisma/client";
import type { KnownEntities } from "@/lib/ai/message";
import type { ToolId, ToolView } from "@/lib/ai/tools/types";
import {
  EditBookChanges,
  type EditBookSnapshot,
  type EditBookValues,
} from "@/lib/ai/tools/views/edit-book";
import { cn } from "@/lib/utils";

type BookField = { title: string; value: string };

type ApprovalDetails = {
  subject?: string;
  description: string;
  meta?: string[];
  coverUrl?: string;
  fields?: BookField[];
  editBookChanges?: {
    book: EditBookSnapshot;
    values: EditBookValues;
  };
};

function asRecord(value: unknown): Record<string, unknown> {
  return typeof value === "object" && value !== null
    ? (value as Record<string, unknown>)
    : {};
}

function joinDetails(values: (string | undefined)[]) {
  return values.filter((value): value is string => Boolean(value)).join(" · ");
}

const BACKGROUND_LABELS: Record<string, string> = {
  NONE: "без фона",
  YELLOW: "жёлтый",
  RED: "красный",
  BLUE: "синий",
  GREEN: "зелёный",
};

const STATUS_LABELS: Record<string, string> = {
  NONE: "обычная",
  HIDDEN: "скрыта",
  ARCHIVED: "в архиве",
};

function getBackgroundLabel(value: unknown) {
  if (typeof value !== "string" || value === "NONE") {
    return undefined;
  }

  return BACKGROUND_LABELS[value] ?? value.toLowerCase();
}

function getStatusLabel(value: unknown) {
  if (typeof value !== "string" || value === "NONE") {
    return undefined;
  }

  return STATUS_LABELS[value] ?? value.toLowerCase();
}

function isBookStatus(value: unknown): value is BookStatus {
  return typeof value === "string" && Object.hasOwn(BookStatus, value);
}

function isBackgroundColor(value: unknown): value is BackgroundColor {
  return typeof value === "string" && Object.hasOwn(BackgroundColor, value);
}

function formatIsoDate(value: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(value);
  return match ? `${match[3]}.${match[2]}.${match[1]}` : value;
}

function getBookFields(value: unknown): BookField[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.flatMap((field) => {
    if (typeof field !== "object" || field === null) {
      return [];
    }

    const { title, value: fieldValue } = field as Record<string, unknown>;
    if (typeof title !== "string" || title.trim().length === 0) {
      return [];
    }

    return [
      {
        title: title.trim(),
        value: typeof fieldValue === "string" ? fieldValue : "",
      },
    ];
  });
}

function getApprovalDetails(
  toolName: ToolId,
  input: Record<string, unknown>,
  knownEntities?: KnownEntities,
): ApprovalDetails {
  const book =
    typeof input.id === "string"
      ? knownEntities?.books.get(input.id)
      : undefined;
  const collection =
    typeof input.id === "string"
      ? knownEntities?.collections.get(input.id)
      : undefined;

  switch (toolName) {
    case "createBook": {
      const title = typeof input.title === "string" ? input.title : undefined;
      const author =
        typeof input.author === "string" ? input.author : undefined;
      const pages = typeof input.pages === "number" ? input.pages : undefined;
      const background = getBackgroundLabel(input.background);
      const meta = [
        author,
        joinDetails([
          pages ? `${pages} страниц` : undefined,
          background ? `${background} фон` : undefined,
        ]),
      ].filter((value): value is string => Boolean(value));

      return {
        subject: title ? `«${title}»` : undefined,
        description: "Новая книга появится в библиотеке.",
        meta: meta.length > 0 ? meta : undefined,
        coverUrl:
          typeof input.coverUrl === "string" ? input.coverUrl : undefined,
        fields: getBookFields(input.fields),
      };
    }

    case "editBook": {
      const values = asRecord(input.values);
      const background = getBackgroundLabel(values.background);
      const status = getStatusLabel(values.status);
      const changes = joinDetails([
        typeof values.title === "string"
          ? `название: «${values.title}»`
          : undefined,
        typeof values.author === "string"
          ? `автор: ${values.author}`
          : undefined,
        typeof values.pages === "number"
          ? `страниц: ${values.pages}`
          : undefined,
        status ? `статус: ${status}` : undefined,
        background ? `фон: ${background}` : undefined,
      ]);

      const nextFields = Array.isArray(values.fields)
        ? getBookFields(values.fields)
        : undefined;
      const editValues: EditBookValues = {
        title: typeof values.title === "string" ? values.title : undefined,
        author: typeof values.author === "string" ? values.author : undefined,
        description:
          typeof values.description === "string"
            ? values.description
            : undefined,
        pages: typeof values.pages === "number" ? values.pages : undefined,
        status: isBookStatus(values.status) ? values.status : undefined,
        background: isBackgroundColor(values.background)
          ? values.background
          : undefined,
        fields: nextFields,
      };

      const bookSnapshot: EditBookSnapshot | undefined =
        book &&
        typeof book.pages === "number" &&
        book.status !== undefined &&
        book.background !== undefined
          ? {
              title: book.title,
              author: book.author ?? "",
              description: book.description ?? "",
              pages: book.pages,
              status: book.status,
              background: book.background,
              fields: book.fields ?? [],
            }
          : undefined;

      return {
        subject: book?.title ? `«${book.title}»` : undefined,
        description: bookSnapshot
          ? "Изменение данных книги."
          : changes || "Изменение данных книги.",
        editBookChanges: bookSnapshot
          ? { book: bookSnapshot, values: editValues }
          : undefined,
        fields: bookSnapshot ? undefined : nextFields,
      };
    }

    case "deleteBook":
      return {
        subject: book?.title ? `«${book.title}»` : undefined,
        description: book?.author ?? "Удаление книги",
      };

    case "createCollection": {
      const name = typeof input.name === "string" ? input.name : undefined;
      const count = Array.isArray(input.bookIds) ? input.bookIds.length : 0;

      return {
        subject: name ? `«${name}»` : undefined,
        description:
          count > 0 ? `Книг в коллекции: ${count}.` : "Новая коллекция книг.",
      };
    }

    case "deleteCollection":
      return {
        subject: collection?.name ? `«${collection.name}»` : undefined,
        description: "Книги внутри коллекции останутся в библиотеке.",
      };

    case "addBookEvent": {
      const pages =
        typeof input.pagesRead === "number" ? input.pagesRead : undefined;
      const date =
        typeof input.dateRead === "string" ? input.dateRead : undefined;

      return {
        subject: book?.title ? `«${book.title}»` : undefined,
        description:
          joinDetails([
            pages ? `до стр. ${pages}` : undefined,
            date ? `дата: ${formatIsoDate(date)}` : undefined,
          ]) || "Добавить событие чтения.",
      };
    }

    case "undoBookEvent": {
      const event =
        typeof input.eventId === "string"
          ? knownEntities?.readEvents.get(input.eventId)
          : undefined;

      return {
        subject: book?.title ? `«${book.title}»` : undefined,
        description:
          joinDetails([
            event?.pagesRead ? `до стр. ${event.pagesRead}` : undefined,
            event?.readAt ? `дата: ${formatIsoDate(event.readAt)}` : undefined,
          ]) || "Событие чтения будет отменено.",
      };
    }

    default:
      return {
        subject: undefined,
        description: "Инструмент ждёт подтверждения.",
      };
  }
}

function ConfirmationFields({ fields }: { fields: BookField[] }) {
  if (fields.length === 0) {
    return null;
  }

  return (
    <Collapsible className="min-w-0">
      <CollapsibleTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          className="group/fields-trigger text-muted-foreground"
        >
          <ChevronRightIcon className="size-3.5 shrink-0 transition-transform group-data-[state=open]/fields-trigger:rotate-90" />
          <span>Поля</span>
          <Badge
            variant="secondary"
            className="h-4 min-w-4 px-1 text-[10px] tabular-nums"
          >
            {fields.length}
          </Badge>
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="overflow-hidden data-open:animate-accordion-down data-closed:animate-accordion-up">
        <dl className="mt-1.5 divide-y overflow-hidden rounded-md border text-xs leading-relaxed">
          {fields.map((field) => (
            <div
              key={`${field.title}:${field.value}`}
              className="grid grid-cols-[auto_minmax(0,1fr)] items-baseline gap-x-3 px-2 py-1.5"
            >
              <dt className="break-words text-muted-foreground">
                {field.title}
              </dt>
              <dd className="min-w-0 text-right break-words">
                {field.value || "—"}
              </dd>
            </div>
          ))}
        </dl>
      </CollapsibleContent>
    </Collapsible>
  );
}

export function ToolConfirmation({
  invocation,
  toolName,
  toolView,
  knownEntities,
  addToolApprovalResponse,
  className,
  ...props
}: {
  invocation: UIToolInvocation<any>;
  toolName: ToolId;
  toolView: ToolView;
  knownEntities?: KnownEntities;
  addToolApprovalResponse: ChatAddToolApproveResponseFunction;
} & React.ComponentPropsWithRef<"div">) {
  const input = asRecord(invocation.input);
  const details = getApprovalDetails(toolName, input, knownEntities);

  return (
    <Item
      variant="outline"
      size="sm"
      className={cn("w-full flex-col items-stretch", className)}
      {...props}
    >
      <div className="flex min-w-0 items-start gap-2.5">
        {details.coverUrl ? (
          <Image
            src={details.coverUrl}
            alt=""
            width={56}
            height={84}
            unoptimized
            className="aspect-[2/3] w-14 shrink-0 rounded-md border object-cover"
          />
        ) : (
          <ItemMedia variant="icon">
            <toolView.icon />
          </ItemMedia>
        )}
        <ItemContent className="min-w-0 self-center">
          <ItemTitle>
            {toolView.texts.approvalText} {details.subject}
          </ItemTitle>
          {details.meta?.length ? (
            <ItemDescription className="flex flex-col gap-0.5">
              {details.meta.map((line) => (
                <span key={line}>{line}</span>
              ))}
            </ItemDescription>
          ) : (
            <ItemDescription>{details.description}</ItemDescription>
          )}
          <ConfirmationFields fields={details.fields ?? []} />
          {details.editBookChanges ? (
            <EditBookChanges {...details.editBookChanges} />
          ) : null}
        </ItemContent>
      </div>
      <ItemActions className="w-full flex-col gap-2">
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={(evt) => {
            evt.stopPropagation();
            if (invocation.approval) {
              addToolApprovalResponse({
                id: invocation.approval.id,
                approved: true,
              });
            }
          }}
          size="sm"
        >
          <CheckIcon />
          Принять
        </Button>
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={(evt) => {
            evt.stopPropagation();
            if (invocation.approval) {
              addToolApprovalResponse({
                id: invocation.approval.id,
                approved: false,
                reason: "Пользователь отклонил выполнение инструмента.",
              });
            }
          }}
          size="sm"
        >
          <XIcon />
          Отклонить
        </Button>
      </ItemActions>
    </Item>
  );
}
