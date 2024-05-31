"use client"

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Book, Group, GroupBook, User } from "@prisma/client";
import { ChevronDown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function UserBooks({
  user,
  books,
}: {
  user: User
  books: (Book & { groupBook: (GroupBook & { group: Group }) | null })[]
}) {
  return (
    <>
      <Popover>
        <PopoverTrigger asChild>
          <div className="group relative flex cursor-pointer flex-col items-center rounded-xl border p-2">
            <Image
              src={user.avatarUrl || "/no-avatar.png"}
              alt={user.username}
              width={64}
              height={64}
              className="size-12 rounded-full"
            />
            <h3>
              {user.firstName} {user.lastName}
            </h3>
            <p className="text-muted-foreground">@{user.username}</p>
            <div className="absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2 rounded-full border bg-white p-0.5 dark:bg-black">
              <ChevronDown className="size-4 transition group-hover:-rotate-90" />
            </div>
          </div>
        </PopoverTrigger>
        <PopoverContent className="flex max-h-[50vh] flex-col gap-2 overflow-auto">
          {books.map((book) => (
            <div className="flex gap-2" key={book.id}>
              {book.coverUrl && (
                <Image
                  src={book.coverUrl}
                  alt={"Обложка книги " + book.title}
                  width={256}
                  height={256}
                  className="h-auto w-20 rounded-xl"
                />
              )}
              <div className="flex flex-col gap-1">
                <Link href={`/books/${book.id}`}>{book.title}</Link>
                <p className="text-muted-foreground">{book.author}</p>
                {book.groupBook && (
                  <p className="text-muted-foreground">
                    в группе:{" "}
                    <Link
                      href={`/groups/${book.groupBook.groupId}/stats/${book.groupBookId}`}
                    >
                      {book.groupBook.group.title}
                    </Link>
                  </p>
                )}
              </div>
            </div>
          ))}
        </PopoverContent>
      </Popover>
    </>
  )
}
