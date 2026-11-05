import {
  type InferUITools,
  isToolUIPart,
  type TextUIPart,
  type ToolUIPart,
  type UIDataTypes,
  type UIMessage,
  type UIMessagePart,
} from "ai";
import type { BackgroundColor, BookStatus } from "@prisma/client";
import type { toolSetForUser } from "@/lib/ai/tools/toolset";

export type MyUIMessage = UIMessage<
  unknown,
  UIDataTypes,
  InferUITools<ReturnType<typeof toolSetForUser>>
>;

export type MyUIMessagePart = UIMessagePart<
  UIDataTypes,
  InferUITools<ReturnType<typeof toolSetForUser>>
>;

export function sanitizeMessagesForProvider(
  messages: MyUIMessage[],
): MyUIMessage[] {
  return messages.flatMap((message) => {
    const parts: MyUIMessagePart[] = [];

    for (const part of message.parts) {
      if (part.type === "text") {
        if (typeof part.text === "string") {
          parts.push(part);
        }
        continue;
      }

      // Some providers do not understand the approval-response part and
      // serialize the following tool message without content. Convert a denied
      // approval into the regular output-denied state so the provider receives
      // a proper tool result.
      if (
        isToolUIPart(part) &&
        part.state === "approval-responded" &&
        !part.approval.approved
      ) {
        parts.push({
          ...part,
          state: "output-denied",
          approval: { ...part.approval, approved: false },
        } as unknown as MyUIMessagePart);
        continue;
      }

      parts.push(part);
    }

    if (parts.length === 0) {
      return [];
    }

    return [{ ...message, parts }];
  });
}

type PartGroup = ToolUIPart[] | TextUIPart;

export function groupMessageParts(message: MyUIMessage): PartGroup[] {
  const groupedParts: PartGroup[] = [];
  let currentGroup: ToolUIPart[] = [];

  for (const part of message.parts) {
    if (part.type === "reasoning") {
      continue;
    }
    if (part.type === "text") {
      if (!part.text?.trim()) {
        continue;
      }
      if (currentGroup.length > 0) {
        groupedParts.push(currentGroup);
        currentGroup = [];
      }

      groupedParts.push(part);
    } else if (isToolUIPart(part)) {
      currentGroup.push(part);
    }
  }

  if (currentGroup.length > 0) {
    groupedParts.push(currentGroup);
  }

  return groupedParts;
}

export function hasVisibleMessageContent(message: MyUIMessage) {
  return groupMessageParts(message).length > 0;
}

type KnownBook = {
  title: string;
  author?: string;
  description?: string;
  pages?: number;
  status?: BookStatus;
  background?: BackgroundColor;
  fields?: { title: string; value: string }[];
};

type KnownCollection = {
  name: string;
};

type KnownReadEvent = {
  pagesRead?: number;
  readAt?: string;
};

export type KnownEntities = {
  books: Map<string, KnownBook>;
  collections: Map<string, KnownCollection>;
  readEvents: Map<string, KnownReadEvent>;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export function collectKnownEntities(messages: MyUIMessage[]): KnownEntities {
  const books = new Map<string, KnownBook>();
  const collections = new Map<string, KnownCollection>();
  const readEvents = new Map<string, KnownReadEvent>();

  const addBook = (book: unknown) => {
    if (
      !isRecord(book) ||
      typeof book.id !== "string" ||
      typeof book.title !== "string"
    ) {
      return;
    }

    const fields = Array.isArray(book.fields)
      ? book.fields.flatMap((field) =>
          isRecord(field) &&
          typeof field.title === "string" &&
          typeof field.value === "string"
            ? [{ title: field.title, value: field.value }]
            : [],
        )
      : undefined;

    const backgroundValue = book.background ?? book.backgroundColor;

    books.set(book.id, {
      title: book.title,
      author: typeof book.author === "string" ? book.author : undefined,
      description:
        typeof book.description === "string" ? book.description : undefined,
      pages: typeof book.pages === "number" ? book.pages : undefined,
      status:
        typeof book.status === "string"
          ? (book.status as BookStatus)
          : undefined,
      background:
        typeof backgroundValue === "string"
          ? (backgroundValue as BackgroundColor)
          : undefined,
      fields,
    });
  };

  const addCollection = (collection: unknown) => {
    if (
      !isRecord(collection) ||
      typeof collection.id !== "string" ||
      typeof collection.name !== "string"
    ) {
      return;
    }

    collections.set(collection.id, { name: collection.name });
  };

  const addReadEvent = (event: unknown) => {
    if (!isRecord(event) || typeof event.id !== "string") {
      return;
    }

    readEvents.set(event.id, {
      pagesRead:
        typeof event.pagesRead === "number" ? event.pagesRead : undefined,
      readAt: typeof event.readAt === "string" ? event.readAt : undefined,
    });
  };

  for (const message of messages) {
    for (const part of message.parts) {
      if (!isToolUIPart(part) || part.state !== "output-available") {
        continue;
      }

      if (part.type === "tool-getAllBooks" && Array.isArray(part.output)) {
        part.output.forEach(addBook);
      } else if (part.type === "tool-getBookById") {
        addBook(part.output);
        const events = (part.output as { readEvents?: unknown })?.readEvents;
        if (Array.isArray(events)) {
          events.forEach(addReadEvent);
        }
      } else if (
        part.type === "tool-getAllCollections" &&
        Array.isArray(part.output)
      ) {
        part.output.forEach(addCollection);
      } else if (part.type === "tool-createBook") {
        addBook((part.output as { book?: unknown })?.book);
      } else if (part.type === "tool-createCollection") {
        addCollection((part.output as { collection?: unknown })?.collection);
      } else if (part.type === "tool-addBookEvent") {
        addReadEvent((part.output as { event?: unknown })?.event);
      } else if (part.type === "tool-undoBookEvent") {
        const event = (part.output as { event?: { id?: string } })?.event;
        if (event?.id) {
          readEvents.delete(event.id);
        }
      }
    }
  }

  return { books, collections, readEvents };
}
