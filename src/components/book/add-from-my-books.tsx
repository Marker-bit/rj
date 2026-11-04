"use client";

import { Loader, Plus, Search } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";
import { DrawerDialog } from "../ui/drawer-dialog";
import { revalidate } from "@/lib/actions/revalidate";

export function AddFromMyBooks({
  groupId,
  open,
  setOpen,
}: {
  groupId: string;
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  const [books, setBooks] = useState<any[]>();
  const [bookLoadingId, setBookLoadingId] = useState<string>();
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/books")
      .then((res) => res.json())
      .then((res) => setBooks(res));
  }, []);

  const filteredBooks = (books ?? []).filter(
    (book) =>
      (book.title.toLowerCase().includes(search.toLowerCase()) ||
        book.author.toLowerCase().includes(search.toLowerCase())) &&
      book.groupBookId !== groupId,
  );

  return (
    <DrawerDialog open={open} onOpenChange={setOpen} className="min-w-[50vw]">
      <DialogHeader>
        <DialogTitle>Добавить книгу из своих</DialogTitle>
        <DialogDescription>
          Выберите книгу, которую хотите добавить в группу.
        </DialogDescription>
      </DialogHeader>
      {books === undefined && (
        <div className="flex h-[30vh] items-center justify-center">
          <Loader className="size-8 animate-spin" />
        </div>
      )}
      <div className="flex items-center gap-2 rounded-xl border p-2">
        <Search className="size-4 text-muted-foreground/80" />
        <input
          className="w-full bg-transparent outline-hidden"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Поиск"
        />
      </div>
      {books !== undefined && filteredBooks.length === 0 && (
        <p className="rounded-2xl border border-dashed p-4 text-center text-sm text-muted-foreground">
          {books.length === 0 ? "У вас пока нет книг." : "Ничего не найдено."}
        </p>
      )}
      {filteredBooks.map((book) => (
        <div
          key={book.id}
          className="flex items-center gap-2 rounded-xl p-2 transition-all hover:bg-muted/10"
        >
          {book.coverUrl && (
            <Image
              src={book.coverUrl}
              alt="book"
              width={500}
              height={500}
              className="h-20 w-auto rounded-md"
            />
          )}
          <div className="flex flex-col gap-1">
            <div className="text-xl font-bold">{book.title}</div>
            <div className="-mt-1 text-sm text-zinc-500">{book.author}</div>
            <div className="-mt-1 text-sm text-zinc-500">{book.pages} стр.</div>
            <div className="-mt-1 text-sm text-zinc-500">
              {book.description}
            </div>
          </div>
          <Button
            size="icon"
            variant="ghost"
            className="ml-auto size-fit p-1"
            onClick={() => {
              setBookLoadingId(book.id);
              fetch(`/api/groups/${groupId}/add-own/${book.id}`, {
                method: "POST",
              }).then(() => {
                setBookLoadingId(undefined);
                setOpen(false);
                void revalidate("books");
              });
            }}
          >
            {bookLoadingId === book.id ? (
              <Loader className="size-4 animate-spin" />
            ) : (
              <Plus className="size-4" />
            )}
          </Button>
        </div>
      ))}
    </DrawerDialog>
  );
}
