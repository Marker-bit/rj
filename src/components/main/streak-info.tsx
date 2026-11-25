"use client";

import { useReadingStats, useStreakEvents } from "./streak-context";
import StreakBlock from "./streak-block";

export function StreakInfo() {
  const events = useStreakEvents();
  const stats = useReadingStats(events);
  return stats ? <StreakBlock stats={stats} /> : <div className="min-h-60" />;
}
