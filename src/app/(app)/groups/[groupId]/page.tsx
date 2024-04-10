import { db } from "@/lib/db";
import { validateRequest } from "@/lib/server-validate-request";
import { declOfNum } from "@/lib/utils";
import { GroupMemberRole } from "@prisma/client";
import {
  BarChart2,
  BarChartHorizontalBig,
  Book,
  Crown,
  Shield,
  User,
  Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { AddBookButton } from "./add-book-button";
import { AddMemberButton } from "./add-member-button";
import { GroupBookView } from "./book-view";
import { Progress } from "@/components/ui/progress";

export default async function Page({
  params,
}: {
  params: { groupId: string };
}) {
  const { user } = await validateRequest();
  if (!user) {
    return null;
  }
  const group = await db.group.findUnique({
    where: { id: params.groupId },
    include: {
      groupBooks: {
        include: {
          group: true,
          book: {
            include: {
              readEvents: {
                orderBy: { readAt: "desc" },
              },
            },
          },
        },
      },
      members: {
        include: {
          user: {
            include: {
              books: {
                include: {
                  groupBook: true,
                },
              },
            },
          },
        },
      },
    },
  });
  if (!group) {
    return null;
  }
  const myBooksFromGroup = await db.book.findMany({
    where: {
      userId: user?.id,
      groupBook: {
        groupId: group.id,
      },
    },
  });

  const isMember = group.members.some(
    (m) => m.userId === user?.id && m.role === GroupMemberRole.MEMBER
  );

  const activeMembers = group.members.filter(
    (m) =>
      m.user.books.filter((b) => b.groupBook?.groupId === group.id).length > 0
  );

  const activeBooks = group.groupBooks.filter(
    (b) => b.book.length === group.members.length
  );

  const stats = [
    {
      title: "Активных пользователей",
      description: "Участников, добавивших себе книги",
      value: activeMembers.length,
      max: group.members.length,
    },
    {
      title: "Активных книг",
      description: "Книг, которые сохранили все участники",
      value: activeBooks.length,
      max: group.groupBooks.length,
    },
  ];

  const allBooks = group.groupBooks.map((b) => b.book).flat();

  let rating: { [key: string]: number } = {};

  group.members.forEach(
    (m) =>
      (rating[m.user.id] = allBooks
        .filter((b) => b.userId === m.user.id)
        .map((book) => book.readEvents[0]?.pagesRead || 0)
        .reduce((a, b) => a + b, 0))
  );

  const users = Object.keys(rating);

  const ratingKeys =
    typeof users.toSorted === "function"
      ? users.toSorted((a, b) => rating[b] - rating[a])
      : users;

  return (
    <div className="p-2 max-sm:mb-20">
      <div className="flex flex-col">
        <div className="text-3xl font-bold">
          <div>{group.title}</div>
        </div>
        <div className="text-muted-foreground/70 flex text-sm gap-1">
          <div>
            {group.groupBooks.length}{" "}
            {declOfNum(group.groupBooks.length, ["книга", "книги", "книг"])}
          </div>
          •
          <div>
            {group.members.length}{" "}
            {declOfNum(group.members.length, [
              "участник",
              "участника",
              "участников",
            ])}
          </div>
        </div>
      </div>
      <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2">
        <div className="p-4 rounded-xl border border-muted">
          <div className="flex items-center text-sm gap-1 text-black/70 dark:text-white/70">
            <Book className="w-4 h-4" />
            <div>Книги</div>
            <AddBookButton groupId={group.id} />
          </div>
          {group.groupBooks.map((book) => (
            <GroupBookView
              groupBook={book}
              key={book.id}
              ownedBooks={myBooksFromGroup}
              isMember={isMember}
              userId={user.id}
            />
          ))}
        </div>
        <div className="p-4 rounded-xl border border-muted">
          <div className="flex items-center text-sm gap-1 text-black/70 dark:text-white/70">
            <Users className="w-4 h-4" />
            <div>Участники</div>
            <AddMemberButton
              group={group}
              isMember={group.members.some(
                (m) =>
                  m.userId === user?.id && m.role === GroupMemberRole.MEMBER
              )}
            />
          </div>
          {group.members.map((member) => (
            <Link
              href={`/profile/${member.user.username}`}
              key={member.id}
              className="flex gap-2 items-center mt-2 p-2 rounded-xl hover:bg-muted transition-all"
            >
              <Image
                src={member.user.avatarUrl || "/no-avatar.png"}
                alt="user"
                width={500}
                height={500}
                className="rounded-md h-8 w-auto"
              />
              <div className="flex flex-col">
                <div className="font-bold">
                  {member.user.firstName} {member.user.lastName}
                </div>
                <div className="text-muted-foreground/70 text-sm">
                  @{member.user.username}
                </div>
              </div>
              <div className="ml-auto flex gap-1">
                {member.userId === user?.id && <User className="w-4 h-4" />}
                {member.role === GroupMemberRole.MODERATOR && (
                  <Shield className="w-4 h-4 text-blue-500" />
                )}
                {member.role === GroupMemberRole.CREATOR && (
                  <Crown className="w-4 h-4 text-yellow-500" />
                )}
              </div>
            </Link>
          ))}
        </div>
        <div className="p-4 rounded-xl border border-muted">
          <div className="flex items-center text-sm gap-1 text-black/70 dark:text-white/70">
            <BarChartHorizontalBig className="w-4 h-4" />
            <div>Статистика</div>
          </div>
          {stats.map((stat) => (
            <div className="flex flex-col gap-2 mt-2" key={stat.title}>
              <div className="flex justify-between">
                <div className="flex flex-col">
                  <div className="text-xl">{stat.title}</div>
                  <div className="text-muted-foreground/70 text-sm">
                    {stat.description}
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <div className="text-xl font-bold">
                    {((stat.value / stat.max) * 100).toFixed(1)}%
                  </div>
                  <div className="text-muted-foreground/70 text-sm">
                    {stat.value}/{stat.max}
                  </div>
                </div>
              </div>
              <Progress value={(stat.value / stat.max) * 100} />
            </div>
          ))}
        </div>
        <div className="p-4 rounded-xl border border-muted">
          <div className="flex items-center text-sm gap-1 text-black/70 dark:text-white/70">
            <BarChart2 className="w-4 h-4" />
            <div>Рейтинг</div>
          </div>
          <div className="flex flex-col mt-2">
            {ratingKeys.map((userId, i) => (
              <Link
                key={userId}
                href={`/profile/${
                  group.members.find((m) => m.userId === userId)?.user.username
                }`}
              >
                <div className="flex items-center p-2 hover:bg-black/10 dark:hover:bg-white/10 rounded-md transition-all gap-2">
                  <div className="rounded-full flex w-6 h-6 items-center justify-center border border-black/50 dark:border-white/50">
                    {i + 1}
                  </div>
                  {
                    group.members.find((m) => m.userId === userId)?.user
                      .username
                  }
                  <div className="font-bold ml-auto">{rating[userId]}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
