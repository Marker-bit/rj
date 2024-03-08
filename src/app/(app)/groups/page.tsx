import { db } from "@/lib/db";
import { validateRequest } from "@/lib/server-validate-request";
import { GroupMemberRole } from "@prisma/client";

export default async function Page() {
  const { user } = await validateRequest();
  const groups = await db.group.findMany({
    where: {
      members: {
        some: {
          userId: user?.id,
          role: GroupMemberRole.CREATOR,
        },
      },
    },
  });
  return <div></div>;
}
