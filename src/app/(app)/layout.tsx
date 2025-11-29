import "@/app/globals.css";
import { Agent } from "@/components/agent/agent";
import { AgentSuspense } from "@/components/agent/agent-suspense";
import NavBar from "@/components/navigation/navbar";
import RecommendationBar from "@/components/navigation/recommendation-bar";
import { db } from "@/lib/db";
import { validateRequest } from "@/lib/server-validate-request";
import { endOfToday, startOfToday } from "date-fns";
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
  });
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
      : [],
  );

  const recommendationsAvailable = validateRequest().then(async ({ user }) => {
    if (!user) {
      return null;
    }

    const res = db.recommendation.findMany({
      where: {
        startsOn: {
          lte: startOfToday(),
        },
        endsOn: {
          gte: startOfToday(),
        },
        published: true,
        createdBooks: {
          none: {
            userId: user.id,
          },
        },
      },
    });
    return res;
  });

  const aiEnabled = validateRequest().then(async ({ user }) => {
    if (!user) {
      return null;
    }

    const res = await db.user.findUniqueOrThrow({
      where: {
        id: user.id,
      },
    });
    return res.aiEnabled;
  });

  return (
    <div>
      <NavBar events={events} auth={auth} />
      <RecommendationBar recommendations={recommendationsAvailable} />
      <div className="w-full overflow-auto">{children}</div>
      <AgentSuspense aiEnabled={aiEnabled} />
    </div>
  );
}
