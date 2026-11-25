"use client";

import {
  BookCheck,
  BookOpen,
  CalendarRange,
  Users2,
  UsersIcon,
} from "lucide-react";
import Link from "next/link";
import { useReadingStats } from "@/components/main/streak-context";
import { Card } from "@/components/ui/card";
import type { StreakEvent } from "@/lib/stats";

function StatRow({
  icon: Icon,
  label,
  value,
  href,
}: {
  icon: typeof BookOpen;
  label: string;
  value: number | undefined;
  href?: string;
}) {
  const row = (
    <>
      <Icon
        aria-hidden="true"
        className="size-4 shrink-0 text-muted-foreground"
      />
      <span className="flex-1">{label}</span>
      <span className="font-semibold tabular-nums">{value ?? "—"}</span>
    </>
  );
  const className = "flex min-h-10 items-center gap-3 px-4 py-2 text-sm";

  return (
    <li>
      {href ? (
        <Link
          href={href}
          className={`${className} transition-colors hover:bg-muted focus-visible:bg-muted`}
        >
          {row}
        </Link>
      ) : (
        <div className={className}>{row}</div>
      )}
    </li>
  );
}

export function Stats({
  subscriptionCount,
  followerCount,
  events,
  booksRead,
  subscriptionHref,
  followerHref,
}: {
  subscriptionCount?: number;
  followerCount?: number;
  events: StreakEvent[];
  booksRead: number;
  subscriptionHref?: string;
  followerHref?: string;
}) {
  const stats = useReadingStats(events);
  const pagesThisWeek = stats
    ?.week()
    .reduce((total, day) => total + day.pagesRead, 0);
  return (
    <Card id="stats" className="py-0">
      <ul className="divide-y">
        <StatRow
          icon={CalendarRange}
          label="Дней чтения подряд"
          value={stats?.streak}
        />
        <StatRow
          icon={BookOpen}
          label="Страниц за неделю"
          value={pagesThisWeek}
        />
        <StatRow icon={BookCheck} label="Прочитано книг" value={booksRead} />
        {subscriptionCount !== undefined && (
          <StatRow
            icon={Users2}
            label="Подписки"
            value={subscriptionCount}
            href={subscriptionHref}
          />
        )}
        {followerCount !== undefined && (
          <StatRow
            icon={UsersIcon}
            label="Подписчики"
            value={followerCount}
            href={followerHref}
          />
        )}
      </ul>
    </Card>
  );
}
