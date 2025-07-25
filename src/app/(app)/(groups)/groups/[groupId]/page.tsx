import { Progress } from "@/components/ui/progress";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { db } from "@/lib/db";
import { validateRequest } from "@/lib/server-validate-request";
import { declOfNum } from "@/lib/utils";
import { GroupMemberRole } from "@prisma/client";
import {
  BadgeCheck,
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
import { DeleteGroupButton } from "./delete-group-button";
import { LeaveGroupButton } from "./leave-group-button";
import { LinkMemberButton } from "./link-member-button";
import { MemberActions } from "./member-actions";
import { AddGroupButton } from "../add-group-button";
import Books from "./books";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const dynamic = "force-dynamic";

export default async function Page(props: {
  params: Promise<{ groupId: string }>;
}) {
  const params = await props.params;
  const { user } = await validateRequest();
  if (!user) {
    return null;
  }
  const group = await db.group.findUnique({
    where: { id: params.groupId, members: { some: { userId: user.id } } },
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
      suggestions: true,
      inviteLinks: true,
    },
  });
  if (!group) {
    return (
      <div className="flex flex-col items-center p-4">
        <p className="text-6xl font-black">404</p>
        <p>Группа не найдена, или вы не состоите в ней.</p>
      </div>
    );
  }
  const allGroups = await db.group.findMany({
    where: { members: { some: { userId: user.id } } },
  });
  const myBooksFromGroup = await db.book.findMany({
    where: {
      userId: user?.id,
      groupBook: {
        groupId: group.id,
      },
    },
    include: {
      readEvents: {
        orderBy: { readAt: "desc" },
      },
    },
  });

  const isMember = group.members.some(
    (m) => m.userId === user?.id && m.role === GroupMemberRole.MEMBER,
  );

  const activeMembers = group.members.filter(
    (m) =>
      m.user.books.filter((b) => b.groupBook?.groupId === group.id).length > 0,
  );

  const activeBooks = group.groupBooks.filter(
    (b) => b.book.length === group.members.length,
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

  let ratingDict: { [key: string]: number } = {};

  group.members.forEach(
    (m) =>
      (ratingDict[m.user.id] = allBooks
        .filter((b) => b.userId === m.user.id)
        .map((book) => book.readEvents[0]?.pagesRead || 0)
        .reduce((a, b) => a + b, 0)),
  );

  const ratingKeys = new Array(...Object.keys(ratingDict));

  ratingKeys.sort((a, b) => ratingDict[b] - ratingDict[a]);

  const rating = ratingKeys.map(
    (key) => group.members.find((m) => m.user.id === key)!,
  );

  const currentMember = group.members.find((m) => m.userId === user?.id);

  const fullyReadBooks = myBooksFromGroup.filter((b) =>
    b.readEvents.find((r) => r.pagesRead === b.pages),
  );

  return (
    <div className="p-2 max-sm:mb-[15vh]">
      <div className="flex items-center">
        <div className="flex flex-col">
          <div className="text-3xl font-bold">
            <div>{group.title}</div>
          </div>
          <div className="flex gap-1 text-sm text-muted-foreground/70">
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
            •
            <div>
              {myBooksFromGroup.length}{" "}
              {declOfNum(myBooksFromGroup.length, [
                "книга сохранена",
                "книги сохранены",
                "книг сохранено",
              ])}
            </div>
            •
            <div>
              {fullyReadBooks.length}{" "}
              {declOfNum(fullyReadBooks.length, [
                "полностью прочитана",
                "полностью прочитаны",
                "полностью прочитано",
              ])}
            </div>
          </div>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <LeaveGroupButton groupId={group.id} />
            </TooltipTrigger>
            <TooltipContent>Выйти из группы</TooltipContent>
          </Tooltip>
          {group.members.find((m) => m.userId === user.id)?.role ===
            GroupMemberRole.CREATOR && (
            <Tooltip>
              <TooltipTrigger asChild>
                <DeleteGroupButton groupId={group.id} />
              </TooltipTrigger>
              <TooltipContent>Удалить группу</TooltipContent>
            </Tooltip>
          )}
          {allGroups.length === 1 && <AddGroupButton />}
        </div>
      </div>
      <div className="mt-2 grid grid-cols-1 gap-2 md:grid-cols-2">
        <Books isMember={isMember} group={group} userId={user.id} />
        <div className="rounded-xl border p-4">
          <div className="flex items-center gap-1 text-sm text-black/70 dark:text-white/70">
            <Users className="size-4" />
            <div>Участники</div>
            <div className="ml-auto flex items-center gap-2">
              <AddMemberButton group={group} isMember={isMember} />
              <LinkMemberButton group={group} isMember={isMember} />
            </div>
          </div>
          <ScrollArea className="h-[40vh]">
            {group.members.map((member) => (
              <div
                className="mt-2 flex items-center gap-2 rounded-xl p-2 transition-all"
                key={member.id}
              >
                <Link
                  href={`/profile/${member.user.username}`}
                  key={member.id}
                  className="flex items-center gap-2 rounded-xl p-2 transition-all hover:bg-muted"
                >
                  <Avatar>
                    <AvatarImage src={member.user?.avatarUrl} />
                    <AvatarFallback>
                      {member.user?.firstName && member.user?.firstName[0]}
                      {member.user?.lastName && member.user?.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2 font-bold">
                      {member.user.firstName} {member.user.lastName}
                      {member.user.verified && (
                        <BadgeCheck className="size-4 text-yellow-500" />
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground/70">
                      @{member.user.username}
                    </div>
                  </div>
                </Link>
                <div className="ml-auto flex items-center gap-1">
                  {member.userId === user?.id && <User className="size-4" />}
                  {member.role === GroupMemberRole.MODERATOR && (
                    <Shield className="size-4 text-blue-500" />
                  )}
                  {member.role === GroupMemberRole.CREATOR && (
                    <Crown className="size-4 text-yellow-500" />
                  )}
                  {member.userId !== user?.id && currentMember && (
                    <MemberActions
                      member={member}
                      groupId={group.id}
                      role={currentMember.role}
                    />
                  )}
                </div>
              </div>
            ))}
          </ScrollArea>
        </div>
        <div className="rounded-xl border p-4">
          <div className="flex items-center gap-1 text-sm text-black/70 dark:text-white/70">
            <BarChartHorizontalBig className="size-4" />
            <div>Статистика</div>
          </div>
          {stats.map((stat) => (
            <div className="mt-2 flex flex-col gap-2" key={stat.title}>
              <div className="flex justify-between">
                <div className="flex flex-col">
                  <div className="text-xl">{stat.title}</div>
                  <div className="text-sm text-muted-foreground/70">
                    {stat.description}
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <div className="text-xl font-bold">
                    {(stat.max === 0
                      ? 0
                      : (stat.value / stat.max) * 100
                    ).toFixed(1)}
                    %
                  </div>
                  <div className="text-sm text-muted-foreground/70">
                    {stat.value}/{stat.max}
                  </div>
                </div>
              </div>
              <Progress value={(stat.value / stat.max) * 100} />
            </div>
          ))}
        </div>
        <div className="rounded-xl border p-4">
          <div className="flex items-center gap-1 text-sm text-black/70 dark:text-white/70">
            <BarChart2 className="size-4" />
            <div>Рейтинг</div>
          </div>
          <ScrollArea className="mt-2 flex h-[40vh] flex-col">
            {rating.map((member, i) => (
              <Link
                key={member.userId}
                href={`/groups/${group.id}/members/${member.id}`}
              >
                <div className="flex items-center gap-2 rounded-md p-2 transition-all hover:bg-black/10 dark:hover:bg-white/10">
                  <div className="relative">
                    <Avatar>
                      <AvatarImage src={member.user?.avatarUrl} />
                      <AvatarFallback>
                        {member.user?.firstName && member.user?.firstName[0]}
                        {member.user?.lastName && member.user?.lastName[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute bottom-0 right-0 flex size-4 translate-x-1/2 translate-y-1/2 items-center justify-center rounded-full border bg-white text-xs dark:bg-black">
                      {i + 1}
                    </div>
                  </div>
                  {/* <div className="flex size-6 items-center justify-center rounded-full border">
                    {i + 1}
                  </div> */}
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2 font-bold">
                      {member.user.firstName} {member.user.lastName}
                      {member.user.verified && (
                        <BadgeCheck className="size-4 text-yellow-500" />
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground/70">
                      @{member.user.username}
                    </div>
                  </div>

                  <div className="ml-auto flex flex-col items-end">
                    <div className="font-bold">{ratingDict[member.userId]}</div>
                    <div className="text-sm text-muted-foreground">
                      {
                        group.groupBooks.filter((groupBook) =>
                          groupBook.book.find(
                            (book) =>
                              book.userId === member.userId &&
                              book.readEvents[0]?.pagesRead === book.pages,
                          ),
                        ).length
                      }{" "}
                      / {group.groupBooks.length}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}
