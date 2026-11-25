import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FriendView } from "@/components/users/friend-view";
import { Stats } from "@/components/users/stats";
import { db } from "@/lib/db";
import { publicUserSelect } from "@/lib/user-select";

const PEOPLE_PER_PAGE = 8;

export type ProfileSearchParams = Promise<{
  view?: string | string[];
  page?: string | string[];
}>;

export async function ProfileSections({
  userId,
  basePath,
  searchParams,
  canSeeStats,
  subscriptionCount,
  followerCount,
}: {
  userId: string;
  basePath: string;
  searchParams: ProfileSearchParams;
  canSeeStats: boolean;
  subscriptionCount?: number;
  followerCount?: number;
}) {
  const { view, page } = await searchParams;
  const canSeeSubscriptions = subscriptionCount !== undefined;
  const canSeeFollowers = followerCount !== undefined;
  const subscriptions = view === "subscriptions" && canSeeSubscriptions;
  const followers = view === "followers" && canSeeFollowers;
  const peopleView = subscriptions
    ? "subscriptions"
    : followers
      ? "followers"
      : null;
  const peopleHref = (kind: "subscriptions" | "followers", number = 1) =>
    `${basePath}?view=${kind}&page=${number}`;
  const requestedPage =
    typeof page === "string" && /^\d+$/.test(page) ? Number(page) : 1;
  const peopleCount = subscriptions ? subscriptionCount : followerCount;
  const totalPages = Math.max(
    1,
    Math.ceil((peopleCount ?? 0) / PEOPLE_PER_PAGE),
  );
  const currentPage = Math.max(1, Math.min(requestedPage, totalPages));
  const listWindow = {
    orderBy: { id: "asc" },
    skip: (currentPage - 1) * PEOPLE_PER_PAGE,
    take: PEOPLE_PER_PAGE,
  } satisfies Pick<
    NonNullable<Parameters<typeof db.follow.findMany>[0]>,
    "orderBy" | "skip" | "take"
  >;
  const people = subscriptions
    ? (
        await db.follow.findMany({
          ...listWindow,
          where: { firstId: userId },
          select: { second: { select: publicUserSelect } },
        })
      ).map(({ second }) => second)
    : followers
      ? (
          await db.follow.findMany({
            ...listWindow,
            where: { secondId: userId },
            select: { first: { select: publicUserSelect } },
          })
        ).map(({ first }) => first)
      : [];

  const [events, books] =
    canSeeStats && !peopleView
      ? await Promise.all([
          db.readEvent.findMany({
            where: { book: { userId } },
            include: { book: true },
            orderBy: { readAt: "asc" },
          }),
          db.book.findMany({
            where: { userId },
            include: { readEvents: { orderBy: { readAt: "desc" } } },
          }),
        ])
      : [[], []];

  return (
    <div className="flex min-w-0 flex-col gap-4">
      {(canSeeSubscriptions || canSeeFollowers) && (
        <nav
          aria-label="Разделы профиля"
          className="flex flex-wrap gap-2 border-b pb-3"
        >
          <Button asChild variant={peopleView ? "ghost" : "secondary"}>
            <Link
              href={basePath}
              aria-current={!peopleView ? "page" : undefined}
            >
              Обзор
            </Link>
          </Button>
          {canSeeSubscriptions && (
            <Button asChild variant={subscriptions ? "secondary" : "ghost"}>
              <Link
                href={peopleHref("subscriptions")}
                aria-current={subscriptions ? "page" : undefined}
              >
                Подписки
              </Link>
            </Button>
          )}
          {canSeeFollowers && (
            <Button asChild variant={followers ? "secondary" : "ghost"}>
              <Link
                href={peopleHref("followers")}
                aria-current={followers ? "page" : undefined}
              >
                Подписчики
              </Link>
            </Button>
          )}
        </nav>
      )}
      {peopleView ? (
        <section className="flex flex-col gap-3">
          <h2 className="text-2xl font-semibold">
            {subscriptions ? "Подписки" : "Подписчики"}
          </h2>
          {people.map((friend) => (
            <FriendView key={friend.id} friend={friend} />
          ))}
          {people.length === 0 && (
            <p className="text-muted-foreground">
              {subscriptions ? "Пока нет подписок" : "Пока нет подписчиков"}
            </p>
          )}
          {totalPages > 1 && (
            <nav
              aria-label="Страницы списка"
              className="flex flex-wrap items-center gap-3"
            >
              <Button
                asChild={currentPage > 1}
                disabled={currentPage === 1}
                variant="outline"
              >
                {currentPage > 1 ? (
                  <Link href={peopleHref(peopleView, currentPage - 1)}>
                    Назад
                  </Link>
                ) : (
                  "Назад"
                )}
              </Button>
              <span className="text-sm text-muted-foreground">
                {currentPage} из {totalPages}
              </span>
              <Button
                asChild={currentPage < totalPages}
                disabled={currentPage === totalPages}
                variant="outline"
              >
                {currentPage < totalPages ? (
                  <Link href={peopleHref(peopleView, currentPage + 1)}>
                    Далее
                  </Link>
                ) : (
                  "Далее"
                )}
              </Button>
            </nav>
          )}
        </section>
      ) : (
        canSeeStats && (
          <section className="min-w-0">
            <h2 className="mb-3 text-xl font-semibold">Статистика</h2>
            <Stats
              subscriptionCount={subscriptionCount}
              followerCount={followerCount}
              subscriptionHref={
                canSeeSubscriptions ? peopleHref("subscriptions") : undefined
              }
              followerHref={
                canSeeFollowers ? peopleHref("followers") : undefined
              }
              events={events}
              books={books}
            />
          </section>
        )
      )}
    </div>
  );
}
