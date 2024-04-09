import { db } from "@/lib/db";
import { validateRequest } from "@/lib/server-validate-request";
import { declOfNum } from "@/lib/utils";
import { GroupMemberRole } from "@prisma/client";
import { Book, Crown, Shield, User, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { AddBookButton } from "./add-book-button";
import { AddMemberButton } from "./add-member-button";
import { GroupBookView } from "./book-view";

export default async function Page({
  params,
}: {
  params: { groupId: string };
}) {
  const { user } = await validateRequest();
  const group = await db.group.findUnique({
    where: { id: params.groupId },
    include: {
      groupBooks: {
        include: {
          group: true
        }
      },
      members: {
        include: {
          user: true,
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

  return (
    <div className="p-2">
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
        <div className="p-2 rounded-xl border border-muted">
          <div className="flex items-center text-sm gap-1 text-black/70 dark:text-white/70">
            <Book className="w-4 h-4" />
            <div>Книги</div>
            <AddBookButton groupId={group.id} />
          </div>
          {group.groupBooks.map((book) => (
            <GroupBookView groupBook={book} key={book.id} ownedBooks={myBooksFromGroup} isMember={isMember} />
          ))}
        </div>
        <div className="p-2 rounded-xl border border-muted">
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
              className="flex gap-2 items-center p-2 rounded-xl hover:bg-muted transition-all"
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
      </div>
    </div>
  );
}
