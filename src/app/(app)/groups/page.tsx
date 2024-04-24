import { db } from "@/lib/db";
import { validateRequest } from "@/lib/server-validate-request";
import { AddGroupButton } from "./add-group-button";
import { declOfNum } from "@/lib/utils";
import Link from "next/link";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function Page() {
  const { user } = await validateRequest();
  const groups = await db.group.findMany({
    where: {
      members: {
        some: {
          userId: user?.id,
        },
      },
    },
    include: {
      members: true,
      groupBooks: true,
    },
  });

  if (groups.length === 1) {
    return redirect(`/groups/${groups[0].id}`);
  }

  return (
    <div className="flex flex-col">
      <div className="flex gap-2 text-3xl font-bold items-center m-2">
        <div>Группы чтения</div>
        <div className="ml-auto">
          <AddGroupButton />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 m-2">
        {groups.map((g) => (
          <Link href={`/groups/${g.id}`} key={g.id}>
            <div
              key={g.id}
              className="rounded-xl p-2 border flex flex-col gap-1"
            >
              <div>{g.title}</div>
              <div className="flex gap-1 text-muted-foreground/70 text-sm">
                <div>
                  {g.groupBooks.length}{" "}
                  {declOfNum(g.groupBooks.length, ["книга", "книги", "книг"])}
                </div>
                •
                <div>
                  {g.members.length}{" "}
                  {declOfNum(g.members.length, [
                    "участник",
                    "участника",
                    "участников",
                  ])}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
