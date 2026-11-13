const BACK_TARGETS = {
  journal: "/journal",
  history: "/books/history",
  archive: "/books/archive",
  books: "/books",
} as const;

export type BookBackSource = keyof typeof BACK_TARGETS;

export function bookBackHref(from: string | string[] | undefined): string {
  if (typeof from !== "string") return BACK_TARGETS.books;
  return Object.hasOwn(BACK_TARGETS, from)
    ? BACK_TARGETS[from as BookBackSource]
    : BACK_TARGETS.books;
}

export function bookDetailHref(bookId: string, from: BookBackSource): string {
  return `/books/${bookId}?from=${from}`;
}
