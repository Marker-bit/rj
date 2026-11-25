export type ReadingEventLike = {
  id: string;
  pagesRead: number;
  readAt: Date | string;
};

const readingEventTime = (value: Date | string) => new Date(value).getTime();

export function compareReadingEventDates(
  a: ReadingEventLike,
  b: ReadingEventLike,
) {
  return (
    readingEventTime(a.readAt) - readingEventTime(b.readAt) ||
    (a.id < b.id ? -1 : a.id > b.id ? 1 : 0)
  );
}

export function reachedPageCount(pagesRead: number | undefined, pages: number) {
  return pages > 0 && pagesRead !== undefined && pagesRead >= pages;
}

export function isBookComplete(book: {
  pages: number;
  readEvents: readonly Pick<ReadingEventLike, "pagesRead">[];
}) {
  return book.readEvents.some((event) =>
    reachedPageCount(event.pagesRead, book.pages),
  );
}

/**
 * Reading progress and "latest activity" are different questions:
 * - progress is the furthest page ever reached (monotonic display);
 * - latest is the most recently dated event (what the undo button deletes).
 */
export function getReadingState<T extends ReadingEventLike>(
  events: readonly T[],
) {
  let first: T | null = null;
  let latest: T | null = null;
  let furthest: T | null = null;
  for (const event of events) {
    if (!first || compareReadingEventDates(event, first) < 0) first = event;
    if (!latest || compareReadingEventDates(event, latest) > 0) latest = event;
    if (!furthest || event.pagesRead > furthest.pagesRead) furthest = event;
  }

  return {
    first,
    latest,
    furthest,
    progressPages: Math.max(0, furthest?.pagesRead ?? 0),
  };
}

export function getLastReadProgress<
  T extends {
    pages: number;
    readEvents: readonly ReadingEventLike[];
  },
>(books: readonly T[]) {
  let lastRead: { book: T; pages: number; latest: ReadingEventLike } | null =
    null;
  for (const book of books) {
    const { latest, progressPages } = getReadingState(book.readEvents);
    if (!latest || reachedPageCount(progressPages, book.pages)) continue;
    if (!lastRead || compareReadingEventDates(latest, lastRead.latest) > 0) {
      lastRead = { book, pages: progressPages, latest };
    }
  }
  return lastRead && { book: lastRead.book, pages: lastRead.pages };
}
