"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { declOfNum } from "@/lib/utils";
import { Book, User } from "@prisma/client";
import Link from "next/link";
import UserBooks from "./user-books";

export default function UserTable({
  users,
}: {
  users: (User & { books: Book[] })[]
}) {
  return (
    <Table>
      <TableCaption>
        {users.length}{" "}
        {declOfNum(users.length, [
          "пользователь",
          "пользователя",
          "пользователей",
        ])}
      </TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">ID</TableHead>
          <TableHead className="w-[200px]">Имя</TableHead>
          <TableHead className="w-[200px]">Дата регистрации</TableHead>
          <TableHead className="w-[200px]">Книги</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell className="font-medium">{user.id}</TableCell>
            <TableCell>
              <Link
                href={`/admin/profile/${user.id}`}
                className="flex items-center gap-2 rounded-xl p-2 transition hover:bg-black/5 dark:hover:bg-white/5"
              >
                <Avatar>
                  <AvatarImage src={user.avatarUrl} />
                  <AvatarFallback>
                    {user.firstName && user.firstName[0]}
                    {user.lastName && user.lastName[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <p className="font-medium">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    @{user.username}
                  </p>
                </div>
              </Link>
            </TableCell>
            <TableCell>
              <div className="font-medium">
                {user.registeredAt.toLocaleDateString()}
              </div>
              <div className="text-muted-foreground">
                {user.registeredAt.toLocaleTimeString()}
              </div>
            </TableCell>
            <TableCell>
              {user.books.length === 0 ? (
                "Нет книг"
              ) : (
                <UserBooks books={user.books} />
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
