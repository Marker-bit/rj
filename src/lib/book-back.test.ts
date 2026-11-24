import { describe, expect, it } from "vitest";

import { bookBackHref, bookDetailHref } from "./book-back";

describe("bookBackHref", () => {
  it("falls back to /books with no value", () => {
    expect(bookBackHref(undefined)).toBe("/books");
    expect(bookBackHref([])).toBe("/books");
  });

  it("returns each known target", () => {
    expect(bookBackHref("journal")).toBe("/journal");
    expect(bookBackHref("history")).toBe("/books/history");
    expect(bookBackHref("archive")).toBe("/books/archive");
    expect(bookBackHref("books")).toBe("/books");
  });

  it("rejects unknown names, empty strings, and prototype keys", () => {
    expect(bookBackHref("unknown")).toBe("/books");
    expect(bookBackHref("")).toBe("/books");
    expect(bookBackHref("toString")).toBe("/books");
    expect(bookBackHref("__proto__")).toBe("/books");
  });
});

describe("bookDetailHref", () => {
  it("adds the source to the book detail URL", () => {
    expect(bookDetailHref("abc", "journal")).toBe("/books/abc?from=journal");
  });

  it("preserves the collection when opening a book from its tag view", () => {
    const url = new URL(
      bookDetailHref("abc", "tag:night-reading"),
      "https://example.com",
    );
    expect(url.pathname).toBe("/books/abc");
    expect(bookBackHref(url.searchParams.get("from") ?? undefined)).toBe(
      "/books/tags/night-reading",
    );
  });

  it("keeps malformed tag returns inside the library", () => {
    expect(bookBackHref("tag:")).toBe("/books");
    expect(bookBackHref("tag:../archive")).toBe("/books");
    expect(bookBackHref("tag://example.com")).toBe("/books");
  });
});
