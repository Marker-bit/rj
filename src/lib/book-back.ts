const BACK_TARGETS = {
  journal: "/journal",
  history: "/books/history",
  archive: "/books/archive",
  books: "/books",
} as const;

export type BookBackSource = keyof typeof BACK_TARGETS | `tag:${string}`;

export function bookTagHref(tagId: string): string {
  return `/books/tags/${encodeURIComponent(tagId)}`;
}

export function bookBackHref(from: string | string[] | undefined): string {
  if (typeof from !== "string") return BACK_TARGETS.books;
  if (from.startsWith("tag:")) {
    const tagId = from.slice("tag:".length);
    if (/^[a-zA-Z0-9_-]+$/.test(tagId)) return bookTagHref(tagId);
  }
  return Object.hasOwn(BACK_TARGETS, from)
    ? BACK_TARGETS[from as keyof typeof BACK_TARGETS]
    : BACK_TARGETS.books;
}

export function bookDetailHref(bookId: string, from: BookBackSource): string {
  return `/books/${bookId}?from=${encodeURIComponent(from)}`;
}
