"use client";

import { useEffect, useState } from "react";
import { DrawerDialog } from "../drawer";
import { DialogHeader, DialogTitle } from "../ui/dialog";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "../ui/button";
import { Loader, Plus, Search } from "lucide-react";
import { Input } from "../ui/input";

export function AddFromMyBooks({
  groupId,
  open,
  setOpen,
}: {
  groupId: string;
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  const router = useRouter();
  const [books, setBooks] = useState<any[]>();
  const [bookLoadingId, setBookLoadingId] = useState<string>();
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/books")
      .then((res) => res.json())
      .then((res) => setBooks(res));
  }, []);

  return (
    <DrawerDialog open={open} onOpenChange={setOpen} className="min-w-[50vw]">
      <DialogHeader>
        <DialogTitle>Добавить книгу из своих</DialogTitle>
      </DialogHeader>
      {books === undefined && (
        <div className="flex justify-center items-center h-[30vh]">
          <Loader className="w-8 h-8 animate-spin" />
        </div>
      )}
      <div className="flex items-center gap-2 p-2 rounded-xl border border-zinc-100 dark:border-zinc-900">
        <Search className="w-4 h-4 text-muted-foreground/80" />
        <input
          className="bg-transparent w-full outline-none"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Поиск"
        />
      </div>
      {books &&
        books
          .filter(
            (book) =>
              (book.title.toLowerCase().includes(search.toLowerCase()) ||
              book.author.toLowerCase().includes(search.toLowerCase())) && book.groupBookId !== groupId
          )
          .map((book) => (
            <div
              key={book.id}
              className="flex gap-2 items-center p-2 rounded-xl hover:bg-muted/10 transition-all"
            >
              {book.coverUrl && (
                <Image
                  src={book.coverUrl}
                  alt="book"
                  width={500}
                  height={500}
                  className="rounded-md h-20 w-auto"
                />
              )}
              <div className="flex flex-col gap-1">
                <div className="text-xl font-bold">{book.title}</div>
                <div className="text-zinc-500 -mt-1 text-sm">{book.author}</div>
                <div className="text-zinc-500 -mt-1 text-sm">
                  {book.pages} стр.
                </div>
                <div className="text-zinc-500 -mt-1 text-sm">
                  {book.description}
                </div>
              </div>
              <Button
                size="icon"
                variant="ghost"
                className="p-1 h-fit w-fit ml-auto"
                onClick={() => {
                  setBookLoadingId(book.id);
                  fetch(`/api/groups/${groupId}/add-own/${book.id}`, {
                    method: "POST",
                  }).then(() => {
                    setBookLoadingId(undefined);
                    setOpen(false);
                    router.refresh();
                  });
                }}
              >
                {bookLoadingId === book.id ? (
                  <Loader className="w-4 h-4 animate-spin" />
                ) : (
                  <Plus className="w-4 h-4" />
                )}
              </Button>
            </div>
          ))}
    </DrawerDialog>
  );
}
