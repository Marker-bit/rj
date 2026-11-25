"use client";

import { useLocalStorage } from "usehooks-ts";
import { z } from "zod";

export const bookSortLabels = {
  percent: "По прогрессу чтения",
  activity: "По последней активности",
};

export const bookStatusLabels = {
  all: "Все книги",
  planned: "Запланированные",
  reading: "Читаю",
  finished: "Прочитанные",
};

const bookSort = z.enum(["percent", "activity"]);
const bookStatus = z.enum(["all", "planned", "reading", "finished"]);
export type BookStatusFilter = z.infer<typeof bookStatus>;

function useStoredChoice<T extends string>(
  key: string,
  schema: z.ZodType<T>,
  fallback: T,
) {
  const [value, setValue] = useLocalStorage(key, fallback, {
    initializeWithValue: false,
    deserializer: (stored) => {
      let decoded: unknown = stored;
      try {
        decoded = JSON.parse(stored);
      } catch {
        // Older book sorting preferences can be unquoted strings.
      }
      const parsed = schema.safeParse(decoded);
      return parsed.success ? parsed.data : fallback;
    },
  });

  return [
    value,
    (next: string) => {
      const parsed = schema.safeParse(next);
      if (parsed.success) setValue(parsed.data);
    },
  ] as const;
}

export function useBookSort() {
  return useStoredChoice("orderBy", bookSort, "percent");
}

export function useBookStatusFilter() {
  return useStoredChoice("bookStatusFilter", bookStatus, "all");
}

export function useHideUnstartedBooks() {
  return useLocalStorage("notStarted", false, {
    initializeWithValue: false,
    deserializer: (stored) => stored === "true",
  });
}

export function useFirstStepsDismissed() {
  return useLocalStorage("firstStepsDismissed", false, {
    initializeWithValue: false,
    deserializer: (stored) => stored === "true",
  });
}

export function usePrefillReadingPage() {
  return useLocalStorage("prefillReadingPage", true, {
    initializeWithValue: false,
    deserializer: (stored) => stored !== "false",
  });
}

export const homeWidgetLabels = {
  streak: "Серия чтения",
  lastRead: "Последнее прочтение",
  recentBooks: "Недавние книги",
  stats: "График чтения",
};

export function useHomeWidget(widget: keyof typeof homeWidgetLabels) {
  return useLocalStorage(`home-widget-${widget}`, true, {
    initializeWithValue: false,
    deserializer: (stored) => stored !== "false",
  });
}

export function useWarnAboutDuplicates() {
  return useLocalStorage("warnAboutDuplicateBooks", true, {
    initializeWithValue: false,
    deserializer: (stored) => stored !== "false",
  });
}
