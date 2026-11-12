"use client";

import { useBrowserTimeZone, useStreakEvents } from "./streak-context";
import StreakBlock from "./streak-block";

export function StreakInfo() {
  const events = useStreakEvents();
  const ready = useBrowserTimeZone();
  return ready ? <StreakBlock events={events} /> : <div className="min-h-60" />;
}
