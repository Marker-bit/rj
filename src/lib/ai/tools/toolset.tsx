import { ToolView } from "@/lib/ai/tools/types";
import { fetchBooks } from "@/lib/books";
import { db } from "@/lib/db";
import { tool } from "ai";
import { User } from "lucia";
import { BookIcon } from "lucide-react";
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
        title: book.title,
        author: book.author,
        lastEvent: book.readEvents[0] ?? null,
      }));
    },
  }),
});

export const toolViews: Record<string, ToolView> = {
  getAllBooks: {
    texts: {
      loadingText: "Просматривает книги...",
      successText: "Просмотрел книги",
    },
    icon: BookIcon,
  },
};

// export const tools = Object.fromEntries(
//   Object.entries(allTools).map(([key, tool]) => [key, tool.tool]),
// );
