import { ToolView } from "@/lib/ai/tools/types";
import { createBookToolView } from "@/lib/ai/tools/views/create-book";
import { deleteBookToolView } from "@/lib/ai/tools/views/delete-book";
import { getAllBooksToolView } from "@/lib/ai/tools/views/get-all-books";
import { fetchBooks } from "@/lib/books";
import { db } from "@/lib/db";
import { tool } from "ai";
import { User } from "lucia";
import z from "zod";

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
      }));
    },
    // needsApproval: true,
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
      // await new Promise((resolve) => setTimeout(resolve, 10000));
      const book = await db.book.create({
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
});

export const toolViews: Record<string, ToolView> = {
  getAllBooks: getAllBooksToolView,
  createBook: createBookToolView,
  deleteBook: deleteBookToolView,
};

// export const tools = Object.fromEntries(
//   Object.entries(allTools).map(([key, tool]) => [key, tool.tool]),
// );
