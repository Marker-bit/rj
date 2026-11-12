"use client";

import {
  createContext,
  use,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import type { StreakEvent } from "@/lib/stats";

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

const subscribe = () => () => {};

export function useBrowserTimeZone() {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}
