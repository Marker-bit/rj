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
      <NavBar events={events} />
      <div className="w-full overflow-auto">{children}</div>
    </div>
  );
}
