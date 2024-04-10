import { Progress } from "@/components/ui/progress";
import { db } from "@/lib/db";
import { validateRequest } from "@/lib/server-validate-request";
import { BarChart2, BarChartHorizontalBig } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default async function Page({
  params,
}: {
  params: { groupId: string; bookId: string };
}) {
  const { user } = await validateRequest();
  if (!user) {
    return null;
  }

  const group = await db.group.findUnique({
    where: { id: params.groupId, members: { some: { userId: user.id } } },
    include: {
      members: {
        include: {
          user: true,
        },
      },
      groupBooks: {
        include: {
          book: {
            include: {
              readEvents: {
                orderBy: { readAt: "desc" },
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

  const book = await db.groupBook.findUnique({
    where: { id: params.bookId, groupId: params.groupId },
    include: {
      group: true,
      book: {
        include: {
          user: true,
          readEvents: {
            orderBy: { readAt: "desc" },
          },
        },
      },
    },
  });
  if (!book) {
    return null;
  }

  const stats = [
    {
      title: "Читающих участников",
      description: "Участников, добавивших себе эту книгу",
      value: book.book.length,
      max: group.members.length,
    },
  ];

  let rating: { [key: string]: number } = {};

  group.members.forEach(
    (m) =>
      (rating[m.userId] =
        book.book.find((b) => b.userId === m.userId)?.readEvents[0]
          ?.pagesRead || 0)
  );

  return (
    <div className="p-8 flex flex-col">
      <div className="flex gap-2">
        {book.coverUrl && (
          <Image
            src={book.coverUrl}
            alt="book"
            width={500}
            height={500}
            className="rounded-md h-40 w-auto"
          />
        )}
        <div className="flex flex-col">
          <div className="text-xl font-bold">{book.title}</div>
          <div className="text-muted-foreground/90 text-sm">{book.author}</div>
          <div className="text-muted-foreground/90 text-sm">
            {book.pages} стр.
          </div>
          <p className="text-muted-foreground/90 text-sm">{book.description}</p>
        </div>
      </div>

      <div className="w-full min-h-[20vh] bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl p-4 mt-2">
        <div className="flex gap-2 items-center text-muted-foreground/90">
          <BarChartHorizontalBig className="w-4 h-4" />
          Статистика
        </div>
        <div className="flex flex-col gap-2 mt-2">
          <div className="flex justify-between">
            <div className="flex flex-col">
              <div className="text-xl">Читающих участников</div>
              <div className="text-muted-foreground/70 text-sm">
                Участников, добавивших себе эту книгу
              </div>
            </div>
            <div className="flex flex-col items-end">
              <div className="text-xl font-bold">
                {((book.book.length / group.members.length) * 100).toFixed(1)}%
              </div>
              <div className="text-muted-foreground/70 text-sm">
                {book.book.length}/{group.members.length}
              </div>
            </div>
          </div>
          <Progress value={(book.book.length / group.members.length) * 100} />
        </div>
        <div className="flex flex-col mt-2">
          {Object.entries(rating).map(([userId, pagesRead], i) => (
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
                {group.members.find((m) => m.userId === userId)?.user.username}
                <div className="font-bold ml-auto">{pagesRead}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
