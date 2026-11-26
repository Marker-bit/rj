import { z } from "zod";
import type { Prisma } from "@/generated/prisma/client";
import { db } from "@/lib/db";

const pageSize = 25;
const instant = z.iso.datetime({ precision: 3 });
const cursorSchema = z.object({
  readAt: instant,
  id: z.string().min(1).max(128),
});

const pageParams = z
  .object({
    from: instant.optional(),
    until: instant.optional(),
    cursor: cursorSchema.optional(),
  })
  .refine(({ from, until }) => !from || !until || from < until);

export function parseJournalPageParams(params: URLSearchParams) {
  const readAt = params.get("cursorReadAt");
  const id = params.get("cursorId");
  return pageParams.safeParse({
    from: params.get("from") ?? undefined,
    until: params.get("until") ?? undefined,
    cursor: readAt === null && id === null ? undefined : { readAt, id },
  });
}

const rowSelect = {
  id: true,
  bookId: true,
  readAt: true,
  pagesRead: true,
  book: { select: { title: true, author: true, pages: true } },
} satisfies Prisma.ReadEventSelect;

export async function getJournalPage(
  userId: string,
  { from, until, cursor }: z.infer<typeof pageParams>,
) {
  const owner = { book: { userId } };
  const cursorDate = cursor && new Date(cursor.readAt);
  const rows = await db.readEvent.findMany({
    where: {
      ...owner,
      readAt: {
        gte: from ? new Date(from) : undefined,
        lt: until ? new Date(until) : undefined,
      },
      OR:
        cursor && cursorDate
          ? [
              { readAt: { lt: cursorDate } },
              { readAt: cursorDate, id: { lt: cursor.id } },
            ]
          : undefined,
    },
    orderBy: [{ readAt: "desc" }, { id: "desc" }],
    select: rowSelect,
    take: pageSize + 1,
  });

  const events = rows.slice(0, pageSize).map((row) => ({
    ...row,
    readAt: row.readAt.toISOString(),
  }));
  const last = events.at(-1);
  const nextCursor =
    rows.length > pageSize && last
      ? { readAt: last.readAt, id: last.id }
      : null;

  // An empty page can still belong to a nonempty journal.
  const hasEvents =
    events.length > 0 ||
    Boolean(
      (from || until || cursor) &&
      (await db.readEvent.findFirst({ where: owner, select: { id: true } })),
    );
  return { events, nextCursor, hasEvents };
}

export type JournalPage = Awaited<ReturnType<typeof getJournalPage>>;
export type JournalRow = JournalPage["events"][number];
