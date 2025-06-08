import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { db } from "@/lib/db";
import { declOfNum } from "@/lib/utils";
import { subMonths } from "date-fns";
import {
  ArrowUpRight,
  BookCopy,
  BookOpen,
  CreditCard,
  MessageCircleQuestion,
} from "lucide-react";
import Link from "next/link";
import BookMenu from "./book-menu";

export const dynamic = "force-dynamic";

export default async function Page() {
  const readEvents = await db.readEvent.count();

  const lastMonth = subMonths(new Date(), 1);
  const lastMonthEvents = await db.readEvent.count({
    where: {
      readAt: {
        gte: lastMonth,
      },
    },
  });
  const lastMonthPercent = ((lastMonthEvents / readEvents) * 100).toFixed(1);

  const books = await db.book.count();
  const lastMonthBooks = await db.book.count({
    where: {
      createdAt: {
        gte: lastMonth,
      },
    },
  });
  const lastMonthBooksPercent = ((lastMonthBooks / books) * 100).toFixed(1);

  const users = await db.user.count();
  const lastMonthUsers = await db.user.count({
    where: {
      registeredAt: {
        gte: lastMonth,
      },
    },
  });
  const lastMonthUsersPercent = ((lastMonthUsers / users) * 100).toFixed(1);

  const supportTickets = await db.supportQuestion.count({
    where: { isDone: false },
  });

  const recentBooks = await db.book.findMany({
    take: 5,
    orderBy: {
      createdAt: "desc",
    },
    include: {
      readEvents: {
        orderBy: {
          pagesRead: "desc",
        },
        take: 1,
      },
      user: true,
    },
  });

  const recentUsers = await db.user.findMany({
    take: 5,
    orderBy: {
      registeredAt: "desc",
    },
    include: {
      books: {
        select: {
          title: true,
          author: true,
        },
      },
    },
  });

  const cards = [
    {
      title: "Всего событий создано",
      icon: BookOpen,
      value: readEvents,
      percent: lastMonthPercent,
    },
    {
      title: "Книги",
      icon: BookCopy,
      value: books,
      percent: lastMonthBooksPercent,
    },
    {
      title: "Пользователей",
      icon: CreditCard,
      value: users,
      percent: lastMonthUsersPercent,
    },
    {
      title: "Поддержка",
      icon: MessageCircleQuestion,
      value: supportTickets,
    },
  ];

  return (
    <main className="flex flex-1 flex-col gap-4 p-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <Card key={card.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {card.title}
              </CardTitle>
              <card.icon className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
              {card.percent && (
                <p className="text-xs text-muted-foreground">
                  +{card.percent}% за последний месяц
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader className="flex flex-row items-center">
            <div className="flex flex-col gap-1">
              <CardTitle>Книги</CardTitle>
              <CardDescription>Недавно созданные книги.</CardDescription>
            </div>
            <Button asChild size="sm" className="ml-auto gap-1">
              <Link href="/admin/books">
                <div className="max-sm:hidden">Показать все</div>
                <ArrowUpRight className="size-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Пользователь</TableHead>
                  <TableHead>Название</TableHead>
                  <TableHead className="max-sm:hidden">Страниц</TableHead>
                  <TableHead className="max-lg:hidden">Дата создания</TableHead>
                  <TableHead />
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentBooks.map((book) => (
                  <TableRow key={book.id}>
                    <TableCell>
                      <Link href={`/admin/users/${book.user.id}`}>
                        <div className="flex items-center space-x-3">
                          <Avatar>
                            <AvatarImage
                              src={book.user.avatarUrl}
                              alt="аватарка"
                            />
                            <AvatarFallback>
                              {book.user.firstName && book.user.firstName[0]}
                              {book.user.lastName && book.user.lastName[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">
                              {book.user.firstName} {book.user.lastName}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              @{book.user.username}
                            </div>
                          </div>
                        </div>
                      </Link>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{book.title}</div>
                      <div className="hidden text-sm text-muted-foreground md:inline">
                        {book.author}
                      </div>
                    </TableCell>
                    <TableCell className="max-sm:hidden">
                      {book.readEvents.length > 0 ? (
                        <>
                          <div className="font-medium">
                            {book.readEvents[0].pagesRead}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {book.pages}
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="font-medium">Не начата</div>
                          <div className="text-sm text-muted-foreground">
                            {book.pages}
                          </div>
                        </>
                      )}
                    </TableCell>
                    <TableCell className="max-lg:hidden">
                      <div className="font-medium">
                        {book.createdAt.toLocaleDateString()}
                      </div>
                      <div className="hidden text-sm text-muted-foreground md:inline">
                        {book.createdAt.toLocaleTimeString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <BookMenu book={book} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Пользователи</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-8">
            {recentUsers.map((user) => (
              <Link href={`/admin/users/${user.id}`} key={user.id}>
                <div className="flex items-center gap-4">
                  <Avatar className="hidden size-9 sm:flex">
                    <AvatarImage src={user.avatarUrl} alt="Аватар" />
                    <AvatarFallback>
                      {user.firstName && user.firstName[0]}
                      {user.lastName && user.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid gap-1">
                    <p className="text-sm font-medium leading-none">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      @{user.username}, {user.books.length}{" "}
                      {declOfNum(user.books.length, ["книга", "книги", "книг"])}
                    </p>
                  </div>
                  <div className="ml-auto grid gap-1 text-right">
                    <p className="text-sm font-medium">
                      {user.registeredAt.toLocaleDateString()}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {user.registeredAt.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
