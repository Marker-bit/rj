"use client";

import { useLocalStorage } from "usehooks-ts";
import { defaultBookOrder, type BookOrder } from "@/lib/book-order";

export function useBookOrder() {
  return useLocalStorage<BookOrder>("orderBy", defaultBookOrder, {
    initializeWithValue: false,
    deserializer: (stored) =>
      stored === '"activity"' || stored === "activity"
        ? "activity"
        : defaultBookOrder,
  });
}
