import { Progress } from "@/components/ui/progress";
import { db } from "@/lib/db";
import { validateRequest } from "@/lib/server-validate-request";
import { BarChartHorizontalBig } from "lucide-react";
import Image from "next/image";

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
      members: true,
    },
  });
  if (!group) {
    return null;
  }

  const book = await db.groupBook.findUnique({
    where: { id: params.bookId, groupId: params.groupId },
    include: {
      group: true,
      book: true,
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
          <div className="text-muted-foreground/90 text-sm">
            {book.author}
          </div>
          <div className="text-muted-foreground/90 text-sm">
            {book.pages} стр.
          </div>
          <p className="text-muted-foreground/90 text-sm">
            {book.description}
          </p>
        </div>
      </div>

      <div className="w-full min-h-[20vh] bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl p-4 mt-2">
        <div className="flex gap-2 items-center text-muted-foreground/90">
          <BarChartHorizontalBig className="w-4 h-4" />
          Статистика
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
                  {(stat.value / stat.max) * 100}%
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
    </div>
  );
}
