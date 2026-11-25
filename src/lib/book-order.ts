import type { ReadingEventLike } from "./reading-events";

export type BookOrder = "percent" | "activity";
export const defaultBookOrder: BookOrder = "percent";

export function isBookOrder(value: unknown): value is BookOrder {
  return value === "percent" || value === "activity";
}

type BookForOrdering = {
  id: string;
  pages: number;
  createdAt: Date | string;
  readEvents: readonly Pick<ReadingEventLike, "pagesRead" | "readAt">[];
};

export function sortBooks<T extends BookForOrdering>(
  books: readonly T[],
  order: BookOrder,
): T[] {
  return books
    .map((book) => {
      let furthestPage = 0;
      let latestActivity = -Infinity;
      for (const event of book.readEvents) {
        furthestPage = Math.max(furthestPage, event.pagesRead);
        latestActivity = Math.max(
          latestActivity,
          new Date(event.readAt).getTime(),
        );
      }

      return {
        book,
        progress: book.pages > 0 ? Math.min(1, furthestPage / book.pages) : 0,
        activity: book.readEvents.length
          ? latestActivity
          : new Date(book.createdAt).getTime(),
      };
    })
    .sort(
      (a, b) =>
        (order === "percent" ? b.progress - a.progress : 0) ||
        b.activity - a.activity ||
        a.book.id.localeCompare(b.book.id),
    )
    .map(({ book }) => book);
}
