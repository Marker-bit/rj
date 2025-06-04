import { db } from "@/lib/db";
import { validateRequest } from "@/lib/server-validate-request";
import { differenceInDays } from "date-fns";
import { ReactNode } from "react";

export default async function OldUsers({ children }: { children: ReactNode }) {
  const { user } = await validateRequest();
  if (!user) return null;
  const userDb = await db.user.findUniqueOrThrow({
    where: {
      id: user?.id,
    },
  });

  const dayDiff = differenceInDays(new Date(), userDb.registeredAt);

  return dayDiff > 5 ? <>{children}</> : <></>;
}
