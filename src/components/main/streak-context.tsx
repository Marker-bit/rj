"use client";

import { addDays, startOfDay } from "date-fns";
import {
  createContext,
  use,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { getReadingStats, type StreakEvent } from "@/lib/stats";

const StreakEventsContext = createContext<Promise<StreakEvent[]> | null>(null);

export function StreakEventsProvider({
  events,
  children,
}: {
  events: Promise<StreakEvent[]>;
  children: ReactNode;
}) {
  return <StreakEventsContext value={events}>{children}</StreakEventsContext>;
}

export function useStreakEvents() {
  const events = use(StreakEventsContext);
  if (!events) throw new Error("Missing StreakEventsProvider");
  return use(events);
}

function subscribeToLocalDay(onChange: () => void) {
  let timeout: ReturnType<typeof setTimeout>;

  function refresh() {
    clearTimeout(timeout);
    const now = new Date();
    const nextDay = startOfDay(addDays(now, 1));
    timeout = setTimeout(refresh, nextDay.getTime() - now.getTime());
    onChange();
  }

  refresh();
  window.addEventListener("focus", refresh);
  return () => {
    clearTimeout(timeout);
    window.removeEventListener("focus", refresh);
  };
}

function getLocalDaySnapshot() {
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  return `${timeZone}|${startOfDay(new Date()).getTime()}`;
}

export function useReadingStats(events: readonly StreakEvent[]) {
  const localDay = useSyncExternalStore(
    subscribeToLocalDay,
    getLocalDaySnapshot,
    () => null,
  );

  return useMemo(() => {
    if (localDay === null) return null;
    const [timeZone, dayStart] = localDay.split("|");
    return getReadingStats({
      events,
      timeZone,
      now: new Date(Number(dayStart)),
    });
  }, [events, localDay]);
}
