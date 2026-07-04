import { tool } from "ai";
import type { User } from "lucia";
import z from "zod";
import type { ToolId, ToolView } from "@/lib/ai/tools/types";
import { createBookToolView } from "@/lib/ai/tools/views/create-book";
import { createCollectionToolView } from "@/lib/ai/tools/views/create-collection";
import { deleteBookToolView } from "@/lib/ai/tools/views/delete-book";
import { deleteCollectionToolView } from "@/lib/ai/tools/views/delete-collection";
import { getAllBooksToolView } from "@/lib/ai/tools/views/get-all-books";
import { getAllCollectionsToolView } from "@/lib/ai/tools/views/get-all-collections";
import { fetchBooks } from "@/lib/books";
import { db } from "@/lib/db";
import { addBookEventToolView } from "./views/add-book-event";
import { endOfDay, isToday } from "date-fns";
import { getBookByIdToolView } from "./views/get-book-by-id";
import { undoBookEventToolView } from "./views/undo-book-event";
import { bookSchema } from "@/lib/validation/schemas";
import { editBookToolView } from "./views/edit-book";

export const toolSetForUser = (user: User) => ({
  getAllBooks: tool({
    description: "Посмотреть все книги пользователя",
    inputSchema: z.object({
      orderBy: z
        .enum(["percent", "activity"])
        .default("percent")
        .describe(
          "Сортировка книг: percent - по проценту прочитанности (0% - не прочитано, 100% - полностью прочитано), activity - по дате последнего чтения",
        ),
    }),
    execute: async ({ orderBy }) => {
      // await new Promise((resolve) => setTimeout(resolve, 10000));
      const books = await fetchBooks(user.id, {
        orderBy: orderBy,
      });
      return books.map((book) => ({
        id: book.id,
        title: book.title,
        author: book.author,
        pages: book.pages,
        lastEvent: book.readEvents[0] ?? null,
        collections: book.collections.map((collection) => ({
          id: collection.id,
          name: collection.name,
        })),
      }));
    },
  }),
  getBookById: tool({
    description:
      "Информация об одной книге пользователя (включая события чтения)",
    inputSchema: z.object({
      id: z.string().describe("Идентификатор книги"),
    }),
    execute: async ({ id }) => {
      const book = await db.book.findUnique({
        where: {
          id,
          userId: user.id,
        },
        include: {
          collections: true,
          readEvents: {
            orderBy: {
              pagesRead: "asc",
            },
          },
        },
      });

      return book;
    },
  }),
  createBook: tool({
    description: "Создать книгу для пользователя",
    inputSchema: z.object({
      title: z.string().min(1).max(100).describe("Название книги"),
      author: z.string().min(1).max(100).describe("Автор книги"),
      pages: z
        .number()
        .min(1)
        .max(10000)
        .describe("Количество страниц в книге"),
    }),
    execute: async ({ title, author, pages }) => {
      await db.book.create({
        data: {
          title,
          author,
          pages,
          userId: user.id,
        },
      });

      return { success: true };
    },
    needsApproval: true,
  }),
  editBook: tool({
    description: "Редактировать книгу",
    inputSchema: z.object({
      id: z.string().describe("Идентификатор"),
      values: bookSchema
        .extend({
          status: z
            .enum(["NONE", "HIDDEN", "ARCHIVED"])
            .describe(
              "Статус книги - скрытая или в архиве (отложенная на будущее)",
            ),
        })
        .omit({
          coverUrl: true,
        })
        .partial(),
    }),
    execute: async ({ id, values }) => {
      await db.book.update({
        where: {
          id,
          userId: user.id,
        },
        data: values,
      });

      return { success: true };
    },
    needsApproval: true,
  }),
  deleteBook: tool({
    description: "Удалить книгу пользователя",
    inputSchema: z.object({
      id: z.string().describe("Идентификатор книги"),
    }),
    execute: async ({ id }) => {
      const book = await db.book.findFirst({
        where: {
          id,
          userId: user.id,
        },
      });

      if (!book) {
        return { success: false, error: "Книга не найдена" };
      }

      await db.book.delete({
        where: {
          id,
        },
      });

      return {
        success: true,
        book: {
          id: book.id,
          title: book.title,
          author: book.author,
          pages: book.pages,
        },
      };
    },
    needsApproval: true,
  }),
  createCollection: tool({
    description: "Создать коллекцию книг",
    inputSchema: z.object({
      name: z.string().min(1).max(100).describe("Название коллекции"),
      bookIds: z
        .array(z.string())
        .optional()
        .describe(
          "Идентификаторы книг для добавления в коллекцию (опционально)",
        ),
    }),
    execute: async ({ name, bookIds }) => {
      const books = await Promise.all(
        (bookIds || []).map(async (id) => {
          const book = await db.book.findFirst({
            where: {
              id,
              userId: user.id,
            },
          });

          if (!book) {
            throw new Error(`Книга с идентификатором ${id} не найдена`);
          }

          return book;
        }),
      );

      const collection = await db.collection.create({
        data: {
          name,
          userId: user.id,
          books: {
            connect: books.map((book) => ({ id: book.id })),
          },
        },
      });

      return {
        success: true,
        collection: {
          id: collection.id,
          name: collection.name,
          books: books.map((book) => ({
            id: book.id,
            title: book.title,
            author: book.author,
            pages: book.pages,
          })),
        },
      };
    },
    needsApproval: true,
  }),
  deleteCollection: tool({
    description:
      "Удалить коллекцию пользователя. Книги в коллекции НЕ будут удалены.",
    inputSchema: z.object({
      id: z.string().describe("Идентификатор коллекции"),
    }),
    execute: async ({ id }) => {
      const collection = await db.collection.findFirst({
        where: {
          id,
          userId: user.id,
        },
        include: {
          books: true,
        },
      });

      if (!collection) {
        return { success: false, error: "Коллекция не найдена" };
      }

      await db.collection.delete({
        where: {
          id,
        },
      });

      return {
        success: true,
        collection: {
          id: collection.id,
          name: collection.name,
          books: collection.books.map((book) => ({
            id: book.id,
            title: book.title,
            author: book.author,
            pages: book.pages,
          })),
        },
      };
    },
    needsApproval: true,
  }),
  getAllCollections: tool({
    description: "Посмотреть все коллекции пользователя",
    inputSchema: z.object({}),
    execute: async () => {
      // await new Promise((resolve) => setTimeout(resolve, 10000));
      const collections = await db.collection.findMany({
        where: {
          userId: user.id,
        },
        include: {
          books: true,
        },
      });

      return collections.map((collection) => ({
        id: collection.id,
        name: collection.name,
        books: collection.books.map((book) => ({
          id: book.id,
          title: book.title,
          author: book.author,
          pages: book.pages,
        })),
      }));
    },
  }),
  addBookEvent: tool({
    description: "Отметить прочтение книги",
    inputSchema: z.object({
      id: z.string().describe("Идентификатор книги"),
      pagesRead: z
        .number()
        .int()
        .positive()
        .describe("До какой страницы дошли"),
      dateRead: z.iso.date().describe("Дата прочтения в ISO 8601 формате"),
    }),
    execute: async ({ id, pagesRead, dateRead }) => {
      const book = await db.book.findFirst({
        where: {
          id,
          userId: user.id,
        },
      });

      if (!book) {
        return { success: false, error: "Книга не найдена" };
      }

      if (pagesRead > book.pages) {
        return {
          success: false,
          error: `Страница не может быть больше количества страниц в книге (${book.pages})`,
        };
      }

      const date = new Date(dateRead);

      const event = await db.readEvent.create({
        data: {
          bookId: book.id,
          pagesRead,
          readAt: isToday(date) ? new Date() : endOfDay(date),
        },
      });

      return {
        success: true,
        event: {
          id: event.id,
          pagesRead: event.pagesRead,
          readAt: event.readAt.toISOString(),
        },
      };
    },
    needsApproval: true,
  }),
  undoBookEvent: tool({
    description: "Отменить прочтение книги",
    inputSchema: z.object({
      id: z.string().describe("Идентификатор книги"),
      eventId: z.string().describe("Идентификатор события"),
    }),
    execute: async ({ id, eventId }) => {
      const readEvent = await db.readEvent.findFirst({
        where: {
          id: eventId,
          book: {
            id,
            userId: user.id,
          },
        },
      });

      if (!readEvent) {
        return { success: false, error: "Книга не найдена" };
      }

      await db.readEvent.delete({ where: { id: readEvent.id } });

      return {
        success: true,
      };
    },
    needsApproval: true,
  }),
});

export const toolViews: Record<ToolId, ToolView> = {
  getAllBooks: getAllBooksToolView,
  getBookById: getBookByIdToolView,
  createBook: createBookToolView,
  editBook: editBookToolView,
  deleteBook: deleteBookToolView,
  createCollection: createCollectionToolView,
  deleteCollection: deleteCollectionToolView,
  getAllCollections: getAllCollectionsToolView,
  addBookEvent: addBookEventToolView,
  undoBookEvent: undoBookEventToolView,
};

// export const tools = Object.fromEntries(
//   Object.entries(allTools).map(([key, tool]) => [key, tool.tool]),
// );
