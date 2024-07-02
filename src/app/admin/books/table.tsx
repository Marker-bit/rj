"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { dateToString, declOfNum } from "@/lib/utils"
import { Book, Group, GroupBook, GroupMember, User } from "@prisma/client"
import Link from "next/link"

export default function BookTable({
  books,
}: {
  books: (Book & {
    user: User
    groupBook:
      | (GroupBook & { group: Group & { members: GroupMember[] } })
      | null
  })[]
}) {
  return (
    <Table>
      <TableCaption>
        {books.length} {declOfNum(books.length, ["книга", "книги", "книг"])}
      </TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">ID</TableHead>
          <TableHead className="w-[200px]">Создатель</TableHead>
          <TableHead className="w-[200px]">Дата создания</TableHead>
          <TableHead className="w-[200px]">Название</TableHead>
          <TableHead className="w-[200px]">Группа</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {books.map((book) => (
          <TableRow key={book.id}>
            <TableCell className="font-medium">{book.id}</TableCell>
            <TableCell>
              <Link
                href={`/admin/profile/${book.userId}`}
                className="flex items-center gap-2 rounded-xl p-2 transition hover:bg-black/5 dark:hover:bg-white/5"
              >
                <Avatar>
                  <AvatarImage src={book.user.avatarUrl} />
                  <AvatarFallback>
                    {book.user.firstName && book.user.firstName[0]}
                    {book.user.lastName && book.user.lastName[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <p className="font-medium">
                    {book.user.firstName} {book.user.lastName}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    @{book.user.username}
                  </p>
                </div>
              </Link>
            </TableCell>
            <TableCell>
              <div className="font-medium">
                {book.createdAt.toLocaleDateString()}
              </div>
              <div className="text-muted-foreground">
                {book.createdAt.toLocaleTimeString()}
              </div>
            </TableCell>
            <TableCell>
              <div className="font-medium">{book.title}</div>
              <div className="text-muted-foreground">{book.author}</div>
            </TableCell>
            <TableCell>
              {book.groupBook ? (
                <Link
                  href={`/admin/groups/${book.userId}`}
                  className="flex flex-col items-start rounded-xl p-2 transition hover:bg-black/5 dark:hover:bg-white/5"
                >
                  <div className="font-medium">
                    {book.groupBook.group.title}
                  </div>
                  <div className="text-muted-foreground">
                    {book.groupBook.group.members.length}{" "}
                    {declOfNum(book.groupBook.group.members.length, [
                      "участник",
                      "участника",
                      "участников",
                    ])}
                  </div>
                </Link>
              ) : (
                "Без группы"
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
