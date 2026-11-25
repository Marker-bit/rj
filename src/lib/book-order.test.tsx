// @vitest-environment jsdom
import { act } from "react";
import { createRoot } from "react-dom/client";
import { afterEach, expect, it, vi } from "vitest";
import { BookList } from "@/app/(app)/(books)/books/book-list";
import { CollectionBookList } from "@/app/(app)/(books)/books/tags/[tagId]/collection-book-list";
import type { Book } from "@/lib/api-types";
import { sortBooks } from "./book-order";

vi.mock("@/components/book/book-view", () => ({
  BookView: ({ book, titleHref }: { book: Book; titleHref?: string }) => (
    <a data-book={book.id} href={titleHref}>
      {book.title}
    </a>
  ),
}));

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });
Object.defineProperty(HTMLElement.prototype, "scrollIntoView", {
  value: vi.fn(),
});

afterEach(() => {
  localStorage.clear();
});

const date = (day: number) => new Date(Date.UTC(2026, 10, day));

function makeBook(id: string, readEvents: Book["readEvents"]): Book {
  return {
    id,
    title: id,
    author: "",
    pages: 100,
    createdAt: date(1),
    description: "",
    coverUrl: null,
    background: id === "most-recent" ? "BLUE" : "NONE",
    status: "NONE",
    fields: [],
    userId: "reader",
    groupBookId: null,
    fromRecommendationId: null,
    readEvents,
    collections: [],
    groupBook: null,
    links: [],
  };
}

it("applies the same saved sort in the library and collection", async () => {
  const progressed = makeBook("most-progress", [
    { id: "first", pagesRead: 80, readAt: date(1) },
    { id: "reread", pagesRead: 10, readAt: date(2) },
  ]);
  const recent = makeBook("most-recent", [
    { id: "second", pagesRead: 40, readAt: date(3) },
    { id: "third", pagesRead: 15, readAt: date(6) },
  ]);
  const unread = { ...makeBook("unread", []), createdAt: date(5) };
  const container = document.createElement("div");
  document.body.append(container);
  const root = createRoot(container);

  function renderedIds(view: string) {
    return Array.from(
      container.querySelectorAll(`#${view} [data-book]`),
      (row) => row.getAttribute("data-book"),
    );
  }

  try {
    localStorage.setItem("orderBy", '"percent"');
    await act(() => {
      root.render(
        <>
          <section id="library">
            <BookList books={[recent, unread, progressed]} />
          </section>
          <section id="collection">
            <CollectionBookList
              books={[unread, progressed, recent]}
              tagId="tag"
            />
          </section>
        </>,
      );
    });
    expect(renderedIds("library")).toEqual([
      "most-progress",
      "most-recent",
      "unread",
    ]);
    expect(renderedIds("collection")).toEqual(renderedIds("library"));

    await act(() => {
      const trigger = container.querySelector('#collection [role="combobox"]');
      trigger?.dispatchEvent(
        new KeyboardEvent("keydown", { key: "Enter", bubbles: true }),
      );
    });
    const activity = Array.from(
      document.querySelectorAll('[role="option"]'),
    ).find((option) => option.textContent?.includes("По последней активности"));
    expect(activity).toBeDefined();
    await act(() => {
      activity?.dispatchEvent(
        new KeyboardEvent("keydown", { key: "Enter", bubbles: true }),
      );
    });

    expect(localStorage.getItem("orderBy")).toBe('"activity"');
    expect(renderedIds("library")).toEqual([
      "most-recent",
      "unread",
      "most-progress",
    ]);
    expect(renderedIds("collection")).toEqual(renderedIds("library"));
    expect(
      container.querySelector("#collection [data-book]")?.getAttribute("href"),
    ).toBe("/books/most-recent?from=tag%3Atag");
  } finally {
    await act(() => root.unmount());
    container.remove();
  }
});

it("breaks progress ties by activity and exact ties by ID", () => {
  const books = [
    { ...makeBook("third", []), pages: 0 },
    makeBook("second", []),
    { ...makeBook("first", []), createdAt: date(2) },
  ];
  for (const order of ["percent", "activity"] as const) {
    expect(sortBooks(books, order).map(({ id }) => id)).toEqual([
      "first",
      "second",
      "third",
    ]);
  }
  expect(books.map(({ id }) => id)).toEqual(["third", "second", "first"]);
});
