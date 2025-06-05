import "@/app/globals.css";
import NavBar from "@/components/navigation/navbar";
import { db } from "@/lib/db";
import { validateRequest } from "@/lib/server-validate-request";
import React from "react";

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const auth = validateRequest().then(async ({ user }) => {
    if (!user) {
      return { user: null, unread: null };
    }
    const unread = await db.supportAnswer.count({
      where: {
        read: {
          none: {
            userId: user?.id,
          },
        },
        question: {
          fromUserId: user?.id,
        },
      },
    });
    return { user, unread };
  })
  const events = validateRequest().then(({ user }) =>
    user
      ? db.readEvent.findMany({
          where: {
            book: {
              userId: user.id,
            },
          },
          include: {
            book: true,
          },
          orderBy: {
            readAt: "asc",
          },
        })
      : []
  );

  return (
    <div>
      <NavBar events={events} auth={auth} />
      <div className="w-full overflow-auto">{children}</div>
    </div>
  );
}
