"use client";

import type { Book, Group, GroupBook } from "@prisma/client";
import {
  BarChartHorizontalBig,
  BookOpen,
  Edit,
  LinkIcon,
  MinusIcon,
  MoreHorizontal,
  PlusIcon,
  Trash,
} from "lucide-react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { DeleteGroupBookModal } from "@/components/dialogs/groups/delete-group-book-modal";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import BindBookModal from "./bind-book-modal";

const EditGroupBookModal = dynamic(
  () =>
    import("@/components/dialogs/groups/edit-group-book-modal").then(
      (mod) => mod.EditGroupBookModal,
    ),
  { ssr: false },
);

export function MoreActions({
  book,
  canManageBooks,
  addedBook,
  addBook,
  deleteBook,
}: {
  canManageBooks: boolean;
  book: GroupBook & { group: Group };
  addedBook: Book | undefined;
  addBook: () => void;
  deleteBook: () => void;
}) {
  const [editOpen, setEditOpen] = useState(false);
  const [editMounted, setEditMounted] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [bindOpen, setBindOpen] = useState(false);

  useEffect(() => {
    if (editOpen) {
      setEditMounted(true);
    }
  }, [editOpen]);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            aria-label={`Действия с книгой «${book.title}»`}
            size="icon"
            variant="ghost"
            className="size-fit p-1"
          >
            <MoreHorizontal className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {addedBook ? (
            <>
              <DropdownMenuItem className="sm:hidden" asChild>
                <Link href={`/books/${addedBook.id}`}>
                  <BookOpen />
                  Показать книгу
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="sm:hidden"
                onClick={() => deleteBook()}
              >
                <MinusIcon />
                Удалить у себя книгу
              </DropdownMenuItem>
            </>
          ) : (
            <DropdownMenuItem className="sm:hidden" onClick={() => addBook()}>
              <PlusIcon />
              Добавить себе книгу
            </DropdownMenuItem>
          )}
          {!addedBook && (
            <DropdownMenuItem onClick={() => setBindOpen(true)}>
              <LinkIcon />
              Связать
            </DropdownMenuItem>
          )}

          <Link href={`/groups/${book.group.id}/stats/${book.id}`}>
            <DropdownMenuItem>
              <BarChartHorizontalBig />
              Статистика
            </DropdownMenuItem>
          </Link>
          {canManageBooks && (
            <>
              <DropdownMenuItem onClick={() => setEditOpen(true)}>
                <Edit />
                Редактировать
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setDeleteOpen(true)}>
                <Trash />
                Удалить
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      {canManageBooks && (
        <>
          <DeleteGroupBookModal
            open={deleteOpen}
            setOpen={setDeleteOpen}
            book={book}
          />
          {editMounted && (
            <EditGroupBookModal
              open={editOpen}
              setOpen={setEditOpen}
              book={book}
            />
          )}
        </>
      )}
      <BindBookModal open={bindOpen} setOpen={setBindOpen} groupBook={book} />
    </>
  );
}
