import type { ChatAddToolApproveResponseFunction, UIToolInvocation } from "ai";
import { CheckIcon, XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import type { KnownEntities } from "@/lib/ai/message";
import type { ToolId, ToolView } from "@/lib/ai/tools/types";
import { cn } from "@/lib/utils";

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

function formatIsoDate(value: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(value);
  return match ? `${match[3]}.${match[2]}.${match[1]}` : value;
}

function getApprovalDetails(
  toolName: ToolId,
  input: Record<string, unknown>,
  knownEntities?: KnownEntities,
) {
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
      const fields =
        Array.isArray(input.fields) && input.fields.length > 0
          ? `полей: ${input.fields.length}`
          : undefined;

      return {
        subject: title ? `«${title}»` : undefined,
        description:
          joinDetails([
            author,
            pages ? `страниц: ${pages}` : undefined,
            background ? `фон: ${background}` : undefined,
            fields,
          ]) || "Новая книга появится в библиотеке.",
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

      return {
        subject: book?.title ? `«${book.title}»` : undefined,
        description: changes || "Изменение данных книги.",
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
        <ItemMedia variant="icon">
          <toolView.icon />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>
            {toolView.texts.approvalText} {details.subject}
          </ItemTitle>
          <ItemDescription>{details.description}</ItemDescription>
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
