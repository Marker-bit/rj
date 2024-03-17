import { db } from "@/lib/db";
import { validateRequest } from "@/lib/server-validate-request";
import { AddGroupButton } from "./add-group-button";

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
  });
  return (
    <div className="flex flex-col">
      <div className="flex gap-2 text-3xl font-bold items-center m-2">
        <div>Группы чтения</div>
        <div className="ml-auto">
          <AddGroupButton />
        </div>
      </div>
      {groups.map((g) => (
        <div key={g.id}>{g.title}</div>
      ))}
    </div>
  );
}
