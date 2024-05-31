"use client"

import { Button } from "@/components/ui/button"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Book, Group, GroupBook, User } from "@prisma/client"
import { ChevronDown } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function UserBooks({
  user,
  books,
}: {
  user: User
  books: (Book & { groupBook: (GroupBook & { group: Group }) | null })[]
}) {
  return (
    <p key={user.id} className="text-muted-foreground">
      от{" "}
      <HoverCard>
        <HoverCardTrigger asChild>
          <Button variant="link" asChild size="sm" className="px-0">
            <Link href={`/profile/${user.username}`}>@{user.username}</Link>
          </Button>
        </HoverCardTrigger>
        <HoverCardContent>
          <div className="flex space-x-8">
            <Image
              src={user.avatarUrl || "/no-avatar.png"}
              alt={user.username}
              width={64}
              height={64}
              className="size-12 rounded-full"
            />
            <div className="flex flex-col">
              <h3>
                {user.firstName} {user.lastName}
              </h3>
              <p className="text-muted-foreground">@{user.username}</p>
            </div>
          </div>
        </HoverCardContent>
      </HoverCard>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="icon" className="ml-2 size-6">
            <ChevronDown className="size-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="max-h-[50vh] overflow-auto">
          {books.map((book) => (
            <div className="flex gap-2" key={book.id}>
              {book.coverUrl && (
                <Image
                  src={book.coverUrl}
                  alt={"Обложка книги " + book.title}
                  width={32}
                  height={32}
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
    </p>
  )
}
