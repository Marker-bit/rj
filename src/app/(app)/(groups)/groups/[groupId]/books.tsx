"use client";

import type {
  GroupBookSuggestion,
  GroupMember,
} from "@/generated/prisma/browser";
import { BookIcon, Search, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { AddBookButton } from "./add-book-button";
import { BookSuggestions } from "./book-suggestions";
import { GroupBookView } from "./book-view";
import { ExportBooksButton } from "./export-books-button";

export default function Books({
  isMember,
  group,
  userId,
}: {
  isMember: boolean;
  group: {
    id: string;
    groupBooks: any[];
    suggestions: GroupBookSuggestion[];
    members: GroupMember[];
  };
  userId: string;
}) {
  const [searchText, setSearchText] = useState("");
  const [FuseClass, setFuseClass] = useState<
    typeof import("fuse.js").default | null
  >(null);

  useEffect(() => {
    if (searchText.trim() === "" || FuseClass) {
      return;
    }

    let cancelled = false;
    void import("fuse.js").then((mod) => {
      if (!cancelled) {
        setFuseClass(() => mod.default);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [searchText, FuseClass]);

  const search = useMemo(
    () =>
      FuseClass
        ? new FuseClass(group.groupBooks, {
            keys: ["title", "author", "description"],
          })
        : null,
    [FuseClass, group.groupBooks],
  );
  const books = useMemo(() => {
    const query = searchText.trim();

    if (!query) {
      return group.groupBooks;
    }

    if (search) {
      return search.search(query).map((result) => result.item);
    }

    const lowerQuery = query.toLowerCase();
    return group.groupBooks.filter((book) =>
      [book.title, book.author, book.description].some((value) =>
        String(value ?? "")
          .toLowerCase()
          .includes(lowerQuery),
      ),
    );
  }, [group.groupBooks, search, searchText]);

  const groupMember = group.members.find((member) => member.userId === userId);

  if (!groupMember) {
    return null;
  }

  return (
    <div className="rounded-xl border p-4">
      <div className="flex items-center gap-1 text-sm text-black/70 dark:text-white/70">
        <BookIcon className="size-4" />
        <div>Книги</div>
        <div className="ml-auto flex items-center gap-1">
          {!isMember && <AddBookButton groupId={group.id} />}
          <ExportBooksButton books={group.groupBooks} />
          <BookSuggestions
            suggestions={group.suggestions}
            member={groupMember}
          />
        </div>
      </div>
      <div className="mt-2 flex gap-2">
        <Input
          placeholder="Поиск..."
          className="w-full"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        {searchText ? (
          <Button
            type="button"
            variant="outline"
            size="icon"
            aria-label="Очистить поиск"
            onClick={() => setSearchText("")}
          >
            <X className="size-4" />
          </Button>
        ) : (
          <span
            role="img"
            aria-label="Поиск"
            className="inline-flex size-9 shrink-0 items-center justify-center rounded-md border border-input text-muted-foreground"
          >
            <Search className="size-4" />
          </span>
        )}
      </div>
      <ScrollArea className="h-[40vh]">
        {books.length === 0 && (
          <div className="flex items-center gap-3 rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
            <BookIcon className="size-5" />
            {searchText ? "Ничего не найдено" : "В группе пока нет книг"}
          </div>
        )}
        {books.map((book) => (
          <GroupBookView
            groupBook={book}
            key={book.id}
            userId={userId}
            canManageBooks={!isMember}
          />
        ))}
        <ScrollBar orientation="vertical" />
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}
