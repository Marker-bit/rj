import type { Book, ReadEvent } from "@/generated/prisma/client";
import { Users } from "lucide-react";
import Link from "next/link";
import type { ReactElement } from "react";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/require-user";
import { publicUserSelect } from "@/lib/user-select";
import type { PublicUser } from "@/lib/user-types";
import Event from "./event";
import EventRepeat from "./event-repeat";
import Pagination from "./pagination";

export default async function Page(props: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const user = await requireUser();
  let page = searchParams?.page ? parseInt(searchParams.page as string, 10) : 1;
  const pageSize = 20;
  if (page < 1) {
    page = 1;
  }
  const fullCount = await db.readEvent.count({
    where: {
      book: {
        user: {
          follower: {
            some: {
              second: {
                id: user.id,
              },
            },
          },
          hideActivity: false,
        },
      },
    },
  });
  const totalPages = Math.ceil(fullCount / pageSize);
  if (page > totalPages) {
    page = totalPages;
  }
  const activity =
    page === 0
      ? []
      : await db.readEvent.findMany({
          where: {
            book: {
              user: {
                follower: {
                  some: {
                    second: {
                      id: user.id,
                    },
                  },
                },
                hideActivity: false,
              },
            },
          },
          include: {
            book: {
              include: {
                user: { select: publicUserSelect },
              },
            },
          },
          orderBy: {
            readAt: "desc",
          },
          skip: (page - 1) * pageSize,
          take: pageSize,
        });
  const components: ReactElement<any>[] = [];
  let tempArray: (ReadEvent & { book: Book & { user: PublicUser } })[] = [];

  activity.forEach((event, index) => {
    tempArray.push(event);
    // Check if the current event's type does not match the next event's type or if it's the last event
    if (
      index === activity.length - 1 ||
      event.bookId !== activity[index + 1].bookId
    ) {
      if (tempArray.length > 1) {
        components.push(<EventRepeat key={event.id} events={tempArray} />);
      } else {
        components.push(<Event key={event.id} event={tempArray[0]} />);
      }
      tempArray = []; // Reset tempArray for the next sequence
    }
  });

  if (page === 0) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Users />
          </EmptyMedia>
          <EmptyTitle>Пока здесь пусто</EmptyTitle>
          <EmptyDescription>
            Активность появится, когда вы подпишетесь на читателей.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button asChild variant="outline">
            <Link href="/groups">Найти читателей в группах</Link>
          </Button>
        </EmptyContent>
      </Empty>
    );
  }

  return (
    <div className="mb-[15vh] flex flex-col gap-2 p-2">
      {/* {activity.map((event) => (
        <Event key={event.id} event={event} />
      ))} */}
      {components}
      <Pagination currentPage={page} totalPages={totalPages} />
    </div>
  );
}
